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
Evalúa un EXAMEN PRÁCTICO para el puesto: ${test.roleCode} con criterio de RH senior.
Devuelve SOLO JSON válido con esta forma EXACTA:
{
  "score": number,                 // 0 a 100
  "passed": boolean,
  "summary": string,
  "strengths": string[],
  "risks": string[],
  "recommendation": string,
  "competencies": {
    "service_protocol": number,    // 0 a 100
    "customer_communication": number,
    "stress_conflict": number,
    "sales_suggestions": number,
    "teamwork_discipline": number
  }
}

PESOS (total 100):
- service_protocol: 30
- customer_communication: 25
- stress_conflict: 20
- sales_suggestions: 15
- teamwork_discipline: 10

UMBRAL APTO (passed=true):
- score global >= 82
- service_protocol >= 70
- customer_communication >= 70
- ninguna competencia < 55

Reglas obligatorias (prioridad alta):
- Si MÁS de 20% de respuestas están vacías o con menos de 15 palabras, score <= 40 y summary "Respuestas insuficientes".
- Si MENOS de 70% de respuestas incluyen pasos concretos (acción + orden + detalle técnico), score <= 50.
- No inventes información no presente en las respuestas.
- Sin markdown, sin \`\`\`.

Guía de evaluación:
- 90-100: pasos claros, detalle técnico y decisiones correctas.
- 75-89: buenas respuestas con algunos vacíos.
- 55-74: genéricas o poco técnicas.
- <55: insuficientes.

ANSWERS:
${JSON.stringify(answers)}
`.trim()

        aiReport = await gradeExamJson(prompt)

        // Normalizar score/passed si el modelo no los trae perfectos
        const scoreNum = Number(aiReport?.score ?? NaN)
        if (!Number.isNaN(scoreNum)) {
          test.score = scoreNum
          test.passed = scoreNum >= 82
        } else {
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
