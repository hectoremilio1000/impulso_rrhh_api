import { test } from '@japa/runner'
import {
  validatePsychReport,
  sanitizePsychReport,
  promedioPonderado,
  contarRespuestasSustanciales,
} from '#services/psych_report_validator'

/** Genera answers_json con la forma real: { q1: { question, answer } }. */
function mockAnswers(n: number, palabrasPorRespuesta: number) {
  const out: any = {}
  for (let i = 1; i <= n; i++) {
    out[`q${i}`] = {
      question: `Pregunta ${i}`,
      answer: Array.from({ length: palabrasPorRespuesta }, (_, k) => `palabra${k}`).join(' '),
    }
  }
  return out
}

/**
 * Gate de coherencia del reporte psicométrico (bug Guidara-en-ceros, 2026-07-20).
 *
 * Caso real que lo motivó — candidato 768 (Capitán):
 *   - 40/40 preguntas contestadas, 41 palabras de promedio, ninguna vacía.
 *   - La IA devolvió los 6 ejes evaluables de Guidara en 0 con evidence
 *     "respuesta insuficiente para evaluar" (falso).
 *   - Y un score raíz de 61.25 cuando el promedio ponderado de sus propias
 *     competencies (todas en 40) daba exactamente 40.
 *   - Nada validaba eso → se persistía tal cual → el motor Guidara del front
 *     leía los ceros como "Rojo" y disparaba R1/R2/R3 → DESCARTAR falso.
 *
 * Auditoría: 11 de 94 exámenes calificados quedaron con TODOS los ejes en 0,
 * y 25 más con algún eje en 0. Afecta a todos los puestos, no sólo Capitán.
 */

/** Reporte sano de referencia. */
function reporteOk() {
  return {
    score: 70,
    competencies: {
      service_protocol: 70,
      customer_communication: 70,
      stress_conflict: 70,
      sales_suggestions: 70,
      teamwork_discipline: 70,
    },
    competenciesGuidara: {
      integridad: { score: 80, evidence: 'cita real' },
      autoconciencia: { score: 75, evidence: 'cita real' },
      empatia: { score: 70, evidence: 'cita real' },
      conocimientos_practicos: { score: null, evidence: 'evaluado en el examen práctico' },
      etica_trabajo: { score: 85, evidence: 'cita real' },
      inteligencia_curiosa: { score: 65, evidence: 'cita real' },
      optimismo_bondadoso: { score: 72, evidence: 'cita real' },
    },
    pass: false,
  }
}

/** Réplica del reporte real del candidato 768. */
function reporte768() {
  const ejes = [
    'integridad',
    'autoconciencia',
    'empatia',
    'etica_trabajo',
    'inteligencia_curiosa',
    'optimismo_bondadoso',
  ]
  const guidara: any = {
    conocimientos_practicos: { score: null, evidence: 'evaluado en el examen práctico' },
  }
  for (const e of ejes) guidara[e] = { score: 0, evidence: 'respuesta insuficiente para evaluar' }
  return {
    score: 61.25,
    competencies: {
      service_protocol: 40,
      customer_communication: 40,
      stress_conflict: 40,
      sales_suggestions: 40,
      teamwork_discipline: 40,
    },
    competenciesGuidara: guidara,
    pass: false,
  }
}

test.group('validatePsychReport — reportes sanos', () => {
  test('un reporte coherente pasa sin issues', ({ assert }) => {
    const r = validatePsychReport(reporteOk())
    assert.isTrue(r.ok)
    assert.lengthOf(r.issues, 0)
  })

  test('conocimientos_practicos en null NO es un issue (se evalúa en el práctico)', ({
    assert,
  }) => {
    const rep = reporteOk()
    assert.isNull(rep.competenciesGuidara.conocimientos_practicos.score)
    assert.isTrue(validatePsychReport(rep).ok)
  })

  test('ceros legítimos con score raíz bajo NO se marcan como incoherentes', ({ assert }) => {
    // Examen realmente vacío: la IA capó el raíz a 40 Y puso ceros. Coherente.
    const rep: any = reporte768()
    rep.score = 40
    const r = validatePsychReport(rep)
    assert.notInclude(r.issues, 'guidara_todo_cero_incoherente')
  })
})

test.group('validatePsychReport — el bug del candidato 768', () => {
  test('detecta los 7 ejes en 0 con score raíz alto', ({ assert }) => {
    const r = validatePsychReport(reporte768())
    assert.isFalse(r.ok)
    assert.include(r.issues, 'guidara_todo_cero_incoherente')
  })

  test('detecta que el score raíz (61.25) no coincide con sus competencies (40)', ({ assert }) => {
    const r = validatePsychReport(reporte768())
    assert.include(r.issues, 'score_raiz_incoherente')
  })

  test('promedioPonderado calcula 40 para el reporte del 768', ({ assert }) => {
    assert.equal(promedioPonderado(reporte768()), 40)
  })

  test('reporte sin bloque Guidara se marca ausente', ({ assert }) => {
    const rep: any = reporteOk()
    delete rep.competenciesGuidara
    assert.include(validatePsychReport(rep).issues, 'guidara_ausente')
  })

  test('respuesta no parseable de la IA se marca', ({ assert }) => {
    assert.include(validatePsychReport({ raw: 'no era JSON' }).issues, 'reporte_no_parseable')
    assert.include(validatePsychReport(null).issues, 'reporte_no_parseable')
  })
})

test.group('sanitizePsychReport — degradar a INCOMPLETO, nunca inventar', () => {
  test('los ceros incoherentes pasan a null (el front los lee como Pendiente, no Rojo)', ({
    assert,
  }) => {
    const rep = reporte768()
    const out: any = sanitizePsychReport(rep, validatePsychReport(rep))
    for (const eje of [
      'integridad',
      'autoconciencia',
      'empatia',
      'etica_trabajo',
      'inteligencia_curiosa',
      'optimismo_bondadoso',
    ]) {
      assert.isNull(out.competenciesGuidara[eje].score, `${eje} debe quedar en null, no en 0`)
    }
  })

  test('el score raíz incoherente se recalcula con la fórmula documentada', ({ assert }) => {
    const rep = reporte768()
    const out: any = sanitizePsychReport(rep, validatePsychReport(rep))
    assert.equal(out.score, 40)
    assert.equal(out._scoreOriginalIA, 61.25, 'se conserva lo que dijo la IA para auditoría')
  })

  test('deja rastro auditable en _validation y guarda el bloque original', ({ assert }) => {
    const rep = reporte768()
    const out: any = sanitizePsychReport(rep, validatePsychReport(rep))
    assert.isFalse(out._validation.ok)
    assert.isNotEmpty(out._validation.details)
    assert.isObject(out._competenciesGuidaraOriginal)
  })

  test('un reporte sano NO se toca', ({ assert }) => {
    const rep = reporteOk()
    const out: any = sanitizePsychReport(rep, validatePsychReport(rep))
    assert.equal(out.score, 70)
    assert.equal(out.competenciesGuidara.integridad.score, 80)
    assert.isUndefined(out._validation)
  })
})


test.group('validatePsychReport — señal de respuestas (la que de verdad decide)', () => {
  test('ceros + respuestas sustanciales → incoherente aunque el raíz sea 40', ({ assert }) => {
    // Caso de los 9 candidatos que el umbral de score dejaba pasar: la IA capaba
    // el raíz a 40 y zereaba a la vez, así que "internamente" se veía coherente.
    const rep: any = reporte768()
    rep.score = 40
    const sinRespuestas = validatePsychReport(rep)
    assert.notInclude(sinRespuestas.issues, 'guidara_todo_cero_incoherente')

    const conRespuestas = validatePsychReport(rep, mockAnswers(45, 20))
    assert.include(conRespuestas.issues, 'guidara_todo_cero_incoherente')
  })

  test('ceros + respuestas de verdad pobres → se respetan (no es falso positivo)', ({ assert }) => {
    const rep: any = reporte768()
    rep.score = 40
    const r = validatePsychReport(rep, mockAnswers(20, 3))
    assert.notInclude(r.issues, 'guidara_todo_cero_incoherente')
  })

  test('un reporte sano con respuestas sustanciales sigue sano', ({ assert }) => {
    assert.isTrue(validatePsychReport(reporteOk(), mockAnswers(40, 30)).ok)
  })

  test('contarRespuestasSustanciales lee la forma real { question, answer }', ({ assert }) => {
    const r = contarRespuestasSustanciales(mockAnswers(10, 20))
    assert.equal(r.total, 10)
    assert.equal(r.sustanciales, 10)
    assert.equal(r.fraccion, 1)
  })

  test('contarRespuestasSustanciales tolera strings sueltos y vacíos', ({ assert }) => {
    const r = contarRespuestasSustanciales({
      q1: 'una '.repeat(20),
      q2: 'corta',
      q3: '',
    })
    assert.equal(r.total, 3)
    assert.equal(r.sustanciales, 1)
  })
})
