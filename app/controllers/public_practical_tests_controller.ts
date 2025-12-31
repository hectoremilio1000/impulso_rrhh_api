import type { HttpContext } from '@adonisjs/core/http'
import PracticalTest from '#models/practical_test'
import Candidate from '#models/candidate'
import { DateTime } from 'luxon'
import { gradeExamJson } from '#services/openai'

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

    return {
      ok: true,
      candidate: {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        desiredRole: c.desiredRole,
      },
      test: {
        id: test.id,
        roleCode: test.roleCode,
        testName: test.testName,
        assignedAt: test.assignedAt,
        takenAt: test.takenAt,
        score: test.score,
        passed: test.passed,
        aiReportJson: test.aiReportJson,
      },
    }
  }

  async submit({ params, request, response }: HttpContext) {
    try {
      const token = String(params.token || '')
      const test = await PracticalTest.query().where('access_token', token).first()
      if (!test) return response.notFound({ error: 'Link inválido' })

      const answers = request.input('answers')
      if (!answers) return response.badRequest({ error: 'answers es requerido' })

      // Guardar respuestas SIEMPRE (sin importar IA)
      test.takenAt = DateTime.now()
      test.answersJson = answers

      // Calificar con IA (si hay key). Si no hay key, igual guardamos.
      let aiReport: any = { note: 'OPENAI_API_KEY no configurada' }

      if (process.env.OPENAI_API_KEY) {
        const prompt = `
Evalúa un EXAMEN PRÁCTICO para el puesto: ${test.roleCode}.
Devuelve SOLO JSON válido con esta forma EXACTA:
{
  "score": number,                 // 1 a 10
  "passed": boolean,               // true si es favorable
  "summary": string,
  "strengths": string[],
  "risks": string[],
  "recommendation": string
}

Reglas:
- score de 1 a 10.
- passed = true SOLO si score >= 8.
- Sin markdown, sin \`\`\`.

ANSWERS:
${JSON.stringify(answers)}
`.trim()

        aiReport = await gradeExamJson(prompt)

        // Normalizar score/passed si el modelo no los trae perfectos
        const scoreNum = Number(aiReport?.score ?? NaN)
        if (!Number.isNaN(scoreNum)) {
          test.score = scoreNum
          // passed final siempre por regla de negocio
          test.passed = scoreNum >= 8
        } else {
          // si no vino score, fallback
          test.score = null
          test.passed = null
        }
      }

      test.aiReportJson = aiReport

      await test.save()

      return {
        ok: true,
        score: test.score,
        passed: test.passed,
        aiReport: test.aiReportJson,
      }
    } catch (err: any) {
      // Para que no te reviente sin info
      console.log('PublicPracticalTestsController.submit error:', err?.message || err)
      return response.status(500).send({ error: err?.message || 'Error interno' })
    }
  }
}
