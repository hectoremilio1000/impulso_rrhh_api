import { test } from '@japa/runner'
import {
  buildPromptLegacy,
  buildPromptGuidaraSubgerente,
  buildPromptGuidaraMesero,
  buildPromptGuidaraCapitan,
  buildPromptGuidaraBarman,
  buildPsychPrompt,
} from '#services/exam_prompts'

/**
 * Mocks copiados de prompt_gpt_guidara_v2 (Entregable 2 v2).
 * Si el prompt se modifica, validar que estos 3 ejemplos siguen
 * pasando JSON.parse — son el contrato con el modelo.
 */

const MOCK_1_NORMAL = `{
  "score": 68,
  "summary": "Candidato sólido en integridad y juicio operativo; áreas claras a desarrollar en empatía y motivación del equipo.",
  "strengths": [
    "Criterio firme ante tentaciones de dinero (q22, q24, q26)",
    "Razonamiento claro bajo información incompleta (q33)",
    "Disciplina en cuadre y cierre (q21, q29)"
  ],
  "risks": [
    "Respuestas genéricas en cómo levanta al equipo (q4, q42)",
    "Limitada evidencia de empatía hacia colaborador alterado (q36)",
    "Autoconciencia superficial sobre su rol en problemas (q41)"
  ],
  "recommendation": "Considerar con plan de desarrollo en habilidades blandas. Validar referencias específicamente sobre liderazgo de equipo bajo estrés.",
  "competencies": {
    "service_protocol": 75,
    "customer_communication": 65,
    "stress_conflict": 60,
    "sales_suggestions": 70,
    "teamwork_discipline": 72
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 48,
      "evidence": "Les digo que ya casi acabamos, hay que echarle ganas para irnos temprano."
    },
    "inteligencia_curiosa": {
      "score": 78,
      "evidence": "Veo cuántos comensales esperan, hablo con cocina, y si entran los 15 acepto el grupo afuera primero."
    },
    "etica_trabajo": {
      "score": 72,
      "evidence": "Sigo el checklist paso a paso aunque llegue tarde, no me brinco nada porque luego pasan errores."
    },
    "empatia": {
      "score": 55,
      "evidence": "Le pregunto qué le pasa, si necesita irse le digo que se vaya y cubro su sección con [...]"
    },
    "autoconciencia": {
      "score": 58,
      "evidence": "Una vez autoricé una cortesía grande sin checar el ticket y el gerente me llamó la atención."
    },
    "integridad": {
      "score": 88,
      "evidence": "No le tapo nada a nadie, ni siquiera a un amigo. Lo reporto al gerente y que él decida."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": false
}`

const MOCK_2_INSUFFICIENT = `{
  "score": 35,
  "summary": "Respuestas insuficientes",
  "strengths": [
    "Algunas respuestas mencionan procesos básicos (q1, q12)"
  ],
  "risks": [
    "Más del 20% de respuestas vacías o con menos de 15 palabras",
    "Falta de casos concretos en la mayoría de preguntas",
    "No hay evidencia suficiente para evaluar el perfil"
  ],
  "recommendation": "No avanzar. Si se considera, repetir examen con instrucciones más claras sobre extensión esperada de las respuestas.",
  "competencies": {
    "service_protocol": 38,
    "customer_communication": 30,
    "stress_conflict": 32,
    "sales_suggestions": 35,
    "teamwork_discipline": 40
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 0,
      "evidence": "respuesta insuficiente para evaluar"
    },
    "inteligencia_curiosa": {
      "score": 35,
      "evidence": "Reviso el horario y pongo a los que estén disponibles."
    },
    "etica_trabajo": {
      "score": 30,
      "evidence": "Sigo el manual."
    },
    "empatia": {
      "score": 0,
      "evidence": "respuesta insuficiente para evaluar"
    },
    "autoconciencia": {
      "score": 25,
      "evidence": "A veces me equivoco."
    },
    "integridad": {
      "score": 38,
      "evidence": "Lo reporto al gerente y ya."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": false
}`

const MOCK_3_QUOTES_SIMPLE = `{
  "integridad": {
    "score": 75,
    "evidence": "El gerente me dijo: 'no autorices nada sin avisarme primero'."
  }
}`

const MOCK_3_QUOTES_ESCAPED = `{
  "integridad": {
    "score": 75,
    "evidence": "El gerente me dijo: \\"no autorices nada sin avisarme primero\\"."
  }
}`

test.group('exam_prompts mocks parseables', () => {
  test('Mock 1 (caso normal) parsea como JSON válido', ({ assert }) => {
    const parsed = JSON.parse(MOCK_1_NORMAL) as any
    assert.equal(parsed.score, 68)
    assert.equal(parsed.pass, false)
    assert.equal(parsed.competenciesGuidara.integridad.score, 88)
    assert.isNull(parsed.competenciesGuidara.conocimientos_practicos.score)
  })

  test('Mock 2 (cascada A1 disparada) parsea y todos los scores caen bajo el techo', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_2_INSUFFICIENT) as any
    assert.equal(parsed.score, 35)
    assert.equal(parsed.summary, 'Respuestas insuficientes')
    for (const k of Object.keys(parsed.competencies)) {
      assert.isBelow(parsed.competencies[k], 41, `competencies.${k} debe ser <= 40`)
    }
    const guidara = parsed.competenciesGuidara
    for (const k of Object.keys(guidara)) {
      const score = guidara[k].score
      if (score !== null) {
        assert.isBelow(score, 41, `competenciesGuidara.${k}.score debe ser <= 40 o null`)
      }
    }
  })

  test('Mock 3 — evidence con comillas simples parsea', ({ assert }) => {
    const parsed = JSON.parse(MOCK_3_QUOTES_SIMPLE) as any
    assert.include(parsed.integridad.evidence, "'no autorices nada sin avisarme primero'")
  })

  test('Mock 3 — evidence con comillas escapadas parsea', ({ assert }) => {
    const parsed = JSON.parse(MOCK_3_QUOTES_ESCAPED) as any
    assert.include(parsed.integridad.evidence, '"no autorices nada sin avisarme primero"')
  })
})

test.group('buildPsychPrompt selector', () => {
  const sampleAnswers = { q1: 'respuesta 1', q2: 'respuesta 2' }

  test('Subgerente recibe el prompt Guidara', ({ assert }) => {
    const prompt = buildPsychPrompt('Subgerente', sampleAnswers)
    assert.include(prompt, 'competenciesGuidara')
    assert.include(prompt, 'optimismo_bondadoso')
    assert.include(prompt, 'TAGGING')
    assert.notInclude(prompt, 'Evalúa un EXAMEN PSICOMÉTRICO para Subgerente con criterio de RH senior.\nDevuelve SOLO JSON')
  })

  test('Mesero recibe el prompt Guidara (post-PR M2)', ({ assert }) => {
    const prompt = buildPsychPrompt('Mesero', sampleAnswers)
    assert.include(prompt, 'competenciesGuidara')
    assert.include(prompt, 'EQUIPO LATERAL')
    assert.include(prompt, 'TAGGING — qué eje mide cada pregunta del banco Mesero')
    assert.include(prompt, 'q37 → optimismo_bondadoso')
    assert.notInclude(prompt, 'q45')
  })

  test('Capitán recibe el prompt Guidara (post-PR Cp2)', ({ assert }) => {
    const prompt = buildPsychPrompt('Capitán', sampleAnswers)
    assert.include(prompt, 'competenciesGuidara')
    assert.include(prompt, 'MANDO OPERATIVO')
    assert.include(prompt, 'TAGGING — qué eje mide cada pregunta del banco Capitán')
    assert.include(prompt, 'q40 → integridad')
    assert.notInclude(prompt, 'q41')
  })

  test('Barman recibe el prompt Guidara (post-PR B2)', ({ assert }) => {
    const prompt = buildPsychPrompt('Barman', sampleAnswers)
    assert.include(prompt, 'competenciesGuidara')
    assert.include(prompt, 'DIMENSIÓN MORAL ELEVADA')
    assert.include(prompt, 'TAGGING — qué eje mide cada pregunta del banco Barman')
    assert.include(prompt, 'q25 → integridad')
    assert.notInclude(prompt, 'q26')
  })
})

test.group('builders aislados', () => {
  test('buildPromptLegacy incluye answers serializadas', ({ assert }) => {
    const answers = { q1: 'test answer with "quotes" inside' }
    const prompt = buildPromptLegacy('Mesero', answers)
    assert.include(prompt, JSON.stringify(answers))
  })

  test('buildPromptGuidaraSubgerente incluye los 45 tags q1..q45', ({ assert }) => {
    const prompt = buildPromptGuidaraSubgerente({})
    for (let i = 1; i <= 45; i++) {
      // q1 .. q9 tienen doble espacio para alinearse visualmente con q10..q45.
      const re = new RegExp(`\\bq${i}\\s+→`)
      assert.match(prompt, re, `falta el tag de q${i}`)
    }
  })

  test('buildPromptGuidaraSubgerente nombra los 6 ejes humanos + conocimientos_practicos', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraSubgerente({})
    for (const eje of [
      'optimismo_bondadoso',
      'inteligencia_curiosa',
      'etica_trabajo',
      'empatia',
      'autoconciencia',
      'integridad',
      'conocimientos_practicos',
    ]) {
      assert.include(prompt, eje, `falta el eje ${eje}`)
    }
  })

  test('buildPromptGuidaraMesero incluye los 37 tags q1..q37 y NO tiene q38..q45', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraMesero({})
    for (let i = 1; i <= 37; i++) {
      // q1 .. q9 tienen doble espacio para alinearse visualmente con q10..q37.
      const re = new RegExp(`\\bq${i}\\s+→`)
      assert.match(prompt, re, `falta el tag de q${i}`)
    }
    for (let i = 38; i <= 45; i++) {
      const re = new RegExp(`\\bq${i}\\s+→`)
      assert.notMatch(prompt, re, `q${i} no debería estar en el banco Mesero (37 preguntas)`)
    }
  })

  test('buildPromptGuidaraMesero nombra los 6 ejes humanos + conocimientos_practicos', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraMesero({})
    for (const eje of [
      'optimismo_bondadoso',
      'inteligencia_curiosa',
      'etica_trabajo',
      'empatia',
      'autoconciencia',
      'integridad',
      'conocimientos_practicos',
    ]) {
      assert.include(prompt, eje, `falta el eje ${eje}`)
    }
  })

  test('buildPromptGuidaraMesero refleja contexto del rol mesero (no del subgerente)', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraMesero({})
    assert.include(prompt, 'para Mesero con criterio de RH senior')
    assert.include(prompt, 'EQUIPO LATERAL')
    assert.include(prompt, 'NO supervisa')
    assert.include(prompt, 'q34, q35, q36, q37')
    assert.notInclude(prompt, 'mando medio operativo')
    assert.notInclude(prompt, 'caja básica')
  })

  test('buildPromptGuidaraCapitan incluye los 40 tags q1..q40 y NO tiene q41..q45', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraCapitan({})
    for (let i = 1; i <= 40; i++) {
      const re = new RegExp(`\\bq${i}\\s+→`)
      assert.match(prompt, re, `falta el tag de q${i}`)
    }
    for (let i = 41; i <= 45; i++) {
      const re = new RegExp(`\\bq${i}\\s+→`)
      assert.notMatch(prompt, re, `q${i} no debería estar en el banco Capitán (40 preguntas)`)
    }
  })

  test('buildPromptGuidaraCapitan nombra los 6 ejes humanos + conocimientos_practicos', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraCapitan({})
    for (const eje of [
      'optimismo_bondadoso',
      'inteligencia_curiosa',
      'etica_trabajo',
      'empatia',
      'autoconciencia',
      'integridad',
      'conocimientos_practicos',
    ]) {
      assert.include(prompt, eje, `falta el eje ${eje}`)
    }
  })

  test('buildPromptGuidaraCapitan refleja contexto del rol capitán (no del mesero ni subgerente)', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraCapitan({})
    assert.include(prompt, 'para Capitán con criterio de RH senior')
    assert.include(prompt, 'MANDO OPERATIVO')
    assert.include(prompt, 'NO maneja caja')
    assert.include(prompt, 'q3, q9, q15, q21, q27, q32, q38')
    assert.include(prompt, 'q4, q11, q18, q26, q34')
    assert.notInclude(prompt, 'EQUIPO LATERAL')
    assert.notInclude(prompt, 'mando medio operativo')
  })

  test('buildPromptGuidaraBarman incluye los 25 tags q1..q25 y NO tiene q26..q45', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraBarman({})
    for (let i = 1; i <= 25; i++) {
      const re = new RegExp(`\\bq${i}\\s+→`)
      assert.match(prompt, re, `falta el tag de q${i}`)
    }
    for (let i = 26; i <= 45; i++) {
      const re = new RegExp(`\\bq${i}\\s+→`)
      assert.notMatch(prompt, re, `q${i} no debería estar en el banco Barman (25 preguntas)`)
    }
  })

  test('buildPromptGuidaraBarman nombra los 6 ejes humanos + conocimientos_practicos', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraBarman({})
    for (const eje of [
      'optimismo_bondadoso',
      'inteligencia_curiosa',
      'etica_trabajo',
      'empatia',
      'autoconciencia',
      'integridad',
      'conocimientos_practicos',
    ]) {
      assert.include(prompt, eje, `falta el eje ${eje}`)
    }
  })

  test('buildPromptGuidaraBarman refleja contexto del rol barman (aislamiento + dinero+alcohol, no mando ni mesa)', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraBarman({})
    assert.include(prompt, 'para Barman con criterio de RH senior')
    assert.include(prompt, 'DIMENSIÓN MORAL ELEVADA')
    assert.include(prompt, 'MAYOR exposición directa a dinero líquido + alcohol')
    assert.include(prompt, '60 centímetros')
    assert.include(prompt, 'MOTOR DE BARRA')
    assert.include(prompt, 'EJE DE MAYOR EXPOSICIÓN')
    assert.notInclude(prompt, 'EQUIPO LATERAL')
    assert.notInclude(prompt, 'MANDO OPERATIVO')
  })
})
