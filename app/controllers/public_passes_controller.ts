import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import EvaluationPass from '#models/evaluation_pass'
import { resolveRoleCode } from '#services/role_catalog'
import { createApplication } from '#services/candidate_application'
import {
  checkSession,
  findPassByToken,
  logPassEvent,
  mergeSignals,
  newSecret,
  passExams,
  passStep,
  previewStatus,
  sha256,
} from '#services/evaluation_pass'

// Lado del candidato del pase presencial. Abrir el enlace no reclama nada:
// el intento empieza cuando el candidato pulsa "Comenzar" (claim). Todo lo
// demás exige la sesión de ese navegador (header x-pass-session).

const SESSION_HEADER = 'x-pass-session'
const MAX_DRAFT_BYTES = 300_000
const nowSql = () => DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss')

// Intentos FALLIDOS de código corto por IP (adivinarlo a ciegas no debe ser
// práctico). Holgado: en el restaurante todos los celulares pueden compartir IP.
const codeTries = new Map<string, { n: number; until: number }>()

async function restaurantOf(id: number) {
  const r = await db.from('restaurants').where('id', id).select('name', 'slug').first()
  return { name: (r?.name as string) ?? 'el restaurante', slug: (r?.slug as string) ?? null }
}
const restaurantName = async (id: number) => {
  const r = await restaurantOf(id)
  return r.name
}

async function stateOf(p: EvaluationPass) {
  const step = await passStep(p)
  const { psych, practical } = await passExams(p)
  const restaurant = await restaurantOf(p.restaurantId)
  const candidate = p.candidateId
    ? await db.from('candidates').where('id', p.candidateId).select('first_name').first()
    : null
  const exam = (
    t: {
      accessToken?: string | null
      takenAt?: unknown
      draftJson?: Record<string, string> | null
    } | null
  ) =>
    t
      ? {
          token: t.accessToken,
          taken: Boolean(t.takenAt),
          draft: t.takenAt ? null : (t.draftJson ?? null),
        }
      : null
  return {
    status: p.status,
    step,
    device: p.sessionDevice ?? null,
    restaurantName: restaurant.name,
    restaurantSlug: restaurant.slug,
    candidate: candidate ? { firstName: candidate.first_name as string } : null,
    step1Draft: step === 1 ? (p.step1Draft ?? null) : null,
    exams: { psych: exam(psych), practical: exam(practical) },
  }
}

export default class PublicPassesController {
  // GET /api/public/passes/:token — vista previa: no reclama ni muestra datos.
  async preview({ params, response }: HttpContext) {
    const p = await findPassByToken(String(params.token))
    if (!p) return response.notFound({ status: 'invalid', error: 'Código no válido' })
    return {
      status: previewStatus(p),
      restaurantName: await restaurantName(p.restaurantId),
      claimDeadlineAt: p.claimDeadlineAt.toISO(),
    }
  }

  // GET /api/public/passes/code/:code — el candidato teclea el código corto.
  async byCode({ params, request, response }: HttpContext) {
    const ip = request.ip()
    const t = codeTries.get(ip)
    if (t && t.n >= 30 && t.until > Date.now()) {
      return response.tooManyRequests({ error: 'Demasiados intentos. Pide ayuda a recepción.' })
    }
    const code = String(params.code ?? '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
    const p = code.length === 6 ? await EvaluationPass.findBy('short_code', code) : null
    if (!p || previewStatus(p) !== 'available') {
      const prev = t && t.until > Date.now() ? t.n : 0
      codeTries.set(ip, { n: prev + 1, until: Date.now() + 10 * 60_000 })
      return response.notFound({
        error: 'Código no válido o vencido. Pide uno nuevo en recepción.',
      })
    }
    // El código corto sólo sirve para comenzar; entrega un token de un uso.
    const token = newSecret()
    await db
      .from('evaluation_passes')
      .where('id', p.id)
      .update({ token_hash: sha256(token), updated_at: new Date() })
    await logPassEvent(p.id, 'code_used', { data: { ip } })
    return { token }
  }

  // POST /api/public/passes/:token/claim — "Comenzar". Un solo navegador.
  async claim({ params, request, response }: HttpContext) {
    const p = await findPassByToken(String(params.token))
    if (!p) return response.notFound({ error: 'Código no válido' })
    const device = request.input('device') === 'tablet' ? 'tablet' : 'phone'
    const secret = newSecret()
    const now = nowSql()
    const claimed = await db
      .from('evaluation_passes')
      .where('id', p.id)
      .whereNull('session_hash')
      .where('claim_open', true)
      .where('claim_deadline_at', '>', now)
      .whereNot('status', 'completed')
      .update({
        session_hash: sha256(secret),
        session_device: device,
        session_claimed_at: now,
        last_seen_at: now,
        claim_open: false,
        status: db.knexRawQuery("CASE WHEN status = 'issued' THEN 'in_progress' ELSE status END"),
        started_at: db.knexRawQuery('COALESCE(started_at, ?)', [now]),
        updated_at: now,
      })
    if (!claimed) {
      // Motivo con el estado ACTUAL (si otro navegador ganó la carrera, ya
      // está en uso).
      const s = previewStatus((await EvaluationPass.find(p.id)) ?? p)
      await logPassEvent(p.id, 'claim_rejected', { data: { reason: s, device } })
      const msg: Record<string, string> = {
        in_use: 'Esta evaluación ya se abrió en otro equipo. Pide ayuda a recepción.',
        completed: 'Esta evaluación ya está terminada.',
        expired: 'El código venció (2 horas para comenzar). Pide uno nuevo en recepción.',
        needs_staff: 'Esta evaluación está en pausa. Pide a recepción que la reanude.',
      }
      return response.conflict({ code: s, error: msg[s] ?? 'No se puede comenzar.' })
    }
    await logPassEvent(p.id, 'claimed', { data: { device } })
    const fresh = await EvaluationPass.findOrFail(p.id)
    return { sessionSecret: secret, ...(await stateOf(fresh)) }
  }

  // GET /api/public/passes/:token/state — retomar tras recargar.
  async state({ params, request, response }: HttpContext) {
    const p = await findPassByToken(String(params.token))
    if (!p) return response.notFound({ error: 'Código no válido' })
    const chk = await checkSession(p, request.header(SESSION_HEADER), { allowCompleted: true })
    if (!chk.ok) return response.status(chk.status).send({ code: chk.code, error: chk.error })
    return stateOf(p)
  }

  // PUT /api/public/passes/:token/progress — avance y señales (cada pocos s).
  async progress({ params, request, response }: HttpContext) {
    const p = await findPassByToken(String(params.token))
    if (!p) return response.notFound({ error: 'Código no válido' })
    const chk = await checkSession(p, request.header(SESSION_HEADER))
    if (!chk.ok) return response.status(chk.status).send({ code: chk.code, error: chk.error })

    const body = request.only(['step1Draft', 'exam', 'signals'])
    if (JSON.stringify(body).length > MAX_DRAFT_BYTES) {
      return response.status(413).send({ error: 'Avance demasiado grande' })
    }
    if (body.step1Draft && typeof body.step1Draft === 'object' && !p.candidateId) {
      p.step1Draft = body.step1Draft
    }
    if (body.signals) p.signals = mergeSignals(p.signals, body.signals)
    await p.save()

    if (body.exam?.answers && typeof body.exam.answers === 'object') {
      const { psych, practical } = await passExams(p)
      const t = body.exam.kind === 'practical' ? practical : psych
      if (t && !t.takenAt) {
        await db
          .from(body.exam.kind === 'practical' ? 'practical_tests' : 'psych_tests')
          .where('id', t.id)
          .whereNull('taken_at')
          .update({ draft_json: JSON.stringify(body.exam.answers), draft_updated_at: nowSql() })
      }
    }
    return { ok: true }
  }

  // POST /api/public/passes/:token/apply — datos y referencias. Idempotente:
  // si ya se creó el candidato de este pase, regresa el mismo.
  async apply({ params, request, response }: HttpContext) {
    const p = await findPassByToken(String(params.token))
    if (!p) return response.notFound({ error: 'Código no válido' })
    const chk = await checkSession(p, request.header(SESSION_HEADER))
    if (!chk.ok) return response.status(chk.status).send({ code: chk.code, error: chk.error })

    const { candidate, jobs } = request.only(['candidate', 'jobs'])
    const roleCode = resolveRoleCode(String(candidate?.desiredRole ?? ''))
    if (!roleCode) {
      return response.unprocessableEntity({
        error: 'Puesto no reconocido. Elige un puesto de la lista.',
      })
    }

    const out = await db.transaction(async (trx) => {
      // Bloquea el pase: dos envíos simultáneos no crean dos candidatos.
      const locked = await trx.from('evaluation_passes').where('id', p.id).forUpdate().first()
      if (locked.candidate_id) return { existing: true as const }
      const res = await createApplication(trx, {
        candidate,
        jobs,
        roleCode,
        restaurantId: p.restaurantId,
        evaluationPassId: p.id,
      })
      await trx
        .from('evaluation_passes')
        .where('id', p.id)
        .update({ candidate_id: res.candidateId, step1_draft_json: null, updated_at: nowSql() })
      return { existing: false as const, candidateId: res.candidateId }
    })
    await logPassEvent(p.id, out.existing ? 'apply_repeated' : 'applied', {
      data: out.existing ? undefined : { candidateId: out.candidateId },
    })
    const fresh = await EvaluationPass.findOrFail(p.id)
    return { ok: true, repeated: out.existing, ...(await stateOf(fresh)) }
  }

  // POST /api/public/passes/:token/release — "Siguiente candidato" en tablet.
  // Cierra la sesión del navegador; el avance queda en el servidor y sólo
  // recepción puede reanudarlo.
  async release({ params, request, response }: HttpContext) {
    const p = await findPassByToken(String(params.token))
    if (!p) return response.notFound({ error: 'Código no válido' })
    const chk = await checkSession(p, request.header(SESSION_HEADER), { allowCompleted: true })
    if (!chk.ok) return response.status(chk.status).send({ code: chk.code, error: chk.error })
    await db
      .from('evaluation_passes')
      .where('id', p.id)
      .update({ session_hash: null, updated_at: nowSql() })
    await logPassEvent(p.id, 'released', { data: { status: p.status } })
    return { ok: true }
  }
}

/**
 * Candado de los enlaces de examen. Un examen ligado a un pase sólo se abre o
 * se envía con la sesión de ese pase; los exámenes sin pase (los que ya
 * existen) siguen igual.
 */
export async function examPassGate(
  ctx: HttpContext,
  test: { evaluationPassId?: number | null }
): Promise<{ ok: true } | { ok: false; status: number; body: object }> {
  if (!test.evaluationPassId) return { ok: true }
  const p = await EvaluationPass.find(test.evaluationPassId)
  if (!p) return { ok: false, status: 403, body: { error: 'Evaluación no disponible' } }
  const chk = await checkSession(p, ctx.request.header(SESSION_HEADER), { allowCompleted: true })
  if (!chk.ok) {
    return {
      ok: false,
      status: chk.code === 'session_replaced' || chk.code === 'needs_staff' ? 403 : chk.status,
      body: {
        code: chk.code,
        inPersonOnly: true,
        error:
          chk.code === 'session_replaced' || chk.code === 'needs_staff'
            ? 'Tu evaluación se hace en el restaurante con el código de recepción.'
            : chk.error,
      },
    }
  }
  return { ok: true }
}
