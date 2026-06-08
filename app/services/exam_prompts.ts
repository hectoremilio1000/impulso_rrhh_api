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

export function buildPromptGuidaraBarman(answers: unknown): string {
  return `
Evalúa un EXAMEN PSICOMÉTRICO para Barman con criterio de RH senior.

CONTEXTO DEL PUESTO
El Barman es OPERATIVO de barra con DIMENSIÓN MORAL ELEVADA. NO es mando: no dirige meseros como capitán, no maneja caja del cierre administrativo como subgerente, no toma la orden round-trip como mesero. Su rol es ejecutor único de su estación: detrás de una barra, cara al cliente a CORTA DISTANCIA (la barra es estructura fija, no hay escape físico al salón como sí tiene el mesero). Tiene la MAYOR exposición directa a dinero líquido + alcohol + propinas de los 6 puestos del piso. Su valor está en seis cosas: (a) ejecución técnica de cócteles bajo presión sostenida — mantener recetas, tiempos y calidad cuando se llena la barra con 10+ tickets colgados, meseros gritando y cliente directo pidiendo; (b) integridad operativa con tentación directa — manejo de propinas sin testigo, cobro directo en efectivo, cortesías, política ante compañero que ofrece probar el trago del cliente o que llega a cubrir turno con copas; (c) motor de la barra — sostener el ambiente cuando hay un solo cliente sentado durante 2 horas, levantar un happy hour aburrido sin gente, vender un cóctel premium con sugerencia genuina sin presionar; (d) lectura del cliente a 60 centímetros — distinguir al cliente que viene a desahogarse del que viene a divertirse, leer al cliente difícil que está pasado vs el insistente, sin posibilidad de esconderse; (e) coordinación con piso y cocina sin escalar — cuando un mesero pasa un pedido mal, cuando cocina reclama por un trago que tardó, cuando un compañero de barra está lento; (f) protección de la experiencia del cliente bajo presión propia — llegar al turno con mal día personal y no poder esconderse del cliente que está a 60 cm.

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
  Energía protectora detrás de la barra. Sostener el ambiente cuando hay un solo cliente sentado 2 horas, levantar un happy hour aburrido sin que nadie te lo pida, vender un cóctel premium con sugerencia genuina sin presión vacía. Llegar a un turno con mal día personal y proteger al cliente que está a 60 cm del estado propio (no hay salón donde esconderse). Aportar algo distinto a un turno cuando es turno donde el barman es la diferencia entre que el cliente regrese o no.

inteligencia_curiosa
  Ganas de aprender recetas nuevas y adaptarse a contexto cambiante en vivo. Aprender un cóctel nuevo del menú haciendo preguntas, no quedándote con la indicación seca. Resolver con criterio cuando se acaba un destilado clave a media operación con clientes ya con pedido. Reaccionar bien cuando un cliente pide algo off-menu o que el barman nunca ha hecho — preguntar, improvisar con honestidad, o decir que no con dignidad.

etica_trabajo
  Disciplina sostenida. Cerrar la estación de barra con limpieza, rotación de inventario y herramientas listas para mañana, aunque sea tarde y nadie verifique. Manejar el handoff al siguiente turno con responsabilidad — el compañero del día siguiente abre la barra encontrando o no encontrando lo que tú dejaste. Recuperar el ritmo cuando llegaste tarde, sin tirar el turno entero por la frustración de haber empezado mal.

empatia
  Lectura del cliente difícil a 60 cm y del compañero en pleno turno. Manejar al cliente difícil sin perder la calma ni perder al cliente — el que insiste con algo que no funciona, el que está pasado, el que pide rehacer 3 veces. Resolver problemas operativos directamente con un mesero sin escalar al gerente. Manejar la conversación cuando cocina o piso reclaman algo de la barra sin convertirlo en pelea. Detectar que el compañero de barra está lento y decidir si le dices algo o cargas con su parte.

autoconciencia
  Reconocer cómo TU estado afecta tu ejecución en barra y al cliente a 60 cm de distancia. Identificar en pleno servicio que estás perdiendo el ritmo (10+ tickets colgados) y retomarlo. Procesar correcciones públicas (chef, gerente, capitán, mesero senior) sin tronar al que corrige ni al cliente que está mirando. Detectar cansancio o frustración propia antes de que se manifieste en un trago mal hecho o en mal trato. Reconocer cuándo tú mismo eres parte del problema.

integridad
  Hacer lo correcto sin supervisión y con tentación directa. Honestidad ante dinero líquido — corte de propinas con dinero a favor sin testigo, cambio del cliente que se fue sin esperar, cortesías otorgadas. Honestidad ante alcohol — compañero que ofrece probar el trago del cliente, compañero que llega a cubrir turno con copas. Honestidad ante el error operativo propio — el cóctel mal hecho sin que nadie haya notado. Política ante el compañero que pasa algo mal: trago no cobrado, propina mal repartida, cortesía sin autorizar.

conocimientos_practicos
  Saber técnico específico del puesto (mise en place, recetas estandarizadas, control de mermas, porcionado de destilados, manejo de inventario en barra, cierre de estación). NO se evalúa aquí — pertenece al examen práctico.

TAGGING — qué eje mide cada pregunta del banco Barman
Las preguntas vienen numeradas q1..q25 en el bloque ANSWERS al final. El orden es ENTREVERADO (ningún par consecutivo del mismo eje).

q1  → integridad
q2  → empatia
q3  → optimismo_bondadoso
q4  → autoconciencia
q5  → integridad
q6  → inteligencia_curiosa
q7  → empatia
q8  → optimismo_bondadoso
q9  → etica_trabajo
q10 → integridad
q11 → empatia
q12 → autoconciencia
q13 → optimismo_bondadoso
q14 → inteligencia_curiosa
q15 → integridad
q16 → etica_trabajo
q17 → empatia
q18 → autoconciencia
q19 → optimismo_bondadoso
q20 → integridad
q21 → inteligencia_curiosa
q22 → autoconciencia
q23 → optimismo_bondadoso
q24 → etica_trabajo
q25 → integridad

Conteo por eje (suma 25): integridad 6 · optimismo_bondadoso 5 · autoconciencia 4 · empatia 4 · inteligencia_curiosa 3 · etica_trabajo 3.

REGLAS OBLIGATORIAS

[A] CASCADA DE PENALIZACIONES POR INSUFICIENCIA
Si aplica alguna de las reglas de insuficiencia (A1, A2, A3), la penalización cascadea a TODOS los scores del reporte. No es válido un score global de 40 con competencies promediando 80 — todo el reporte refleja la insuficiencia.

A1. Vacías / muy cortas
  Si MÁS de 20% de respuestas (q1..q25) están vacías o con menos de 15 palabras (más de 5 preguntas para Barman):
    - score (global) <= 40
    - summary = "Respuestas insuficientes"
    - Cada eje de competencies (los 5 viejos) <= 40
    - Cada eje de competenciesGuidara con respuestas evaluables <= 40
    - conocimientos_practicos sigue siendo { score: null, evidence: "..." }

A2. Sin caso concreto
  Si MENOS de 50% de respuestas contienen un ejemplo específico (situación + acción + resultado), o sea menos de 13 preguntas con caso concreto para Barman:
    - score (global) <= 50
    - Cada eje de competencies <= 50
    - Cada eje de competenciesGuidara con respuestas evaluables <= 50

A3. Repetidas / idénticas
  Si MÁS de 30% de respuestas son repetidas o casi idénticas entre sí (más de 7 preguntas para Barman):
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

NOTA ESPECÍFICA PARA BARMAN — eje optimismo_bondadoso (MOTOR DE BARRA)
El eje optimismo tiene 5 preguntas en total: q3, q8, q13, q19, q23. De esas 5:
  - 3 son escenarios operativos NUEVOS (Barman N1–N3) que aterrizan al barman como motor único de la barra (sin equipo que cargue por él):
    q8  = miércoles 8 PM con un solo cliente sentado en la barra durante 2 horas seguidas
    q13 = último happy hour aburrido sin gente — iniciativa para cambiar el ambiente o turno tranquilo
    q23 = mal día personal con cliente a 60 cm sin escape físico al salón
  - 2 son rewrites situacionales del banco original:
    q3  = cliente al que vendiste cóctel premium o segunda ronda por sugerencia tuya, no porque él lo pidió
    q19 = último turno donde saliste con energía sintiendo que aportaste algo distinto

El filtro real: el barman es motor ÚNICO del ambiente de la barra; cero compañeros que carguen la energía por él (a diferencia de mesero, que tiene capitán y sub que pueden cargar tono del piso). Si las 5 están vacías o son generalidades del tipo "siempre trato de ser positivo con el cliente" sin un solo escenario aterrizado, optimismo cae con techo bajo aunque otras respuestas estén contestadas. Las 3 NUEVAS son las que más fuerzan caso concreto (escenarios operativos aterrizados); las 2 reescritas son control del nivel de honestidad sobre la propia ejecución.

NOTA ESPECÍFICA PARA BARMAN — eje integridad (EJE DE MAYOR EXPOSICIÓN)
El eje integridad tiene 6 preguntas en total: q1, q5, q10, q15, q20, q25. De esas 6:
  - 3 son escenarios operativos NUEVOS, dinero+alcohol DIRECTOS al barman:
    q5  = corte de propinas del turno con $200 a favor sin testigo
    q10 = cliente paga $1,500 por $1,420 y se va sin esperar el cambio
    q20 = compañero ofrece probar el trago del cliente con gerencia ausente
  - 3 son rewrites de escenarios morales operativos:
    q1  = cóctel mal hecho sin que nadie note — admitir vs encubrir
    q15 = compañero hace algo mal — trago no cobrado, propina mal repartida, cortesía sin autorizar
    q25 = cubrir turno de compañero que llegó oliendo a alcohol con 15 minutos para abrir

El filtro real: el barman tiene MAYOR exposición directa a dinero líquido + alcohol del piso. Las 3 NUEVAS (q5, q10, q20) son tentaciones DIRECTAS al barman, no decisiones de testigo: "qué haces con este dinero", "qué le respondes a este compañero". Si responde con frases reflexivas tipo "siempre actúo honestamente" sin describir qué pensaría y qué haría con los $200 concretos o con el trago concreto, integridad cae con techo bajo aunque otras respuestas estén contestadas. Las 3 rewrites son testimonios de testigo o decisión moral; son control.

Razón estructural: integridad probablemente vuelve a CRÍTICO en umbrales con banda alta (verde candidato ≥ 85, +10 estricto sobre Sub y Cap), dado que es el eje con mayor exposición operativa del puesto. Falsificar integridad en barra es contrato implícito directo con la pérdida del restaurante.

NOTA ESPECÍFICA PARA BARMAN — eje autoconciencia
Las preguntas q4, q12, q18, q22 son escenarios de ejecución bajo estrés con cliente a 60 cm (10+ tickets colgados con meseros gritando, corrección pública por chef/gerente/capitán/mesero senior, cansancio extremo en turno, algo del equipo que te sacó de tus casillas en pleno servicio). Si las respuestas son conceptuales o evasivas ("respiro y sigo", "no me lo tomo personal") sin describir qué hizo el candidato consigo mismo en el momento, el eje cae con techo bajo. Razón: el cliente está a 60 cm del barman sin escape físico — un barman que no se lee saturado lo paga directamente la experiencia del cliente, no se puede esconder detrás de la barra como tampoco puede esconderse del cliente.

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

export function buildPromptGuidaraCook(answers: unknown): string {
  return `
Evalúa un EXAMEN PSICOMÉTRICO para Cocinero con criterio de RH senior.

CONTEXTO DEL PUESTO
El Cocinero es OPERATIVO de BACK-OF-HOUSE: PRIMER puesto SIN cara al cliente del piso. NO sirve al cliente (lo hace el mesero), NO maneja caja (lo hace subgerente), NO dirige equipo (lo hace chef gerente), NO vende sugestivamente (no hay venta en cocina). Su rol es ejecutor técnico de su estación, dentro de una línea, sin reconocimiento directo del comensal. La estación está sometida a calor + ruido + comandas colgadas + presión sostenida del pase. Su valor está en cinco cosas: (a) ejecución técnica bajo presión sostenida — mantener recetas, tiempos, temperaturas, gramajes cuando hay 10+ comandas colgadas y el pase grita urgencias del piso; (b) integridad invisible — el daño que un cocinero hace por falla de carácter es invisible y diferido: higiene/contaminación cruzada que provoca intoxicación 48 h después, producto en el límite que se usa porque nadie está viendo, merma de corte premium que entró fuera de la entrega regular, platillo TUYO mal que el mesero ya se llevó a la mesa y la única forma de saberlo es que TÚ lo digas; (c) disciplina de proceso — la columna vertebral del puesto: mise en place completo aunque hayas llegado tarde, rotación PEPS aunque el producto viejo esté más escondido, cadena de frío respetada aunque haya prisa, recetas al pie aunque el compañero te diga 'hazlo más rápido', no cortar camino bajo presión aunque nadie en cocina vería los 2 pasos saltados y el cliente probablemente no los notaría; (d) empatía operacional — leer al equipo bajo calor + ruido + comandas: el ayudante perdido sin saber cómo pedir, el pase gritando urgencia (real del cliente vs pánico personal del que vino a gritar), el compañero de línea quemado a mitad de turno; (e) autoconciencia técnica — saber cuándo TÚ ya no estás al 100 sin que se note en los platos, procesar corrección TÉCNICA del chef en plena línea (corte, cocción, sazón — no actitudinal), admitir el error técnico que solo TÚ viste.

El cliente NO ve al cocinero. Esa es la diferencia estructural con los 4 puestos anteriores: la autoconciencia pierde su mecanismo de retroalimentación inmediata (no hay cara del cliente que te avise) y en su lugar sube la disciplina de proceso invisible. El daño por falla de carácter en cocina es invisible-y-diferido (intoxicación a 48 h, inconsistencia no rastreable, merma silenciosa). Por eso integridad y ética son los DOS CRÍTICOS del puesto, y cocinero es el PRIMER puesto del cronograma Guidara donde ética sube de DEVELOPABLE a CRÍTICO.

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

NOTA: los 5 ejes viejos son mesero-céntricos. Para cocinero, service_protocol, customer_communication y sales_suggestions no aplican al rol real del puesto. Califica esos ejes con base en lo que las respuestas reflejen del oficio del cocinero (consistencia, manejo de presión, coordinación con pase) pero entiende que el \`pass\` viejo será MUY ruidoso. La decisión REAL viene de competenciesGuidara + umbrales.

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
  Energía protectora en la línea sin comensal. Levantar un turno flojo de cocina donde dos compañeros tienen cara larga y hay espacios de 20-30 minutos entre comandas — hacer algo TÚ desde la estación para que esos huecos no se sientan turno muerto. Detenerse a celebrar la primera vez del ayudante o cocinero nuevo (su primer plato montado solo, su primera salsa que salió) en lugar de seguir cocinando sin verlo. Aportar algo distinto al clima de la cocina cuando el rush no marca el ritmo.

inteligencia_curiosa
  Ganas de aprender técnicas/recetas nuevas y adaptarse a contexto cambiante en vivo. Resolver con criterio cuando se acaba un insumo clave a media operación con comanda ya colgada para ese platillo (preguntar al chef, sustituir con justificación, decirle al mesero que lo cambie con honestidad). Aprender en plena operación cuando algo que no sabías te traba (técnica, corte, cocción, equipo nuevo) y procesarlo después del turno para que no vuelva a pasar.

etica_trabajo
  Disciplina invisible bajo presión sostenida. Mise en place completo aunque hayas llegado 10 minutos tarde y solo queden 20 minutos antes de servicio. Cadena de frío respetada — el producto preparado que se quedó afuera del refrigerador con tiempo desconocido NO se rescata sin avisar a quien decide. Rotación PEPS — usar primero lo viejo aunque el fresco esté arriba y más rápido. Recetas al pie cuando un compañero o jefe te dice 'hazlo más rápido' o 'así no, mejor de esta forma'. No cortar camino bajo presión — sábado pico con 12 comandas colgadas, los 2 pasos invisibles de la receta no se saltan aunque nadie en cocina los vería y el cliente probablemente no los notaría.

empatia
  Lectura del equipo de cocina y del pase, no del cliente (el cliente no está enfrente). Detectar al ayudante perdido — cara de saturado, manos temblorosas, le falta algo y no sabe cómo pedirlo — y ayudar sin descuidar la propia estación. Distinguir si la urgencia del pase/mesero/capitán que llega gritando es del cliente real ('la 12 lleva 40 minutos esperando') o pánico personal del que vino a gritar. Manejar al compañero de línea quemado a mitad de turno (platillo regresado, bronca con el pase, problema personal) en 30 segundos en plena estación para que termine el turno sin tirar más platos.

autoconciencia
  Reconocer cómo TU estado afecta tu ejecución en línea sin que se note en los platos (el cliente no te ve, pero el plato sí lo paga). Identificar a mitad de servicio que ya no estás al 100 (sueño, mal día, lesión) y cambiar cómo cocinas el resto del turno (bajar velocidad, pedir ayuda, concentrarte distinto) antes de que se manifieste en un plato mal hecho. Procesar corrección TÉCNICA del chef en plena línea (corte, cocción, sazón — no actitudinal) sin caerte y seguir produciendo 2-3 horas más con la corrección integrada. Admitir el error técnico que solo TÚ viste — cocción fuera de punto, proporción equivocada — y decidir si lo dices o lo guardas.

integridad
  Hacer lo correcto sin testigo y con tentación operativa invisible. Honestidad ante higiene — denunciar al compañero que no se lavó las manos al cambiar de proteína, que usó el mismo trapo para todo, que no cambió la tabla entre crudo y cocido, aunque la operación siga corriendo y nadie más esté viendo. Honestidad ante producto en el límite — pescado, carne o salsa madre con olor o color justo en el borde, chef ausente, 3 comandas colgadas con ese ingrediente. No cortar camino con contaminación cruzada bajo presión — viernes rush, pollo crudo + comanda urgente de ensalada, tabla limpia al otro lado de la línea, 40 segundos en juego. Honestidad ante platillo TUYO mal — quemado, crudo en el centro, mal sazonado, con un pelo — cuando el mesero ya se lo llevó a la mesa y la única forma de saberlo es que TÚ lo digas. Honestidad ante merma sin registro claro — corte premium que entró fuera de la entrega regular, sobrante al cierre, nadie va a echar en falta.

conocimientos_practicos
  Saber técnico específico del puesto (mise en place, recetas, control de temperaturas, contaminación cruzada, porcionado, priorización de comandas, coordinación con el pase, cierre de estación). NO se evalúa aquí — pertenece al examen práctico.

TAGGING — qué eje mide cada pregunta del banco Cocinero
Las preguntas vienen numeradas q1..q20 en el bloque ANSWERS al final. El orden es ENTREVERADO (ningún par consecutivo del mismo eje).

q1  → integridad
q2  → empatia
q3  → etica_trabajo
q4  → autoconciencia
q5  → integridad
q6  → optimismo_bondadoso
q7  → etica_trabajo
q8  → inteligencia_curiosa
q9  → integridad
q10 → empatia
q11 → etica_trabajo
q12 → autoconciencia
q13 → integridad
q14 → optimismo_bondadoso
q15 → etica_trabajo
q16 → inteligencia_curiosa
q17 → integridad
q18 → empatia
q19 → autoconciencia
q20 → etica_trabajo

Conteo por eje (suma 20): integridad 5 · etica_trabajo 5 · autoconciencia 3 · empatia 3 · optimismo_bondadoso 2 · inteligencia_curiosa 2.

REGLAS OBLIGATORIAS

[A] CASCADA DE PENALIZACIONES POR INSUFICIENCIA
Si aplica alguna de las reglas de insuficiencia (A1, A2, A3), la penalización cascadea a TODOS los scores del reporte. No es válido un score global de 40 con competencies promediando 80 — todo el reporte refleja la insuficiencia.

A1. Vacías / muy cortas
  Si MÁS de 20% de respuestas (q1..q20) están vacías o con menos de 15 palabras (más de 4 preguntas para Cocinero, o sea 5 o más):
    - score (global) <= 40
    - summary = "Respuestas insuficientes"
    - Cada eje de competencies (los 5 viejos) <= 40
    - Cada eje de competenciesGuidara con respuestas evaluables <= 40
    - conocimientos_practicos sigue siendo { score: null, evidence: "..." }

A2. Sin caso concreto
  Si MENOS de 50% de respuestas contienen un ejemplo específico (situación + acción + resultado), o sea menos de 10 preguntas con caso concreto para Cocinero:
    - score (global) <= 50
    - Cada eje de competencies <= 50
    - Cada eje de competenciesGuidara con respuestas evaluables <= 50

A3. Repetidas / idénticas
  Si MÁS de 30% de respuestas son repetidas o casi idénticas entre sí (más de 6 preguntas para Cocinero, o sea 7 o más):
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

NOTA ESPECÍFICA PARA COCINERO — eje integridad (TENTACIÓN SIN TESTIGO)
El eje integridad tiene 5 preguntas en total: q1, q5, q9, q13, q17. De esas 5:
  - 3 son escenarios operativos NUEVOS, tentación cocina-DIRECTA sin testigo:
    q5  = producto en el límite (olor/color al borde), chef ausente, 3 comandas colgadas con ese ingrediente
    q9  = contaminación cruzada bajo presión (pollo crudo + comanda de ensalada urgente, tabla limpia al otro lado de la línea, 40 segundos en juego)
    q17 = merma de corte premium sin registro claro, sobrante al cierre, entró fuera de la entrega regular
  - 2 son rewrites situacionales del banco original:
    q1  = denunciar al compañero que hizo higiene mal — testigo de otro
    q13 = platillo TUYO mal — quemado, crudo, con un pelo — el mesero ya se lo llevó, la única forma de saberlo es que TÚ lo digas

El filtro real: el cocinero opera SIN testigo del cliente y SIN verificación inmediata de su trabajo. El daño que hace por falla de integridad es invisible y diferido (intoxicación a 48 h, inconsistencia no rastreable, merma silenciosa). Las 3 NUEVAS (q5, q9, q17) son tentaciones DIRECTAS — "qué haces con este producto", "qué haces en estos 40 segundos", "qué pasó con ese corte". Si responde con frases reflexivas tipo "siempre actúo correctamente" sin describir qué pensaría y qué haría con el producto en el límite, con la tabla a 40 segundos o con el corte premium, integridad cae con techo bajo aunque otras respuestas estén contestadas. Las 2 rewrites son denuncia (testigo del otro) y admisión (testigo de sí mismo); son control del nivel de honestidad sobre la propia ejecución.

Razón estructural: integridad es CRÍTICO en este puesto con banda alta. El cocinero deshonesto es el más peligroso del organigrama — mayor potencial de daño grave (intoxicación masiva) por menor exposición visible. Falsificar integridad en cocina es contrato implícito directo con la pérdida del restaurante.

NOTA ESPECÍFICA PARA COCINERO — eje etica_trabajo (DISCIPLINA INVISIBLE)
El eje etica_trabajo tiene 5 preguntas en total: q3, q7, q11, q15, q20. De esas 5:
  - 4 son escenarios operativos NUEVOS, disciplina de proceso bajo presión sin verificación:
    q7  = mise en place atrasado por llegar 10 min tarde, servicio arranca en 20 min, qué cortaste / qué priorizaste
    q11 = rotación PEPS — producto fresco arriba, viejo abajo escondido, qué hiciste durante el turno
    q15 = cadena de frío — producto preparado afuera del refri, tiempo desconocido pero claramente más del debido, qué haces y a quién le dices
    q20 = sábado pico con 12 comandas colgadas, receta con 2 pasos saltables invisibles, nadie en cocina los vería
  - 1 es rewrite situacional:
    q3  = recetas al pie cuando compañero o jefe te dice 'hazlo más rápido' o 'mejor de esta forma'

El filtro real: la disciplina de proceso en cocina es la columna vertebral del puesto. El cocinero flojo o que corta camino hace daño DISTINTO al del piso: el daño es invisible (nadie ve los 2 pasos saltados) y diferido (la inconsistencia entre platillos del mismo nombre se acumula como quejas dispersas que nadie rastrea hasta el chef; la intoxicación llega 48 h después). Las 4 NUEVAS son tentaciones de cortar camino bajo presión real — no son "¿qué tan disciplinado eres?" sino "¿qué hiciste el último viernes / sábado / día específico donde estabas tarde / encontraste el producto fresco arriba / tenías 12 comandas colgadas?". Si responde con frases genéricas tipo "soy muy disciplinado, no me gusta dejar cosas a medias" sin aterrizar el turno concreto, etica_trabajo cae con techo bajo. La rewrite q3 es el caso canónico del puesto: la persona que te dice 'hazlo más rápido' es el primer test de disciplina de la noche.

Razón estructural: etica_trabajo es CRÍTICO en este puesto — el PRIMER puesto del cronograma Guidara donde sube de DEVELOPABLE a CRÍTICO. Subgerente / Mesero / Capitán / Barman tienen ética como developable porque su flojera es visible e inmediata (cliente se queja, ticket no llega, corte no cuadra). El cocinero flojo no se detecta en horas; se detecta en días o semanas — y para entonces ya hay queja masiva, intoxicación o costo de merma fuera de control. Por eso la banda de etica_trabajo debe ser estricta (similar a integridad) y rojo en etica_trabajo dispara DESCARTAR igual que rojo en integridad. Este es el cambio estructural más importante del puesto.

NOTA ESPECÍFICA PARA COCINERO — eje autoconciencia (TÉCNICA, NO ACTITUDINAL)
Las preguntas q4, q12, q19 son escenarios de ejecución TÉCNICA bajo calor + ruido + comandas. q4 = corrección del chef por algo TÉCNICO (corte, cocción, sazón) frente al pase y los meseros que pasan por comandas — no es corrección actitudinal frente al equipo que lideras (eso es Cap/Sub); es corrección de oficio que tienes que integrar a la producción de las próximas 2-3 horas. q12 = ya no estoy al 100 a mitad de servicio (sueño, mal día, lesión), nadie más se dio cuenta, qué cambiaste en cómo cocinaste el resto del turno para que no se notara en los platos. q19 = error técnico de tu estación que solo TÚ viste, el platillo salió, te lo guardaste o lo dijiste.

Si las respuestas son conceptuales o evasivas ("respiro y sigo", "siempre estoy alerta") sin describir qué hizo el candidato consigo mismo en el momento (cara, velocidad, qué cambió específicamente), el eje cae con techo bajo. Razón: el cliente NO ve al cocinero, pero EL PLATO sí paga la auto-ceguera. Un cocinero que no se lee saturado lo paga directamente la consistencia del output. La disciplina de proceso (etica_trabajo crítico) compensa parcialmente la auto-ceguera del individuo — por eso autoconciencia es IMPORTANTE en cocinero, no CRÍTICO; pero sigue importando porque la disciplina no funciona sobre alguien que no se da cuenta de que ya está cortando camino.

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
  if (role === 'Barman') return buildPromptGuidaraBarman(answers)
  if (role === 'Cocinero') return buildPromptGuidaraCook(answers)
  return buildPromptLegacy(role, answers)
}
