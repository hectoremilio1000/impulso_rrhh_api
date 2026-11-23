import { bancoPorHuella } from '#services/practical_banks/assistant_manager'
import { CATALOGO, PUESTOS_PILOTO, huellaCompetencias, huellaPractico } from '#services/exam_catalog/index'
// Fuente única del puesto evaluado.
//
// El puesto se fija al asignar la prueba y queda en testName
// (PSYCH_<CODE>_V1 / PRACTICAL_<CODE>_V1). decideEvaluationRole (abajo) es la
// única regla para mostrar y calificar; el front la replica sólo para el
// panel y ambos repos prueban la misma tabla de casos.
//
// Antes había cuatro traductores independientes (roleToCode, normalizePsychRole,
// ExamRunner.roleFromDesiredRole y AssessmentsPanel.desiredRoleToRoleCode) que
// no coincidían: "Sub Gerente" veía el examen de Mesero y se calificaba como
// Subgerente; "Gerente" se calificaba como Mesero en silencio. Un texto que no
// se reconoce ahora devuelve null y quien llama decide fallar, nunca Mesero.

export type RoleCode =
  | 'waiter'
  | 'captain'
  | 'runner'
  | 'hostess'
  | 'cook'
  | 'kitchen_sub_manager'
  | 'kitchen_manager'
  | 'barman'
  | 'bar_manager'
  | 'chef_manager'
  | 'assistant_manager'
  | 'general_manager'

// Etiqueta en español que usa el calificador (PREGUNTAS_POR_EJE, prompts).
export const ROLE_LABEL_ES: Record<RoleCode, string> = {
  waiter: 'Mesero',
  captain: 'Capitán',
  runner: 'Runner',
  hostess: 'Hostess',
  cook: 'Cocinero',
  kitchen_sub_manager: 'Subencargado de cocina',
  kitchen_manager: 'Encargado de cocina',
  barman: 'Barman',
  bar_manager: 'Encargado de barra',
  chef_manager: 'Chef gerente',
  assistant_manager: 'Subgerente',
  general_manager: 'Gerente',
}

const ROLE_CODES = Object.keys(ROLE_LABEL_ES) as RoleCode[]

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// Texto libre → código. Sin acentos ni mayúsculas, por substring, y el orden
// IMPORTA: de más específico a más general. "Encargado de barra" contiene
// "barra" (Barman), "Subencargado de cocina" contiene "encargado de cocina" y
// "cocin" (Cocinero), "Chef gerente" y "Sub Gerente" contienen "gerente".
// Lo que no se reconoce devuelve null: nunca se adivina Mesero.
const ALIAS_EN_ORDEN: [RegExp, RoleCode][] = [
  [/sub\s*encargad[oa] de cocina|sous\s*chef|segund[oa] de cocina|sub\s*jef[ea] de cocina/, 'kitchen_sub_manager'],
  [/encargad[oa] de cocina|jef[ea] de cocina/, 'kitchen_manager'],
  [/encargad[oa] de (la )?barra|jef[ea] de (la )?barra|bar\s*manager/, 'bar_manager'],
  [/chef/, 'chef_manager'],
  [/sub\s*gerente|subgerenta|gerente de turno/, 'assistant_manager'],
  [/gerente/, 'general_manager'],
  [/capit/, 'captain'],
  [/hostess|anfitri[oó]n|anfitriona|\bhost\b/, 'hostess'],
  [/runner|auxiliar de servicio|corredor de (alimentos|platillos)/, 'runner'],
  [/barman|bartender|cantiner[oa]|barra/, 'barman'],
  [/cocin/, 'cook'],
  [/meser/, 'waiter'],
]

function aliasDelCatalogo(v: string): RoleCode | null {
  // Puestos de apoyo sin examen propio (pendiente de operador si comparten
  // el de Cocinero o Runner): no se adivinan por contener "cocina".
  if (/ayudante de cocina|lavaloza|garrot|bar\s*back/.test(v)) return null
  for (const [re, code] of ALIAS_EN_ORDEN) if (re.test(v)) return code
  // "Encargado", "Garrotero", "Ayudante de cocina"…: sin examen propio.
  return null
}

// Traducción anterior al catálogo, tal cual estaba vigente. Fuera del piloto
// un texto sigue llevando al mismo examen que antes (p. ej. «Subencargado de
// cocina» → Cocinero, «Sous chef» → Chef): publicar tres puestos no cambia el
// examen que recibe nadie más.
function aliasAnterior(v: string): RoleCode | null {
  if (v.includes('chef')) return 'chef_manager'
  if (v.includes('subgerente') || v.includes('sub gerente')) return 'assistant_manager'
  if (v.includes('capit')) return 'captain'
  if (v.includes('barman') || v.includes('bartender') || v.includes('barra')) return 'barman'
  if (v.includes('cocin')) return 'cook'
  if (v.includes('meser')) return 'waiter'
  return null
}

export function resolveRoleCode(raw: string | null | undefined): RoleCode | null {
  const v = stripAccents((raw || '').trim().toLowerCase()).replace(/_/g, ' ').replace(/\s+/g, ' ')
  if (!v) return null
  const delCatalogo = aliasDelCatalogo(v)
  if (delCatalogo && enPilotoCode(delCatalogo)) return delCatalogo
  return aliasAnterior(v)
}

// Código exacto ('waiter', lo que manda el admin) o texto libre ("Mesera").
// Sólo puestos con examen vigente: asignar uno sin banco dejaría al candidato
// sin preguntas.
export function toRoleCode(v: unknown): RoleCode | null {
  if (typeof v !== 'string') return null
  const s = v.trim()
  return ROLE_CODES.includes(s as RoleCode) ? conExamen(s as RoleCode) : resolveRoleCode(s)
}

// PSYCH_ASSISTANT_MANAGER_V1 → 'assistant_manager'. null si no trae código válido.
export function roleCodeFromTestName(testName: string | null | undefined): RoleCode | null {
  const m = /^(?:PSYCH|PRACTICAL)_(.+)_V\d+$/i.exec((testName || '').trim())
  if (!m) return null
  const code = m[1].toLowerCase() as RoleCode
  return ROLE_CODES.includes(code) ? code : null
}

// ─────────────────────────────────────────────────────────────────────────
// Qué puesto evalúa una prueba concreta y si puede presentarse o calificarse.
//
// - El puesto evaluado es el que se fijó al asignar la prueba (role_code, o el
//   código de testName en pruebas anteriores a esa columna). No cambia si
//   después se edita el puesto del candidato: una evaluación terminada sigue
//   valiendo para su puesto original (el panel avisa que no evalúa el nuevo).
// - Antes de presentarse, si el puesto actual no coincide, la prueba queda en
//   "requiere revisión". Salidas: reasignar el examen correcto (la prueba
//   anterior se conserva como reemplazada) o confirmar con motivo que el
//   puesto asignado es el correcto (error de identificación).
// - Instrumento y puesto son datos distintos: una prueba con nombre libre
//   ("DISC") es un instrumento externo y nunca se trata como examen Impulso.
// ─────────────────────────────────────────────────────────────────────────

export type ExamKind = 'psych' | 'practical'

export const IMPULSO_INSTRUMENT: Record<ExamKind, string> = {
  psych: 'impulso_psych',
  practical: 'impulso_practical',
}

// Puestos que ya tenían examen antes del catálogo: conservan su banco y su
// calificación anteriores mientras no entren al piloto (2026-11-19).
const PUESTOS_BANCO_ANTERIOR = [
  'waiter',
  'captain',
  'cook',
  'barman',
  'chef_manager',
  'assistant_manager',
] as const satisfies readonly RoleCode[]

// Huellas de esos bancos (docs/examenes/HUELLAS_ANTERIORES.md). Son las mismas
// que estaban vigentes antes del catálogo: sus exámenes siguen igual.
const HUELLA_BANCO_ANTERIOR: Record<ExamKind, Record<(typeof PUESTOS_BANCO_ANTERIOR)[number], string>> = {
  psych: {
    waiter: '37-af094d031b88c587',
    captain: '40-4d4e489b57059a85',
    cook: '20-7e55b1b2692786f2',
    barman: '25-cb6e12a20f72048d',
    chef_manager: '30-4e5e876442b3a429',
    assistant_manager: '45-a6ece8b51ac6720b',
  },
  practical: {
    waiter: '10-9ad52a41e44e1391',
    captain: '10-108a04047ed77c0e',
    cook: '10-1aa369d8bf1afbc1',
    barman: '10-e38368b5042afafc',
    chef_manager: '12-c92f22724125b897',
    assistant_manager: '12-da76df97f9c7bdfc',
  },
}

const enPilotoCode = (c: RoleCode) => (PUESTOS_PILOTO as readonly string[]).includes(c)

/** Puestos que hoy tienen examen para candidatos: los anteriores + el piloto. */
export const PUESTOS_CON_EXAMEN: RoleCode[] = ROLE_CODES.filter(
  (c) => enPilotoCode(c) || (PUESTOS_BANCO_ANTERIOR as readonly string[]).includes(c)
)

function conExamen(code: RoleCode): RoleCode | null {
  return PUESTOS_CON_EXAMEN.includes(code) ? code : null
}

// Huella del banco vigente de cada puesto con examen. Piloto: la ficha del
// catálogo (lo mismo que el servidor entrega al front). Los demás: su banco
// anterior. Un puesto sin examen no tiene huella. Si un banco cambia, la
// huella cambia y las respuestas del banco anterior dejan de calificarse con
// las etiquetas nuevas. Huellas anteriores en docs/examenes/HUELLAS_ANTERIORES.md.
function huellasVigentes(kind: ExamKind): Partial<Record<RoleCode, string>> {
  const out: Partial<Record<RoleCode, string>> = { ...HUELLA_BANCO_ANTERIOR[kind] }
  for (const c of PUESTOS_PILOTO)
    out[c] = kind === 'psych' ? huellaCompetencias(CATALOGO[c]) : huellaPractico(CATALOGO[c])
  return out
}

export const CURRENT_BANK_FINGERPRINT: Record<ExamKind, Partial<Record<RoleCode, string>>> = {
  psych: huellasVigentes('psych'),
  practical: huellasVigentes('practical'),
}

// Bancos anteriores que el calificador todavía sabe calificar con SU rúbrica
// (por huella). Sólo el práctico de Subgerente tiene rúbrica por banco; una
// respuesta a un banco anterior no es "banco equivocado", se califica con la
// rúbrica de ese banco.
// Fuera del piloto, Subgerente sólo presenta su banco v1 (el vigente).
function bancoPracticoCalificable(kind: ExamKind, role: RoleCode, huella: string | null) {
  return (
    kind === 'practical' &&
    role === 'assistant_manager' &&
    enPilotoCode('assistant_manager') &&
    bancoPorHuella(huella) !== null
  )
}

export type RoleReviewReason =
  | 'unknown_desired_role' // puesto actual sin examen propio ("Gerente")
  | 'role_mismatch' // puesto actual ≠ puesto con que se asignó la prueba
  | 'shown_role_mismatch' // el front mostró un examen distinto al asignado
  | 'bank_mismatch' // las preguntas contestadas no son el banco vigente del puesto

export type ReviewLogEntry = {
  action: 'confirm_role' | 'reassign' | 'grade_reviewed'
  roleCode: RoleCode
  reason: string
  at: string
  actor: string
  newTestId?: number
  previousReport?: unknown
}

export type TestRoleInput = {
  instrument?: string | null
  roleCode?: string | null
  testName?: string | null
  supersededById?: number | null
  reviewLog?: ReviewLogEntry[] | null
}

export type RoleDecision =
  | { status: 'ok'; code: RoleCode }
  | { status: 'superseded'; supersededById: number }
  | { status: 'external' }
  | {
      status: 'review'
      reason: RoleReviewReason
      testCode: RoleCode | null
      desiredCode: RoleCode | null
      shownCode: string | null
    }

function isRoleCode(v: unknown): v is RoleCode {
  return typeof v === 'string' && ROLE_CODES.includes(v as RoleCode)
}

// Puesto que evalúa la prueba, o null si no es un examen Impulso.
export function evaluatedRoleOf(kind: ExamKind, test: TestRoleInput): RoleCode | null {
  if (test.instrument && test.instrument !== IMPULSO_INSTRUMENT[kind]) return null
  if (isRoleCode(test.roleCode)) return test.roleCode
  return roleCodeFromTestName(test.testName)
}

export function decideEvaluationRole(input: {
  kind: ExamKind
  test: TestRoleInput
  desiredRole: string | null | undefined
  shownRoleCode?: string | null
  answersFingerprint?: string | null
}): RoleDecision {
  const { kind, test } = input
  if (test.supersededById) return { status: 'superseded', supersededById: test.supersededById }

  const testCode = evaluatedRoleOf(kind, test)
  if (!testCode) return { status: 'external' }

  const desiredCode = resolveRoleCode(input.desiredRole)
  const shownCode = input.shownRoleCode ? String(input.shownRoleCode) : null
  const review = (reason: RoleReviewReason): RoleDecision => ({
    status: 'review',
    reason,
    testCode,
    desiredCode,
    shownCode,
  })

  // Prueba de un puesto que hoy no tiene examen (fuera del piloto y sin banco
  // anterior): no se presenta ni se califica.
  if (!CURRENT_BANK_FINGERPRINT[kind][testCode]) return review('unknown_desired_role')

  // Un humano confirmó con motivo que el puesto asignado es el correcto.
  const confirmed = (test.reviewLog || []).some(
    (e) => e.action === 'confirm_role' && e.roleCode === testCode
  )
  if (!confirmed) {
    if (!desiredCode) return review('unknown_desired_role')
    if (desiredCode !== testCode) return review('role_mismatch')
  }
  // shownRoleCode ausente = cliente viejo; se decide con prueba y banco.
  if (shownCode && shownCode !== testCode) return review('shown_role_mismatch')
  if (
    input.answersFingerprint !== undefined &&
    input.answersFingerprint !== CURRENT_BANK_FINGERPRINT[kind][testCode] &&
    !bancoPracticoCalificable(kind, testCode, input.answersFingerprint)
  ) {
    return review('bank_mismatch')
  }
  return { status: 'ok', code: testCode }
}

// Versión del banco con que se presentó la prueba (PSYCH_WAITER_V1 → 'V1').
// Ojo: "V1" no identifica el banco; para eso está la huella.
export function bankVersionFromTestName(testName: string | null | undefined): string | null {
  const m = /_(V\d+)$/i.exec((testName || '').trim())
  return m ? m[1].toUpperCase() : null
}
