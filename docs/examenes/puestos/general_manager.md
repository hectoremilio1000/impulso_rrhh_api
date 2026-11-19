# Gerente (`general_manager`): qué entra del diseño y por qué

Ficha: `app/services/exam_catalog/general_manager.ts` (`EXAMEN_GENERAL_MANAGER`).
Versiones: `banco_general_manager_v2` (desde 2026-11-19; antes v1) · `competencias_general_manager_v2` (desde v2.2, sólo cambia la redacción de la 27).

Fuentes:
- Diseño «Impulso — Evaluación por puesto y piloto Gerente» (Claude Doc, rev 43, estado «Propuesta»), en su copia literal `~/.local/share/impulso-examenes/gerente/DISENO_GERENTE_RECUPERADO.md`.
- Revisión experta: `~/.local/share/impulso-examenes/DIAGNOSTICO_EXAMENES_IMPULSO.md` §5.2 y §5.3.
- Reglas del formato: `docs/examenes/BRIEF_BANCOS.md`.

Estado: **provisional**. Nada de esto lo revisó un panel ni se probó en un piloto. Los datos de los ejercicios son **ficticios**: no son cifras de La Llorona.

## Tareas del puesto

Según el diseño, el Gerente responde por la unidad en la semana y el mes: la experiencia de los clientes, el equipo, los resultados y los controles.

- Lee los resultados de la semana (venta, costo, nómina, cortesías, cancelaciones) y se los reporta al dueño cada lunes.
- Controla caja e inventario: arqueos, faltantes, varianzas de barra, cancelaciones y cortesías.
- Organiza la plantilla según la demanda y el presupuesto. En este examen no se evalúa: va en el caso 4, que es presencial.
- Da la primera respuesta a los incidentes, los documenta y escala lo que no le toca.
- Sostiene el estándar de servicio y recupera las experiencias que salen mal.
- Hace los pedidos recurrentes con el chef, dentro del presupuesto.

## Facultades: hipótesis H1–H6 del diseño, todas por confirmar

| # | Decide el gerente (`decide`) | Decide el dueño (`escala`) |
|---|---|---|
| H1 | Horarios, asignaciones, amonestaciones documentadas | Contrataciones y despidos |
| H2 | Cortesías hasta $800 por mesa y 1 % de la venta semanal | Descuentos fuera de política |
| H3 | Arqueos, investigar faltantes, cambiar el procedimiento de caja | Descuentos al salario, acciones legales |
| H4 | Pedidos recurrentes dentro de presupuesto, con el chef | Proveedores nuevos, compras fuera de presupuesto |
| H5 | Primera respuesta, documentación, contacto privado con afectados | Comunicación pública, abogados, aseguradora |
| H6 | Reporta cada lunes y ante cualquier incidente grave | Fija metas y políticas |

Cada enunciado repite las facultades que aplican, como pide el diseño. Cada una de H1 a H6 también aparece en `pendientesOperador` con la palabra «Confirmar».

Facultades que faltaban según la revisión, y que quedan como pendientes:
- si el gerente puede suspender un platillo;
- qué permisos de cancelación tiene en el POS;
- cuándo llama a seguridad o a la policía.

## Bloque A · práctico (14 preguntas)

Dimensiones y pesos. El diseño **no fija pesos**; estos son una propuesta.

| id | Dimensión del diseño | Peso | Preguntas |
|---|---|---|---|
| `lectura_resultados` | A1 Lectura de resultados | 30 | q1, q2, q4, q7, q9 |
| `controles` | A2 Controles de caja e inventario | 35 | q3, q5, q6, q10–q13 |
| `incidentes` | A4 Incidentes y cumplimiento | 15 | q8 |
| `servicio` | A5 Estándar de servicio y operación | 20 | q14 |

Dimensiones que no entran:
- **A3 Personal:** se mide sólo con el caso 4, que es presencial.
- **A6 Sistema del lugar:** el diseño la marca como no indispensable y no le asigna ningún instrumento.

`umbralAprobado: 70`, el valor por omisión del brief. El diseño pide no convertir los aciertos en niveles ni inventar cortes de porcentaje. Por eso este umbral es sólo orientativo y lo tiene que confirmar el panel.

Indispensables: **q3 (K3 arqueo) y q8 (K7 alergia)**, que son los que propone el diseño. No se agregaron otros.

### Mapa del diseño a las preguntas, con las claves verificadas

| q | Pieza | Tipo | Clave · tolerancia | Verificación |
|---|---|---|---|---|
| 1 | K1 | numérica | 34 % · ±0.1 | 142,800 ÷ 420,000 = 34.0 % ✔ |
| 2 | K2 | numérica | $16,800 · ±$50 | 142,800 − 126,000 ✔ |
| 3 | K3 | numérica | **−330** pesos · exacto | 3,000 + 18,450 − 10,000 = 11,450; contado 11,120 ✔. El signo codifica sobrante o faltante |
| 4 | K4 | numérica | 26.13 % · ±0.1 | 117,600 ÷ 450,000 = 26.133 % ✔ |
| 5 | K5 (ml) | numérica | 600 ml · ±10 | (10 + 6 − 7) × 1,000 − 168 × 50 ✔ |
| 6 | K5 (%) | numérica | 6.67 % · ±0.1 | 600 ÷ 9,000 = 6.667 % ✔ |
| 7 | K6 | numérica | $8,820 · ±$10 | 13,020 − 4,200 ✔ |
| 8 | K7 | abierta | rúbrica | Ver «Correcciones» |
| 9 | Caso 1 | abierta | rúbrica | Criterios (a), (b), (c), (e) + (d) del diseño |
| 10 | Caso 2 | abierta | rúbrica | Datos, procedimiento, medición, proceso o persona |
| 11 | Caso 3, cálculo | numérica | 1,200 ml · ±10 | (18 + 12 − 14) × 750 − 240 × 45 ✔ |
| 12 | Caso 3, cálculo | numérica | $4,800 · ±$200 | 1,200 ÷ 45 = 26.7 copas × $180 ✔ |
| 13 | Caso 3, razonamiento | abierta | rúbrica | Causas en orden y cómo verificar cada una |
| 14 | Caso 6 | abierta | rúbrica | Lo que debe hacer en los 15 minutos siguientes y al día siguiente |

**Todas las claves del diseño cuadran con sus datos.** K1–K7 y el caso 3 se recalcularon con código.

Ajustes de formato, que no cambian ninguna clave:
- **K4 y K5 (%):** la clave se centró en el valor exacto, 26.13 y 6.67, en lugar del valor redondeado del diseño, 26.1 y 6.7. La tolerancia de ±0.1 se mantiene. Así se aceptan el redondeo y el valor con dos decimales. Además, el 7.1 % que sale de calcular sobre lo registrado queda fuera.
- **K5:** se partió en dos preguntas, porque una pregunta numérica sólo tiene una clave.
- **Caso 3:** el diseño pide la diferencia en ml, copas y pesos, y registrar por separado el cálculo y el razonamiento.
  - Entran ml (q11) y pesos (q12).
  - Las copas son el paso intermedio de los pesos: la banda de ±$200 acepta redondear a 26 o a 27 copas.
  - El 10.0 % queda en la solución de q11, no como pregunta aparte, para no alargar el examen.

Tamaño: con 14 preguntas, el examen se pasa del rango de 10–12 que marca el brief. El encargo fijaba qué piezas entran, y al partir K5 y el cálculo del caso 3 salen 14.

### Por qué esas respuestas modelo son correctas

- **q8 (alergia):** ante una posible anafilaxia, primero se activa a emergencias, no se deja sola a la persona y se pasa la información a los paramédicos. Desde v2 ninguna medida médica se exige (usar su epinefrina es alternativa válida). Esperar a ver si mejora, preguntar antes a cocina o dejarla sola retrasa la atención. Esas tres conductas son los errores críticos.
- **q9 (caso 1):**
  - Lo más urgente son las 8 cancelaciones después de cobrar del mismo usuario, porque son el riesgo de control. Hay que verificarlas antes de acusar a nadie.
  - Las cortesías se revisan para saber quién autorizó qué.
  - El costo se revisa con el chef.
  - Con la venta de la meta, la nómina sería de 26.1 %: la mayor parte de la desviación viene de la venta. Esto corresponde al nivel 4 del diseño.
  - Proponer maquillar cifras u omitir a propósito las cortesías propias es error crítico. Si sólo las omite sin decir nada, no es error.
- **q10 (caso 2):** con faltantes irregulares y un procedimiento débil, primero se revisan los datos y luego se corrige el proceso y se mide. Descontar del salario está fuera de H3: es error crítico en A2, no una alerta de integridad, como dice el diseño.
- **q13 (caso 3):** las causas se ordenan por probabilidad y por lo que cuesta verificarlas: recetas de cocteles en el POS, conteo, cortesías o botellas rotas sin registro, servir sin medidor y, al final, robo.
- **q14 (caso 6):** atender pronto y en persona, sacar el plato correcto, reconocer el aniversario, cubrir a Daniel sin culparlo y corregir el proceso al día siguiente. El gesto económico es opcional. Uno mayor de $800 sin consultar es nivel 2 por facultades, no error crítico.

## Bloque B · competencias (30 preguntas, 5 por eje)

| Eje | Experiencia | Hipotética | Del diseño |
|---|---|---|---|
| Integridad | 5 | 0 | B1 (ronda 1); el dilema B pasado a experiencia (ronda 3); la mitad «reglas parejas» del dilema C pasada a experiencia (ronda 4) |
| Autoconciencia | 5 | 0 | B3, versión alterna (ronda 1) |
| Ética de trabajo | 4 | 1 | Dilema C, mitad «sostener la regla» (ronda 5) |
| Empatía | 4 | 1 | B6, versión alterna (ronda 1); dilema A (ronda 5) |
| Curiosidad | 5 | 0 | — |
| Optimismo | 4 | 1 | B10, versión alterna (ronda 1); dilema D (ronda 5) |

Criterios de redacción:
- Las preguntas de experiencia piden un hecho pasado, de cualquier trabajo o de la vida diaria. Así puede contestar quien ascendió desde el piso.
- No repiten las de la entrevista (B2, B4, B5, B7, B8, B9), que el diseño deja para la etapa 3 porque necesitan repreguntas.
- Una se parece a B5: la de ética de trabajo de la ronda 1 («algo que se iba a retrasar»). Ahí la entrevista profundiza; no la sustituye.
- Curiosidad y optimismo no llevan alertas, como pide el brief.

### Cómo se acomodaron los dilemas (decisiones que conviene revisar)

El encargo pedía meter los dilemas como hipotéticas del eje que corresponde. El brief, en cambio, dice que integridad es toda de experiencia y que cada eje lleva al menos 4 de 5 preguntas de experiencia. Las dos reglas no caben juntas, así que se resolvió así:

- **Dilema B** (el dueño pide no registrar un evento en el POS):
  - Es de integridad, así que no puede ir como hipotética.
  - La revisión dice que es una pregunta obvia y que sirve como detector de alerta. Por eso se pasó a experiencia: «alguien con más autoridad te pidió saltarte un registro, un control o una regla».
  - Las opciones (a) y (d) del diseño, cumplir o pedirlo por escrito y cumplir, quedan en `senalesAlerta`.
  - Negarse sin proponer alternativa cuenta a favor, como dice el diseño.
  - La versión hipotética literal queda disponible para la entrevista.
- **Dilema C** (el mejor capitán llega tarde por tercera vez):
  - La revisión dice que mezcla dos cosas: amonestar y preguntar la causa. Se partió en dos.
  - La mitad «la regla se aplica igual a todos» va como hipotética de **ética de trabajo** (ancla 4: sostiene el estándar en el equipo). El enunciado dice la regla, amonestación por escrito a la tercera llegada tarde, y que amonestar le corresponde al gerente (H1).
  - Preguntar la causa no se exige ni se penaliza.
  - La mitad de integridad (reglas parejas) va como experiencia: «aplicar una regla a alguien que te caía bien».
  - **El diseño ponía C en integridad y empatía. Reclasificarlo es una decisión que debe confirmar el panel.**
- **Dilema A** (el chef y la subgerente se gritan junto al pase): es la hipotética de **empatía**.
  - Siguiendo la revisión, «dejar que sigan y reunirlos mañana» es nivel 1 y queda en `senalesAlerta`.
  - Escalar con seguridad si hay agresión cuenta a favor.
  - Apoyar a quien tiene la razón operativa (la opción c, que valía 3) no se penaliza.
- **Dilema D** (un cliente habitual pide un platillo que ya no está en la carta):
  - Siguiendo la revisión, tiene dos respuestas defendibles: preguntar al chef ahora u ofrecérselo en la próxima visita. Las dos son `senalesPositivas`.
  - El único lugar para hipotéticas en empatía lo ocupa A, así que D pasó a **optimismo**: buscar una solución realista en vez de negarse en seco o prometer de más.
  - **El diseño lo ponía en empatía (cliente). Reclasificarlo es una decisión que debe confirmar el panel.**
- **Formato:** el diseño pedía calificar cada opción de 1 a 4 y comparar con la clave. Como ahora son preguntas abiertas, ya no hay opciones ni pistas por el largo de cada una. Se pierde la medición de distancia a la clave, que de todos modos era tentativa.

## Qué no entra y por qué

| Pieza | Motivo |
|---|---|
| K8 (faltante de $500 de un cajero) | El art. 110 fr. I de la LFT **sí permite** descuentos por pérdidas, con límites y con aceptación del trabajador. La clave necesita revisión de un abogado laboral. Queda en `pendientesOperador` y se sale con 7 piezas K, como sugiere §5.3 |
| Caso 4 (plantilla del fin de semana) | Presencial, etapa 3, en hoja. Además, la revisión señala contradicciones por corregir: Luis cubre 4 turnos contra la regla de 3, y hay una frase del presupuesto que se contradice |
| Caso 5 (incidente de salud) | Presencial, etapa 3, oral: pierde valor si se puede buscar la respuesta |
| B2, B4, B5, B7, B8, B9 | Son de entrevista (etapa 3), con repreguntas |
| Referencias, visita, integración y reporte | Etapa 4 y motor de integración: fuera de la ficha |

## Correcciones aplicadas de la revisión experta

1. **K7 sin opciones:** pasa a pregunta abierta con rúbrica. Así se elimina la pista de que la opción correcta era la más larga.
2. **K8 fuera**, por la revisión legal pendiente.
3. **Dilema A:** «dejar que sigan» es ahora nivel 1, y además es señal de alerta.
4. **Dilema B:** funciona como detector de alerta.
5. **Dilema C:** se partió en dos (ver arriba).
6. **Dilema D:** las dos respuestas defendibles cuentan a favor.
7. **Facultades faltantes:** suspender un platillo, permisos de cancelación en el POS y seguridad o policía quedan como pendientes de operador.

Riesgos de la revisión que la ficha no resuelve:
- Se puede contestar con un chatbot si no hay supervisión.
- El aviso de privacidad (LFPDPPP).
- Las reglas de integración, que dejan a todos en «evidencia insuficiente» tras las etapas 1 y 2.

## Límites conocidos de la ficha (para el front y el calificador)

- **Las etapas no caben en el tipo `ExamenPuesto`.** El diseño separa la etapa 1 (q1–q8 y las preguntas de B1, B3, B6 y B10) de la etapa 2 (q9–q14 y los dilemas).
  - Si el front muestra las 14 preguntas juntas, **q9 da la clave de q1**: dice que el costo fue de 34.0 %.
  - Hace falta mostrar las preguntas por etapa, o aceptar esa fuga.
- **Lo que aportan los casos al bloque B no se califica.** El diseño usa los casos 1, 2 y 6 como criterio de integridad, empatía y optimismo. El tipo sólo permite rúbricas de una dimensión A.
  - Las conductas graves se cubren con errores críticos: maquillar cifras, no informar, exhibir a Daniel.
  - Los niveles del bloque B que vienen de los casos quedan para el motor de integración.
- **Signo en q3:** el calificador toma el último número escrito. Puede fallar en dos casos:
  - «Faltan 330», escrito sin el signo menos, se califica como +330, incorrecto, aunque la idea sea correcta.
  - El signo «−» tipográfico (U+2212) no se lee como negativo.
  - El enunciado pide el guion (-), pero conviene revisar estos casos a mano o ajustar `numerosDe`.
- **Instrucción común del bloque B:** el diseño pide que, si no hay ejemplo, se diga y se cuente la situación más parecida. Esa instrucción no está en cada pregunta: le toca mostrarla al front.

## Decisiones humanas pendientes

1. Que un abogado laboral revise K8. Si no la revisa, se sale con 7 piezas K, como está ahora.
2. Confirmar H1–H6 y definir las tres facultades faltantes: suspender un platillo, permisos del POS, seguridad o policía.
3. Confirmar si K3 y K7 son indispensables.
4. Confirmar los pesos de las dimensiones (30/35/15/20) y el umbral de 70, o decidir que no haya umbral durante el piloto.
5. Confirmar que C pase a ética de trabajo y a una pregunta de experiencia en integridad, y que D pase a optimismo.
6. Decidir cómo se separan las etapas 1 y 2 en el front, por la fuga de q9 a q1.
7. Lo que falta de §5.3: qué ve el reclutador después de la etapa 1, el aviso de privacidad, quién revisa lo que propone la IA y dónde se corre el piloto.

## Ajuste de integración (2026-11-16, Claude)

- **Fuga entre preguntas corregida:** K1, K2, K4 y K7 usan ahora datos de otras
  semanas (K1 32.0 %, K2 $7,600, K4 26.1 %, K7 $5,700), distintos de los del
  caso 1 (q9). Así el caso ya no revela ninguna clave y las 14 preguntas pueden
  mostrarse en una sola etapa. Las claves originales del diseño (34.0 %,
  $16,800, 26.1 %, $8,820) siguen siendo correctas con sus datos; sólo cambió
  el enunciado. La tabla de claves de arriba corresponde al diseño original.
- **Signo de K3:** el calificador lee «faltan 330», «faltante de $330» y el
  menos tipográfico (−) como −330.

## Pendientes para la versión 2 del banco

Todo lo que tocaba enunciado quedó resuelto en la versión 2 (ver abajo). Sigue
abierto, fuera de esta ficha:

- **Competencias:** los anclajes de nivel por eje, la regla de agregación y el
  trato del relato mixto son del calificador de ejes, no de esta ficha.
- **Regla de sanciones:** el banco v2 la declara en cada caso como regla del
  ejercicio, pero sigue siendo hipótesis (H1 + H3) hasta que el operador la
  confirme.

## Revisión de Codex r3 aplicada

Fuente: revisión de bancos de Codex, ronda 3
(`revision_bancos/general_manager.md`), sobre la versión con el ajuste de
integración. No cambió ningún `enunciado` ni ningún `texto` de competencias,
ni el número u orden de preguntas, `tipo` o `eje`.

| Problema | Clase | Qué se hizo |
|---|---|---|
| 1 · P4 y P6: redondeo de claves; P4 aceptaba 26.2 | A | P4: la tolerancia pasa de ±0.1 a ±0.06 alrededor de 26.125. Acepta 26.1, 26.12 y 26.13 y rechaza 26.2. P6 se deja en 6.67 ±0.1: acepta 6.6, 6.7 y 6.67 y rechaza 7.1, como ya documentaba la ficha. |
| 2 · P5–P6 y P11–P13 dependientes; P13 da la pista de los cocteles | B | Anotado en v2 (caso compuesto con arrastre; quitar la pista). |
| 3 · P8: «qué haces primero» contra un mínimo de tres; tres elementos se podían juntar sin emergencias | A (+B, C) | A: `minimoCorrecta` baja de 3 a 2 con `nucleo: ['emergencias']`: llamar y acompañar ya es «correcta», y sin emergencias no lo es. `espera` y `retrasa` siguen exigiendo un acto explícito. B: la redacción «primeros minutos» queda para v2. C: nuevo pendiente para validar el protocolo con un profesional. |
| 4 · P9: `nomina` se acreditaba con solo nombrar el 28 % o el exceso | A (+B) | `nomina` exige separar con una cifra el efecto de la venta del del gasto (117,600 ÷ 450,000 ≈ 26.1 %); nombrar el 28 % o el exceso no basta. B: la nómina previa en pesos queda para v2. |
| 5 · P9: la cortesía propia de $4,500 no era esencial | A | Nuevo esencial `propia`: reconoce ante el dueño la cortesía que autorizó (excede su tope de $800 por mesa) y la documenta sin alterar el registro. El mínimo sigue en 4, ahora de 6. Omitirla resta, pero no es error crítico: `maquilla` sigue pidiendo ocultarla o ajustarla de forma explícita. |
| 6 · P10 y P13: sanciones contradictorias con H1 | A (+B, C) | A: P10 `descuenta` ya no castiga cualquier sanción propia, solo descontar del sueldo (o anunciarlo) o sancionar por el faltante sin probarlo. Una amonestación documentada según H1 no es error. B: unificar la regla en los enunciados en v2. C: nuevo pendiente sobre la matriz de medidas disciplinarias. |
| 7 · H1–H6, permisos del POS, suspensión de platillos y seguridad sin confirmar | C | Ya estaban en `pendientesOperador`. Se califica con el supuesto explícito del ejercicio. Antes de usar el resultado para selección, el operador debe confirmar la matriz. |
| 8 · P12: la solución redondeaba a mitad del cálculo; valor ≠ pérdida | A (+B) | `solucion` usa (1,200 ÷ 45) × 180 = 4,800 exactos, explica qué redondeos acepta la banda (4,680–4,860) y aclara que no es pérdida demostrada ni prueba de robo. La clave no cambia. B: la aclaración en el enunciado queda para v2. P13 ya tenía `concluye_robo`. |
| 9 · Competencias q8 (autoconciencia) sin alerta definida; niveles sin anclaje | A (+B) | A: q8 tiene ahora una sola alerta grave («relata insultos, humillaciones o amenazas y los justifica, sin reparar»), con un comentario: reconocer el error y repararlo no es alerta. B: los anclajes de nivel son del calificador de ejes. |

Claves recalculadas, sin cambios: P1 32 %, P2 $7,600, P3 −$330, P4 26.125 %,
P5 600 ml, P6 6.67 %, P7 $5,700, P11 1,200 ml, P12 $4,800.

## Versión 2 del banco (2026-11-19)

`banco_general_manager_v1` → `banco_general_manager_v2`. Cambia la huella del
práctico: las respuestas guardadas con v1 siguen ligadas a la ficha v1 por su
huella. Competencias **no cambia** (ni texto ni señales): se queda en
`competencias_general_manager_v1`.

Se conservan número, orden, `tipo` y `eje` de todas las preguntas. P1–P5, P7,
P11 y P14 no se tocaron.

Regla de sanciones del ejercicio, dicha igual en q9, q10 y q13 (texto vigente
en v2.1, abajo). Las facultades se declaran en el
caso; ninguna dice qué hacer.

| q | Qué cambió | Por qué |
|---|---|---|
| 6 | Enunciado con dato propio: consumo real 7,500 ml, 450 ml sin registrar. **Clave 6.0 % ± 0.05** (antes 6.67 ± 0.1). Sobre lo registrado, 450 ÷ 7,050 = 6.4 %, queda fuera | Un error en q5 ya no arrastra a q6 |
| 8 | «¿Qué haces primero?» → «¿Qué haces en los primeros minutos?». Esenciales: `emergencias` (núcleo), `acompana`, `paramedicos` (pasar la información). `autoinyector` deja de ser esencial: usar su epinefrina o seguir al operador del 911 es alternativa válida. Mínimo 2 de 3, con núcleo `emergencias`. `espera` reescrito sin términos médicos | La pregunta pedía una acción y la rúbrica varias; las esenciales ya no dependen de un protocolo de primeros auxilios, así que no hace falta validación médica para el piloto |
| 8 (defecto) | `acompana` dice ahora «no deja sola a la persona» y pone de ejemplo «me quedo con el cliente», aclarando que quedarse uno mismo cuenta | En la ronda 3 no se acreditó «Me quedo con el cliente». La regla del calificador «lo que haría sólo en su propia mesa no cuenta» probablemente chocó con el texto anterior |
| 9 | Enunciado: nómina anterior en pesos ($117,500, 26.3 %) y pide separar el efecto de la venta del efecto del gasto. Facultades con la regla de sanciones. `nomina` acepta dos lecturas con cifra: contra la semana anterior (gasto +$100; sube por la venta) o contra la meta (26.1 % con la venta de la meta: ≈1.9 puntos por venta, ≈1.1 por gasto, $5,100 sobre $112,500) | Con el 26.3 % redondeado no se podía demostrar la causa |
| 10 | Enunciado: facultades con la regla de sanciones. `mide` acepta «seguimiento al faltante en cada cierre»; nueva alternativa válida: conteo conjunto y doble firma con seguimiento en cada cierre. `descuenta` incluye suspender | Regla única de sanciones; decisión del operador sobre `mide` (DECISIONES_OPERADOR, Gerente — además) |
| 12 | Enunciado con dato propio: varianza de 900 ml, copa de 45 ml a $180, y dice que es valor a precio de venta, no pérdida demostrada. **Clave $3,600 exacta** (antes $4,800 ± $200): 900 ÷ 45 = 20 copas × $180 | Un error en q11 ya no arrastra; 20 copas exactas, sin redondeo que tolerar |
| 13 | Enunciado sin «La carta incluye cocteles»; pide primero las causas posibles y luego qué revisaría y en qué orden. Facultades con la regla de sanciones. `recetas` abarca cualquier producto que no descuenta las copas (cocteles, botellas, promociones, otro nombre). `concluye_robo` incluye descontar del sueldo | Quitar la pista del primer esencial; regla única de sanciones |

Claves de v2: P1 32 %, P2 $7,600, P3 −$330, P4 26.125 % (±0.06), P5 600 ml,
**P6 6.0 % (±0.05)**, P7 $5,700, P11 1,200 ml, **P12 $3,600 (exacta)**.

`pendientesOperador`: se quitó «validar con un profesional de primeros
auxilios el protocolo de q8» (ya no se exige protocolo) y la pregunta abierta
sobre medidas disciplinarias pasó a «Confirmar la regla de sanciones del banco
v2».

K8 (descuento por faltante, LFT art. 110) sigue fuera.

### v2.1 (revisión de Codex)

Fuente: `tres-puestos/revisor/revision_bancos_v2/general_manager.md`. Se aplicó
antes de que contestara ningún candidato, así que la versión sigue siendo
`banco_general_manager_v2` (la huella del práctico sí cambia).

| q | Clase | Qué cambió |
|---|---|---|
| 9, 10, 13 | B | `REGLA_SANCIONES` ya no dice «sanciones por un faltante sin prueba los decide el dueño», porque eso contradecía no sancionar sin evidencia. Queda: «tú decides amonestaciones documentadas; descuentos al sueldo y suspensiones los decide el dueño. Nadie atribuye responsabilidad ni pide una sanción por un faltante que no esté probado». `descuenta` (q10) y `concluye_robo` (q13) incluyen pedir al dueño que sancione sin prueba; `acusa` (q9) ya era coherente |
| 14 | B | El enunciado dice que esta semana hay margen suficiente dentro del 1 % semanal. Consultar al dueño una cortesía de $800 o menos no suma |
| 14 | A | `nucleo: ['va', 'plato']`. `plato` acepta otra solución acordada con el cliente (otro platillo, retirarlo de la cuenta). Omitirlos baja a parcial; no es error crítico |
| 4 | A | Clave canónica **26.1 ± 0.05** (antes 26.125 ± 0.06): acepta 26.12, 26.125 y 26.13; rechaza 26.0 y 26.2. Cálculo en `solucion` |
| 11, 13 | A | Caso compuesto: q13 se califica con la diferencia dada; el cálculo sólo se califica en q11 y no se vuelve a acreditar en q13 |
| 10 | A | Avisar al dueño no reemplaza investigar ni cambiar el procedimiento; por sí solo no acredita ningún elemento |

Claves v2.1: P1 32 %, P2 $7,600, P3 −$330, **P4 26.1 % (±0.05)**, P5 600 ml,
P6 6.0 % (±0.05), P7 $5,700, P11 1,200 ml, P12 $3,600 (exacta).

No va en la ficha: los anclajes de nivel de competencias, que ya están en el
calificador de ejes. La clase C sigue en `pendientesOperador` y K8 sigue fuera.

Comparado con la ficha v1, lo que un candidato de prueba debe volver a
contestar: práctico con enunciado cambiado 6, 8, 9, 10, 12, 13 y 14; solo
rúbrica 4 y 11. Competencias: ningún texto cambió; la 8 difiere de la ficha v1
sólo en sus señales (alerta de la revisión r3).

### v2.2: supuestos, referencias e indispensables

Instrucciones del dueño (2026-11-19), aplicadas antes de que contestara ningún
candidato.

**1. Las reglas internas son supuestos del ejercicio.** Toda facultad o regla
interna que da el caso dice ahora «Para este ejercicio, supón que…». Ninguna se
presenta como política confirmada de La Llorona. Lo que cuenta como correcta no
cambia, así que la rúbrica no se tocó.

| Dónde | Antes | Ahora |
|---|---|---|
| `FAC_RESULTADOS` (q9) | «Tus facultades en este ejercicio: autorizas…» | «Para este ejercicio, supón que autorizas…» |
| `FAC_CAJA` (q10) | «Tus facultades en este ejercicio: haces arqueos…» | «Para este ejercicio, supón que haces arqueos…» |
| `REGLA_SANCIONES` (q9, q10, q13) | «Sanciones: tú decides…» | «Supón también que tú decides las amonestaciones documentadas…» (va siempre después de un «Para este ejercicio, supón que…») |
| q7 | «La política permite cortesías hasta por el 1 %…» | «Para este ejercicio, supón que la política permite…» |
| q13 | «Tus facultades en este ejercicio: investigas…» | «Para este ejercicio, supón que investigas…» |
| q14 | «Puedes dar cortesías de hasta $800 por mesa…» | «Para este ejercicio, supón que puedes dar cortesías…» |
| Competencias 27 | «El reglamento marca amonestación… y amonestar te corresponde a ti» | «Para este ejercicio, supón que el reglamento marca… y que amonestar te corresponde a ti» |

Las metas del caso («meta de costo 30 %», «meta $450,000») son datos del
ejercicio, no facultades, y se dejan como están.

**2. Conocimiento técnico y legal, aparte de las reglas internas.**
- **q8 (posible reacción alérgica grave).** Lo exigido se limita a lo que dicen
  las guías de primeros auxilios:
  - activar de inmediato a emergencias: en México el número único es el 911
    (Secretariado Ejecutivo del Sistema Nacional de Seguridad Pública, desde
    2017);
  - no dejar sola a la persona;
  - pasar la información a los paramédicos.

  Referencias: Mayo Clinic, «Anaphylaxis: First aid» (llamar al 911 de
  inmediato; epinefrina si la trae); Resuscitation Council UK, «Emergency
  treatment of anaphylaxis» (2021); World Allergy Organization, «Anaphylaxis
  guidance» (2020). La epinefrina y cualquier otra medida médica son
  alternativa válida, nunca exigida. No volví a abrir las páginas en esta
  sesión: antes de publicar, el operador debe comprobar que las referencias
  siguen vigentes.
- **Cálculos (q1–q7, q11, q12).** Son aritmética de control estándar: costo
  como % de la venta, arqueo (fondo + ventas en efectivo − retiros contra lo
  contado) y varianza de barra (inicial + compras − final contra lo vendido).
  No dependen de una norma.
- **Nada laboral.** K8 (LFT art. 110) sigue fuera. Ningún esencial depende de
  interpretar la LFT. Los críticos sobre descuentos al sueldo, como `descuenta`
  en q10 y `concluye_robo` en q13, dependen de la regla del ejercicio (lo decide
  el dueño), no de la ley.

**3. Indispensables (`motivoIndispensable`).** La elección se revisó y no
cambia: siguen q3 y q8, los que propone el diseño.

| q | Motivo |
|---|---|
| 3 (K3 arqueo) | Si no sabe calcular lo que debe haber en caja ni distinguir un faltante de un sobrante, no puede detectar ni investigar faltantes, que es su control de dinero de cada cierre. |
| 8 (K7 alergia) | Si no activa de inmediato a emergencias ante una posible reacción alérgica grave, el cliente puede morir en minutos; el gerente es quien da la primera respuesta en el turno. |

No se agregó ninguna otra pregunta:
- q5, q6, q11 y q12 (varianza) y q1, q2, q4 y q7 (lectura) se corrigen con
  capacitación o con apoyo del sistema. Un error ahí cuesta dinero, pero no es
  un riesgo inmediato e irreversible.
- Los casos abiertos (q9, q10, q13 y q14) miden criterio con varias respuestas
  defendibles. Hacerlos indispensables convertiría un juicio en un corte.

**Comparado con la ficha v1** (`fichas_v1/general_manager_ficha.json`):
- práctico con enunciado cambiado: 6, 7, 8, 9, 10, 12, 13 y 14;
- práctico sólo de rúbrica: 4 y 11 (q3 sólo agrega `motivoIndispensable`, que
  no es rúbrica);
- competencias con texto cambiado: 27;
- competencias sólo de señales: 8.

Claves sin cambio desde v2.1: P1 32 %, P2 $7,600, P3 −$330, P4 26.1 % (±0.05),
P5 600 ml, P6 6.0 % (±0.05), P7 $5,700, P11 1,200 ml, P12 $3,600 (exacta).
