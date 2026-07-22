// app/services/psych_question_tags.ts
//
// Mapeo eje → preguntas, por puesto. EXTRAÍDO de los bloques "TAGGING" que ya
// viven dentro de cada prompt en exam_prompts.ts (generado el 2026-07-20).
//
// Existe porque la calificación por eje necesita el mapeo como DATO, no como
// prosa dentro de un prompt gigante: para evaluar "integridad" hay que poder
// seleccionar sólo las respuestas que la miden.
//
// ⚠️ Si cambias el TAGGING de un prompt en exam_prompts.ts, actualiza esto.
// El spec psych_question_tags.spec.ts verifica que ambos sigan alineados.

export type EjeGuidara =
  | 'integridad'
  | 'autoconciencia'
  | 'empatia'
  | 'etica_trabajo'
  | 'inteligencia_curiosa'
  | 'optimismo_bondadoso'

export const PREGUNTAS_POR_EJE: Record<string, Record<EjeGuidara, number[]>> = {
  'Subgerente': {
    autoconciencia: [1, 14, 18, 19, 20, 39, 40, 41],
    empatia: [5, 9, 13, 27, 30, 36, 37, 38],
    etica_trabajo: [8, 12, 15, 21, 29],
    integridad: [10, 11, 22, 23, 24, 25, 26, 35],
    inteligencia_curiosa: [2, 3, 7, 16, 17, 31, 32, 33, 34],
    optimismo_bondadoso: [4, 6, 28, 42, 43, 44, 45],
  },
  'Mesero': {
    autoconciencia: [4, 6, 7, 11, 20, 31],
    empatia: [1, 2, 12, 13, 21, 32],
    etica_trabajo: [3, 5, 8, 17, 22],
    integridad: [10, 14, 15, 16, 25, 27, 30, 33],
    inteligencia_curiosa: [18, 19, 28, 29],
    optimismo_bondadoso: [9, 23, 24, 26, 34, 35, 36, 37],
  },
  'Capitán': {
    autoconciencia: [4, 11, 18, 26, 34],
    empatia: [1, 6, 10, 14, 16, 22, 25, 29, 33, 35, 37],
    etica_trabajo: [7, 19, 39],
    integridad: [2, 8, 12, 17, 20, 24, 28, 31, 40],
    inteligencia_curiosa: [5, 13, 23, 30, 36],
    optimismo_bondadoso: [3, 9, 15, 21, 27, 32, 38],
  },
  'Barman': {
    autoconciencia: [4, 12, 18, 22],
    empatia: [2, 7, 11, 17],
    etica_trabajo: [9, 16, 24],
    integridad: [1, 5, 10, 15, 20, 25],
    inteligencia_curiosa: [6, 14, 21],
    optimismo_bondadoso: [3, 8, 13, 19, 23],
  },
  'Cocinero': {
    autoconciencia: [4, 12, 19],
    empatia: [2, 10, 18],
    etica_trabajo: [3, 7, 11, 15, 20],
    integridad: [1, 5, 9, 13, 17],
    inteligencia_curiosa: [8, 16],
    optimismo_bondadoso: [6, 14],
  },
  'Chef gerente': {
    autoconciencia: [4, 12, 19, 24, 28],
    empatia: [2, 10, 17, 23, 29],
    etica_trabajo: [3, 7, 11, 15, 20, 25],
    integridad: [1, 5, 9, 13, 18, 22, 27],
    inteligencia_curiosa: [6, 14, 21, 30],
    optimismo_bondadoso: [8, 16, 26],
  },
}

/** Las respuestas (qN) que miden un eje para un puesto dado. */
export function preguntasDelEje(rol: string, eje: EjeGuidara): number[] {
  return PREGUNTAS_POR_EJE[rol]?.[eje] ?? []
}

/** Puestos con calificación por eje disponible. */
export function rolTieneTagging(rol: string): boolean {
  return Boolean(PREGUNTAS_POR_EJE[rol])
}
