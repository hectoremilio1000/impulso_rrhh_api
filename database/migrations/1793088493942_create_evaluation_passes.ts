import { BaseSchema } from '@adonisjs/lucid/schema'

// Pase de evaluación presencial (2026-10-27).
//
// Recepción genera un pase (QR o código) cuando el candidato llega al
// restaurante; con él llena datos, referencias y los dos exámenes desde su
// celular o una tablet. Sólo agrega tablas y columnas nulables: los exámenes
// pendientes que ya existen no se tocan (quedan con evaluation_pass_id NULL y
// su comportamiento actual).
export default class extends BaseSchema {
  async up() {
    this.schema.createTable('evaluation_passes', (table) => {
      table.increments('id')
      // Sólo se guarda el hash del token del QR; el token completo lo ve
      // recepción al generarlo.
      table.string('token_hash', 64).notNullable().unique()
      table.string('short_code', 8).notNullable().unique()
      table.integer('restaurant_id').unsigned().notNullable()
      table.integer('created_by_user_id').unsigned().notNullable()
      // issued → in_progress → completed
      table.string('status', 16).notNullable().defaultTo('issued')
      // Se puede reclamar (pulsar "Comenzar") sólo con claim_open y antes de
      // claim_deadline_at. Una vez iniciado, el vencimiento ya no corta nada.
      table.boolean('claim_open').notNullable().defaultTo(true)
      table.timestamp('claim_deadline_at').notNullable()
      table.timestamp('started_at').nullable()
      table.timestamp('completed_at').nullable()
      table.integer('candidate_id').unsigned().nullable().index()
      // Una sesión de navegador por intento (hash del secreto que guarda ese
      // navegador). No es identificación del dispositivo.
      table.string('session_hash', 64).nullable()
      table.string('session_device', 10).nullable()
      table.timestamp('session_claimed_at').nullable()
      table.timestamp('last_seen_at').nullable()
      table.text('step1_draft_json', 'longtext').nullable()
      // Interrupciones (informativo): conteos y tiempos, nunca contenido.
      table.text('signals_json', 'longtext').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })

    this.schema.createTable('evaluation_pass_events', (table) => {
      table.increments('id')
      table.integer('pass_id').unsigned().notNullable().index()
      table.string('type', 30).notNullable()
      table.integer('actor_user_id').unsigned().nullable()
      table.text('reason').nullable()
      table.text('data_json').nullable()
      table.timestamp('created_at').notNullable()
    })

    for (const t of ['psych_tests', 'practical_tests']) {
      this.schema.alterTable(t, (table) => {
        table.integer('evaluation_pass_id').unsigned().nullable().index()
        // Avance guardado en el servidor mientras el examen no se envía.
        table.text('draft_json', 'longtext').nullable()
        table.timestamp('draft_updated_at').nullable()
      })
    }

    // Modo presencial por restaurante (la tabla restaurants es de otro
    // servicio: la configuración de RRHH vive aparte).
    this.schema.createTable('rrhh_restaurant_settings', (table) => {
      table.integer('restaurant_id').unsigned().primary()
      table.boolean('in_person_only').notNullable().defaultTo(false)
      table.integer('updated_by_user_id').unsigned().nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })

    // Piloto: La Llorona en modo presencial.
    this.defer(async (db) => {
      const r = await db.from('restaurants').where('slug', 'la-llorona').first()
      if (!r) return
      const exists = await db.from('rrhh_restaurant_settings').where('restaurant_id', r.id).first()
      if (!exists) {
        await db.table('rrhh_restaurant_settings').insert({
          restaurant_id: r.id,
          in_person_only: true,
          created_at: new Date(),
          updated_at: new Date(),
        })
      }
    })
  }

  async down() {
    this.schema.dropTable('rrhh_restaurant_settings')
    for (const t of ['psych_tests', 'practical_tests']) {
      this.schema.alterTable(t, (table) => {
        table.dropColumn('draft_updated_at')
        table.dropColumn('draft_json')
        table.dropColumn('evaluation_pass_id')
      })
    }
    this.schema.dropTable('evaluation_pass_events')
    this.schema.dropTable('evaluation_passes')
  }
}
