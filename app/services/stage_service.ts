import db from '@adonisjs/lucid/services/db'
import Candidate from '#models/candidate'
import Stage from '#models/stage'
import CandidateStageEvent from '#models/candidate_stage_event'
import { DateTime } from 'luxon'

type Input = {
  stageId?: number
  stageCode?: string
  via?: string
  notes?: string
  extra?: any
  interviewId?: number | null
  scheduledAt?: Date | string | null
  interviewOutcome?: string | null
  psychTestId?: number | null
  testName?: string | null
  testScore?: number | string | null
  testPassed?: boolean | null
  knowledgeAssignmentId?: number | null
  offerId?: number | null
  decision?: string | null
  reasonCode?: string | null
}

function toDateTime(v?: string | Date | null) {
  if (!v) return null
  if (v instanceof Date) return DateTime.fromJSDate(v)

  // intenta varios formatos comunes
  let dt = DateTime.fromISO(String(v))
  if (!dt.isValid) dt = DateTime.fromRFC2822(String(v))
  if (!dt.isValid) dt = DateTime.fromSQL(String(v))

  return dt.isValid ? dt : null
}

const REQUIRED_BY_KIND: Record<string, Array<keyof Input>> = {
  interview: ['interviewId'], // puedes agregar 'scheduledAt' si quieres
  psychometric: ['psychTestId'], // o 'testName'
  knowledge: ['knowledgeAssignmentId'],
  decision: [], // normalmente decision/offerId son opcionales
  generic: [],
}

export async function setStageTx(candidateId: number, input: Input, createdBy?: number | null) {
  return db.transaction(async (trx) => {
    const candidate = await Candidate.query({ client: trx }).where('id', candidateId).firstOrFail()

    // Resolver stage
    let stage = null as null | Stage
    if (input.stageId) {
      stage = await Stage.query({ client: trx }).where('id', input.stageId).firstOrFail()
    } else if (input.stageCode) {
      stage = await Stage.query({ client: trx }).where('code', input.stageCode).firstOrFail()
    } else {
      throw new Error('Debes enviar stageId o stageCode')
    }

    // Validación por kind (opcional/futuro)
    const required = REQUIRED_BY_KIND[stage.kind] || []
    for (const k of required) {
      const v = (input as any)[k]
      if (v === undefined || v === null || v === '') {
        throw new Error(`Para etapas de tipo "${stage.kind}" debes enviar: ${required.join(', ')}`)
      }
    }

    candidate.currentStageId = stage.id
    await candidate.save()

    await CandidateStageEvent.create(
      {
        candidateId,
        stageId: stage.id,
        at: DateTime.now(),
        createdBy: createdBy ?? null,
        via: input.via ?? null,
        notes: input.notes ?? null,
        extra: input.extra ?? null,

        interviewId: input.interviewId ?? null,
        scheduledAt: toDateTime(input.scheduledAt),
        interviewOutcome: input.interviewOutcome ?? null,

        psychTestId: input.psychTestId ?? null,
        testName: input.testName ?? null,
        testScore: input.testScore ?? null,
        testPassed: input.testPassed ?? null,

        knowledgeAssignmentId: input.knowledgeAssignmentId ?? null,

        offerId: input.offerId ?? null,
        decision: input.decision ?? null,
        reasonCode: input.reasonCode ?? null,
      },
      { client: trx }
    )

    return { ok: true, candidateId, stageId: stage.id }
  })
}
