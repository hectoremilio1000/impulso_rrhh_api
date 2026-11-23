# Mesero (`waiter`): tareas, facultades y por qué de cada pregunta

Ficha: `app/services/exam_catalog/waiter.ts` · práctico `banco_waiter_v1`
(11 preguntas, 1 numérica) · competencias `competencias_waiter_v1` (24).
Umbral de aprobado: 70.

Fuentes: «Manual de Introducción Mesero y Capitan» (La Llorona) y
«Sesion4_Politica_Dinero.md». Estado: **provisional** hasta que lo confirmen
dos operadores.

## Qué cambia respecto al banco anterior (`10-9ad52a41e44e1391`)

- Se quitaron las tareas de Capitán (P7–P9 anteriores, que eran de supervisión).
- La captura es en el POS, no en una comanda de papel.
- Se agregaron alergias (P2), alcohol responsable (P3 y P4), cuenta dividida
  (P1, numérica), tequila y mezcal (P6) y captura en el POS (P5).
- Integridad ahora son 4 preguntas de experiencia, no hipotéticas.

## Tareas del puesto

1. Montar su sección según el checklist de apertura.
2. Recibir la mesa: presentarse con la carta en 5 minutos como máximo y tomar
   las bebidas en 4 minutos como máximo (Manual).
3. Seguir la secuencia: orden, repetirla, capturar, entregar, chequeo de
   satisfacción después del primer bocado, refill, retiro, postre y café,
   cuenta y despedida.
4. Capturar todo en el POS antes de llevarlo («prohibido llevar algo a la mesa
   que no haya sido ingresado al sistema»).
5. Alergias y restricciones: preguntarlas, anotarlas y confirmarlas.
6. Alcohol responsable: mayoría de edad y ebriedad.
7. Carta y venta sugerida (técnicas del manual: upselling, complementarios,
   adicionales, sugestiva), sin presionar.
8. Revisar la precuenta y calcular la cuenta dividida.
9. Atender la primera queja de su mesa.

## Facultades

**Decide él:** el ritmo de su sección; qué recomendar; no servir alcohol a un
menor o a una persona ebria (y avisar); capturar, repetir la orden y revisar la
precuenta; ofrecer el cambio de un platillo.

**Escala (aquí escalar SÍ merece crédito):**
- Cancelaciones, descuentos y cortesías: el mesero solo solicita (Política de dinero).
- Productos de más o de menos en la precuenta: al jefe de turno (Manual).
- Cobro: subgerente o gerente; el capitán con su autorización (Manual).
- Cliente ebrio que no acepta retirarse: al gerente (Manual, PF 7).
- Pedido fuera de carta: jefe de cocina, de barra o gerente (Manual, PF 10).

**No merece crédito:** pasar al encargado lo que es suyo: preguntar por
alergias, capturar, revisar la precuenta o recibir a la mesa.

**Pendiente de operador:** ver `facultades.pendientesOperador` en la ficha
(identificación aceptada, si puede dejar de servir alcohol por su cuenta, quién
divide la cuenta en el POS, cómo se marca una alergia, la carta real de
destilados, comanda manual o POS, reseñas).

## Indispensables (primer día)

P2 (alergia), P3 (menor de edad), P5 (captura de la orden) y P8 (secuencia
con varias mesas). Sin eso no puede atender una sección sin poner en riesgo a
un cliente o al restaurante.

## Por pregunta

| P | Tarea real | Por qué la respuesta modelo es correcta |
|---|---|---|
| 1 (numérica, $615) | Cuenta dividida | Lo compartido se reparte entre 4 (340 / 4 = 85) y se suma a lo propio (230 + 300). La propina se excluye porque es voluntaria. Los precios son del caso, no de la carta. |
| 2 | Alergia al cacahuate | El mole suele llevar cacahuate: afirmar que es seguro sin cocina es el error que lastima a un cliente. El manual pide anotar alergias en la orden; la posición permite que el plato llegue a la persona correcta. |
| 3 | Mayoría de edad | Vender alcohol a un menor está prohibido. Lo correcto es pedir identificación antes de servir y, sin ella, no servirle a esa persona, con amabilidad. Qué identificación se acepta es pendiente. |
| 4 | Cliente ebrio | El manual (PF 7): se le lleva la cuenta y se le invita a retirarse; si no accede, gerente. No servirle y hacerlo con discreción evita el riesgo y el conflicto. |
| 5 | Captura de la orden | Manual: repetir la orden, capturarla con posición, que la cantidad cuadre con las personas y enviarla de inmediato. Los cambios al platillo (término, sin crema) son el error típico en cocina. |
| 6 | Tequila y mezcal | Datos verificables: el tequila solo usa agave azul (tequilana Weber) dentro de su denominación de origen; el mezcal admite varios agaves y el horno de tierra da el ahumado. La recomendación parte de preguntar el gusto (manual: hospitalidad «por lo que es» cada cliente). |
| 7 | Platillo que no gustó | Manual (PF 1): nadie paga lo que no le gusta; se ofrece cambiar o cancelar «con el encargado en turno». La cancelación no es facultad del mesero (Política de dinero). |
| 8 | Tres mesas a la vez | Manual: presentarse en 5 minutos como máximo y tomar las bebidas en 4 minutos como máximo; usar los datos de la reserva (nombre, alergias, celebración). Pedir apoyo es correcto si no alcanza. |
| 9 | Precuenta con errores | Manual: si faltan productos se agregan e informa al jefe de turno; si sobran, se informa para resolverlo. Cobrar de más o regalar el postre son faltas de dinero en direcciones opuestas. |
| 10 | Pedido fuera de carta | Manual (PF 10): consultar, regresar con precio y tiempo, y que el producto se dé de alta en el sistema antes de prepararlo. |
| 11 | Venta sugerida | Las cuatro técnicas del manual en su momento (entrada al ordenar, bebida al cuarto de vaso, postre al retirar, café con postre). La honestidad se califica: respetar un no. |

## Competencias

24 preguntas, 4 por eje. Integridad: 4 de experiencia (dinero de más, error no
notado, encubrir a alguien, objeto encontrado). Los demás ejes: 3 de
experiencia redactadas para cualquier trabajo o la vida diaria, y 1
hipotética del puesto. Curiosidad y optimismo sin señales de alerta.

## Pendientes para la versión 2 del banco

Cambian el enunciado; no se aplican en `banco_waiter_v1` para no dejar sin
banco las respuestas guardadas.

- **P2:** publicar antes de evaluar qué controles son obligatorios (confirmar con cocina y registrar la alergia) y cuáles complementarios.
- **P3 y P4:** dar como dato del caso qué identificaciones acepta la casa y que el mesero puede suspender el alcohol de forma preventiva y avisar.
- **P5:** aclarar en el caso el flujo válido (libreta → captura → envío) y pedir «coteja la orden capturada contra la que repetiste».
- **P6:** adjuntar una minicarta de tres o cuatro destilados con precio para que «recomienda» se pueda comprobar.
- **P7 y P9:** pedir de forma expresa quién hace cada paso (quién solicita, quién autoriza y quién ejecuta en el POS).
- **P8:** reducir el caso a una secuencia breve de decisiones (qué haces primero, segundo y tercero) con un crédito por cada necesidad.
- **P11:** pedir de forma expresa «en qué momento, qué ofreces y qué haces si te dicen que no».
- **Competencias 8, 12, 16 y 20:** se repiten con el práctico (sobrecarga de mesas, cierre, señora que tarda en pedir, mezcal desconocido). Usar casos distintos o no aplicar los dos bloques juntos, no contar la misma respuesta como dos evidencias y definir anclas de nivel 1/2/3 por eje (relato, criterio declarado, sin evidencia).

## Revisión de Codex r3 aplicada

Entrada: `revision_bancos/waiter.md` (8 problemas). Enunciados, textos de
competencias, número, orden, tipos y ejes sin cambio (huella igual).

| Problema | Clase | Qué se hizo |
|---|---|---|
| 1. P2 `no_registra` por omisión; se puede sacar «correcta» sin un control de seguridad | A | El error crítico ahora pide un acto expreso (dice que manda la orden sin anotar la alergia o que no hace falta avisar). `nucleo: ['consulta_cocina', 'registra']`. Publicar la regla → v2. |
| 2. P3 y P4: facultades de alcohol no confirmadas | C | Ya estaban en `pendientesOperador` (identificación aceptada; si puede dejar de servir solo). En la rúbrica: `pide_id` ya no exige un documento concreto; nueva alternativa en P4: no servirle mientras avisa al encargado para que decida. `nucleo` `no_sirve_menor` (P3) y `no_sirve` (P4). Dar la política en el caso → v2. |
| 3. P5 `cuadra_pax` iguala platos con personas | A | El esencial ahora coteja cantidades y cambios contra la orden repetida, sin exigir un platillo por persona. Comanda manual o POS: ya pendiente. |
| 4. P6: precio sin carta; tequila y mezcal compuestos | A | `tequila` y `mezcal` piden al menos un rasgo correcto cada uno; `recomienda` ya no exige el precio; la alternativa de categorías por reposo dice a qué elemento cuenta. Minicarta → v2. |
| 5. P7 y P9: quién corrige, autoriza y ejecuta | A | Las facultades dicen ahora: de menos los agrega e informa; de más los informa y el encargado cancela. `cancela_solo` (P7 y P9) sólo con un acto expreso («lo corrijo» sin más no cuenta). Pedir quién hace cada paso → v2. |
| 6. P8: `necesidades` compuesto; alternativa contraria a `bebidas` | A | `necesidades` se separó en `bebe` (21) y `reserva` (22; ya no exige alergias, que el caso no da). `bebidas` acepta tomar enseguida la orden completa de la 23 si no deja a las otras sin carta ni bebidas; nueva alternativa equivalente con apoyo. Mínimo 4 de 6. |
| 7. P11: cuarto de vaso, descripción atractiva y respetar un no no pedidos | A | `adicional` ya no exige describir; `bebida` ya no exige la fracción del vaso. Con los cuatro momentos se llega a «correcta» (mínimo 4 de 5) sin `respeta_no`. Pedirlo en el enunciado → v2. |
| 8. Competencias que repiten el práctico; sin anclas de nivel | B | Anotado en «Pendientes para la versión 2 del banco». |
