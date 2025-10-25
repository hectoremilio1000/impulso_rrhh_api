import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Interview from '#models/interview'
import Candidate from '#models/candidate'
import { setStageTx } from '#services/stage_service'

export default class InterviewsController {
  // POST /api/candidates/:id/interviews
  async store({ params, request, response }: HttpContext) {
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
    })

    await setStageTx(
      candidateId,
      {
        stageCode: 'interview_scheduled',
        interviewId: interview.id,
        scheduledAt: interview.scheduledAt.toISO(),
        notes: 'Entrevista agendada',
      },
      null
    )

    return interview
  }

  // PATCH /api/interviews/:id
  async update({ params, request }: HttpContext) {
    const interview = await Interview.findOrFail(params.id)
    const payload = request.only([
      'outcome',
      'notes',
      'scheduledAt',
      'type',
      'location',
      'meetingLink',
      'interviewerName',
    ])

    if (payload.scheduledAt) interview.scheduledAt = DateTime.fromISO(String(payload.scheduledAt))
    if (payload.type) interview.type = payload.type
    if (payload.location !== undefined) interview.location = payload.location
    if (payload.meetingLink !== undefined) interview.meetingLink = payload.meetingLink
    if (payload.interviewerName) interview.interviewerName = payload.interviewerName
    if (payload.notes !== undefined) interview.notes = payload.notes
    if (payload.outcome) interview.outcome = payload.outcome

    await interview.save()

    if (payload.outcome) {
      await setStageTx(
        interview.candidateId,
        {
          stageCode: 'interviewed',
          interviewId: interview.id,
          interviewOutcome: payload.outcome,
          notes: 'Resultado de entrevista',
        },
        null
      )
    }

    return interview
  }
}
