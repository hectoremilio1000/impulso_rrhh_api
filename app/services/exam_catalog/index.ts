import { fingerprintQuestions } from '#services/bank_fingerprint'
import { EJES, type Eje, type ExamenPuesto, type PreguntaAbierta, type PreguntaNumerica } from './types.js'
import { EXAMEN_WAITER } from './waiter.js'
import { EXAMEN_CAPTAIN } from './captain.js'
import { EXAMEN_RUNNER } from './runner.js'
import { EXAMEN_HOSTESS } from './hostess.js'
import { EXAMEN_BARMAN } from './barman.js'
import { EXAMEN_BAR_MANAGER } from './bar_manager.js'
import { EXAMEN_COOK } from './cook.js'
import { EXAMEN_KITCHEN_SUB_MANAGER } from './kitchen_sub_manager.js'
import { EXAMEN_KITCHEN_MANAGER } from './kitchen_manager.js'
import { EXAMEN_CHEF_MANAGER } from './chef_manager.js'
import { EXAMEN_ASSISTANT_MANAGER } from './assistant_manager.js'
import { EXAMEN_GENERAL_MANAGER } from './general_manager.js'

// Catálogo de exámenes por puesto (2026-11-16). El orden es el del selector.
export const CATALOGO = {
  waiter: EXAMEN_WAITER,
  captain: EXAMEN_CAPTAIN,
  runner: EXAMEN_RUNNER,
  hostess: EXAMEN_HOSTESS,
  barman: EXAMEN_BARMAN,
  bar_manager: EXAMEN_BAR_MANAGER,
  cook: EXAMEN_COOK,
  kitchen_sub_manager: EXAMEN_KITCHEN_SUB_MANAGER,
  kitchen_manager: EXAMEN_KITCHEN_MANAGER,
  chef_manager: EXAMEN_CHEF_MANAGER,
  assistant_manager: EXAMEN_ASSISTANT_MANAGER,
  general_manager: EXAMEN_GENERAL_MANAGER,
} as const satisfies Record<string, ExamenPuesto>

export type CatalogCode = keyof typeof CATALOGO
export const CATALOG_CODES = Object.keys(CATALOGO) as CatalogCode[]

export function fichaDe(code: string | null | undefined): ExamenPuesto | null {
  return code && code in CATALOGO ? CATALOGO[code as CatalogCode] : null
}

/**
 * Puestos cuyo examen del catálogo se presenta a candidatos reales (piloto,
 * 2026-11-19). Los demás puestos conservan su banco anterior (o no tienen
 * examen): su ficha se guarda para seguir trabajándola, pero no se muestra
 * ni cambia cómo se califican sus exámenes vigentes. Agregar un puesto aquí
 * es la única forma de publicarlo.
 */
export const PUESTOS_PILOTO = ['hostess', 'kitchen_manager', 'general_manager'] as const satisfies readonly CatalogCode[]

export function enPiloto(code: string | null | undefined): boolean {
  return (PUESTOS_PILOTO as readonly string[]).includes(code ?? '')
}

/** Ficha que se presenta a candidatos: sólo puestos del piloto. */
export function fichaVigente(code: string | null | undefined): ExamenPuesto | null {
  return enPiloto(code) ? fichaDe(code) : null
}

export const enunciadosPractico = (f: ExamenPuesto) => f.practico.preguntas.map((p) => p.enunciado)
export const enunciadosCompetencias = (f: ExamenPuesto) => f.competencias.preguntas.map((p) => p.texto)

export const huellaPractico = (f: ExamenPuesto) => fingerprintQuestions(enunciadosPractico(f))
export const huellaCompetencias = (f: ExamenPuesto) =>
  fingerprintQuestions(enunciadosCompetencias(f))

/**
 * Huella de los CRITERIOS (rúbrica, claves, núcleos, señales, dimensiones),
 * aparte de la del banco: un cambio de criterio con los mismos enunciados
 * cambia esta huella y queda en el reporte (ronda 3, Codex).
 */
export function huellaRubrica(f: ExamenPuesto): string {
  const sinEnunciado = f.practico.preguntas.map(({ enunciado: _e, ...resto }) => resto)
  const senales = f.competencias.preguntas.map(({ texto: _t, ...resto }) => resto)
  return fingerprintQuestions([
    JSON.stringify(f.practico.dimensiones),
    JSON.stringify(sinEnunciado),
    JSON.stringify(senales),
    String(f.practico.umbralAprobado),
  ])
}

/** Lo que el candidato ve: enunciado y tipo de captura. Nunca rúbrica ni clave. */
export function preguntasVisibles(f: ExamenPuesto, kind: 'psych' | 'practical') {
  if (kind === 'psych') return f.competencias.preguntas.map((p) => ({ text: p.texto, type: 'abierta' as const }))
  return f.practico.preguntas.map((p) =>
    p.tipo === 'numerica'
      ? { text: p.enunciado, type: 'numerica' as const, unit: p.unidad }
      : { text: p.enunciado, type: 'abierta' as const }
  )
}

export function preguntasAbiertas(f: ExamenPuesto): PreguntaAbierta[] {
  return f.practico.preguntas.filter((p): p is PreguntaAbierta => p.tipo === 'abierta')
}
export function preguntasNumericas(f: ExamenPuesto): PreguntaNumerica[] {
  return f.practico.preguntas.filter((p): p is PreguntaNumerica => p.tipo === 'numerica')
}

/** Eje → números de pregunta (q1…), derivado de la ficha. */
export function preguntasPorEje(f: ExamenPuesto): Record<Eje, number[]> {
  const out = Object.fromEntries(EJES.map((e) => [e, [] as number[]])) as Record<Eje, number[]>
  f.competencias.preguntas.forEach((p, i) => out[p.eje].push(i + 1))
  return out
}

/** Ficha cuyo banco vigente tiene esta huella (sólo bancos del catálogo). */
export function fichaPorHuella(
  kind: 'psych' | 'practical',
  code: string,
  huella: string | null
): ExamenPuesto | null {
  const f = fichaDe(code)
  if (!f || !huella) return null
  return (kind === 'psych' ? huellaCompetencias(f) : huellaPractico(f)) === huella ? f : null
}
