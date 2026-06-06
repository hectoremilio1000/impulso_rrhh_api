import { test } from '@japa/runner'

/**
 * Mocks copiados de prompt_gpt_guidara_mesero_v1_1 (Entregable 2 v1.1 — Mesero).
 * Sección 2 del Doc: los 3 perfiles base (FUERTE / MEDIO / DÉBIL) + el
 * Mock 4 Parte A (caso LÍMITE para DOBLE FILTRO).
 *
 * Si el prompt se modifica, validar que estos 4 ejemplos siguen pasando
 * JSON.parse — son el contrato con el modelo. El frontend (componente
 * radar) consume directamente el shape de estos JSON.
 */

const MOCK_1_FUERTE = `{
  "score": 85,
  "summary": "Candidato fuerte para piso: lee al comensal con señal concreta, integridad consistente con cuenta y propinas, sostiene ambiente del equipo en cierre sin necesidad de autoridad, vende sugiriendo sin presionar.",
  "strengths": [
    "Lectura del comensal con señal específica y ajuste concreto (q34)",
    "Integridad activa con cuenta y propinas (q15, q16, q30)",
    "Gesto pequeño no obligado que el cliente recordó al salir (q37)",
    "Forma de sostener al equipo en cierre desde rol lateral, sin imponerse (q36)"
  ],
  "risks": [
    "Adaptación a cambios de menú apoyada en repetición; poca curiosidad por el porqué del platillo (q28)",
    "Recibe feedback bien pero todavía aguanta callado en el momento en lugar de aclarar (q11, q20)"
  ],
  "recommendation": "Avanzar a entrevista y práctico. Validar con referencia el ejemplo de la mesa de la pareja del miércoles si es verificable. Plan de desarrollo opcional en curiosidad técnica: que pregunte al chef cómo se hace, no solo qué lleva.",
  "competencies": {
    "service_protocol": 88,
    "customer_communication": 87,
    "stress_conflict": 80,
    "sales_suggestions": 85,
    "teamwork_discipline": 85
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 88,
      "evidence": "Una señora venía cargada con dos bolsas y cara de prisa. Le acerqué la mesa de la esquina sin que pidiera y le serví agua sin hielo de una."
    },
    "inteligencia_curiosa": {
      "score": 75,
      "evidence": "Antes de servir un platillo nuevo le pregunto al chef cómo se monta y qué decirle al cliente si pregunta de dónde es el ingrediente."
    },
    "etica_trabajo": {
      "score": 84,
      "evidence": "Aunque la estación esté lista paso paño otra vez antes del primer servicio, porque en hora pico ya no voy a tener ese minuto."
    },
    "empatia": {
      "score": 86,
      "evidence": "El compañero llegó callado, le pregunté si quería que yo tomara su primera mesa mientras se acomodaba, sin hacerlo grande."
    },
    "autoconciencia": {
      "score": 80,
      "evidence": "El capitán me corrigió enfrente del nuevo. En el momento aguanté. Después le busqué y le pregunté qué hice mal porque no quería repetirlo."
    },
    "integridad": {
      "score": 90,
      "evidence": "Me marqué un error de captura yo solo y avisé al capitán antes de cobrar. Prefiero que me llamen la atención a que el cliente se sienta engañado."
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
    "Postura ética declarada consistente con propinas y cuentas (q15, q30)",
    "Reconoce que al comensal hay que leerlo, aunque no aterriza un caso (q34)"
  ],
  "risks": [
    "Mayoría de respuestas en abstracto, sin situación + acción + resultado",
    "Sin evidencia de qué hizo en cierre real con equipo agotado (q36)",
    "Recomendar producto caro contestado en piloto automático, sin ejemplo de un cliente al que sí le funcionó (q14)",
    "Las cuatro preguntas que piden caso concreto (q34-q37) tienen respuesta pero ninguna nombra un comensal, una mesa o una noche identificable"
  ],
  "recommendation": "No avanzar con este perfil tal cual. Si la sucursal tiene mucha demanda, repetir examen con instrucción explícita: 'cuenta UN caso real, con qué pasó, qué hiciste y cómo terminó'. El contenido conceptual está; falta evidencia de ejecución.",
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
      "evidence": "Siempre trato de tener buena actitud y darle al cliente lo mejor de mí en cada turno."
    },
    "inteligencia_curiosa": {
      "score": 48,
      "evidence": "Me adapto a los cambios de menú y pregunto al chef o al capitán lo que no sé del platillo."
    },
    "etica_trabajo": {
      "score": 50,
      "evidence": "Me organizo por prioridades y hago lo que toca aunque la tarea sea repetitiva, no me salto pasos."
    },
    "empatia": {
      "score": 50,
      "evidence": "Trato a cada cliente con respeto y leo cómo viene para saber qué tipo de atención necesita esa mesa."
    },
    "autoconciencia": {
      "score": 45,
      "evidence": "Cuando me corrigen escucho y trato de mejorar para la próxima vez, no me lo tomo personal."
    },
    "integridad": {
      "score": 50,
      "evidence": "Si veo que alguien no reparte bien las propinas hablo con él primero antes de ir con el jefe."
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
    "Postura básica de honestidad declarada (q15)"
  ],
  "risks": [
    "Más del 20% de respuestas vacías o con menos de 15 palabras",
    "Bloque completo de optimismo (q9, q23, q24, q26, q34-q37) sin contenido evaluable — incluye las 4 preguntas nuevas que piden caso concreto de servicio memorable",
    "Sin evidencia de capacidad para leer al comensal (q34), proteger el primer contacto cuando viene mal día (q35), levantar al equipo en cierre (q36) o crear momento memorable (q37)",
    "Respuestas que sí están contestadas son procedimentales y reactivas"
  ],
  "recommendation": "No avanzar. El bloque optimismo es el que separa al mesero memorable del mesero correcto; sin contenido ahí, el perfil no califica para piso de un restaurante que vende experiencia. Las 4 preguntas nuevas (q34-q37) son el filtro real y este candidato no lo cruza.",
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
      "evidence": "Pregunto al chef qué lleva el platillo cuando es nuevo."
    },
    "etica_trabajo": {
      "score": 35,
      "evidence": "Hago lo que me toca y no me brinco pasos del protocolo."
    },
    "empatia": {
      "score": 38,
      "evidence": "Al cliente difícil le hablo bonito y trato de calmarlo antes de llamar al capitán."
    },
    "autoconciencia": {
      "score": 32,
      "evidence": "Cuando me corrigen me callo y aguanto, después se me pasa."
    },
    "integridad": {
      "score": 40,
      "evidence": "Si veo a un compañero quedándose con propina ajena le digo: 'eso no se hace, repártelo', y si sigue le aviso al capitán."
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
  "summary": "Candidato apto en sistema legacy con alta consistencia en servicio y comunicación; señales puntuales de prevención en integridad bajo el rigor mesero (cuenta, propinas, dinero directo).",
  "strengths": [
    "Lectura del comensal con caso concreto verificable (q34)",
    "Ventas sugestivas con propuesta clara, sin presión (q14)",
    "Sostiene el ambiente en cierre desde rol lateral, sin imponerse (q36)"
  ],
  "risks": [
    "En q15 (error con cuenta) confiesa haber 'arreglado' un cargo de menos sin reportarlo porque la mesa ya se iba — zona gris bajo presión de tiempo",
    "En q30 (propinas) cuenta un conflicto pasado donde dejó pasar el desbalance — no aterriza qué hizo, ni si volvería a actuar igual",
    "En q33 (atajo) admite haberse saltado el protocolo de cobro una vez para cerrar más rápido — sin reflexión sobre la consecuencia"
  ],
  "recommendation": "Avanzar a entrevista y práctico con foco específico en preguntas de integridad sobre dinero. Pedir referencia anterior si manejó turnos a solas con caja. Si se contrata, plan de desarrollo activo: revisión semanal de notas y cancelaciones de sus mesas en los primeros 60 días.",
  "competencies": {
    "service_protocol": 88,
    "customer_communication": 85,
    "stress_conflict": 80,
    "sales_suggestions": 82,
    "teamwork_discipline": 80
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 80,
      "evidence": "Una pareja entró discutiendo. Les llevé el pan caliente recién sacado y les dije 'esto está mejor con la primera cerveza fría', salieron riendo."
    },
    "inteligencia_curiosa": {
      "score": 78,
      "evidence": "Cuando entró el menú de cuaresma le pedí al chef que me explicara el cambio antes del briefing porque no quería titubear con el cliente."
    },
    "etica_trabajo": {
      "score": 80,
      "evidence": "El paño se cambia cada 30 minutos aunque parezca limpio, porque al cliente le llega olor a viejo y no lo dice."
    },
    "empatia": {
      "score": 82,
      "evidence": "La compañera nueva temblaba antes de su primera mesa de 6. Le dije 'yo te abro la mesa, tú trae lo que pidan', y la mesa salió bien."
    },
    "autoconciencia": {
      "score": 75,
      "evidence": "Cuando me satura el piso me noto cortante con el cliente. Lo identifiqué porque una mesa me lo dijo y desde entonces respiro antes de entrar."
    },
    "integridad": {
      "score": 70,
      "evidence": "Una vez modifiqué la nota sin avisar al capitán porque la mesa ya se iba y no quería detenerlos. Después pensé que mal."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": true
}`

test.group('guidara mesero mocks parseables (Doc prompt_gpt_guidara_mesero_v1_1 §2)', () => {
  test('Mock 1 FUERTE (Luis Hernández) parsea y refleja perfil mesero excelente sin cascada', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_1_FUERTE) as any
    assert.equal(parsed.score, 85)
    assert.equal(parsed.pass, true)
    assert.equal(parsed.competenciesGuidara.optimismo_bondadoso.score, 88)
    assert.equal(parsed.competenciesGuidara.integridad.score, 90)
    assert.isNull(parsed.competenciesGuidara.conocimientos_practicos.score)
    // Verificar que el contenido es mesero-céntrico (no subgerente disfrazado).
    const optEvidence = parsed.competenciesGuidara.optimismo_bondadoso.evidence as string
    assert.notInclude(optEvidence.toLowerCase(), 'cierre de caja')
    assert.notInclude(optEvidence.toLowerCase(), 'supervisar')
  })

  test('Mock 2 MEDIO (Carla Méndez, cascada A2) parsea y todos los scores caen bajo techo 50', ({
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

  test('Mock 3 DÉBIL (Brayan García, cascada A1 + regla B) parsea con optimismo=0 y comillas simples', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_3_DEBIL_A1_B) as any
    assert.equal(parsed.summary, 'Respuestas insuficientes')
    assert.equal(parsed.pass, false)
    assert.isAtMost(parsed.score, 40, 'score global <= 40 (cascada A1)')
    // Regla B: optimismo=0 porque sus 8 preguntas asignadas (q9, q23, q24, q26, q34-q37) están vacías.
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
    assert.include(integEvidence, "'eso no se hace, repártelo'")
  })

  test('Mock 4 LÍMITE (Andrea Vázquez) parsea — pass=true viejo + integridad ámbar dispara doble filtro', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_4_LIMITE) as any
    assert.equal(parsed.score, 84)
    assert.equal(parsed.pass, true, 'pass viejo dice APTO (score 84, sin disparar umbral)')
    // Integridad en banda ámbar de Mesero (70-84). Sin Guidara este candidato entraría sin alertas.
    assert.equal(parsed.competenciesGuidara.integridad.score, 70)
    assert.equal(parsed.competenciesGuidara.optimismo_bondadoso.score, 80)
    assert.equal(parsed.competenciesGuidara.autoconciencia.score, 75)
    assert.isNull(parsed.competenciesGuidara.conocimientos_practicos.score)
    // El evidence de integridad debe documentar zona gris (premisa del caso límite).
    const integEvidence = parsed.competenciesGuidara.integridad.evidence as string
    assert.include(integEvidence.toLowerCase(), 'modifiqué')
  })
})
