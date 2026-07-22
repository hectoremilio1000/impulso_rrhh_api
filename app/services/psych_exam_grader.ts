// app/services/psych_exam_grader.ts
//
// Orquestador de calificación del examen psicométrico.
//
// Es la ÚNICA puerta que debe llamar psychSubmit. Decide la estrategia y arma
// el reporte final con la forma que el front espera ({ score, competenciesGuidara, ... }).
//
// Estrategia:
//   · Puesto CON tagging de preguntas (los 6 de piso) → calificación POR EJE
//     con rúbrica + evidencia verificada (psych_axis_grader). Es la vía que se
//     validó el 2026-07-20 con 4 parejas sólido/flojo. Usa gpt-4o porque
//     gpt-4o-mini no diferencia (se esconde en "Pendiente").
//   · Puesto SIN tagging (rol raro que cae al legacy) → prompt monolítico viejo
//     + gate de coherencia (validatePsychReport) como red de seguridad.
//
// El score raíz (para passed >= 82) se deriva del promedio de los ejes Guidara
// EVALUABLES — el mismo dato que usa la decisión del front. Antes venía del
// promedio de 5 "competencies" que el front ni muestra.

import logger from '@adonisjs/core/services/logger'
import { gradeExamJson, GPT_MODEL_ESCALADO } from '#services/openai'
import { buildPsychPrompt } from '#services/exam_prompts'
import { rolTieneTagging } from '#services/psych_question_tags'
import { gradeAllAxes, EJES_EVALUABLES } from '#services/psych_axis_grader'
import { validatePsychReport, sanitizePsychReport } from '#services/psych_report_validator'

// Modelo por defecto de la calificación por eje. gpt-4o-mini quedó descartado
// para esta tarea (no diferencia); ver la prueba de parejas del 2026-07-20.
const MODELO_POR_EJE = process.env.OPENAI_MODEL_PSYCH || GPT_MODEL_ESCALADO

// Umbral de aprobado del psicométrico. Se mantiene el histórico.
const UMBRAL_APROBADO = 82

export type PsychGradeResult = {
  aiReport: any
  score: number | null
  passed: boolean | null
  estrategia: 'por_eje' | 'legacy'
}

/** Promedio de los ejes Guidara evaluables con número. null si ninguno. */
function scoreDesdeEjes(competenciesGuidara: any): number | null {
  const nums = EJES_EVALUABLES.map((e) => competenciesGuidara?.[e]?.score).filter(
    (s): s is number => typeof s === 'number' && Number.isFinite(s)
  )
  if (nums.length === 0) return null
  return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2))
}

/**
 * Califica el examen. NO toca la base — devuelve el reporte para que el
 * controller lo persista.
 */
export async function gradePsychExam(
  role: string,
  answers: any,
  candidateId?: number
): Promise<PsychGradeResult> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      aiReport: { note: 'OPENAI_API_KEY no configurada' },
      score: null,
      passed: null,
      estrategia: 'legacy',
    }
  }

  // ── Vía nueva: calificación por eje ──────────────────────────────────
  if (rolTieneTagging(role)) {
    const { competenciesGuidara, detalle } = await gradeAllAxes(role, answers, {
      model: MODELO_POR_EJE,
    })

    const pendientes = detalle.filter((d) => d.score === null)
    if (pendientes.length > 0) {
      logger.info(
        {
          candidateId,
          role,
          modelo: MODELO_POR_EJE,
          pendientes: pendientes.map((p) => ({ eje: p.eje, motivo: p.motivoPendiente })),
        },
        'Calificación por eje: algunos ejes quedaron en Pendiente'
      )
    }

    const score = scoreDesdeEjes(competenciesGuidara)
    const aiReport = {
      score,
      competenciesGuidara,
      pass: score !== null && score >= UMBRAL_APROBADO,
      estrategia: 'por_eje',
      _detalleEjes: detalle.map((d) => ({
        eje: d.eje,
        score: d.score,
        quotes: d.quotes,
        motivoPendiente: d.motivoPendiente,
      })),
    }

    return {
      aiReport,
      score,
      passed: score !== null ? score >= UMBRAL_APROBADO : null,
      estrategia: 'por_eje',
    }
  }

  // ── Vía legacy: prompt monolítico + gate de coherencia ───────────────
  // Sólo para puestos sin banco tagueado (rol atípico que cae a Mesero-legacy).
  const prompt = buildPsychPrompt(role, answers)
  let aiReport: any = await gradeExamJson(prompt)
  let validation = validatePsychReport(aiReport, answers)

  if (!validation.ok) {
    logger.warn(
      { candidateId, role, issues: validation.issues, escalandoA: GPT_MODEL_ESCALADO },
      'Reporte psicométrico legacy incoherente, escalando a un modelo más fuerte'
    )
    const retry = await gradeExamJson(prompt, { model: GPT_MODEL_ESCALADO })
    const retryValidation = validatePsychReport(retry, answers)
    if (retryValidation.ok || retryValidation.issues.length < validation.issues.length) {
      aiReport = retry
      validation = retryValidation
    }
  }

  if (!validation.ok) {
    logger.error(
      { candidateId, role, issues: validation.issues },
      'Reporte psicométrico legacy sigue incoherente: se degrada a INCOMPLETO'
    )
    aiReport = sanitizePsychReport(aiReport, validation)
  }

  const scoreNum = Number(aiReport?.score ?? NaN)
  const score = Number.isNaN(scoreNum) ? null : scoreNum
  return {
    aiReport,
    score,
    passed: score !== null ? score >= UMBRAL_APROBADO : null,
    estrategia: 'legacy',
  }
}
