import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import PsychTest from '#models/psych_test'
import PracticalTest from '#models/practical_test'
import Candidate from '#models/candidate'
import { makePublicToken } from '#services/public_token'
import { fingerprintAnswers } from '#services/bank_fingerprint'
import { gradeAndSave, testRoleInput } from '#services/exam_submission'
import {
  CURRENT_BANK_FINGERPRINT,
  IMPULSO_INSTRUMENT,
  evaluatedRoleOf,
  toRoleCode,
  type ExamKind,
  type ReviewLogEntry,
} from '#services/role_catalog'

// Salidas operativas de una evaluación en "requiere revisión" (2026-10-23).
// Todas exigen motivo escrito y dejan registro en review_log_json; ninguna
// borra ni reescribe respuestas, y ninguna recalifica en automático.
//
// - reassign: el candidato tiene (o tuvo) el examen equivocado. Se crea una
//   prueba nueva del puesto correcto; la anterior queda como reemplazada,
//   visible en el historial y con su link desactivado.
// - confirmRole: error de identificación ANTES de presentar: el puesto
//   asignado es el correcto aunque el texto del puesto no coincida.
// - gradeReviewed: respuestas guardadas sin calificar (revisión o falla). Se
//   califican con el puesto indicado SÓLO si las preguntas contestadas son el
//   banco vigente de ese puesto (huella). Nunca respuestas de un banco con las
//   etiquetas de otro.

const MIN_REASON = 10
// El admin gate es una llave compartida, sin identidad de usuario todavía.
const ACTOR = 'admin-gate'

function modelFor(kind: ExamKind) {
  return kind === 'psych' ? PsychTest : PracticalTest
}

function parseBody(request: HttpContext['request']) {
  const reason = String(request.input('reason') || '').trim()
  const roleCode = toRoleCode(request.input('roleCode'))
  return { reason, roleCode }
}

function appendLog(test: PsychTest | PracticalTest, entry: ReviewLogEntry) {
  test.reviewLogJson = [...(test.reviewLogJson || []), entry]
}

export default class EvaluationReviewsController {
  private kindFrom(request: HttpContext['request']): ExamKind {
    return request.url().includes('/practical-tests/') ? 'practical' : 'psych'
  }

  // POST /api/{psych,practical}-tests/:id/reassign  { roleCode, reason }
  async reassign({ params, request, response }: HttpContext) {
    const kind = this.kindFrom(request)
    const { reason, roleCode } = parseBody(request)
    if (!roleCode) return response.badRequest({ error: 'roleCode válido es requerido' })
    if (reason.length < MIN_REASON) return response.badRequest({ error: 'Escribe el motivo (mínimo 10 caracteres)' })

    const Model = modelFor(kind)
    const old = await Model.find(Number(params.id))
    if (!old) return response.notFound({ error: 'Prueba no encontrada' })
    if (old.supersededById) return response.conflict({ error: 'Esta prueba ya fue reemplazada' })

    const created = await db.transaction(async (trx) => {
      const base = {
        candidateId: old.candidateId,
        testName: `${kind === 'psych' ? 'PSYCH' : 'PRACTICAL'}_${roleCode.toUpperCase()}_V1`,
        roleCode,
        instrument: IMPULSO_INSTRUMENT[kind],
        assignedAt: DateTime.now(),
        accessToken: makePublicToken(),
      }
      const fresh =
        kind === 'psych'
          ? await PsychTest.create(base as any, { client: trx })
          : await PracticalTest.create(base as any, { client: trx })
      old.useTransaction(trx)
      old.supersededById = fresh.id
      // El link viejo deja de abrir el examen; las respuestas, si las hay, quedan.
      old.accessToken = null
      appendLog(old, {
        action: 'reassign',
        roleCode,
        reason,
        at: DateTime.now().toISO()!,
        actor: ACTOR,
        newTestId: fresh.id,
      })
      await old.save()
      return fresh
    })
    return { ok: true, newTest: created }
  }

  // POST /api/{psych,practical}-tests/:id/confirm-role  { reason }
  async confirmRole({ params, request, response }: HttpContext) {
    const kind = this.kindFrom(request)
    const { reason } = parseBody(request)
    if (reason.length < MIN_REASON) return response.badRequest({ error: 'Escribe el motivo (mínimo 10 caracteres)' })

    const Model = modelFor(kind)
    const test = await Model.find(Number(params.id))
    if (!test) return response.notFound({ error: 'Prueba no encontrada' })
    if (test.takenAt) {
      return response.conflict({
        error: 'Ya fue presentada: usa "calificar tras revisión" o reasigna el examen.',
      })
    }
    const role = evaluatedRoleOf(kind, testRoleInput(kind, test))
    if (!role) return response.unprocessableEntity({ error: 'No es un examen Impulso' })

    appendLog(test, { action: 'confirm_role', roleCode: role, reason, at: DateTime.now().toISO()!, actor: ACTOR })
    await test.save()
    return { ok: true }
  }

  // POST /api/{psych,practical}-tests/:id/grade-reviewed  { roleCode, reason }
  async gradeReviewed({ params, request, response }: HttpContext) {
    const kind = this.kindFrom(request)
    const { reason, roleCode } = parseBody(request)
    if (!roleCode) return response.badRequest({ error: 'roleCode válido es requerido' })
    if (reason.length < MIN_REASON) return response.badRequest({ error: 'Escribe el motivo (mínimo 10 caracteres)' })

    const Model = modelFor(kind)
    const test = await Model.find(Number(params.id))
    if (!test) return response.notFound({ error: 'Prueba no encontrada' })
    if (!test.takenAt || !test.answersJson) return response.conflict({ error: 'La prueba no tiene respuestas' })
    const fp = fingerprintAnswers(test.answersJson)
    if (fp !== CURRENT_BANK_FINGERPRINT[kind][roleCode]) {
      return response.unprocessableEntity({
        error:
          'Las preguntas contestadas no son el banco vigente de ese puesto. No se califican con otras etiquetas; reasigna el examen.',
        bankFingerprint: fp,
      })
    }

    // Reserva atómica: dos clics simultáneos no califican dos veces. Sólo una
    // llamada cambia el estado de revisión/falla a 'regrading'.
    const table = kind === 'psych' ? 'psych_tests' : 'practical_tests'
    const claimed = await db
      .from(table)
      .where('id', test.id)
      .whereRaw(
        "JSON_UNQUOTE(JSON_EXTRACT(ai_report_json, '$.status')) IN ('role_review_required', 'grading_failed')"
      )
      .update({ ai_report_json: db.knexRawQuery("JSON_SET(ai_report_json, '$.status', 'regrading')") })
    const affected = Array.isArray(claimed) ? Number(claimed[0]) : Number(claimed)
    if (!affected) {
      return response.conflict({
        error: 'Sólo se califican aquí evaluaciones detenidas por revisión o por falla (o ya se está calificando).',
      })
    }
    const previousReport = test.aiReportJson ?? null
    await test.refresh()

    const candidate = await Candidate.findOrFail(test.candidateId)
    appendLog(test, {
      action: 'grade_reviewed',
      roleCode,
      reason,
      at: DateTime.now().toISO()!,
      actor: ACTOR,
      previousReport,
    })
    if (kind === 'psych') (test as PsychTest).roleCode = roleCode
    else (test as PracticalTest).roleCode = roleCode
    test.bankFingerprint = fp
    await gradeAndSave({
      kind,
      test,
      candidate,
      roleCode,
      answers: test.answersJson,
      context: { gradedAfterReview: true, reviewReason: reason },
    })
    return { ok: true, status: test.aiReportJson?.status ?? 'graded' }
  }
}
