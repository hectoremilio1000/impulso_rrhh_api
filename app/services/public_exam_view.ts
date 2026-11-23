import { decideEvaluationRole, type ExamKind, type ReviewLogEntry } from '#services/role_catalog'
import { fichaVigente, preguntasVisibles } from '#services/exam_catalog/index'

// Lo único que un link público de examen puede devolver. El link lo tiene
// cualquiera que lo reciba; calificación, reporte de IA, respuestas y notas
// son para el reclutador. Se arma por lista blanca para que un campo nuevo
// del modelo no se filtre por accidente.

type TestLike = {
  id: number
  testName: string
  assignedAt?: unknown
  takenAt?: unknown
  instrument?: string | null
  roleCode?: string | null
  supersededById?: number | null
  reviewLogJson?: ReviewLogEntry[] | null
}

type CandidateLike = {
  id: number
  firstName: string
  lastName: string
  desiredRole?: string | null
}

export function publicExamView(kind: ExamKind, test: TestLike, candidate: CandidateLike) {
  const decision = decideEvaluationRole({
    kind,
    test: {
      instrument: test.instrument ?? null,
      roleCode: test.roleCode ?? null,
      testName: test.testName,
      supersededById: test.supersededById ?? null,
      reviewLog: test.reviewLogJson ?? null,
    },
    desiredRole: candidate.desiredRole,
  })
  // Banco que se muestra = banco con que se califica (ficha del catálogo).
  // Sólo enunciados y tipo de captura: nunca rúbrica, claves ni señales.
  // Puestos fuera del piloto: sin banco aquí; el front muestra su banco anterior.
  const ficha = decision.status === 'ok' ? fichaVigente(decision.code) : null
  return {
    ok: true,
    alreadyTaken: !!test.takenAt,
    bank: ficha
      ? {
          version: kind === 'psych' ? ficha.competencias.version : ficha.practico.version,
          label: ficha.label,
          questions: preguntasVisibles(ficha, kind),
        }
      : null,
    // El back decide qué examen se muestra; el front no reinterpreta el
    // puesto. Al candidato no se le dice el motivo de una revisión.
    roleCheck:
      decision.status === 'ok'
        ? { status: 'ok' as const, roleCode: decision.code }
        : { status: decision.status === 'review' ? ('review' as const) : decision.status },
    test: {
      id: test.id,
      testName: test.testName,
      assignedAt: test.assignedAt,
      takenAt: test.takenAt,
    },
    candidate: {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
    },
  }
}

// Respuesta de los submit públicos: confirma recepción y nada más.
export const PUBLIC_SUBMIT_RESPONSE = { ok: true } as const
export const PUBLIC_DUPLICATE_RESPONSE = {
  error: 'Esta evaluación ya fue completada',
  alreadyTaken: true,
} as const
