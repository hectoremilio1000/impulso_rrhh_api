import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Candidate from '#models/candidate'
import PreviousJob from '#models/previous_job'
import Stage from '#models/stage'
import PsychTest from '#models/psych_test'
import PracticalTest from '#models/practical_test'
import { makePublicToken } from '#services/public_token'
import { DateTime } from 'luxon'

function roleToCode(desiredRole: string): string {
  const v = (desiredRole || '').toLowerCase().trim()
  if (v === 'mesero') return 'waiter'
  if (v === 'capitán' || v === 'capitan') return 'captain'
  if (v === 'cocinero') return 'cook'
  if (v === 'barman' || v === 'bartender') return 'barman'
  if (v === 'chef gerente' || v === 'chef_gerente') return 'chef_manager'
  return 'waiter'
}

export default class PublicApplyFullController {
  async apply({ request }: HttpContext) {
    const { candidate, jobs } = request.only(['candidate', 'jobs'])

    const out = await db.transaction(async (trx) => {
      // 1) candidato
      const c = await Candidate.create(
        {
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email ?? null,
          phone: candidate.phone ?? null,
          whatsapp: candidate.whatsapp ?? null,
          desiredRole: candidate.desiredRole ?? null,
          salaryExpectation: candidate.salaryExpectation ?? null,
          desiredWeeklyTips: candidate.desiredWeeklyTips ?? null,
          street: candidate.street ?? null,
          extNumber: candidate.extNumber ?? null,
          intNumber: candidate.intNumber ?? null,
          neighborhood: candidate.neighborhood ?? null,
          city: candidate.city ?? null,
          state: candidate.state ?? null,
          postalCode: candidate.postalCode ?? null,
          country: candidate.country ?? 'MX',
          source: 'public_apply',
          notes: candidate.notes ?? null,
        },
        { client: trx }
      )

      // 2) stage received (NO auto-brincos)
      const received = await Stage.query({ client: trx }).where('code', 'received').first()
      if (received) {
        c.currentStageId = received.id
        await c.useTransaction(trx).save()
      }

      // 3) previous_jobs
      const arr = Array.isArray(jobs) ? jobs : []
      for (const j of arr) {
        await PreviousJob.create(
          {
            candidateId: c.id,
            companyName: j.companyName ?? null,
            roleTitle: j.roleTitle ?? null,
            startDate: j.startDate ?? null,
            endDate: j.endDate ?? null,
            isCurrent: !!j.isCurrent,
            baseSalary: j.baseSalary ?? null,
            weeklyTips: j.weeklyTips ?? null,
            refContactName: j.refContactName ?? null,
            refContactPhone: j.refContactPhone ?? null,
            refContactEmail: j.refContactEmail ?? null,
            refRelationship: j.refRelationship ?? null,
            refConsent: !!j.refConsent,
            responsibilities: j.responsibilities ?? null,
            achievements: j.achievements ?? null,
            separationReason: j.separationReason ?? null,
          } as any,
          { client: trx }
        )
      }

      const roleCode = roleToCode(String(c.desiredRole ?? ''))
      const now = DateTime.now()

      // 4) psych test (sin cambiar etapa)
      const psych = await PsychTest.create(
        {
          candidateId: c.id,
          testName: `PSYCH_${roleCode.toUpperCase()}_V1`,
          assignedAt: now,
          accessToken: makePublicToken(),
          notes: null,
        } as any,
        { client: trx }
      )

      // 5) practical test
      const prac = await PracticalTest.create(
        {
          candidateId: c.id,
          roleCode,
          testName: `PRACTICAL_${roleCode.toUpperCase()}_V1`,
          assignedAt: now,
          accessToken: makePublicToken(),
        } as any,
        { client: trx }
      )

      return {
        candidateId: c.id,
        roleCode,
        psychToken: psych.accessToken,
        practicalToken: prac.accessToken,
      }
    })

    return {
      ok: true,
      ...out,
    }
  }
}
