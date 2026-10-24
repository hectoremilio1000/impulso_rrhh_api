import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import PsychTest from '#models/psych_test'
import Candidate from '#models/candidate'
import { setStageTx } from '#services/stage_service'
import { makePublicToken } from '#services/public_token'
import {
  IMPULSO_INSTRUMENT,
  resolveRoleCode,
  roleCodeFromTestName,
  toRoleCode,
  type RoleCode,
} from '#services/role_catalog'

export default class PsychTestsController {
  // POST /api/candidates/:id/psych-tests
  async store({ params, request, response }: HttpContext) {
    const candidateId = Number(params.id)
    const c = await Candidate.find(candidateId)
    if (!c) return response.notFound({ error: 'Candidate not found' })

    const payload = request.only(['instrument', 'roleCode', 'testName', 'assignedAt', 'notes'])

    // 2026-10-23 — Instrumento y puesto son datos distintos.
    // - instrument 'impulso_psych': nuestro examen; el puesto se fija
    //   aquí (roleCode explícito, o el puesto actual del candidato) y queda en
    //   role_code + testName PSYCH_<CODE>_V1. Sin puesto válido → 422.
    // - instrument 'external': otra prueba (p. ej. "DISC") con nombre libre;
    //   NO se convierte en examen Impulso ni se aplica en el link público.
    // Sin instrument explícito: un nombre libre es externo; vacío o
    // PSYCH_<CODE>_V1 es nuestro examen. Nunca se convierte uno en otro.
    let testName = String(payload.testName || '').trim()
    const instrument =
      payload.instrument === 'external' ||
      (payload.instrument !== IMPULSO_INSTRUMENT.psych && testName && !roleCodeFromTestName(testName))
        ? 'external'
        : IMPULSO_INSTRUMENT.psych
    let roleCode: RoleCode | null = null
    if (instrument === 'external') {
      if (!testName) return response.badRequest({ error: 'testName es requerido para un instrumento externo' })
    } else {
      // Un puesto pedido explícitamente y no válido se rechaza; no se
      // sustituye en silencio por el puesto actual del candidato.
      if (payload.roleCode !== undefined && payload.roleCode !== null && !toRoleCode(payload.roleCode)) {
        return response.unprocessableEntity({ error: `Puesto no válido: ${String(payload.roleCode)}` })
      }
      roleCode = toRoleCode(payload.roleCode) ?? roleCodeFromTestName(testName) ?? resolveRoleCode(c.desiredRole)
      if (!roleCode) {
        return response.unprocessableEntity({
          error: 'Define un puesto válido para el candidato antes de asignar el psicométrico.',
        })
      }
      testName = `PSYCH_${roleCode.toUpperCase()}_V1`
    }

    const test = await PsychTest.create({
      candidateId,
      testName,
      instrument,
      roleCode,
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
