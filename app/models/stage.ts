import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Candidate from '#models/candidate'
import CandidateStageEvent from '#models/candidate_stage_event'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Stage extends BaseModel {
  public static table = 'stages'

  @column({ isPrimary: true }) declare id: number

  @column() declare code: string
  @column() declare name: string
  @column() declare kind: string // generic|interview|psychometric|knowledge|decision
  @column({ columnName: 'is_terminal' }) declare isTerminal: boolean
  @column({ columnName: 'sort_order' }) declare sortOrder: number

  @column.dateTime({ columnName: 'created_at' }) declare createdAt: DateTime
  @column.dateTime({ columnName: 'updated_at' }) declare updatedAt: DateTime

  @hasMany(() => Candidate, { foreignKey: 'currentStageId' })
  declare candidates: HasMany<typeof Candidate>

  @hasMany(() => CandidateStageEvent, { foreignKey: 'stageId' })
  declare events: HasMany<typeof CandidateStageEvent>
}
