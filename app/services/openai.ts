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

export async function gradeExamJson(prompt: string) {
  const client = getClient()
  if (!client) return { note: 'OPENAI_API_KEY no configurada' }

  const resp = await client.chat.completions.create({
    model: GPT_MODEL,
    messages: [
      { role: 'system', content: 'Devuelve SOLO JSON válido. Sin markdown. Sin ```.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0,
  })

  const txt = resp.choices?.[0]?.message?.content?.trim() || '{}'
  try {
    return JSON.parse(stripJsonFences(txt))
  } catch {
    return { raw: txt }
  }
}
