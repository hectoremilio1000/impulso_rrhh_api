import { BaseSchema } from '@adonisjs/lucid/schema'

// Usuarios del panel de reclutamiento y sus tokens de acceso (reemplazan la
// llave compartida X-Admin-Token). Tablas nuevas: no tocan datos existentes.
export default class extends BaseSchema {
  async up() {
    this.schema.createTable('users', (table) => {
      table.increments('id')
      table.string('email', 160).notNullable().unique()
      table.string('full_name', 160).notNullable()
      table.string('password', 255).notNullable()
      table.string('role', 20).notNullable().defaultTo('recruiter')
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })

    this.schema.createTable('auth_access_tokens', (table) => {
      table.increments('id')
      table
        .integer('tokenable_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('type', 40).notNullable()
      table.string('name', 120).nullable()
      table.string('hash', 255).notNullable()
      table.text('abilities').notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('last_used_at').nullable()
      table.timestamp('expires_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable('auth_access_tokens')
    this.schema.dropTable('users')
  }
}
