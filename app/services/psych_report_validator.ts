// app/services/psych_report_validator.ts
//
// Valida que el reporte que devuelve la IA sea COHERENTE antes de persistirlo.
//
// Contexto (bug 2026-07-20, candidato 768 y 10 más): gpt-4o-mini devolvió los 7
// ejes de Guidara en 0 con evidence "respuesta insuficiente para evaluar" pese a
// que el candidato contestó las 40 preguntas con 41 palabras de promedio, y
// además reportó score raíz 61.25 cuando el promedio ponderado de sus propias
// competencies daba 40. Nada validaba eso: el reporte se guardaba tal cual y el
// motor Guidara del front leía los ceros como "Rojo" → DESCARTAR falso.
//
// Este módulo NO inventa datos. Detecta incoherencias y, cuando no se pueden
// resolver, degrada a null (que el front muestra como "Pendiente"/INCOMPLETO)
// en vez de dejar un 0 que se lee como reprobado.

const EJES_GUIDARA = [
  'integridad',
  'autoconciencia',
  'empatia',
  'conocimientos_practicos',
  'etica_trabajo',
  'inteligencia_curiosa',
  'optimismo_bondadoso',
] as const

// conocimientos_practicos se evalúa en el examen práctico: viene null por
// diseño y NO cuenta como eje evaluable aquí.
const EJES_EVALUABLES = EJES_GUIDARA.filter((e) => e !== 'conocimientos_practicos')

// Pesos del bloque "competencies" (los 5 ejes viejos). Espejo de exam_prompts.ts.
const PESOS_COMPETENCIAS: Record<string, number> = {
  service_protocol: 30,
  customer_communication: 25,
  stress_conflict: 20,
  sales_suggestions: 15,
  teamwork_discipline: 10,
}

// Si el score raíz difiere del promedio ponderado por más de esto, se recalcula.
const TOLERANCIA_SCORE = 5

// Un candidato que contestó de verdad no puede tener TODOS los ejes en 0.
// Umbral por debajo del cual sí es plausible que la IA haya penalizado legítimamente.
// OJO: esta señal SOLA es insuficiente — la IA suele capar el raíz a 40 y zerear
// a la vez, y eso se ve "coherente". Por eso la señal fuerte son las RESPUESTAS
// (ver contarRespuestasSustanciales). Ésta queda como red secundaria para cuando
// no tenemos las respuestas a la mano.
const SCORE_MIN_PARA_SOSPECHAR_CEROS = 45

// El prompt penaliza un eje con 0 sólo si TODAS sus respuestas están vacías o
// tienen menos de 15 palabras. Si una fracción suficiente del examen supera esa
// barra, la afirmación "no hay nada que evaluar" es falsa por construcción.
const MIN_PALABRAS_RESPUESTA_VALIDA = 15
const FRACCION_MIN_RESPUESTAS_SUSTANCIALES = 0.5

export type ValidationIssue =
  | 'guidara_ausente'
  | 'guidara_todo_cero_incoherente'
  | 'score_raiz_incoherente'
  | 'reporte_no_parseable'

export type ValidationResult = {
  ok: boolean
  issues: ValidationIssue[]
  /** Detalle legible, se guarda en el reporte para auditoría. */
  details: string[]
}

function scoreDe(v: any): number | null {
  if (v === null || v === undefined) return null
  const n = typeof v === 'object' ? v.score : v
  if (n === null || n === undefined) return null
  const num = Number(n)
  return Number.isFinite(num) ? num : null
}

/** Promedio ponderado de las 5 competencias viejas. null si faltan datos. */
export function promedioPonderado(report: any): number | null {
  const comp = report?.competencies
  if (!comp || typeof comp !== 'object') return null
  let suma = 0
  let pesoTotal = 0
  for (const [clave, peso] of Object.entries(PESOS_COMPETENCIAS)) {
    const s = scoreDe(comp[clave])
    if (s === null) return null
    suma += s * peso
    pesoTotal += peso
  }
  if (pesoTotal === 0) return null
  return suma / pesoTotal
}

/**
 * Extrae el texto que escribió el candidato. `answers_json` viene como
 * { q1: { question, answer }, ... } pero toleramos strings sueltos y otras
 * llaves por si el front cambia de forma.
 */
function textosDeRespuestas(answers: any): string[] {
  if (!answers || typeof answers !== 'object') return []
  const valores = Array.isArray(answers) ? answers : Object.values(answers)
  return valores.map((v: any) => {
    if (typeof v === 'string') return v
    if (v && typeof v === 'object') {
      return String(v.answer ?? v.value ?? v.text ?? v.respuesta ?? '')
    }
    return ''
  })
}

/**
 * Cuántas respuestas superan la barra de 15 palabras que el propio prompt usa
 * para decidir si un eje se penaliza con 0.
 */
export function contarRespuestasSustanciales(answers: any): {
  total: number
  sustanciales: number
  fraccion: number
} {
  const textos = textosDeRespuestas(answers)
  const total = textos.length
  const sustanciales = textos.filter(
    (t) => t.trim().split(/\s+/).filter(Boolean).length >= MIN_PALABRAS_RESPUESTA_VALIDA
  ).length
  return { total, sustanciales, fraccion: total === 0 ? 0 : sustanciales / total }
}

/**
 * Revisa la coherencia interna del reporte. No muta nada.
 *
 * @param answers  `answers_json` del examen. Opcional, pero MUY recomendado:
 *                 es la única señal que distingue "la IA falló" de "el
 *                 candidato de verdad no contestó".
 */
export function validatePsychReport(report: any, answers?: any): ValidationResult {
  const issues: ValidationIssue[] = []
  const details: string[] = []

  if (!report || typeof report !== 'object' || report.raw || report.note) {
    return {
      ok: false,
      issues: ['reporte_no_parseable'],
      details: ['La IA no devolvió un reporte JSON utilizable.'],
    }
  }

  const guidara = report.competenciesGuidara
  if (!guidara || typeof guidara !== 'object' || Object.keys(guidara).length === 0) {
    issues.push('guidara_ausente')
    details.push('El reporte no trae el bloque competenciesGuidara.')
  } else {
    const scores = EJES_EVALUABLES.map((e) => scoreDe(guidara[e]))
    const conValor = scores.filter((s): s is number => s !== null)
    const todosCero = conValor.length > 0 && conValor.every((s) => s === 0)

    if (todosCero) {
      // SEÑAL FUERTE — las respuestas del candidato. Si superan la barra de 15
      // palabras que el propio prompt usa, "respuesta insuficiente" es falso.
      // Auditoría 2026-07-20: de 11 exámenes con todos los ejes en 0, 9 tenían
      // respuestas sustanciales (uno con 66 palabras de promedio). La IA capaba
      // el raíz a 40 y zereaba a la vez, así que mirando sólo el reporte se veía
      // "coherente" y se colaba.
      const resp = answers ? contarRespuestasSustanciales(answers) : null
      if (resp && resp.total > 0 && resp.fraccion >= FRACCION_MIN_RESPUESTAS_SUSTANCIALES) {
        issues.push('guidara_todo_cero_incoherente')
        details.push(
          `Los ${conValor.length} ejes evaluables de Guidara vienen en 0 alegando respuestas ` +
            `insuficientes, pero ${resp.sustanciales} de ${resp.total} respuestas superan las ` +
            `${MIN_PALABRAS_RESPUESTA_VALIDA} palabras.`
        )
      } else {
        // SEÑAL SECUNDARIA — sin respuestas a la mano, nos queda la incoherencia
        // interna: un raíz alto no es alcanzable si de verdad no había qué evaluar.
        const raiz = scoreDe(report.score) ?? promedioPonderado(report)
        if (raiz !== null && raiz > SCORE_MIN_PARA_SOSPECHAR_CEROS) {
          issues.push('guidara_todo_cero_incoherente')
          details.push(
            `Los ${conValor.length} ejes evaluables de Guidara vienen en 0, pero el score raíz es ${raiz}. ` +
              `Si las respuestas fueran insuficientes el score no podría superar ${SCORE_MIN_PARA_SOSPECHAR_CEROS}.`
          )
        }
      }
    }
  }

  const declarado = scoreDe(report.score)
  const calculado = promedioPonderado(report)
  if (declarado !== null && calculado !== null) {
    const delta = Math.abs(declarado - calculado)
    if (delta > TOLERANCIA_SCORE) {
      issues.push('score_raiz_incoherente')
      details.push(
        `El score raíz declarado (${declarado}) no coincide con el promedio ponderado ` +
          `de sus propias competencies (${calculado.toFixed(2)}); diferencia ${delta.toFixed(2)}.`
      )
    }
  }

  return { ok: issues.length === 0, issues, details }
}

/**
 * Aplica las correcciones seguras sobre el reporte y devuelve una copia.
 *
 * - Score raíz incoherente → se recalcula con la fórmula documentada en el prompt.
 * - Guidara todo-en-cero incoherente → los ejes evaluables pasan a null, para que
 *   el motor del front los lea como "pendiente" (INCOMPLETO) y NO como rojo
 *   (DESCARTAR). Preferimos "no sé" antes que un rechazo inventado.
 * - Se adjunta `_validation` para dejar rastro auditable de lo que se tocó.
 */
export function sanitizePsychReport(report: any, validation: ValidationResult) {
  if (!report || typeof report !== 'object') return report
  const salida: any = { ...report }

  if (validation.issues.includes('score_raiz_incoherente')) {
    const calculado = promedioPonderado(report)
    if (calculado !== null) {
      salida._scoreOriginalIA = report.score
      salida.score = Number(calculado.toFixed(2))
    }
  }

  if (validation.issues.includes('guidara_todo_cero_incoherente')) {
    const original = report.competenciesGuidara || {}
    const corregido: any = {}
    for (const eje of EJES_GUIDARA) {
      const actual = original[eje]
      if (eje === 'conocimientos_practicos') {
        corregido[eje] = actual ?? { score: null, evidence: 'evaluado en el examen práctico' }
        continue
      }
      corregido[eje] = {
        score: null,
        evidence:
          'Sin evaluar: la IA devolvió 0 de forma incoherente con el resto del reporte. ' +
          'Requiere recalificación manual.',
      }
    }
    salida._competenciesGuidaraOriginal = original
    salida.competenciesGuidara = corregido
  }

  if (!validation.ok) {
    salida._validation = {
      ok: false,
      issues: validation.issues,
      details: validation.details,
    }
  }

  return salida
}

export { EJES_GUIDARA, EJES_EVALUABLES, PESOS_COMPETENCIAS }
