import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidate_stage_events'

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

      t.integer('stage_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('stages')
        .onDelete('RESTRICT')
        .index()

      t.timestamp('at', { useTz: true }).notNullable().defaultTo(this.now())
      t.integer('created_by').unsigned().nullable()
      t.string('via', 32).nullable()

      // ENTREVISTA (si stage.kind='interview')
      t.integer('interview_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('interviews')
        .onDelete('SET NULL')
        .index()
      t.timestamp('scheduled_at', { useTz: true }).nullable()
      t.string('interview_outcome', 16).nullable() // pending|showed|no_show|passed|failed

      // PSICOMÉTRICO (si stage.kind='psychometric')
      t.integer('psych_test_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('psych_tests')
        .onDelete('SET NULL')
        .index()
      t.string('test_name', 120).nullable()
      t.decimal('test_score', 6, 2).nullable()
      t.boolean('test_passed').nullable()

      // CONOCIMIENTOS (si stage.kind='knowledge')
      t.integer('knowledge_assignment_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('candidate_exam_assignments')
        .onDelete('SET NULL')
        .index()

      // DECISIÓN / OFERTA (si stage.kind='decision')
      t.integer('offer_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('offers')
        .onDelete('SET NULL')
        .index()
      t.string('decision', 20).nullable() // offer_made|hired|rejected|on_hold
      t.string('reason_code', 40).nullable() // salary_mismatch|no_show|...

      t.text('notes').nullable()
      t.json('extra').nullable()

      t.index(['candidate_id', 'at'])

      t.timestamp('created_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
