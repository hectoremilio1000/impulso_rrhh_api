import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'psych_tests'

  async up() {
    this.schema.createTable(this.tableName, (t) => {
      t.increments('id')

      t.integer('candidate_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('candidates')
        .onDelete('CASCADE')
        .index()

      t.string('test_name', 120).notNullable() // p.ej. 'DISC' o 'Bondad100'
      t.timestamp('assigned_at', { useTz: true }).notNullable().defaultTo(this.now())
      t.timestamp('taken_at', { useTz: true }).nullable()

      t.decimal('score', 6, 2).nullable()
      t.boolean('passed').nullable()
      t.string('report_url', 500).nullable()
      t.text('notes').nullable()

      t.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      t.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
