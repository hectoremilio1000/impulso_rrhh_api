import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'interviews'

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

      t.string('type', 16).notNullable() // phone|onsite|video
      t.timestamp('scheduled_at', { useTz: true }).notNullable()
      t.string('interviewer_name', 120).notNullable()
      t.string('location', 160).nullable()
      t.string('meeting_link', 250).nullable()

      t.string('outcome', 16).notNullable().defaultTo('pending') // pending|showed|no_show|passed|failed
      t.text('notes').nullable()

      t.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      t.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
