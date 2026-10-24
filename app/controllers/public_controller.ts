import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'
import PsychTest from '#models/psych_test'
import Candidate from '#models/candidate'
import Stage from '#models/stage'
import Offer from '#models/offer'
import { setStageTx } from '#services/stage_service'
import { ROLE_LABEL_ES, resolveRoleCode } from '#services/role_catalog'
import { submitExam } from '#services/exam_submission'
import {
  PUBLIC_DUPLICATE_RESPONSE,
  PUBLIC_SUBMIT_RESPONSE,
  publicExamView,
} from '#services/public_exam_view'

// La lista de puestos válidos vive en role_catalog (ROLE_LABEL_ES). Sólo
// salen labels de ahí, así que el texto libre del candidato nunca llega al
// prompt como nombre de puesto.

// Exportado para test unitario en tests/unit/normalize_psych_role.spec.ts.
// Mantenerlo co-locado con el único call site (psychSubmit en este
// controller) — no es servicio de uso general.
//
// Espejo psych de roleToCode (PR Chef0-BE en public_apply_full_controller.ts):
// las 3 variantes de chef vivas en producción ("Chef gerente", "Chef",
// "Chef y Gerente", incluyendo mayúsculas) canonicalizan a "Chef gerente"
// — el label que VALID_ROLES_ES sí incluye y que el router de
// buildPsychPrompt despacha a buildPromptGuidaraChef. Sin esta
// normalización, "Chef" o "Chef y Gerente" caerían al fallback 'Mesero'
// y se evaluarían con prompt de Mesero (mismo bug de los 16 candidatos
// chef-mal-clasificados que motivó Chef0-BE en el flujo apply).
//
// 2026-07-20 — AMPLIADO A LOS 6 PUESTOS (antes sólo canonicalizaba chef).
//
// Motivo: auditoría de `desired_role` en producción encontró que la comparación
// exacta contra VALID_ROLES_ES mandaba ~159 candidatos (1 de cada 4) al fallback
// 'Mesero'. Los valores reales guardados incluyen "Capitan" (107 candidatos, sin
// acento), "subgerente" (25, minúscula), "Capitán de meseros" (8), "Mesera",
// "Bartender", "Jefe de barra", "Cocinera", "Encargado de cocina". Todos ellos
// contestaban el examen de su puesto pero se calificaban con el prompt de Mesero
// — en silencio, porque el fallback sólo emitía un logger.warn.
//
// Ahora se compara sin acentos, sin mayúsculas y por substring, igual que hace
// el front en ExamRunner.tsx:30 (`v.includes("capit")`). El orden de las reglas
// IMPORTA: "Capitán de meseros" contiene "mesero", "Chef gerente" contiene
// "gerente" y "Sub Gerente" también — por eso se evalúa de más específico a
// más general.
//
// 2026-10-23 — Las reglas viven en role_catalog (fuente única). Se conserva
// la firma: label canónico si se reconoce, texto crudo si no.
export function normalizePsychRole(raw: string): string {
  const code = resolveRoleCode(raw)
  return code ? ROLE_LABEL_ES[code] : (raw || '').trim()
}

/**
 * MVP: sin auth.
 * Tokens = links públicos (no login).
 */
export default class PublicController {
  // POST /api/public/apply  (multipart: fields + file)
  async apply({ request, response }: HttpContext) {
    const body = request.only([
      'firstName',
      'lastName',
      'email',
      'phone',
      'whatsapp',
      'desiredRole',
      'salaryExpectation',
      'desiredWeeklyTips',
      'street',
      'extNumber',
      'intNumber',
      'neighborhood',
      'city',
      'state',
      'postalCode',
      'country',
      'notes',
    ])

    const cv = request.file('file', {
      size: '40mb',
      extnames: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'],
    })
    if (!cv) return response.badRequest({ error: 'CV (file) es obligatorio' })
    if (!cv.isValid) return response.badRequest({ error: cv.errors })

    // crea candidato
    const c = await Candidate.create({
      ...body,
      email: body.email ?? null,
      phone: body.phone ?? null,
      whatsapp: body.whatsapp ?? null,
      desiredRole: body.desiredRole ?? null,
      salaryExpectation: body.salaryExpectation ?? null,
      desiredWeeklyTips: body.desiredWeeklyTips ?? null,
      source: 'public_apply',
    })

    // stage = received
    const stage = await Stage.findByOrFail('code', 'received')
    c.currentStageId = stage.id
    await c.save()

    // Reusar tu endpoint actual de CV: aquí lo más rápido es pedirle al front que llame
    // /api/candidates/:id/cv inmediatamente después.
    // Para MVP: devolvemos candidateId y el front sube el CV a tu endpoint ya existente.
    return { ok: true, candidateId: c.id }
  }

  // GET /api/public/psych-tests/:token
  async psychShow({ params, response }: HttpContext) {
    const token = String(params.token || '')
    const test = await PsychTest.query().where('access_token', token).first()
    if (!test) return response.notFound({ error: 'Link inválido' })

    const candidate = await Candidate.findOrFail(test.candidateId)
    return publicExamView('psych', test, candidate)
  }

  // POST /api/public/psych-tests/:token/submit
  // body: { answers: any }
  // POST /api/public/psych-tests/:token/submit
  async psychSubmit({ params, request, response }: HttpContext) {
    try {
      const token = String(params.token || '')
      const test = await PsychTest.query().where('access_token', token).first()
      if (!test) return response.notFound({ error: 'Link inválido' })

      if (test.takenAt) return response.status(409).send(PUBLIC_DUPLICATE_RESPONSE)

      const answers = request.input('answers')
      if (!answers) return response.badRequest({ error: 'answers es requerido' })

      // 2026-10-23 — Reserva atómica, control de puesto y banco, y falla
      // controlada viven en exam_submission (compartido con el práctico).
      const candidate = await Candidate.findOrFail(test.candidateId)
      const outcome = await submitExam({
        kind: 'psych',
        test,
        candidate,
        answers,
        shownRoleCode: request.input('roleCode') ?? null,
      })
      if (outcome === 'duplicate') return response.status(409).send(PUBLIC_DUPLICATE_RESPONSE)

      // El resultado es para el reclutador, no para el candidato.
      return PUBLIC_SUBMIT_RESPONSE
    } catch (err: any) {
      logger.error({ err: err?.message }, 'PublicController.psychSubmit error')
      return response.status(500).send({ error: 'No pudimos guardar tus respuestas. Intenta de nuevo.' })
    }
  }

  // GET /api/public/offers/:token
  async offerShow({ params, response }: HttpContext) {
    const token = String(params.token || '')
    const offer = await Offer.query().where('public_token', token).first()
    if (!offer) return response.notFound({ error: 'Link inválido' })

    const candidate = await Candidate.findOrFail(offer.candidateId)
    return {
      ok: true,
      offer,
      candidate: {
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
      },
    }
  }

  // POST /api/public/offers/:token/respond  body: { decision: "accept"|"reject" }
  async offerRespond({ params, request, response }: HttpContext) {
    const token = String(params.token || '')
    const offer = await Offer.query().where('public_token', token).first()
    if (!offer) return response.notFound({ error: 'Link inválido' })

    const decision = String(request.input('decision') || '')
    if (!['accept', 'reject'].includes(decision)) {
      return response.badRequest({ error: 'decision debe ser accept|reject' })
    }

    offer.status = decision === 'accept' ? 'accepted' : 'declined'
    offer.respondedAt = DateTime.now()
    offer.respondedIp = request.ip()
    await offer.save()

    // Esto sí cambia etapa (porque ya es decisión final)
    const stageCode = decision === 'accept' ? 'hired' : 'rejected'
    await setStageTx(
      offer.candidateId,
      { stageCode, offerId: offer.id, decision: stageCode, notes: `Oferta ${offer.status}` },
      null
    )

    return { ok: true, status: offer.status }
  }
}
