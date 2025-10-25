import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Stage from '#models/stage'
import CandidateCvFile from '#models/candidate_cv_file'
import CandidateAddressMedium from '#models/candidate_address_medium'
import PreviousJob from '#models/previous_job'
import Interview from '#models/interview'
import Offer from '#models/offer'
import PsychTest from '#models/psych_test'
import CandidateExamAssignment from '#models/candidate_exam_assignment'
import CandidateStageEvent from '#models/candidate_stage_event'

export default class Candidate extends BaseModel {
  public static table = 'candidates'

  @column({ isPrimary: true }) declare id: number

  // Identidad
  @column({ columnName: 'first_name' }) declare firstName: string
  @column({ columnName: 'last_name' }) declare lastName: string

  // Contacto
  @column() declare email?: string | null
  @column() declare phone?: string | null
  @column() declare whatsapp?: string | null

  // Perfil
  @column({ columnName: 'desired_role' }) declare desiredRole?: string | null
  @column({ columnName: 'salary_expectation' }) declare salaryExpectation?: number | string | null
  @column({ columnName: 'desired_weekly_tips' }) declare desiredWeeklyTips?: number | string | null

  // Dirección
  @column() declare street?: string | null
  @column({ columnName: 'ext_number' }) declare extNumber?: string | null
  @column({ columnName: 'int_number' }) declare intNumber?: string | null
  @column() declare neighborhood?: string | null
  @column() declare city?: string | null
  @column() declare state?: string | null
  @column({ columnName: 'postal_code' }) declare postalCode?: string | null
  @column() declare country?: string | null

  // Geo
  @column() declare lat?: number | string | null
  @column() declare lng?: number | string | null
  @column({ columnName: 'maps_place_id' }) declare mapsPlaceId?: string | null

  // Origen y stage
  @column() declare source?: string | null
  @column({ columnName: 'current_stage_id' }) declare currentStageId?: number | null
  @belongsTo(() => Stage, { foreignKey: 'currentStageId' }) declare currentStage: BelongsTo<
    typeof Stage
  >

  @column() declare notes?: string | null

  @column.dateTime({ columnName: 'created_at' }) declare createdAt: DateTime
  @column.dateTime({ columnName: 'updated_at' }) declare updatedAt: DateTime

  // Relaciones
  @hasMany(() => CandidateCvFile) declare cvFiles: HasMany<typeof CandidateCvFile>
  @hasMany(() => CandidateAddressMedium) declare addressMedia: HasMany<
    typeof CandidateAddressMedium
  >
  @hasMany(() => PreviousJob) declare previousJobs: HasMany<typeof PreviousJob>
  @hasMany(() => Interview) declare interviews: HasMany<typeof Interview>
  @hasMany(() => Offer) declare offers: HasMany<typeof Offer>
  @hasMany(() => PsychTest) declare psychTests: HasMany<typeof PsychTest>
  @hasMany(() => CandidateExamAssignment) declare examAssignments: HasMany<
    typeof CandidateExamAssignment
  >
  @hasMany(() => CandidateStageEvent) declare stageEvents: HasMany<typeof CandidateStageEvent>
}
