import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Interview from '#models/interview'
import Candidate from '#models/candidate'
import { setStageTx } from '#services/stage_service'
import { currentUser, requireUser } from '#services/actor'

export default class InterviewsController {
  // POST /api/candidates/:id/interviews
  async store(ctx: HttpContext) {
    const { params, request, response } = ctx
    const candidateId = Number(params.id)
    const c = await Candidate.find(candidateId)
    if (!c) return response.notFound({ error: 'Candidate not found' })

    const payload = request.only([
      'type',
      'scheduledAt',
      'interviewerName',
      'location',
      'meetingLink',
      'notes',
      'restaurantId',
    ])

    const interview = await Interview.create({
      candidateId,
      type: payload.type,
      scheduledAt: payload.scheduledAt
        ? DateTime.fromISO(String(payload.scheduledAt))
        : DateTime.now(),
      interviewerName: payload.interviewerName,
      location: payload.location ?? null,
      meetingLink: payload.meetingLink ?? null,
      outcome: 'pending',
      notes: payload.notes ?? null,
      restaurantId: payload.restaurantId ?? c.restaurantId ?? null,
      recordedByUserId: currentUser(ctx)?.id ?? null,
    })

    await setStageTx(
      candidateId,
      {
        stageCode: 'interview_scheduled',
        interviewId: interview.id,
        scheduledAt: interview.scheduledAt.toISO(),
        restaurantId: interview.restaurantId ?? null,
        via: 'panel',
        notes: 'Entrevista agendada',
        advanceOnly: true,
      },
      currentUser(ctx)?.id ?? null
    )

    return interview
  }

  // PATCH /api/interviews/:id
  //
  // outcome: showed → llegó a la cita; no_show → no llegó; passed/failed →
  // entrevista realizada (guarda fecha y entrevistador). Una cita agendada
  // nunca cuenta como entrevista realizada.
  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const interview = await Interview.findOrFail(params.id)
    const payload = request.only([
      'outcome',
      'notes',
      'scheduledAt',
      'type',
      'location',
      'meetingLink',
      'interviewerName',
      'heldAt',
    ])
    const OUTCOMES = ['pending', 'showed', 'no_show', 'passed', 'failed']
    if (payload.outcome && !OUTCOMES.includes(payload.outcome)) {
      return response.badRequest({ error: `Resultado: ${OUTCOMES.join(', ')}` })
    }
    const held = payload.outcome === 'passed' || payload.outcome === 'failed'
    const user =
      held || payload.outcome === 'showed' || payload.outcome === 'no_show'
        ? requireUser(ctx)
        : null

    if (payload.scheduledAt) interview.scheduledAt = DateTime.fromISO(String(payload.scheduledAt))
    if (payload.type) interview.type = payload.type
    if (payload.location !== undefined) interview.location = payload.location
    if (payload.meetingLink !== undefined) interview.meetingLink = payload.meetingLink
    if (payload.interviewerName) interview.interviewerName = payload.interviewerName
    if (payload.notes !== undefined) interview.notes = payload.notes
    if (payload.outcome) interview.outcome = payload.outcome
    if (held) {
      const at = payload.heldAt ? DateTime.fromISO(String(payload.heldAt)) : DateTime.now()
      if (!at.isValid || at > DateTime.now().plus({ minutes: 5 })) {
        return response.badRequest({ error: 'La entrevista realizada no puede tener fecha futura' })
      }
      interview.heldAt = at
      interview.interviewerUserId = user!.id
    }

    await interview.save()

    const stageCode =
      payload.outcome === 'showed'
        ? 'arrived'
        : payload.outcome === 'no_show'
          ? 'no_show'
          : held
            ? 'interviewed'
            : null
    if (stageCode) {
      await setStageTx(
        interview.candidateId,
        {
          stageCode,
          interviewId: interview.id,
          interviewOutcome: payload.outcome,
          restaurantId: interview.restaurantId ?? null,
          via: 'panel',
          notes: held
            ? 'Entrevista realizada'
            : stageCode === 'arrived'
              ? 'Llegó a la cita'
              : 'No llegó a la cita',
          advanceOnly: true,
        },
        user?.id ?? null
      )
    }

    return interview
  }
}
