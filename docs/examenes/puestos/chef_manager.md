# Chef / chef ejecutivo / chef gerente (`chef_manager`): qué decide y qué escala

Ficha: `app/services/exam_catalog/chef_manager.ts` (`EXAMEN_CHEF_MANAGER`).
Versiones: `banco_chef_manager_v1` y `competencias_chef_manager_v1`.

Fuentes: no hay un manual de Chef en las fuentes de La Llorona. El manual de
cocina de 2021 solo describe al jefe o encargado de cocina. Todas las
facultades de abajo son **supuesto provisional** (ver
`facultades.pendientesOperador`) hasta que las confirmen dos operadores. Ojo:
las vacantes reales que se conocen son Encargado y Subencargado de cocina. Hay
que confirmar si en La Llorona existe un Chef distinto del Encargado.

## Tareas del puesto

Todo lo del Encargado de cocina, más la dirección culinaria:

- diseñar y cambiar la carta con criterio de costo y de operación (ingeniería de menú);
- costear platillos nuevos y proponer precio con el % de costo objetivo;
- controlar el costo real contra el teórico y cerrar la diferencia;
- estandarizar receta, porción y montaje entre turnos;
- desarrollar al equipo y elegir responsables de turno;
- elegir proveedores estratégicos y resolver desabastos;
- preparar la cocina para auditorías sanitarias;
- lanzar cambios de carta.

## Decide (escalar no lo sustituye)

- Recetas, fichas técnicas, porciones y montajes dentro del % de costo objetivo.
- Propuesta de altas y bajas de carta con su análisis.
- Proveedores aprobados, muestras y cambios dentro del presupuesto.
- Estándares sanitarios y plan de corrección.
- Capacitación y plan de desarrollo del equipo.

## Escala al dueño o al gerente (aquí escalar SÍ merece crédito)

- Precios de venta.
- Gastos, reparaciones o equipo fuera del presupuesto.
- Contratos que comprometan volumen o cambien condiciones de pago.
- Contratar, despedir, sancionar, sueldos y nombramientos formales.
- Cambios que alteren lo que la carta promete.
- Trato con autoridades sanitarias y cierres.

## No merece crédito

- Pasarle al dueño una decisión de receta o de carta que está dentro del
  presupuesto: esa decisión es del chef.

## Por qué es un examen distinto del de Encargado de cocina

Conclusión: **deben ser distintos**.
- El Encargado ejecuta el sistema en el turno y el Chef lo diseña y decide
  dentro de un presupuesto.
- Las tareas que distinguen al Chef no las hace el Encargado:
  - ingeniería de menú;
  - costo real contra teórico;
  - lanzamiento de carta;
  - proveedor estratégico;
  - auditoría;
  - desarrollo de un responsable.
- Las facultades también cambian. El Chef decide recetas y carta, y el
  Encargado las aplica y propone cambios.
- Las preguntas no se repiten con el examen de Encargado ni con el banco
  anterior de Chef.
- La operación diaria no se vuelve a preguntar aquí. Solo aparece donde hay
  una decisión de dirección (P9 auditoría, P10 presupuesto).
- Si el Chef de un restaurante también lleva el turno, conviene aplicarle
  además el práctico de Encargado de cocina. Esa decisión es del operador.

Qué se corrigió del banco anterior de Chef (front, `questionBank.ts`):
- presuponía experiencia en el puesto («eres el Chef nuevo», «llevas 3
  meses», «llevas 6 meses»);
- tenía preguntas con 3 a 4 subpreguntas;
- tenía dos escenarios duplicados con Subgerente (regalo de proveedor, amigo
  que pide tapar);
- usaba tareas de nivel corporativo (HACCP en 60 días).

Ninguna pregunta de aquel banco se reutiliza.

## Bloque A · práctico (12 preguntas; umbral 70)

Dimensiones: dirección de la carta 35 · costo y presupuesto 25 · estándares e
inocuidad 20 · equipo y proveedores 20. Indispensables: P2 (decidir la carta
con margen y popularidad), P4 (cerrar la brecha de costo) y P9 (auditoría
sanitaria).

| P | Tarea real | Por qué la respuesta modelo es correcta |
|---|---|---|
| 1 | Margen de contribución promedio ponderado de cinco platos (numérica, clave $116.78) | Es la base de la ingeniería de menú: se pondera por órdenes vendidas. Si se promedian los cinco márgenes sin ponderar sale $121.80, y esa respuesta está mal. |
| 2 | El dueño quiere quitar dos de esos platos | Con margen y popularidad, la cochinita y la tlayuda son estrellas, las suizas son caballo de batalla, el mole es enigma y el pescado es perro. Se saca o se rediseña el perro, el caballo se mantiene bajando su costo, y al enigma se le da una oportunidad antes de quitarlo. El precio lo decide el dueño. |
| 3 | Costo real de alimentos del mes (numérica, clave 31 %) | Consumo = inventario inicial + compras − inventario final, entre la venta de alimentos sin IVA. |
| 4 | Real 33–34 % contra teórico 28 % por tres meses | Primero se separa la parte de precio (recosteo con los precios actuales) de la de operación. Luego se buscan las fugas: recetas del sistema, porciones, mermas, cortesías, recepción y los insumos de más valor. Se mide otra vez en el siguiente cierre. Mover el sistema para que cuadre es error crítico. |
| 5 | Chiles en nogada de temporada con la línea al límite | Un platillo nuevo entra con ficha costeada con su rendimiento real, prueba de tiempos, plan de capacidad, abasto de temporada y conservación. El precio lo propone él y lo autoriza el dueño. |
| 6 | Porción de suadero entre 110 y 180 g contra 140 g | Primero se dimensiona el costo, luego se busca la causa por turno. Se pone una herramienta que haga fácil acertar (porcionado o báscula), se capacita con la ficha y se mide de forma continua. |
| 7 | Elegir un responsable de noche entre el rápido que grita y la cuidadosa que no manda | El mando se da por cumplir y hacer cumplir estándares y por cómo trata al equipo, no por velocidad. El maltrato se corrige antes de dar mando. La persona elegida recibe un plan con seguimiento, y el nombramiento formal es del gerente o del dueño. |
| 8 | Desabasto de chilhuacle para el mole negro | Se dimensiona la necesidad y el costo, se buscan y prueban alternativas a ciegas y se decide dentro del presupuesto. Si se sale del presupuesto, se escala con opciones. Ficha y piso se actualizan. |
| 9 | Auditoría interna con cinco hallazgos a tres semanas de la verificación | Primero se corrige el riesgo a clientes (tablas, desinfección) y después el papeleo. Se corrige la causa de por qué se dejó de registrar y se vuelve a revisar. Rellenar bitácoras pasadas es error crítico. |
| 10 | Plancha descompuesta; la reparación excede lo que queda del presupuesto | Sostiene el servicio con un plan de contingencia y escala el gasto con cotizaciones y una recomendación. Autorizarlo por su cuenta es error crítico. |
| 11 | Lanzar la carta nueva en diez días | Fichas con alérgenos, alta en el sistema, inventario de salida y de entrada, práctica de cocina, degustación con meseros y medición después del lanzamiento. |
| 12 | El dueño pide bajar el costo del mole cambiando el chocolate de metate que la carta anuncia | Se costea cada cambio, se proponen alternativas y se prueban en degustación. Lo que la carta promete no se cambia en silencio. |

## Bloque B · competencias (30 preguntas, 5 por eje)

- Integridad: 5 de experiencia:
  - números reales que lo dejan mal;
  - conflicto de interés;
  - promesa incumplida;
  - control incumplido a su alrededor;
  - crédito ajeno.
- Los demás ejes: 4 de experiencia y 1 hipotética. Las hipotéticas son
  dilemas de dirección:
  - el platillo estrella no le gusta al equipo;
  - lanzar sin fichas;
  - el permiso del mejor cocinero el día del lanzamiento;
  - un platillo que se devuelve solo de noche;
  - la propuesta rechazada por costo.
- Las de experiencia sirven en cualquier trabajo o en la vida diaria.
- Curiosidad y optimismo no tienen señales de alerta.
- Una pregunta de curiosidad casi igual a una de Encargado de barra se
  reescribió.

## Pendientes de operador

Ver `facultades.pendientesOperador` en la ficha:
- si el puesto existe en La Llorona;
- quién fija precios;
- % de costo objetivo;
- presupuestos;
- datos ilustrativos de P1–P4, P6 y P8;
- método de ingeniería de menú;
- tipo de verificación sanitaria;
- descripción del mole en la carta;
- umbral de aprobado.

Las claves numéricas de P1 y P3 salen solo de los datos del enunciado y no
dependen de esos pendientes.

## Pendientes para la versión 2 del banco

Cambios que tocan el enunciado. No se aplican ahora: las respuestas ya
guardadas quedarían sin banco.

- **P1 y P2 son dependientes.** P1 prepara el cálculo de P2. Propuesta: dar
  en P2 los cinco márgenes ya calculados con otros datos, o tratarlas como un
  caso compuesto con crédito de arrastre si P1 sale mal. Si se exige el método
  de cuadrantes, el enunciado debe declararlo.
- **P5 y P8 no dan costo objetivo ni presupuesto.** Propuesta: dar un % de
  costo objetivo hipotético en P5, y en P8 un presupuesto de insumos y la
  fecha de la próxima cosecha.
- **P6 no da costo por gramo ni aclara si el peso es crudo o cocido.**
  Propuesta: dar el costo por kilo del suadero cocido y los diez pesos de la
  muestra.
- **P7 sugiere la elección** (uno «rápido que grita» contra una
  «cuidadosa»). Propuesta: dar evidencia equilibrada de los dos y decir en el
  enunciado que la elección es una propuesta y que el nombramiento formal lo
  aprueba el gerente o el dueño.
- **Competencias:** varias preguntas se centran en cocina, mientras otros
  bancos aceptan ejemplos de la escuela o la familia. Propuesta: abrir esos
  textos a ejemplos que sirvan fuera de cocina. Los anclajes de nivel por eje
  son del calificador de ejes, no de esta ficha.

## Revisión de Codex r3 aplicada

Fuente: revisión de bancos de Codex, ronda 3
(`revision_bancos/chef_manager.md`). No cambió ningún `enunciado` ni ningún
`texto` de competencias, ni el número u orden de preguntas, `tipo` o `eje`.

| Problema | Clase | Qué se hizo |
|---|---|---|
| 1 · P1–P2: método no declarado; el corte de popularidad solo está en pendientes; P1 y P2 dependen una de otra | A (+B, C) | A: `clasifica` acepta la contribución total por plato. Se acepta como alternativa el análisis por contribución total, complejidad y sustitución. B: la dependencia P1→P2 queda para v2. C: el método de la casa ya estaba pendiente. La clave de P1 ($116.78) es correcta. |
| 2 · P2: el dueño pide quitar dos y la rúbrica premia conservar cuatro | A | Se acepta como alternativa una segunda baja provisional, con periodo de prueba y medición de la sustitución. `mole` ya aceptaba justificar sacarlo. |
| 3 · P5 y P8: precio y presupuesto sin datos | C (+A, B) | C: nuevo pendiente sobre el presupuesto de insumos del Chef y quién autoriza el aumento por desabasto. Quién fija precios y el % objetivo ya estaban pendientes. A: `costeo` (P5) acepta pedir el objetivo y dar escenarios; `dimensiona` (P8) acepta estimar con un supuesto explícito del plazo. B: datos hipotéticos en v2. |
| 4 · P6: no se puede cuantificar sin costo por gramo; porcionar, capacitar y muestrear ya resuelven | A (+B) | `impacto` acepta la fórmula o pedir el dato. `minimoCorrecta` baja de 4 a 3 con `nucleo: ['herramienta']`: un sistema verificable de porcionado basta. B: el peso crudo o cocido queda para v2. |
| 5 · P7: el enunciado sugiere la elección; `formaliza` pide una aprobación que no se ve; plan vago | B (+A) | B: anotado en v2. A: `plan` exige al menos una meta verificable y un plazo. `formaliza` se deja como está: es uno de seis y no es requisito. |
| 6 · P9: inventar fechas no está tipificado; la calibración y los recipientes no son elementos | A | Nuevos esenciales `calibra` (antes era alternativa) y `recipientes`. Nuevo error crítico `inventa_fecha`, redactado como acto. `nucleo: ['riesgo']`: sin corregir el riesgo activo no hay «correcta». |
| 7 · P10–P12: elementos compuestos | A | P10 `escala`: basta con escalar con las cotizaciones; estimar la venta perdida ya no es requisito. P11: `fichas` se separa en `fichas` (costeo y montaje) y `alergenos`; `cocina` aclara que dirigir la práctica es del chef y no cuenta pasársela al dueño. P12 `acuerda`: presenta las opciones para decidir, y el sabor solo si lo probó. |
| 8 · Competencias: niveles sin anclaje; las preguntas se centran en cocina | B | Los anclajes de nivel son del calificador de ejes, no de esta ficha. Los textos no se pueden cambiar. Ambos quedan para v2. |

Las claves de P1 ($116.78) y P3 (31 %) se volvieron a calcular y coinciden.
