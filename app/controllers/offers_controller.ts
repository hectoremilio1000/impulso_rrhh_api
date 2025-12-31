import type { HttpContext } from '@adonisjs/core/http'
import Offer from '#models/offer'
import Candidate from '#models/candidate'
import { setStageTx } from '#services/stage_service'
import { makePublicToken } from '#services/public_token'

export default class OffersController {
  // POST /api/candidates/:id/offers
  async store({ params, request, response }: HttpContext) {
    const candidateId = Number(params.id)
    const c = await Candidate.find(candidateId)
    if (!c) return response.notFound({ error: 'Candidate not found' })

    const body = request.only([
      'salaryOfferMx',
      'weeklyTipsOfferMx',
      'roleOffered',
      'startDate',
      'notes',
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
    })

    await setStageTx(
      candidateId,
      {
        stageCode: 'offer_made',
        offerId: offer.id,
        decision: 'offer_made',
        notes: 'Oferta realizada',
      },
      null
    )

    return offer
  }

  // PATCH /api/offers/:id  (status: made|accepted|declined)
  async update({ params, request }: HttpContext) {
    const offer = await Offer.findOrFail(params.id)
    const status = String(request.input('status') || offer.status)
    const notes = request.input('notes') ?? null

    offer.status = status
    if (notes !== null) offer.notes = notes
    await offer.save()

    const map: Record<string, string> = {
      accepted: 'hired',
      declined: 'rejected',
      made: 'offer_made',
    }
    const stageCode = map[status] || 'offer_made'

    await setStageTx(
      offer.candidateId,
      {
        stageCode,
        offerId: offer.id,
        decision: stageCode,
        notes,
      },
      null
    )

    return offer
  }
}
