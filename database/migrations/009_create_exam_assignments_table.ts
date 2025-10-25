import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidate_exam_assignments'

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

      // Por ahora simple; luego podrás ligar a exam_templates, etc.
      t.string('exam_type', 16).notNullable().defaultTo('knowledge') // 'knowledge' | 'psychometric'
      t.string('label', 120).nullable() // nombre visible, ej. 'KNOW_BARTENDER_V1'
      t.string('status', 16).notNullable().defaultTo('assigned') // assigned|in_progress|completed|expired

      t.timestamp('assigned_at', { useTz: true }).notNullable().defaultTo(this.now())
      t.timestamp('due_at', { useTz: true }).nullable()
      t.timestamp('completed_at', { useTz: true }).nullable()

      t.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      t.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
