# Subgerente — seis competencias (v2)

Archivo: `app/services/exam_catalog/assistant_manager_competencias.ts`
(`COMPETENCIAS_SUBGERENTE_V2`, versión `competencias_assistant_manager_v2`).
Reemplaza las 45 preguntas `assistant_manager.psychometric` del front y su
etiquetado en `app/services/psych_question_tags.ts` (que no se toca aquí).
El práctico (`BANCO_SUBGERENTE_V3`) no cambia.

## Reglas aplicadas

- 30 preguntas, 5 por eje (puesto de mando).
- Integridad: 5 de 5 de experiencia. Los otros ejes: 4 de experiencia y 1 dilema del puesto.
- Las preguntas de experiencia sirven para cualquier trabajo, la escuela o la casa: quien asciende o empieza puede contestar.
- Los enunciados no dan pistas («sin que nadie se dé cuenta», «sin humillarlo»), no hacen dos preguntas, no suponen el puesto («como subgerente…») y no suponen una falta propia.
- Ningún escenario repite el práctico: apertura, reparto de secciones, métricas, cliente que pide al dueño, mesera que se va, caja con sobrante, cortesías, grupo sin reserva, cierre con faltante, cliente ebrio, cocina atrasada, auditoría de cancelaciones.
- Curiosidad y optimismo: `senalesAlerta` vacías.

## Conteo

| Eje | experiencia | hipotética | total |
|---|---|---|---|
| integridad | 5 | 0 | 5 |
| autoconciencia | 4 | 1 | 5 |
| etica_trabajo | 4 | 1 | 5 |
| empatia | 4 | 1 | 5 |
| inteligencia_curiosa | 4 | 1 | 5 |
| optimismo_bondadoso | 4 | 1 | 5 |
| **Total** | **25** | **5** | **30** |

Origen: 16 reescritas a partir de una pregunta anterior, 14 nuevas y 0 conservadas sin cambios. Ninguna de las 45 cumplía todas las reglas tal cual.

## Pregunta por pregunta

Numeración = posición en el arreglo (1–30). «qN» = pregunta N de las 45 anteriores.

| # | Pregunta nueva (resumen) | Eje | Tipo | De dónde viene | Por qué |
|---|---|---|---|---|---|
| 1 | Te dieron cambio de más o te pagaron algo que no te correspondía | integridad | experiencia | nueva | Integridad con dinero en un hecho que le pasa a cualquiera. Antes, toda la integridad era hipotética |
| 2 | Alguien te señaló algo de tu forma de trabajar que no te gustó oír | autoconciencia | experiencia | q45 reescrita | q45 estaba como optimismo y es autoconciencia. Se quita «tu gerente o el dueño te evalúan» (suponía el puesto) y la doble pregunta «¿estás de acuerdo…?» |
| 3 | Te tocó cubrir el trabajo de otra persona además del tuyo | etica_trabajo | experiencia | nueva | Ética tenía 5 preguntas, casi todas opinión o mal etiquetadas. Esta mide la carga extra con un hecho |
| 4 | Alguien cercano se llevó una decepción fuerte | empatia | experiencia | q6 reescrita | q6 suponía mando («aspiraba al puesto que tú tienes») y estaba como optimismo. Generalizada a cualquier ámbito |
| 5 | Notaste que algo se repetía y quisiste entender por qué | inteligencia_curiosa | experiencia | nueva | Mide la curiosidad con un hecho. Las antiguas de «curiosidad» (q3, q7, q16, q17, q31–q34) eran tareas, opinión o de otro eje |
| 6 | Un grupo quedó desanimado después de que algo salió mal | optimismo_bondadoso | experiencia | q5 reescrita | q5 era opinión («¿cómo motivas…?») y suponía un equipo a cargo. Ahora pide un hecho |
| 7 | Viste a alguien tomar dinero, producto o tiempo, o saltarse una regla de cobro o inventario | integridad | experiencia | q23 y q25 reescritas | Las dos eran hipotéticas («¿qué harías si…?»). Se pasan a experiencia, como pide el diagnóstico §2.5 |
| 8 | Un problema de tu equipo, casa o grupo venía en parte de algo que tú hacías | autoconciencia | experiencia | q44 reescrita | q44 estaba como optimismo y suponía el puesto («en tu rol de subgerente»). Sus ejemplos («autorizaste algo que no debías») sugerían la respuesta |
| 9 | Compromiso que estuviste a punto de no cumplir a tiempo | etica_trabajo | experiencia | nueva | Mide la responsabilidad con los plazos con un hecho |
| 10 | Pedirle algo difícil a alguien con más antigüedad, edad o experiencia | empatia | experiencia | q2 reescrita | q2 era buena, pero estaba como curiosidad y se limitaba a mesero o capitán. Es empatía: cómo lo recibe el otro |
| 11 | Algo que aprendiste por tu cuenta en el último año | inteligencia_curiosa | experiencia | nueva | Aprender por iniciativa propia, con evidencia de que lo usó |
| 12 | Algo te salió mal y lo volviste a intentar | optimismo_bondadoso | experiencia | nueva | Optimismo como persistencia. Ninguna de las 7 antiguas de optimismo lo medía (q4, q28 y q43–q45 son de otros ejes o del práctico) |
| 13 | Alguien de confianza te pidió que lo cubrieras en algo incorrecto | integridad | experiencia | q26 reescrita | q26 traía la pista «sin que nadie se dé cuenta», suponía el puesto («SOLO tú, como subgerente») y era hipotética. Duplicaba Chef q13 |
| 14 | Estuviste al límite por cansancio o presión | autoconciencia | experiencia | q21 reescrita (absorbe q16) | q21 traía la pista «SIN que el equipo lo note» y era opinión. q16 suponía el puesto («como subgerente») |
| 15 | Al terminar una jornada, algo tuyo había quedado incompleto o mal | etica_trabajo | experiencia | nueva (sustituye q22) | q22 era una doble pregunta (desconectarse y dejar el resumen listo) y estaba como integridad |
| 16 | Notaste que alguien cercano estaba mal sin que te lo dijera | empatia | experiencia | q39 reescrita | q39 estaba como autoconciencia y era una decisión hipotética del puesto. Ahora es un hecho, en cualquier ámbito |
| 17 | Decidiste algo importante sin tener toda la información | inteligencia_curiosa | experiencia | q36 reescrita | q36 estaba como empatía y es curiosidad. Se quitan los ejemplos («autorizar una cortesía sin saber el monto»), que empujaban a decidir fuera de facultades |
| 18 | Reconociste el trabajo de alguien sin que te lo pidieran | optimismo_bondadoso | experiencia | nueva | La parte «bondadosa» del eje, con un hecho |
| 19 | Supiste algo de otra persona que no te correspondía contar | integridad | experiencia | q27 reescrita | q27 estaba como empatía y es integridad (confidencialidad). Suponía el puesto («como subgerente tienes acceso…») y era hipotética |
| 20 | Reconociste que algo te rebasaba y pediste ayuda | autoconciencia | experiencia | q20 reescrita (sustituye q43) | q20 suponía estar a cargo de un turno. q43 (fortalezas y debilidades «como subgerente») era autodescripción, estaba como optimismo y suponía el puesto. Conocer el propio límite se ve mejor en un hecho |
| 21 | Ibas a llegar tarde o a faltar donde te esperaban | etica_trabajo | experiencia | nueva | Asistencia y puntualidad. El diagnóstico §2.5 señala que faltaba |
| 22 | Diste una noticia que la otra persona no quería oír | empatia | experiencia | q29 reescrita | q29 era opinión («¿cómo le das una mala noticia?») y suponía la facultad de no renovar contratos |
| 23 | Alguien con menos experiencia o de otra área te enseñó una mejor forma | inteligencia_curiosa | experiencia | nueva | Apertura a aprender de cualquiera, clave en mando |
| 24 | Una situación difícil que duró semanas o meses | optimismo_bondadoso | experiencia | nueva | Optimismo sostenido, no sólo en un momento |
| 25 | Alguien con autoridad te pidió algo que no te parecía correcto | integridad | experiencia | q38 reescrita | q38 estaba como empatía, era una doble pregunta («¿acatas o cuestionas?») e hipotética. Es integridad frente a la autoridad |
| 26 | Moviste una reserva de 8 a terraza y el gerente te corrige frente a dos meseros | autoconciencia | hipotética | q33 reescrita | q33 estaba como curiosidad y es autoconciencia (manejar la propia reacción). Era genérica; ahora es un dilema concreto que no repite el práctico |
| 27 | Martes al cierre: la limpieza profunda de la barra no se hizo y el equipo quiere irse | etica_trabajo | hipotética | nueva (sustituye q8) | q8 (rápido descuidado contra lento impecable) era opinión. Este dilema pone a prueba el estándar sin supervisión; no se cruza con el cierre de caja del práctico P9 |
| 28 | Evaluación de una mesera con retardos y quejas cuya mamá está hospitalizada | empatia | hipotética | q41 reescrita | q41 premiaba cambiar una evaluación por la situación personal. Ahora la señal positiva es mantener los hechos y dar el contexto aparte, y cambiar los hechos es alerta. Los apoyos que no son de su facultad se escalan |
| 29 | Las quejas por espera vienen de la terraza, que tiene menos mesas | inteligencia_curiosa | hipotética | nueva | Dilema que premia averiguar la causa antes de actuar. No repite el práctico P3 (métricas de un viernes) |
| 30 | Domingo lluvioso, salón a un tercio y un mesero dice que no vale la pena el turno | optimismo_bondadoso | hipotética | nueva | Ánimo del equipo en un turno flojo. Sustituye q5 como dilema del puesto |

## Preguntas anteriores que no pasan

| qN anterior | Por qué sale |
|---|---|
| q4 | Es una tarea del práctico (asignar secciones con un mesero menos) y repite P2. Estaba como optimismo |
| q13 | Repite P10 (cliente alterado en el comedor) |
| q18 | Repite P8 (grupos grandes sin reserva) |
| q17, q37 | Tareas de priorizar en el turno, ya cubiertas por el práctico (P1, P3) |
| q35 | Pedía decidir el monto de una cortesía «fuera de tus facultades» en lugar de escalarla. Además se cruza con P7 |
| q14, q32 | q32 traía la pista «sin humillarlo». q14 suponía el puesto («como subgerente estás en posición de auditar») y se cruza con P12 |
| q24 | Hipotética (proveedor que ofrece una gratificación) y duplica Chef q5. La cubre la pregunta 7 |
| q28, q34 | Facultades del puesto (qué decide y qué escala): las mide el práctico con su rúbrica, no una competencia |
| q1, q3, q7, q10, q11, q12, q19, q30, q31, q42 | Opinión o hábito declarado («¿cómo…?») sobre tareas de mando. No piden un hecho y varias estaban en el eje equivocado |
| q9, q15, q40 | Traían la pista en el enunciado («que el cliente no se entere», «sin que el equipo notara», «sin que ninguno quede expuesto») |
| q16, q43 | Suponían el puesto. Se absorben en las preguntas 14 y 20 |
| q22 | Doble pregunta y mal etiquetada. La sustituye la pregunta 15 |

## Pendiente fuera de este archivo

- `psych_question_tags.ts` y `exam_prompts.ts` siguen con el mapeo de las 45 preguntas. Hay que conectar esta ficha al calificador y al front antes de que se use. Este encargo no los tocó.
