import { BaseSchema } from '@adonisjs/lucid/schema'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSchema {
  protected tableName = 'psych_tests'

  private async hasColumn(column: string) {
    const res = await db.rawQuery(
      `
      SELECT COUNT(*) as cnt
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
      `,
      [this.tableName, column]
    )
    const row = res[0]?.[0] ?? res[0]
    return Number(row?.cnt ?? 0) > 0
  }

  private async hasIndex(indexName: string) {
    const res = await db.rawQuery(
      `
      SELECT COUNT(*) as cnt
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND INDEX_NAME = ?
      `,
      [this.tableName, indexName]
    )
    const row = res[0]?.[0] ?? res[0]
    return Number(row?.cnt ?? 0) > 0
  }

  public async up() {
    const hasToken = await this.hasColumn('access_token')
    const hasAnswers = await this.hasColumn('answers_json')
    const hasAi = await this.hasColumn('ai_report_json')

    if (!hasToken || !hasAnswers || !hasAi) {
      await this.schema.alterTable(this.tableName, (table) => {
        if (!hasToken) table.string('access_token', 64).nullable()
        if (!hasAnswers) table.json('answers_json').nullable()
        if (!hasAi) table.json('ai_report_json').nullable()
      })
    }

    const hasUk = await this.hasIndex('uk_psych_tests_access_token')
    if (!hasUk) {
      await this.schema.alterTable(this.tableName, (table) => {
        table.unique(['access_token'], 'uk_psych_tests_access_token')
      })
    }
  }

  public async down() {
    const hasUk = await this.hasIndex('uk_psych_tests_access_token')
    if (hasUk) {
      await this.schema.alterTable(this.tableName, (table) => {
        table.dropUnique(['access_token'], 'uk_psych_tests_access_token')
      })
    }

    const hasToken = await this.hasColumn('access_token')
    const hasAnswers = await this.hasColumn('answers_json')
    const hasAi = await this.hasColumn('ai_report_json')

    if (hasToken || hasAnswers || hasAi) {
      await this.schema.alterTable(this.tableName, (table) => {
        if (hasToken) table.dropColumn('access_token')
        if (hasAnswers) table.dropColumn('answers_json')
        if (hasAi) table.dropColumn('ai_report_json')
      })
    }
  }
}
