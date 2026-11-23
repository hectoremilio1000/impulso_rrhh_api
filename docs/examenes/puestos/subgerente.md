# Subgerente — qué decide y qué escala

Fuente: Manual de Subgerente de La Llorona y el diseño «Evaluación por puesto».
Estado: **provisional** hasta que lo confirmen dos operadores (pestaña
«Criterio escalar» de las hojas de operadores).

## Decide y hace él (escalar no lo sustituye)

- Abrir y cerrar el turno: contar el fondo, arqueo, entrega por escrito.
- Cubrir faltas: localizar, reasignar secciones, ajustar mesas habilitadas.
- Repartir secciones, capitanes y meseros; redistribuir durante el turno.
- Coordinar cocina y piso: tiempos reales, prioridades, control de entrada.
- Atender primero a un cliente molesto y resolver lo que está en su facultad.
- Cortar el alcohol a un cliente en estado de ebriedad.
- Revisar cancelaciones, cobros y cortesías antes de concluir.

## Escala al gerente (aquí escalar SÍ merece crédito)

- Lo que excede su tope de cortesías o descuentos (p. ej. una cuenta completa gratis).
- Faltantes de caja y cortesías no autorizadas: los documenta y reporta, no los cubre.
- Posible fraude o sanción a un empleado: junta evidencia y deja la decisión al gerente.
- Un cliente que insiste en el gerente después de haber sido atendido.
- Riesgo para personas: seguridad de inmediato, sin esperar al gerente.

## No merece crédito

- «Le aviso al gerente y espero» en una tarea de la lista de arriba.
- Pasarle el caso sin revisar nada cuando la revisión le toca a él.

## Pendientes para la versión 2 del banco

Cambios que tocan el enunciado. No se aplican ahora: las respuestas ya
guardadas quedarían sin banco.

- **P4 y P7 no dan la política de cortesías.** Propuesta: dar en el
  enunciado un tope hipotético (por ejemplo «autorizas cortesías hasta $X por
  mesa»), como en el examen de Gerente, para que exceder el tope se pueda
  juzgar con datos.
- **P7 junta tres casos con un solo mínimo.** Propuesta: separarlos en
  preguntas o subpreguntas con mínimo propio. Mientras tanto, la rúbrica pide
  los tres casos con `nucleo`. En el caso del corte crudo, decir en el
  enunciado qué término pidió el cliente.
- **P8: tres rutas (aceptar, hacer esperar, declinar).** Propuesta: preguntar
  «¿qué decides?» y evaluar cada ruta con sus propios elementos. Si declina
  porque no caben, no debería hacer falta consultar a cocina.
- **Competencias:** los anclajes de nivel por eje, la regla para cinco
  respuestas de un eje y el trato del relato mixto («me pasó… y haría…») son
  del calificador de ejes, no de esta ficha. «Nunca me ha pasado» no debe
  valer cero para todo el eje.

## Revisión de Codex r3 aplicada

Fuente: revisión de bancos de Codex, ronda 3
(`revision_bancos/assistant_manager.md`). El práctico viene de
`practical_rubrics/assistant_manager_v3.ts` y, para P1, P3, P9 y P12, de
`assistant_manager_v2.ts`, que la v3 hereda. Esta rúbrica ya la revisó Codex en
las rondas 1 y 2, así que solo se cambió lo que es claramente un error del
sistema.

Los cambios a P1, P9 y P12 están en la v2, así que también aplican a las
respuestas guardadas con el banco v2. No cambió ningún `enunciado` ni ningún
`texto` de competencias.

| Problema | Clase | Qué se hizo |
|---|---|---|
| 1 · P1, P6, P9 (y P12): errores críticos redactados como omisión («no lo reporta», «deja pasar», «sin dejar constancia») | A | Se reescribieron como actos explícitos: P1 `fondo_sin_contar` (lo da por completo sin contarlo); P6 y P9 `tapa` («dice que no lo va a reportar»); P9 `cortesia_borra`; P12 `arregla_privado`. Si no menciona el reporte, solo pierde ese elemento. |
| 2 · P4: `resuelve` exige sacar el platillo «de inmediato» | A | Ahora vale sacarlo con un tiempo real confirmado, o acordar con la familia otra solución que acepten. Avisar al gerente mientras atiende ya era alternativa. |
| 3 · P4 y P7: tope de cortesías pendiente | C (+A, B) | C: el tope ya estaba en `pendientesOperador`. A: P7 `sin_tope` dejaba como error crítico la omisión «da cortesías sin registrarlas»; ahora exige que lo diga. `promete` (P4) ya era un acto explícito. B: un tope visible en el enunciado queda para v2. |
| 4 · P5: `cuentas` junta el traspaso y el cobro y lo ata al POS | A | Se separa en `cuentas` (traspaso a un responsable concreto, en el sistema u otro relevo verificable, con saldos) y `cobro` (cobrar o asignar quién cobra las dos mesas). El mínimo sigue en 4, ahora de 6. Que la mesera se vaya sin cobrar ya estaba aceptado. |
| 5 · P7: tres casos con un solo mínimo | A (+B) | A: `nucleo: ['crudo', 'cumple', 'demora']`. Sin atender los tres casos no hay «correcta», y política y registro no compensan un caso omitido. B: separar los casos queda para v2. |
| 6 · P8: declinar con un mínimo pensado para aceptar | A (+B) | `equipo` cubre ahora la ruta de declinar o hacer esperar (cuidar las mesas actuales y dar un tiempo actualizado). Declinar ya podía ser «correcta» con `capacidad`, `decision` y `equipo`, sin `cocina`. B: rutas separadas en v2. |
| 7 · P10 y P12: elementos compuestos; facultad de devolución pendiente | A (+C) | P10: se separan `no_ronda` (corta el alcohol), `ofrece`, `escala` (agresión o no coopera) y `transporte`; mínimo 4 de 6 y `nucleo: ['no_ronda']`. P12: `doble_cobro` acepta canalizar la devolución al gerente con seguimiento, y `no_devuelve` aclara que canalizar no es negar. C: la facultad de devolución ya estaba pendiente. |
| 8 · Competencias: sin anclajes ni regla de agregación | B | Es del calificador de ejes, no de esta ficha. Anotado en v2. |

No hay preguntas numéricas. Las diferencias de P6 (+$200) y P9 (−$300) se
comprobaron.
