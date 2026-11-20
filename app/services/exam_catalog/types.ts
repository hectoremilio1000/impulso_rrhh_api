// Ficha de examen por puesto (catálogo 2026-11-16).
//
// Una sola fuente para lo que ve el candidato y lo que aplica el calificador:
// el servidor entrega estas preguntas al front y califica con la rúbrica de
// la misma ficha. La huella del banco (bank_fingerprint.ts) se calcula sobre
// los enunciados, así que una respuesta a otra versión nunca se califica con
// esta rúbrica.
//
// Bloque A · práctico del cargo: casos reales del puesto con reglas explícitas
// para dar puntos (elementos esenciales con cita, mínimo para "correcta",
// alternativas válidas, errores críticos). Las preguntas numéricas las
// califica el código con su clave y tolerancia, sin modelo.
//
// Bloque B · seis competencias: preguntas abiertas etiquetadas por eje y por
// tipo (experiencia relatada o criterio hipotético). Un relato no es conducta
// observada; una respuesta hipotética sólo muestra criterio declarado.

export type Eje =
  | 'integridad'
  | 'autoconciencia'
  | 'etica_trabajo'
  | 'empatia'
  | 'inteligencia_curiosa'
  | 'optimismo_bondadoso'

export const EJES: Eje[] = [
  'integridad',
  'autoconciencia',
  'etica_trabajo',
  'empatia',
  'inteligencia_curiosa',
  'optimismo_bondadoso',
]

export type Elemento = {
  id: string
  texto: string
  /**
   * Partes que la respuesta debe decir todas para acreditar el elemento
   * (p. ej. los datos de un registro). Sólo cuando el elemento existe para
   * esos datos; sin `partes`, se exige la acción, no cada detalle del texto.
   */
  partes?: string[]
  /**
   * Expresión (sin barras, insensible a mayúsculas) que la cita debe contener
   * para acreditar el elemento. Sólo para acciones de vocabulario inequívoco
   * («conteo»): la decide el código, no el modelo.
   */
  requiere?: string
}

export type Dimension = { id: string; nombre: string; peso: number }

/** Pregunta abierta calificada por rúbrica. */
export type PreguntaAbierta = {
  tipo: 'abierta'
  q: number
  /** Lo que ve el candidato. No enumera los elementos que se califican. */
  enunciado: string
  dimension: string
  evalua: string
  tareaReal: string
  indispensable: boolean
  /**
   * Por qué es indispensable (decidido de antemano, no por candidato). Si se
   * deja en blanco o con «no sé», el reporte marca «Conocimiento
   * indispensable pendiente de comprobar». Obligatorio en el piloto.
   */
  motivoIndispensable?: string
  esenciales: Elemento[]
  minimoCorrecta: number
  /**
   * Ids de esenciales sin los cuales no hay "correcta" aunque se junte el
   * mínimo (el riesgo central: alergia, alcohol, dinero). Omitirlos baja a
   * parcial; no es error crítico.
   */
  nucleo?: string[]
  alternativasValidas: string[]
  erroresCriticos: Elemento[]
}

/** Pregunta de cálculo: la califica el código con clave y tolerancia. */
export type PreguntaNumerica = {
  tipo: 'numerica'
  q: number
  enunciado: string
  dimension: string
  evalua: string
  tareaReal: string
  indispensable: boolean
  /**
   * Por qué es indispensable (decidido de antemano, no por candidato). Si se
   * deja en blanco o con «no sé», el reporte marca «Conocimiento
   * indispensable pendiente de comprobar». Obligatorio en el piloto.
   */
  motivoIndispensable?: string
  clave: number
  /** Diferencia absoluta aceptada respecto a la clave. */
  tolerancia: number
  unidad: string
  /** Cómo se llega a la clave (para el reclutador; nunca viaja al candidato). */
  solucion: string
}

export type PreguntaPractica = PreguntaAbierta | PreguntaNumerica

export type TipoPreguntaCompetencia = 'experiencia' | 'hipotetica'

export type PreguntaCompetencia = {
  texto: string
  eje: Eje
  tipo: TipoPreguntaCompetencia
  /** Qué cuenta como evidencia a favor (orienta al calificador). */
  senalesPositivas: string[]
  /** Conductas que, citadas, generan alerta para revisión humana. */
  senalesAlerta: string[]
}

export type Facultades = {
  /** Lo que el puesto decide solo en el turno. */
  decide: string[]
  /** Lo que escala (y entonces escalar merece crédito). */
  escala: string[]
  /** Supuestos usados en el examen que un operador debe confirmar. */
  pendientesOperador: string[]
}

export type ExamenPuesto = {
  code: string
  label: string
  /** Textos libres que llevan a este examen (sin acentos, en minúsculas). */
  aliases: string[]
  tareas: string[]
  facultades: Facultades
  practico: {
    version: string
    dimensiones: Dimension[]
    preguntas: PreguntaPractica[]
    umbralAprobado: number
  }
  competencias: {
    version: string
    preguntas: PreguntaCompetencia[]
  }
}
