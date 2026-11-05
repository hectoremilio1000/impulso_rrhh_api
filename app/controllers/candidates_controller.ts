import type { HttpContext } from '@adonisjs/core/http'
import Candidate from '#models/candidate'
import Stage from '#models/stage'
import { setStageTx, EVIDENCE_STAGES } from '#services/stage_service'
import { currentUser } from '#services/actor'
import { DateTime } from 'luxon'

export default class CandidatesController {
  async index({ request }: HttpContext) {
    const q = String(request.input('q') || '').trim()
    const stageId = request.input('stageId')
    const page = Number(request.input('page') || 1)
    const limit = Number(request.input('limit') || 20)

    const query = Candidate.query()
      .preload('currentStage') // 👈
      .orderBy('updated_at', 'desc')

    if (q) {
      query.where((b) => {
        b.whereILike('first_name', `%${q}%`)
          .orWhereILike('last_name', `%${q}%`)
          .orWhereILike('email', `%${q}%`)
          .orWhereILike('phone', `%${q}%`)
          .orWhereILike('whatsapp', `%${q}%`)
          .orWhereILike('desired_role', `%${q}%`)
      })
    }
    if (stageId) query.where('current_stage_id', stageId)

    return query.paginate(page, limit)
  }

  async store({ request }: HttpContext) {
    const body = request.only([
      'firstName',
      'lastName',
      'email',
      'phone',
      'whatsapp',
      'desiredRole',
      'salaryExpectation',
      'desiredWeeklyTips',
      'street',
      'extNumber',
      'intNumber',
      'neighborhood',
      'city',
      'state',
      'postalCode',
      'country',
      'lat',
      'lng',
      'mapsPlaceId',
      'source',
      'notes',
      'stageId',
      'stageCode',
    ])

    const c = await Candidate.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email ?? null,
      phone: body.phone ?? null,
      whatsapp: body.whatsapp ?? null,
      desiredRole: body.desiredRole ?? null,
      salaryExpectation: body.salaryExpectation ?? null,
      desiredWeeklyTips: body.desiredWeeklyTips ?? null,
      street: body.street ?? null,
      extNumber: body.extNumber ?? null,
      intNumber: body.intNumber ?? null,
      neighborhood: body.neighborhood ?? null,
      city: body.city ?? null,
      state: body.state ?? null,
      postalCode: body.postalCode ?? null,
      country: body.country ?? null,
      lat: body.lat ?? null,
      lng: body.lng ?? null,
      mapsPlaceId: body.mapsPlaceId ?? null,
      source: body.source ?? 'web_form',
    })

    const stage = body.stageId
      ? await Stage.findOrFail(body.stageId)
      : await Stage.findByOrFail('code', body.stageCode || 'received')

    c.currentStageId = stage.id
    await c.save()
    return c
  }

  async show({ params }: HttpContext) {
    return Candidate.query()
      .where('id', params.id)
      .preload('currentStage')
      .preload('cvFiles')
      .preload('addressMedia')
      .preload('previousJobs')
      .preload('interviews')
      .preload('offers')
      .preload('psychTests')
      .preload('examAssignments')
      .preload('stageEvents', (q) => q.orderBy('at', 'desc').orderBy('id', 'desc').preload('stage'))
      .firstOrFail()
  }

  async update({ params, request }: HttpContext) {
    const c = await Candidate.findOrFail(params.id)
    const body = request.only([
      'firstName',
      'lastName',
      'email',
      'phone',
      'whatsapp',
      'desiredRole',
      'salaryExpectation',
      'desiredWeeklyTips',
      'street',
      'extNumber',
      'intNumber',
      'neighborhood',
      'city',
      'state',
      'postalCode',
      'country',
      'lat',
      'lng',
      'mapsPlaceId',
      'source',
      'notes',
      'restaurantId',
      'commuteMinutesApprox',
      'scheduleAvailability',
      'acceptsVacancyConditions',
      'vacancyConditionsSeen',
    ])
    c.merge(body)
    if (body.acceptsVacancyConditions !== undefined) c.conditionsAnsweredAt = DateTime.now()
    await c.save()
    return c
  }

  // PATCH /api/candidates/:id/stage
  //
  // Las etapas que dependen de un hecho comprobable (llegó, entrevistado,
  // evaluación presentada, oferta aceptada, contratado, baja) no se ponen a
  // mano: se registran con su propia acción, que guarda fecha y responsable.
  async setStage(ctx: HttpContext) {
    const { params, request, response } = ctx
    const candidateId = Number(params.id)
    const payload = request.only([
      'stageId',
      'stageCode',
      'via',
      'notes',
      'extra',
      'interviewId',
      'scheduledAt',
      'interviewOutcome',
      'psychTestId',
      'testName',
      'testScore',
      'testPassed',
      'knowledgeAssignmentId',
      'offerId',
      'decision',
      'reasonCode',
    ])

    let code = payload.stageCode as string | undefined
    if (!code && payload.stageId) {
      const stage = await Stage.find(payload.stageId)
      code = stage?.code
    }
    if (code && EVIDENCE_STAGES[code]) {
      return response.unprocessableEntity({ error: EVIDENCE_STAGES[code], stageCode: code })
    }

    try {
      const res = await setStageTx(
        candidateId,
        { ...payload, via: payload.via ?? 'panel' },
        currentUser(ctx)?.id ?? null
      )
      return res
    } catch (e: any) {
      return response.badRequest({ error: e.message })
    }
  }
}
