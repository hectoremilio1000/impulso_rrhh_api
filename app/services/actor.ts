import type { HttpContext } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import type User from '#models/user'

// Quién hizo la acción. Con la llave compartida de la Fase 1 no hay usuario:
// las acciones que exigen responsable (entrevista realizada, oferta,
// contratación, salida) piden iniciar sesión.
export function currentUser(ctx: HttpContext): User | null {
  return (ctx.auth.use('api').user as User | undefined) ?? null
}

export class ResponsibleRequired extends Exception {
  static status = 403
  static code = 'E_RESPONSIBLE_REQUIRED'

  constructor() {
    super('Inicia sesión con tu usuario: esta acción queda registrada con tu nombre.')
  }

  async handle(_error: this, ctx: HttpContext) {
    ctx.response.status(403).send({ error: this.message })
  }
}

export function requireUser(ctx: HttpContext): User {
  const user = currentUser(ctx)
  if (!user) throw new ResponsibleRequired()
  return user
}
