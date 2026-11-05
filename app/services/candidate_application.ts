import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Candidate from '#models/candidate'
import PreviousJob from '#models/previous_job'
import Stage from '#models/stage'
import PsychTest from '#models/psych_test'
import PracticalTest from '#models/practical_test'
import { makePublicToken } from '#services/public_token'
import { IMPULSO_INSTRUMENT, type RoleCode } from '#services/role_catalog'

// Alta de una solicitud: candidato, empleos anteriores y los dos exámenes de
// su puesto. La usan la solicitud web (/apply) y el pase presencial, para que
// las dos vías creen exactamente lo mismo.

export type ApplicationInput = {
  candidate: Record<string, any>
  jobs: unknown
  roleCode: RoleCode
  restaurantId: number | null
  evaluationPassId?: number | null
}

export type ApplicationResult = {
  candidateId: number
  roleCode: RoleCode
  psychToken: string
  practicalToken: string
}

/** Restaurantes donde la solicitud sólo se llena en persona, con pase. */
export async function isInPersonOnly(restaurantId: number | null): Promise<boolean> {
  if (!restaurantId) return false
  const row = await db.from('rrhh_restaurant_settings').where('restaurant_id', restaurantId).first()
  return Boolean(row?.in_person_only)
}

export async function createApplication(
  trx: TransactionClientContract,
  input: ApplicationInput
): Promise<ApplicationResult> {
  const { candidate, jobs, roleCode, restaurantId } = input

  // Datos de permanencia declarados: sólo se guardan, no descartan a nadie.
  const commute = Number(candidate?.commuteMinutesApprox)
  const commuteMinutesApprox =
    Number.isInteger(commute) && commute >= 0 && commute <= 300 ? commute : null
  const accepts =
    typeof candidate?.acceptsVacancyConditions === 'boolean'
      ? candidate.acceptsVacancyConditions
      : null

  // 1) candidato
  const fields = {
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
    source: input.evaluationPassId ? 'presencial' : 'public_apply',
    notes: candidate.notes ?? null,
    restaurantId,
    commuteMinutesApprox,
    scheduleAvailability: candidate.scheduleAvailability ?? null,
    acceptsVacancyConditions: accepts,
    vacancyConditionsSeen: candidate.vacancyConditionsSeen ?? null,
    conditionsAnsweredAt: accepts === null ? null : DateTime.now(),
    // El formulario nuevo exige aceptar el aviso; el anterior no lo manda.
    privacyConsentAt: candidate.privacyConsentVersion ? DateTime.now() : null,
    privacyConsentVersion: candidate.privacyConsentVersion
      ? String(candidate.privacyConsentVersion).slice(0, 20)
      : null,
  }

  // Si la persona ya llegó por WhatsApp a este restaurante (mismo teléfono)
  // y todavía no presenta exámenes, la solicitud completa ESE registro en
  // lugar de crear un duplicado. Se conservan su origen, su etapa y su
  // consentimiento.
  const digits = String(candidate.whatsapp || candidate.phone || '')
    .replace(/\D/g, '')
    .slice(-10)
  let c: Candidate | null = null
  if (digits.length === 10 && restaurantId) {
    c = await Candidate.query({ client: trx })
      .where('source', 'whatsapp')
      .where('restaurant_id', restaurantId)
      .whereRaw("RIGHT(REGEXP_REPLACE(COALESCE(whatsapp,''), '[^0-9]', ''), 10) = ?", [digits])
      .whereNotExists((q) =>
        q.from('psych_tests').whereRaw('psych_tests.candidate_id = candidates.id')
      )
      .orderBy('id', 'desc')
      .first()
  }
  if (c) {
    // El origen (whatsapp) se conserva.
    const rest = { ...fields, source: c.source }
    c.merge({
      ...rest,
      privacyConsentAt: c.privacyConsentAt ?? rest.privacyConsentAt,
      privacyConsentVersion: c.privacyConsentVersion ?? rest.privacyConsentVersion,
    })
    await c.useTransaction(trx).save()
  } else {
    c = await Candidate.create(fields, { client: trx })
    // 2) stage received (NO auto-brincos)
    const received = await Stage.query({ client: trx }).where('code', 'received').first()
    if (received) {
      c.currentStageId = received.id
      await c.useTransaction(trx).save()
    }
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

  const now = DateTime.now()
  const evaluationPassId = input.evaluationPassId ?? null

  // 4) psych test (sin cambiar etapa)
  const psych = await PsychTest.create(
    {
      candidateId: c.id,
      testName: `PSYCH_${roleCode.toUpperCase()}_V1`,
      roleCode,
      instrument: IMPULSO_INSTRUMENT.psych,
      assignedAt: now,
      accessToken: makePublicToken(),
      notes: null,
      evaluationPassId,
    } as any,
    { client: trx }
  )

  // 5) practical test
  const prac = await PracticalTest.create(
    {
      candidateId: c.id,
      roleCode,
      testName: `PRACTICAL_${roleCode.toUpperCase()}_V1`,
      instrument: IMPULSO_INSTRUMENT.practical,
      assignedAt: now,
      accessToken: makePublicToken(),
      evaluationPassId,
    } as any,
    { client: trx }
  )

  return {
    candidateId: c.id,
    roleCode,
    psychToken: psych.accessToken!,
    practicalToken: prac.accessToken!,
  }
}
