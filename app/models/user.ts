import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

// Usuarios del panel de reclutamiento. No hay registro público: se crean con
// `node ace users:create`. El rol limita qué puede hacer; el nombre queda como
// responsable en entrevistas, ofertas, contrataciones y salidas.
export type UserRole = 'admin' | 'recruiter'

export default class User extends compose(BaseModel, AuthFinder) {
  public static table = 'users'

  @column({ isPrimary: true }) declare id: number
  @column() declare email: string
  @column({ columnName: 'full_name' }) declare fullName: string
  @column({ serializeAs: null }) declare password: string
  @column() declare role: UserRole
  @column({ columnName: 'is_active' }) declare isActive: boolean

  @column.dateTime({ autoCreate: true, columnName: 'created_at' }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '12 hours',
    prefix: 'irr_',
    table: 'auth_access_tokens',
  })
}
