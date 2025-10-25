import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'offers'

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

      t.decimal('salary_offer_mx', 12, 2).nullable()
      t.decimal('weekly_tips_offer_mx', 12, 2).nullable()
      t.string('role_offered', 120).nullable()
      t.date('start_date').nullable()
      t.string('status', 16).notNullable().defaultTo('made') // made|accepted|declined
      t.text('notes').nullable()

      t.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      t.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
