import { test } from '@japa/runner'

/**
 * Mocks copiados de prompt_gpt_guidara_capitan_v1 (Entregable del prompt — Capitán).
 * Sección 2 del Doc: los 3 perfiles base (FUERTE / MEDIO / DÉBIL) + Mock 4 Parte A
 * (LÍMITE con autoconciencia en banda ámbar).
 *
 * Si el prompt se modifica, validar que estos 4 ejemplos siguen pasando
 * JSON.parse — son el contrato con el modelo. El frontend (componente
 * radar) consume directamente el shape de estos JSON.
 */

const MOCK_1_FUERTE = `{
  "score": 85,
  "summary": "Candidato fuerte para mando de piso: pre-turno con frase real que arranca al equipo, delegación con criterio explícito en escenario de presión, cierre con reconocimiento concreto, recibe corrección pública sin tronar al superior ni al equipo.",
  "strengths": [
    "Briefing pre-turno con frase real, no abstracta (q9)",
    "Delegación en presión sostenida con criterio explícito por persona (q7)",
    "Mesero quemado en pasillo: 30 segundos con acción concreta, no consejo (q21)",
    "Cierre cotidiano con reconocimiento aterrizado al turno específico (q32)",
    "Corrección pública del superior: aguantó el mando con el equipo y procesó después en privado (q26)"
  ],
  "risks": [
    "Bajar cambio de menú al equipo: se apoya en repetir la indicación, poca verificación de que entendieron (q30)",
    "Detección de instrucción mala en vivo: la reconoce a posteriori, no en el momento de decirla (q34)"
  ],
  "recommendation": "Avanzar a entrevista y práctico. Validar con referencia el caso del sábado lleno con el mesero nuevo si es verificable. Plan de desarrollo opcional en verificación post-briefing: agregarle una pregunta de cierre al pre-turno para confirmar que el equipo entendió antes de abrir.",
  "competencies": {
    "service_protocol": 87,
    "customer_communication": 85,
    "stress_conflict": 88,
    "sales_suggestions": 75,
    "teamwork_discipline": 88
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 88,
      "evidence": "Antes de abrir les dije 'el de la mesa 14 es cumpleaños, el primero que lo cache se lleva el aplauso del cierre', y entraron riendo."
    },
    "inteligencia_curiosa": {
      "score": 78,
      "evidence": "Al cliente que llega con día encima lo distingo porque pide la carta y la cierra rápido sin verla — ese viene a desahogarse, no a comer."
    },
    "etica_trabajo": {
      "score": 84,
      "evidence": "En el cierre les pido revisar el hielo derretido y la superficie del paso porque mañana arranca a las 11 y eso pegado no sale."
    },
    "empatia": {
      "score": 86,
      "evidence": "El nuevo me decía sí pero la cara decía no entendí. Lo aparté 2 minutos y le hice repetirme la promo con sus palabras antes de soltarlo."
    },
    "autoconciencia": {
      "score": 80,
      "evidence": "El gerente me corrigió delante del equipo. En el momento bajé la voz y seguí el servicio. Después del cierre fui yo a buscarlo, no esperé que él me buscara."
    },
    "integridad": {
      "score": 90,
      "evidence": "Si el dueño me pide cobrar de más a una mesa, no lo hago. Le digo que esa mesa la cobro como manda la cuenta y que él hable conmigo después."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": true
}`

const MOCK_2_MEDIO_A2 = `{
  "score": 49,
  "summary": "Respuestas correctas en intención pero genéricas; menos del 50% incluye un caso concreto verificable.",
  "strengths": [
    "Postura ética declarada consistente con descuentos y favoritismos (q8, q20)",
    "Reconoce que el pre-turno importa, aunque no aterriza una frase real (q9)"
  ],
  "risks": [
    "Mayoría de respuestas en abstracto, sin situación + acción + resultado",
    "Sin evidencia de delegación real bajo presión (q7) ni de un caso específico de mediación en sala (q33)",
    "Bajar cambios de menú contestado en piloto automático, sin ejemplo de un cambio concreto y cómo lo verificó con el equipo (q30)",
    "Los cinco escenarios de autoconciencia bajo presión (q4, q11, q18, q26, q34) tienen respuesta pero ninguno nombra un día, un superior o una decisión identificable"
  ],
  "recommendation": "No avanzar con este perfil tal cual. Si la sucursal tiene urgencia de mando, repetir examen con instrucción explícita: 'cuenta UN caso real, con qué pasó, qué hiciste y cómo terminó'. El contenido conceptual está; falta evidencia de que ha dirigido en vivo y no solo leído sobre el rol.",
  "competencies": {
    "service_protocol": 50,
    "customer_communication": 50,
    "stress_conflict": 45,
    "sales_suggestions": 48,
    "teamwork_discipline": 50
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 45,
      "evidence": "Antes de abrir le doy ánimos al equipo y trato de que entren con buena vibra al turno, sin gritar."
    },
    "inteligencia_curiosa": {
      "score": 48,
      "evidence": "Observo el piso y voy leyendo las mesas para saber dónde poner atención y por qué bajan las ventas."
    },
    "etica_trabajo": {
      "score": 50,
      "evidence": "En el cierre reviso que las estaciones queden listas y hago lo que toca aunque el equipo ya se quiera ir."
    },
    "empatia": {
      "score": 50,
      "evidence": "Cuando dos del equipo discuten los separo, escucho a cada uno y trato de que vuelvan a trabajar juntos."
    },
    "autoconciencia": {
      "score": 45,
      "evidence": "Cuando un superior me corrige escucho y aprendo, no me lo tomo personal y sigo dirigiendo al equipo."
    },
    "integridad": {
      "score": 50,
      "evidence": "Si un colaborador llega tarde de nuevo hablo con él primero antes de escalar al gerente, en privado."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": false
}`

const MOCK_3_DEBIL_A1_B = `{
  "score": 35,
  "summary": "Respuestas insuficientes",
  "strengths": [
    "Postura básica de no ceder ante presión de un superior (q12)"
  ],
  "risks": [
    "Más del 20% de respuestas vacías o con menos de 15 palabras",
    "Eje completo de optimismo sin contenido evaluable: las 7 preguntas (q3, q9, q15, q21, q27, q32, q38) vacías o <15 palabras — incluye los 5 escenarios operativos nuevos del banco v2 que son el filtro real del mando de piso (briefing pre-turno q9, mesero quemado q21, turno lento q27, cierre cotidiano q32, amplificar acción extra q38) más las 2 heredadas (motivar sin gritar q3, cansado pero liderar q15)",
    "Sin evidencia de capacidad para arrancar al equipo en pre-turno, levantar a un mesero en pasillo, sostener turno lento o cerrar con reconocimiento",
    "Respuestas que sí están contestadas son procedimentales y reactivas — describen pasos, no decisiones de mando bajo presión"
  ],
  "recommendation": "No avanzar. El bloque optimismo es el que separa al capitán que dirige al equipo del capitán que solo lo supervisa; sin contenido en ninguna de las 7 preguntas del eje, el perfil no califica para mando de piso de un restaurante que vende experiencia. Los 5 escenarios operativos nuevos (q9, q21, q27, q32, q38) son el filtro real y este candidato no cruza ninguno; las 2 heredadas (q3, q15) tampoco.",
  "competencies": {
    "service_protocol": 38,
    "customer_communication": 35,
    "stress_conflict": 35,
    "sales_suggestions": 32,
    "teamwork_discipline": 38
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 0,
      "evidence": "respuesta insuficiente para evaluar"
    },
    "inteligencia_curiosa": {
      "score": 38,
      "evidence": "Veo a las mesas y al equipo, si algo va mal lo corrijo en el momento."
    },
    "etica_trabajo": {
      "score": 35,
      "evidence": "En el cierre hago lo que me toca y no me brinco pasos del protocolo del lugar."
    },
    "empatia": {
      "score": 38,
      "evidence": "Al del equipo que se pone a la defensiva le hablo bonito y trato de calmarlo antes de regañarlo."
    },
    "autoconciencia": {
      "score": 32,
      "evidence": "Cuando me corrigen me callo y aguanto, después se me pasa y sigo dirigiendo."
    },
    "integridad": {
      "score": 40,
      "evidence": "Si veo a alguien del equipo robando le digo: 'eso no se hace, párale ya', y si sigue le aviso al gerente al cierre."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": false
}`

const MOCK_4_LIMITE = `{
  "score": 84,
  "summary": "Candidato apto en sistema legacy con alta consistencia en protocolo y manejo de presión; señales puntuales de prevención en autoconciencia bajo el rigor de mando (lectura propia en estrés, recepción de corrección pública, instrucción mala en vivo).",
  "strengths": [
    "Briefing pre-turno con frase real (q9)",
    "Mesero quemado en pasillo: 30 segundos con acción concreta (q21)",
    "Cierre con reconocimiento aterrizado (q32)",
    "Integridad ante presión de descuento y favoritismo (q8, q20)"
  ],
  "risks": [
    "En q4 (días de alta demanda) reconoce que se vuelve cortante pero no aterriza qué hace consigo mismo para evitarlo",
    "En q26 (superior te corrige delante del equipo) la respuesta es funcional con el equipo y con el superior, pero la parte 'qué haces con tu cara y tu voz en el momento' la deja vacía",
    "En q34 (instrucción mala en vivo) admite haberla seguido aun viendo la cara del equipo — no corrigió en el momento, esperó a verificar al cierre"
  ],
  "recommendation": "Avanzar a entrevista y práctico con foco específico en preguntas de autoconciencia bajo estrés. Pedir referencia anterior si manejó turnos de alta demanda recurrente. Si se contrata, plan de desarrollo activo: 1:1 quincenal los primeros 60 días sobre cómo le pegó la semana, qué corrección recibió y cómo se sintió al recibirla, qué decisión en vivo no le gustó y por qué.",
  "competencies": {
    "service_protocol": 88,
    "customer_communication": 84,
    "stress_conflict": 82,
    "sales_suggestions": 78,
    "teamwork_discipline": 82
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 78,
      "evidence": "Cierro pidiéndoles 3 minutos y nombro a uno por cosa concreta — 'tú la mesa del señor del cumpleaños', 'tú aguantaste la barra cuando se cayó'."
    },
    "inteligencia_curiosa": {
      "score": 76,
      "evidence": "Cuando entró la promo de mariscos le pedí al chef que me la explicara antes del briefing para no titubear con la mesa que preguntara."
    },
    "etica_trabajo": {
      "score": 80,
      "evidence": "En el cierre les pido revisar el hielo y el paso pegajoso porque a las 11 no hay tiempo y eso se nota en el primer cliente."
    },
    "empatia": {
      "score": 82,
      "evidence": "Cocina y piso se peleaban por tiempos. Bajé a cocina sin equipo, escuché, regresé y bajé la versión que cocina pudo aceptar."
    },
    "autoconciencia": {
      "score": 70,
      "evidence": "El sábado lleno me vuelvo cortante con el equipo. Lo sé porque me lo dijo un mesero. Trato de respirar pero no siempre."
    },
    "integridad": {
      "score": 88,
      "evidence": "Si el dueño me pide aplicar un descuento que no procede, no lo aplico. Le digo que esa cuenta sale como manda y que él hable después conmigo."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": true
}`

test.group('guidara capitán mocks parseables (Doc prompt_gpt_guidara_capitan_v1 §2)', () => {
  test('Mock 1 FUERTE (Roberto Salinas) parsea y refleja perfil capitán excelente sin cascada', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_1_FUERTE) as any
    assert.equal(parsed.score, 85)
    assert.equal(parsed.pass, true)
    assert.equal(parsed.competenciesGuidara.optimismo_bondadoso.score, 88)
    assert.equal(parsed.competenciesGuidara.integridad.score, 90)
    assert.isNull(parsed.competenciesGuidara.conocimientos_practicos.score)
    // Verificar que el contenido es capitán-céntrico (no mesero ni subgerente disfrazado).
    const optEvidence = parsed.competenciesGuidara.optimismo_bondadoso.evidence as string
    assert.notInclude(optEvidence.toLowerCase(), 'cierre de caja')
    assert.notInclude(optEvidence.toLowerCase(), 'tomar la orden')
  })

  test('Mock 2 MEDIO (Daniela Reyes, cascada A2) parsea y todos los scores caen bajo techo 50', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_2_MEDIO_A2) as any
    assert.equal(parsed.pass, false)
    assert.isAtMost(parsed.score, 50, 'score global debe ser <= 50 por cascada A2')
    for (const k of Object.keys(parsed.competencies)) {
      assert.isAtMost(
        parsed.competencies[k],
        50,
        `competencies.${k} debe ser <= 50 (cascada A2)`
      )
    }
    const guidara = parsed.competenciesGuidara
    for (const k of Object.keys(guidara)) {
      const score = guidara[k].score
      if (score !== null) {
        assert.isAtMost(
          score,
          50,
          `competenciesGuidara.${k}.score debe ser <= 50 (cascada A2)`
        )
      }
    }
  })

  test('Mock 3 DÉBIL (Saúl Domínguez, cascada A1 + regla B) parsea con optimismo=0 y comillas simples', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_3_DEBIL_A1_B) as any
    assert.equal(parsed.summary, 'Respuestas insuficientes')
    assert.equal(parsed.pass, false)
    assert.isAtMost(parsed.score, 40, 'score global <= 40 (cascada A1)')
    // Regla B: optimismo=0 porque sus 7 preguntas asignadas (q3, q9, q15, q21, q27, q32, q38) están vacías.
    assert.equal(parsed.competenciesGuidara.optimismo_bondadoso.score, 0)
    assert.equal(
      parsed.competenciesGuidara.optimismo_bondadoso.evidence,
      'respuesta insuficiente para evaluar'
    )
    // Los demás ejes evaluables <= 40 por cascada A1.
    for (const k of Object.keys(parsed.competenciesGuidara)) {
      const score = parsed.competenciesGuidara[k].score
      if (score !== null && score !== 0) {
        assert.isAtMost(
          score,
          40,
          `competenciesGuidara.${k}.score debe ser <= 40 (cascada A1)`
        )
      }
    }
    // Regla C: evidence con comillas simples internas (opción A de escape).
    const integEvidence = parsed.competenciesGuidara.integridad.evidence as string
    assert.include(integEvidence, "'eso no se hace, párale ya'")
  })

  test('Mock 4 LÍMITE Parte A (Rodrigo Téllez) parsea — pass=true viejo + autoconciencia ámbar dispara doble filtro', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_4_LIMITE) as any
    assert.equal(parsed.score, 84)
    assert.equal(parsed.pass, true, 'pass viejo dice APTO (score 84, sin disparar umbral)')
    // Autoconciencia en banda ámbar de Capitán (60-74). Sin Guidara este candidato entraría sin alertas.
    assert.equal(parsed.competenciesGuidara.autoconciencia.score, 70)
    assert.equal(parsed.competenciesGuidara.integridad.score, 88)
    assert.equal(parsed.competenciesGuidara.optimismo_bondadoso.score, 78)
    assert.isNull(parsed.competenciesGuidara.conocimientos_practicos.score)
    // El evidence de autoconciencia debe documentar zona ámbar (premisa del caso límite).
    const autoEvidence = parsed.competenciesGuidara.autoconciencia.evidence as string
    assert.include(autoEvidence.toLowerCase(), 'cortante')
  })
})
