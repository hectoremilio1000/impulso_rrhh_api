import { gradeExamJson, GPT_MODEL_ESCALADO } from '#services/openai'
import { gradeConRubrica } from '#services/practical_rubric_grader'
import { RUBRICA_SUBGERENTE } from '#services/practical_rubrics/assistant_manager'
import { RUBRICA_SUBGERENTE_V2 } from '#services/practical_rubrics/assistant_manager_v2'
import { RUBRICA_SUBGERENTE_V3 } from '#services/practical_rubrics/assistant_manager_v3'
import { bancoPorHuella } from '#services/practical_banks/assistant_manager'
import { fingerprintAnswers } from '#services/bank_fingerprint'
import {
  enPiloto,
  enunciadosPractico,
  fichaPorHuella,
  huellaRubrica,
  preguntasAbiertas,
  preguntasNumericas,
} from '#services/exam_catalog/index'

// Calificación del examen práctico. Movida desde
// public_practical_tests_controller para reutilizarla al calificar tras una
// revisión humana. Subgerente usa su rúbrica del puesto (2026-10-27); los
// demás puestos siguen con la rúbrica GENÉRICA de servicio de piso.
export const PRACTICAL_GRADING_VERSION = {
  grader: 'practico-generico-piso-v1',
  passThreshold: 82,
} as const

export const PRACTICAL_GRADING_VERSION_SUBGERENTE = {
  grader: 'practico-rubrica-v3.3',
  rubric: 'rubrica_subgerente_v1.1 (banco v1) · v2 (banco v2) · v3 (banco v3)',
  model: process.env.OPENAI_MODEL_PSYCH || GPT_MODEL_ESCALADO,
  passThreshold: 82,
} as const

// Rúbrica según el banco con que se contestó: una respuesta a la v1 nunca se
// califica como respuesta a la v2.
const RUBRICA_POR_BANCO = {
  banco_subgerente_v1: { rubrica: RUBRICA_SUBGERENTE, version: 'rubrica_subgerente_v1.1' },
  banco_subgerente_v2: { rubrica: RUBRICA_SUBGERENTE_V2, version: 'rubrica_subgerente_v2' },
  banco_subgerente_v3: { rubrica: RUBRICA_SUBGERENTE_V3, version: 'rubrica_subgerente_v3' },
} as const

/** Práctico por rúbrica del puesto (catálogo 2026-11-16): todos los puestos. */
export const PRACTICAL_GRADING_VERSION_CATALOGO = {
  // v3.10 (2026-11-22, cierre de Codex): la negación se decide en la cláusula
  // de la acción y «no X sin Y» afirma; una cita que sólo dice para qué no
  // acredita; Encargado P8 reabrir por impresión propia es error crítico;
  // Encargado P12 «escrito» pide el soporte.
  // v3.9 (2026-11-20, cierre): partes en lista y reabre; acción clave en conteo;
  // con error crítico también se confirman los elementos.
  // v3.8 (2026-11-20, cierre): «no … hasta que …» afirma; un elemento con su
  // propia condición no es «condicionada»; partes en precio y tortilla.
  // v3.7 (2026-11-20): una cita que niega la acción no la acredita.
  // v3.6 (2026-11-20): ids del modelo con acento o eñe se reconocen.
  // v3.5 (2026-11-20, DEV): «completo» sólo con partes explícitas de la ficha;
  // alternativas válidas en la confirmación. v3.4 (2026-11-19, ronda 4): perspectiva del puesto, partes obligatorias
  // completas, citas literales y recuperación de citas reformuladas.
  // v3.11 (2026-11-23, VERIFICACION_V24): frontera alternativa/actualiza en
  // Hostess P3 y control de recepción en Encargado P3 (ficha, no código).
  // v3.12 (2026-11-23, cierre): cita sin tramo literal se ancla a su oración
  // (Gerente C6 P13); error crítico «prueba con flama» en Encargado P8.
  // v3.13 (cierre): partes obligatorias en los elementos compuestos de Gerente P9.
  // v3.14 (cierre, VERIFICACION_FINAL_V28 B1): cada parte obligatoria de un
  // elemento acreditado necesita su propio fragmento literal.
  // v3.15: esa pregunta usa la misma tolerancia de redacción que la confirmación,
  // la cita de cada parte puede anclarse a su oración y se guarda cada respuesta.
  // v3.16: la cita de una parte que repite la rúbrica no cuenta (código y prompt).
  // v3.17: la comprobación parte por parte sólo para `partesEscritas` (acciones o
  // datos escritos); las interpretativas, con la confirmación general.
  grader: 'practico-rubrica-v3.17',
  model: PRACTICAL_GRADING_VERSION_SUBGERENTE.model,
} as const

/** Versión con la que se califica el práctico de cada puesto. */
export function practicalGradingVersion(roleCode: string, huella?: string | null) {
  if (roleCode === 'assistant_manager' && enPiloto(roleCode)) return PRACTICAL_GRADING_VERSION_SUBGERENTE
  const ficha = huella === undefined ? null : fichaPorHuella('practical', roleCode, huella)
  return ficha
    ? {
        ...PRACTICAL_GRADING_VERSION_CATALOGO,
        rubric: ficha.practico.version,
        passThreshold: ficha.practico.umbralAprobado,
      }
    : PRACTICAL_GRADING_VERSION
}

export type PracticalGradeResult = {
  aiReport: any
  score: number | null
  passed: boolean | null
}

/** Rúbrica genérica de piso (la anterior); se conserva para los demás puestos. */
export async function gradePracticalGenerico(
  roleCode: string,
  answers: unknown
): Promise<PracticalGradeResult> {
  if (!process.env.OPENAI_API_KEY) {
    return { aiReport: { note: 'OPENAI_API_KEY no configurada' }, score: null, passed: null }
  }
  const prompt = `
Evalúa un EXAMEN PRÁCTICO para el puesto: ${roleCode} con criterio de RH senior.
Devuelve SOLO JSON válido con esta forma EXACTA:
{
  "score": number,                 // 0 a 100
  "passed": boolean,
  "summary": string,
  "strengths": string[],
  "risks": string[],
  "recommendation": string,
  "competencies": {
    "service_protocol": number,    // 0 a 100
    "customer_communication": number,
    "stress_conflict": number,
    "sales_suggestions": number,
    "teamwork_discipline": number
  }
}

PESOS (total 100):
- service_protocol: 30
- customer_communication: 25
- stress_conflict: 20
- sales_suggestions: 15
- teamwork_discipline: 10

UMBRAL APTO (passed=true):
- score global >= 82
- service_protocol >= 70
- customer_communication >= 70
- ninguna competencia < 55

Reglas obligatorias (prioridad alta):
- Si MÁS de 20% de respuestas están vacías o con menos de 15 palabras, score <= 40 y summary "Respuestas insuficientes".
- Si MENOS de 70% de respuestas incluyen pasos concretos (acción + orden + detalle técnico), score <= 50.
- No inventes información no presente en las respuestas.
- Sin markdown, sin \`\`\`.

Guía de evaluación:
- 90-100: pasos claros, detalle técnico y decisiones correctas.
- 75-89: buenas respuestas con algunos vacíos.
- 55-74: genéricas o poco técnicas.
- <55: insuficientes.

ANSWERS:
${JSON.stringify(answers)}
`.trim()

  const aiReport = await gradeExamJson(prompt)
  const scoreNum = Number(aiReport?.score ?? Number.NaN)
  if (Number.isNaN(scoreNum)) return { aiReport, score: null, passed: null }
  return { aiReport, score: scoreNum, passed: scoreNum >= PRACTICAL_GRADING_VERSION.passThreshold }
}

export async function gradePracticalExam(
  roleCode: string,
  answers: unknown
): Promise<PracticalGradeResult> {
  if (!process.env.OPENAI_API_KEY) {
    return { aiReport: { note: 'OPENAI_API_KEY no configurada' }, score: null, passed: null }
  }
  // Rúbrica por banco de Subgerente: sólo cuando Subgerente entre al piloto;
  // mientras tanto su práctico vigente (v1) se califica como antes.
  if (roleCode === 'assistant_manager' && enPiloto(roleCode)) {
    const banco = bancoPorHuella(fingerprintAnswers(answers))
    if (!banco) {
      return {
        aiReport: {
          status: 'banco_no_reconocido',
          note: 'Las preguntas no son de un banco conocido de Subgerente; no se califica.',
        },
        score: null,
        passed: null,
      }
    }
    const r = RUBRICA_POR_BANCO[banco.version]
    return gradeConRubrica({
      rol: 'Subgerente',
      rubrica: r.rubrica,
      answers,
      preguntasBanco: banco.preguntas,
      version: {
        ...PRACTICAL_GRADING_VERSION_SUBGERENTE,
        bank: banco.version,
        bankFingerprint: banco.huella,
        rubric: r.version,
      },
      passThreshold: PRACTICAL_GRADING_VERSION_SUBGERENTE.passThreshold,
    })
  }
  // Puestos del catálogo: rúbrica de la ficha cuyo banco se contestó.
  const huella = fingerprintAnswers(answers)
  const ficha = fichaPorHuella('practical', roleCode, huella)
  if (ficha) {
    return gradeConRubrica({
      rol: ficha.label,
      rubrica: preguntasAbiertas(ficha),
      numericas: preguntasNumericas(ficha),
      dimensiones: ficha.practico.dimensiones,
      answers,
      preguntasBanco: enunciadosPractico(ficha),
      version: {
        ...PRACTICAL_GRADING_VERSION_CATALOGO,
        rubric: ficha.practico.version,
        bank: ficha.practico.version,
        bankFingerprint: huella,
        rubricHash: huellaRubrica(ficha),
        passThreshold: ficha.practico.umbralAprobado,
        // Piloto: sin aprobado/no aprobado; revisión humana por respuesta
        // crítica o por conocimiento indispensable sin comprobar.
        decisionPolicy: 'piloto-sin-decision-v1',
        perspectiva: 'puesto-v3',
      },
      passThreshold: ficha.practico.umbralAprobado,
      sinDecisionAutomatica: true,
      perspectiva: 'puesto',
    })
  }
  // Bancos anteriores al catálogo de los 5 puestos de piso/cocina/barra: sólo
  // se conservan para no romper una recalificación autorizada de históricos.
  if (['waiter', 'captain', 'cook', 'barman', 'chef_manager', 'assistant_manager'].includes(roleCode)) {
    return gradePracticalGenerico(roleCode, answers)
  }
  return {
    aiReport: {
      status: 'banco_no_reconocido',
      note: 'Las preguntas no son del banco vigente del puesto; no se califica.',
    },
    score: null,
    passed: null,
  }
}
