import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'offers'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('public_token', 64).nullable()
      table.dateTime('responded_at').nullable()
      table.string('responded_ip', 45).nullable()

      // Nombre explícito para poder dropearla en down()
      table.unique(['public_token'], 'uk_offers_public_token')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['public_token'], 'uk_offers_public_token')
      table.dropColumn('public_token')
      table.dropColumn('responded_at')
      table.dropColumn('responded_ip')
    })
  }
}
