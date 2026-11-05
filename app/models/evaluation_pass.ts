import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export type PassStatus = 'issued' | 'in_progress' | 'completed'
export type PassDevice = 'phone' | 'tablet'

export default class EvaluationPass extends BaseModel {
  public static table = 'evaluation_passes'

  @column({ isPrimary: true }) declare id: number
  @column({ columnName: 'token_hash', serializeAs: null }) declare tokenHash: string
  @column({ columnName: 'short_code' }) declare shortCode: string
  @column({ columnName: 'restaurant_id' }) declare restaurantId: number
  @column({ columnName: 'created_by_user_id' }) declare createdByUserId: number
  @column() declare status: PassStatus
  @column({ columnName: 'claim_open' }) declare claimOpen: boolean
  @column.dateTime({ columnName: 'claim_deadline_at' }) declare claimDeadlineAt: DateTime
  @column.dateTime({ columnName: 'started_at' }) declare startedAt?: DateTime | null
  @column.dateTime({ columnName: 'completed_at' }) declare completedAt?: DateTime | null
  @column({ columnName: 'candidate_id' }) declare candidateId?: number | null
  @column({ columnName: 'session_hash', serializeAs: null }) declare sessionHash?: string | null
  @column({ columnName: 'session_device' }) declare sessionDevice?: PassDevice | null
  @column.dateTime({ columnName: 'session_claimed_at' }) declare sessionClaimedAt?: DateTime | null
  @column.dateTime({ columnName: 'last_seen_at' }) declare lastSeenAt?: DateTime | null
  @column({
    columnName: 'step1_draft_json',
    serializeAs: null,
    prepare: (v: unknown) => (v === null || v === undefined ? null : JSON.stringify(v)),
    consume: (v: unknown) => (typeof v === 'string' ? JSON.parse(v) : (v ?? null)),
  })
  declare step1Draft?: Record<string, unknown> | null
  @column({
    columnName: 'signals_json',
    prepare: (v: unknown) => (v === null || v === undefined ? null : JSON.stringify(v)),
    consume: (v: unknown) => (typeof v === 'string' ? JSON.parse(v) : (v ?? null)),
  })
  declare signals?: PassSignals | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime
}

// Interrupciones registradas en el navegador (informativo; nunca bloquea ni
// califica). Sin contenido del portapapeles: sólo cuántas veces y en qué
// pregunta se pegó texto.
export type PassSignals = {
  hiddenCount: number
  hiddenMs: number
  pasteCount: number
  pasteFields: string[]
  offlineCount: number
  offlineMs: number
  reloads: number
  stepMs: Record<string, number>
}
