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
//   buildPromptGuidaraSubgerente(answers) / buildPromptGuidaraMesero(answers) /
//   buildPromptGuidaraCapitan(answers)
//     - 7 ejes Guidara (optimismo_bondadoso, inteligencia_curiosa,
//       etica_trabajo, empatia, autoconciencia, integridad,
//       conocimientos_practicos).
//     - Cada variante adapta contexto del puesto, banco de preguntas
//       (q1..qN), tagging por eje y notas específicas por rol.
//     - Devuelven AMBOS bloques (competencies + competenciesGuidara)
//       para backwards-compat con frontend existente y radar futuro.
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

export function buildPromptGuidaraCapitan(answers: unknown): string {
  return `
Evalúa un EXAMEN PSICOMÉTRICO para Capitán con criterio de RH senior.

CONTEXTO DEL PUESTO
El Capitán es MANDO OPERATIVO de piso en restaurante. Tiene gente a cargo (meseros, garroteros, hostess) y dirige al equipo EN VIVO durante el servicio — pre-turno, transición y cierre. Su rol es de mando inmediato: está en la sala, ve lo que pasa, toma decisión en el momento, media conflictos antes de que escalen, sostiene el ritmo del piso. NO es subgerente de turno: NO maneja caja, NO hace corte, NO firma cierre administrativo, NO toma decisiones de RH formales (contratar/despedir). SÍ delega tareas en vivo, SÍ corrige en el momento, SÍ es el primer filtro de queja seria, SÍ baja al equipo los cambios que vienen de arriba (menú, política, eventos). Su valor está en seis cosas: (a) coordinación en vivo entre cocina, barra, hostess y meseros bajo presión sostenida; (b) lectura del piso — saber qué mesa va a explotar antes de que explote, qué mesero está quemado antes de que tire; (c) delegación operativa con criterio — escoger a quién mandarle qué y por qué; (d) liderazgo de protección — sostener al equipo cuando uno cae, recibir corrección de un superior delante del equipo sin perder mando; (e) integridad en piso — manejo de descuentos, cortesías, política ante robo, ante presión de cliente o de superior; (f) protocolo de mando — bajar cambios al equipo antes del servicio, verificar que entendieron, manejar el handoff entre turnos cuando él descansa.

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
  Amabilidad genuina + creencia de que tus acciones pueden levantar al equipo que diriges en el momento. Energía protectora en pre-turno, transición y cierre. Reconocer al equipo de forma concreta cuando un turno salió bien. Levantar a un mesero quemado en pasillo sin gritar ni regañar. Sostener el ritmo de un turno lento sin que el equipo se caiga. Ver oportunidad de mejorar el día del comensal donde otros no la verían y amplificarla en el equipo.

inteligencia_curiosa
  Ganas insaciables de aprender, observar y mejorar el sistema bajo el cual diriges. Leer el piso en vivo — saber qué mesa va a explotar antes de que explote, qué mesero está quemado antes de que tire. Distinguir tipologías de cliente difícil en los primeros 2 minutos. Aprender un cambio de menú TÚ primero y bajarlo al equipo de forma que entiendan antes de abrir. Razonar bajo información incompleta sobre por qué bajan las ventas o por qué suben las quejas.

etica_trabajo
  Disciplina, consistencia, atención al detalle cuando estás al mando. Cierre real de la operación cuando el equipo quiere irse: dejar la estación lista para mañana aunque no se note a simple vista. Manejar tareas operativas pendientes que no entran al reporte formal pero se pierden si nadie las transmite. Sostener rigor y velocidad en transición y cierre, no solo en arranque.

empatia
  Preocupación por el impacto de tus decisiones en el equipo que diriges y en el comensal. Adaptar feedback al individuo y a la situación. Manejo de la persona difícil del equipo (mala actitud, defensiva, desmotivada, quien no aprende). Mediar conflictos entre miembros del equipo en pleno servicio sin que la mesa lo note. Mediar entre cocina y piso cuando pelean por tiempos. Convencer al equipo de adoptar una nueva forma de trabajar.

autoconciencia
  Entender cómo TU estado emocional afecta al equipo que diriges. Conocer fortalezas y debilidades propias al mando. Recibir feedback o corrección de un superior delante del equipo sin perder mando ni tronar al superior. Saber si tu forma de liderar cambia en días de alta demanda y qué haces con eso. Detectar en el momento que diste una instrucción mala y decidir si la corriges o esperas. Saber cuándo TÚ eres parte del problema en piso.

integridad
  Hacer lo correcto sin supervisión y bajo presión. Honestidad con descuentos, cortesías, decisiones de dinero pequeñas que toma el capitán en piso. Coherencia ante un superior que pide algo que no te parece correcto. Manejo de favoritismos percibidos. Política ante robo (cliente, miembro del equipo, proveedor) en el momento. Decisión ante un miembro del equipo que llega tarde de nuevo, que bebe en turno, o que genera conflicto constante. No taparte ni cubrir al equipo cuando se equivoca.

conocimientos_practicos
  Saber técnico específico del puesto (organización de roles del turno, manejo de quejas escaladas, protocolo de descuento, manejo de eventos, gestión de inventario en piso). No se evalúa aquí — pertenece al examen práctico.

TAGGING — qué eje mide cada pregunta del banco Capitán
Las preguntas vienen numeradas q1..q40 en el bloque ANSWERS al final. El orden es ENTREVERADO (ningún par consecutivo del mismo eje).

q1  → empatia
q2  → integridad
q3  → optimismo_bondadoso
q4  → autoconciencia
q5  → inteligencia_curiosa
q6  → empatia
q7  → etica_trabajo
q8  → integridad
q9  → optimismo_bondadoso
q10 → empatia
q11 → autoconciencia
q12 → integridad
q13 → inteligencia_curiosa
q14 → empatia
q15 → optimismo_bondadoso
q16 → empatia
q17 → integridad
q18 → autoconciencia
q19 → etica_trabajo
q20 → integridad
q21 → optimismo_bondadoso
q22 → empatia
q23 → inteligencia_curiosa
q24 → integridad
q25 → empatia
q26 → autoconciencia
q27 → optimismo_bondadoso
q28 → integridad
q29 → empatia
q30 → inteligencia_curiosa
q31 → integridad
q32 → optimismo_bondadoso
q33 → empatia
q34 → autoconciencia
q35 → empatia
q36 → inteligencia_curiosa
q37 → empatia
q38 → optimismo_bondadoso
q39 → etica_trabajo
q40 → integridad

Conteo por eje (suma 40): optimismo_bondadoso 7 · inteligencia_curiosa 5 · etica_trabajo 3 · empatia 11 · autoconciencia 5 · integridad 9.

REGLAS OBLIGATORIAS

[A] CASCADA DE PENALIZACIONES POR INSUFICIENCIA
Si aplica alguna de las reglas de insuficiencia (A1, A2, A3), la penalización cascadea a TODOS los scores del reporte. No es válido un score global de 40 con competencies promediando 80 — todo el reporte refleja la insuficiencia.

A1. Vacías / muy cortas
  Si MÁS de 20% de respuestas (q1..q40) están vacías o con menos de 15 palabras:
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
  Si aplican varias reglas simultáneamente, usa el LÍMITE MÁS ESTRICTO (el valor más bajo entre los aplicables) para todos los scores. Ejemplo: A1 dispara (techo 40) y A3 dispara (techo 50) → todos los scores <= 40.

[B] EJES GUIDARA SIN RESPUESTAS EVALUABLES
En cada eje Guidara: si TODAS las respuestas asignadas a ese eje están vacías o con menos de 15 palabras:
  - score del eje = 0
  - evidence = "respuesta insuficiente para evaluar"

En cada eje Guidara: si UNA O MÁS respuestas del eje son evaluables, califica con las disponibles. NO penalices el eje por respuestas vacías de OTROS ejes — EXCEPTO cuando aplique una regla de cascada [A1/A2/A3], en cuyo caso aplica el techo correspondiente.

NOTA ESPECÍFICA PARA CAPITÁN — eje optimismo_bondadoso
El eje optimismo tiene 7 preguntas en total: q3, q9, q15, q21, q27, q32, q38. De esas 7:
  - 5 son escenarios operativos NUEVOS del banco v2 (Cap N1–N5):
    q9  = briefing pre-turno (frase real, no "los motivo")
    q21 = mesero quemado en pasillo (30 segundos, acción concreta)
    q27 = turno lento martes 4pm (qué haces TÚ con el equipo)
    q32 = cierre cotidiano (3 minutos, reconocimiento concreto)
    q38 = amplificar acción extra de un mesero al resto del equipo
  - 2 son heredadas del banco original:
    q3  = motivar al equipo sin gritar
    q15 = qué haces cuando estás cansado pero debes liderar

El filtro real: si las 7 están vacías o son generalidades del tipo "siempre trato de tener buena actitud con el equipo" sin un solo ejemplo verificable, optimismo cae con techo bajo aunque otras respuestas estén contestadas. Las 5 nuevas son las que más fuerzan caso concreto (escenario operativo aterrizado); las 2 heredadas son más fáciles de contestar en abstracto. Es deliberado: el optimismo del capitán es por DEFAULT candidato a falsificación (es fácil decir "motivo al equipo" sin haberlo hecho nunca); los 5 escenarios operativos nuevos son el filtro real, las 2 heredadas el filtro de control.

NOTA ESPECÍFICA PARA CAPITÁN — eje autoconciencia
Las preguntas q4, q11, q18, q26, q34 son TODAS escenarios de mando bajo estrés (alta demanda, turno completo caído, corrección pública de superior, instrucción mala en vivo). Si las respuestas son conceptuales o evasivas ("respiro y sigo", "no me lo tomo personal") sin describir qué hizo el candidato consigo mismo en el momento, el eje cae con techo bajo. Razón: autoconciencia probablemente vuelve a CRÍTICO en umbrales (rol de mando — capitán que no se lee contagia al equipo que dirige), y este eje es el más fácil de fingir verbalmente sin haber vivido el momento.

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
  if (role === 'Capitán') return buildPromptGuidaraCapitan(answers)
  return buildPromptLegacy(role, answers)
}
