import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import path from 'node:path'
import { DateTime } from 'luxon'
import Candidate from '#models/candidate'
import CandidateAddressMedium from '#models/candidate_address_medium'
import FtpAddressMediaUploader from '#services/ftp_address_media_uploader'

export default class CandidateAddressMediaController {
  // POST /api/candidates/:id/address-media
  async upload({ params, request, response }: HttpContext) {
    const candidateId = Number(params.id)
    const candidate = await Candidate.find(candidateId)
    if (!candidate) return response.notFound({ error: 'Candidate not found' })

    const mediaType = String(request.input('mediaType') || 'facade')

    const file = request.file('file', {
      size: '30mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })
    if (!file) return response.badRequest({ error: 'file requerido' })
    if (!file.isValid) return response.badRequest({ error: file.errors })

    const tmpDir = app.makePath('tmp')
    await file.move(tmpDir, { name: `${Date.now()}_${file.clientName || 'addr'}` })
    const localPath = path.join(tmpDir, file.fileName!)

    const url = await FtpAddressMediaUploader.upload({ candidateId, localPath })

    // capturedAt opcional
    const cap = request.input('capturedAt')
    const capturedAt = cap ? DateTime.fromISO(String(cap)) : null

    const created = await CandidateAddressMedium.create({
      candidateId,
      mediaType,
      url,
      filename: file.clientName || file.fileName!,
      sizeBytes: BigInt(file.size),
      capturedAt,
      lat: request.input('lat') ?? null,
      lng: request.input('lng') ?? null,
      notes: request.input('notes') ?? null,
    })

    return { ok: true, media: created }
  }

  // GET /api/candidates/:id/address-media
  async list({ params, response }: HttpContext) {
    const candidateId = Number(params.id)
    if (!candidateId) return response.badRequest({ error: 'id inválido' })
    const rows = await CandidateAddressMedium.query()
      .where('candidate_id', candidateId)
      .orderBy('captured_at', 'desc')
      .orderBy('id', 'desc')
    return { ok: true, media: rows }
  }

  // DELETE /api/candidates/:id/address-media/:mediaId
  async destroy({ params, response }: HttpContext) {
    const candidateId = Number(params.id)
    const mediaId = Number(params.mediaId)

    const row = await CandidateAddressMedium.query()
      .where('id', mediaId)
      .andWhere('candidate_id', candidateId)
      .first()
    if (!row) return response.notFound({ error: 'Media no encontrada' })

    await row.delete()
    return { ok: true }
  }
}
