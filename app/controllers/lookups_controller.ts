import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

// Catálogos de sólo lectura para el panel: restaurantes (para registrar dónde
// se contrata) y nombres de usuarios (para mostrar quién registró cada acción).
export default class LookupsController {
  // GET /api/restaurants
  async restaurants(_ctx: HttpContext) {
    return db
      .from('restaurants as r')
      .leftJoin('rrhh_restaurant_settings as s', 's.restaurant_id', 'r.id')
      .where('r.is_active', 1)
      .select('r.id', 'r.name', 'r.slug', db.raw('COALESCE(s.in_person_only, 0) as inPersonOnly'))
      .orderBy('r.name')
  }

  // GET /api/users — sólo id, nombre y rol; sin correos.
  async users(_ctx: HttpContext) {
    return db.from('users').select('id', 'full_name as fullName', 'role').orderBy('full_name')
  }
}
