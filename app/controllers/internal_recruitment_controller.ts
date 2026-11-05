import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Candidate from '#models/candidate'
import Interview from '#models/interview'
import Stage from '#models/stage'
import { setStageTx } from '#services/stage_service'

// Eventos de la agenda de entrevistas por WhatsApp (GrowthSuite) → Impulso.
//
// Contrato acordado con la sesión de WhatsApp (2026-10-25):
// - Idempotente por evento: externalId = id del evento en el sistema de origen.
// - Puede llegar fuera de orden: la etapa sólo avanza (occurredAt queda en el
//   historial).
// - Una cita agendada NO es entrevista realizada: "arrived" queda como "Llegó
//   a la cita"; la entrevista realizada la registra quien entrevista.
//
// - Sólo se reciben candidatos que aceptaron el aviso de privacidad: sin
//   `consent` el evento se rechaza (422) y no se guarda nada.
// - 2xx = recibido (un repetido también); 4xx = rechazo definitivo.
const TYPES = ['scheduled', 'rescheduled', 'cancelled', 'arrived', 'no_show'] as const
type EventType = (typeof TYPES)[number]

const STAGE_BY_TYPE: Record<EventType, string | null> = {
  scheduled: 'interview_scheduled',
  rescheduled: 'interview_scheduled',
  cancelled: null,
  arrived: 'arrived',
  no_show: 'no_show',
}

function normPhone(p: string): string {
  const d = p.replace(/\D/g, '')
  return d.length > 10 ? d.slice(-10) : d
}

export default class InternalRecruitmentController {
  // POST /api/internal/recruitment/events
  async event({ request, response }: HttpContext) {
    const b = request.only([
      'externalId',
      'interviewId',
      'sourceRestaurantId',
      'restaurantSlug',
      'phone',
      'name',
      'position',
      'type',
      'interviewDate',
      'previousDate',
      'occurredAt',
      'consent',
    ])
    const consentAt = DateTime.fromISO(String(b.consent?.acceptedAt ?? ''))
    const consentVersion = b.consent?.version ? String(b.consent.version).slice(0, 20) : ''
    if (!consentAt.isValid || !consentVersion) {
      return response.unprocessableEntity({
        error:
          'Falta el consentimiento del aviso de privacidad (consent.acceptedAt y consent.version)',
      })
    }
    const type = String(b.type ?? '') as EventType
    if (!TYPES.includes(type)) return response.badRequest({ error: `type: ${TYPES.join(', ')}` })
    if (!b.externalId) return response.badRequest({ error: 'externalId requerido' })
    const phone = normPhone(String(b.phone ?? ''))
    if (phone.length !== 10) return response.badRequest({ error: 'phone inválido' })
    const occurredAt = DateTime.fromISO(String(b.occurredAt ?? ''))
    if (!occurredAt.isValid) return response.badRequest({ error: 'occurredAt inválido (ISO)' })

    const externalRef = `wa-rec:${b.externalId}`
    const already = await db
      .from('candidate_stage_events')
      .where('external_ref', externalRef)
      .first()
    if (already) return { ok: true, duplicate: true, candidateId: already.candidate_id }

    const restaurant = b.restaurantSlug
      ? await db.from('restaurants').where('slug', String(b.restaurantSlug)).first()
      : null
    const restaurantId: number | null = restaurant?.id ?? null

    // Mismo teléfono (últimos 10 dígitos) y mismo restaurante = mismo candidato.
    const candidates = await Candidate.query()
      .where((q) => {
        q.whereRaw("RIGHT(REGEXP_REPLACE(COALESCE(whatsapp,''), '[^0-9]', ''), 10) = ?", [
          phone,
        ]).orWhereRaw("RIGHT(REGEXP_REPLACE(COALESCE(phone,''), '[^0-9]', ''), 10) = ?", [phone])
      })
      .orderBy('id', 'desc')
    let candidate =
      candidates.find((c) => (c.restaurantId ?? null) === restaurantId) ?? candidates[0] ?? null

    if (!candidate) {
      const name = String(b.name ?? '').trim()
      const [firstName, ...rest] = name ? name.split(/\s+/) : ['Sin nombre']
      const received = await Stage.findBy('code', 'received')
      candidate = await Candidate.create({
        firstName,
        lastName: rest.join(' ') || '-',
        whatsapp: phone,
        desiredRole: b.position ? String(b.position) : null,
        source: 'whatsapp',
        restaurantId,
        currentStageId: received?.id ?? null,
        privacyConsentAt: consentAt,
        privacyConsentVersion: consentVersion,
      })
    } else if (!candidate.privacyConsentAt) {
      candidate.privacyConsentAt = consentAt
      candidate.privacyConsentVersion = consentVersion
      await candidate.save()
    }

    // La cita vive como entrevista "pendiente" de Impulso, una por cita de origen.
    const marker = `wa-rec-interview:${b.interviewId ?? b.externalId}`
    let interview = await Interview.query()
      .where('candidate_id', candidate.id)
      .where('meeting_link', marker)
      .first()
    // Hora de la cita: ISO completo con zona, o fecha + interviewTime +
    // timezone. Si sólo llega la fecha, no se inventa una hora: queda a las
    // 00:00 y la nota dice "hora sin confirmar".
    const rawDate = b.interviewDate ? String(b.interviewDate) : ''
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
    const time = request.input('interviewTime')
    const zone = request.input('timezone') || 'America/Mexico_City'
    // Se guarda en la zona de la app (como el resto de las horas), no en la
    // del restaurante: 12:00 en Ciudad de México = 18:00 UTC.
    const date = !rawDate
      ? null
      : (dateOnly && time
          ? DateTime.fromISO(`${rawDate}T${String(time)}`, { zone })
          : DateTime.fromISO(rawDate, { zone })
        ).toLocal()
    const timeUnconfirmed = dateOnly && !time
    if (!interview) {
      interview = await Interview.create({
        candidateId: candidate.id,
        type: 'onsite',
        scheduledAt: date?.isValid ? date : occurredAt,
        interviewerName: '',
        location: restaurant?.name ?? null,
        meetingLink: marker,
        outcome: 'pending',
        notes: timeUnconfirmed
          ? 'Cita agendada por WhatsApp (hora sin confirmar)'
          : 'Cita agendada por WhatsApp',
        restaurantId,
      })
    } else if ((type === 'scheduled' || type === 'rescheduled') && date?.isValid) {
      // Fuera de orden: sólo cambia la fecha si este evento es el más reciente
      // de los que fijan fecha para esta cita.
      const prior = await db
        .from('candidate_stage_events')
        .where('interview_id', interview.id)
        .where('via', 'whatsapp')
        .select('extra')
      const newest = prior
        .map((r) => {
          try {
            const x = typeof r.extra === 'string' ? JSON.parse(r.extra) : r.extra
            return x?.type === 'scheduled' || x?.type === 'rescheduled'
              ? DateTime.fromISO(String(x.occurredAt))
              : null
          } catch {
            return null
          }
        })
        .filter((d): d is DateTime => !!d && d.isValid)
        .reduce<DateTime | null>((m, d) => (!m || d > m ? d : m), null)
      if (!newest || occurredAt >= newest) {
        interview.scheduledAt = date
        await interview.save()
      }
    }
    if (type === 'arrived' || type === 'no_show') {
      interview.outcome = type === 'arrived' ? 'showed' : 'no_show'
      await interview.save()
    }

    const stageCode = STAGE_BY_TYPE[type] ?? 'interview_scheduled'
    const res = await setStageTx(
      candidate.id,
      {
        stageCode,
        interviewId: interview.id,
        scheduledAt: interview.scheduledAt.toISO(),
        restaurantId,
        externalRef,
        via: 'whatsapp',
        notes: type === 'cancelled' ? 'Cita cancelada por WhatsApp' : `WhatsApp: ${type}`,
        extra: {
          occurredAt: occurredAt.toISO(),
          sourceRestaurantId: b.sourceRestaurantId ?? null,
          sourceInterviewId: b.interviewId ?? null,
          previousDate: b.previousDate ?? null,
          interviewDate: b.interviewDate ?? null,
          type,
        },
        advanceOnly: true,
        // Una cancelación sólo deja historial; no mueve la etapa.
        recordOnly: type === 'cancelled',
      },
      null
    )
    return { ok: true, candidateId: candidate.id, interviewId: interview.id, moved: res.moved }
  }
}
