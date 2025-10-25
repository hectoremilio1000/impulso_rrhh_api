import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Candidate from '#models/candidate'

export default class CandidateAddressMedium extends BaseModel {
  public static table = 'candidate_address_media'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'candidate_id' }) declare candidateId: number

  @column({ columnName: 'media_type' }) declare mediaType: string
  @column() declare url: string
  @column() declare filename?: string | null
  @column({ columnName: 'size_bytes' }) declare sizeBytes?: number | bigint | string | null

  @column.dateTime({ columnName: 'captured_at' }) declare capturedAt?: DateTime | null
  @column() declare lat?: number | string | null
  @column() declare lng?: number | string | null
  @column() declare notes?: string | null

  @column.dateTime({ columnName: 'created_at' }) declare createdAt: DateTime
  @column.dateTime({ columnName: 'updated_at' }) declare updatedAt: DateTime

  @belongsTo(() => Candidate) declare candidate: BelongsTo<typeof Candidate>
}
