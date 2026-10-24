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
  | 'cook'
  | 'barman'
  | 'chef_manager'
  | 'assistant_manager'

// Etiqueta en español que usa el calificador (PREGUNTAS_POR_EJE, prompts).
export const ROLE_LABEL_ES: Record<RoleCode, string> = {
  waiter: 'Mesero',
  captain: 'Capitán',
  cook: 'Cocinero',
  barman: 'Barman',
  chef_manager: 'Chef gerente',
  assistant_manager: 'Subgerente',
}

const ROLE_CODES = Object.keys(ROLE_LABEL_ES) as RoleCode[]

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Texto libre → código. Sin acentos, sin mayúsculas, por substring.
// El orden IMPORTA: "Capitán de meseros" contiene "mesero", "Chef gerente" y
// "Sub Gerente" contienen "gerente". De más específico a más general.
export function resolveRoleCode(raw: string | null | undefined): RoleCode | null {
  const v = stripAccents((raw || '').trim().toLowerCase()).replace(/_/g, ' ')
  if (!v) return null

  if (v.includes('chef')) return 'chef_manager'
  if (v.includes('subgerente') || v.includes('sub gerente')) return 'assistant_manager'
  if (v.includes('capit')) return 'captain'
  if (v.includes('barman') || v.includes('bartender') || v.includes('barra')) return 'barman'
  if (v.includes('cocin')) return 'cook'
  if (v.includes('meser')) return 'waiter'

  // "Gerente", "Encargado", etc.: puesto sin examen propio. No se adivina.
  return null
}

// Código exacto ('waiter', lo que manda el admin) o texto libre ("Mesera").
export function toRoleCode(v: unknown): RoleCode | null {
  if (typeof v !== 'string') return null
  const s = v.trim()
  return ROLE_CODES.includes(s as RoleCode) ? (s as RoleCode) : resolveRoleCode(s)
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

// Huella de los bancos vigentes (bank_fingerprint.ts). Generada desde
// src/pages/public/exams/questionBank.ts del front; si el banco cambia, la
// huella cambia y las respuestas del banco anterior dejan de poder
// calificarse con las etiquetas nuevas.
export const CURRENT_BANK_FINGERPRINT: Record<ExamKind, Record<RoleCode, string>> = {
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
    input.answersFingerprint !== CURRENT_BANK_FINGERPRINT[kind][testCode]
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
