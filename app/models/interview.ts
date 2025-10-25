import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Candidate from '#models/candidate'

export default class Interview extends BaseModel {
  public static table = 'interviews'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'candidate_id' }) declare candidateId: number

  @column() declare type: string // phone|onsite|video
  @column.dateTime({ columnName: 'scheduled_at' }) declare scheduledAt: DateTime
  @column({ columnName: 'interviewer_name' }) declare interviewerName: string
  @column() declare location?: string | null
  @column({ columnName: 'meeting_link' }) declare meetingLink?: string | null
  @column() declare outcome: string // pending|showed|no_show|passed|failed
  @column() declare notes?: string | null

  @column.dateTime({ columnName: 'created_at' }) declare createdAt: DateTime
  @column.dateTime({ columnName: 'updated_at' }) declare updatedAt: DateTime

  @belongsTo(() => Candidate) declare candidate: BelongsTo<typeof Candidate>
}
