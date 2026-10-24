import { BaseSchema } from '@adonisjs/lucid/schema'

// Columnas para conservar con cada evaluación el puesto y el banco con que se
// presentó, el instrumento, el reemplazo por otra prueba y el registro de
// revisiones humanas. Todas nullable y sin backfill: en filas anteriores
// role_code/instrument se deducen de test_name (role_catalog.evaluatedRoleOf)
// y nada histórico se reescribe.
export default class extends BaseSchema {
  async up() {
    for (const table of ['psych_tests', 'practical_tests']) {
      this.schema.alterTable(table, (t) => {
        if (table === 'psych_tests') t.string('role_code', 32).nullable()
        t.string('instrument', 32).nullable()
        t.string('bank_fingerprint', 40).nullable()
        t.integer('superseded_by_id').unsigned().nullable()
        t.json('review_log_json').nullable()
      })
    }
  }

  async down() {
    for (const table of ['psych_tests', 'practical_tests']) {
      this.schema.alterTable(table, (t) => {
        if (table === 'psych_tests') t.dropColumn('role_code')
        t.dropColumn('instrument')
        t.dropColumn('bank_fingerprint')
        t.dropColumn('superseded_by_id')
        t.dropColumn('review_log_json')
      })
    }
  }
}
