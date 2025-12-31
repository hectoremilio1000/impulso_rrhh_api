import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import PsychTest from '#models/psych_test'
import Candidate from '#models/candidate'
import { setStageTx } from '#services/stage_service'
import { makePublicToken } from '#services/public_token'

export default class PsychTestsController {
  // POST /api/candidates/:id/psych-tests
  async store({ params, request, response }: HttpContext) {
    const candidateId = Number(params.id)
    const c = await Candidate.find(candidateId)
    if (!c) return response.notFound({ error: 'Candidate not found' })

    const payload = request.only(['testName', 'assignedAt', 'notes'])

    const test = await PsychTest.create({
      candidateId,
      testName: payload.testName,
      assignedAt: payload.assignedAt
        ? DateTime.fromISO(String(payload.assignedAt))
        : DateTime.now(),
      accessToken: makePublicToken(),
      notes: payload.notes ?? null,
    })

    await setStageTx(
      candidateId,
      {
        stageCode: 'psychometric_assigned',
        psychTestId: test.id,
        testName: test.testName,
        notes: payload.notes ?? 'Psicométrico asignado',
      },
      null
    )

    return test
  }

  // PATCH /api/psych-tests/:id/result
  async result({ params, request }: HttpContext) {
    const test = await PsychTest.findOrFail(params.id)
    const payload = request.only(['takenAt', 'score', 'passed', 'notes', 'reportUrl'])

    if (payload.takenAt) test.takenAt = DateTime.fromISO(String(payload.takenAt))
    if (payload.score !== undefined) test.score = payload.score
    if (payload.passed !== undefined) test.passed = payload.passed
    if (payload.notes !== undefined) test.notes = payload.notes
    if (payload.reportUrl !== undefined) test.reportUrl = payload.reportUrl
    await test.save()

    await setStageTx(
      test.candidateId,
      {
        stageCode: payload.passed ? 'psychometric_passed' : 'psychometric_failed',
        psychTestId: test.id,
        testName: test.testName,
        testScore: test.score ?? null,
        testPassed: !!payload.passed,
        notes: payload.notes ?? null,
      },
      null
    )

    return test
  }
}
