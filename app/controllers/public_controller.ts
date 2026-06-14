import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'
import { gradeExamJson } from '#services/openai'
import { buildPsychPrompt } from '#services/exam_prompts'
import PsychTest from '#models/psych_test'
import Candidate from '#models/candidate'
import Stage from '#models/stage'
import Offer from '#models/offer'
import { setStageTx } from '#services/stage_service'

// Lista blanca de puestos en español (espejo del label de ROLE_OPTIONS del frontend).
// Si agregas un puesto nuevo, debe agregarse aquí Y en roleToCode() de
// public_apply_full_controller.ts. PR D (role_thresholds en DB) consolidará
// esta lista en una sola fuente de verdad.
const VALID_ROLES_ES = ['Mesero', 'Capitán', 'Cocinero', 'Barman', 'Chef gerente', 'Subgerente']

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
// Para roles NO-chef devuelve el texto crudo intacto — el whitelist
// VALID_ROLES_ES sigue siendo la fuente de verdad para los otros 5
// puestos. NO toca su comportamiento.
//
// DEUDA: la coexistencia de roleToCode (apply, includes-based) y
// VALID_ROLES_ES + normalizePsychRole (psych, label-based con alias chef)
// es un olor a bug — dos caminos de clasificación distintos. Refactor
// label→roleCode unificado pendiente; ver PRIORIDADES.md.
export function normalizePsychRole(raw: string): string {
  const v = (raw || '').trim()
  if (v.toLowerCase().includes('chef')) return 'Chef gerente'
  return v
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
    return {
      ok: true,
      alreadyTaken: !!test.takenAt,
      test: {
        id: test.id,
        testName: test.testName,
        assignedAt: test.assignedAt,
        takenAt: test.takenAt,
        score: test.score,
        passed: test.passed,
        aiReportJson: test.aiReportJson,
      },
      candidate: {
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        desiredRole: candidate.desiredRole, // ✅
      },
    }
  }

  // POST /api/public/psych-tests/:token/submit
  // body: { answers: any }
  // POST /api/public/psych-tests/:token/submit
  async psychSubmit({ params, request, response }: HttpContext) {
    try {
      const token = String(params.token || '')
      const test = await PsychTest.query().where('access_token', token).first()
      if (!test) return response.notFound({ error: 'Link inválido' })

      if (test.takenAt) {
        return response
          .status(409)
          .send({ error: 'Esta evaluación ya fue completada', alreadyTaken: true })
      }

      const answers = request.input('answers')
      if (!answers) return response.badRequest({ error: 'answers es requerido' })

      // Cargar candidato para construir un prompt rol-específico.
      // Whitelistea desiredRole contra VALID_ROLES_ES — defensa contra prompt
      // injection si el campo dejara de venir de un Select controlado.
      // normalizePsychRole canonicaliza las 3 variantes de chef ("Chef",
      // "Chef gerente", "Chef y Gerente") a "Chef gerente" ANTES del
      // whitelist — espejo del fix Chef0-BE en el flujo apply.
      const candidate = await Candidate.findOrFail(test.candidateId)
      const raw = (candidate.desiredRole || '').trim()
      const normalized = normalizePsychRole(raw)
      const role = VALID_ROLES_ES.includes(normalized) ? normalized : 'Mesero'
      if (raw && !VALID_ROLES_ES.includes(normalized)) {
        logger.warn(
          { candidateId: candidate.id, raw },
          'Unknown desiredRole on psychSubmit, falling back to Mesero'
        )
      }

      // Guardar respuestas SIEMPRE
      test.takenAt = DateTime.now()
      test.answersJson = answers

      let aiReport: any = { note: 'OPENAI_API_KEY no configurada' }
      let score: number | null = null
      let passed: boolean | null = null

      if (process.env.OPENAI_API_KEY) {
        const prompt = buildPsychPrompt(role, answers)
        aiReport = await gradeExamJson(prompt)

        const scoreNum = Number(aiReport?.score ?? NaN)
        if (!Number.isNaN(scoreNum)) {
          score = scoreNum
          passed = scoreNum >= 82
        }
      }

      test.aiReportJson = aiReport
      if (score !== null) test.score = score
      if (passed !== null) test.passed = passed

      await test.save()

      // IMPORTANTE: NO cambiamos etapa aquí.
      return { ok: true, score, passed, aiReport: test.aiReportJson }
    } catch (err: any) {
      console.log('PublicPsychTestsController.submit error:', err?.message || err)
      return response.status(500).send({ error: err?.message || 'Error interno' })
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
