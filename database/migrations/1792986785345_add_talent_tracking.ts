import { BaseSchema } from '@adonisjs/lucid/schema'

// Seguimiento de Impulso + Talento (piloto La Llorona, 2026-10-25).
// Sólo agrega columnas nulables, tablas nuevas y etapas nuevas del catálogo;
// no modifica ni borra datos existentes.
//
// - Restaurante de cada registro (restaurants.id de Impulso; La Llorona = 1).
// - Datos de permanencia DECLARADOS por el candidato, descriptivos: no se usan
//   para descartar en automático.
// - Entrevista: cita (scheduled_at) separada de entrevista realizada (held_at).
// - Contratación y salida en `employments`, con responsable y fechas.
// - Idempotencia de eventos que llegan de otros sistemas (external_ref).
const NEW_STAGES = [
  { code: 'arrived', name: 'Llegó a la cita', kind: 'interview', sort_order: 35 },
  { code: 'no_show', name: 'No asistió a la cita', kind: 'interview', sort_order: 36 },
  { code: 'evaluation_submitted', name: 'Evaluación presentada', kind: 'generic', sort_order: 45 },
  { code: 'offer_accepted', name: 'Oferta aceptada', kind: 'decision', sort_order: 112 },
  { code: 'offer_declined', name: 'Oferta rechazada', kind: 'decision', sort_order: 114 },
  { code: 'exited', name: 'Baja', kind: 'decision', sort_order: 125 },
]

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('candidates', (table) => {
      table.integer('restaurant_id').unsigned().nullable()
      table.smallint('commute_minutes_approx').unsigned().nullable()
      table.string('schedule_availability', 255).nullable()
      table.boolean('accepts_vacancy_conditions').nullable()
      table.text('vacancy_conditions_seen').nullable()
      table.timestamp('conditions_answered_at').nullable()
      // Aceptación del aviso de privacidad (versión del texto aceptado).
      table.timestamp('privacy_consent_at').nullable()
      table.string('privacy_consent_version', 20).nullable()
    })

    this.schema.alterTable('interviews', (table) => {
      table.integer('restaurant_id').unsigned().nullable()
      table.timestamp('held_at').nullable()
      table.integer('interviewer_user_id').unsigned().nullable()
      table.integer('recorded_by_user_id').unsigned().nullable()
    })

    this.schema.alterTable('offers', (table) => {
      table.integer('restaurant_id').unsigned().nullable()
      table.integer('created_by_user_id').unsigned().nullable()
    })

    this.schema.alterTable('candidate_stage_events', (table) => {
      table.integer('restaurant_id').unsigned().nullable()
      table.string('external_ref', 80).nullable().unique()
    })

    this.schema.createTable('employments', (table) => {
      table.increments('id')
      table.integer('candidate_id').unsigned().notNullable().index()
      table.integer('restaurant_id').unsigned().notNullable()
      table.string('role_title', 120).notNullable()
      table.string('role_code', 40).nullable()
      table.integer('offer_id').unsigned().nullable()
      table.date('start_date').notNullable()
      table.integer('hired_by_user_id').unsigned().notNullable()
      table.date('end_date').nullable()
      table.string('exit_type', 20).nullable()
      table.text('exit_reason').nullable()
      table.integer('exit_recorded_by_user_id').unsigned().nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })

    // Verificaciones a 30, 90 y 180 días: "¿sigue trabajando?" confirmado por
    // una persona, con fecha y responsable.
    this.schema.createTable('employment_checks', (table) => {
      table.increments('id')
      table.integer('employment_id').unsigned().notNullable().index()
      table.smallint('milestone_days').unsigned().notNullable()
      table.boolean('still_employed').notNullable()
      table.date('checked_on').notNullable()
      table.integer('checked_by_user_id').unsigned().notNullable()
      table.text('notes').nullable()
      table.timestamp('created_at').notNullable()
      table.unique(['employment_id', 'milestone_days'])
    })

    this.defer(async (db) => {
      for (const s of NEW_STAGES) {
        const exists = await db.from('stages').where('code', s.code).first()
        if (!exists) {
          await db.table('stages').insert({
            ...s,
            is_terminal: s.code === 'exited',
            created_at: new Date(),
            updated_at: new Date(),
          })
        }
      }
    })
  }

  async down() {
    this.defer(async (db) => {
      await db
        .from('stages')
        .whereIn(
          'code',
          NEW_STAGES.map((s) => s.code)
        )
        .delete()
    })
    this.schema.dropTable('employment_checks')
    this.schema.dropTable('employments')
    this.schema.alterTable('candidate_stage_events', (table) => {
      table.dropUnique(['external_ref'])
      table.dropColumn('external_ref')
      table.dropColumn('restaurant_id')
    })
    this.schema.alterTable('offers', (table) => {
      table.dropColumn('created_by_user_id')
      table.dropColumn('restaurant_id')
    })
    this.schema.alterTable('interviews', (table) => {
      table.dropColumn('recorded_by_user_id')
      table.dropColumn('interviewer_user_id')
      table.dropColumn('held_at')
      table.dropColumn('restaurant_id')
    })
    this.schema.alterTable('candidates', (table) => {
      table.dropColumn('privacy_consent_version')
      table.dropColumn('privacy_consent_at')
      table.dropColumn('conditions_answered_at')
      table.dropColumn('vacancy_conditions_seen')
      table.dropColumn('accepts_vacancy_conditions')
      table.dropColumn('schedule_availability')
      table.dropColumn('commute_minutes_approx')
      table.dropColumn('restaurant_id')
    })
  }
}
