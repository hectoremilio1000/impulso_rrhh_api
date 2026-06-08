import { test } from '@japa/runner'

/**
 * Mocks copiados de prompt_gpt_guidara_cocinero_v1 (Entregable del prompt — Cocinero).
 * Sección 2 del Doc: 4 perfiles paralelos a los anteriores con dos novedades del puesto:
 *   - Mock 1 FUERTE — Marcelo Vázquez Galicia. DOBLE FILTRO EN EL OTRO SENTIDO:
 *     pass viejo = false (score 71) por pesos mesero-céntricos no aplicables al
 *     back-of-house, Guidara fuerte → CONTRATAR. Único del cocinero por ahora.
 *   - Mock 2 MEDIO A2 — Lucía Cardona Reyes, cascada A2.
 *   - Mock 3 DÉBIL — Roberto Jiménez Solís, cascada A1 + regla B sobre INTEGRIDAD
 *     (las 5 preguntas q1, q5, q9, q13, q17 vacías/cortas → integridad = 0).
 *   - Mock 4 LÍMITE — Mariana Aldrete Vega, ETICA_TRABAJO en banda ámbar (72)
 *     sobre bandas hipotéticas Cocinero. Primer caso del cronograma donde el
 *     plan se dispara por el SEGUNDO CRÍTICO estructural del puesto
 *     (etica_trabajo), no por integridad — prefigura CONTRATAR_CON_PLAN con
 *     planType=`etica_trabajo`.
 *
 * Si el prompt se modifica, validar que estos 4 ejemplos siguen pasando
 * JSON.parse — son el contrato con el modelo. El frontend (componente
 * radar) consume directamente el shape de estos JSON.
 */

const MOCK_1_FUERTE = `{
  "score": 71,
  "summary": "Candidato fuerte para cocina con disciplina de proceso e integridad invisible aterrizadas: para ante producto en el límite, denuncia higiene del compañero directamente, recorta en pasos visibles antes que saltar los invisibles, avisa al pase cuando su propio platillo sale mal. Pass viejo = false por pesos mesero-céntricos (service_protocol, customer_communication, sales_suggestions no aplican al back-of-house). Decisión real por Guidara: 6 ejes en banda fuerte, 0 en rojo.",
  "strengths": [
    "Producto en el límite (q5): paró la operación, preguntó al chef, decidieron cambiar el platillo y el mesero avisó al cliente",
    "Higiene del compañero (q1): conversación directa con él en pleno turno, no chisme con un tercero",
    "12 comandas + 2 pasos saltables (q20): recortó tiempo en plating en vez de saltar los pasos invisibles de la salsa",
    "Platillo TUYO mal (q13): avisó al pase aunque el mesero ya lo había llevado, repusieron del costo de la cocina",
    "Corrección técnica del chef (q4): aguantó delante del pase, integró el corte en los siguientes 3 platos"
  ],
  "risks": [
    "PEPS (q11): admite que dos veces agarró el producto de arriba 'porque iba apurado' antes de corregirse — patrón que vale monitorear en práctico",
    "Ayudante perdido (q2): lo ayudó pero no le explicó la mecánica para que la próxima resolviera solo"
  ],
  "recommendation": "Avanzar a entrevista y práctico A PESAR de pass viejo = false. Los pesos viejos no aplican al cocinero; la decisión real es Guidara y aquí es CONTRATAR. Validar con referencia los turnos descritos en q1 y q13 si son verificables. Plan de desarrollo opcional: enseñar al ayudante en lugar de cargar — entrenable con un mentor en línea por 30 días.",
  "competencies": {
    "service_protocol": 75,
    "customer_communication": 60,
    "stress_conflict": 86,
    "sales_suggestions": 55,
    "teamwork_discipline": 84
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 76,
      "evidence": "El ayudante sacó su primera salsa holandesa sola; me detuve, le dije 'eso ya es plato de carta' y le hice pulgar arriba con el pase mirando."
    },
    "inteligencia_curiosa": {
      "score": 78,
      "evidence": "Se acabó el fondo de res; pregunté al chef si podía sustituir con demi reducido y se lo dije al mesero antes de mandar el plato."
    },
    "etica_trabajo": {
      "score": 84,
      "evidence": "Llegué 10 minutos tarde; corté el picado fino para después, monté las proteínas primero y avisé al pase qué iba a faltar los primeros 20 minutos."
    },
    "empatia": {
      "score": 80,
      "evidence": "El pase llegó gritando 'la 12 lleva 40 minutos'; lo vi nervioso, no enojado, le pregunté qué llevaba y prioricé esa comanda primero."
    },
    "autoconciencia": {
      "score": 80,
      "evidence": "El chef me corrigió el corte delante del pase; le dije gracias, bajé velocidad en los siguientes 3 platos para integrarlo bien."
    },
    "integridad": {
      "score": 86,
      "evidence": "El pescado tenía color al borde; con 3 comandas colgadas paré, le pregunté al chef, decidimos cambiar el platillo y el mesero avisó."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": false
}`

const MOCK_2_MEDIO_A2 = `{
  "score": 50,
  "summary": "Respuestas aceptables pero genéricas, sin caso concreto. La candidata describe principios y actitudes razonables ('siempre actúo correctamente', 'trato de mantener mise en place ordenado') pero no aterriza ningún turno específico en las 20 preguntas. Activa cascada A2.",
  "strengths": [
    "Reconoce conceptualmente la dimensión moral del puesto (q1, q5, q13)",
    "Vocabulario adecuado de disciplina y proceso (q3, q7, q11)"
  ],
  "risks": [
    "0 ejemplos verificables en 20 preguntas — la candidata no aterriza un solo turno propio",
    "Imposible distinguir si las afirmaciones reflejan experiencia o solo aspiración",
    "Las 3 nuevas de integridad (q5, q9, q17) se responden con principio, no con decisión concreta",
    "Las 4 nuevas de ética (q7, q11, q15, q20) tampoco aterrizadas — 'soy muy disciplinada' es el patrón en las 4"
  ],
  "recommendation": "NO avanzar a entrevista aún. Considerar una segunda ronda del psicométrico con instrucción explícita 'cuéntame UN turno específico, con fecha o platillo concreto'. La candidata puede tener experiencia pero el examen no la captura.",
  "competencies": {
    "service_protocol": 50,
    "customer_communication": 50,
    "stress_conflict": 50,
    "sales_suggestions": 48,
    "teamwork_discipline": 50
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 50,
      "evidence": "Siempre trato de mantener buen ambiente en cocina, le hablo bonito al ayudante."
    },
    "inteligencia_curiosa": {
      "score": 50,
      "evidence": "Cuando cambian la carta me esfuerzo por aprender rápido las recetas nuevas."
    },
    "etica_trabajo": {
      "score": 50,
      "evidence": "Soy muy disciplinada con mi mise en place, no me gusta dejar cosas a medias."
    },
    "empatia": {
      "score": 50,
      "evidence": "Trato a mis compañeros con paciencia y siempre busco entender qué necesitan."
    },
    "autoconciencia": {
      "score": 50,
      "evidence": "Cuando estoy cansada respiro, tomo agua y sigo. No me tomo las cosas personales."
    },
    "integridad": {
      "score": 50,
      "evidence": "Yo siempre actúo con honestidad. Nunca usaría producto echado a perder ni saltaría pasos de higiene."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": false
}`

const MOCK_3_DEBIL_A1 = `{
  "score": 40,
  "summary": "Respuestas insuficientes",
  "strengths": [],
  "risks": [
    "Más de 20% de las 20 preguntas vacías o con <15 palabras — cascada A1 activada",
    "Las 5 preguntas del eje integridad (q1, q5, q9, q13, q17) están vacías o son frases sueltas: el eje de mayor exposición invisible del puesto sin un solo caso aterrizado",
    "Las 4 nuevas de ética (q7, q11, q15, q20) tampoco aterrizadas — 'soy disciplinado' o se dejan en blanco",
    "Los 2 escenarios canónicos del puesto (q9 contaminación cruzada con 40 segundos, q20 12 comandas con 2 pasos invisibles) sin respuesta verificable"
  ],
  "recommendation": "NO avanzar. El examen no captura información suficiente para evaluar. El silencio del candidato en los 5 escenarios de integridad cocina-específicos es señal en sí mismo: el eje de mayor exposición invisible del puesto requiere caso concreto, no afirmación abstracta. Si hay interés en el candidato por referencia o entrevista, repetir el psicométrico con instrucción asistida.",
  "competencies": {
    "service_protocol": 40,
    "customer_communication": 35,
    "stress_conflict": 40,
    "sales_suggestions": 30,
    "teamwork_discipline": 40
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 40,
      "evidence": "Cuando alguien está cansado le echo porras."
    },
    "inteligencia_curiosa": {
      "score": 40,
      "evidence": "Si no sé algo pregunto al chef."
    },
    "etica_trabajo": {
      "score": 40,
      "evidence": "Soy disciplinado y limpio."
    },
    "empatia": {
      "score": 40,
      "evidence": "Si un compañero está mal le hablo bonito."
    },
    "autoconciencia": {
      "score": 40,
      "evidence": "Si me canso descanso un minuto."
    },
    "integridad": {
      "score": 0,
      "evidence": "respuesta insuficiente para evaluar"
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": false
}`

const MOCK_4_LIMITE_ETICA = `{
  "score": 82,
  "summary": "Candidata sólida en ejecución operativa: integridad limpia (denuncia higiene, paró ante producto en el límite, avisó al pase de su platillo mal), buena lectura del equipo, recibe corrección técnica del chef sin tronar. PERO ambigüedad operativa en los dos escenarios de disciplina invisible (q7 y q20): recortó lavado de verduras 'porque nadie iba a notar' al llegar tarde, y admite saltar pasos 'si era una salsa que igual nadie iba a notar'. Doble filtro: pass viejo APTO, Guidara detecta riesgo de etica_trabajo (segundo crítico estructural del puesto).",
  "strengths": [
    "Producto en el límite (q5): paró la operación, pidió segunda opinión al sous chef, decidieron tirarlo y el mesero avisó al cliente",
    "Higiene del compañero (q1): conversación directa al cambiar de proteína, le explicó el por qué del cambio de tabla en pleno turno",
    "Platillo TUYO mal (q13): avisó al pase aunque el mesero ya estaba en la mesa, repusieron del costo",
    "Corrección técnica del chef (q4): aguantó delante del pase, le preguntó al chef después del turno para entender el razonamiento",
    "Pase gritando urgencia (q10): distinguió pánico personal del cocinero senior y priorizó la comanda real del cliente"
  ],
  "risks": [
    "Mise en place atrasado (q7): recortó el lavado de verduras 'porque nadie iba a notar' al llegar 10 min tarde — zona gris de disciplina invisible cuando hay presión de tiempo",
    "12 comandas + 2 pasos saltables (q20): admite saltar pasos 'solo si era una salsa que igual nadie iba a notar' — patrón consistente con q7, no incidente aislado",
    "Combinación q7 + q20: dos zonas grises del segundo crítico estructural del puesto en el mismo banco — patrón que merece monitoreo cercano del chef en los primeros 60 días, no descarte inmediato"
  ],
  "recommendation": "Avanzar a entrevista y práctico. CONTRATAR CON PLAN si pasa el resto. Plan de Etica de trabajo: 60 días con chef o sous chef como mentor explícito sobre los 2 procesos invisibles que la candidata admitió recortar (lavado de verduras, pasos de salsa). Auditoría sorpresa de mise en place dos veces por semana en las primeras 4 semanas. 1:1 a 30 y 60 días sobre los dos escenarios específicos de este examen. Descarte temprano: 1 incidente confirmado de salto de proceso en cocina.",
  "competencies": {
    "service_protocol": 82,
    "customer_communication": 80,
    "stress_conflict": 88,
    "sales_suggestions": 76,
    "teamwork_discipline": 88
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 78,
      "evidence": "El ayudante sacó su primera vinagreta sola; le dije 'esa la guardo para enseñarle al siguiente' y le tomé foto para mostrarle al chef."
    },
    "inteligencia_curiosa": {
      "score": 76,
      "evidence": "Se acabó el cilantro; con el chef ausente sustituí con perejil y comuniqué al pase para que el mesero avisara antes de servir."
    },
    "etica_trabajo": {
      "score": 72,
      "evidence": "Llegué 10 minutos tarde; le quité 5 minutos al lavado de verduras porque nadie iba a notar que no estaban perfectas y priorice las proteínas."
    },
    "empatia": {
      "score": 82,
      "evidence": "El pase venía gritando 'urge la 12'; lo vi nervioso del cocinero senior, le pregunté qué llevaba y prioricé sin pelearme con él."
    },
    "autoconciencia": {
      "score": 80,
      "evidence": "El chef me corrigió la cocción del salmón delante del pase; bajé velocidad en los siguientes 3 platos y le pregunté después por el porqué."
    },
    "integridad": {
      "score": 84,
      "evidence": "El cabrito tenía color al borde; con 3 comandas colgadas paré, llamé al sous chef, decidimos tirar el lote y el mesero avisó."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": true
}`

test.group('guidara_cocinero mocks parseables', () => {
  test('Mock 1 FUERTE (Marcelo Vázquez Galicia) parsea — Guidara fuerte con pass viejo false (doble filtro en el otro sentido)', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_1_FUERTE) as any
    assert.equal(parsed.score, 71)
    assert.equal(
      parsed.pass,
      false,
      'pass viejo dice NO APTO (score 71 por pesos mesero-céntricos no aplicables al back-of-house). Único del cocinero por ahora.'
    )
    // 6 ejes Guidara en banda fuerte (>=75), 0 en rojo. La decisión real es CONTRATAR.
    assert.equal(parsed.competenciesGuidara.integridad.score, 86)
    assert.equal(parsed.competenciesGuidara.etica_trabajo.score, 84)
    assert.equal(parsed.competenciesGuidara.autoconciencia.score, 80)
    assert.equal(parsed.competenciesGuidara.empatia.score, 80)
    assert.equal(parsed.competenciesGuidara.optimismo_bondadoso.score, 76)
    assert.equal(parsed.competenciesGuidara.inteligencia_curiosa.score, 78)
    assert.isNull(parsed.competenciesGuidara.conocimientos_practicos.score)
    // Integridad evidence debe documentar el caso q5 producto en el límite (escenario canónico del puesto).
    const integEvidence = parsed.competenciesGuidara.integridad.evidence as string
    assert.include(integEvidence, 'color al borde')
    assert.include(integEvidence, '3 comandas colgadas')
  })

  test('Mock 2 MEDIO (Lucía Cardona Reyes) parsea — cascada A2, todos en 50, pass false', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_2_MEDIO_A2) as any
    assert.equal(parsed.score, 50)
    assert.equal(parsed.pass, false)
    // A2 → todos los ejes evaluables en techo 50.
    for (const k of Object.keys(parsed.competencies)) {
      assert.isAtMost(parsed.competencies[k], 50, `competencies.${k} debe ser <= 50`)
    }
    const guidara = parsed.competenciesGuidara
    for (const k of Object.keys(guidara)) {
      const score = guidara[k].score
      if (score !== null) {
        assert.isAtMost(score, 50, `competenciesGuidara.${k}.score debe ser <= 50 o null`)
      }
    }
    // Etica evidence debe ser autodeclarativa (la señal misma del A2 sobre el segundo crítico del puesto).
    const eticaEvidence = parsed.competenciesGuidara.etica_trabajo.evidence as string
    assert.include(eticaEvidence, 'disciplinada')
  })

  test('Mock 3 DÉBIL (Roberto Jiménez Solís) parsea — cascada A1 + regla B integridad en 0', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_3_DEBIL_A1) as any
    assert.equal(parsed.score, 40)
    assert.equal(parsed.summary, 'Respuestas insuficientes')
    assert.equal(parsed.pass, false)
    // A1 → techo 40 sobre los 5 viejos.
    for (const k of Object.keys(parsed.competencies)) {
      assert.isAtMost(parsed.competencies[k], 40, `competencies.${k} debe ser <= 40`)
    }
    // Regla B sobre integridad: TODAS sus 5 preguntas (q1, q5, q9, q13, q17) vacías/cortas → score 0 + evidence específica.
    // Caso canónico del puesto: el candidato falsifica el eje de mayor exposición invisible.
    assert.equal(parsed.competenciesGuidara.integridad.score, 0)
    assert.equal(
      parsed.competenciesGuidara.integridad.evidence,
      'respuesta insuficiente para evaluar'
    )
    // Los demás ejes con respuestas evaluables caen al techo A1 = 40.
    for (const k of ['optimismo_bondadoso', 'inteligencia_curiosa', 'etica_trabajo', 'empatia', 'autoconciencia']) {
      assert.isAtMost(
        parsed.competenciesGuidara[k].score,
        40,
        `competenciesGuidara.${k}.score debe ser <= 40`
      )
    }
  })

  test('Mock 4 LÍMITE (Mariana Aldrete Vega) parsea — pass=true viejo + etica_trabajo ámbar dispara doble filtro (segundo crítico)', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_4_LIMITE_ETICA) as any
    assert.equal(parsed.score, 82)
    assert.equal(
      parsed.pass,
      true,
      'pass viejo dice APTO (score 82, técnica y coordinación con pase compensan los pesos mesero-céntricos)'
    )
    // Etica_trabajo en banda ámbar hipotética Cocinero (72 sobre verde >= 80, rojo < 65).
    // Primer caso del cronograma donde el plan se dispara por el SEGUNDO CRÍTICO estructural
    // del puesto (etica_trabajo), no por integridad ni autoconciencia.
    assert.equal(parsed.competenciesGuidara.etica_trabajo.score, 72)
    assert.equal(parsed.competenciesGuidara.integridad.score, 84)
    assert.equal(parsed.competenciesGuidara.empatia.score, 82)
    assert.equal(parsed.competenciesGuidara.autoconciencia.score, 80)
    assert.isNull(parsed.competenciesGuidara.conocimientos_practicos.score)
    // El evidence de etica_trabajo debe documentar zona gris de disciplina invisible (premisa del caso límite).
    const eticaEvidence = parsed.competenciesGuidara.etica_trabajo.evidence as string
    assert.include(eticaEvidence, 'lavado de verduras')
    assert.include(eticaEvidence, 'nadie iba a notar')
  })
})
