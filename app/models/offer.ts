import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Candidate from '#models/candidate'

export default class Offer extends BaseModel {
  public static table = 'offers'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'candidate_id' }) declare candidateId: number

  @column({ columnName: 'salary_offer_mx' }) declare salaryOfferMx?: number | string | null
  @column({ columnName: 'weekly_tips_offer_mx' }) declare weeklyTipsOfferMx?: number | string | null
  @column({ columnName: 'role_offered' }) declare roleOffered?: string | null
  @column({ columnName: 'start_date' }) declare startDate?: string | null // YYYY-MM-DD
  @column({ columnName: 'public_token' }) declare publicToken?: string | null
  @column() declare status: string // made|accepted|declined
  @column() declare notes?: string | null
  @column.dateTime({ columnName: 'responded_at' }) declare respondedAt?: DateTime | null
  @column({ columnName: 'responded_ip' }) declare respondedIp?: string | null

  @column.dateTime({ columnName: 'created_at' }) declare createdAt: DateTime
  @column.dateTime({ columnName: 'updated_at' }) declare updatedAt: DateTime

  @belongsTo(() => Candidate) declare candidate: BelongsTo<typeof Candidate>
}
