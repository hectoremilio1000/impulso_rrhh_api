# Barman / bartender (`barman`) — examen v1

Ficha: `app/services/exam_catalog/barman.ts` · práctico `banco_barman_v1`
(12 preguntas, 1 numérica) · competencias `competencias_barman_v1` (24).
Estado: **provisional** hasta que lo revisen dos operadores.

Fuentes leídas: «Manual de Introducción Barman» de La Llorona,
«Sesion4_Politica_Dinero.md» y la hoja «recetario_completo_barra_23_06_26»
(Drive). Del recetario sólo se usan datos que **van escritos en el
enunciado** (copa 60 ml, botella 700 ml, 45 ml de Llorona Espadín por Margara
Sagrada): ninguna pregunta califica saber la receta de memoria.

Corrige los defectos del banco anterior (diagnóstico §2.2): ahora hay receta
con método (P1), control por botella con número (P2–P3), servicio responsable
de alcohol (P4–P5), cobro y terminal (P10–P11) y cortesías (P12). La antigua
P9 (tarea de jefe de barra) no está: inventario semanal, pedidos y equipo
viven en `bar_manager`.

## Tareas del puesto

- Preparar cócteles y servir destilados con receta y medida de la casa.
- Despachar comandas del POS en tiempo (embotellados y vino < 5 min; cócteles < 8 min).
- Servir alcohol de forma responsable (menores, ebriedad).
- Controlar la botella en uso; registrar mermas y rotos; contar al cierre.
- Revisar la precuenta de barra; cuidar cobro y terminal.
- Abrir la barra con checklist: producciones rotuladas, hielo, cristalería.

## Facultades

**Decide:** no servir a menores o a personas en estado de ebriedad; desechar y
registrar un insumo sin rótulo; no despachar sin comanda; orden de la cola.

**Escala (merece crédito):** cortesías, descuentos y cancelaciones (Política
de dinero: el bartender sólo solicita); devoluciones y dobles cargos (sólo
gerente u owner); cliente ebrio que no acepta retirarse (gerente o seguridad,
como dice el manual); diferencias de botella sin explicar (jefe de barra);
bebidas fuera de carta (jefe de barra/gerente fija tiempo, precio y alta).

**No merece crédito:** pasarle al jefe de barra una tarea suya (medir,
rotular, revisar la precuenta, no servir sin comanda).

**Pendiente de operador:**
- Recetario vigente (Margara Sagrada 45/22.5/22.5/22.5 ml; copa 60 ml; botella 700 ml).
- Técnica y garnish de la Margara Sagrada (el recetario sólo trae cantidades; P1 califica método, no la técnica exacta).
- Si el barman cobra y opera la terminal en barra (el manual dice que sólo subgerente y gerente cobran).
- Si la barra tiene fondo propio y cómo se entregan sus propinas.
- Identificaciones aceptadas para comprobar mayoría de edad.
- Procedimiento cuando el POS falla.
- Dónde se registra la merma de barra.

## Práctico — por pregunta

| # | Tarea real | Por qué la respuesta modelo es correcta |
|---|---|---|
| 1 | Preparar un coctel de la casa | Sigue el «Procedimiento para elaborar cócteles» del manual: revisión de insumos, mezcla medida, prueba con bailarina (gota en la mano sin tocarla), corrección, técnica, garnish, entrega inmediata; y «seguir las recetas al pie de la letra». Probar con la boca es crítico de higiene. Indispensable. |
| 2 (num.) | Control de botella | Clave 150 ml: 700 − (5×60 + 4×45) = 220 esperados; quedan 70. Mismo cálculo que el manual pide al inventario («diferencias… restándole la venta»). |
| 3 | Diferencia de botella al cierre | La diferencia se mide, se busca la causa, se registra y se avisa. Rellenar o dejarlo para mañana es encubrir un faltante (crítico). El monto (200 ml) no revela la clave de P2. |
| 4 | Cliente en estado de ebriedad | Manual: «se le mandará la cuenta y se le invitará a retirarse; si no accede, se llamará al gerente». Servirle o exhibirlo son críticos. Indispensable. |
| 5 | Posible menor | Sin identificación no hay alcohol; servirle al amigo sabiendo que se lo pasa es servir al menor (crítico). Indispensable. |
| 6 | Comanda en el POS | Manual: «está prohibido llevar algo que no haya sido ingresado al sistema». Entregar sin comanda es crítico de dinero. Indispensable. |
| 7 | Cola atrasada en rush | Tiempos del manual (< 5 min embotellados/vino, < 8 cócteles; si no se cumple, informar al cliente). Sacar lo inmediato, tandas de iguales, medidas intactas, tiempo real al mesero, pedir apoyo. |
| 8 | Vidrio en la hielera | El hielo con vidrio no se puede inspeccionar: se vacía todo, se lava, se rellena con pala. Registrar en el formato de rotos (manual). Seguir sirviendo es crítico. |
| 9 | Apertura de barra | Manual: rótulos con fecha de elaboración y caducidad; descarte con registro de mermas; barra lista 10 min antes; 86 en el briefing. Usar el jugo sin rótulo es crítico. |
| 10 | Precuenta | Manual: «chequeamos la precuenta antes de imprimir… si faltan productos los agregamos e informamos al jefe de turno; si sobran, informamos». Cobrar lo ajeno o regalar lo servido son críticos. |
| 11 | Terminal con error | Verificar antes de repetir evita el doble cargo; la devolución es sólo de gerente u owner (Política de dinero). |
| 12 | Petición de cortesía | Política de dinero: el bartender no autoriza; la cortesía menor la autoriza gerente/subgerente y se registra con nota en POS. Aquí escalar sí merece crédito. |

Dimensiones: técnica 20 (1, 7) · alcohol responsable 20 (4, 5) · control de
botella, cobro y caja 30 (2, 3, 10, 11, 12) · comandas, higiene y apertura 30
(6, 8, 9). Umbral 70.

## Competencias

24 preguntas, 4 por eje. Integridad: 4 de experiencia. Los otros ejes: 3 de
experiencia y 1 dilema de barra. Curiosidad y optimismo sin señales de alerta.
Ninguna presupone una falta propia (la antigua q16 lo hacía).

## Pendientes para la versión 2 del banco

Cambios que tocan el enunciado; no se aplican ahora para no dejar sin banco
las respuestas ya guardadas.

- **P7 (cola de 14 bebidas):** sólo se da la antigüedad de los cocteles y no
  cuántas personas hay en barra. Propuesta: «Llevan 10 minutos los 6
  cocteles; las 4 cervezas, 2 vinos y 2 mezcales entraron hace 2 minutos.
  Estás tú y un backbar». Así el orden se puede sustentar con datos.
- **P10–P11 (precuenta y terminal):** si el operador confirma que el barman
  no cobra, reescribir P11 para que el barman reciba el aviso del cliente y
  tenga que avisar al subgerente/gerente y guardar evidencia, en vez de
  operar la terminal.
- **Competencias, ética (dilema de las 2:00 am):** el texto dice «lavar y
  pulir la cristalería». Propuesta: «lavar y dejar lista la cristalería»,
  para no hacer del pulido la única forma correcta.

## Revisión de Codex r3 aplicada

Fuente: `revision_bancos/barman.md` (10 problemas). Huella sin cambio: no se
tocó ningún enunciado del práctico ni texto de competencias.

| Problema | Clase | Qué se hizo |
|---|---|---|
| 1 · P6 contingencia del POS sin definir | C + A | Pendiente de operador concreto (POS caído: comanda manual/folio, quién autoriza, conciliación). `falla` pide distinguir lento de caído y pedir la contingencia al encargado; alternativa: despachar con comanda manual autorizada. `sin_comanda` reescrito como acto: entregar con la sola promesa de «ahorita los marco», sin comanda ni contingencia autorizada. |
| 2 · P10–P11 cobro quizá ajeno al puesto | C + A | Pendiente de operador ampliado (si no opera la terminal, qué le toca). P11: alternativa que da crédito a avisar al subgerente/gerente para que verifique antes de recobrar. Propuesta de enunciado en v2. |
| 3 · P11 alternativa que puede duplicar el pago | A | La alternativa ahora sólo acepta ofrecer otro medio; cobrarlo únicamente tras confirmar que el primer intento no pasó o con conciliación autorizada. |
| 4 · P1 cata rígida y técnica pendiente | A + C | `prueba` acepta gota en el dorso o muestra aparte con utensilio de un solo uso; alternativa equivalente. Crítico redefinido por contacto/retorno contaminante (beber de la coctelera, bailarina a la boca, regresar el utensilio). Pendiente: técnica de cata de la casa (técnica y garnish ya estaban). |
| 5 · P9 y competencias q12, pulido prescriptivo | A + B | P9 `cristaleria`: limpia y seca con el método de la casa. Competencias q12: señal positiva que no exige pulir. El texto de q12 dice «pulir»: propuesta en v2. |
| 6 · P9 alternativa incompatible (probar el jugo) | A | Alternativa reescrita: revisar rótulo, aspecto y olor de las demás producciones; el jugo sin etiqueta y agrio se desecha sin probarlo. |
| 7 · P4–P5 correcta sin el elemento de seguridad | A | `nucleo: ['no_sirve']` en P4 y `nucleo: ['sin_ine']` en P5 (omitirlo baja a parcial, no es crítico). P4 `ofrece`: agua/comida/café como atención, nunca permiso para seguir con alcohol. |
| 8 · P7 orden único con datos incompletos | A + B | `rapidas` acepta separar el flujo con un compañero; alternativas: repartir la cola, o sacar primero los cocteles atrasados si lo justifica. Dato faltante (personal, antigüedad de las directas) a v2. |
| 9 · Esenciales compuestos (P1, P5, P8, P12) y alternativa de hielera | A | P1 `entrega` → `garnish` + `entrega`; P5 `respeto` → `respeto` + `escala`; P8 `registra` → `avisa` + `registra`; P12 `registra` simplificado (queda en POS como cortesía con quién autorizó). Alternativa de otra hielera: cuenta como `detiene`, no sustituye vaciar/limpiar/rellenar. Al separar se sube el mínimo en 1 (P1 4 → 5, P5 3 → 4, P8 4 → 5) para que la misma respuesta completa dé el mismo resultado; todos ≤ esenciales. |
| 10 · Competencias sin escala de evidencia | A (sin cambio en la ficha) | Ya lo implementa `competency_grader.ts`: relato / criterio / genérica, nivel null sin evidencia (nunca 0), relato ≠ conducta observada, alertas sólo por conducta grave confirmada, curiosidad y optimismo sin alertas. |
