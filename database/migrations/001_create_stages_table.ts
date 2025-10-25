import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stages'

  async up() {
    this.schema.createTable(this.tableName, (t) => {
      t.increments('id')
      t.string('code', 40).notNullable().unique() // 'received','contacted',...
      t.string('name', 80).notNullable() // 'Recibido','Contactado',...
      t.string('kind', 24).notNullable().defaultTo('generic') // generic|interview|psychometric|knowledge|decision
      t.boolean('is_terminal').notNullable().defaultTo(false)
      t.integer('sort_order').notNullable().defaultTo(100)

      t.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      t.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
