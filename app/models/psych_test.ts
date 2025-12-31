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
  @column({ columnName: 'access_token' }) declare accessToken?: string | null
  @column() declare score?: number | string | null
  @column() declare passed?: boolean | null
  @column({ columnName: 'report_url' }) declare reportUrl?: string | null
  @column() declare notes?: string | null

  @column({
    columnName: 'answers_json',
    prepare: (v) => (v === null || v === undefined ? null : JSON.stringify(v)),
    consume: (v) => {
      if (v === null || v === undefined) return null
      if (typeof v === 'string') {
        try {
          return JSON.parse(v)
        } catch {
          return v
        }
      }
      return v
    },
  })
  declare answersJson: any | null

  @column({
    columnName: 'ai_report_json',
    prepare: (v) => (v === null || v === undefined ? null : JSON.stringify(v)),
    consume: (v) => {
      if (v === null || v === undefined) return null
      if (typeof v === 'string') {
        try {
          return JSON.parse(v)
        } catch {
          return v
        }
      }
      return v
    },
  })
  declare aiReportJson: any | null

  @column.dateTime({ columnName: 'created_at' }) declare createdAt: DateTime
  @column.dateTime({ columnName: 'updated_at' }) declare updatedAt: DateTime

  @belongsTo(() => Candidate) declare candidate: BelongsTo<typeof Candidate>
}
