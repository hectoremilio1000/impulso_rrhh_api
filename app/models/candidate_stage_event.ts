import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Candidate from '#models/candidate'
import Stage from '#models/stage'
import Interview from '#models/interview'
import PsychTest from '#models/psych_test'
import Offer from '#models/offer'
import CandidateExamAssignment from '#models/candidate_exam_assignment'

export default class CandidateStageEvent extends BaseModel {
  public static table = 'candidate_stage_events'

  @column({ isPrimary: true }) declare id: number

  @column({ columnName: 'candidate_id' }) declare candidateId: number
  @column({ columnName: 'stage_id' }) declare stageId: number

  @column.dateTime({ columnName: 'at' }) declare at: DateTime
  @column({ columnName: 'created_by' }) declare createdBy?: number | null
  @column() declare via?: string | null

  // ENTREVISTA
  @column({ columnName: 'interview_id' }) declare interviewId?: number | null
  @column.dateTime({ columnName: 'scheduled_at' }) declare scheduledAt?: DateTime | null
  @column({ columnName: 'interview_outcome' }) declare interviewOutcome?: string | null

  // PSICOMÉTRICO
  @column({ columnName: 'psych_test_id' }) declare psychTestId?: number | null
  @column({ columnName: 'test_name' }) declare testName?: string | null
  @column({ columnName: 'test_score' }) declare testScore?: number | string | null
  @column({ columnName: 'test_passed' }) declare testPassed?: boolean | null

  // CONOCIMIENTOS
  @column({ columnName: 'knowledge_assignment_id' }) declare knowledgeAssignmentId?: number | null

  // DECISIÓN / OFERTA
  @column({ columnName: 'offer_id' }) declare offerId?: number | null
  @column() declare decision?: string | null
  @column({ columnName: 'reason_code' }) declare reasonCode?: string | null

  @column() declare notes?: string | null
  @column() declare extra?: any

  @column.dateTime({ columnName: 'created_at' }) declare createdAt: DateTime

  @belongsTo(() => Candidate) declare candidate: BelongsTo<typeof Candidate>
  @belongsTo(() => Stage) declare stage: BelongsTo<typeof Stage>
  @belongsTo(() => Interview, { foreignKey: 'interviewId' }) declare interview: BelongsTo<
    typeof Interview
  >
  @belongsTo(() => PsychTest, { foreignKey: 'psychTestId' }) declare psychTest: BelongsTo<
    typeof PsychTest
  >
  @belongsTo(() => Offer, { foreignKey: 'offerId' }) declare offer: BelongsTo<typeof Offer>
  @belongsTo(() => CandidateExamAssignment, { foreignKey: 'knowledgeAssignmentId' })
  declare knowledgeAssignment: BelongsTo<typeof CandidateExamAssignment>
}
