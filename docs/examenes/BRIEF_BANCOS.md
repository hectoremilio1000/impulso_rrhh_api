# Brief para escribir el examen de un puesto (catálogo 2026-11-16)

Restaurante piloto: **Cantina La Llorona**, Álvaro Obregón 308, Hipódromo Condesa,
CDMX. Cocina mexicana regional; bar de mezcales, tequilas, sotol, bacanora,
pulque, tepache, cervezas artesanales mexicanas y mixología propia. Opera con
POS (comandas en sistema, terminal bancaria, cortes de caja), reservas y
WhatsApp de clientes. Viernes y sábado de alta demanda.

Fuentes en Google Drive (léelas si tienes acceso a Drive; búscalas por título):
«Manual de Introducción Mesero y Capitan», «Manual de Introducción Barman»,
«Manual subGerente», «ESTRUCTURA_DOCUMENTAL_LA_LLORONA_30_08_26.docx»,
«Sesion4_Politica_Dinero.md», «Perfil del Puesto: Gerente Operativo». Lo que
no esté en esas fuentes es **supuesto provisional**: escríbelo en
`facultades.pendientesOperador`, no lo presentes como política.

Formato: un archivo TypeScript `app/services/exam_catalog/<code>.ts` que exporta
`export const EXAMEN_<CODE>: ExamenPuesto = {...}` con el tipo de
`app/services/exam_catalog/types.ts` (léelo). Referencia de calidad del bloque
A: `app/services/practical_rubrics/assistant_manager_v3.ts` y su banco
`app/services/practical_banks/assistant_manager.ts` (BANCO_SUBGERENTE_V3).
Además, una nota `docs/examenes/puestos/<code>.md` con: tareas del puesto,
facultades (decide / escala / pendiente de operador) y, por pregunta, qué tarea
real evalúa y por qué esa respuesta modelo es correcta.

## Bloque A · práctico del cargo (10 a 12 preguntas)

- Casos reales del turno de ESE puesto, con datos concretos (horas, cantidades,
  mesas, platillos, bebidas de la carta tipo La Llorona). Nada de tareas de otro
  puesto (un mesero no supervisa meseros; un cocinero no hace ingeniería de carta).
- **El enunciado no enumera lo que se califica** («incluye revisión de personal,
  caja…» está prohibido) ni sugiere la respuesta («sin gritar», «sin humillarlo»).
- Una sola pregunta por enunciado (nada de 3–4 subpreguntas).
- No presupone experiencia en el puesto («como capitán, …»): quien asciende
  debe poder contestar.
- Por pregunta: 3 a 6 `esenciales` verificables en una frase («Pregunta al
  comensal por alergias antes de recomendar»), `minimoCorrecta`, al menos una
  `alternativasValidas` cuando exista otra forma correcta, y `erroresCriticos`
  cuando haya una mala práctica grave (seguridad alimentaria, alcohol a menor o
  ebrio, dinero, discriminación, seguridad). Un error crítico se dice con
  palabras de lo que la persona HACE, no con su intención.
- Al menos una pregunta con dato técnico verificable del puesto (temperaturas,
  medidas de receta, tiempos, cálculo de cuenta dividida, merma). Si el dato se
  puede calificar con un número, usa `tipo: 'numerica'` con `clave`,
  `tolerancia`, `unidad` y `solucion`; si la clave depende del estándar de La
  Llorona y no está en las fuentes, va en `pendientesOperador`.
- Escalar al gerente merece crédito sólo donde la facultad no es del puesto; el
  elemento lo dice explícitamente («Avisa al gerente…»). Pasarle al gerente una
  tarea propia no merece crédito.
- `dimensiones`: 3 a 5 del puesto con pesos que sumen 100 (p. ej. Hostess:
  reservas y espera, asignación de mesas, coordinación con piso, comunicación con
  clientes). `indispensable: true` en las 2–4 tareas sin las cuales no puede
  trabajar el primer día. `umbralAprobado: 70` salvo razón escrita en la nota.
- `version`: `banco_<code>_v1`.

## Bloque B · seis competencias

Ejes: integridad, autoconciencia, etica_trabajo (ética de trabajo), empatia,
inteligencia_curiosa (curiosidad), optimismo_bondadoso (optimismo).

- 24 preguntas (4 por eje). Puestos de mando (Capitán, Encargado de barra,
  Encargado de cocina, Chef, Subgerente, Gerente): 30 (5 por eje).
- Por eje, al menos 3 de 4 (o 4 de 5) son `experiencia`: piden un hecho pasado
  concreto («Cuéntame de la última vez que…: qué pasó, qué hiciste tú, cómo
  terminó»). Redáctalas para que sirvan en **cualquier trabajo o en la vida
  diaria**, no sólo en restaurante, para no castigar a quien empieza.
  **Integridad: todas de experiencia.**
- Las `hipotetica` son dilemas concretos del puesto, sin la respuesta en el
  enunciado.
- Sin dobles preguntas, sin pistas, sin presuponer una falta propia («cuéntame
  de cuando robaste…»).
- `senalesPositivas` (2–4) y `senalesAlerta` (0–3) por pregunta. Las alertas son
  conductas graves citables (encubrir un faltante, quedarse con dinero, humillar,
  servir alcohol a un menor), nunca «respuesta corta» o «no sabe».
- Curiosidad y optimismo se miden igual que los demás, pero no tienen señales
  de alerta que descarten: sus `senalesAlerta` van vacías.
- `version`: `competencias_<code>_v1`.

## Al terminar

Corre `npx tsc --noEmit -p .` en `impulso_rrhh_api-examenes` y corrige hasta que
compile. No toques ningún otro archivo del repo. No inventes datos de La Llorona
como hechos.
