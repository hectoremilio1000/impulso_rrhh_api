// start/env.ts
import { Env } from '@adonisjs/core/env'

/**
 * Valida y carga variables de entorno.
 * Nota:
 * - Los booleanos deben venir como "true"/"false".
 * - Los números (puertos) deben ser valores numéricos válidos.
 */
export default await Env.create(new URL('../', import.meta.url), {
  /* ---------- App ---------- */
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  APP_KEY: Env.schema.string(),
  LOG_LEVEL: Env.schema.enum([
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace',
    'silent',
  ] as const),
  TZ: Env.schema.string.optional(), // e.g. "UTC"

  /* ---------- DB (MySQL) ---------- */
  DB_CONNECTION: Env.schema.enum(['mysql'] as const),
  MYSQL_HOST: Env.schema.string(),
  MYSQL_PORT: Env.schema.number(),
  MYSQL_USER: Env.schema.string(),
  MYSQL_PASSWORD: Env.schema.string.optional(),
  MYSQL_DB_NAME: Env.schema.string(),

  /* ---------- FTPS para CVs ---------- */
  FTPS_CV_HOST: Env.schema.string.optional(),
  FTPS_CV_PORT: Env.schema.number.optional(),
  FTPS_CV_USER: Env.schema.string.optional(),
  FTPS_CV_PASS: Env.schema.string.optional(),
  FTPS_CV_SECURE: Env.schema.boolean.optional(), // "true"/"false" en .env
  MEDIA_BASE_URL: Env.schema.string.optional(), // p.ej. "https://media.impulsorestaurantero.com/cvs"
})
