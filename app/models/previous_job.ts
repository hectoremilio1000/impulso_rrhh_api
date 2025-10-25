import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Candidate from '#models/candidate'

export default class PreviousJob extends BaseModel {
  public static table = 'previous_jobs'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'candidate_id' }) declare candidateId: number

  @column({ columnName: 'company_name' }) declare companyName?: string | null
  @column({ columnName: 'role_title' }) declare roleTitle?: string | null

  @column({ columnName: 'start_date' }) declare startDate?: string | null // YYYY-MM-DD
  @column({ columnName: 'end_date' }) declare endDate?: string | null // YYYY-MM-DD
  @column({ columnName: 'is_current' }) declare isCurrent?: boolean | null

  @column({ columnName: 'base_salary' }) declare baseSalary?: number | string | null
  @column({ columnName: 'weekly_tips' }) declare weeklyTips?: number | string | null

  @column({ columnName: 'ref_contact_name' }) declare refContactName?: string | null
  @column({ columnName: 'ref_contact_phone' }) declare refContactPhone?: string | null
  @column({ columnName: 'ref_contact_email' }) declare refContactEmail?: string | null
  @column({ columnName: 'ref_relationship' }) declare refRelationship?: string | null
  @column({ columnName: 'ref_consent' }) declare refConsent?: boolean | null

  @column() declare responsibilities?: string | null
  @column() declare achievements?: string | null
  @column({ columnName: 'separation_reason' }) declare separationReason?: string | null

  @column.dateTime({ columnName: 'created_at' }) declare createdAt: DateTime
  @column.dateTime({ columnName: 'updated_at' }) declare updatedAt: DateTime

  @belongsTo(() => Candidate) declare candidate: BelongsTo<typeof Candidate>
}
