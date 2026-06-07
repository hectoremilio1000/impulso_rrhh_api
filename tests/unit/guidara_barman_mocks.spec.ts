import { test } from '@japa/runner'

/**
 * Mocks copiados de prompt_gpt_guidara_barman_v1 (Entregable del prompt — Barman).
 * Sección 2 del Doc: 4 perfiles paralelos a los de Capitán
 * (FUERTE / MEDIO cascada A2 / DÉBIL cascada A1 + regla B optimismo /
 * LÍMITE integridad ámbar = caso Andrés).
 *
 * Si el prompt se modifica, validar que estos 4 ejemplos siguen pasando
 * JSON.parse — son el contrato con el modelo. El frontend (componente
 * radar) consume directamente el shape de estos JSON.
 */

const MOCK_1_FUERTE = `{
  "score": 84,
  "summary": "Candidato fuerte para barra con dimensión moral elevada: tres escenarios de dinero+alcohol respondidos con decisión concreta y no con frase reflexiva; motor de barra demostrado con miércoles aterrizado y happy hour prendido; corrección pública procesada sin tronar al cliente a 60 cm.",
  "strengths": [
    "Propinas con $200 a favor sin testigo: decisión concreta de entregar al gerente con razón aterrizada (q5)",
    "Trago del compañero: 'no, gracias, mejor lo tiramos' con razón propia, no de manual (q20)",
    "Miércoles con un solo cliente 2 horas: conversación específica con el cliente, no monólogo (q8)",
    "Cubrir turno de compañero con copas: decisión clara de no abrirle barra y razón al gerente (q25)",
    "Corrección pública del chef: aguantó el mando con el cliente delante y procesó después (q12)"
  ],
  "risks": [
    "Off-menu: improvisa con confianza pero no documenta la receta nueva para el siguiente turno (q21)",
    "Compañero de barra lento: prefiere cargar con su parte antes que tener la conversación incómoda (q7)"
  ],
  "recommendation": "Avanzar a entrevista y práctico. Validar con referencia los dos turnos descritos en q5 y q20 si son verificables. Plan de desarrollo opcional: conversación incómoda con compañero lento — entrenable con un capitán senior.",
  "competencies": {
    "service_protocol": 82,
    "customer_communication": 88,
    "stress_conflict": 85,
    "sales_suggestions": 80,
    "teamwork_discipline": 84
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 86,
      "evidence": "El miércoles solo había un señor mayor; le pregunté qué bebía habitualmente, le hice algo no estandar y se quedó 3 horas."
    },
    "inteligencia_curiosa": {
      "score": 78,
      "evidence": "Cuando salió el negroni blanco en carta pregunté al chef de bar por qué no es bitter Campari; sabía la respuesta antes de vender."
    },
    "etica_trabajo": {
      "score": 84,
      "evidence": "Aunque el lavaloza ya se había ido yo lavé la coctelera; mañana abre a las once y eso pegado no sale con agua tibia."
    },
    "empatia": {
      "score": 82,
      "evidence": "El cliente quería su gin tonic en copa balón aunque la receta es highball; le di la balón y le dije por qué prefería highball, eligió él."
    },
    "autoconciencia": {
      "score": 80,
      "evidence": "El chef me corrigió delante del cliente por la temperatura del shaker; sonreí, le dije gracias y al cliente le serví; después le hablé en privado."
    },
    "integridad": {
      "score": 88,
      "evidence": "Le dije al gerente 'sobraron $200 en propinas, no sé de quién son'; preferí preguntar a quedarme con dinero ajeno aunque nadie hubiera notado."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": true
}`

const MOCK_2_MEDIO_A2 = `{
  "score": 50,
  "summary": "Respuestas aceptables pero genéricas, sin caso concreto. La candidata describe principios y actitudes razonables ('siempre actúo honesto', 'trato de leer al cliente'), pero no aterriza ningún turno específico en las 25 preguntas. Activa cascada A2.",
  "strengths": [
    "Reconoce conceptualmente la dimensión moral del puesto (q1, q5, q20)",
    "Vocabulario adecuado de servicio y empatía con cliente difícil (q2, q11)"
  ],
  "risks": [
    "0 ejemplos verificables en 25 preguntas — la candidata no aterriza un solo turno propio",
    "Imposible distinguir si las afirmaciones reflejan experiencia o solo aspiración",
    "Los 3 escenarios de dinero+alcohol (q5, q10, q20) se responden con principio, no con decisión concreta"
  ],
  "recommendation": "NO avanzar a entrevista aún. Considerar una segunda ronda del psicométrico con instrucción explícita 'cuéntame UN turno específico, con fecha, mesa o cliente concreto'. La candidata puede tener experiencia pero el examen no la captura.",
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
      "evidence": "Siempre trato de levantar la barra cuando está bajoneada, pongo música, sonrío más."
    },
    "inteligencia_curiosa": {
      "score": 50,
      "evidence": "Cuando cambian la carta me esfuerzo por aprender rápido los cócteles nuevos."
    },
    "etica_trabajo": {
      "score": 50,
      "evidence": "Soy muy disciplinada con la limpieza, no me gusta dejar cosas a medias."
    },
    "empatia": {
      "score": 50,
      "evidence": "Trato a los clientes difíciles con paciencia y siempre busco entender qué quieren."
    },
    "autoconciencia": {
      "score": 50,
      "evidence": "Cuando estoy cansada respiro, tomo agua y sigo. No me tomo las cosas personales."
    },
    "integridad": {
      "score": 50,
      "evidence": "Yo siempre actúo con honestidad. Nunca tomaría dinero que no es mío ni alcohol del cliente."
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
    "Más de 20% de las 25 preguntas vacías o con <15 palabras — cascada A1 activada",
    "Las 5 preguntas del eje optimismo_bondadoso (q3, q8, q13, q19, q23) están vacías o son frases sueltas: el motor de la barra es candidato falsificable y el candidato no aporta evidencia ni en abstracto",
    "Las 3 nuevas de integridad (q5, q10, q20) tampoco aterrizadas — se responden con 'haría lo correcto' o se dejan en blanco"
  ],
  "recommendation": "NO avanzar. El examen no captura información suficiente para evaluar. Si hay interés en el candidato por referencia o entrevista, repetir el psicométrico con instrucción asistida y validar que comprende la consigna.",
  "competencies": {
    "service_protocol": 40,
    "customer_communication": 35,
    "stress_conflict": 40,
    "sales_suggestions": 35,
    "teamwork_discipline": 40
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 0,
      "evidence": "respuesta insuficiente para evaluar"
    },
    "inteligencia_curiosa": {
      "score": 40,
      "evidence": "Cuando cambian la receta pregunto al chef."
    },
    "etica_trabajo": {
      "score": 40,
      "evidence": "Limpio bien al cerrar."
    },
    "empatia": {
      "score": 40,
      "evidence": "Si un cliente está difícil le hablo con calma y trato de calmarlo."
    },
    "autoconciencia": {
      "score": 40,
      "evidence": "Cuando me canso me tomo un descanso de 5 minutos en el descanso del turno."
    },
    "integridad": {
      "score": 40,
      "evidence": "Yo nunca tomaría dinero que no es mío."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": false
}`

const MOCK_4_LIMITE_INTEGRIDAD = `{
  "score": 83,
  "summary": "Candidato sólido en ejecución operativa: técnica de coctelería refinada, motor de barra demostrado en miércoles y happy hour, lectura del cliente fina. Pero ambigüedad operativa en los dos escenarios de dinero (q5 y q10) — sin proceso claro ni decisión limpia, deja zonas grises 'por defecto se reparte en propinas del turno'. Doble filtro: pass viejo apto, Guidara detecta riesgo de integridad.",
  "strengths": [
    "Motor de barra: miércoles con un solo cliente 2 horas trabajado con conversación específica, no monólogo (q8)",
    "Happy hour aburrido: cambió el ambiente con cocteles de cortesía aprobados con el gerente (q13)",
    "Lectura del cliente difícil que pidió rehacer 3 veces: lo manejó sin romper el ritmo de la barra (q2)",
    "Corrección pública del capitán: aguantó delante del cliente sin tronar (q12)",
    "Off-menu: improvisó con honestidad, le dijo al cliente qué iba a hacer antes de hacerlo (q21)"
  ],
  "risks": [
    "Propinas con $200 a favor (q5): respuesta ambigua 'los dejo para repartir al cierre', sin describir quién decide cuánto le toca a cada quién — zona gris de discrecionalidad propia",
    "Cliente paga sin esperar el cambio (q10): 'lo guardo por si regresa, si no se queda en propinas' — el cliente NO regresó en el ejemplo y el candidato no especifica con qué criterio cierra ese loop",
    "Combinación de q5 + q10: dos zonas grises de discrecionalidad sobre dinero ajeno en el mismo banco — patrón que merece monitoreo, no descarte inmediato"
  ],
  "recommendation": "Avanzar a entrevista y práctico, pero CONTRATAR CON PLAN si el candidato pasa el resto del proceso. Plan de Integridad: 60 días con mentor explícito sobre proceso de propinas (registro por turno, firma de quien recibe) y política de cambio no reclamado (caja, no propina). 1:1 a 30 y 60 días sobre los dos escenarios específicos de este examen. Descarte temprano: 1 incidente confirmado de discrecionalidad con dinero ajeno.",
  "competencies": {
    "service_protocol": 84,
    "customer_communication": 88,
    "stress_conflict": 82,
    "sales_suggestions": 76,
    "teamwork_discipline": 82
  },
  "competenciesGuidara": {
    "optimismo_bondadoso": {
      "score": 84,
      "evidence": "El miércoles con un solo señor le hice un old fashioned con cardamomo que no estaba en carta; volvió el viernes con dos amigos."
    },
    "inteligencia_curiosa": {
      "score": 76,
      "evidence": "El cliente pidió un trago que no conocía; le pregunté qué le gustaba del clásico, le adapté con tequila y le expliqué el cambio antes."
    },
    "etica_trabajo": {
      "score": 80,
      "evidence": "El cierre lo hago completo; revisé la rotación del refrigerador chico y dejé hielo molido tapado para que mañana arranque rápido."
    },
    "empatia": {
      "score": 82,
      "evidence": "El cliente pidió rehacer el negroni tres veces; al tercero le pregunté qué buscaba específicamente y me dijo 'algo más herbal', cambiamos de gin."
    },
    "autoconciencia": {
      "score": 80,
      "evidence": "El capitán me corrigió delante del cliente; le sonreí, le dije gracias y al cliente le dije 'me corrige y tiene razón'; el cliente sonrió."
    },
    "integridad": {
      "score": 70,
      "evidence": "Los $200 a favor los dejo para repartir al cierre con el equipo, igual nadie reclama propinas chicas, se cierra el corte y se reparte."
    },
    "conocimientos_practicos": {
      "score": null,
      "evidence": "evaluado en el examen práctico"
    }
  },
  "pass": true
}`

test.group('guidara_barman mocks parseables', () => {
  test('Mock 1 FUERTE (Saúl Hernández Romero) parsea — score 84, pass true, sin cascada', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_1_FUERTE) as any
    assert.equal(parsed.score, 84)
    assert.equal(parsed.pass, true)
    assert.equal(parsed.competenciesGuidara.integridad.score, 88)
    assert.equal(parsed.competenciesGuidara.optimismo_bondadoso.score, 86)
    assert.isNull(parsed.competenciesGuidara.conocimientos_practicos.score)
    // Integridad evidence debe documentar entrega de los $200 al gerente (caso barra-específico).
    const integEvidence = parsed.competenciesGuidara.integridad.evidence as string
    assert.include(integEvidence, '$200')
    assert.include(integEvidence, "'sobraron $200 en propinas, no sé de quién son'")
  })

  test('Mock 2 MEDIO (Daniela Ortiz Mendoza) parsea — cascada A2, todos en 50, pass false', ({
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
    // Integridad evidence debe ser autodeclarativa (la señal misma del A2).
    const integEvidence = parsed.competenciesGuidara.integridad.evidence as string
    assert.include(integEvidence, 'siempre')
  })

  test('Mock 3 DÉBIL (Iván Carrillo Vega) parsea — cascada A1 + regla B optimismo en 0', ({
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
    // Regla B sobre optimismo: TODAS sus 5 preguntas vacías/cortas → score 0 + evidence específica.
    assert.equal(parsed.competenciesGuidara.optimismo_bondadoso.score, 0)
    assert.equal(
      parsed.competenciesGuidara.optimismo_bondadoso.evidence,
      'respuesta insuficiente para evaluar'
    )
    // Los demás ejes con respuestas evaluables caen al techo A1 = 40.
    for (const k of ['inteligencia_curiosa', 'etica_trabajo', 'empatia', 'autoconciencia', 'integridad']) {
      assert.isAtMost(
        parsed.competenciesGuidara[k].score,
        40,
        `competenciesGuidara.${k}.score debe ser <= 40`
      )
    }
  })

  test('Mock 4 LÍMITE (Andrés Reyes Cabrera) parsea — pass=true viejo + integridad ámbar dispara doble filtro', ({
    assert,
  }) => {
    const parsed = JSON.parse(MOCK_4_LIMITE_INTEGRIDAD) as any
    assert.equal(parsed.score, 83)
    assert.equal(parsed.pass, true, 'pass viejo dice APTO (score 83, técnica y comunicación cliente compensan)')
    // Integridad en banda ámbar de Barman (70-84 sobre verde ≥85, rojo <70). Sin Guidara este candidato entraría sin alertas.
    assert.equal(parsed.competenciesGuidara.integridad.score, 70)
    assert.equal(parsed.competenciesGuidara.optimismo_bondadoso.score, 84)
    assert.equal(parsed.competenciesGuidara.autoconciencia.score, 80)
    assert.isNull(parsed.competenciesGuidara.conocimientos_practicos.score)
    // El evidence de integridad debe documentar zona gris de discrecionalidad sobre propinas (premisa del caso límite).
    const integEvidence = parsed.competenciesGuidara.integridad.evidence as string
    assert.include(integEvidence, '$200')
    assert.include(integEvidence.toLowerCase(), 'reparte')
  })
})
