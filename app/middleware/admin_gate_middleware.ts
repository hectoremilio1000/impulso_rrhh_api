import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

/**
 * Temporary admin-gate middleware (Fase 1 del cierre de fuga PII, 2026-06-03).
 *
 * Fail-closed: si ADMIN_GATE_TOKEN no está configurada en el entorno, se rechaza
 * TODO el tráfico admin (mejor cerrado-y-yo-no-entro que abierto-y-fuga-PII).
 *
 * Reemplazar por @adonisjs/auth en Fase 2. Ver docs/security/2026-06-03-pii-exposure-incident.md.
 */
export default class AdminGateMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const expected = env.get('ADMIN_GATE_TOKEN')

    if (!expected) {
      logger.error(
        { path: ctx.request.url(), method: ctx.request.method() },
        'admin_gate_misconfigured: ADMIN_GATE_TOKEN not set, denying admin request'
      )
      return ctx.response.status(401).json({
        error: 'Admin gate not configured',
      })
    }

    const provided = ctx.request.header('x-admin-token')
    if (provided !== expected) {
      return ctx.response.status(401).json({
        error: 'Unauthorized',
      })
    }

    return next()
  }
}
