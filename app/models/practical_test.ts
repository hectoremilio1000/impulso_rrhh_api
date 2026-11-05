import { DateTime } from 'luxon'
import type { ReviewLogEntry } from '#services/role_catalog'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PracticalTest extends BaseModel {
  static table = 'practical_tests'

  @column({ isPrimary: true }) declare id: number
  @column() declare candidateId: number

  @column() declare roleCode: string
  @column() declare testName: string

  @column({ columnName: 'access_token' }) declare accessToken: string | null

  @column.dateTime({ columnName: 'assigned_at' }) declare assignedAt: DateTime
  @column.dateTime({ columnName: 'taken_at' }) declare takenAt: DateTime | null

  @column() declare score: number | null
  @column() declare passed: boolean | null
  // ✅ IMPORTANT: stringify/parse para MySQL
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

  @column.dateTime({ columnName: 'created_at', autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Ver migración add_review_columns_to_tests y role_catalog.
  @column() declare instrument?: string | null
  @column({ columnName: 'bank_fingerprint' }) declare bankFingerprint?: string | null
  @column({ columnName: 'superseded_by_id' }) declare supersededById?: number | null
  @column({
    columnName: 'review_log_json',
    prepare: (v) => (v === null || v === undefined ? null : JSON.stringify(v)),
    consume: (v) => {
      if (v === null || v === undefined) return null
      if (typeof v === 'string') {
        try {
          return JSON.parse(v)
        } catch {
          return null
        }
      }
      return v
    },
  })
  declare reviewLogJson: ReviewLogEntry[] | null

  // Pase presencial: si existe, el examen sólo se abre con la sesión del pase.
  @column({ columnName: 'evaluation_pass_id' }) declare evaluationPassId?: number | null
  // Avance guardado en el servidor mientras no se envía (no son respuestas
  // finales: no se califican).
  @column({
    columnName: 'draft_json',
    serializeAs: null,
    prepare: (v) => (v === null || v === undefined ? null : JSON.stringify(v)),
    consume: (v) => (typeof v === 'string' ? JSON.parse(v) : (v ?? null)),
  })
  declare draftJson?: Record<string, string> | null
  @column.dateTime({ columnName: 'draft_updated_at', serializeAs: null })
  declare draftUpdatedAt?: DateTime | null
}
