import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

// Verificación a 30, 90 o 180 días de que la persona sigue trabajando.
export const CHECK_MILESTONES = [30, 90, 180] as const

export default class EmploymentCheck extends BaseModel {
  public static table = 'employment_checks'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'employment_id' }) declare employmentId: number
  @column({ columnName: 'milestone_days' }) declare milestoneDays: number
  @column({ columnName: 'still_employed' }) declare stillEmployed: boolean
  @column.date({ columnName: 'checked_on' }) declare checkedOn: DateTime
  @column({ columnName: 'checked_by_user_id' }) declare checkedByUserId: number
  @column() declare notes?: string | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' }) declare createdAt: DateTime
}
