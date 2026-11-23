import type { HttpContext } from '@adonisjs/core/http'
import PracticalTest from '#models/practical_test'
import Candidate from '#models/candidate'
import { submitExam } from '#services/exam_submission'
import {
  PUBLIC_DUPLICATE_RESPONSE,
  PUBLIC_SUBMIT_RESPONSE,
  publicExamView,
} from '#services/public_exam_view'

export default class PublicPracticalTestsController {
  async index({ params }: HttpContext) {
    const candidateId = Number(params.id)
    const rows = await PracticalTest.query()
      .where('candidate_id', candidateId)
      .orderBy('id', 'desc')
    return rows
  }
  async show({ params, response }: HttpContext) {
    const token = String(params.token || '')
    const test = await PracticalTest.query().where('access_token', token).first()
    if (!test) return response.notFound({ error: 'Link inválido' })

    const c = await Candidate.findOrFail(test.candidateId)
    return publicExamView('practical', test, c)
  }

  async submit({ params, request, response }: HttpContext) {
    try {
      const token = String(params.token || '')
      const test = await PracticalTest.query().where('access_token', token).first()
      if (!test) return response.notFound({ error: 'Link inválido' })
      // 2026-10-23 — Antes no había este control: un segundo envío pisaba las
      // respuestas y generaba otra calificación.
      if (test.takenAt) return response.status(409).send(PUBLIC_DUPLICATE_RESPONSE)

      const answers = request.input('answers')
      if (!answers) return response.badRequest({ error: 'answers es requerido' })

      const candidate = await Candidate.findOrFail(test.candidateId)
      const outcome = await submitExam({
        kind: 'practical',
        test,
        candidate,
        answers,
        shownRoleCode: request.input('roleCode') ?? null,
      })
      if (outcome === 'duplicate') return response.status(409).send(PUBLIC_DUPLICATE_RESPONSE)

      // El resultado es para el reclutador, no para el candidato.
      return PUBLIC_SUBMIT_RESPONSE
    } catch (err: any) {
      console.log('PublicPracticalTestsController.submit error:', err?.message || err)
      return response.status(500).send({ error: 'No pudimos guardar tus respuestas. Intenta de nuevo.' })
    }
  }
}
