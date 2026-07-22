import OpenAI from 'openai'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export const GPT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

function getClient(): OpenAI | null {
  if (!OPENAI_API_KEY) return null
  return new OpenAI({ apiKey: OPENAI_API_KEY })
}

function stripJsonFences(s: string) {
  const m = s.match(/```json\s*([\s\S]*?)\s*```/i)
  return (m ? m[1] : s).trim()
}

// Modelo al que se escala cuando el primero devuelve un reporte incoherente.
// Smoke real 2026-07-20 (candidato 768, 40 respuestas de 41 palabras promedio):
//   · gpt-4o-mini → los 6 ejes en 0 con "respuesta insuficiente para evaluar".
//     Reproducible: a temperature 0 el reintento con el MISMO modelo devuelve
//     exactamente lo mismo, así que reintentar sin escalar no sirve de nada.
//   · gpt-4o      → los 6 ejes con score real y evidence citando frases
//     textuales del candidato. El validador lo aprueba sin degradar.
export const GPT_MODEL_ESCALADO = process.env.OPENAI_MODEL_ESCALADO || 'gpt-4o'

export async function gradeExamJson(prompt: string, opts?: { model?: string }) {
  const client = getClient()
  if (!client) return { note: 'OPENAI_API_KEY no configurada' }

  // response_format json_object: obliga al modelo a devolver JSON parseable.
  // Sin esto veníamos dependiendo de stripJsonFences + JSON.parse a ciegas.
  // max_tokens: el prompt más largo (Capitán, ~212 líneas) necesita holgura
  // para los 5 ejes viejos + los 7 de Guidara con su evidence.
  const resp = await client.chat.completions.create({
    model: opts?.model || GPT_MODEL,
    messages: [
      { role: 'system', content: 'Devuelve SOLO JSON válido. Sin markdown. Sin ```.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0,
    response_format: { type: 'json_object' },
    max_tokens: 4000,
  })

  const txt = resp.choices?.[0]?.message?.content?.trim() || '{}'
  try {
    return JSON.parse(stripJsonFences(txt))
  } catch {
    return { raw: txt }
  }
}
