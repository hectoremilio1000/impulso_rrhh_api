import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { timingSafeEqual } from 'node:crypto'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

/**
 * Acceso al panel de reclutamiento.
 *
 * Fase 2 (2026-10-25): usuario y contraseña → token de acceso personal
 * (`Authorization: Bearer irr_…`, 12 h, revocable). Así cada acción tiene un
 * responsable y ninguna llave viaja en el JS público.
 *
 * Transición: la llave compartida X-Admin-Token de la Fase 1 (2026-06-03) se
 * sigue aceptando SÓLO mientras ADMIN_GATE_TOKEN esté configurada, para que el
 * front publicado no se caiga entre el despliegue del API y el del front. Esa
 * llave ya es pública (viaja en el bundle): en cuanto el front nuevo esté
 * publicado se quita la variable y esta vía queda cerrada.
 */
export default class AdminGateMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (ctx.request.header('authorization')) {
      const authenticated = await ctx.auth.use('api').check()
      const user = ctx.auth.use('api').user
      if (authenticated && user?.isActive) return next()
      return ctx.response.status(401).json({ error: 'Sesión vencida o inválida' })
    }

    const legacy = env.get('ADMIN_GATE_TOKEN')
    const provided = ctx.request.header('x-admin-token')
    if (legacy && provided && sameSecret(provided, legacy)) {
      logger.warn(
        { path: ctx.request.url(), method: ctx.request.method() },
        'admin_gate: llave compartida (Fase 1) usada; retirar ADMIN_GATE_TOKEN al publicar el front nuevo'
      )
      return next()
    }

    return ctx.response.status(401).json({ error: 'Unauthorized' })
  }
}

function sameSecret(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}
