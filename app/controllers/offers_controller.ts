import type { HttpContext } from '@adonisjs/core/http'
import Offer from '#models/offer'
import Candidate from '#models/candidate'
import { setStageTx } from '#services/stage_service'
import { makePublicToken } from '#services/public_token'
import { requireUser } from '#services/actor'

export default class OffersController {
  // POST /api/candidates/:id/offers
  async store(ctx: HttpContext) {
    const { params, request, response } = ctx
    const user = requireUser(ctx)
    const candidateId = Number(params.id)
    const c = await Candidate.find(candidateId)
    if (!c) return response.notFound({ error: 'Candidate not found' })

    const body = request.only([
      'salaryOfferMx',
      'weeklyTipsOfferMx',
      'roleOffered',
      'startDate',
      'notes',
      'restaurantId',
    ])

    const offer = await Offer.create({
      candidateId,
      salaryOfferMx: body.salaryOfferMx ?? null,
      weeklyTipsOfferMx: body.weeklyTipsOfferMx ?? null,
      roleOffered: body.roleOffered ?? null,
      startDate: body.startDate ?? null,
      publicToken: makePublicToken(),
      status: 'made',
      notes: body.notes ?? null,
      restaurantId: body.restaurantId ?? c.restaurantId ?? null,
      createdByUserId: user.id,
    })

    await setStageTx(
      candidateId,
      {
        stageCode: 'offer_made',
        offerId: offer.id,
        decision: 'offer_made',
        restaurantId: offer.restaurantId ?? null,
        via: 'panel',
        notes: 'Oferta realizada',
      },
      user.id
    )

    return offer
  }

  // PATCH /api/offers/:id  (status: made|accepted|declined)
  //
  // Aceptar una oferta NO es contratar: la contratación se registra aparte,
  // con la fecha de ingreso (POST /candidates/:id/employments).
  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const user = requireUser(ctx)
    const offer = await Offer.findOrFail(params.id)
    const status = String(request.input('status') || offer.status)
    const notes = request.input('notes') ?? null
    if (!['made', 'accepted', 'declined'].includes(status)) {
      return response.badRequest({ error: 'status: made, accepted o declined' })
    }

    offer.status = status
    if (notes !== null) offer.notes = notes
    await offer.save()

    const map: Record<string, string> = {
      accepted: 'offer_accepted',
      declined: 'offer_declined',
      made: 'offer_made',
    }
    const stageCode = map[status] || 'offer_made'

    await setStageTx(
      offer.candidateId,
      {
        stageCode,
        offerId: offer.id,
        decision: stageCode,
        restaurantId: offer.restaurantId ?? null,
        via: 'panel',
        notes,
      },
      user.id
    )

    return offer
  }
}
