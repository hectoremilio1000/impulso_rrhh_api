import { test } from '@japa/runner'
import {
  buildPromptLegacy,
  buildPromptGuidaraSubgerente,
  buildPromptGuidaraMesero,
  buildPromptGuidaraCapitan,
  buildPromptGuidaraBarman,
  buildPromptGuidaraChef,
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

  test('Chef gerente recibe el prompt Guidara (post-PR Chef2)', ({ assert }) => {
    // El label "Chef gerente" llega aquí canonicalizado por
    // normalizePsychRole en public_controller.ts (las 3 variantes vivas
    // — "Chef", "Chef gerente", "Chef y Gerente" — colapsan a este label
    // antes del whitelist). Este test verifica solo el routing del
    // selector; el alias chef se cubre en normalize_psych_role.spec.ts.
    const prompt = buildPsychPrompt('Chef gerente', sampleAnswers)
    assert.include(prompt, 'competenciesGuidara')
    assert.include(prompt, 'para Chef con criterio de RH senior')
    assert.include(prompt, 'TAGGING — qué eje mide cada pregunta del banco Chef')
    assert.include(prompt, 'q30 → inteligencia_curiosa')
    assert.notInclude(prompt, 'q31')
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

  test('buildPromptGuidaraChef incluye los 30 tags q1..q30 y NO tiene q31..q45', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraChef({})
    for (let i = 1; i <= 30; i++) {
      // q1 .. q9 tienen doble espacio para alinearse visualmente con q10..q30.
      const re = new RegExp(`\\bq${i}\\s+→`)
      assert.match(prompt, re, `falta el tag de q${i}`)
    }
    for (let i = 31; i <= 45; i++) {
      const re = new RegExp(`\\bq${i}\\s+→`)
      assert.notMatch(prompt, re, `q${i} no debería estar en el banco Chef (30 preguntas)`)
    }
  })

  test('buildPromptGuidaraChef nombra los 6 ejes humanos + conocimientos_practicos', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraChef({})
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

  test('buildPromptGuidaraChef refleja contexto MANDO-COCINA del rol chef (no cocinero ejecutor)', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraChef({})
    assert.include(prompt, 'para Chef con criterio de RH senior')
    // Contexto MANDO ALTO de cocina (no ejecutor de estación).
    assert.include(prompt, 'MANDO ALTO de BACK-OF-HOUSE')
    assert.include(prompt, 'SEGUNDO puesto del cronograma Guidara con ÉTICA CRÍTICO')
    // Núcleo conceptual MODELA vs EJECUTA.
    assert.include(prompt, 'El Chef MODELA disciplina; los cocineros la EJECUTAN')
    assert.include(prompt, 'MULTIPLICADOR')
    // Bandas más estrictas que cocinero (+5).
    assert.include(prompt, '85/70 vs 80/65 cocinero')
    assert.include(prompt, '80/65 vs 75/60 cocinero')
    // q25 (escandallo desactualizado) como caso CANÓNICO.
    assert.include(prompt, 'q25 = escandallo desactualizado que NADIE TE ESTÁ PIDIENDO')
    assert.include(prompt, 'caso CANÓNICO')
    // NO debe incluir contexto de roles previos.
    assert.notInclude(prompt, 'EQUIPO LATERAL')
    assert.notInclude(prompt, 'MOTOR DE BARRA')
    assert.notInclude(prompt, 'MANDO OPERATIVO')
  })

  test('buildPromptGuidaraChef distribución por eje (int 7, éti 6, emp 5, ac 5, intcur 4, opt 3)', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraChef({})
    // Conteo declarado en el texto del prompt (línea final del TAGGING).
    assert.include(
      prompt,
      'integridad 7 · etica_trabajo 6 · empatia 5 · autoconciencia 5 · inteligencia_curiosa 4 · optimismo_bondadoso 3'
    )
    // Verificación estructural del tagging crítico (los 13 críticos):
    // integridad q1, q5, q9, q13, q18, q22, q27 + ética q3, q7, q11, q15, q20, q25.
    for (const q of [1, 5, 9, 13, 18, 22, 27]) {
      assert.match(prompt, new RegExp(`\\bq${q}\\s+→ integridad`), `q${q} debe ser integridad`)
    }
    for (const q of [3, 7, 11, 15, 20, 25]) {
      assert.match(prompt, new RegExp(`\\bq${q}\\s+→ etica_trabajo`), `q${q} debe ser etica_trabajo`)
    }
  })

  test('buildPromptGuidaraChef thresholds A1/A2/A3 recalculados para 30 preguntas', ({
    assert,
  }) => {
    const prompt = buildPromptGuidaraChef({})
    // A1: >20% de 30 = más de 6 (i.e. 7+).
    assert.include(prompt, 'más de 6 preguntas para Chef, o sea 7 o más')
    // A2: <50% de 30 = menos de 15.
    assert.include(prompt, 'menos de 15 preguntas con caso concreto para Chef')
    // A3: >30% de 30 = más de 9 (i.e. 10+).
    assert.include(prompt, 'más de 9 preguntas para Chef, o sea 10 o más')
  })
})
