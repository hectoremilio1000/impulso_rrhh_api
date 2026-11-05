// app/services/psych_axis_grader.ts
//
// Calificación del psicométrico UN EJE A LA VEZ, con evidencia obligatoria.
//
// Reemplaza el enfoque monolítico (los 7 ejes de golpe en un prompt de ~31k
// caracteres) que producía dos fallas observadas en producción:
//   · 36 de 94 exámenes con al menos un eje en 0 alegando "respuesta
//     insuficiente para evaluar" sobre exámenes contestados completos.
//   · gpt-4o devolviendo 50 parejo en los 6 ejes — relleno, no evaluación.
//
// Los tres cambios de diseño:
//   1. RÚBRICA con anclas concretas (psych_axis_rubric.ts) en vez de
//      definiciones abstractas.
//   2. EVIDENCIA PRIMERO: el modelo debe copiar la cita textual ANTES de
//      poner el número, y la cita se verifica contra el texto real. Sin cita
//      verificable → "Pendiente" (null), NUNCA un número inventado ni un 0.
//   3. UN EJE POR LLAMADA: sólo se le muestran las respuestas que miden ese
//      eje, no las 40. Menos carga, menos colapso.
//
// Distinción que el prompt viejo no hacía y que causó todo el problema:
//   0    = hay evidencia de que es MALO
//   null = no hay evidencia para juzgar  ← antes se confundían

import { gradeExamJson } from '#services/openai'
import { type EjeGuidara, preguntasDelEje, rolTieneTagging } from '#services/psych_question_tags'
import { rubricaComoTexto } from '#services/psych_axis_rubric'

export type RespuestaEje = { qid: string; pregunta: string; respuesta: string }

export type ResultadoEje = {
  eje: EjeGuidara
  score: number | null
  evidence: string
  /** Citas que el modelo dijo haber encontrado. */
  quotes: string[]
  /** Citas que NO se pudieron verificar contra el texto real del candidato. */
  quotesNoVerificadas: string[]
  /** Por qué quedó en null, cuando aplica. */
  motivoPendiente?: string
  /** Tipo de cada cita verificada, en el mismo orden que `quotes`. */
  quoteTypes?: TipoCita[]
  /** La IA marcó una conducta contraria a la competencia. */
  negativeConduct?: boolean
  /** Conducta relatada vs. sólo criterio declarado (respuestas hipotéticas). */
  evidenceType?: TipoEvidenciaEje
}

export type TipoCita = 'observada' | 'hipotetica' | 'generica'
export type TipoEvidenciaEje = 'conducta_relatada' | 'solo_criterio_declarado' | null

/** Normaliza para comparar citas: sin acentos, sin puntuación, espacios colapsados. */
function normalizar(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * ¿La cita existe de verdad en lo que escribió el candidato?
 *
 * Se tolera reformateo menor (acentos, puntuación, mayúsculas) pero no
 * invención: si el modelo se inventa la cita, el eje NO se puede puntuar.
 * Para citas largas basta con que el 85% de sus palabras aparezcan en orden
 * dentro de alguna respuesta — cubre elipsis y recortes legítimos.
 */
export function citaVerificable(cita: string, respuestas: RespuestaEje[]): boolean {
  const c = normalizar(cita)
  if (c.split(' ').filter(Boolean).length < 3) return false
  const corpus = respuestas.map((r) => normalizar(r.respuesta))
  if (corpus.some((texto) => texto.includes(c))) return true

  const palabras = c.split(' ').filter(Boolean)
  return corpus.some((texto) => {
    const t = ' ' + texto + ' '
    const encontradas = palabras.filter((p) => t.includes(' ' + p + ' ')).length
    return encontradas / palabras.length >= 0.85
  })
}

/** Extrae las respuestas que miden un eje, con su texto de pregunta. */
export function respuestasDelEje(rol: string, eje: EjeGuidara, answers: any): RespuestaEje[] {
  const qs = preguntasDelEje(rol, eje)
  const out: RespuestaEje[] = []
  for (const n of qs) {
    const qid = `q${n}`
    const v = answers?.[qid]
    if (!v) continue
    const respuesta =
      typeof v === 'string' ? v : String(v.answer ?? v.value ?? v.text ?? v.respuesta ?? '')
    const pregunta = typeof v === 'object' ? String(v.question ?? '') : ''
    if (!respuesta.trim()) continue
    out.push({ qid, pregunta, respuesta })
  }
  return out
}

export function buildAxisPrompt(rol: string, eje: EjeGuidara, respuestas: RespuestaEje[]): string {
  const bloque = respuestas
    .map((r) => `[${r.qid}] ${r.pregunta}\nRESPUESTA: ${r.respuesta}`)
    .join('\n\n')

  return `Eres evaluador de RRHH para restaurantes. Evalúas al candidato para el puesto de ${rol}.

Vas a evaluar UNA SOLA competencia. No opines sobre ninguna otra.

${rubricaComoTexto(eje)}

════════════════════════════════════════════════════
RESPUESTAS DEL CANDIDATO (sólo las que miden esta competencia)
════════════════════════════════════════════════════

${bloque}

════════════════════════════════════════════════════
PROCEDIMIENTO OBLIGATORIO — EN ESTE ORDEN
════════════════════════════════════════════════════

PASO 1. Copia TEXTUALMENTE entre 1 y 3 frases de las RESPUESTAS de arriba que
        sustenten tu evaluación. Copia carácter por carácter, sin parafrasear.
        Estas citas se verifican automáticamente contra el texto original: si
        inventas o parafraseas una cita, la evaluación se descarta.

PASO 2. Clasifica CADA cita con uno de estos tipos:
          "observada"  = relata algo que SÍ hizo, con hecho concreto (qué pasó,
                         qué hizo, cómo terminó). Ej.: "Separé fondo y venta,
                         revisé pagos por folio y encontré el error".
          "hipotetica" = dice lo que HARÍA o su criterio, sin relatar un hecho
                         suyo. Ej.: "Rechazaría la gratificación", "yo buscaría
                         un cálculo transparente".
          "generica"   = frase sin conducta ni criterio evaluable: "lo
                         hablaría", "trato de resolverlo", "depende", "que se
                         arreglen", "no sé", o una declaración de valores sin
                         hechos ("para mí la honestidad es lo primero").
        Una respuesta hipotética NO es conducta comprobada: no la describas
        como algo que ya hace.

PASO 3. Compara esas frases contra la RÚBRICA y explica en una o dos líneas a
        qué nivel corresponden y por qué.

PASO 4. SÓLO ENTONCES asigna el número (0-100).

════════════════════════════════════════════════════
LA REGLA MÁS IMPORTANTE — 0 Y "PENDIENTE" NO SON LO MISMO
════════════════════════════════════════════════════

  score: 0      significa "HAY evidencia de que es MALO en esta competencia".
                Sólo úsalo si puedes citar la frase que lo demuestra.

  score: null   significa "NO HAY con qué juzgar": las respuestas están vacías,
                son evasivas, o no hablan de esta competencia.

NUNCA uses 0 para decir "no sé". Si no puedes citar una frase real, el valor
es null. Un número inventado hace que se rechace a alguien por error.

CUÁNDO **SÍ** HAY QUE PONER NÚMERO (no te escondas en null):

  · Respuesta CORTA pero con contenido real (una acción, un criterio o un hecho
    concreto) → CALIFICA. "Cuando el mesero es nuevo o se está atrasando" son
    10 palabras y es evidencia válida. Breve y pobre va en la banda BAJA.
  · La respuesta habla del tema aunque no calce exacto con los ejemplos de la
    rúbrica → CALIFICA usando el ancla más cercana.

null ("evidencia insuficiente") cuando:
  · TODAS las citas que encuentras son "generica": vaguedad no es evidencia de
    que sea malo ni de que sea bueno.
  · Respuestas vacías, basura tecleada o ajenas a esta competencia.

Puntajes de 20 o menos SÓLO si alguna cita describe o acepta una conducta
contraria a la competencia (encubrir, aceptar un beneficio personal, humillar,
culpar sistemáticamente, abandonar un estándar). Marca entonces
"negative_conduct": true. Una respuesta vaga NUNCA es conducta negativa.

Evalúa lo que DICE, no cuánto escribe ni cómo lo escribe.

════════════════════════════════════════════════════

Devuelve SOLO este JSON, sin markdown:

{
  "quotes": [{ "text": "cita textual 1", "type": "observada" }, { "text": "cita textual 2", "type": "hipotetica" }],
  "negative_conduct": false,
  "reasoning": "en qué nivel de la rúbrica caen esas frases y por qué",
  "score": <número 0-100, o null si no hay evidencia>
}`
}

/** Califica un eje. Devuelve null en score si no hay evidencia verificable. */
export async function gradeAxis(
  rol: string,
  eje: EjeGuidara,
  answers: any,
  opts?: { model?: string }
): Promise<ResultadoEje> {
  const respuestas = respuestasDelEje(rol, eje, answers)

  if (respuestas.length === 0) {
    return {
      eje,
      score: null,
      evidence: 'El candidato no dejó respuestas para las preguntas de esta competencia.',
      quotes: [],
      quotesNoVerificadas: [],
      motivoPendiente: 'sin_respuestas',
    }
  }

  const raw: any = await gradeExamJson(buildAxisPrompt(rol, eje, respuestas), opts)

  if (!raw || raw.raw || raw.note) {
    return {
      eje,
      score: null,
      evidence: 'La IA no devolvió un resultado utilizable para esta competencia.',
      quotes: [],
      quotesNoVerificadas: [],
      motivoPendiente: 'respuesta_ia_invalida',
    }
  }

  return interpretarRespuestaIA(eje, raw, respuestas)
}

/**
 * Reglas sobre la respuesta de la IA (pura, probada sin OpenAI):
 * citas verificables, tipo de cada cita, evidencia insuficiente y conducta
 * negativa obligatoria para 20 o menos.
 */
export function interpretarRespuestaIA(
  eje: EjeGuidara,
  raw: any,
  respuestas: RespuestaEje[]
): ResultadoEje {
  const tipadas: { text: string; type: TipoCita }[] = Array.isArray(raw.quotes)
    ? raw.quotes.map((q: any) =>
        typeof q === 'string'
          ? { text: q, type: 'generica' as TipoCita }
          : { text: String(q?.text ?? ''), type: normTipo(q?.type) }
      )
    : []
  const quotes = tipadas.map((q) => q.text)
  const verificadasT = tipadas.filter((q) => citaVerificable(q.text, respuestas))
  const verificadas = verificadasT.map((q) => q.text)
  const inventadas = quotes.filter((q) => !citaVerificable(q, respuestas))
  const scoreNum = raw.score === null || raw.score === undefined ? null : Number(raw.score)
  const scoreValido =
    scoreNum !== null && Number.isFinite(scoreNum) && scoreNum >= 0 && scoreNum <= 100
  const conEvidencia = verificadasT.filter((q) => q.type !== 'generica')
  const evidenceType: TipoEvidenciaEje = conEvidencia.some((q) => q.type === 'observada')
    ? 'conducta_relatada'
    : conEvidencia.length
      ? 'solo_criterio_declarado'
      : null

  // Sin cita verificable no se puntúa. Es la defensa central: el modelo no
  // puede afirmar "respuesta insuficiente" ni inventar un número sin respaldo.
  if (verificadas.length === 0) {
    return {
      eje,
      score: null,
      evidence:
        inventadas.length > 0
          ? 'La IA no pudo respaldar su evaluación con una cita real del candidato.'
          : 'No se encontró evidencia citable en las respuestas de esta competencia.',
      quotes: [],
      quotesNoVerificadas: inventadas,
      motivoPendiente: inventadas.length > 0 ? 'citas_no_verificables' : 'sin_evidencia',
    }
  }

  // Vaguedad no es evidencia de nada: si todas las citas son genéricas, el eje
  // queda Pendiente (evidencia insuficiente), no con un número bajo.
  if (conEvidencia.length === 0) {
    return {
      eje,
      score: null,
      evidence:
        'Evidencia insuficiente: las respuestas son genéricas y no muestran conducta ni criterio evaluable.',
      quotes: verificadas,
      quotesNoVerificadas: inventadas,
      quoteTypes: verificadasT.map((q) => q.type),
      motivoPendiente: 'evidencia_insuficiente',
      evidenceType: null,
    }
  }

  if (!scoreValido) {
    return {
      eje,
      score: null,
      evidence: String(raw.reasoning ?? '').slice(0, 500),
      quotes: verificadas,
      quotesNoVerificadas: inventadas,
      quoteTypes: verificadasT.map((q) => q.type),
      motivoPendiente: 'score_ausente_o_invalido',
      evidenceType,
    }
  }

  // 20 o menos = "hay evidencia de que es malo": exige una conducta negativa
  // explícita. Sin ella el número no se sostiene y el eje queda Pendiente.
  if (scoreNum! <= 20 && raw.negative_conduct !== true) {
    return {
      eje,
      score: null,
      evidence:
        'Puntaje muy bajo sin conducta negativa citada: se deja como evidencia insuficiente.',
      quotes: verificadas,
      quotesNoVerificadas: inventadas,
      quoteTypes: verificadasT.map((q) => q.type),
      motivoPendiente: 'bajo_sin_conducta_negativa',
      evidenceType,
    }
  }

  const razon = String(raw.reasoning ?? '').trim()
  const etiqueta =
    evidenceType === 'solo_criterio_declarado'
      ? ' [Sólo criterio declarado (respuestas hipotéticas): falta comprobar con conducta real]'
      : ''
  return {
    eje,
    score: scoreNum,
    // Sin cortar: la explicación completa es parte de la evidencia del reporte.
    evidence: `"${verificadas[0]}"${razon ? ` — ${razon}` : ''}${etiqueta}`,
    quotes: verificadas,
    quotesNoVerificadas: inventadas,
    quoteTypes: verificadasT.map((q) => q.type),
    negativeConduct: raw.negative_conduct === true,
    evidenceType,
  }
}

function normTipo(t: unknown): TipoCita {
  const s = String(t ?? '').toLowerCase()
  if (s.startsWith('observ')) return 'observada'
  if (s.startsWith('hipot')) return 'hipotetica'
  return 'generica'
}

export const EJES_EVALUABLES: EjeGuidara[] = [
  'integridad',
  'autoconciencia',
  'empatia',
  'etica_trabajo',
  'inteligencia_curiosa',
  'optimismo_bondadoso',
]

/**
 * Califica los 6 ejes evaluables y arma el bloque `competenciesGuidara`.
 * Las llamadas van en paralelo: son independientes entre sí.
 */
export async function gradeAllAxes(
  rol: string,
  answers: any,
  opts?: { model?: string }
): Promise<{ competenciesGuidara: any; detalle: ResultadoEje[] }> {
  if (!rolTieneTagging(rol)) {
    throw new Error(`No hay tagging de preguntas para el puesto "${rol}"`)
  }

  const detalle = await Promise.all(
    EJES_EVALUABLES.map((eje) => gradeAxis(rol, eje, answers, opts))
  )

  const competenciesGuidara: any = {
    conocimientos_practicos: { score: null, evidence: 'evaluado en el examen práctico' },
  }
  for (const r of detalle) {
    competenciesGuidara[r.eje] = {
      score: r.score,
      evidence: r.evidence,
      evidenceType: r.evidenceType ?? null,
      motivoPendiente: r.motivoPendiente ?? null,
    }
  }

  return { competenciesGuidara, detalle }
}
