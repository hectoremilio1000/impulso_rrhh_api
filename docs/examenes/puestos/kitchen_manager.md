# Encargado de cocina / jefe de cocina (`kitchen_manager`): qué decide y qué escala

Ficha: `app/services/exam_catalog/kitchen_manager.ts` (`EXAMEN_KITCHEN_MANAGER`).
Versiones: `banco_kitchen_manager_v2` (desde 2026-11-19; antes `v1`) y
`competencias_kitchen_manager_v1` (sin cambios).

Fuentes: «Manual de capacitación cocinero Cantina La Llorona» (junio de 2021).
Ese manual hace responsable al jefe o encargado de cocina de toda la producción,
de revisar el producto el día que llega (pesar, caducidad, calidad) y de las
mermas, y deja horarios y permisos al gerente. Lo demás es **supuesto
provisional** y está en `facultades.pendientesOperador`. Estado: provisional
hasta que lo confirmen dos operadores.

## Tareas del puesto

Dirige la operación diaria de la cocina en todos los turnos:

- abrir y cerrar la cocina: equipos, temperaturas, producción del día y entrega al siguiente turno;
- armar el horario y repartir estaciones y relevos;
- recibir a los proveedores: pesar y revisar temperatura, calidad y caducidad;
- llevar bitácoras sanitarias con lecturas reales;
- costear recetas (costo por porción y % de costo con el rendimiento real);
- controlar merma e inventario y hacer los pedidos;
- mantener recetas estándar y fichas técnicas y capacitar con ellas;
- atender incidentes: gas, equipo de frío, alergias;
- coordinarse con el gerente y con piso.

## Decide y hace él (escalar no lo sustituye)

- Propuesta de horario semanal; estaciones, tareas y relevos dentro del horario publicado.
- Rechazar mercancía fuera de temperatura, en mal estado o con peso distinto.
- Desechar alimento fuera de temperatura o de vida útil y registrarlo.
- Suspender un platillo por falta de insumo o riesgo, avisando a piso.
- Pedido semanal a proveedores autorizados.
- Aplicar fichas técnicas, corregir y capacitar al equipo.
- Detener un proceso o equipo que pone en riesgo a una persona.

## Escala al gerente (aquí escalar SÍ merece crédito)

- Horarios y permisos (el manual los deja al gerente).
- Faltantes o sospecha de robo: documenta y reporta; investigar y sancionar es del gerente.
- Aumentos de precio, cambio de proveedor, compras fuera de presupuesto, reparaciones.
- Cambios a receta, porción o precio de la carta (al chef o al gerente).
- Pérdidas grandes de producto y emergencias que afectan al salón.

## No merece crédito

- «Le aviso al gerente» en lugar de cubrir una estación, medir una temperatura,
  pesar una entrega o desechar un producto: eso le toca a él.

## Por qué es un examen distinto del de Chef

- **Encargado de cocina** ejecuta y controla el sistema de la cocina **en el
  turno**: que se mida, se pese, se registre, se cubra y se resuelva. Su
  facultad es operativa; no cambia recetas, carta ni precios.
- **Chef** diseña el sistema: decide la carta, las recetas, las porciones y el
  costo objetivo, elige proveedores estratégicos y prepara las auditorías.
- Un buen encargado puede no saber ingeniería de menú, y un buen chef de
  propuestas puede no saber recibir una entrega. Con un solo examen, uno de los
  dos se calificaría con tareas que no son de su puesto.
- Las preguntas no se repiten entre los dos exámenes, ni con Cocinero,
  Subencargado de cocina ni Subgerente: donde un escenario se parecía al de
  Cocinero (mesa fría a 11 °C, alergia al mole) o Subencargado (pollo a 9 °C,
  reparto con un nuevo), aquí se reescribió al nivel de mando (sistema de
  bitácoras, reacción alérgica, patrón de remisiones, rol semanal).

## Bloque A · práctico (12 preguntas; umbral 70)

Dimensiones: operación del turno 20 · inocuidad 35 · costos e inventario 25 ·
equipo y estándares 20. Indispensables (desde v2.2): P1, P7, P8, P9 y P10
(apertura, temperaturas, gas, falla de frío y alergias): son seguridad de
personas o riesgo grave. Ver «v2.2» abajo.

| P | Tarea real | Por qué la respuesta modelo es correcta |
|---|---|---|
| 1 | Apertura con la mesa fría de la línea a 9 °C, cocinero de plancha ausente, bitácora vacía, tortilla sin llegar, reserva de 30 | Lo primero es el riesgo sanitario (no montar crema, queso y salsas en una mesa fuera de rango y mantenerlos fríos de otra forma), después la cobertura y la reserva. La bitácora de anoche no se rellena: un registro inventado es peor que uno vacío. |
| 2 | Método para proponer el horario semanal (más demanda en fin de semana, petición repetida de descanso, ayudante de tarde) | Se piden primero los datos (mínimos por franja, quién domina cada estación, disponibilidad, reglas de jornada); se cubre por demanda, con descanso para todos y una regla pareja para las peticiones. El encargado propone y el gerente aprueba. |
| 3 | Patrón de remisiones firmadas con más peso del recibido | El problema no es la entrega de hoy, sino que se firma sin pesar. Corrige el proceso, reclama con evidencia y no acusa a nadie sin ella. |
| 4 | Costo por porción de la cochinita (numérica, clave $40) | El costo se divide entre el rendimiento real (3 kg), no entre el peso de compra (5 kg): ahí está la merma de cocción y hueso. |
| 5 | % de costo del guacamole (numérica, clave 16.87 %) | Igual que P4, con la merma de limpieza del aguacate; el % se toma sobre el precio sin IVA, que el enunciado da. |
| 6 | Faltante de 4 kg de queso y merma de los lunes (qué hace con cada uno) | Queso: verificar antes de concluir (reconteo, porciones pesadas, recetas del sistema) y dejar la investigación de un posible robo al gerente. Lunes: ajustar la producción del fin de semana y seguir la merma. |
| 7 | Bitácoras con lecturas copiadas y domingos vacíos | Una bitácora sin medición no protege a nadie. Mide hoy, fija quién mide y cuándo, revisa él las bitácoras y reporta al gerente sin rellenar lo que no se midió. |
| 8 | Corte de gas con olor en pleno servicio | Primero las personas (cerrar llave, sin chispas, ventilar, evacuar, emergencias); después el servicio con lo que se puede sacar sin gas. No se reenciende hasta descartar la fuga. |
| 9 | Cámara a 12 °C; última lectura 3 °C al cierre de las 11:30 | Son 8 horas y media sin lectura: no se puede demostrar que estuvo menos de 4 horas arriba de 4 °C, así que lo de alto riesgo (cocidos, lácteos, salsas, pollo) no se usa; se desecha y registra, o lo de alto valor se aparta hasta que el gerente autorice. Recalentar no elimina las toxinas. |
| 10 | Clienta alérgica al cacahuate con síntomas después de comer | Los síntomas de garganta pueden ser anafilaxia: primero ayuda médica. Después se conserva la evidencia, se busca el origen del contacto y se corrige para el resto del servicio. |
| 11 | La cochinita sale distinta entre turnos | La causa es que se aprende de oídas. Ficha completa a la vista, capacitación con la ficha y comprobación en los días siguientes. Si la versión de la noche es mejor, se propone; no se cambia por su cuenta. |
| 12 | Pedido semanal con evento, cámara llena, aumento del 15 % y tope de $3,000 | Método: conteo físico, consumo normal y evento por persona, PEPS y entregas escalonadas por falta de espacio. El aumento y lo que pase de $3,000 van al gerente. |

Errores críticos (dicen lo que la persona HACE): montar producto en una mesa
fría fuera de rango sin otra forma de enfriarlo; autorizar o partir una compra
que sabe que pasa del tope;
inventar o rellenar lecturas; recibir producto fuera de temperatura o firmar sin
pesar; maquillar el inventario; acusar sin evidencia; reencender con olor a gas;
servir lo que estuvo fuera de temperatura; servir cacahuate a una alérgica o
minimizar sus síntomas; tirar la evidencia; dejar a alguien sin descanso o al
nuevo solo en una estación en el pico.

## Bloque B · competencias (30 preguntas, 5 por eje)

- Integridad: 5 de experiencia. Los demás ejes: 4 de experiencia y 1 hipotética.
- Las preguntas de experiencia sirven en cualquier trabajo o en la vida diaria,
  para no castigar a quien asciende desde cocinero o viene de otro giro.
- Las hipotéticas son dilemas del puesto:
  - error propio en el pedido;
  - termómetro descompuesto sin supervisión;
  - burlas a un ayudante;
  - merma que sube sin que nadie se queje;
  - equipo desanimado tras una revisión.
- Curiosidad y optimismo no tienen señales de alerta.
- Dos preguntas que coincidían casi palabra por palabra con Cocinero y con
  Mesero/Capitán se reescribieron.

## Pendientes de operador

Ver `facultades.pendientesOperador` en la ficha. Lo que el banco v2 declara
como «regla de este ejercicio» deja clara la pregunta, pero sigue siendo un
supuesto hasta que un operador lo confirme:
- quién está por encima del encargado (el examen dice: reporta al gerente);
- temperaturas y regla de tiempo de la casa (el examen dice: 4 °C, −18 °C,
  60 °C; más de 4 horas arriba de 4 °C se desecha);
- datos ilustrativos de P4 y P5;
- tope de compra (el examen dice: $3,000) y si el pedido semanal normal cuenta
  contra ese tope;
- matriz de alérgenos;
- quién arma el horario (el examen dice: el encargado propone, el gerente
  aprueba);
- quién autoriza el desecho de alto valor y la reposición urgente (el examen
  dice: el gerente) y qué cuenta como «alto valor»;
- vigencia del manual de 2021;
- umbral de aprobado.

## Pendientes para la versión 2 del banco

Todos se aplicaron en la versión 2 (ver abajo). Queda abierto, para una
versión futura, lo que no toca enunciado: anclajes de nivel por eje y regla
para respuestas mixtas (son del calificador de ejes, no de esta ficha).

## Revisión de Codex r3 aplicada

Fuente: revisión de bancos de Codex, ronda 3
(`revision_bancos/kitchen_manager.md`). No cambió ningún `enunciado` ni
ningún `texto` de competencias, ni el número u orden de preguntas, `tipo` o
`eje`. La huella del banco no cambia.

| Problema | Clase | Qué se hizo |
|---|---|---|
| 1 · P1 y P9 duplican la cámara fuera de rango; 4/7 °C y tiempo fuera de frío pendientes | B (+A, C) | B: anotado en v2. A: en P9 se acepta inmovilizar lo de historia desconocida mientras se decide con evidencia (alternativa). C: la temperatura y el tiempo ya estaban en `pendientesOperador`. |
| 2 · P2 sin datos para un horario concreto; quién arma y quién aprueba | B (+C) | B: anotado en v2. C: «quién arma y quién aprueba» ya estaba pendiente. |
| 3 · P3 `reclama` imputa al proveedor sin conciliar | A | `reclama` ahora pide conciliar remisiones contra consumos, mermas y movimientos, y reclamar solo las diferencias demostradas. |
| 4 · P6 mezcla dos casos; «revisar porciones» no es pesar | B (+A) | B: separar los casos en v2. A: `porcion` exige pesar físicamente; la revisión documental cuenta en `verifica`. |
| 5 · P7 `reporta` afirma que se inventaron las lecturas antes de corroborarlo | A | `reporta` ahora pide informar la inconsistencia con su evidencia, sin afirmar falsificación hasta corroborarla. Se acepta como alternativa dejar los domingos en blanco con una nota. |
| 6 · P8 obliga a cerrar el gas sin condición de seguridad; la salida depende de que siga el olor; las comandas podrían sostenerse en la zona de riesgo | A | `llave`: cerrar solo si es seguro y sabe cómo; sin chispas. `personas`: evacuar sin esperar y pedir ayuda desde un lugar seguro. `comandas`: solo fuera del área de riesgo. `nucleo: ['personas']`. |
| 7 · P9 la alternativa de 4 °C al centro parece suficiente; falta quién autoriza desechar lo de alto valor | A + C | A: la alternativa exige evidencia de frío seguro del lote; una lectura al centro no basta. C: nuevo pendiente sobre quién autoriza el desecho de alto valor y la reposición fuera del tope. |
| 8 · P10 «correcta» posible sin activar la emergencia | A | `nucleo: ['emergencia']`. `conserva` incluye los ingredientes usados. Los errores críticos ya exigían minimizar o esperar de forma explícita. |
| 9 · P12 `cantidades` exige cifras sin datos; `precio` obliga a cotizar | A (+B, C) | `cantidades` evalúa el método, sin cifras. `precio` pide escalar el aumento con su efecto. Cotizar con otro proveedor y las entregas parciales pasan a alternativas. B: datos para cifras en v2. C: el tope de gasto ya estaba pendiente. |
| 10 · Competencias q15 «control alterno» indefinido; ejes sin anclajes de nivel | A (+B) | A: la señal positiva de q15 dice ahora que no libera pollo sin poder comprobar la cocción, o que usa un control ya autorizado. B: los anclajes de nivel por eje y la regla para respuestas mixtas son del calificador de ejes, no de esta ficha. Quedan para v2. |

Las claves de P4 ($40) y P5 (16.87 %) se volvieron a calcular y coinciden.

## Versión 2 del banco (2026-11-19)

`banco_kitchen_manager_v1` → `banco_kitchen_manager_v2`. Cambian 6 enunciados
del práctico (P10 se sumó en la v2.1, abajo); el texto de competencias no
cambia (`competencias_kitchen_manager_v1`; solo una señal de q15).
Número, orden, `tipo` y `eje` de todas las preguntas se conservan. P4 ($40) y
P5 (16.87 %) no cambian.

Huellas: práctico v1 `12-20c689a926f08217` → v2.2 `12-cf0ca5b4970972f0`
(las intermedias `12-21a9044997fed50a` y `12-56c802ce9e63c60c` no llegaron a
contestarse); competencias `30-720e5f4d53e6ca67` (igual); rúbrica
`4-bd51ae2b9850f228` → `4-ac965e7e717ce920`. Las respuestas guardadas con la huella v1 quedan en
«requiere revisión» (`bank_mismatch`); no se recalifican con la rúbrica v2.

Reglas que el caso declara como «regla de este ejercicio» (siguen pendientes
de confirmar con el operador): refrigeración a 4 °C o menos (más estricta que
el máximo de 7 °C de la NOM-251; citar la NOM no resta si se aplica la regla
del caso), más de 4 horas arriba de 4 °C se desecha, el encargado reporta al
gerente, el gerente autoriza el desecho de alto valor y la reposición urgente
fuera del pedido normal, el encargado autoriza compras hasta $3,000. La
congelación a −18 °C y el caliente a 60 °C no se declaran porque ninguna
pregunta depende de ellos.

| P | Qué cambió | Por qué |
|---|---|---|
| 1 | Enunciado: la falla de apertura ya no es la cámara sino la mesa fría de la línea a 9 °C (vacía; la cámara marca 3 °C). Se declaran la regla de 4 °C, la de 4 horas y que reporta al gerente. Rúbrica: `camara` → `mesa_fria` (revisar, técnico); `producto` ahora es no montar en la mesa fuera de rango y enfriar de otra forma, y es `nucleo`. Error crítico `usa_sin_medir` → `monta_fuera_de_rango`. Alternativa: citar la NOM no resta. | P1 y P9 duplicaban la cámara fuera de rango con historia desconocida. |
| 2 | Enunciado: pide el método («cómo lo armas y qué datos necesitas») y dice que el encargado propone y el gerente aprueba. Rúbrica: nuevo esencial `datos`; `publica` habla de la propuesta; alternativa: un horario de ejemplo con supuestos declarados. El error crítico ahora es «propone dejar a alguien sin descanso». | El caso no da datos para un horario concreto, y quién arma y quién aprueba estaba sin definir. |
| 6 | Enunciado: pide qué hace con cada caso y declara que reporta al gerente. Rúbrica: `verifica` (queso) y `lunes` son `nucleo`, para que «correcta» atienda los dos casos; `registro` incluye seguir la merma; alternativa de aprovechar sobrante solo con receta autorizada. | Mezclaba dos casos sin pedir que se atendieran los dos. |
| 9 | Enunciado: da la última lectura (3 °C al cierre de las 11:30) y declara las reglas de 4 °C y 4 horas y que el gerente autoriza el desecho de alto valor y la reposición urgente. Rúbrica: `tiempo` acota la ventana con la bitácora (8 h y media sin lectura); `desecha` (`nucleo`) acepta apartar lo de alto valor hasta que el gerente autorice; `gerente` pide esa autorización con evidencia; `carta` arma la lista de reposición; el error crítico se mide contra la regla de 4 horas. Alternativa: citar la NOM no resta. | Sin hora de cierre ni última lectura había que adivinar; faltaba quién autoriza el desecho de alto valor. |
| 12 | Enunciado: pide el método (sin cifras) y declara el tope de $3,000. Rúbrica: `cantidades` es `nucleo`; nuevo esencial `tope`; nuevo error crítico `rebasa_tope` (solo por un acto explícito: autorizar algo que sabe que pasa del tope, o partirlo para no pasarlo al gerente); alternativa: cifras de ejemplo con supuestos declarados. | El caso no da consumo, porciones ni inventario, y el tope de gasto estaba sin definir. |

Sin cambio de enunciado: P3, P4, P5, P7, P8 (se mantiene la prioridad de
alejar a las personas y pedir ayuda desde un lugar seguro), P10 y P11, y las
30 preguntas de competencias.

### v2.1 (revisión de Codex)

Fuente: `revisor/revision_bancos_v2/kitchen_manager.md`. Se aplicó antes de
que cualquier candidato contestara la v2, así que la versión sigue siendo
`banco_kitchen_manager_v2`. Número, orden, `tipo` y `eje` no cambian. Los
errores críticos siguen siendo actos explícitos.

| P | Clase | Qué se hizo |
|---|---|---|
| 1 | A | `plancha`: cubrir con el equipo del turno; llamar a alguien en su descanso cuenta solo con autorización del gerente. `tortilla`: comprar solo con proveedor autorizado, dentro de lo que puede autorizar o con visto bueno del gerente. Reasignar estaciones no requiere escalar. |
| 6 | A | `registro` se separa: registrar con evidencia la merma que ocurra (la del queso solo si se demuestra; el faltante queda sin justificar mientras se investiga). Nuevo esencial `seguimiento` (medir si baja la merma de los lunes). |
| 7 | A | La alternativa de los domingos: nota fechada «sin registro; medición no corroborada»; afirmar que no se midió solo después de comprobarlo. |
| 9 | A | Comparador alineado con la regla («no pasó más de 4 horas») en `tiempo` y en el crítico `sirve`. La alternativa de carnes exige evidencia de conservación conforme a la regla (la lectura de hoy no reconstruye 8 h y media; el visto bueno del gerente no la sustituye). `traslada` equivale a mantener todo apartado y rotulado en frío si nada es demostrablemente rescatable. |
| 10 | B | Enunciado: «¿Qué haces de inmediato y qué haces después de activar la atención?». Esenciales marcados por fase («De inmediato:» emergencia y conserva; «Después:» causa, resto, registro y proceso), sin enumerarlos en la pregunta. `emergencia` sigue como `nucleo`; lo que falte del seguimiento solo baja puntos, nunca es crítico. |
| Competencias q15 | A | El control alterno cuenta solo si explica cómo comprueba con él el estándar de cocción; no basta nombrarlo. |
| Anclajes de nivel por eje | — | No van en la ficha: ya están en el calificador de ejes. |
| Facultades y políticas (frío, tope, alto valor) | C | Siguen en `pendientesOperador`: umbral de «alto valor» y si el pedido normal cuenta contra el tope de $3,000. |

Contra la ficha v1 (`fichas_v1/kitchen_manager_ficha.json`, que es anterior a
la revisión r3): cambia el enunciado de P1, P2, P6, P9, P10 y P12; solo la
rúbrica de P3, P7 y P8 (P3 y P8 por la revisión r3); solo las señales de
competencias q15.

### v2.2: supuestos, referencias e indispensables

Instrucción del dueño (2026-11-19). Se aplicó antes de que cualquier
candidato contestara, así que la versión sigue en `banco_kitchen_manager_v2`.
Número, orden, `tipo` y `eje` no cambian.

**1. Reglas internas = supuestos.** Toda regla de la casa que declara el caso
dice ahora «Para este ejercicio, supón que…», nunca algo que suene a política
confirmada de La Llorona:

- P1: el límite de 4 °C (más estricto que la NOM), el de 4 horas y que se
  reporta al gerente.
- P2: el encargado arma la propuesta y el gerente la aprueba.
- P6: se reporta al gerente.
- P9: el límite de 4 °C, el de 4 horas, que se reporta al gerente y que él
  autoriza el desecho de alto valor y la reposición urgente.
- P12: tope de compra de $3,000.

Siguen siendo pendientes de operador (`facultades.pendientesOperador`).

**2. Conocimiento técnico y su referencia.**

| Tema | Lo que usa el examen | Referencia | Cómo se califica |
|---|---|---|---|
| Refrigeración | Supuesto de esta cocina: 4 °C o menos | NOM-251-SSA1-2009 (prácticas de higiene para alimentos): refrigeración ≤ 7 °C, congelación ≤ −18 °C, caliente ≥ 60 °C | Se presenta como supuesto más estricto que la NOM. Aplicar los 7 °C de la NOM no resta: en P1 (9 °C) y P9 (12 °C) el equipo está fuera de rango con los dos límites. |
| 4 horas fuera de temperatura | Supuesto: lo que pasa más de 4 horas arriba de 4 °C se desecha | No es de la NOM-251. Viene del FDA Food Code (2022), 3-501.19 «Time as a Public Health Control»: alimento retirado del control de temperatura se usa o desecha a las 4 horas; allí el frío es 5 °C (41 °F) y el conteo empieza al sacarlo del control, no al pasar de 4 °C | Se presenta como supuesto del ejercicio. La rúbrica solo pide ver que, con 8 h y media sin registro, no se puede demostrar que estuvo 4 horas o menos fuera de rango. |
| Fuga de gas (P8) | No hacer chispas; cerrar la llave solo si es seguro y sabe cómo; ventilar; alejar a las personas y pedir ayuda desde un lugar seguro; no reabrir sin revisión | Recomendaciones de protección civil para fugas de gas LP o natural (Coordinación Nacional de Protección Civil / CENAPRED): no accionar interruptores ni flamas, cerrar la llave de paso, abrir puertas y ventanas, salir y llamar al 911 desde fuera | Sin cambio: `personas` es `nucleo`; cerrar la llave ya estaba condicionado a que sea seguro. |
| Alergia con síntomas de garganta (P10) | Posible anafilaxia: ayuda médica de inmediato | Guías de anafilaxia de la World Allergy Organization (WAO, 2020): reconocimiento temprano, llamar a emergencias y adrenalina intramuscular como primer tratamiento | Sin cambio en lo exigido (`emergencia` es `nucleo`). Ayudar a usar el autoinyector de la clienta, si lo trae, pasa a alternativa válida: no se exige, porque el encargado no tiene por qué saberlo ni tenerlo. |

Congelación (−18 °C) y caliente (60 °C) no aparecen en ninguna pregunta.

**3. Indispensables y `motivoIndispensable`.** Criterio: seguridad de
personas o riesgo grave, decidido de antemano.

| P | Antes | Ahora | Motivo |
|---|---|---|---|
| 1 | sí | sí | Sin ordenar la apertura por riesgo, se abre sirviendo crema, queso o salsas sin frío seguro. |
| 3 | sí | **no** | El caso es de peso firmado de más: es un riesgo de dinero, no de seguridad. La revisión de temperatura al recibir es un esencial, pero no el centro del caso. |
| 7 | sí | sí | Con bitácoras sin lecturas reales, un equipo de frío descompuesto puede pasar días sin detectarse. |
| 8 | no | **sí** | Ante olor a gas, mantener al equipo o hacer chispa pone en riesgo vidas (explosión, incendio, intoxicación). |
| 9 | no | **sí** | Sin decidir con la evidencia qué se desecha tras una falla de frío, se puede servir alimento de alto riesgo y causar una intoxicación. |
| 10 | sí | sí | Sin reconocer una posible anafilaxia y pedir ayuda de inmediato, la clienta puede morir. |

**4. Rúbrica.** Solo cambian las alternativas: la de la NOM en P1 y P9 ahora
dice «aplicar los 7 °C en lugar del supuesto de 4 °C no resta», y P10 suma
la del autoinyector. Ningún error crítico ni núcleo cambia.
