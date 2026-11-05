import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import EmploymentCheck from '#models/employment_check'

// Contratación real: alguien empezó a trabajar en un restaurante. La registra
// una persona con la fecha de ingreso; aceptar una oferta o una recomendación
// de la IA no la crean.
export const EXIT_TYPES = ['renuncia', 'despido', 'abandono', 'fin_de_contrato', 'otro'] as const
export type ExitType = (typeof EXIT_TYPES)[number]

export default class Employment extends BaseModel {
  public static table = 'employments'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'candidate_id' }) declare candidateId: number
  @column({ columnName: 'restaurant_id' }) declare restaurantId: number
  @column({ columnName: 'role_title' }) declare roleTitle: string
  @column({ columnName: 'role_code' }) declare roleCode?: string | null
  @column({ columnName: 'offer_id' }) declare offerId?: number | null
  @column.date({ columnName: 'start_date' }) declare startDate: DateTime
  @column({ columnName: 'hired_by_user_id' }) declare hiredByUserId: number
  @column.date({ columnName: 'end_date' }) declare endDate?: DateTime | null
  @column({ columnName: 'exit_type' }) declare exitType?: ExitType | null
  @column({ columnName: 'exit_reason' }) declare exitReason?: string | null
  @column({ columnName: 'exit_recorded_by_user_id' }) declare exitRecordedByUserId?: number | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @hasMany(() => EmploymentCheck) declare checks: HasMany<typeof EmploymentCheck>
}
