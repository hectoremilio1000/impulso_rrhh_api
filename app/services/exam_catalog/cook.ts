import type { ExamenPuesto } from '#services/exam_catalog/types'

// Examen de Cocinero de línea (catálogo 2026-11-16).
//
// Sustituye al banco genérico de Cocinero, que no pedía ningún dato técnico
// verificable y se calificaba con criterios de piso («sugerencias de venta»).
// Aquí el práctico mide lo que hace un cocinero de línea en su estación:
// inocuidad con valores de referencia, PEPS y etiquetado, mise en place,
// lectura de comandas del KDS, platillo devuelto, faltante de insumo e
// higiene personal. Nada de supervisar a otros cocineros ni de decidir la
// carta: eso es del Subencargado o del Encargado de cocina.
//
// Valores de inocuidad: referencia NOM-251-SSA1-2009 y Distintivo H
// (NMX-F-605-NORMEX). Donde las referencias difieren o el valor no está en las
// fuentes de La Llorona, el elemento califica el MÉTODO y acepta ambos valores;
// el supuesto queda en facultades.pendientesOperador.

export const EXAMEN_COOK: ExamenPuesto = {
  code: 'cook',
  label: 'Cocinero de línea',
  aliases: [
    'cocinero',
    'cocinera',
    'cocinero de linea',
    'cocinera de linea',
    'cocinero linea',
    'line cook',
    'cook',
  ],
  tareas: [
    'Montar su estación antes del servicio según la hoja de producción (mise en place)',
    'Cocinar, conservar, enfriar, descongelar y recalentar alimentos a las temperaturas de referencia',
    'Rotar producto por PEPS y etiquetar todo lo que produce o abre',
    'Evitar la contaminación cruzada y atender las comandas con alergia',
    'Leer las comandas del KDS/POS y sacar los platillos de su estación a tiempo y completos',
    'Rehacer un platillo devuelto y avisar lo que se repite',
    'Avisar a tiempo de un insumo que se acaba o de un equipo que falla',
    'Cumplir la higiene personal y no manipular alimentos con síntomas de enfermedad',
  ],
  facultades: {
    decide: [
      'El orden de trabajo de su estación y qué producir primero según la hoja de producción',
      'Detener y no mandar al pase un platillo de su estación que no cumple (crudo, frío, mal emplatado)',
      'Apartar un producto que no cumple inocuidad (sin etiqueta, fuera de temperatura, vencido) para que no se use',
      'Recalentar o reenfriar dentro de los límites de tiempo y temperatura',
      'Cambiar de tabla, utensilio o guantes y lavar-desinfectar cuando lo exige el proceso',
      'No entrar a la línea si tiene vómito, diarrea o fiebre, y avisar',
    ],
    escala: [
      'Un insumo que se va a acabar en el servicio (el agotado/86 lo marca el Subencargado o Encargado de cocina)',
      'Cualquier sustitución de ingrediente o cambio de receta',
      'Una comanda con alergia cuando no puede garantizar que el platillo salga sin el alérgeno',
      'Equipo de frío o calor fuera de temperatura (reparación y decisión sobre producto de alto costo)',
      'Platillos devueltos que se repiten o una queja de un comensal',
      'Su propia enfermedad o lesión antes del turno',
    ],
    pendientesOperador: [
      'Temperatura máxima de refrigeración: el examen acepta ≤4 °C (Distintivo H) o ≤7 °C (NOM-251-SSA1-2009); confirmar cuál es el estándar de La Llorona',
      'Congelación ≤ -18 °C, mantenimiento en caliente ≥60 °C, cocción de aves y recalentado a 74 °C: valores de referencia NOM-251 / Distintivo H; confirmar numerales',
      'Enfriamiento en dos etapas (de 60 a 21 °C en 2 h y de 21 a 4 °C en 4 h más): referencia de Distintivo H/FDA; la pregunta califica el método, no el número',
      'Regla de tiempo en zona de peligro (descartar si pasó más de 2 h o no se sabe cuánto): supuesto; confirmar la regla de la casa',
      'Métodos de descongelado aceptados (refrigeración, agua corriente fría, microondas si se cocina enseguida, como parte de la cocción): referencia NOM-251; confirmar',
      'Vida útil de salsas y preparados (el examen no fija días: califica que se lea la etiqueta y se descarte lo vencido o sin etiqueta); falta la tabla de vida útil de La Llorona',
      'Formato de la etiqueta de la casa (nombre, fecha de elaboración, fecha de caducidad o uso, responsable): supuesto',
      'Si el cocinero puede marcar un agotado en el POS o sólo avisa: el examen supone que sólo avisa',
      'A mitad del servicio, ¿quién revisa la cámara o el almacén y surte el insumo que se acaba: el propio cocinero, un ayudante o el Subencargado? (pregunta 11)',
      'Si el descarte de producto lo registra el propio cocinero o lo autoriza el Subencargado: el examen acepta ambos',
      'Receta de mole de la casa con cacahuate y ajonjolí (pregunta 8): supuesto del caso, no dato de La Llorona',
      'Receta estándar de salsa verde (pregunta 2): cifras del caso, no receta de La Llorona',
      'Tiempo estándar de salida por platillo en el KDS: no está en las fuentes; la pregunta 9 no lo califica',
      'Tiempo sin manipular alimentos tras vómito o diarrea (el examen acepta «hasta que lo autorice el responsable o 24-48 h sin síntomas»): confirmar la regla',
      'Quién es «el responsable» que autoriza a un cocinero a volver a manipular alimentos tras síntomas (Subencargado, Encargado de cocina, gerente) y si pide constancia médica',
    ],
  },
  practico: {
    version: 'banco_cook_v1',
    umbralAprobado: 70,
    dimensiones: [
      { id: 'inocuidad', nombre: 'Inocuidad y temperaturas', peso: 45 },
      { id: 'mise_en_place', nombre: 'Mise en place, PEPS y producción', peso: 20 },
      { id: 'linea', nombre: 'Trabajo en línea y comandas', peso: 20 },
      { id: 'comunicacion', nombre: 'Avisos y comunicación con el responsable', peso: 15 },
    ],
    preguntas: [
      {
        tipo: 'abierta',
        q: 1,
        enunciado:
          'Entras a las 11:30 a la estación de antojitos y el servicio abre a la 1:00. La hoja de producción del día pide 60 porciones de frijoles refritos, 3 kg de salsa roja asada, 80 bases de sope y 2 kg de cebolla y cilantro picados. En la estación hay 20 porciones de frijoles de ayer bien etiquetadas y nada de lo demás. El comal tarda unos 20 minutos en calentar. ¿Cómo usas esa hora y media?',
        dimension: 'mise_en_place',
        evalua: 'Planear la mise en place a partir de la hoja de producción y la existencia',
        tareaReal: 'Montaje de estación antes del servicio',
        indispensable: true,
        esenciales: [
          {
            id: 'diferencia',
            texto: 'Produce sólo lo que falta contra la hoja (40 porciones de frijoles, no 60)',
          },
          {
            id: 'peps',
            texto: 'Usa primero los frijoles de ayer (PEPS)',
          },
          {
            id: 'orden',
            texto:
              'Empieza por lo que más tarda (enciende el comal, asa la salsa, frijoles) y deja el picado fresco para el final',
          },
          {
            id: 'equipo',
            texto: 'Revisa que el equipo de su estación funcione y que la mesa fría enfríe antes de surtirla',
          },
          {
            id: 'etiqueta',
            texto: 'Etiqueta y tapa lo que produce y lo guarda a temperatura (frío o caliente) en la estación',
          },
          {
            id: 'aviso',
            texto:
              'Avisa al responsable antes de abrir si algo no va a estar listo o falta un insumo',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Producir las 60 porciones nuevas si los frijoles de ayer no pasan la revisión (sabor, olor, temperatura) y apartar los de ayer para descarte',
          'Pedir ayuda a otra estación para el picado si el tiempo no alcanza, avisando al responsable',
        ],
        erroresCriticos: [
          {
            id: 'mezcla',
            texto: 'Mezcla los frijoles de ayer con los nuevos en el mismo recipiente',
          },
        ],
      },
      {
        tipo: 'numerica',
        q: 2,
        enunciado:
          'La receta estándar de salsa verde cruda rinde 10 porciones y lleva 600 g de tomate verde limpio. Para el viernes la hoja de producción pide 35 porciones. ¿Cuántos gramos de tomate verde limpio necesitas? Responde con un solo número, en gramos.',
        dimension: 'mise_en_place',
        evalua: 'Escalar una receta estándar a la producción del día',
        tareaReal: 'Producción según receta estándar y hoja de producción',
        indispensable: false,
        clave: 2100,
        tolerancia: 0,
        unidad: 'g',
        solucion: '600 g ÷ 10 porciones = 60 g por porción; 60 g × 35 porciones = 2,100 g.',
      },
      {
        tipo: 'abierta',
        q: 3,
        enunciado:
          'A las 4:00 de la tarde revisas tu estación: el termómetro del baño maría donde están las carnitas marca 50 °C y la mesa fría con crema, queso fresco y pico de gallo marca 11 °C. No sabes desde qué hora están así. ¿Qué haces?',
        dimension: 'inocuidad',
        evalua: 'Conservar en caliente y en frío fuera de la zona de peligro',
        tareaReal: 'Control de temperaturas de conservación en la línea',
        indispensable: false,
        esenciales: [
          {
            id: 'deja_de_servir',
            texto: 'Deja de servir de esos recipientes hasta medir y decidir',
          },
          {
            id: 'mide',
            texto: 'Mide la temperatura interna del producto con termómetro, no sólo la del equipo',
          },
          {
            id: 'zona',
            texto:
              'Reconoce que están en zona de peligro (entre 4 o 7 °C y 60 °C): caliente se mantiene a 60 °C o más y frío a 4 °C o menos (7 °C según NOM-251)',
          },
          {
            id: 'descarta',
            texto:
              'Como no sabe cuánto tiempo llevan así, aparta el producto para descarte y lo registra (o recalienta las carnitas a 74 °C sólo si sabe que llevan poco tiempo)',
          },
          {
            id: 'reporta',
            texto: 'Avisa al responsable que el equipo falla',
          },
          {
            id: 'traslada',
            texto: 'Pasa el producto nuevo a una cámara o baño que sí mantenga la temperatura',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Recalentar las carnitas a 74 °C y volverlas a mantener a 60 °C o más si el registro de la bitácora muestra que bajaron hace menos de 2 horas',
        ],
        erroresCriticos: [
          {
            id: 'sigue_sirviendo',
            texto: 'Sigue sirviendo carnitas o crema de esos recipientes sin medir ni recalentar ni descartar',
          },
          {
            id: 'tibio',
            texto: 'Sólo sube la perilla del baño maría y vuelve a servir sin llevar las carnitas a 74 °C',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 4,
        enunciado:
          'Al abrir la cámara de refrigeración para surtir tu estación encuentras tres recipientes de salsa macha: uno sin etiqueta, uno con etiqueta de elaboración de hace 9 días y uno con etiqueta de anteayer. Detrás de ellos está la salsa que acabas de hacer y todavía no etiquetas. ¿Qué haces?',
        dimension: 'mise_en_place',
        evalua: 'Rotar por PEPS y etiquetar',
        tareaReal: 'Rotación de producto (primeras entradas, primeras salidas) y etiquetado',
        indispensable: false,
        esenciales: [
          {
            id: 'sin_etiqueta',
            texto:
              'Aparta para descarte el recipiente sin etiqueta (no se sabe su fecha) y lo registra como merma',
          },
          {
            id: 'vencido',
            texto:
              'Revisa la vida útil contra la etiqueta (o la tabla de la casa) y descarta el de hace 9 días sólo si ya venció; nueve días no es vencido por sí solo',
          },
          {
            id: 'peps',
            texto:
              'Ordena los lotes aptos por caducidad: adelante el que vence antes (el de hace 9 días si sigue apto, si no el de anteayer) y la salsa nueva atrás',
          },
          {
            id: 'etiqueta_nueva',
            texto:
              'Etiqueta su salsa para que se pueda identificar y rotar (al menos nombre y fecha de elaboración; caducidad y responsable si el formato de la casa los pide)',
          },
          {
            id: 'aviso',
            texto: 'Avisa al responsable del producto sin etiqueta o vencido encontrado en la cámara',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Preguntar al responsable de qué día es el recipiente sin etiqueta y, si nadie lo puede asegurar, descartarlo',
        ],
        erroresCriticos: [
          {
            id: 'usa_sin_etiqueta',
            texto: 'Usa en el servicio la salsa sin etiqueta o la vencida',
          },
          {
            id: 'rellena',
            texto: 'Junta en un solo recipiente la salsa vieja con la nueva',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 5,
        enunciado:
          'Son las 5:00 de la tarde. Terminaste una olla de 20 litros de frijoles de olla que se usarán mañana en el servicio de la comida y la cocina cierra a las 11 de la noche. ¿Cómo la guardas?',
        dimension: 'inocuidad',
        evalua: 'Enfriar rápido un volumen grande antes de refrigerar',
        tareaReal: 'Enfriamiento de producción para el día siguiente',
        indispensable: false,
        esenciales: [
          {
            id: 'divide',
            texto: 'Divide los frijoles en recipientes poco profundos (charolas, cantidades chicas)',
          },
          {
            id: 'acelera',
            texto:
              'Acelera el enfriamiento (baño de hielo, abatidor, mover con paleta fría) en vez de dejarla reposar en la olla',
          },
          {
            id: 'tiempo',
            texto:
              'Mide la temperatura y se asegura de que salga rápido de la zona de peligro (referencia: a 21 °C en 2 h y luego a temperatura de refrigeración, 4 °C o 7 °C según la norma; se califica el método, no el número exacto)',
          },
          {
            id: 'refrigera',
            texto: 'Ya fríos, los tapa, etiqueta y refrigera',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Meter los recipientes poco profundos destapados a la cámara para que enfríen y taparlos cuando ya estén fríos',
          'Dar un valor de refrigeración cercano distinto (p. ej. 5 °C) con el método correcto: se acredita el método y la diferencia numérica se anota aparte, sin error crítico',
        ],
        erroresCriticos: [
          {
            id: 'temp_ambiente',
            texto: 'Deja la olla a temperatura ambiente hasta el día siguiente o varias horas',
          },
          {
            id: 'olla_entera',
            texto: 'Mete la olla entera de 20 litros, tapada y caliente, a la cámara',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 6,
        enunciado:
          'Son las 11:00 de la mañana. Para el servicio de la 1:30 necesitas 3 kg de camarón que siguen congelados en bloque porque nadie los sacó anoche. ¿Qué haces?',
        dimension: 'inocuidad',
        evalua: 'Descongelar de forma segura con poco tiempo',
        tareaReal: 'Descongelado de proteína',
        indispensable: false,
        esenciales: [
          {
            id: 'metodo',
            texto:
              'Descongela en bolsa cerrada bajo agua corriente fría (o en microondas sólo si lo cocina enseguida)',
          },
          {
            id: 'no_ambiente',
            texto: 'No lo descongela sobre la mesa a temperatura ambiente ni en agua caliente o tibia',
          },
          {
            id: 'usa_pronto',
            texto: 'Lo descongelado en agua lo cocina o refrigera de inmediato y no lo vuelve a congelar',
          },
          {
            id: 'aviso',
            texto: 'Avisa al responsable cuántas porciones tendrá listas a tiempo si no alcanza',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Descongelar sólo la cantidad necesaria para el arranque y dejar el resto en refrigeración para más tarde',
        ],
        erroresCriticos: [
          {
            id: 'agua_caliente',
            texto: 'Descongela el camarón en agua caliente o en la tarja con agua estancada fuera de frío',
          },
          {
            id: 'recongela',
            texto: 'Vuelve a congelar el camarón que ya se descongeló',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 7,
        enunciado:
          'Acabas de cortar 2 kg de pechuga de pollo cruda en tu tabla y en el KDS entra una orden de guacamole con pico de gallo que tienes que picar ya. ¿Qué haces antes de picar el jitomate y la cebolla?',
        dimension: 'inocuidad',
        evalua: 'Evitar la contaminación cruzada de crudo a listo para comer',
        tareaReal: 'Separación de crudos y alimentos listos para consumo',
        indispensable: true,
        esenciales: [
          {
            id: 'tabla',
            texto:
              'Cambia a otra tabla y cuchillo limpios (código de colores) o lava, enjuaga y desinfecta los que usó',
          },
          {
            id: 'manos',
            texto: 'Se lava las manos (y cambia los guantes si los usa) después de tocar el pollo crudo',
          },
          {
            id: 'guarda',
            texto: 'Guarda el pollo en refrigeración, en la parte baja y tapado, lejos de lo listo para comer',
          },
          {
            id: 'superficie',
            texto: 'Limpia y desinfecta la superficie donde cortó el pollo',
          },
          {
            id: 'trapo',
            texto: 'Usa un trapo o paño limpio, no el mismo con que limpió el crudo',
          },
        ],
        minimoCorrecta: 4,
        nucleo: ['tabla'],
        alternativasValidas: [
          'Pedir a otro cocinero que pique el pico de gallo en su estación limpia mientras él termina y limpia la suya',
        ],
        erroresCriticos: [
          {
            id: 'misma_tabla',
            texto: 'Pica el jitomate o la cebolla en la misma tabla o con el mismo cuchillo sin lavar y desinfectar',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 8,
        enunciado:
          'En el KDS entra para la mesa 7: «Enchiladas de mole — ALERGIA A CACAHUATE». El mole de la casa lleva cacahuate y ajonjolí. ¿Qué haces?',
        dimension: 'inocuidad',
        evalua: 'Atender una comanda con alergia sin exponer al comensal',
        tareaReal: 'Control de alérgenos',
        indispensable: true,
        esenciales: [
          {
            id: 'no_prepara',
            texto: 'No prepara las enchiladas con ese mole',
          },
          {
            id: 'avisa_piso',
            texto:
              'Avisa de inmediato al pase o al mesero para que el comensal elija otro platillo',
          },
          {
            id: 'revisa',
            texto:
              'Revisa en la receta o en las etiquetas que el platillo alternativo no lleve cacahuate en ningún componente (salsa, aceite, guarnición)',
          },
          {
            id: 'limpio',
            texto:
              'Prepara la alternativa con utensilios, sartén y superficie limpios, y manos lavadas o guantes nuevos',
          },
          {
            id: 'identifica',
            texto: 'Identifica el plato en el pase como de alergia para que no se confunda',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Si la casa tiene una salsa preparada y etiquetada sin cacahuate para estos casos, hacer las enchiladas con ella después de confirmarlo con el responsable',
        ],
        nucleo: ['no_prepara', 'revisa'],
        erroresCriticos: [
          {
            id: 'sirve_alergeno',
            texto: 'Manda las enchiladas con el mole de la casa o le quita el cacahuate de encima y las sirve',
          },
          {
            id: 'sin_avisar',
            texto: 'Cambia el platillo por otro sin avisar al mesero',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 9,
        enunciado:
          'Estás en la plancha un viernes. A las 9:04 el KDS muestra, en este orden: mesa 12 (4 personas) con 2 arracheras término medio, 1 pollo a la plancha y 1 tlayuda que sale del comal; mesa 3 con 1 quesadilla de flor que no lleva nada de plancha; mesa 15 con 1 arrachera bien cocida y la nota «sin cebolla». La arrachera término medio te toma 8 minutos y el pollo 12. ¿Cómo trabajas estas comandas?',
        dimension: 'linea',
        evalua: 'Leer las comandas del KDS y coordinar tiempos para que la mesa salga completa',
        tareaReal: 'Trabajo de estación con comandas en KDS/POS',
        indispensable: false,
        esenciales: [
          {
            id: 'lee_todo',
            texto: 'Lee cada comanda completa, con sus notas («sin cebolla», términos), antes de empezar',
          },
          {
            id: 'tiempos',
            texto:
              'Organiza los tiempos para que la mesa 12 salga junta (p. ej. arranca el pollo, que tarda más, y mete las arracheras después)',
          },
          {
            id: 'otra_estacion',
            texto: 'Coordina con el comal para que la tlayuda salga al mismo tiempo que lo de plancha de la mesa 12',
          },
          {
            id: 'mesa_15',
            texto:
              'Atiende la arrachera bien cocida de la mesa 15, sin cebolla, sin dejarla esperar a que salga toda la mesa 12 (aprovechando la plancha o con otro orden que justifique)',
          },
          {
            id: 'kds',
            texto:
              'Marca como listo en el KDS sólo lo que ya salió al pase y avisa al pase si algo se va a tardar',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Cantar al pase la mesa 12 para que el responsable sincronice plancha y comal',
          'Otra secuencia viable si la justifica con el objetivo de salida (mesas completas, notas respetadas, tiempos comunicados al pase)',
        ],
        erroresCriticos: [
          {
            id: 'ignora_nota',
            texto: 'Ignora la nota del KDS y manda la arrachera con cebolla',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 10,
        enunciado:
          'Regresa del salón un pollo a la plancha de la mesa 9: el comensal dice que cerca del hueso está rosado y le dio un par de bocados. ¿Qué haces con el platillo?',
        dimension: 'linea',
        evalua: 'Rehacer un platillo devuelto por mala cocción con criterio de inocuidad',
        tareaReal: 'Platillo devuelto',
        indispensable: false,
        esenciales: [
          {
            id: 'prioriza',
            texto: 'Le da prioridad y prepara un pollo nuevo para la mesa 9',
          },
          {
            id: 'termometro',
            texto:
              'Comprueba con termómetro en la parte más gruesa, junto al hueso, que llegue a 74 °C',
          },
          {
            id: 'descarta',
            texto: 'Descarta el plato devuelto completo (pollo y guarnición)',
          },
          {
            id: 'avisa',
            texto:
              'Avisa al responsable de la línea que el comensal comió pollo mal cocido',
          },
          {
            id: 'causa',
            texto:
              'Revisa por qué pasó (grosor de la pieza, temperatura de la plancha, tiempo) para que no se repita',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Abrir el pollo en mariposa o cocinarlo más delgado para que alcance 74 °C más rápido sin quemar el exterior',
        ],
        erroresCriticos: [
          {
            id: 'regresa_mismo',
            texto: 'Regresa a la plancha el mismo pollo que ya mordió el comensal y lo vuelve a mandar',
          },
          {
            id: 'reusa_guarnicion',
            texto: 'Reaprovecha la guarnición o cualquier parte del plato devuelto para otro platillo',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 11,
        enunciado:
          'Viernes, 8:30 de la noche. Te quedan 4 porciones de queso Oaxaca en la estación y en el KDS hay 6 quesadillas pendientes; todavía falta la hora más fuerte del servicio. ¿Qué haces?',
        dimension: 'comunicacion',
        evalua: 'Avisar a tiempo de un insumo que se agota y no improvisar la receta',
        tareaReal: 'Faltante de insumo a mitad del servicio',
        indispensable: false,
        esenciales: [
          {
            id: 'avisa_ya',
            texto:
              'Avisa de inmediato al responsable de la línea cuántas porciones le quedan y cuántas comandas tiene pendientes',
          },
          {
            id: 'busca',
            texto:
              'Revisa si hay más queso en cámara o almacén antes de darlo por agotado (o pide apoyo para revisarlo y da seguimiento a la respuesta; desentenderse no cuenta)',
          },
          {
            id: 'orden',
            texto: 'Sigue sacando las comandas en el orden en que entraron con lo que tiene',
          },
          {
            id: 'no_sustituye',
            texto:
              'No cambia el queso por otro ni reduce la porción sin que lo autorice el responsable y se avise al comensal',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Proponer al responsable una alternativa de la carta para ofrecer a las mesas que no alcancen',
        ],
        erroresCriticos: [
          {
            id: 'sustituye',
            texto: 'Usa otro queso o reduce la porción sin avisar a nadie',
          },
        ],
        // Revisión Codex r3: no avisar es una omisión (parcial), no un error
        // crítico; avisar de inmediato es lo que hace "correcta".
        nucleo: ['avisa_ya'],
      },
      {
        tipo: 'abierta',
        q: 12,
        enunciado:
          'Anoche tuviste vómito y diarrea. Hoy amaneces mejor, es sábado y sabes que en la cocina falta gente. ¿Qué haces?',
        dimension: 'inocuidad',
        evalua: 'Higiene personal: no manipular alimentos con síntomas de enfermedad gastrointestinal',
        tareaReal: 'Higiene y salud del personal que manipula alimentos',
        indispensable: false,
        esenciales: [
          {
            id: 'avisa_antes',
            texto: 'Avisa al responsable de cocina antes del turno de los síntomas que tuvo',
          },
          {
            id: 'no_manipula',
            texto:
              'No manipula alimentos hasta que lo autorice el responsable o pase el tiempo que marca la regla de la casa sin síntomas',
          },
          {
            id: 'medico',
            texto: 'Busca atención médica o constancia si se lo piden o si los síntomas vuelven',
          },
          {
            id: 'lavado',
            texto:
              'Al regresar refuerza el lavado de manos (al entrar, después del baño, entre crudo y listo para comer)',
          },
        ],
        minimoCorrecta: 2,
        alternativasValidas: [
          'Ofrecer hacer una tarea sin contacto con alimentos (inventario, limpieza de áreas sin alimento) si el responsable lo acepta',
        ],
        erroresCriticos: [
          {
            id: 'trabaja_enfermo',
            texto: 'Entra a la línea a manipular alimentos sin avisar de los síntomas',
          },
        ],
      },
    ],
  },
  competencias: {
    version: 'competencias_cook_v1',
    preguntas: [
      // Integridad: todas de experiencia.
      {
        texto:
          'Cuéntame de la última vez que te diste cuenta de que algo que hiciste en tu trabajo o en tus estudios había salido mal y nadie más lo había notado. ¿Qué pasó, qué hiciste tú y cómo terminó?',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo dice o lo corrige aunque nadie lo hubiera descubierto',
          'Asume la consecuencia sin culpar a otros',
          'Cambia algo para que no se repita',
        ],
        senalesAlerta: [
          'Relata que ocultó el error y le funcionó',
          'Culpó a otra persona de lo que hizo',
        ],
      },
      {
        texto:
          'Cuéntame de una vez en que alguien con más autoridad que tú te pidió hacer algo que te parecía incorrecto o riesgoso. ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Expresa su desacuerdo con respeto y da razones',
          'Busca una alternativa correcta o acude a otra instancia',
          'Mantiene su postura en lo que es de seguridad o salud',
        ],
        senalesAlerta: [
          'Hizo algo que puso en riesgo la salud de otras personas porque se lo ordenaron y lo cuenta como normal',
        ],
      },
      {
        texto:
          'Cuéntame de la última vez que te tocó manejar dinero, mercancía o cosas que no eran tuyas y algo no cuadró. ¿Qué pasó, qué hiciste tú y cómo terminó?',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reportó la diferencia a quien correspondía',
          'Documentó o explicó lo que pasó',
          'No cubrió la diferencia por su cuenta para que no se notara',
        ],
        senalesAlerta: [
          'Se quedó con la diferencia o con mercancía',
          'Escondió el faltante o lo repuso a escondidas para que nadie supiera',
        ],
      },
      {
        texto:
          'Cuéntame de una vez en que viste a un compañero o a un conocido hacer algo indebido (tomar algo, mentir, saltarse una regla importante). ¿Qué pasó, qué hiciste tú y cómo terminó?',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Habla con la persona o con quien corresponde',
          'Distingue lo grave (salud, robo) de una falta menor',
          'No se suma a la conducta',
        ],
        senalesAlerta: [
          'Participó en la conducta o la encubrió activamente',
        ],
      },
      // Autoconciencia
      {
        texto:
          'Cuéntame de la última vez que alguien te corrigió o te criticó por algo que hiciste. ¿Qué te dijo, qué hiciste con eso y qué cambió después?',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe con precisión lo que le dijeron',
          'Reconoce qué parte era cierta',
          'Da un ejemplo concreto de lo que cambió',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una situación reciente en la que la presión o el cansancio te hicieron reaccionar de una forma de la que no te sentiste bien. ¿Qué pasó, qué hiciste y qué hiciste después?',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Identifica qué lo detonó',
          'Repara con la persona afectada',
          'Tiene una estrategia concreta para la siguiente vez',
        ],
        senalesAlerta: ['Relata haber agredido físicamente a alguien y no lo ve como un problema'],
      },
      {
        texto:
          'Cuéntame de algo que aprendiste a hacer y que al principio te costaba mucho. ¿Qué era lo difícil para ti, qué hiciste y cómo te fue?',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Nombra con honestidad su punto débil',
          'Describe cómo practicó o pidió ayuda',
          'Sabe en qué todavía necesita mejorar',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Vas en tu tercera semana en la línea y todavía te cuesta sacar a tiempo la estación en las noches fuertes; el viernes se te juntaron las comandas dos veces. ¿Qué haces?',
        eje: 'autoconciencia',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Reconoce el problema sin esperar a que se lo digan',
          'Pide retroalimentación o ayuda concreta al responsable',
          'Propone algo para mejorar (mejor mise en place, practicar)',
        ],
        senalesAlerta: [],
      },
      // Ética de trabajo
      {
        texto:
          'Cuéntame de la última vez que terminaste una tarea pesada o aburrida aunque nadie te estaba revisando. ¿Qué era, qué hiciste y cómo quedó?',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'La terminó completa y bien hecha',
          'Explica por qué importaba hacerla bien',
          'No dejó trabajo para el siguiente',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez en que se te hizo tarde o no pudiste llegar a un compromiso (trabajo, escuela, algo con tu familia). ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Avisó antes y por el medio correcto',
          'Buscó cómo cubrir lo que dejó pendiente',
          'Tomó medidas para que no se repita',
        ],
        senalesAlerta: ['Relata faltar sin avisar como algo habitual y sin consecuencia para él'],
      },
      {
        texto:
          'Cuéntame de la última vez que hiciste algo más allá de lo que te tocaba para que el trabajo de tu equipo saliera. ¿Qué pasó, qué hiciste tú y cómo terminó?',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe una acción concreta propia',
          'Lo hizo sin descuidar su propia tarea',
          'No lo usa para quejarse de los demás',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Al cierre, ya cambiado para irte, ves que tu estación quedó con la tabla sucia y una charola de pico de gallo sin tapar en la mesa fría. El cocinero del turno siguiente ya llegó. ¿Qué haces?',
        eje: 'etica_trabajo',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Regresa a dejar su estación limpia y el producto tapado y etiquetado',
          'Si no puede, lo entrega explícitamente al siguiente',
          'Reconoce que el cierre de la estación es suyo',
        ],
        senalesAlerta: [],
      },
      // Empatía
      {
        texto:
          'Cuéntame de la última vez que notaste que alguien cercano (compañero, familiar, amigo) la estaba pasando mal sin que te lo dijera. ¿Qué notaste, qué hiciste y cómo terminó?',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe señales concretas que observó',
          'Se acercó o ayudó de forma respetuosa',
          'Respetó lo que la otra persona quiso',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez en que tuviste que trabajar o convivir con alguien que te caía mal. ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Intenta entender la postura del otro',
          'Separa la relación personal del trabajo',
          'Logra un acuerdo o una forma de trabajar juntos',
        ],
        senalesAlerta: ['Relata haber humillado o saboteado a esa persona'],
      },
      {
        texto:
          'Cuéntame de la última vez que le enseñaste algo a alguien que no sabía. ¿Qué le enseñaste, cómo lo hiciste y cómo le fue?',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Adapta la explicación a la persona',
          'Tiene paciencia con los errores',
          'Comprueba que la persona aprendió',
        ],
        senalesAlerta: ['Relata burlarse o humillar a quien aprendía'],
      },
      {
        texto:
          'Un mesero llega al pase alterado porque su mesa lleva 30 minutos esperando, y te reclama a ti en voz alta aunque el retraso fue de otra estación. ¿Qué haces?',
        eje: 'empatia',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Entiende la presión del mesero sin engancharse',
          'Le da un dato útil (cuándo sale) o lo dirige al responsable',
          'Deja la aclaración para después del servicio',
        ],
        senalesAlerta: [],
      },
      // Curiosidad (sin alertas)
      {
        texto:
          'Cuéntame de la última vez que quisiste entender por qué algo funcionaba de cierta forma (una receta, una herramienta, un aparato) y te pusiste a averiguarlo. ¿Qué hiciste y qué descubriste?',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe cómo buscó la respuesta (preguntó, probó, leyó)',
          'Explica lo que aprendió con detalle',
          'Lo aplicó después',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de algo que aprendiste por tu cuenta en el último año, sin que nadie te lo pidiera. ¿Qué fue, cómo lo aprendiste y para qué te ha servido?',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Nombra algo concreto',
          'Describe un método de aprendizaje',
          'Muestra uso práctico',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que encontraste una forma más rápida o mejor de hacer una tarea que repetías seguido. ¿Qué cambiaste y qué resultado tuvo?',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Identificó el problema por observación',
          'Probó el cambio antes de adoptarlo',
          'Lo compartió o lo propuso a quien decide',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Entra a la carta un platillo regional que nunca has cocinado, con una técnica que no conoces. Faltan dos semanas para que salga. ¿Qué haces?',
        eje: 'inteligencia_curiosa',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Pide la receta estándar y que se la demuestren',
          'Practica antes del servicio',
          'Pregunta el porqué de la técnica o el origen del platillo',
        ],
        senalesAlerta: [],
      },
      // Optimismo (sin alertas)
      {
        texto:
          'Cuéntame de la última vez que algo te salió muy mal y aun así tuviste que seguir con lo que estabas haciendo. ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Se recupera y sigue con foco',
          'Ve qué puede hacer en vez de lamentarse',
          'Saca un aprendizaje',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez en que tu actitud ayudó a que un grupo (equipo, familia, amigos) saliera de un momento difícil. ¿Qué pasó y qué hiciste tú?',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe una acción concreta suya',
          'Anima sin negar el problema',
          'Se enfoca en lo que sí se podía hacer',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que ayudaste a alguien sin que te lo pidiera y sin esperar nada a cambio. ¿Qué pasó y qué hiciste?',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Ayuda concreta y desinteresada',
          'Le importa cómo quedó la otra persona',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Es sábado, van tres horas de servicio sin parar, se descompuso una freidora y tus compañeros empiezan a quejarse en voz alta. Faltan dos horas para cerrar. ¿Qué haces?',
        eje: 'optimismo_bondadoso',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Mantiene el ánimo y el ritmo sin negar el problema',
          'Ofrece ayuda o una solución práctica',
          'Contagia calma al equipo',
        ],
        senalesAlerta: [],
      },
    ],
  },
}
