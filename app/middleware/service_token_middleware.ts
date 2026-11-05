import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { timingSafeEqual } from 'node:crypto'
import env from '#start/env'

/**
 * Llamadas de servidor a servidor (p. ej. el WhatsApp de reclutamiento de
 * GrowthSuite). Token propio, distinto de cualquier llave del panel; si la
 * variable no está, la ruta queda cerrada.
 */
export default class ServiceTokenMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const expected = env.get('RECRUITMENT_SERVICE_TOKEN')
    const provided = ctx.request.header('x-service-token') ?? ''
    if (!expected || !provided) return ctx.response.status(401).json({ error: 'Unauthorized' })
    const a = Buffer.from(provided)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return ctx.response.status(401).json({ error: 'Unauthorized' })
    }
    return next()
  }
}
