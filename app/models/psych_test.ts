import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Candidate from '#models/candidate'

export default class PsychTest extends BaseModel {
  public static table = 'psych_tests'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'candidate_id' }) declare candidateId: number

  @column({ columnName: 'test_name' }) declare testName: string
  @column.dateTime({ columnName: 'assigned_at' }) declare assignedAt: DateTime
  @column.dateTime({ columnName: 'taken_at' }) declare takenAt?: DateTime | null
  @column() declare score?: number | string | null
  @column() declare passed?: boolean | null
  @column({ columnName: 'report_url' }) declare reportUrl?: string | null
  @column() declare notes?: string | null

  @column.dateTime({ columnName: 'created_at' }) declare createdAt: DateTime
  @column.dateTime({ columnName: 'updated_at' }) declare updatedAt: DateTime

  @belongsTo(() => Candidate) declare candidate: BelongsTo<typeof Candidate>
}
