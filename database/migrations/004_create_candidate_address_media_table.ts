// database/migrations/1752100000001_create_candidate_address_media_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidate_address_media'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('candidate_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('candidates')
        .onDelete('CASCADE')
        .index()

      // Tipo de evidencia (libre por ahora: 'facade' | 'entrance' | 'room' | 'other' ...)
      table.string('media_type').notNullable()

      // Archivo en FTPS (público o firmado, según config)
      table.string('url').notNullable()
      table.string('filename', 180).nullable()

      table.bigint('size_bytes').nullable()

      // Cuándo se capturó (si lo tomas desde la app)
      table.timestamp('captured_at', { useTz: true }).nullable()

      // Geoloc del archivo (si lo capturas desde móvil y quieres guardar)
      table.decimal('lat', 10, 6).nullable()
      table.decimal('lng', 10, 6).nullable()

      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
