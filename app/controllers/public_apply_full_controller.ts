import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { resolveRoleCode, type RoleCode } from '#services/role_catalog'
import { createApplication, isInPersonOnly } from '#services/candidate_application'

// Exportado para test unitario en tests/unit/role_to_code.spec.ts.
//
// 2026-10-23 — Delega en role_catalog (fuente única del puesto). Un puesto
// que no se reconoce devuelve null: /apply responde 422 en vez de asignar el
// examen de Mesero en silencio (así se evaluaba a "Gerente").
export function roleToCode(desiredRole: string): RoleCode | null {
  return resolveRoleCode(desiredRole)
}

export default class PublicApplyFullController {
  async apply({ request, response }: HttpContext) {
    const { candidate, jobs } = request.only(['candidate', 'jobs'])

    // El puesto se decide aquí, una sola vez, y queda en testName.
    const roleCode = roleToCode(String(candidate?.desiredRole ?? ''))
    if (!roleCode) {
      return response.unprocessableEntity({
        error: 'Puesto no reconocido. Elige un puesto de la lista.',
      })
    }

    // Restaurante de la vacante (p. ej. /apply/1?r=la-llorona). Opcional.
    let restaurantId: number | null = null
    if (candidate?.restaurantSlug) {
      const r = await db.from('restaurants').where('slug', String(candidate.restaurantSlug)).first()
      restaurantId = r?.id ?? null
    }

    // Restaurantes en modo presencial: la solicitud sólo se llena con el pase
    // que da recepción (POST /api/public/passes/:token/apply).
    if (await isInPersonOnly(restaurantId)) {
      return response.forbidden({
        error: 'Esta solicitud se llena en el restaurante. Pide tu código en recepción.',
        inPersonOnly: true,
      })
    }

    const out = await db.transaction((trx) =>
      createApplication(trx, { candidate, jobs, roleCode, restaurantId })
    )
    return { ok: true, ...out }
  }
}
