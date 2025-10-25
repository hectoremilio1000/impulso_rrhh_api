import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Candidate from '#models/candidate'

export default class CandidateExamAssignment extends BaseModel {
  public static table = 'candidate_exam_assignments'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'candidate_id' }) declare candidateId: number

  @column({ columnName: 'exam_type' }) declare examType: string // knowledge|psychometric
  @column() declare label?: string | null
  @column() declare status: string // assigned|in_progress|completed|expired
  @column.dateTime({ columnName: 'assigned_at' }) declare assignedAt: DateTime
  @column.dateTime({ columnName: 'due_at' }) declare dueAt?: DateTime | null
  @column.dateTime({ columnName: 'completed_at' }) declare completedAt?: DateTime | null

  @column.dateTime({ columnName: 'created_at' }) declare createdAt: DateTime
  @column.dateTime({ columnName: 'updated_at' }) declare updatedAt: DateTime

  @belongsTo(() => Candidate) declare candidate: BelongsTo<typeof Candidate>
}
