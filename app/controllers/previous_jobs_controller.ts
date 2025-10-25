import type { HttpContext } from '@adonisjs/core/http'
import PreviousJob from '#models/previous_job'
import Candidate from '#models/candidate'

export default class PreviousJobsController {
  // POST /api/candidates/:id/previous-jobs
  async store({ params, request, response }: HttpContext) {
    const candidateId = Number(params.id)
    const c = await Candidate.find(candidateId)
    if (!c) return response.notFound({ error: 'Candidate not found' })

    const body = request.only([
      'companyName',
      'roleTitle',
      'startDate',
      'endDate',
      'isCurrent',
      'baseSalary',
      'weeklyTips',
      'refContactName',
      'refContactPhone',
      'refContactEmail',
      'refRelationship',
      'refConsent',
      'responsibilities',
      'achievements',
      'separationReason',
    ])

    const job = await PreviousJob.create({ candidateId, ...body })
    return job
  }

  // GET /api/candidates/:id/previous-jobs
  async list({ params }: HttpContext) {
    const candidateId = Number(params.id)
    return PreviousJob.query().where('candidate_id', candidateId).orderBy('start_date', 'desc')
  }

  // PATCH /api/previous-jobs/:jobId
  async update({ params, request }: HttpContext) {
    const job = await PreviousJob.findOrFail(params.jobId)
    const body = request.only([
      'companyName',
      'roleTitle',
      'startDate',
      'endDate',
      'isCurrent',
      'baseSalary',
      'weeklyTips',
      'refContactName',
      'refContactPhone',
      'refContactEmail',
      'refRelationship',
      'refConsent',
      'responsibilities',
      'achievements',
      'separationReason',
    ])
    job.merge(body)
    await job.save()
    return job
  }

  // DELETE /api/previous-jobs/:jobId
  async destroy({ params }: HttpContext) {
    const job = await PreviousJob.findOrFail(params.jobId)
    await job.delete()
    return { ok: true }
  }
}
