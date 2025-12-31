import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const GPT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

function stripJsonFences(s: string) {
  const m = s.match(/```json\s*([\s\S]*?)\s*```/i)
  return (m ? m[1] : s).trim()
}

export async function gradeExamJson(prompt: string) {
  const resp = await openai.chat.completions.create({
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
