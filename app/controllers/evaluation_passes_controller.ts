import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import EvaluationPass from '#models/evaluation_pass'
import { requireUser } from '#services/actor'
import {
  CLAIM_WINDOW_MINUTES,
  logPassEvent,
  newSecret,
  newShortCode,
  passStep,
  previewStatus,
  sha256,
} from '#services/evaluation_pass'

// Lado de recepción del pase presencial: generar el QR, ver quién está
// presentando y reanudar o mover un intento (siempre con motivo y responsable).

const nowSql = () => DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss')

async function uniqueCode(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const c = newShortCode()
    if (!(await db.from('evaluation_passes').where('short_code', c).first())) return c
  }
  throw new Error('No se pudo generar un código único')
}

export default class EvaluationPassesController {
  // POST /api/evaluation-passes — "Nuevo candidato": no pide datos.
  async store(ctx: HttpContext) {
    const user = requireUser(ctx)
    const restaurantId = Number(ctx.request.input('restaurantId'))
    const r = restaurantId ? await db.from('restaurants').where('id', restaurantId).first() : null
    if (!r) return ctx.response.badRequest({ error: 'Restaurante requerido' })

    const token = newSecret()
    const shortCode = await uniqueCode()
    const deadline = DateTime.now().plus({ minutes: CLAIM_WINDOW_MINUTES })
    const p = await EvaluationPass.create({
      tokenHash: sha256(token),
      shortCode,
      restaurantId,
      createdByUserId: user.id,
      status: 'issued',
      claimOpen: true,
      claimDeadlineAt: deadline,
    })
    await logPassEvent(p.id, 'created', { actorUserId: user.id })
    return { id: p.id, token, shortCode, claimDeadlineAt: deadline.toISO() }
  }

  // GET /api/evaluation-passes?restaurantId=&days=1 — tablero de recepción.
  async index({ request }: HttpContext) {
    const days = Math.min(Math.max(Number(request.input('days') ?? 1), 1), 30)
    const q = EvaluationPass.query()
      .where('created_at', '>=', DateTime.now().minus({ days }).toFormat('yyyy-LL-dd HH:mm:ss'))
      .orderBy('id', 'desc')
      .limit(200)
    const restaurantId = Number(request.input('restaurantId'))
    if (restaurantId) q.where('restaurant_id', restaurantId)
    const rows = await q
    const candIds = rows.map((r) => r.candidateId).filter((x): x is number => !!x)
    const userIds = [...new Set(rows.map((r) => r.createdByUserId))]
    const [cands, users] = await Promise.all([
      candIds.length
        ? db
            .from('candidates')
            .whereIn('id', candIds)
            .select('id', 'first_name', 'last_name', 'desired_role')
        : [],
      userIds.length ? db.from('users').whereIn('id', userIds).select('id', 'full_name') : [],
    ])
    const cMap = new Map(cands.map((c: any) => [c.id, c]))
    const uMap = new Map(users.map((u: any) => [u.id, u.full_name]))
    return Promise.all(
      rows.map(async (p) => {
        const c = p.candidateId ? cMap.get(p.candidateId) : null
        return {
          id: p.id,
          shortCode: p.shortCode,
          status: p.status,
          preview: previewStatus(p),
          step: await passStep(p),
          device: p.sessionDevice ?? null,
          sessionActive: Boolean(p.sessionHash),
          createdAt: p.createdAt.toISO(),
          createdBy: uMap.get(p.createdByUserId) ?? null,
          claimDeadlineAt: p.claimDeadlineAt.toISO(),
          startedAt: p.startedAt?.toISO() ?? null,
          completedAt: p.completedAt?.toISO() ?? null,
          lastSeenAt: p.lastSeenAt?.toISO() ?? null,
          candidate: c
            ? { id: c.id, name: `${c.first_name} ${c.last_name}`.trim(), role: c.desired_role }
            : null,
          signals: p.signals ?? null,
        }
      })
    )
  }

  // GET /api/evaluation-passes/:id/events — historial del intento.
  async events({ params }: HttpContext) {
    const rows = await db
      .from('evaluation_pass_events as e')
      .leftJoin('users as u', 'u.id', 'e.actor_user_id')
      .where('e.pass_id', Number(params.id))
      .orderBy('e.id', 'asc')
      .select(
        'e.id',
        'e.type',
        'e.reason',
        'e.data_json as data',
        'e.created_at as at',
        'u.full_name as actor'
      )
    return rows
  }

  // POST /api/evaluation-passes/:id/reissue — reanudar (pausa por
  // inactividad, "Siguiente candidato"), mover a otro equipo o reabrir uno
  // terminado. Nuevo QR; la sesión anterior queda invalidada.
  async reissue(ctx: HttpContext) {
    const user = requireUser(ctx)
    const reason = String(ctx.request.input('reason') ?? '').trim()
    if (reason.length < 5) {
      return ctx.response.badRequest({ error: 'Escribe el motivo (mínimo 5 caracteres)' })
    }
    const p = await EvaluationPass.findOrFail(ctx.params.id)
    const wasCompleted = p.status === 'completed'
    const hadSession = Boolean(p.sessionHash)
    const token = newSecret()
    const shortCode = await uniqueCode()
    const deadline = DateTime.now().plus({ minutes: CLAIM_WINDOW_MINUTES })
    await db
      .from('evaluation_passes')
      .where('id', p.id)
      .update({
        token_hash: sha256(token),
        short_code: shortCode,
        session_hash: null,
        claim_open: true,
        claim_deadline_at: deadline.toFormat('yyyy-LL-dd HH:mm:ss'),
        status: wasCompleted ? 'in_progress' : p.status,
        completed_at: wasCompleted
          ? null
          : (p.completedAt?.toFormat('yyyy-LL-dd HH:mm:ss') ?? null),
        updated_at: nowSql(),
      })
    const type = wasCompleted ? 'reopened' : hadSession ? 'moved' : 'resumed'
    await logPassEvent(p.id, type, {
      actorUserId: user.id,
      reason,
      data: { invalidatedSession: hadSession, previousStatus: p.status },
    })
    return { id: p.id, token, shortCode, claimDeadlineAt: deadline.toISO(), action: type }
  }

  // PATCH /api/restaurants/:id/rrhh-settings — modo presencial por restaurante.
  async settings(ctx: HttpContext) {
    const user = requireUser(ctx)
    if (user.role !== 'admin') return ctx.response.forbidden({ error: 'Sólo administradores' })
    const restaurantId = Number(ctx.params.id)
    const inPersonOnly = Boolean(ctx.request.input('inPersonOnly'))
    const exists = await db
      .from('rrhh_restaurant_settings')
      .where('restaurant_id', restaurantId)
      .first()
    if (exists) {
      await db.from('rrhh_restaurant_settings').where('restaurant_id', restaurantId).update({
        in_person_only: inPersonOnly,
        updated_by_user_id: user.id,
        updated_at: new Date(),
      })
    } else {
      await db.table('rrhh_restaurant_settings').insert({
        restaurant_id: restaurantId,
        in_person_only: inPersonOnly,
        updated_by_user_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }
    return { restaurantId, inPersonOnly }
  }
}
