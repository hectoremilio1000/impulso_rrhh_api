// database/migrations/1752100000000_create_candidates_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Identidad
      table.string('first_name', 120).notNullable().index()
      table.string('last_name', 120).notNullable().index()

      // Contacto
      table.string('email', 160).nullable().unique()
      table.string('phone', 40).nullable().index()
      table.string('whatsapp', 40).nullable().index()

      // Perfil
      table.string('desired_role', 120).nullable()
      table.decimal('salary_expectation', 12, 2).nullable()
      table.decimal('desired_weekly_tips', 12, 2).nullable() // propinas semanales deseadas

      // Dirección (normalizada)
      table.string('street', 160).nullable()
      table.string('ext_number', 40).nullable()
      table.string('int_number', 40).nullable()
      table.string('neighborhood', 120).nullable() // colonia / barrio
      table.string('city', 120).nullable()
      table.string('state', 120).nullable()
      table.string('postal_code', 10).nullable()
      table.string('country', 80).nullable()

      // Geo opcional (si más adelante haces geocoding o guardas Maps)
      table.decimal('lat', 10, 6).nullable()
      table.decimal('lng', 10, 6).nullable()
      table.string('maps_place_id', 120).nullable()

      // Origen y estado del pipeline como STRING (lo controlas en front/model)
      table.string('source', 50).nullable() //temas de donde llego su perfil
      table
        .integer('current_stage_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('stages')
        .onDelete('SET NULL')
        .index()

      table.text('notes').nullable()

      // Índices compuestos útiles para búsqueda por zona
      table.index(['city', 'state'])
      table.index(['postal_code'])
      table.index(['neighborhood'])

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
