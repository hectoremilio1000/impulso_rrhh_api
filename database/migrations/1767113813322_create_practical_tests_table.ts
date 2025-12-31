import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'practical_tests'

  public async up() {
    this.schema.createTable(this.tableName, (t) => {
      t.increments('id')

      t.integer('candidate_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('candidates')
        .onDelete('CASCADE')
        .index()

      // para saber de qué puesto es (waiter/captain/cook/barman/chef_manager)
      t.string('role_code', 32).notNullable()

      // nombre del test, ej: 'PRACTICAL_WAITER_V1'
      t.string('test_name', 120).notNullable()

      t.string('access_token', 64).nullable()
      t.unique(['access_token'], 'uk_practical_tests_access_token')

      t.timestamp('assigned_at', { useTz: true }).notNullable().defaultTo(this.now())
      t.timestamp('taken_at', { useTz: true }).nullable()

      t.decimal('score', 6, 2).nullable()
      t.boolean('passed').nullable()

      t.json('answers_json').nullable()
      t.json('ai_report_json').nullable()

      t.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      t.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
