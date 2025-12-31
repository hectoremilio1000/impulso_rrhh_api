import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { gradeExamJson } from '#services/openai'
import PsychTest from '#models/psych_test'
import Candidate from '#models/candidate'
import Stage from '#models/stage'
import Offer from '#models/offer'
import { setStageTx } from '#services/stage_service'

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

      const answers = request.input('answers')
      if (!answers) return response.badRequest({ error: 'answers es requerido' })

      // Guardar respuestas SIEMPRE
      test.takenAt = DateTime.now()
      test.answersJson = answers

      let aiReport: any = { note: 'OPENAI_API_KEY no configurada' }
      let score: number | null = null
      let passed: boolean | null = null

      if (process.env.OPENAI_API_KEY) {
        const prompt = `
Evalúa un EXAMEN PSICOMÉTRICO para trabajo en restaurante.
Devuelve SOLO JSON válido con esta forma EXACTA:
{
  "score": number,                 // 1 a 10
  "summary": string,
  "strengths": string[],
  "risks": string[],
  "recommendation": string
}

Reglas:
- score de 1 a 10.
- Favorable si score >= 8 (pero esto NO cambia etapa).
- Sin markdown, sin \`\`\`.

ANSWERS:
${JSON.stringify(answers)}
`.trim()

        aiReport = await gradeExamJson(prompt)

        const scoreNum = Number(aiReport?.score ?? NaN)
        if (!Number.isNaN(scoreNum)) {
          score = scoreNum
          passed = scoreNum >= 8
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
