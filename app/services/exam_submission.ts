import db from '@adonisjs/lucid/services/db'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'
import PsychTest from '#models/psych_test'
import PracticalTest from '#models/practical_test'
import type Candidate from '#models/candidate'
import { gradePsychExam, PSYCH_GRADING_VERSION } from '#services/psych_exam_grader'
import { gradePracticalExam, PRACTICAL_GRADING_VERSION } from '#services/practical_grader'
import { fingerprintAnswers } from '#services/bank_fingerprint'
import {
  CURRENT_BANK_FINGERPRINT,
  ROLE_LABEL_ES,
  bankVersionFromTestName,
  decideEvaluationRole,
  type ExamKind,
  type RoleCode,
} from '#services/role_catalog'

// Envío y calificación de los dos exámenes (psicométrico y práctico).
//
// 1. Las respuestas se guardan con una reserva atómica (UPDATE … WHERE
//    taken_at IS NULL): un doble clic o dos pestañas no producen dos
//    calificaciones ni pisan respuestas; el segundo envío recibe 409.
// 2. Sólo se califica si el puesto y el banco contestado coinciden con los
//    asignados (decideEvaluationRole). Si no, queda "requiere revisión".
// 3. Si la calificación falla, las respuestas ya están guardadas y el reporte
//    queda en grading_failed para calificarlo después desde el admin.

type AnyTest = PsychTest | PracticalTest

const TABLE: Record<ExamKind, string> = { psych: 'psych_tests', practical: 'practical_tests' }

export type SubmitOutcome = 'saved' | 'duplicate'

export async function submitExam(input: {
  kind: ExamKind
  test: AnyTest
  candidate: Candidate
  answers: unknown
  shownRoleCode: string | null
}): Promise<SubmitOutcome> {
  const { kind, test, candidate, answers, shownRoleCode } = input
  const fingerprint = fingerprintAnswers(answers)

  // Hora del servidor de base de datos, igual que los defaults de las tablas.
  const result = await db
    .from(TABLE[kind])
    .where('id', test.id)
    .whereNull('taken_at')
    .update({
      taken_at: db.knexRawQuery('CURRENT_TIMESTAMP'),
      answers_json: JSON.stringify(answers),
      bank_fingerprint: fingerprint,
      updated_at: db.knexRawQuery('CURRENT_TIMESTAMP'),
    })
  const affected = Array.isArray(result) ? Number(result[0]) : Number(result)
  if (!affected) return 'duplicate'
  await test.refresh()

  const decision = decideEvaluationRole({
    kind,
    test: testRoleInput(kind, test),
    desiredRole: candidate.desiredRole,
    shownRoleCode,
    answersFingerprint: fingerprint,
  })

  if (decision.status !== 'ok') {
    logger.warn(
      { kind, testId: test.id, candidateId: candidate.id, decision },
      'submitExam: respuestas guardadas sin calificar, requiere revisión'
    )
    test.aiReportJson = {
      status: 'role_review_required',
      roleCheck: { ...decision, desiredRoleAtSubmit: candidate.desiredRole ?? null },
    }
    await test.save()
    return 'saved'
  }

  await gradeAndSave({
    kind,
    test,
    candidate,
    roleCode: decision.code,
    answers,
    context: { desiredRoleAtSubmit: candidate.desiredRole ?? null, shownRoleCode },
  })
  return 'saved'
}

// Califica con el puesto indicado y guarda reporte + contexto. Nunca lanza:
// una falla deja status grading_failed con las respuestas intactas.
export async function gradeAndSave(input: {
  kind: ExamKind
  test: AnyTest
  candidate: Candidate
  roleCode: RoleCode
  answers: unknown
  context: Record<string, unknown>
}): Promise<void> {
  const { kind, test, candidate, roleCode, answers, context } = input
  try {
    const graded =
      kind === 'psych'
        ? await gradePsychExam(ROLE_LABEL_ES[roleCode], answers, candidate.id)
        : await gradePracticalExam(roleCode, answers)

    test.aiReportJson = {
      ...graded.aiReport,
      evaluationContext: {
        roleCode,
        roleLabel: ROLE_LABEL_ES[roleCode],
        testName: test.testName,
        bankVersion: bankVersionFromTestName(test.testName),
        bankFingerprint: test.bankFingerprint ?? null,
        bankIsCurrent: test.bankFingerprint === CURRENT_BANK_FINGERPRINT[kind][roleCode],
        grading: kind === 'psych' ? PSYCH_GRADING_VERSION : PRACTICAL_GRADING_VERSION,
        gradedAt: DateTime.now().toISO(),
        ...context,
      },
    }
    test.score = graded.score
    test.passed = graded.passed
  } catch (err: any) {
    logger.error({ kind, testId: test.id, err: err?.message }, 'gradeAndSave: falló la calificación')
    test.aiReportJson = {
      status: 'grading_failed',
      note: 'Respuestas guardadas; la calificación falló y puede repetirse desde el admin.',
    }
  }
  await test.save()
}

export function testRoleInput(kind: ExamKind, test: AnyTest) {
  return {
    instrument: test.instrument ?? null,
    roleCode: kind === 'psych' ? ((test as PsychTest).roleCode ?? null) : (test as PracticalTest).roleCode,
    testName: test.testName,
    supersededById: test.supersededById ?? null,
    reviewLog: test.reviewLogJson ?? null,
  }
}
