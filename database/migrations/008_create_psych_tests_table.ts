import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'psych_tests'

  public async up() {
    this.schema.alterTable(this.tableName, (t) => {
      // Link público para que el candidato conteste el examen (sin login)
      t.string('access_token', 64).nullable()

      // Respuestas del candidato y reporte IA (MySQL JSON)
      t.json('answers_json').nullable()
      t.json('ai_report_json').nullable()

      // Índice único (nombre explícito para poder dropear en down)
      t.unique(['access_token'], 'uk_psych_tests_access_token')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (t) => {
      t.dropUnique(['access_token'], 'uk_psych_tests_access_token')
      t.dropColumn('access_token')
      t.dropColumn('answers_json')
      t.dropColumn('ai_report_json')
    })
  }
}
