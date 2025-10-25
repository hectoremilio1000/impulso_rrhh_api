import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import path from 'node:path'
import Candidate from '#models/candidate'
import CandidateCvFile from '#models/candidate_cv_file'
import FtpCvUploader from '#services/ftp_cv_uploader'

export default class CandidateFilesController {
  // POST /api/candidates/:id/cv
  async upload({ params, request, response }: HttpContext) {
    const candidateId = Number(params.id)
    const candidate = await Candidate.find(candidateId)
    if (!candidate) return response.notFound({ error: 'Candidate not found' })

    const file = request.file('file', {
      size: '40mb',
      extnames: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'],
    })
    if (!file) return response.badRequest({ error: 'file requerido' })
    if (!file.isValid) return response.badRequest({ error: file.errors })

    const tmpDir = app.makePath('tmp')
    await file.move(tmpDir, { name: `${Date.now()}_${file.clientName || 'cv'}` })
    const localPath = path.join(tmpDir, file.fileName!)

    const url = await FtpCvUploader.upload({
      candidateId,
      localPath,
      originalName: file.clientName || file.fileName!,
    })

    const hasPrimary = await CandidateCvFile.query()
      .where('candidate_id', candidateId)
      .andWhere('is_primary', true)
      .first()

    const created = await CandidateCvFile.create({
      candidateId,
      url,
      filename: file.clientName || file.fileName!,
      isPrimary: hasPrimary ? false : true,
    })

    return { ok: true, cv: created }
  }

  // GET /api/candidates/:id/cv
  async list({ params, response }: HttpContext) {
    const candidateId = Number(params.id)
    if (!candidateId) return response.badRequest({ error: 'id inválido' })
    const rows = await CandidateCvFile.query()
      .where('candidate_id', candidateId)
      .orderBy('is_primary', 'desc')
      .orderBy('id', 'desc')
    return { ok: true, files: rows }
  }

  // PATCH /api/candidates/:id/cv/:cvId/primary
  async setPrimary({ params, response }: HttpContext) {
    const candidateId = Number(params.id)
    const cvId = Number(params.cvId)

    const row = await CandidateCvFile.query()
      .where('id', cvId)
      .andWhere('candidate_id', candidateId)
      .first()

    if (!row) return response.notFound({ error: 'CV no encontrado' })

    await CandidateCvFile.query().where('candidate_id', candidateId).update({ isPrimary: false })
    row.isPrimary = true
    await row.save()
    return { ok: true }
  }

  // DELETE /api/candidates/:id/cv/:cvId
  async destroy({ params, response }: HttpContext) {
    const candidateId = Number(params.id)
    const cvId = Number(params.cvId)

    const row = await CandidateCvFile.query()
      .where('id', cvId)
      .andWhere('candidate_id', candidateId)
      .first()
    if (!row) return response.notFound({ error: 'CV no encontrado' })

    await row.delete()
    return { ok: true }
  }
}
