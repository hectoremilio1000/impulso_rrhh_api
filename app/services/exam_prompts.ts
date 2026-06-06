// app/services/exam_prompts.ts
//
// Constructores de prompts para evaluar exámenes psicométricos con GPT.
// Hay dos cuerpos de prompt convivendo:
//
//   buildPromptLegacy(role, answers)
//     - 5 ejes viejos (service_protocol, customer_communication,
//       stress_conflict, sales_suggestions, teamwork_discipline).
//     - Cubre Mesero, Capitán, Cocinero, Barman, Chef gerente.
//     - Mismo prompt que vivió inline en public_controller.ts hasta hoy.
//
//   buildPromptGuidaraSubgerente(answers)
//     - 7 ejes Guidara (optimismo_bondadoso, inteligencia_curiosa,
//       etica_trabajo, empatia, autoconciencia, integridad,
//       conocimientos_practicos).
//     - Solo Subgerente (Opción 3).
//     - Devuelve AMBOS bloques (competencies + competenciesGuidara) para
//       backwards-compat con frontend existente y radar futuro.
//
// El selector buildPsychPrompt decide por nombre del rol. Para migrar
// otro puesto a Guidara, agregar su variante y extender el selector —
// SIN tocar psychSubmit.

// El JSON.stringify de answers no debe escaparse en el template — GPT
// lee el objeto serializado tal cual y lo usa como contexto.

export function buildPromptLegacy(role: string, answers: unknown): string {
  return `
Evalúa un EXAMEN PSICOMÉTRICO para ${role} con criterio de RH senior.
Devuelve SOLO JSON válido con esta forma EXACTA:
{
  "score": number,                 // 0 a 100
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
  },
  "pass": boolean
}

PESOS (total 100):
- service_protocol: 30
- customer_communication: 25
- stress_conflict: 20
- sales_suggestions: 15
- teamwork_discipline: 10

UMBRAL APTO (pass=true):
- score global >= 82
- service_protocol >= 70
- customer_communication >= 70
- ninguna competencia < 55

Reglas obligatorias (prioridad alta):
- Si MÁS de 20% de respuestas están vacías o con menos de 15 palabras, score <= 40 y summary "Respuestas insuficientes".
- Si MENOS de 50% de respuestas contienen un ejemplo específico (situación + acción + resultado), score <= 50.
- Si >30% de respuestas son repetidas o casi idénticas, score <= 50 y summary "Respuestas repetitivas".
- No inventes información no presente en las respuestas.
- Sin markdown, sin \`\`\`.

Guía de evaluación:
- 90-100: respuestas profundas, consistentes, con ejemplos reales.
- 75-89: buenas respuestas, algunos vacíos.
- 55-74: aceptables pero genéricas.
- <55: insuficientes.

ANSWERS:
${JSON.stringify(answers)}
`.trim()
}

export function buildPromptGuidaraSubgerente(answers: unknown): string {
  return `
Evalúa un EXAMEN PSICOMÉTRICO para Subgerente con criterio de RH senior.

CONTEXTO DEL PUESTO
El Subgerente es mando medio operativo en restaurante. Supervisa el piso durante el turno, maneja meseros/capitanes/barmans, resuelve conflictos en vivo, vigila métricas de turno (ventas, propinas, tiempos), maneja apertura y cierre, caja básica y escalamiento al gerente. Es más operativo que un chef gerente y menos técnico que un cocinero o barman.

FORMATO DE RESPUESTA
Devuelves SOLO JSON válido. Sin markdown, sin \`\`\` wrappers, sin texto adicional fuera del JSON. La forma EXACTA es:

{
  "score": number,
  "summary": string,
  "strengths": string[],
  "risks": string[],
  "recommendation": string,
  "competencies": {
    "service_protocol": number,
    "customer_communication": number,
    "stress_conflict": number,
    "sales_suggestions": number,
    "teamwork_discipline": number
  },
  "competenciesGuidara": {
    "optimismo_bondadoso":      { "score": number, "evidence": string },
    "inteligencia_curiosa":     { "score": number, "evidence": string },
    "etica_trabajo":            { "score": number, "evidence": string },
    "empatia":                  { "score": number, "evidence": string },
    "autoconciencia":           { "score": number, "evidence": string },
    "integridad":               { "score": number, "evidence": string },
    "conocimientos_practicos":  { "score": null, "evidence": "evaluado en el examen práctico" }
  },
  "pass": boolean
}

CÁLCULO DEL BLOQUE "competencies" (5 ejes viejos — intactos)
Mismo cálculo de siempre. Cada eje 0-100.

PESOS (suma 100):
- service_protocol: 30
- customer_communication: 25
- stress_conflict: 20
- sales_suggestions: 15
- teamwork_discipline: 10

El campo "score" raíz se calcula como el promedio ponderado de los 5 ejes anteriores. NO uses competenciesGuidara para calcular "score".

UMBRAL APTO (pass=true):
- score global >= 82
- service_protocol >= 70
- customer_communication >= 70
- ninguna competencia < 55

CÁLCULO DEL BLOQUE "competenciesGuidara" (7 ejes nuevos)
Cada eje humano tiene un set fijo de preguntas asignadas (ver TAGGING). Para cada eje:
1. Identifica las preguntas asignadas al eje (lista abajo).
2. Lee las respuestas correspondientes del candidato.
3. Califica de 0 a 100 según cómo esas respuestas reflejan la dimensión del eje (ver DEFINICIONES OPERATIVAS).
4. Escoge UNA respuesta del candidato que más sustente el score y ponla en "evidence" como cita literal — máximo 25 palabras, si es más larga recorta con [...] al final. Aplica las reglas de escape de caracteres (ver REGLAS OBLIGATORIAS).

Para "conocimientos_practicos":
  score = null
  evidence = "evaluado en el examen práctico"
(Este eje pertenece al examen práctico, no al psicométrico.)

DEFINICIONES OPERATIVAS DE LOS 7 EJES

optimismo_bondadoso
  Amabilidad genuina + creencia de que tus acciones pueden mejorar el día de los demás. Motivar al equipo. Framing positivo bajo presión. Reconocimiento. Ver oportunidad de mejorar la experiencia (cliente o equipo) donde otros no la verían.

inteligencia_curiosa
  Ganas insaciables de aprender y mejorar. Preguntar antes de asumir. Pensamiento crítico aplicado a operación. Razonar bajo información incompleta. Priorizar lógicamente.

etica_trabajo
  Disciplina, consistencia, atención al detalle. Hacer las cosas con cuidado y excelencia incluso cuando nadie te ve hacerlo. Aguante bajo presión sostenida. Protocolo y rigor.

empatia
  Preocupación por el impacto de tus acciones en otros. Ponerse en el lugar del otro. Sensibilidad al estado emocional ajeno (equipo, cliente, jefe). Adaptar tu acercamiento a lo que el otro necesita.

autoconciencia
  Entender cómo tu estado emocional afecta al equipo. Conocer fortalezas y debilidades propias. Recibir feedback sin defensividad. Saber cuándo TÚ eres parte del problema.

integridad
  Hacer lo correcto sin supervisión. Honestidad. Coherencia entre lo que dices y lo que haces. No taparte de errores propios o ajenos. No ceder ante presión o tentación cuando nadie está mirando.

conocimientos_practicos
  Saber técnico específico del puesto. Procedimientos, protocolos, ejecución. No se evalúa aquí — pertenece al examen práctico.

TAGGING — qué eje mide cada pregunta del banco Subgerente
Las preguntas vienen numeradas q1..q45 en el bloque ANSWERS al final.

q1  → autoconciencia
q2  → inteligencia_curiosa
q3  → inteligencia_curiosa
q4  → optimismo_bondadoso
q5  → empatia
q6  → optimismo_bondadoso
q7  → inteligencia_curiosa
q8  → etica_trabajo
q9  → empatia
q10 → integridad
q11 → integridad
q12 → etica_trabajo
q13 → empatia
q14 → autoconciencia
q15 → etica_trabajo
q16 → inteligencia_curiosa
q17 → inteligencia_curiosa
q18 → autoconciencia
q19 → autoconciencia
q20 → autoconciencia
q21 → etica_trabajo
q22 → integridad
q23 → integridad
q24 → integridad
q25 → integridad
q26 → integridad
q27 → empatia
q28 → optimismo_bondadoso
q29 → etica_trabajo
q30 → empatia
q31 → inteligencia_curiosa
q32 → inteligencia_curiosa
q33 → inteligencia_curiosa
q34 → inteligencia_curiosa
q35 → integridad
q36 → empatia
q37 → empatia
q38 → empatia
q39 → autoconciencia
q40 → autoconciencia
q41 → autoconciencia
q42 → optimismo_bondadoso
q43 → optimismo_bondadoso
q44 → optimismo_bondadoso
q45 → optimismo_bondadoso

REGLAS OBLIGATORIAS

[A] CASCADA DE PENALIZACIONES POR INSUFICIENCIA
Si aplica alguna de las reglas de insuficiencia (A1, A2, A3), la penalización cascadea a TODOS los scores del reporte. No es válido un score global de 40 con competencies promediando 80 — todo el reporte refleja la insuficiencia.

A1. Vacías / muy cortas
  Si MÁS de 20% de respuestas (q1..q45) están vacías o con menos de 15 palabras:
    - score (global) <= 40
    - summary = "Respuestas insuficientes"
    - Cada eje de competencies (los 5 viejos) <= 40
    - Cada eje de competenciesGuidara con respuestas evaluables <= 40
    - conocimientos_practicos sigue siendo { score: null, evidence: "..." }

A2. Sin caso concreto
  Si MENOS de 50% de respuestas contienen un ejemplo específico (situación + acción + resultado):
    - score (global) <= 50
    - Cada eje de competencies <= 50
    - Cada eje de competenciesGuidara con respuestas evaluables <= 50

A3. Repetidas / idénticas
  Si MÁS de 30% de respuestas son repetidas o casi idénticas entre sí:
    - score (global) <= 50
    - summary = "Respuestas repetitivas"
    - Cada eje de competencies <= 50
    - Cada eje de competenciesGuidara con respuestas evaluables <= 50

A4. Cascada con varias reglas
  Si aplican varias reglas simultáneamente, usa el LÍMITE MÁS ESTRICTO (el valor más bajo entre los aplicables) para todos los scores.

[B] EJES GUIDARA SIN RESPUESTAS EVALUABLES
En cada eje Guidara: si TODAS las respuestas asignadas a ese eje están vacías o con menos de 15 palabras:
  - score del eje = 0
  - evidence = "respuesta insuficiente para evaluar"

En cada eje Guidara: si UNA O MÁS respuestas del eje son evaluables, califica con las disponibles. NO penalices el eje por respuestas vacías de OTROS ejes — EXCEPTO cuando aplique una regla de cascada [A1/A2/A3], en cuyo caso aplica el techo correspondiente.

[C] EVIDENCE Y ESCAPE DE CARACTERES
Para "evidence" en competenciesGuidara:
- Cita LITERAL del candidato. No parafrasees.
- Máximo 25 palabras. Si excede, recorta con [...] al final.
- Si la cita contiene comillas dobles ("), reemplázalas por comillas simples (') O escápalas con backslash (\\"). Cualquiera de las dos funciona; sé consistente dentro del mismo evidence.
- Si la cita contiene backslashes literales (\\), escápalos como (\\\\).
- La integridad del JSON es PRIORITARIA sobre la fidelidad absoluta del carácter original. Si dudas, sustituye por comilla simple.

[D] GENERALES
- No inventes información que no esté en las respuestas. No supongas.
- Sin markdown, sin \`\`\`, sin texto fuera del JSON.

GUÍA DE PUNTUACIÓN (aplica a TODOS los scores 0-100)
- 90-100: respuestas profundas, consistentes, con ejemplos reales y reflexión propia.
- 75-89: buenas respuestas, algunos vacíos o generalidades.
- 55-74: respuestas aceptables pero genéricas, sin caso concreto.
- 30-54: respuestas insuficientes o muy cortas.
- 0-29: respuestas vacías, irrelevantes o evasivas.

Recordatorio: si dispara una regla de cascada [A], el techo de la regla manda sobre la guía de puntuación.

ANSWERS DEL CANDIDATO
${JSON.stringify(answers)}
`.trim()
}

export function buildPromptGuidaraMesero(answers: unknown): string {
  return `
Evalúa un EXAMEN PSICOMÉTRICO para Mesero con criterio de RH senior.

CONTEXTO DEL PUESTO
El Mesero es personal operativo de piso en restaurante. Cara al cliente desde el primer contacto hasta el cierre de la mesa. Toma orden, sugiere sin presionar, sirve, lee al comensal, maneja cuenta y propinas con honestidad. Trabaja en EQUIPO LATERAL: coordina con cocina, barra, capitán y hostess SIN tener autoridad sobre nadie. NO supervisa, NO cierra caja, NO maneja métricas de turno (eso es capitán o subgerente). Su valor está en cinco cosas: (a) calidad del servicio en vivo y ejecución del protocolo bajo presión sostenida, (b) ventas sugestivas sin presionar, (c) integridad con propinas y cuentas cuando nadie está mirando, (d) lectura emocional del comensal y del equipo en cierre, (e) actitud que sostiene el ambiente del piso aunque no tenga el puesto para imponerla.

FORMATO DE RESPUESTA
Devuelves SOLO JSON válido. Sin markdown, sin \`\`\` wrappers, sin texto adicional fuera del JSON. La forma EXACTA es:

{
  "score": number,
  "summary": string,
  "strengths": string[],
  "risks": string[],
  "recommendation": string,
  "competencies": {
    "service_protocol": number,
    "customer_communication": number,
    "stress_conflict": number,
    "sales_suggestions": number,
    "teamwork_discipline": number
  },
  "competenciesGuidara": {
    "optimismo_bondadoso":      { "score": number, "evidence": string },
    "inteligencia_curiosa":     { "score": number, "evidence": string },
    "etica_trabajo":            { "score": number, "evidence": string },
    "empatia":                  { "score": number, "evidence": string },
    "autoconciencia":           { "score": number, "evidence": string },
    "integridad":               { "score": number, "evidence": string },
    "conocimientos_practicos":  { "score": null, "evidence": "evaluado en el examen práctico" }
  },
  "pass": boolean
}

CÁLCULO DEL BLOQUE "competencies" (5 ejes viejos — intactos)
Mismo cálculo de siempre. Cada eje 0-100.

PESOS (suma 100):
- service_protocol: 30
- customer_communication: 25
- stress_conflict: 20
- sales_suggestions: 15
- teamwork_discipline: 10

El campo "score" raíz se calcula como el promedio ponderado de los 5 ejes anteriores. NO uses competenciesGuidara para calcular "score".

UMBRAL APTO (pass=true):
- score global >= 82
- service_protocol >= 70
- customer_communication >= 70
- ninguna competencia < 55

CÁLCULO DEL BLOQUE "competenciesGuidara" (7 ejes nuevos)
Cada eje humano tiene un set fijo de preguntas asignadas (ver TAGGING). Para cada eje:
1. Identifica las preguntas asignadas al eje (lista abajo).
2. Lee las respuestas correspondientes del candidato.
3. Califica de 0 a 100 según cómo esas respuestas reflejan la dimensión del eje (ver DEFINICIONES OPERATIVAS).
4. Escoge UNA respuesta del candidato que más sustente el score y ponla en "evidence" como cita literal — máximo 25 palabras, si es más larga recorta con [...] al final. Aplica las reglas de escape de caracteres (ver REGLAS OBLIGATORIAS).

Para "conocimientos_practicos":
  score = null
  evidence = "evaluado en el examen práctico"
(Este eje pertenece al examen práctico, no al psicométrico.)

DEFINICIONES OPERATIVAS DE LOS 7 EJES

optimismo_bondadoso
  Amabilidad genuina + creencia de que tus acciones pueden mejorar el día de los demás. Levantar al equipo desde un rol lateral, sin autoridad. Framing positivo bajo presión. Ver oportunidad de mejorar la experiencia del comensal donde otros no la verían. Reconocer al compañero. Hacer algo no obligado que el cliente recuerda al salir.

inteligencia_curiosa
  Ganas insaciables de aprender y mejorar. Preguntar antes de asumir. Aprender técnica/menú/sistema más rápido que el promedio. Pensamiento crítico aplicado a operación. Razonar bajo información incompleta. Adaptarse a cambios de menú o instrucciones nuevas en pleno servicio.

etica_trabajo
  Disciplina, consistencia, atención al detalle. Hacer las cosas con cuidado y excelencia incluso cuando nadie te ve hacerlo. Aguante bajo presión sostenida. Protocolo y rigor. Sostener velocidad y calidad cuando la estación está sola o cuando la tarea es repetitiva.

empatia
  Preocupación por el impacto de tus acciones en otros. Ponerse en el lugar del otro. Sensibilidad al estado emocional ajeno (comensal, compañero, jefe). Adaptar tu acercamiento a lo que el otro necesita. Manejar al compañero difícil o al cliente difícil sin escalarlo.

autoconciencia
  Entender cómo tu estado emocional afecta al servicio y al equipo. Conocer fortalezas y debilidades propias. Recibir feedback sin defensividad. Saber cuándo TÚ eres parte del problema. Identificar el momento en que te estás saturando antes de que se note en el piso.

integridad
  Hacer lo correcto sin supervisión. Honestidad con la cuenta, con la propina, con el reparto entre compañeros. Coherencia entre lo que dices al cliente y lo que pasa con su pedido. No taparte de errores propios ni cubrir el de otros. No ceder ante presión o tentación cuando nadie está mirando.

conocimientos_practicos
  Saber técnico específico del puesto (montaje, descorche, terminología de menú, manejo de bandeja, etc.). No se evalúa aquí — pertenece al examen práctico.

TAGGING — qué eje mide cada pregunta del banco Mesero
Las preguntas vienen numeradas q1..q37 en el bloque ANSWERS al final.

q1  → empatia
q2  → empatia
q3  → etica_trabajo
q4  → autoconciencia
q5  → etica_trabajo
q6  → autoconciencia
q7  → autoconciencia
q8  → etica_trabajo
q9  → optimismo_bondadoso
q10 → integridad
q11 → autoconciencia
q12 → empatia
q13 → empatia
q14 → integridad
q15 → integridad
q16 → integridad
q17 → etica_trabajo
q18 → inteligencia_curiosa
q19 → inteligencia_curiosa
q20 → autoconciencia
q21 → empatia
q22 → etica_trabajo
q23 → optimismo_bondadoso
q24 → optimismo_bondadoso
q25 → integridad
q26 → optimismo_bondadoso
q27 → integridad
q28 → inteligencia_curiosa
q29 → inteligencia_curiosa
q30 → integridad
q31 → autoconciencia
q32 → empatia
q33 → integridad
q34 → optimismo_bondadoso
q35 → optimismo_bondadoso
q36 → optimismo_bondadoso
q37 → optimismo_bondadoso

Conteo por eje (suma 37): optimismo_bondadoso 8 · inteligencia_curiosa 4 · etica_trabajo 5 · empatia 6 · autoconciencia 6 · integridad 8.

REGLAS OBLIGATORIAS

[A] CASCADA DE PENALIZACIONES POR INSUFICIENCIA
Si aplica alguna de las reglas de insuficiencia (A1, A2, A3), la penalización cascadea a TODOS los scores del reporte. No es válido un score global de 40 con competencies promediando 80 — todo el reporte refleja la insuficiencia.

A1. Vacías / muy cortas
  Si MÁS de 20% de respuestas (q1..q37) están vacías o con menos de 15 palabras:
    - score (global) <= 40
    - summary = "Respuestas insuficientes"
    - Cada eje de competencies (los 5 viejos) <= 40
    - Cada eje de competenciesGuidara con respuestas evaluables <= 40
    - conocimientos_practicos sigue siendo { score: null, evidence: "..." }

A2. Sin caso concreto
  Si MENOS de 50% de respuestas contienen un ejemplo específico (situación + acción + resultado):
    - score (global) <= 50
    - Cada eje de competencies <= 50
    - Cada eje de competenciesGuidara con respuestas evaluables <= 50

A3. Repetidas / idénticas
  Si MÁS de 30% de respuestas son repetidas o casi idénticas entre sí:
    - score (global) <= 50
    - summary = "Respuestas repetitivas"
    - Cada eje de competencies <= 50
    - Cada eje de competenciesGuidara con respuestas evaluables <= 50

A4. Cascada con varias reglas
  Si aplican varias reglas simultáneamente, usa el LÍMITE MÁS ESTRICTO (el valor más bajo entre los aplicables) para todos los scores.

[B] EJES GUIDARA SIN RESPUESTAS EVALUABLES
En cada eje Guidara: si TODAS las respuestas asignadas a ese eje están vacías o con menos de 15 palabras:
  - score del eje = 0
  - evidence = "respuesta insuficiente para evaluar"

En cada eje Guidara: si UNA O MÁS respuestas del eje son evaluables, califica con las disponibles. NO penalices el eje por respuestas vacías de OTROS ejes — EXCEPTO cuando aplique una regla de cascada [A1/A2/A3], en cuyo caso aplica el techo correspondiente.

NOTA ESPECÍFICA PARA MESERO — eje optimismo_bondadoso
Las preguntas q34, q35, q36, q37 (las cuatro nuevas) están diseñadas para forzar caso concreto en optimismo. Si un candidato deja las cuatro vacías o las contesta con generalidades del tipo "siempre trato de estar de buen humor" sin un solo ejemplo verificable, optimismo cae con techo bajo aunque las otras q9, q23, q24, q26 sí estén contestadas. Es deliberado: el eje optimismo del mesero es por DEFAULT candidato a falsificación en respuestas; las nuevas son el filtro real.

[C] EVIDENCE Y ESCAPE DE CARACTERES
Para "evidence" en competenciesGuidara:
- Cita LITERAL del candidato. No parafrasees.
- Máximo 25 palabras. Si excede, recorta con [...] al final.
- Si la cita contiene comillas dobles ("), reemplázalas por comillas simples (') O escápalas con backslash (\\"). Cualquiera de las dos funciona; sé consistente dentro del mismo evidence.
- Si la cita contiene backslashes literales (\\), escápalos como (\\\\).
- La integridad del JSON es PRIORITARIA sobre la fidelidad absoluta del carácter original. Si dudas, sustituye por comilla simple.

[D] GENERALES
- No inventes información que no esté en las respuestas. No supongas.
- Sin markdown, sin \`\`\`, sin texto fuera del JSON.

GUÍA DE PUNTUACIÓN (aplica a TODOS los scores 0-100)
- 90-100: respuestas profundas, consistentes, con ejemplos reales y reflexión propia.
- 75-89: buenas respuestas, algunos vacíos o generalidades.
- 55-74: respuestas aceptables pero genéricas, sin caso concreto.
- 30-54: respuestas insuficientes o muy cortas.
- 0-29: respuestas vacías, irrelevantes o evasivas.

Recordatorio: si dispara una regla de cascada [A], el techo de la regla manda sobre la guía de puntuación.

ANSWERS DEL CANDIDATO
${JSON.stringify(answers)}
`.trim()
}

// Selector: decide qué prompt usar según el rol.
// Mantener este selector como única puerta — si en el futuro migramos
// otro puesto, agregar su variante aquí (no en psychSubmit).
//
// Rollback: comentar la línea del if para que TODOS los roles vuelvan
// a buildPromptLegacy.
export function buildPsychPrompt(role: string, answers: unknown): string {
  if (role === 'Subgerente') return buildPromptGuidaraSubgerente(answers)
  if (role === 'Mesero') return buildPromptGuidaraMesero(answers)
  return buildPromptLegacy(role, answers)
}
