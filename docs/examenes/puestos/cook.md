# Cocinero de línea (`cook`): tareas, facultades y por qué cada respuesta

Ficha: `app/services/exam_catalog/cook.ts` (`EXAMEN_COOK`).
Versiones: `banco_cook_v1` (práctico, 12 preguntas) y `competencias_cook_v1`
(24 preguntas, 4 por eje). Umbral del práctico: 70 (el valor por defecto).
Estado: **provisional** hasta que lo confirmen dos operadores.

## Qué corrige respecto al banco anterior

El diagnóstico (§2.2 y §2.3) encontró que el banco anterior de Cocinero tenía
preguntas genéricas sin ningún dato técnico verificable, que le faltaban
temperaturas, descongelado, PEPS con etiqueta y alérgenos, que el calificador
le daba puntos por «sugerencias de venta» (una tarea de piso) y que algunas
preguntas presuponían una falta propia (q7) o sugerían la respuesta (q13).
Esta ficha:

- mide sólo tareas de la estación (nada de vender, supervisar ni decidir la carta);
- pide valores de referencia de inocuidad en 6 de las 12 preguntas y una
  pregunta numérica la califica el código;
- no enumera en el enunciado lo que se califica;
- en competencias, integridad es 100 % de experiencia y cada eje tiene 4 preguntas.

## Tareas del puesto

1. Montar su estación según la hoja de producción (mise en place).
2. Cocinar, conservar, enfriar, descongelar y recalentar a temperatura.
3. Rotar producto por PEPS y etiquetar lo que produce o abre.
4. Evitar contaminación cruzada y atender comandas con alergia.
5. Leer las comandas del KDS/POS y sacar a tiempo los platillos de su estación.
6. Rehacer un platillo devuelto.
7. Avisar a tiempo de un insumo que se acaba o un equipo que falla.
8. Higiene personal; no manipular alimentos con síntomas.

## Facultades

**Decide él:** el orden de trabajo de su estación; no mandar al pase un plato
que no cumple; apartar producto sin etiqueta, vencido o fuera de temperatura;
recalentar o reenfriar dentro de los límites; cambiar tabla, utensilio o
guantes; no entrar a la línea con vómito, diarrea o fiebre.

**Escala (aquí escalar SÍ merece crédito):** insumo que se va a acabar (el 86
lo marca el Subencargado o el Encargado); cualquier sustitución de ingrediente
o cambio de receta; una alergia que no puede garantizar; equipo fuera de
temperatura; platillos devueltos que se repiten; su propia enfermedad.

**No merece crédito:** «le aviso al encargado» en lugar de medir, separar,
lavar o rehacer, que son tareas suyas.

## Valores de inocuidad que usa el examen

| Concepto | Valor usado | Fuente / estado |
|---|---|---|
| Refrigeración | ≤4 °C o ≤7 °C (se aceptan ambos) | Distintivo H / NOM-251-SSA1-2009. **Pendiente**: estándar de la casa |
| Congelación | ≤ -18 °C | Referencia NOM-251 / Distintivo H. Pendiente confirmar numeral |
| Mantenimiento en caliente | ≥60 °C | Ídem |
| Zona de peligro | entre 4 (o 7) y 60 °C | Ídem |
| Cocción de aves y recalentado | 74 °C en la parte más gruesa | Ídem |
| Enfriamiento | 60→21 °C en 2 h y 21→4 °C en 4 h más | Distintivo H / FDA. **Se califica el método**, no el número |
| Descongelado | refrigeración, agua corriente fría, microondas si se cocina enseguida, como parte de la cocción | Referencia NOM-251. Pendiente confirmar |

Donde hay duda, el elemento esencial califica el método (medir, separar,
descartar, enfriar rápido) y el valor se acepta en cualquiera de las dos
referencias.

## Práctico por pregunta

Dimensiones: inocuidad 45 · mise en place/PEPS 20 · línea y comandas 20 ·
comunicación 15. Indispensables: 1 (mise en place), 7 (contaminación cruzada),
8 (alérgeno).

**1. Mise en place con la hoja de producción** (indispensable). Tarea: montaje
de estación. Modelo: «Enciendo el comal primero. Produzco 40 porciones de
frijoles, no 60, y sirvo primero los de ayer; asar la salsa va antes que el
picado, que dejo al final para que esté fresco. Reviso que la mesa fría
enfríe antes de surtir, etiqueto y tapo, y si no me va a dar el tiempo aviso
al responsable antes de la 1:00». Correcta porque produce sólo la diferencia
(evita merma), ordena por tiempo de proceso y avisa antes de abrir, no a mitad
del servicio. Error crítico: mezclar lo de ayer con lo nuevo (rompe la
trazabilidad PEPS).

**2. Escalar la receta (numérica).** Tarea: producción según receta estándar.
600 g ÷ 10 × 35 = **2,100 g**, tolerancia 0. Lo califica el código sin
modelo. Las cifras son del caso, no de La Llorona.

**3. Baño maría a 50 °C y mesa fría a 11 °C.** Tarea: control de
temperaturas en la línea. Modelo: «Dejo de servir de ahí, mido el producto con
termómetro; los dos están en zona de peligro. Como no sé desde cuándo, aparto
carnitas y lácteos para descarte y los registro; aviso al responsable que el
equipo falla y paso el producto nuevo a un equipo que sí mantenga». Correcta
porque el tiempo en zona de peligro es desconocido; recalentar a 74 °C sólo es
válido si consta que fue poco tiempo (alternativa válida). Errores críticos:
seguir sirviendo, o subir la perilla y servir tibio.

**4. PEPS y etiquetas en cámara.** Tarea: rotación y etiquetado. Modelo:
«Descarto el sin etiqueta y lo anoto como merma; reviso la vida útil del de 9
días y lo descarto si ya venció; adelante el de anteayer, atrás el mío, que
etiqueto con nombre, fecha de elaboración, caducidad y mi nombre; aviso al
responsable». Correcta porque lo que no tiene fecha no se puede justificar
ante una verificación sanitaria. No se fija la vida útil en días porque no hay
tabla de la casa (pendiente).

**5. Enfriar 20 L de frijoles.** Tarea: enfriamiento. Modelo: «Los paso a
charolas poco profundas, baño de hielo o abatidor, mido hasta que bajen a 21 °C
en unas 2 horas y a 4 °C en las 4 siguientes; ya fríos los tapo, etiqueto y
refrigero». Correcta porque una olla de 20 L en cámara tarda muchas horas en
el centro y se queda en zona de peligro. Errores críticos: dejarla a
temperatura ambiente o meterla entera, tapada y caliente.

**6. Camarón congelado con poco tiempo.** Tarea: descongelado. Modelo: «Bolsa
cerrada bajo agua corriente fría; lo que descongele lo cocino o refrigero
enseguida y no lo vuelvo a congelar; aviso cuántas porciones tendré a la 1:30».
Correcta por la lista de métodos aceptados de NOM-251 (pendiente confirmar).
Errores críticos: agua caliente o estancada fuera de frío; recongelar.

**7. Contaminación cruzada pollo → pico de gallo** (indispensable). Modelo:
«Cambio a la tabla y cuchillo de verdura (o lavo, enjuago y desinfecto los
míos), me lavo las manos y cambio guantes, guardo el pollo tapado abajo en el
refri y limpio la superficie con otro trapo». Correcta porque el pico de gallo
no se cocina después: cualquier patógeno del pollo llega directo al comensal.

**8. Alergia a cacahuate con mole** (indispensable). Modelo: «No hago las
enchiladas con ese mole; aviso de inmediato al pase o al mesero para que el
comensal elija otra cosa; reviso en la receta que la alternativa no lleve
cacahuate en ningún componente; la preparo con sartén, utensilios y manos
limpios y la marco en el pase como alergia». Correcta porque el alérgeno está
molido en la salsa: «quitárselo» no es posible. Que el mole de la casa lleve
cacahuate es un supuesto del caso (pendiente). Errores críticos: mandar el
mole, o cambiar el platillo sin avisar al mesero.

**9. Comandas en el KDS.** Tarea: trabajo de estación con KDS. Modelo: «Leo
las tres completas con sus notas. Arranco el pollo de la 12 (12 min) y a los 4
minutos las arracheras (8 min) para que salgan juntas; le canto al comal la
tlayuda de la 12; aprovecho la plancha para la arrachera bien cocida de la 15
sin cebolla; la quesadilla de la 3 no es de mi estación. Marco listo sólo lo
que ya está en el pase». Correcta porque una mesa sale completa y caliente y
se respetan las notas. No se califica el tiempo estándar de la casa (no está
en las fuentes).

**10. Pollo devuelto rosado junto al hueso.** Tarea: platillo devuelto.
Modelo: «Hago uno nuevo con prioridad y compruebo con termómetro junto al
hueso que llegue a 74 °C; descarto el plato devuelto completo y lo registro;
aviso al responsable que el comensal comió pollo mal cocido; reviso grosor y
temperatura de la plancha». Correcta porque un plato que ya estuvo en la mesa
no vuelve a la línea, y el aviso permite que piso dé seguimiento al comensal.
Errores críticos: recocinar el mismo pollo mordido o reaprovechar la
guarnición.

**11. Se acaba el queso Oaxaca.** Tarea: faltante a mitad del servicio.
Modelo: «Aviso ya al responsable: me quedan 4 porciones y tengo 6 pendientes;
pido que revisen la cámara; sigo sacando en orden; no cambio el queso ni
achico la porción sin autorización». Correcta porque el 86 y la sustitución no
son facultad del cocinero; lo suyo es avisar a tiempo con el dato exacto.

**12. Vómito y diarrea la noche anterior.** Tarea: salud del personal.
Modelo: «Aviso al responsable antes del turno y no manipulo alimentos hasta que
me autorice o pase el tiempo de la regla; si me lo piden voy al médico; al
volver, lavado de manos reforzado». Correcta porque los síntomas
gastrointestinales pueden transmitir norovirus aunque uno «ya se sienta bien».
`minimoCorrecta` es 2 porque los dos primeros elementos son lo indispensable.

## Competencias

24 preguntas, 4 por eje. Integridad: las 4 de experiencia. Los demás ejes: 3
de experiencia (redactadas para cualquier trabajo, la escuela o la vida
diaria) y 1 hipotética de cocina. Curiosidad y optimismo sin señales de
alerta. Ninguna pregunta presupone una falta propia ni experiencia previa en
cocina.

## Pendientes de operador

Ver `facultades.pendientesOperador` en la ficha (13 puntos): refrigeración 4 vs
7 °C; confirmar numerales de NOM-251 para -18, 60 y 74 °C; enfriamiento en dos
etapas; regla de 2 h en zona de peligro; métodos de descongelado; tabla de
vida útil; formato de etiqueta; si el cocinero marca agotados; quién registra
descartes; receta de mole con cacahuate; receta de salsa verde; tiempos
estándar del KDS; tiempo sin manipular alimentos tras síntomas.

## Pendientes para la versión 2 del banco

Cambios que tocan el enunciado; no se aplican ahora para no dejar sin banco
las respuestas ya guardadas.

- **P4 (salsa macha):** no se da la vida útil. Propuesta: «La salsa macha de
  la casa dura 7 días en refrigeración» (o la cifra de la tabla de La
  Llorona), para que el descarte del lote de 9 días se pueda deducir.
- **P9 (plancha):** faltan el tiempo de la arrachera bien cocida, el de la
  tlayuda y cuántas piezas caben en la plancha. Propuesta: «La arrachera bien
  cocida toma 12 minutos, la tlayuda 6 en el comal y en la plancha caben 4
  piezas».
- **P10 (pollo devuelto):** la pregunta dice «¿qué haces con el platillo?»
  pero se acreditan avisar y buscar la causa. Propuesta: «¿Qué haces con el
  platillo y con la devolución?».
- **P3 y P5 (temperaturas):** cuando el operador fije 4 °C o 7 °C, ponerlo en
  el enunciado de P5.

## Revisión de Codex r3 aplicada

Fuente: `revision_bancos/cook.md` (9 problemas). Clave P2 (2,100 g)
verificada. Huella sin cambio: ningún enunciado del práctico ni texto de
competencias se tocó. P11 ya tenía `nucleo: ['avisa_ya']` de antes.

| Problema | Clase | Qué se hizo |
|---|---|---|
| 1 · Esenciales compuestos P1, P3, P7, P10 | A | P1 `diferencia` → `diferencia` (sólo lo que falta) + `peps` (usar los de ayer), mínimo 3 → 4. P3 `reporta` → `reporta` (avisa la falla) + `traslada` (pasa el producto a equipo que mantiene), mínimo 3 → 4. P7 `superficie` → `superficie` + `trapo`, mínimo 3 → 4. P10 `descarta` sólo exige descartar el plato completo (registro fuera). Al separar se sube el mínimo en 1 para que la misma respuesta completa siga dando el mismo resultado. |
| 2 · P4 vida útil no dada | A + B + C | `vencido`: descarta el de 9 días sólo si venció (9 días no es vencido por sí solo). `peps`: ordena los lotes aptos por caducidad. Vida útil al enunciado en v2; la tabla ya estaba en pendientes. |
| 3 · P4 formato de etiqueta | A + C | `etiqueta_nueva`: identificar y rotar (nombre y fecha de elaboración; caducidad y responsable si el formato los pide). La alternativa de confirmar trazabilidad ya estaba. Formato ya en pendientes. |
| 4 · P3 y P5 temperaturas 4 vs 7 °C, regla de 2 h | A + C | P5 `tiempo` acepta 4 o 7 °C y califica método; alternativa: otro valor cercano con método correcto se acredita y la diferencia se anota, sin crítico. P3 `zona` ya aceptaba ambos. Valores y regla de 2 h ya en pendientes. |
| 5 · P11 «pide que revisen» vs entregar tarea propia; 86 | A + C | `busca`: pedir apoyo sólo cuenta con seguimiento; desentenderse no. Pendiente nuevo: quién revisa y surte el insumo a mitad del servicio. El 86 ya estaba en pendientes. |
| 6 · P7 y P8 mínimos sin lo de seguridad | A | `nucleo`: P7 `['tabla']`, P8 `['no_prepara', 'revisa']`. Omitirlos baja a parcial; los críticos siguen siendo sólo actos peligrosos explícitos. |
| 7 · P9 secuencia única sin datos | A + B | `tiempos`: objetivo «la mesa 12 sale junta» con el pollo primero como ejemplo. `mesa_15`: no dejarla esperar, con el orden que justifique. Alternativa: otra secuencia viable justificada. Datos de capacidad y tiempos a v2. |
| 8 · P10 exigencias ocultas; P12 responsable sin definir | A + B + C | P10: `descarta` sin exigir registro; cambio de enunciado a v2. P12: pendiente nuevo sobre quién autoriza la reincorporación y si pide constancia. |
| 9 · Competencias sin anclajes de nivel | A (sin cambio en la ficha) | Ya lo implementa `competency_grader.ts`: relato / criterio / genérica, sin evidencia = nivel null, relato ≠ conducta observada, alertas sólo por conducta grave confirmada, curiosidad y optimismo sin alertas. |
