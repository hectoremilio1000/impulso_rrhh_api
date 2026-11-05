import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import EvaluationPass, { type PassSignals } from '#models/evaluation_pass'
import PsychTest from '#models/psych_test'
import PracticalTest from '#models/practical_test'

// Pase de evaluación presencial (2026-10-27).
//
// Dos plazos distintos:
// - Para COMENZAR: el QR sirve 2 horas (claim_deadline_at). Recepción puede
//   volver a habilitarlo (reissue), con motivo.
// - Una vez iniciado, el vencimiento ya no corta la evaluación. Lo único que
//   pausa un intento es la inactividad (IDLE_LOCK_MS sin señal del navegador):
//   entonces la sesión se invalida y retomarlo exige autorización de recepción.
//
// "Una sesión de navegador por intento": el navegador que pulsa "Comenzar"
// recibe un secreto; sólo ese navegador puede seguir. No es identificación del
// dispositivo: borrar los datos del navegador también la pierde.

export const CLAIM_WINDOW_MINUTES = 120
export const IDLE_LOCK_MINUTES = 15
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export const sha256 = (s: string) => createHash('sha256').update(s).digest('hex')
export const newSecret = () => randomBytes(32).toString('base64url')

export function newShortCode(): string {
  const bytes = randomBytes(6)
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

export async function findPassByToken(token: string): Promise<EvaluationPass | null> {
  if (!token || token.length < 20) return null
  return EvaluationPass.findBy('token_hash', sha256(token))
}

export async function logPassEvent(
  passId: number,
  type: string,
  opts: { actorUserId?: number | null; reason?: string | null; data?: unknown } = {}
) {
  await db.table('evaluation_pass_events').insert({
    pass_id: passId,
    type,
    actor_user_id: opts.actorUserId ?? null,
    reason: opts.reason ?? null,
    data_json: opts.data === undefined ? null : JSON.stringify(opts.data),
    created_at: new Date(),
  })
}

/** Estado público (sin datos personales) de un pase, para la vista previa. */
export function previewStatus(
  p: EvaluationPass
): 'available' | 'in_use' | 'completed' | 'expired' | 'needs_staff' {
  if (p.status === 'completed') return 'completed'
  if (p.sessionHash) return 'in_use'
  if (!p.claimOpen) return 'needs_staff'
  if (p.claimDeadlineAt < DateTime.now()) return 'expired'
  return 'available'
}

export type SessionCheck = { ok: true } | { ok: false; status: number; code: string; error: string }

/**
 * Valida la sesión del navegador. Si pasó demasiado tiempo sin señal, la
 * invalida (queda registrado) y pide autorización de recepción.
 */
export async function checkSession(
  p: EvaluationPass,
  secret: string | undefined,
  opts: { allowCompleted?: boolean } = {}
): Promise<SessionCheck> {
  if (!p.sessionHash) {
    return {
      ok: false,
      status: 401,
      code: 'needs_staff',
      error: 'Esta evaluación está en pausa. Pide a recepción que la reanude.',
    }
  }
  const given = secret ? sha256(secret) : ''
  const a = Buffer.from(given)
  const b = Buffer.from(p.sessionHash)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return {
      ok: false,
      status: 401,
      code: 'session_replaced',
      error: 'Esta evaluación continúa en otro equipo. Si es un error, pide ayuda a recepción.',
    }
  }
  if (p.status === 'completed' && !opts.allowCompleted) {
    return {
      ok: false,
      status: 409,
      code: 'completed',
      error: 'Esta evaluación ya está terminada.',
    }
  }
  if (
    p.status !== 'completed' &&
    p.lastSeenAt &&
    p.lastSeenAt < DateTime.now().minus({ minutes: IDLE_LOCK_MINUTES })
  ) {
    const cleared = await db
      .from('evaluation_passes')
      .where('id', p.id)
      .where('session_hash', p.sessionHash)
      .update({ session_hash: null, updated_at: new Date() })
    if (cleared) {
      await logPassEvent(p.id, 'session_locked_idle', {
        data: { lastSeenAt: p.lastSeenAt.toISO() },
      })
    }
    return {
      ok: false,
      status: 423,
      code: 'idle_locked',
      error: 'Se pausó por inactividad. Pide a recepción que la reanude.',
    }
  }
  // Señal de vida (como mucho una escritura cada 20 s).
  if (!p.lastSeenAt || p.lastSeenAt < DateTime.now().minus({ seconds: 20 })) {
    await db
      .from('evaluation_passes')
      .where('id', p.id)
      .update({ last_seen_at: DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss') })
  }
  return { ok: true }
}

/** Exámenes vigentes (no reemplazados) de un pase. */
export async function passExams(p: EvaluationPass) {
  if (!p.candidateId) return { psych: null, practical: null }
  const [psych, practical] = await Promise.all([
    PsychTest.query()
      .where('evaluation_pass_id', p.id)
      .whereNull('superseded_by_id')
      .orderBy('id', 'desc')
      .first(),
    PracticalTest.query()
      .where('evaluation_pass_id', p.id)
      .whereNull('superseded_by_id')
      .orderBy('id', 'desc')
      .first(),
  ])
  return { psych, practical }
}

/** Paso actual: 1 datos, 2 psicométrico, 3 práctico, 4 terminado. */
export async function passStep(p: EvaluationPass): Promise<1 | 2 | 3 | 4> {
  if (!p.candidateId) return 1
  const { psych, practical } = await passExams(p)
  if (psych && !psych.takenAt) return 2
  if (practical && !practical.takenAt) return 3
  return 4
}

/** Cierra el intento cuando ya se enviaron los dos exámenes. */
export async function closeIfComplete(passId: number) {
  const p = await EvaluationPass.find(passId)
  if (!p || p.status === 'completed') return
  if ((await passStep(p)) !== 4) return
  const updated = await db
    .from('evaluation_passes')
    .where('id', p.id)
    .whereNot('status', 'completed')
    .update({
      status: 'completed',
      completed_at: DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss'),
      claim_open: false,
      updated_at: new Date(),
    })
  if (updated) await logPassEvent(p.id, 'completed')
}

const EMPTY_SIGNALS: PassSignals = {
  hiddenCount: 0,
  hiddenMs: 0,
  pasteCount: 0,
  pasteFields: [],
  offlineCount: 0,
  offlineMs: 0,
  reloads: 0,
  stepMs: {},
}

const clampInt = (v: unknown, max: number) => {
  const n = Math.floor(Number(v))
  return Number.isFinite(n) && n > 0 ? Math.min(n, max) : 0
}

/**
 * Suma un lote de interrupciones del navegador. Informativo: nunca bloquea ni
 * califica. Sólo conteos, tiempos y el número de pregunta donde se pegó texto;
 * nunca el contenido del portapapeles.
 */
export function mergeSignals(prev: PassSignals | null | undefined, delta: any): PassSignals {
  const s: PassSignals = { ...EMPTY_SIGNALS, ...(prev ?? {}), stepMs: { ...(prev?.stepMs ?? {}) } }
  if (!delta || typeof delta !== 'object') return s
  const HOUR = 3_600_000
  s.hiddenCount += clampInt(delta.hiddenCount, 500)
  s.hiddenMs += clampInt(delta.hiddenMs, 6 * HOUR)
  s.pasteCount += clampInt(delta.pasteCount, 500)
  s.offlineCount += clampInt(delta.offlineCount, 500)
  s.offlineMs += clampInt(delta.offlineMs, 6 * HOUR)
  s.reloads += clampInt(delta.reloads, 100)
  if (Array.isArray(delta.pasteFields)) {
    const set = new Set(s.pasteFields)
    for (const f of delta.pasteFields) {
      const k = String(f).slice(0, 24)
      if (/^(step1|psych|practical):[\w-]+$/.test(k)) set.add(k)
    }
    s.pasteFields = [...set].slice(0, 200)
  }
  if (delta.stepMs && typeof delta.stepMs === 'object') {
    for (const k of ['1', '2', '3']) {
      s.stepMs[k] = (s.stepMs[k] ?? 0) + clampInt(delta.stepMs[k], 6 * HOUR)
    }
  }
  return s
}
