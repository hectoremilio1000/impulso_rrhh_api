# Hostess / anfitrión (`hostess`) — examen v2

Ficha: `app/services/exam_catalog/hostess.ts` · práctico `banco_hostess_v2`
(12 preguntas, 1 numérica) · competencias `competencias_hostess_v1` (24, sin
cambio de texto).
Estado: **provisional** hasta que lo revisen dos operadores.

Fuentes leídas: «Manual de Introducción Barman» de La Llorona (las secciones
de piso que comparte con mesero: «Cómo tomar una reserva», «Cómo acompañar y
ubicar a un cliente», horarios, clientes en estado de ebriedad, objetos
perdidos, pet friendly, organigrama) y «Sesion4_Politica_Dinero.md». No hay
manual propio de hostess de La Llorona en las fuentes del brief (en Drive hay
un «Manual de capacitación Hostess.docx» de 2021-2023 de origen no
confirmado; no se usó).

## Tareas del puesto

- Recibir a cada cliente, confirmar reservas y registrar a quien llega sin reserva.
- Llevar la lista de espera y dar tiempos honestos.
- Asignar mesa por número de personas, disponibilidad, preferencia y carga de meseros.
- Pasar al capitán y al mesero los datos de la mesa (alergias, celebración, necesidades).
- Tomar reservas y contestar consultas por teléfono y WhatsApp.
- Controlar la entrada: ebriedad, accesibilidad, objetos perdidos.

## Facultades

**Decide:** qué mesa libre asigna dentro de las secciones del capitán; orden
de la lista de espera y tiempo que comunica; confirmar y liberar reservas
(tolerancia 15 min); qué contesta por WhatsApp con la información de la casa;
registrar y resguardar objetos perdidos; negar la entrada a consumir a una
persona en estado de ebriedad (supuesto del ejercicio, P11).

**Jerarquía usada en el examen:** la hostess reporta al capitán; el gerente
está por encima del capitán.

**Escala (aquí escalar SÍ merece crédito):** cortesías o cualquier cosa sin
costo (gerente/subgerente, Política de dinero); grupos de 10 o más sin
reserva (visto bueno del capitán, supuesto del ejercicio, P5); persona en estado
de ebriedad que insiste o se pone agresiva (capitán por radio, gerente o
seguridad); cliente molesto que pide compensación (capitán; arriba, gerente).

**No merece crédito:** «le aviso al capitán» en lugar de asignar la mesa,
llevar la lista o contestar el WhatsApp, que son tareas suyas.

**Pendiente de operador:**
- Estancia real de una mesa de 4 un viernes (el examen usa 90 min) y tiempo de montaje (5 min).
- Último horario para reservar (manual: 9 pm) y si sigue vigente «tomamos reservas hasta las 6 pm».
- Quién contesta el WhatsApp de reservas y con qué sistema.

**Supuestos del ejercicio, declarados en el caso como «Para este ejercicio, supón que…»; siguen por confirmar:**
- P2: estancia de 90 min de una mesa de 4 un viernes y 5 min de montaje.
- P5: un grupo de 10 o más sin reserva necesita el visto bueno del capitán.
- P7: se permite traer pastel propio, sin cargo; cocina lo guarda y lo sirve. Lo que la casa regale lo autoriza solo el gerente.
- P8: en la lista de espera se llama al grupo dos veces con 5 min de diferencia; si no contesta pasa el siguiente; si regresa, se le ofrece la siguiente mesa de su tamaño. La tolerancia de 15 min es de reservas.
- P10: la mesa 4, junto a la entrada, es la única sin escalón (en el caso está libre); el baño accesible está en planta baja.
- P11: la hostess puede negar la entrada a consumir y tiene al capitán a la mano por radio.
- P12 (v2.1): los objetos olvidados se anotan en la libreta de objetos olvidados y se guardan en caja.
- Jerarquía: hostess → capitán → gerente (organigrama: Piso, bajo el capitán).

## Práctico — por pregunta

| # | Tarea real | Por qué la respuesta modelo es correcta |
|---|---|---|
| 1 | Reserva y llegada sin reserva a la vez | La mesa apartada es de quien reservó (manual: «chequear la planilla de reservas»); reconocer a la pareja de inmediato y darle una opción real con su espera evita que se sienta ignorada. (v2.2: ya no es indispensable.) |
| 2 (num.) | Estimar espera | Clave 75 min: mesas listas 9:35, 9:55 y 10:15; las dos primeras son de los grupos que ya esperan. Todos los datos están en el enunciado. |
| 3 | Comunicar espera honesta | Decir 10 cuando son 45 genera un cliente molesto a los 15 min; el estándar del manual es informar el tiempo real. Opciones y seguimiento sostienen la espera. (v2.2: ya no es indispensable.) |
| 4 | Asignar mesa por carga y rotación | Ana acaba de recibir dos mesas; Luis está por liberar las suyas. El manual asigna por pax, disponibilidad y preferencia; la carga del mesero completa el criterio. Avisar y actualizar el plano son parte de la asignación. (v2.2: ya no es indispensable.) |
| 5 | Grupo grande sin reserva en pico | v2: el caso dice que 10 o más sin reserva necesita el visto bueno del capitán. Consultar al capitán merece crédito; declinar con amabilidad no rompe la regla. Mover a mesas sentadas o prometer/asignar mesa sin visto bueno son críticos. |
| 6 | Coordinar con capitán una reserva de 12 | La alergia tiene que llegar a cocina y barra por el piso (manual: anotar alergias y pedidos especiales). Verificar el montaje antes de la hora es tarea suya, no del capitán. Indispensable (v2.2). |
| 7 | WhatsApp por escrito | v2: el caso aclara que mide comunicar con los datos dados, no memoria. Reserva máx. 9 pm (10:30 sólo sin reserva y sin garantía), tolerancia 15 min, perro bienvenido, pueden traer su pastel sin cargo (cocina lo guarda y lo sirve). Prometer que la casa regala el pastel es crítico (lo autoriza solo el gerente). Cierra con siguiente paso. (v2.2: ya no es indispensable.) |
| 8 | Lista de espera justa | v2: dos situaciones separadas y la regla de llamadas dada. La mesa de 2 no le servía al grupo de 4: explicarlo y dar estimación. Al primer grupo se le llama una segunda vez a los 5 min; si no contesta, la mesa de 4 pasa al grupo del señor; si regresa, siguiente mesa de 4. Núcleo: `explica` y `pasa_siguiente` (uno por situación). |
| 9 | Cliente molesto en la entrada | Escuchar, buscar la reserva y dar la siguiente mesa con tiempo honesto. Escalar al capitán (jefe directo; gerente también cuenta) si pide compensación. Culparla o prometer lo que no hay es crítico. |
| 10 | Accesibilidad | v2: el caso da la mesa 4 (única sin escalón, libre) y el baño accesible en planta baja. Preguntar en vez de suponer; pasar a la mesa 4 (núcleo); acompañar a su ritmo; avisar al mesero y decir dónde está el baño. Negar o relegar por discapacidad es discriminación (crítico). Indispensable (v2.2). |
| 11 | Persona en estado de ebriedad que quiere entrar | v2: el caso dice que la hostess puede negar la entrada a consumir y tiene al capitán por radio. No dejarlo pasar a consumir (núcleo); avisar al capitán suma pero no se exige. Dejarlo entrar a consumir o usar la fuerza son críticos. Indispensable (v2.2). |
| 12 | Objetos perdidos | v2.1: el caso da la regla (libreta de objetos olvidados y resguardo en caja). Avisar al encargado o al capitán, anotar y guardar en caja; antes de entregar, un dato del objeto dicho sin pistas y que la visita coincida con la mesa 7 y el horario (núcleo). Quedarse con objetos olvidados es baja definitiva; entregar sin verificar es crítico. |

Dimensiones: reservas y espera 30 (1, 2, 3, 8) · asignación 20 (4, 10) ·
coordinación con piso 20 (5, 6) · comunicación con clientes 30 (7, 9, 11, 12).
Umbral 70 (el del brief).

## Competencias

24 preguntas, 4 por eje. Integridad: 4 de experiencia. Los otros ejes: 3 de
experiencia (sirven para cualquier trabajo o la vida diaria) y 1 dilema del
puesto sin la respuesta en el enunciado. Curiosidad y optimismo sin señales
de alerta. Ningún dilema repite un caso del práctico.

## Pendientes para la versión 2 del banco

Los de enunciado (P5, P7, P8, P10, P11) quedaron aplicados en
`banco_hostess_v2` (ver abajo). Queda:

- **Competencias (seis ejes):** reglas para convertir varios relatos e hipótesis en niveles 1–3; anclar suficiente/fuerte a acciones y resultados relatados; «sin evidencia» no es cero; aceptar límites y relevos seguros; alertas solo por conducta grave citada, nunca en curiosidad u optimismo ni por la longitud del relato. Es regla del calificador de competencias (compartido por todos los puestos), no de los textos de esta ficha: no cambia el banco de Hostess.

## Versión 2 del banco (2026-11-19)

`banco_hostess_v2`: cambian los enunciados de P5, P7, P8, P10 y P11 (huella
nueva del práctico); P9 cambia solo la rúbrica. Número, orden, tipo y
dimensión de las 12 preguntas, y los 24 textos de competencias, sin cambio
(`competencias_hostess_v1`, misma huella `24-a64f0ef46089244e`). Huella del
práctico: v1 `12-9d39c3c638c40235` → v2 `12-b091f41fa7aa8338` → v2.1
`12-b19c23a152311271` (nadie contestó la v2 antes de v2.1). Cada regla de la casa va en el
caso como «En este restaurante la regla es…» sin decir qué se califica; sigue
pendiente de confirmar con el operador.

| # | Qué cambió | Por qué |
|---|---|---|
| 5 | Enunciado: grupos de 10 o más sin reserva necesitan el visto bueno del capitán. Rúbrica: `consulta` al capitán (gerente si no está); nuevo crítico `sin_visto_bueno` (prometer o asignar mesa por su cuenta). | El umbral de 10 no estaba dado (revisión r3, problema 4). Con la regla en el caso, romperla es un acto explícito. |
| 7 | Enunciado: aclara que mide comunicar con los datos dados (no memoria); añade la regla del pastel (traerlo sin cargo; cocina lo guarda y lo sirve) y que los regalos los autoriza solo el gerente. Rúbrica: `pastel` pide dar esa regla; nueva alternativa (consultar un detalle con el gerente sin prometer); `promete_cortesia` precisado. | La política del pastel no estaba dada y la pregunta medía uso de datos, no memoria (problema 6). |
| 8 | Enunciado: separa las dos situaciones, pide qué hace con cada una, da la regla de la lista (dos llamadas con 5 min; si no contesta pasa el siguiente; si regresa, siguiente mesa de su tamaño) y aclara que los 15 min son de reservas. Rúbrica: `no_show` y `orden` se reemplazan por `segunda_llamada`, `pasa_siguiente` y `reincorpora`; núcleo `explica` + `pasa_siguiente`. | Dos incidentes mezclados y sin política de llamadas (problema 5). |
| 9 | Solo rúbrica: `escala` nombra al capitán como jefe directo; gerente o subgerente también cuentan. | Jerarquía hostess → capitán → gerente. |
| 10 | Enunciado: la mesa 4, junto a la entrada, es la única sin escalón y está libre; el baño accesible está en planta baja. Rúbrica: `mesa` = mesa 4 (núcleo); nuevo `bano`; `ruta` incluye espacio para la silla; mínimo 4 de 6; alternativa: respetar si el grupo prefiere otra mesa. | Faltaban datos de accesibilidad (problema 7). |
| 11 | Enunciado: la hostess puede negar la entrada a consumir y tiene al capitán por radio. Rúbrica: `escala` (capitán por radio) suma pero no se exige; `lo_sienta` cubre pasarlo a la barra. | La facultad de admisión no estaba dada (problema 3). |

### v2.1 (revisión de Codex)

Entrada: `revision_bancos_v2/hostess.md`. Se aplicó todo lo de clase A
(solo rúbrica) y la clase B de P12 (enunciado). La clase C (vigencia real de
las reglas del ejercicio) queda en `pendientesOperador`. Los anclajes de
nivel de competencias viven en el calificador (`competency_grader.ts`), no en
la ficha: sin cambio aquí. `cambios_v2/hostess.json` compara contra la ficha
v1 de la ronda 3 (`fichas_v1/hostess_ficha.json`); por eso también marca P4,
P6 y la señal de ética 9, que cambiaron en la revisión r3.

| Problema | Clase | Qué se hizo |
|---|---|---|
| P3: correcta sin decir los 45 minutos | A | `nucleo: ['tiempo_real']`; aceptar o confirmar los 10 minutos invalida el elemento. Omitir da parcial, no crítico. |
| P5: `espera_real` pedía calcular sin datos | A | Cuenta preguntar al piso cómo van las mesas y estimar solo si hay con qué; decir con honestidad que aún no puede dar tiempo también vale. No se exigen minutos. |
| P8: «la próxima mesa de 4» y correcta sin segunda llamada | A | `tiempo` pide su lugar real (segundo, detrás de otro grupo) sin garantizar la mesa; `pasa_siguiente` solo cuenta después de la segunda llamada sin respuesta (sigue en el núcleo). |
| P9: prioridad automática; `culpa` castigaba aclarar | A | `solucion`: opción acorde con lo comprobado y lo disponible, sin exigir saltarse la lista. `culpa`: culparla, gritarle, discutir o afirmar un error sin comprobarlo; aclarar con respeto un dato comprobado no es error. |
| P11: crédito por pasar la decisión al capitán | A | `escala` cuenta por coordinarse o pedir apoyo ante insistencia o agresión; pedirle al capitán que decida en su lugar no cuenta. La alternativa ahora es avisar por radio mientras ella niega el paso. |
| P12: reglas internas solo en la rúbrica | B | Enunciado: «En este restaurante la regla es que los objetos olvidados se anotan en la libreta de objetos olvidados y se guardan en caja». `reporta`, `resguardo` y `registro` siguen esa regla; ya no se exige el grupo de temas generales ni el jefe inmediato. |
| P12: verificación sin vínculo con la mesa | A | `verifica`: dato del objeto dicho sin pistas y que la visita coincida con la mesa 7 y el horario; otras pruebas igual de sólidas cuentan. La entrega por el encargado vale solo con la misma comprobación. |
| Vigencia de las reglas del ejercicio | C | Sin cambio: siguen en `pendientesOperador` (se agregó la regla de P12). |

### v2.2: supuestos e indispensables

Instrucciones del dueño (2026-11-19). Huella del práctico v2.2:
`12-ea80f9155a4f012e` (competencias sin cambio, `24-a64f0ef46089244e`).

**1. Redacción de reglas internas.** Todo umbral, autorización, límite o
procedimiento que el caso declara dice ahora «Para este ejercicio, supón
que…» (antes «En este restaurante la regla es…», que sonaba a política
confirmada de La Llorona). Cambian los enunciados de P2 (estancia de 90 min
y montaje de 5 min), P5, P7, P8, P10, P11 y P12. Lo que cuenta como respuesta
correcta no cambia: la rúbrica ya aplicaba el supuesto dado.

**2. Supuestos vs. conocimiento técnico.**

| Pregunta | Qué es | Referencia |
|---|---|---|
| P6 alergia a la nuez | Técnico (inocuidad). Se exige que la alergia llegue a cocina y barra y no prometer «sin nuez» sin confirmarlo con cocina (contacto cruzado). | FDA Food Code 2022, 2-103.11(N): el personal se capacita en alergias alimentarias, y la nuez de árbol está entre los alérgenos mayores (definición «Major food allergen», 1-201.10). |
| P11 persona en evidente estado de ebriedad | Técnico y legal: no servir más alcohol a quien está en evidente estado de ebriedad. La facultad de negar la entrada sola es un supuesto. | Sin referencia legal confirmada: el 2026-11-19 no se encontró el artículo de la Ley de Establecimientos Mercantiles de la CDMX que lo establezca (art. 11 enumera prohibiciones; falta leerlo completo). La rúbrica no depende de la ley: se apoya en el manual de La Llorona («clientes en estado de ebriedad») y en el supuesto del ejercicio. Pendiente de revisión humana antes de citarla. |
| P10 accesibilidad | Técnico (trato y seguridad): preguntar antes de ayudar, no adelantarse, avisar de desniveles. La mesa 4 y el baño en planta baja son supuestos. | Ley General para la Inclusión de las Personas con Discapacidad (no discriminación en servicios); Manual La Llorona, «Cómo acompañar y ubicar a un cliente». |
| P2, P5, P7, P8, P12 | Supuestos internos (tiempos, umbral de 10, horarios, pastel, lista de espera, objetos olvidados). | Ninguna: son supuestos del ejercicio, en `pendientesOperador`. |

No encontré afirmaciones técnicas dudosas en la rúbrica. Las salidas seguras
de P11 (agua, taxi, regresar otro día) son alternativas, no exigencias.

**3. Indispensables (`motivoIndispensable`).** Deben ser las preguntas de
seguridad de personas o de riesgo grave, decididas de antemano:

| # | Antes | Ahora | Motivo |
|---|---|---|---|
| 1 | Sí | No | Reserva y pareja a la vez: es servicio, no seguridad. |
| 3 | Sí | No | Espera honesta: es servicio, no seguridad. |
| 4 | Sí | No | Reparto de mesas: es operación, no seguridad. |
| 6 | No | Sí | Si la alergia no llega a cocina y barra o se minimiza, un cliente puede tener una reacción grave (anafilaxia). |
| 7 | Sí | No | WhatsApp: comunicación; el riesgo de la cortesía ya es error crítico. |
| 10 | No | Sí | Riesgo de caída en el escalón y de trato discriminatorio, prohibido por la ley. |
| 11 | No | Sí | Dejar consumir a una persona en evidente estado de ebriedad, o sacarla con fuerza, pone en riesgo su salud y la de otros y puede exponer al restaurante a una sanción (referencia legal por confirmar). |

P12 (objetos olvidados) queda como no indispensable: el riesgo es de
integridad y ya tiene errores críticos (quedárselo, entregar sin comprobar).

## Revisión de Codex r3 aplicada

Entrada: `revision_bancos/hostess.md` (9 problemas). Enunciados, textos de
competencias, número, orden, tipos y ejes sin cambio (huella igual). Clave de
P2 verificada (mesas listas a 9:35, 9:55 y 10:15 → 75 min).

| Problema | Clase | Qué se hizo |
|---|---|---|
| 1. P6 `omite_alergia` por omisión | A | Ya estaba aplicado en la ficha: el crítico es `resta_alergia` (acto expreso), `nucleo: ['alergia']` y avisar directo a cocina y barra es alternativa. Sin cambio en esta pasada. |
| 2. P12: verificación contradictoria | A | `verifica` precisa el dato independiente (lo describe, lo desbloquea, identificación que coincide con la reserva) y que la chamarra solo se entrega si también la reclama y la acredita; nuevo `registra_entrega`; `nucleo: ['verifica']`; el crítico pide un acto expreso (entrega con solo que diga que es suyo). |
| 3. P11: facultad de admisión | C | Ya pendiente. En la rúbrica: `no_entra` distingue asistencia de consumo; nueva alternativa: llamar al capitán o gerente sin dejarlo pasar a consumir. Dar la facultad en el caso → v2. |
| 4. P5: umbral de 10 no confirmado | C | Ya pendiente. La alternativa de declinar dice ahora a qué elementos equivale. Declarar el umbral en el caso → v2. |
| 5. P8: dos incidentes; tolerancia de lista de espera | B + C | Separar subcasos → v2. Nuevo pendiente: política de llamadas y reincorporación (los 15 minutos son de reservas). |
| 6. P7: políticas locales dadas en el enunciado | C | Horario y pastel ya pendientes; `pastel` ya acepta consultar. Declarar el objetivo → v2. |
| 7. P4 y P10: elementos compuestos; accesibilidad sin datos | A | P4: `avisa` separado de `cumple` (el capitán suma, no se exige). P10: `ruta` separado de `acompana`; `mesa` acepta coordinar con el capitán; `avisa` ya no exige conocer un baño accesible. Mesas accesibles: ya pendiente. |
| 8. P6, P7 y P11 sin núcleo | A | P6 ya tenía `nucleo: ['alergia']`; se añadió `nucleo: ['horario']` (P7) y `nucleo: ['no_entra']` (P11). |
| 9. Competencias sin anclas; ética 9 premia quedarse | A + B | Ética 9: nueva señal positiva (entregar explicado a un relevo vale igual que quedarse). Anclas de nivel → v2. |
