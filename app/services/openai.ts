import OpenAI from 'openai'
import { costoUsd, presupuestoDelEntorno, tokensEntradaMax } from '#services/model_budget'
import type { RegistroLlamada } from '#services/model_budget'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export const GPT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

function getClient(): OpenAI | null {
  if (!OPENAI_API_KEY) return null
  // Con tope de gasto (sólo pruebas) no hay reintentos automáticos: cada
  // intento pasa por su propia reserva del presupuesto.
  return new OpenAI({
    apiKey: OPENAI_API_KEY,
    ...(process.env.PRESUPUESTO_USD ? { maxRetries: 0 } : {}),
  })
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

const MAX_TOKENS_SALIDA = 4000

/** Falla de red antes de recibir respuesta (no se cobra): APIConnectionError / fetch failed. */
export function esErrorDeConexion(err: unknown): boolean {
  const e = err as { name?: string; constructor?: { name?: string }; message?: string; status?: number }
  if (typeof e?.status === 'number') return false
  const nombre = `${e?.name ?? ''} ${e?.constructor?.name ?? ''}`
  return /APIConnection/i.test(nombre) || /connection error|fetch failed|ETIMEDOUT|ECONNRESET/i.test(e?.message ?? '')
}

export async function gradeExamJson(
  prompt: string,
  opts?: { model?: string; maxTokens?: number; onMeta?: (meta: RegistroLlamada) => void }
) {
  const client = getClient()
  if (!client) return { note: 'OPENAI_API_KEY no configurada' }

  // Tope de gasto (sólo pruebas; ver model_budget.ts): reserva el máximo de
  // esta llamada o se detiene ANTES de enviarla.
  const modeloPedido = opts?.model || GPT_MODEL
  const maxTokens = opts?.maxTokens ?? MAX_TOKENS_SALIDA
  const presupuesto = presupuestoDelEntorno()
  const reserva = presupuesto
    ? presupuesto.reservar(costoUsd(presupuesto.precios, tokensEntradaMax(prompt) + 30, maxTokens))
    : 0
  let registro: RegistroLlamada | null = null

  // response_format json_object: obliga al modelo a devolver JSON parseable.
  // Sin esto veníamos dependiendo de stripJsonFences + JSON.parse a ciegas.
  // max_tokens: el prompt más largo (Capitán, ~212 líneas) necesita holgura
  // para los 5 ejes viejos + los 7 de Guidara con su evidence.
  let resp
  try {
    const pedir = () =>
      client.chat.completions.create({
        model: modeloPedido,
        messages: [
          { role: 'system', content: 'Devuelve SOLO JSON válido. Sin markdown. Sin ```.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0,
        response_format: { type: 'json_object' },
        max_tokens: maxTokens,
      })
    // Con tope de gasto el cliente no reintenta (maxRetries 0). Un error de
    // CONEXIÓN no llegó al modelo y no se cobra: se reintenta hasta 2 veces
    // con la misma reserva. Cualquier respuesta HTTP (429, 500…) no se repite.
    for (let intento = 0; ; intento++) {
      try {
        resp = await pedir()
        break
      } catch (err) {
        if (!esErrorDeConexion(err) || intento >= 2) throw err
        await new Promise((r) => setTimeout(r, 1500 * (intento + 1)))
      }
    }
    const usage = resp.usage
    registro = {
      at: new Date().toISOString(),
      modeloPedido,
      modeloRespondio: resp.model ?? null,
      systemFingerprint: (resp as any).system_fingerprint ?? null,
      tokensEntrada: usage?.prompt_tokens ?? 0,
      tokensSalida: usage?.completion_tokens ?? 0,
      costoUsd: presupuesto
        ? costoUsd(presupuesto.precios, usage?.prompt_tokens ?? 0, usage?.completion_tokens ?? 0)
        : 0,
    }
    opts?.onMeta?.(registro)
  } finally {
    presupuesto?.liberar(reserva, registro)
  }

  const txt = resp.choices?.[0]?.message?.content?.trim() || '{}'
  try {
    return JSON.parse(stripJsonFences(txt))
  } catch {
    return { raw: txt }
  }
}
