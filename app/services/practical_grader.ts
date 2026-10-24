import { gradeExamJson } from '#services/openai'

// Calificación del examen práctico. Movida desde
// public_practical_tests_controller para reutilizarla al calificar tras una
// revisión humana. Sigue siendo la rúbrica GENÉRICA de servicio de piso para
// todos los puestos (pendiente: práctico por puesto).
export const PRACTICAL_GRADING_VERSION = {
  grader: 'practico-generico-piso-v1',
  passThreshold: 82,
} as const

export type PracticalGradeResult = {
  aiReport: any
  score: number | null
  passed: boolean | null
}

export async function gradePracticalExam(
  roleCode: string,
  answers: unknown
): Promise<PracticalGradeResult> {
  if (!process.env.OPENAI_API_KEY) {
    return { aiReport: { note: 'OPENAI_API_KEY no configurada' }, score: null, passed: null }
  }
  const prompt = `
Evalúa un EXAMEN PRÁCTICO para el puesto: ${roleCode} con criterio de RH senior.
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

  const aiReport = await gradeExamJson(prompt)
  const scoreNum = Number(aiReport?.score ?? Number.NaN)
  if (Number.isNaN(scoreNum)) return { aiReport, score: null, passed: null }
  return { aiReport, score: scoreNum, passed: scoreNum >= PRACTICAL_GRADING_VERSION.passThreshold }
}
