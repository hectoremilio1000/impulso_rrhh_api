// Huella del banco de preguntas con que se contestó una evaluación.
//
// El nombre de la prueba (PSYCH_WAITER_V1) NO identifica el banco: los bancos
// se reescribieron varias veces conservando "V1" (auditoría de solo lectura
// del 2026-10-23: de 686 psicométricos presentados, 437 usaron un banco
// distinto al actual). El etiquetado por eje va por número de pregunta (q1,
// q2…), así que calificar respuestas de un banco con las etiquetas de otro
// mezcla preguntas. La huella se calcula con el texto de las preguntas que se
// guardan junto a cada respuesta.
//
// FNV-1a de 64 bits sobre las preguntas normalizadas y en orden: síncrono e
// idéntico en Node y en el navegador (src/lib/bankFingerprint.ts en el front).

const FNV_OFFSET = 0xcbf29ce484222325n
const FNV_PRIME = 0x100000001b3n
const MASK = 0xffffffffffffffffn

function normalizeQuestion(q: string): string {
  return String(q || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

export function fingerprintQuestions(questions: string[]): string {
  const text = questions.map(normalizeQuestion).join('\n')
  let h = FNV_OFFSET
  for (const byte of new TextEncoder().encode(text)) {
    h ^= BigInt(byte)
    h = (h * FNV_PRIME) & MASK
  }
  return `${questions.length}-${h.toString(16).padStart(16, '0')}`
}

// answers = { q1: { question, answer }, q2: … } → preguntas en orden numérico.
export function questionsFromAnswers(answers: unknown): string[] | null {
  if (!answers || typeof answers !== 'object') return null
  const entries = Object.entries(answers as Record<string, any>)
    .map(([k, v]) => [Number(/^q(\d+)$/.exec(k)?.[1]), v] as const)
    .filter(([n]) => Number.isInteger(n) && n > 0)
    .sort((a, b) => a[0] - b[0])
  if (!entries.length) return null
  if (entries.some(([, v]) => typeof v?.question !== 'string')) return null
  return entries.map(([, v]) => v.question as string)
}

export function fingerprintAnswers(answers: unknown): string | null {
  const qs = questionsFromAnswers(answers)
  return qs ? fingerprintQuestions(qs) : null
}
