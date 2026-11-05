import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Candidate from '#models/candidate'
import Employment, { EXIT_TYPES } from '#models/employment'
import EmploymentCheck, { CHECK_MILESTONES } from '#models/employment_check'
import { requireUser } from '#services/actor'
import { setStageTx } from '#services/stage_service'

function parseDate(v: unknown): DateTime | null {
  if (!v) return null
  const d = DateTime.fromISO(String(v))
  return d.isValid ? d.startOf('day') : null
}

// Verificaciones pendientes: hitos de 30/90/180 días ya cumplidos, sin
// verificación registrada, mientras la persona no tenga fecha de salida.
export function dueChecks(e: Employment, checks: EmploymentCheck[], today = DateTime.now()) {
  if (e.endDate) return []
  const done = new Set(checks.map((c) => c.milestoneDays))
  return CHECK_MILESTONES.filter(
    (d) => !done.has(d) && today.startOf('day') >= e.startDate.plus({ days: d })
  ).map((d) => ({ milestoneDays: d, dueOn: e.startDate.plus({ days: d }).toISODate() }))
}

export default class EmploymentsController {
  // GET /api/candidates/:id/employments
  async index({ params }: HttpContext) {
    const rows = await Employment.query()
      .where('candidate_id', Number(params.id))
      .preload('checks')
      .orderBy('id', 'desc')
    return rows.map((e) => ({ ...e.serialize(), dueChecks: dueChecks(e, e.checks) }))
  }

  // POST /api/candidates/:id/employments — contratación: empezó a trabajar.
  async store(ctx: HttpContext) {
    const { params, request, response } = ctx
    const user = requireUser(ctx)
    const candidate = await Candidate.find(Number(params.id))
    if (!candidate) return response.notFound({ error: 'Candidato no encontrado' })

    const startDate = parseDate(request.input('startDate'))
    const restaurantId = Number(request.input('restaurantId') ?? candidate.restaurantId)
    const roleTitle = String(request.input('roleTitle') ?? '').trim()
    if (!startDate) return response.badRequest({ error: 'Fecha de ingreso requerida (AAAA-MM-DD)' })
    if (!restaurantId) return response.badRequest({ error: 'Restaurante requerido' })
    if (!roleTitle) return response.badRequest({ error: 'Puesto requerido' })
    if (startDate > DateTime.now().plus({ days: 60 })) {
      return response.badRequest({ error: 'La fecha de ingreso no puede estar a más de 60 días' })
    }

    const open = await Employment.query()
      .where('candidate_id', candidate.id)
      .where('restaurant_id', restaurantId)
      .whereNull('end_date')
      .first()
    if (open)
      return response.conflict({
        error: 'Ya tiene una contratación activa en ese restaurante',
        employment: open,
      })

    const employment = await db.transaction(async (trx) => {
      const e = await Employment.create(
        {
          candidateId: candidate.id,
          restaurantId,
          roleTitle,
          roleCode: request.input('roleCode') ?? null,
          offerId: request.input('offerId') ?? null,
          startDate,
          hiredByUserId: user.id,
        },
        { client: trx }
      )
      return e
    })
    await setStageTx(
      candidate.id,
      {
        stageCode: 'hired',
        decision: 'hired',
        offerId: employment.offerId ?? null,
        restaurantId,
        via: 'panel',
        notes: `Ingreso ${startDate.toISODate()} · ${roleTitle}`,
      },
      user.id
    )
    return employment
  }

  // POST /api/employments/:id/exit — salida con fecha, tipo y motivo.
  async exit(ctx: HttpContext) {
    const { params, request, response } = ctx
    const user = requireUser(ctx)
    const e = await Employment.findOrFail(params.id)
    if (e.endDate) return response.conflict({ error: 'La salida ya está registrada' })

    const endDate = parseDate(request.input('endDate'))
    const exitType = String(request.input('exitType') ?? '')
    if (!endDate) return response.badRequest({ error: 'Fecha de salida requerida (AAAA-MM-DD)' })
    if (endDate < e.startDate)
      return response.badRequest({ error: 'La salida no puede ser antes del ingreso' })
    if (!(EXIT_TYPES as readonly string[]).includes(exitType)) {
      return response.badRequest({ error: `Tipo de salida: ${EXIT_TYPES.join(', ')}` })
    }

    e.endDate = endDate
    e.exitType = exitType as Employment['exitType']
    e.exitReason = request.input('exitReason') ?? null
    e.exitRecordedByUserId = user.id
    await e.save()

    await setStageTx(
      e.candidateId,
      {
        stageCode: 'exited',
        decision: 'exited',
        reasonCode: exitType,
        restaurantId: e.restaurantId,
        via: 'panel',
        notes: `Salida ${endDate.toISODate()} · ${exitType}`,
      },
      user.id
    )
    return e
  }

  // POST /api/employments/:id/checks — ¿sigue trabajando a los 30/90/180 días?
  async check(ctx: HttpContext) {
    const { params, request, response } = ctx
    const user = requireUser(ctx)
    const e = await Employment.findOrFail(params.id)
    const milestoneDays = Number(request.input('milestoneDays'))
    if (!(CHECK_MILESTONES as readonly number[]).includes(milestoneDays)) {
      return response.badRequest({ error: 'Hito: 30, 90 o 180 días' })
    }
    if (DateTime.now() < e.startDate.plus({ days: milestoneDays })) {
      return response.badRequest({ error: 'Ese hito todavía no se cumple' })
    }
    const existing = await EmploymentCheck.query()
      .where('employment_id', e.id)
      .where('milestone_days', milestoneDays)
      .first()
    if (existing)
      return response.conflict({ error: 'Ese hito ya está verificado', check: existing })

    const stillEmployed = Boolean(request.input('stillEmployed'))
    if (stillEmployed && e.endDate) {
      return response.badRequest({ error: 'Tiene salida registrada; no puede seguir trabajando' })
    }
    return EmploymentCheck.create({
      employmentId: e.id,
      milestoneDays,
      stillEmployed,
      checkedOn: DateTime.now().startOf('day'),
      checkedByUserId: user.id,
      notes: request.input('notes') ?? null,
    })
  }
}
