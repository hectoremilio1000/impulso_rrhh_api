# Encargado de barra / jefe de barra (`bar_manager`) — examen v1

Ficha: `app/services/exam_catalog/bar_manager.ts` · práctico
`banco_bar_manager_v1` (12 preguntas, 2 numéricas) · competencias
`competencias_bar_manager_v1` (30: puesto de mando).
Estado: **provisional** hasta que lo revisen dos operadores.

Fuentes leídas: «Manual de Introducción Barman» de La Llorona (organigrama,
requisiciones por par stock, procedimiento de inventarios, recibo de
facturas, rotulados, rotos, reglas de la casa), «Sesion4_Politica_Dinero.md»
y «recetario_completo_barra_23_06_26». Los datos del recetario van en el
enunciado.

## Por qué no comparte examen con Barman

El organigrama de La Llorona separa **Jefe de Barra → Bartenders → Backbar**.
Son puestos con tareas y facultades distintas:

| | Barman | Encargado de barra |
|---|---|---|
| Trabajo principal | Prepara y despacha bebidas, sirve con responsabilidad, revisa su precuenta | Responde por la barra entera: inventario, compras, equipo, controles |
| Control | Su botella en uso en un turno (P2 de Barman) | Merma semanal por producto, por turno y por bartender (P1–P2) |
| Compras | Avisa faltantes | Requisición por par stock, pedido por presentación, recepción contra factura (P3–P4) |
| Personas | Ninguna a cargo | Arma roles, capacita, corrige y documenta (P5, P6, P10) |
| Dinero | Solicita cortesías; nunca autoriza | Revisa cancelaciones y cortesías del equipo y las lleva a quien autoriza (P7, P12) |
| Turno | Abre/cierra su estación | Abre y cierra la barra completa; entrega al siguiente turno (P8–P9) |

Un mismo examen premiaría al buen bartender por saber técnica que el jefe de
barra también necesita, pero no mediría lo que lo hace distinto (contar,
pedir, dirigir, controlar). Y al revés: pedirle a un aspirante a barman que
explique una merma semanal o capacite a otro es evaluarlo con tareas que no
son suyas (el defecto de la antigua P9 de Barman). Por eso son dos fichas, y
la de mando lleva 30 preguntas de competencias.

## Tareas del puesto

- Contar el inventario, calcular la merma por botella y explicar diferencias.
- Requisiciones y pedidos por par stock; recibir al proveedor.
- Roles de bartenders y backbar; capacitación en recetas y estándares.
- Revisar cortesías, cancelaciones y mermas; reportar lo que no cuadra.
- Abrir y cerrar la barra: producciones, hielo, inventario, requisición, entrega.
- Responder por los incidentes de barra.

## Facultades

**Decide:** posiciones, descansos y apoyo del equipo de barra; cómo capacita y
corrige en turno; requisición diaria y ajuste del par stock; rechazar o anotar
producto dañado al recibir; retirar un insumo y comunicar 86 o sustituto;
respaldar el corte de alcohol de un bartender.

**Escala (merece crédito):** cancelaciones ya enviadas a preparar y cortesías
(gerente/subgerente, Política de dinero); cualquier reembolso (sólo gerente u
owner); sanciones y bajas (incluido el consumo de alcohol en turno); posible
robo (junta evidencia, decide el gerente); notas de crédito con el proveedor;
seguridad.

**No merece crédito:** pasarle al gerente el conteo, la requisición, el reparto
del equipo, la capacitación o la revisión del POS: son tareas suyas.

**Pendiente de operador:**
- Si el jefe de barra autoriza cortesías o cancelaciones de barra (la Política de dinero no lo nombra; el examen asume que no).
- Si puede retirar del turno o mandar a casa a un bartender, o sólo sacarlo de la barra y avisar.
- Quién aprueba el par stock y si pide directo al proveedor o vía encargado de compras.
- Merma aceptable por botella o por semana.
- Recetario vigente (Margara Sagrada y Pierde Almas con 45 ml de Llorona Espadín; copa 60 ml; botella 700 ml).
- Quién aprueba un cambio de receta o de marca.
- Política de llaves y resguardo del almacén de alcohol.

## Práctico — por pregunta

| # | Tarea real | Por qué la respuesta modelo es correcta |
|---|---|---|
| 1 (num.) | Merma por botella | Clave 1,150 ml: (6×700+350) + 12×700 − (8×700+200) = 7,150 consumidos; vendidos 40×60 + 60×45 + 20×45 = 6,000. Es el «inventario anterior, restándole la venta» del manual. Indispensable. |
| 2 | Investigar la merma | Manual: supervisión al azar e investigación con registros de sistema. Verificar el conteo, descartar lo registrable, ubicar el turno, poner un control y reportar con números. Ajustar para cuadrar o acusar sin evidencia son críticos. El monto (1,400 ml) no revela la clave de P1. Indispensable. |
| 3 (num.) | Pedido por par stock | Clave 2 cajas: faltan 8 botellas para el par de 16 (la abierta no completa una); 1 caja (6) no alcanza. |
| 4 | Recepción del proveedor | Manual: foto de la factura con fecha, nombre, firma, hora y que se recibió la totalidad con la calidad esperada; controlar que lo recibido sea lo pedido; sugerir reemplazo si falta. Firmar completo sin contar o servir la botella con sello roto son críticos. |
| 5 | Roles del equipo | Posiciones claras con backbar, nuevo acompañado, producción para el grupo antes de las 8, descansos fuera del pico y una señal concreta a mitad del turno (cócteles < 8 min). |
| 6 | Capacitación | Ciclo de la Estructura documental: enseña → practica → observa → feedback → reobserva → mide. Corregir en privado; exhibirlo es crítico. |
| 7 | Cortesías y cancelaciones | Política de dinero: cancelar ya enviado a producción y cortesías requieren gerente/subgerente con motivo y nota. El jefe de barra investiga y reporta; la sanción es del gerente. Autorizarlas después o dejarlo pasar son críticos. Indispensable. |
| 8 | Apertura con faltas | Cubrir la apertura, barra lista 10 min antes con producción rotulada, conteo de partida y aclarar el cierre sin inventario. |
| 9 | Cierre de barra | Manual: inventario al cierre en la planilla, supervisión al azar, requisición por par stock, registro de mermas y rotos; más resguardo y entrega escrita al bartender nuevo. Irse sin inventario o dejar el almacén abierto son críticos. Indispensable. |
| 10 | Bartender bebiendo en turno | Reglas de la casa: consumo de alcohol en horario laboral = baja definitiva; la decide el gerente. Le toca retirarlo de la barra, documentar y avisar. Encubrir es crítico. |
| 11 | Cliente agresivo tras corte de alcohol | Respaldar el corte, bajar la tensión, seguridad y gerente, proteger clientes y equipo, cuidar la salida del amenazado. Servirle o responder con fuerza son críticos. |
| 12 | Reclamo de reembolso | Política de dinero: cualquier reembolso sólo gerente u owner con evidencia (ticket, folio de terminal, motivo). Revisar la comanda y llevarlo al gerente sí merece crédito; devolver de la caja por su cuenta es crítico. |

Dimensiones: inventario, merma y compras 30 (1, 2, 3, 4) · roles y
capacitación 25 (5, 6, 10) · cortesías, cancelaciones y reembolsos 20 (7, 12) ·
apertura, cierre e incidentes 25 (8, 9, 11). Umbral 70.

## Competencias

30 preguntas, 5 por eje (puesto de mando). Integridad: 5 de experiencia
(incluye regalo de proveedor y número desfavorable, propios de quien compra y
cuenta). Los otros ejes: 4 de experiencia redactadas para cualquier trabajo o
la vida diaria (no presuponen haber mandado un equipo de barra) y 1 dilema
del puesto. Curiosidad y optimismo sin señales de alerta.

## Pendientes para la versión 2 del banco

Cambios que tocan el enunciado; no se aplican ahora para no dejar sin banco
las respuestas ya guardadas.

- **P1 → P2 (arrastre):** P2 abre con «La revisión de la semana muestra…
  1,400 ml», casi el mismo contexto de P1 (clave 1,150) y puede leerse como
  la respuesta. Propuesta: cambiar de producto en P2 (p. ej. «De la ginebra
  se fueron unos 900 ml») y abrir con «Otro caso:».
- **P3 → P4 (arrastre):** P4 dice «Pediste 2 cajas de Llorona Espadín», que
  es la clave de P3. Propuesta: «Pediste 3 cajas de Ojo de Tigre y 6 botellas
  de Controy. La factura cobra 4 cajas; al revisar cuentas 3…».
- **P3 (unidad del par):** decir en el enunciado si el par se cuenta en
  botellas cerradas o en volumen, cuando el operador lo confirme.

## Revisión de Codex r3 aplicada

Fuente: `revision_bancos/bar_manager.md` (9 problemas). Claves P1 (1,150 ml)
y P3 (2 cajas) verificadas. Huella sin cambio: ningún enunciado del práctico
ni texto de competencias se tocó.

| Problema | Clase | Qué se hizo |
|---|---|---|
| 1 · P2 crítico redactado como omisión (y P7, P9, P10) | A | P2 `ajusta`: ajustar para cuadrar o decir que la oculta/no la reporta. P7 `deja_pasar`: decide dejarlo pasar o archivarlo sin avisar. P9 `sin_inventario` y `almacen_abierto`: sólo si lo dice. P10 `encubre`: decide dejarlo seguir sin avisar o lo encubre. Callar sobre el reporte sólo deja sin acreditar el esencial. |
| 2 · P7 autorización pendiente e investigación incompleta | A + C | `autorizacion`: verificar antes de concluir (gerente/subgerente o registro). Alternativa: documentar una autorización real previa con su fecha real. `autoriza_despues`: él mismo las autoriza o inventa nota/autorizador. La facultad del jefe de barra ya estaba en pendientes. |
| 3 · P10 retiro preventivo vs sanción | A + C | `retira`: apartarlo de la barra y cubrir; salida del turno y sanción las decide el gerente. Pendiente ampliado: quién decide que salga del establecimiento. |
| 4 · P9 custodia de llaves sin política | A + C | `resguardo` acepta entrega documentada a custodio autorizado; crítico sólo si dice dejarlo abierto o las llaves sin entregar. Pendiente concreto: custodio y forma de entrega. |
| 5 · P3 definición de par e explicación | A + C | `solucion` con las dos lecturas (botellas cerradas: 8; volumen: ≈ 7.7) y redondeo de cajas hacia arriba: ambas dan 2. Clave y tolerancia sin cambio. Pendiente: unidad del par y redondeo. Requisición vs compra directa ya estaba en pendientes. |
| 6 · Arrastre P1–P2 y P3–P4 | B | Propuestas en «Pendientes para la versión 2». |
| 7 · P4 y P12 elementos compuestos | A | P4: `faltante` → `faltante` (solicita nota de crédito, no la autoriza) + `controy`; `foto`: el canal basta, los datos del formato son detalle. P12: `gerente` → `gerente` (quien autoriza) + `evidencia`; `explica` sin exigir plazo. Al separar se sube el mínimo en 1 (P4 4 → 5, P12 3 → 4) para que la misma respuesta completa dé el mismo resultado. |
| 8 · P5, P8, P11 mínimos sin lo central | A | `nucleo`: P5 `['nuevo']`, P8 `['conteo']`, P11 `['respalda', 'seguridad']`; además P12 `['gerente']` (dinero). Omitirlos baja a parcial, no es crítico. |
| 9 · Competencias: niveles sin anclaje y premio a la sobrecarga | A | Escala ya en `competency_grader.ts` (relato / criterio / genérica; sin evidencia = nivel null; alertas sólo por conducta grave; curiosidad y optimismo sin alertas). Señales positivas nuevas en ética q15 (límite seguro, llevar el agotamiento recurrente al gerente), optimismo q28 (pedir apoyo o poner límites; admitir cansancio no resta) y q30 (plantear la falta crónica de personal con datos). |
