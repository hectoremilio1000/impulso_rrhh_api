import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'previous_jobs'

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

      // Empresa / puesto
      table.string('company_name').nullable()
      table.string('role_title', 120).nullable()

      // Fechas
      table.date('start_date').nullable()
      table.date('end_date').nullable()
      table.boolean('is_current').nullable().defaultTo(false)

      // Compensación (opcional)
      table.decimal('base_salary', 12, 2).nullable()
      table.decimal('weekly_tips', 12, 2).nullable()

      // Referencia laboral
      table.string('ref_contact_name', 160).nullable()
      table.string('ref_contact_phone', 40).nullable()
      table.string('ref_contact_email', 160).nullable()
      table.string('ref_relationship', 120).nullable()
      table.boolean('ref_consent').nullable().defaultTo(false)

      // Detalle
      table.text('responsibilities').nullable()
      table.text('achievements').nullable()
      table.text('separation_reason').nullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
