// /config/cors.ts
import { defineConfig } from '@adonisjs/cors'
import env from '#start/env'

// Orígenes extra por ambiente (CORS_ORIGENES_EXTRA, separados por coma). En
// producción no se define y sólo vale la lista fija de abajo.
export function origenesExtra(valor: string | undefined): string[] {
  return (valor ?? '')
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter((s) => /^https?:\/\/[^\s/]+$/.test(s))
}
const EXTRA = origenesExtra(env.get('CORS_ORIGENES_EXTRA'))

/** Lista fija de orígenes permitidos en todos los ambientes. */
export function origenFijoPermitido(origin: string): boolean {
  // Dominios del sitio público (con y sin www)
  if (origin === 'https://impulsorestaurantero.com') return true
  if (origin === 'https://www.impulsorestaurantero.com') return true
  // (opcional) cualquier subdominio de impulsorestaurantero.com:
  if (/^https:\/\/([a-z0-9-]+\.)*impulsorestaurantero\.com$/.test(origin)) return true

  // Admin prod + previews de Vercel
  if (origin === 'https://impulso-admin-front-page.vercel.app') return true
  if (/^https:\/\/impulso-admin-front-page-[a-z0-9-]+\.vercel\.app$/.test(origin)) return true
  if (
    /^https:\/\/impulso-admin-front-page-[a-z0-9-]+\.hectoremilio1000-s-team\.vercel\.app$/.test(
      origin
    )
  )
    return true

  // Dev locales
  if (origin === 'http://localhost:3000') return true
  if (origin === 'http://localhost:5173') return true

  // GrowthSuite Talento (postulación pública y exámenes; build --mode talento)
  if (origin === 'https://talento.growthsuite.com.mx') return true
  if (origin === 'https://growthsuite-talento.vercel.app') return true
  // Previews del equipo en Vercel: growthsuite-talento-<hash o git-rama>-hectoremilio1000-s-team
  if (
    /^https:\/\/growthsuite-talento-[a-z0-9-]+-hectoremilio1000-s-team\.vercel\.app$/.test(origin)
  )
    return true
  // App de Android de Talento (Capacitor sirve el bundle desde https://localhost)
  if (origin === 'https://localhost') return true

  return false
}

export default defineConfig({
  enabled: true,

  origin: (origin) => {
    if (!origin) return true // curl/postman
    if (EXTRA.includes(origin)) return true
    return origenFijoPermitido(origin)
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  headers: true,
  exposeHeaders: [],
  credentials: false,
  maxAge: 90,
})
