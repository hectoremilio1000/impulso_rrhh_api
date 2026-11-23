import type { ExamenPuesto } from '#services/exam_catalog/types'

// Examen de Chef / chef ejecutivo / chef gerente (catálogo 2026-11-16).
//
// Puesto de DIRECCIÓN culinaria: además de responder por la operación de la
// cocina, diseña y cambia la carta con criterio de costo y operación
// (ingeniería de menú), fija los estándares (fichas, porciones, inocuidad),
// desarrolla al equipo, elige proveedores estratégicos y prepara la cocina
// para las auditorías sanitarias. Decide recetas y carta dentro del
// presupuesto; escala al dueño o al gerente lo que lo excede.
//
// Sustituye al banco «Chef» del front (questionBank.ts, chef_manager), que
// presuponía experiencia en el puesto («eres el Chef nuevo», «llevas 3
// meses»), tenía preguntas de 3 a 4 subpreguntas y duplicaba escenarios de
// Subgerente. Ninguna pregunta de aquel banco se reutiliza.
//
// La operación diaria del turno se evalúa en el examen de Encargado de cocina
// (kitchen_manager); aquí solo aparece cuando hay una decisión de dirección
// (presupuesto, auditoría). Nota completa: docs/examenes/puestos/chef_manager.md

export const EXAMEN_CHEF_MANAGER: ExamenPuesto = {
  code: 'chef_manager',
  label: 'Chef',
  aliases: [
    'chef',
    'chef ejecutivo',
    'chef ejecutiva',
    'chef gerente',
    'executive chef',
    'chef corporativo',
  ],
  tareas: [
    'Diseñar y cambiar la carta con ingeniería de menú (popularidad y margen de contribución)',
    'Costear platillos nuevos y proponer su precio con el porcentaje de costo objetivo',
    'Controlar el costo de alimentos: real contra teórico, y corregir la diferencia',
    'Fijar estándares de receta, porción y montaje que se cumplan en todos los turnos',
    'Desarrollar al equipo: elegir y preparar responsables de turno',
    'Elegir y negociar con proveedores estratégicos y resolver desabasto',
    'Preparar la cocina para auditorías y verificaciones sanitarias',
    'Lanzar cambios de carta: fichas, sistema, inventario, capacitación de cocina y piso',
    'Decidir dentro del presupuesto y escalar al dueño o al gerente lo que lo excede',
  ],
  facultades: {
    decide: [
      'Todo lo que decide el Encargado de cocina en el turno',
      'Crear y modificar recetas, fichas técnicas, porciones y montajes dentro del porcentaje de costo objetivo',
      'Proponer altas y bajas de la carta con su análisis de ingeniería de menú',
      'Elegir entre proveedores aprobados, pedir muestras y cambiar de proveedor dentro del presupuesto',
      'Fijar los estándares sanitarios de la cocina y el plan para corregir hallazgos',
      'Diseñar la capacitación y el plan de desarrollo del equipo de cocina',
    ],
    escala: [
      'Precios de venta de la carta (los autoriza el dueño)',
      'Gastos, reparaciones o equipo que excedan el presupuesto asignado',
      'Contratos nuevos con proveedores que cambien condiciones de pago o comprometan volumen fuera de presupuesto',
      'Contrataciones, despidos, sanciones, cambios de sueldo y nombramientos formales',
      'Cambios que alteren lo que la carta promete al cliente sin cambiar la descripción',
      'Trato con autoridades sanitarias y cierre total o parcial del restaurante',
    ],
    pendientesOperador: [
      'Si La Llorona tiene hoy un puesto de Chef distinto del Encargado de cocina (las vacantes reales listadas son Encargado y Subencargado de cocina)',
      'Quién autoriza los precios de venta: el examen supone que el dueño',
      'Porcentaje de costo objetivo de alimentos de la casa (el examen no da uno; lo pide como criterio)',
      'Presupuestos del Chef: el de mantenimiento de la pregunta 10 ($12,000 al mes, con $4,000 disponibles) es ilustrativo',
      'Las ventas, precios y costos de las preguntas 1 a 4, 6 y 8 son ilustrativos, no datos de La Llorona',
      'Método de ingeniería de menú de la casa (el examen usa margen de contribución contra el promedio ponderado y popularidad contra el 70 % de la participación esperada)',
      'Qué verificación sanitaria aplica (COFEPRIS, Distintivo H u otra) y sus fechas',
      'Si el mole negro de la carta se anuncia «con chocolate de metate» y lleva chilhuacle (el enunciado lo da como dato)',
      'Umbral de aprobado 70: el mismo que Subgerente mientras no haya un criterio del operador',
      'Presupuesto de insumos del Chef y quién autoriza un aumento de costo por desabasto (pregunta 8: el enunciado no da el presupuesto ni cuánto falta para la próxima cosecha)',
    ],
  },
  practico: {
    version: 'banco_chef_manager_v1',
    umbralAprobado: 70,
    dimensiones: [
      { id: 'direccion_carta', nombre: 'Dirección de la carta e ingeniería de menú', peso: 35 },
      { id: 'costos_control', nombre: 'Costo de alimentos y presupuesto', peso: 25 },
      { id: 'estandares_inocuidad', nombre: 'Estandarización y auditoría sanitaria', peso: 20 },
      { id: 'equipo_proveedores', nombre: 'Desarrollo del equipo y proveedores estratégicos', peso: 20 },
    ],
    preguntas: [
      {
        tipo: 'numerica',
        q: 1,
        enunciado:
          'Estos son los cinco platos fuertes de la carta con lo que se vendió el mes pasado (precios y costos sin IVA): cochinita pibil, 600 órdenes, precio $180, costo $54; enchiladas suizas, 520 órdenes, precio $150, costo $60; mole negro, 150 órdenes, precio $240, costo $72; pescado a la talla, 80 órdenes, precio $260, costo $160; tlayuda, 250 órdenes, precio $170, costo $45. ¿Cuál es el margen de contribución promedio ponderado por orden de este grupo? Contesta en pesos.',
        dimension: 'direccion_carta',
        evalua: 'Calcular el margen de contribución promedio ponderado, base de la ingeniería de menú',
        tareaReal: 'Ingeniería de menú',
        indispensable: false,
        clave: 116.78,
        tolerancia: 0.5,
        unidad: 'pesos',
        solucion:
          'Margen por orden (precio − costo): cochinita 126, suizas 90, mole 168, pescado 100, tlayuda 125. Margen total: 600×126 = 75,600; 520×90 = 46,800; 150×168 = 25,200; 80×100 = 8,000; 250×125 = 31,250; suma 186,850. Órdenes: 1,600. 186,850 / 1,600 = $116.78. Error típico: promediar los cinco márgenes sin ponderar ($121.80).',
      },
      {
        tipo: 'abierta',
        q: 2,
        enunciado:
          'Estos son los cinco platos fuertes con lo vendido el mes pasado (sin IVA): cochinita pibil, 600 órdenes, precio $180, costo $54; enchiladas suizas, 520 órdenes, precio $150, costo $60; mole negro, 150 órdenes, precio $240, costo $72; pescado a la talla, 80 órdenes, precio $260, costo $160; tlayuda, 250 órdenes, precio $170, costo $45. El dueño quiere quitar dos de estos platos para acortar la carta y mejorar el margen. ¿Qué le propones y por qué?',
        dimension: 'direccion_carta',
        evalua: 'Decidir cambios de carta con popularidad y margen de contribución',
        tareaReal: 'Ingeniería de menú y cambios de carta',
        indispensable: true,
        esenciales: [
          {
            id: 'clasifica',
            texto:
              'Compara cada plato por popularidad y por margen de contribución en pesos (contra el promedio ponderado, cerca de $117, o con la contribución total de cada plato: órdenes × margen), no solo por precio o por porcentaje de costo',
          },
          {
            id: 'estrellas',
            texto: 'Mantiene la cochinita y la tlayuda (se venden mucho y dejan margen arriba del promedio)',
          },
          {
            id: 'pescado',
            texto:
              'Propone sacar o rediseñar el pescado a la talla (poca venta y margen bajo), considerando la merma y la estación que ocupa',
          },
          {
            id: 'suizas',
            texto:
              'No saca las enchiladas suizas por su porcentaje de costo: se venden mucho; propone bajar su costo o ajustar su precio',
          },
          {
            id: 'mole',
            texto:
              'Al mole (margen alto, poca venta) intenta impulsarlo (lugar en la carta, descripción, recomendación de meseros) antes de quitarlo, o justifica sacarlo por su costo de operación',
          },
          {
            id: 'presenta',
            texto:
              'Presenta al dueño la propuesta con el efecto estimado en el margen y le deja la decisión de precios',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Proponer quitar solo el pescado y explicar con números por qué quitar un segundo plato bajaría el margen total',
          'Proponer una segunda baja provisional (por ejemplo el mole) con condiciones: periodo de prueba y medición de a qué platos se pasan sus clientes',
          'Analizar con contribución total, complejidad de operación y escenarios de sustitución en lugar de cuadrantes, si llega a una propuesta sustentada',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'numerica',
        q: 3,
        enunciado:
          'Datos de alimentos del mes de octubre: inventario inicial $85,000; compras $160,000; inventario final $90,000; ventas de alimentos sin IVA $500,000. ¿Cuál fue el porcentaje de costo real de alimentos del mes? Contesta en porcentaje.',
        dimension: 'costos_control',
        evalua: 'Calcular el costo real de alimentos con inventarios y compras',
        tareaReal: 'Control del costo de alimentos',
        indispensable: false,
        clave: 31,
        tolerancia: 0.2,
        unidad: '%',
        solucion:
          'Consumo = inicial + compras − final = 85,000 + 160,000 − 90,000 = 155,000. 155,000 / 500,000 = 31.0 %. Error típico: usar solo las compras (32 %) o sumar el inventario final (67 %).',
      },
      {
        tipo: 'abierta',
        q: 4,
        enunciado:
          'Durante tres meses el costo real de alimentos ha salido entre 33 % y 34 %, mientras que el costo teórico que da el sistema con las recetas cargadas es de 28 %. Los precios de compra subieron alrededor de 4 % en ese tiempo. ¿Cómo encuentras de dónde viene la diferencia y qué haces?',
        dimension: 'costos_control',
        evalua: 'Explicar y cerrar la brecha entre costo real y teórico',
        tareaReal: 'Control del costo de alimentos',
        indispensable: true,
        esenciales: [
          {
            id: 'precios',
            texto:
              'Actualiza el costo de las recetas con los precios actuales para separar cuánto de la diferencia es precio y cuánto es operación',
          },
          {
            id: 'recetas',
            texto:
              'Revisa que las recetas del sistema coincidan con las fichas y con lo que se prepara (gramajes, porciones)',
          },
          {
            id: 'fugas',
            texto:
              'Compara mermas, cortesías, comida de personal, cancelaciones y devoluciones contra la diferencia',
          },
          {
            id: 'alto_valor',
            texto:
              'Enfoca la búsqueda en los insumos de mayor costo, con conteos más frecuentes y consumo teórico contra real por insumo',
          },
          {
            id: 'recepcion',
            texto: 'Revisa la recepción: pesos y precios facturados contra lo pedido y lo recibido',
          },
          {
            id: 'plan',
            texto:
              'Fija acciones con responsables, vuelve a medir en el siguiente cierre e informa al dueño o al gerente',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Proponer al dueño un ajuste de precios una vez demostrado que la diferencia viene del precio de los insumos',
        ],
        erroresCriticos: [
          {
            id: 'maquilla',
            texto:
              'Ajusta inventarios o recetas en el sistema para que el costo real se acerque al teórico sin corregir la causa',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 5,
        enunciado:
          'El dueño quiere chiles en nogada en la carta de agosto y septiembre. Es un platillo de mucha mano de obra, con insumos de temporada como la granada y la nuez de Castilla, y la cocina ya va al límite los viernes. ¿Cómo decides si entra a la carta y en qué condiciones?',
        dimension: 'direccion_carta',
        evalua: 'Evaluar un platillo nuevo por costo, operación y abasto antes de proponerlo',
        tareaReal: 'Diseño y cambios de carta',
        indispensable: false,
        esenciales: [
          {
            id: 'costeo',
            texto:
              'Hace la ficha técnica costeada con el rendimiento real (pelado de nuez, merma de chile) y calcula el precio necesario para el costo objetivo (o pide ese objetivo y presenta escenarios de precio)',
          },
          {
            id: 'prueba',
            texto: 'Hace una prueba de producción para medir el tiempo de preparación y de montaje por orden',
          },
          {
            id: 'capacidad',
            texto:
              'Define cómo se produce sin saturar la línea (producción adelantada, estación, límite de órdenes por servicio o días de venta)',
          },
          {
            id: 'abasto',
            texto:
              'Asegura abasto y precio de los insumos de temporada (cotiza, acuerda volumen, plan si se acaban)',
          },
          {
            id: 'conservacion',
            texto:
              'Define la conservación del relleno y de la nogada (frío, vida útil, etiquetas)',
          },
          {
            id: 'propone',
            texto:
              'Presenta al dueño costo, precio sugerido y condiciones; el precio final lo autoriza él',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: ['Proponer venderlo solo ciertos días o con un número limitado de órdenes'],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 6,
        enunciado:
          'La ficha del suadero marca 140 g de carne por orden. Pesas diez órdenes de distintos turnos y salen entre 110 g y 180 g. Se venden unas 900 órdenes al mes. ¿Qué haces para que la porción sea la misma en todos los turnos?',
        dimension: 'estandares_inocuidad',
        evalua: 'Estandarizar una porción con medición, herramienta y control continuo',
        tareaReal: 'Estandarización de recetas y porciones',
        indispensable: false,
        esenciales: [
          {
            id: 'impacto',
            texto:
              'Dimensiona el costo de la variación (gramos de más por orden × órdenes × costo por gramo), con la fórmula o pidiendo el costo por gramo y una muestra mayor',
          },
          {
            id: 'causa',
            texto:
              'Busca la causa por turno (sin báscula, sin porcionado previo, utensilio inadecuado, se sirve al ojo)',
          },
          {
            id: 'herramienta',
            texto:
              'Pone una herramienta que haga fácil acertar (porcionado previo pesado, báscula en la estación o utensilio de medida)',
          },
          {
            id: 'capacita',
            texto: 'Enseña el estándar a todos los turnos con la ficha y la foto de montaje',
          },
          {
            id: 'control',
            texto: 'Mide de forma continua (pesaje al azar por turno) y da seguimiento',
          },
        ],
        minimoCorrecta: 3,
        nucleo: ['herramienta'],
        alternativasValidas: [
          'Revisar si 140 g es la porción correcta y, si conviene cambiarla, actualizar ficha y costo',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 7,
        enunciado:
          'Necesitas a alguien que quede como responsable de la cocina en el turno de la noche. Hay dos candidatos internos: el cocinero con más antigüedad, que es el más rápido de la línea pero no sigue las fichas y les grita a los ayudantes; y una cocinera con dos años en la casa, cuidadosa con las recetas y los registros, a la que le cuesta dar órdenes. ¿Qué decides y cómo preparas a quien elijas?',
        dimension: 'equipo_proveedores',
        evalua: 'Elegir y desarrollar a un responsable de turno con criterio de mando',
        tareaReal: 'Desarrollo del equipo',
        indispensable: false,
        esenciales: [
          {
            id: 'criterio',
            texto:
              'Decide con criterios del puesto (cumplir y hacer cumplir estándares, trato al equipo, confiabilidad), no solo por velocidad o antigüedad',
          },
          {
            id: 'trato',
            texto:
              'Le marca al cocinero, en privado, que gritarle a los ayudantes no se tolera, y no le da mando sin que lo corrija',
          },
          {
            id: 'plan',
            texto:
              'Da a quien elige un plan de desarrollo con al menos una meta verificable y un plazo («lo voy a apoyar» solo no basta)',
          },
          {
            id: 'seguimiento',
            texto: 'Revisa avances en fechas fijas y le da retroalimentación',
          },
          {
            id: 'otro',
            texto: 'Explica la decisión al que no fue elegido, con razones y una ruta para crecer',
          },
          {
            id: 'formaliza',
            texto: 'Formaliza el nombramiento y el sueldo con el gerente o el dueño',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Un periodo de prueba con metas antes del nombramiento definitivo',
        ],
        erroresCriticos: [
          {
            id: 'premia_maltrato',
            texto:
              'Le da el mando al cocinero que grita a los ayudantes sin exigirle cambiar esa conducta',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 8,
        enunciado:
          'Tu proveedor de chiles secos avisa que este año no podrá surtir chilhuacle negro por mala cosecha, y el que queda en el mercado cuesta el triple. Es la base del mole negro de la carta. Tienes inventario para unas tres semanas. ¿Qué haces?',
        dimension: 'equipo_proveedores',
        evalua: 'Resolver el desabasto de un insumo estratégico sin perder el platillo ni el costo',
        tareaReal: 'Proveedores estratégicos',
        indispensable: false,
        esenciales: [
          {
            id: 'dimensiona',
            texto:
              'Estima cuánto chile necesita hasta la próxima cosecha (con el consumo actual y un supuesto explícito del plazo) y cuánto cuesta el mole con el precio nuevo',
          },
          {
            id: 'alternos',
            texto:
              'Busca proveedores alternos (productores, otros mercados) y pide muestras y condiciones (factura, entrega, calidad)',
          },
          {
            id: 'prueba',
            texto:
              'Prueba sustitutos o mezclas con receta estandarizada y los compara con el mole actual (degustación, a ciegas si puede)',
          },
          {
            id: 'decide',
            texto:
              'Si el costo queda dentro del presupuesto lo resuelve; si se sale, lo escala al dueño o al gerente con opciones (precio, rendimiento, sacarlo por temporada)',
          },
          {
            id: 'actualiza',
            texto: 'Actualiza ficha y costo, y avisa a piso de cualquier cambio en el platillo',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Comprar ya el chile de la temporada si el presupuesto lo permite y se conserva bien',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 9,
        enunciado:
          'En una revisión interna, tres semanas antes de la verificación sanitaria, encuentras: termómetros sin calibrar, etiquetas de fecha que faltan en la mitad de los recipientes de la cámara, la bitácora de desinfección de frutas y verduras vacía desde hace cinco días, la misma tabla para carne cruda y para verdura, y dos cocineros sin el curso de manejo higiénico de alimentos. ¿Qué haces?',
        dimension: 'estandares_inocuidad',
        evalua: 'Priorizar hallazgos sanitarios por riesgo y corregir el sistema, no solo el papel',
        tareaReal: 'Auditoría sanitaria',
        indispensable: true,
        esenciales: [
          {
            id: 'riesgo',
            texto:
              'Corrige hoy lo que pone en riesgo a los clientes (tablas separadas para crudo y verdura, desinfección de verduras) antes que el papeleo',
          },
          {
            id: 'plan',
            texto: 'Arma un plan con responsable y fecha para cada hallazgo',
          },
          {
            id: 'causa',
            texto:
              'Busca por qué se dejaron de hacer bitácoras y etiquetas (responsable, material, tiempo) y corrige esa causa',
          },
          {
            id: 'capacita',
            texto: 'Capacita al equipo y programa el curso para los dos cocineros',
          },
          {
            id: 'verifica',
            texto: 'Repite la revisión antes de la verificación para comprobar que se sostiene',
          },
          {
            id: 'registros',
            texto: 'Lleva las bitácoras al día desde ahora, sin llenar los días vacíos',
          },
          {
            id: 'calibra',
            texto:
              'Calibra los termómetros (agua con hielo o de referencia) o los reemplaza por termómetros calibrados',
          },
          {
            id: 'recipientes',
            texto:
              'Revisa los recipientes sin etiqueta: desecha lo que no puede fechar con certeza y etiqueta lo nuevo con la fecha real',
          },
        ],
        minimoCorrecta: 4,
        nucleo: ['riesgo'],
        alternativasValidas: [],
        erroresCriticos: [
          {
            id: 'rellena',
            texto: 'Llena las bitácoras de los días pasados con datos que no se tomaron',
          },
          {
            id: 'tabla',
            texto: 'Sigue usando la misma tabla para crudo y verdura hasta la verificación',
          },
          {
            id: 'inventa_fecha',
            texto:
              'Etiqueta con una fecha inventada los recipientes sin historia para seguir usándolos',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 10,
        enunciado:
          'El jueves en la tarde se descompone la plancha principal. El técnico cotiza $9,500 por repararla hoy o $65,000 por una nueva. Al presupuesto de mantenimiento del mes le quedan $4,000, y el viernes y el sábado son los días de más venta. ¿Qué decides y qué haces?',
        dimension: 'costos_control',
        evalua: 'Sostener el servicio y escalar un gasto que excede el presupuesto',
        tareaReal: 'Presupuesto y escalamiento al dueño o gerente',
        indispensable: false,
        esenciales: [
          {
            id: 'contingencia',
            texto:
              'Arma un plan para el servicio sin plancha (otros equipos, producción adelantada, platillos que se mueven de estación)',
          },
          {
            id: 'piso',
            texto: 'Le dice a piso qué platillos salen, cuáles tardan más y cuáles se suspenden',
          },
          {
            id: 'escala',
            texto:
              'Escala la reparación al gerente o al dueño porque excede lo disponible, con las cotizaciones (si además estima lo que cuesta no tenerla el fin de semana, mejor, pero no es requisito)',
          },
          {
            id: 'recomienda',
            texto: 'Recomienda una opción con razones (reparar hoy o comprar)',
          },
          {
            id: 'seguridad',
            texto: 'No usa la plancha si la falla es de gas o eléctrica con riesgo',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: ['Pedir otra cotización rápida antes de decidir'],
        erroresCriticos: [
          {
            id: 'gasta',
            texto: 'Autoriza por su cuenta la reparación o la compra aunque excede el presupuesto',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 11,
        enunciado:
          'La carta nueva entra en diez días: salen cuatro platillos y entran seis. ¿Cómo preparas a la cocina y al resto del restaurante para que el primer fin de semana salga bien?',
        dimension: 'direccion_carta',
        evalua: 'Lanzar un cambio de carta de punta a punta',
        tareaReal: 'Cambios de carta',
        indispensable: false,
        esenciales: [
          {
            id: 'fichas',
            texto:
              'Tiene las fichas técnicas de los seis platillos listas (costeo y montaje)',
          },
          {
            id: 'alergenos',
            texto: 'Identifica los alérgenos de cada platillo nuevo y los deja en la ficha',
          },
          {
            id: 'sistema',
            texto:
              'Da de alta en el sistema los platillos con precios autorizados y recetas, y da de baja los que salen',
          },
          {
            id: 'inventario',
            texto:
              'Agota el inventario de los platillos que salen y asegura proveedores e insumos de los nuevos',
          },
          {
            id: 'cocina',
            texto:
              'Dirige él la práctica de producción y montaje de los platillos nuevos con la cocina antes del lanzamiento (pasársela al dueño no cuenta)',
          },
          {
            id: 'piso',
            texto:
              'Hace una degustación con meseros para que conozcan ingredientes, alérgenos y cómo describirlos',
          },
          {
            id: 'mide',
            texto:
              'Después del lanzamiento revisa tiempos de salida, devoluciones y ventas por platillo, y corrige',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: ['Lanzar los platillos en dos etapas'],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 12,
        enunciado:
          'El dueño te pide bajar cinco puntos el costo del mole negro sin cambiar el precio. Su idea es cambiar el chocolate de metate de la receta por chocolate de mesa industrial y servir una pieza de pollo más chica. La carta describe el platillo «con chocolate de metate». ¿Qué haces?',
        dimension: 'direccion_carta',
        evalua: 'Bajar el costo de un platillo sin engañar al cliente ni dañar la receta',
        tareaReal: 'Recetas dentro del presupuesto, con escalamiento al dueño',
        indispensable: false,
        esenciales: [
          {
            id: 'costea',
            texto:
              'Calcula cuánto baja el costo cada cambio propuesto y cuánto falta para los cinco puntos',
          },
          {
            id: 'otras',
            texto:
              'Propone otras formas de bajar el costo (rendimiento del mole, compra por volumen, merma, guarnición) y las prueba',
          },
          {
            id: 'degusta',
            texto: 'Prueba los cambios en degustación contra la receta actual antes de decidir',
          },
          {
            id: 'carta',
            texto:
              'No sirve un ingrediente distinto al que anuncia la carta: si cambia el chocolate, cambia la descripción',
          },
          {
            id: 'acuerda',
            texto:
              'Presenta al dueño las opciones con su efecto en costo (y en sabor, si lo probó) para decidir la versión final',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: ['Proponer un ajuste de precio sustentado en el costo'],
        erroresCriticos: [
          {
            id: 'engana',
            texto:
              'Cambia el chocolate de metate por otro y deja la descripción de la carta igual',
          },
        ],
      },
    ],
  },
  competencias: {
    version: 'competencias_chef_manager_v1',
    preguntas: [
      // ── Integridad (todas de experiencia) ──
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que tuviste que presentar resultados de tu trabajo a quien decidía y los números reales te dejaban peor de lo que esperabas: qué pasó, qué presentaste y cómo terminó.',
        senalesPositivas: [
          'Presentó los números reales',
          'Explicó la causa y un plan',
          'Sostuvo la conversación difícil',
        ],
        senalesAlerta: ['Relata haber ajustado o escondido datos para verse mejor'],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que tuviste que elegir entre una opción que te convenía a ti o a alguien cercano y otra que convenía más a la organización o al grupo: qué pasó, qué elegiste y cómo terminó.',
        senalesPositivas: [
          'Reconoció el conflicto de interés',
          'Lo transparentó con quien correspondía',
          'Eligió lo que convenía al grupo o se apartó de la decisión',
        ],
        senalesAlerta: [
          'Relata haber recibido un pago o regalo a cambio de una decisión',
          'Favoreció a un conocido ocultando la relación',
        ],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que prometiste algo y no pudiste cumplirlo: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Avisó en cuanto supo que no cumpliría',
          'Ofreció una alternativa',
          'No inventó excusas',
        ],
        senalesAlerta: ['Relata haber mentido sobre la causa'],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que descubriste que una regla o un control se estaba incumpliendo a tu alrededor y lo más cómodo era no decir nada: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Lo señaló aunque le costara',
          'Propuso cómo corregirlo',
          'Dio seguimiento',
        ],
        senalesAlerta: ['Encubrió una falta que ponía en riesgo a personas o dinero'],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que te dieron crédito por algo en lo que otra persona tuvo una parte importante: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Reconoció públicamente a la otra persona',
          'Fue preciso sobre la parte de cada quien',
        ],
        senalesAlerta: ['Se quedó con el crédito a sabiendas'],
      },
      // ── Autoconciencia ──
      {
        eje: 'autoconciencia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una decisión importante que tomaste y que resultó equivocada: qué decidiste, cómo te diste cuenta y qué hiciste después.',
        senalesPositivas: [
          'Nombra el error sin culpar a otros',
          'Explica qué pasó por alto',
          'Corrigió y cambió su manera de decidir',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'autoconciencia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que alguien con menos experiencia o menor rango que tú te corrigió y tenía razón: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Lo reconoció abiertamente',
          'Le dio crédito a la persona',
          'Cambió lo que hacía',
        ],
        senalesAlerta: ['Relata haber tomado represalias contra quien lo corrigió'],
      },
      {
        eje: 'autoconciencia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de un rasgo de tu forma de trabajar al que la gente a tu alrededor ha tenido que adaptarse: cuál es, cómo te diste cuenta y qué has hecho con eso.',
        senalesPositivas: [
          'Nombra un rasgo concreto, no una virtud disfrazada',
          'Sabe cómo afecta a otros',
          'Describe algo que hace para compensarlo',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'autoconciencia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que te tocó delegar algo que preferías hacer tú mismo: qué era, qué hiciste y cómo resultó.',
        senalesPositivas: [
          'Reconoce por qué le costaba soltarlo',
          'Dio instrucciones y margen a la otra persona',
          'Evalúa con honestidad el resultado',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'autoconciencia',
        tipo: 'hipotetica',
        texto:
          'En la degustación de la carta nueva, tres meseros y dos cocineros dicen que el platillo que tú diseñaste como estrella no les gusta y no lo recomendarían. Se lanza en una semana. ¿Qué haces?',
        senalesPositivas: [
          'Pregunta qué no les gusta en concreto',
          'Separa su gusto personal de la evidencia',
          'Ajusta, prueba de nuevo o lo pospone si la crítica se sostiene',
        ],
        senalesAlerta: [],
      },
      // ── Ética de trabajo ──
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que sostuviste un estándar alto en algo que hacías aunque nadie lo iba a notar: qué era, qué hiciste y qué te costó.',
        senalesPositivas: [
          'Describe el estándar con precisión',
          'Asumió el costo (tiempo, esfuerzo)',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de un proyecto largo que llevaste de principio a fin: qué era, cómo te organizaste y cómo terminó.',
        senalesPositivas: [
          'Describe etapas, fechas y seguimiento',
          'Lo terminó o explica con honestidad por qué no',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que tu equipo o tu grupo no estaba llegando a lo que se había comprometido: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Detectó el atraso a tiempo',
          'Reorganizó el trabajo y se involucró',
          'Avisó a quien esperaba el resultado',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que tuviste que hacer un trabajo de registros, conteos o reportes que no te gustaba: qué era, cómo lo hiciste y qué pasó con eso.',
        senalesPositivas: [
          'Lo hizo completo y a tiempo',
          'Le encontró utilidad o lo mejoró',
        ],
        senalesAlerta: ['Relata haber llenado registros con datos inventados'],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'hipotetica',
        texto:
          'Es domingo en la noche. Para lanzar la carta nueva el lunes faltan dos recetas por probar en producción y por documentar en su ficha técnica. Podrías lanzarlas así y documentarlas después. ¿Qué haces?',
        senalesPositivas: [
          'Termina pruebas y fichas antes de lanzar, o pospone esos dos platillos',
          'Organiza el tiempo o al equipo para lograrlo',
          'Avisa al dueño o al gerente si algo se pospone',
        ],
        senalesAlerta: [],
      },
      // ── Empatía ──
      {
        eje: 'empatia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que tuviste que darle una mala noticia a alguien que dependía de ti: qué pasó, cómo se lo dijiste y cómo terminó.',
        senalesPositivas: [
          'Lo dijo en privado, claro y con razones',
          'Escuchó la reacción',
          'Ofreció lo que sí estaba en sus manos',
        ],
        senalesAlerta: ['Relata haberlo exhibido o humillado frente a otros'],
      },
      {
        eje: 'empatia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que alguien de tu equipo o de tu entorno tenía un problema personal que afectaba lo que hacía: qué notaste, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Se acercó a entender antes de juzgar',
          'Equilibró el apoyo con lo que el equipo necesitaba',
          'Acordó algo concreto y le dio seguimiento',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'empatia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que cambiaste tu forma de explicar algo porque la otra persona no te entendía: qué pasó, qué cambiaste y cómo terminó.',
        senalesPositivas: [
          'Notó que no le entendían sin culpar a la persona',
          'Probó otra forma (mostrar, ejemplo, paso a paso)',
          'Comprobó que quedó claro',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'empatia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que ponerte en el lugar de un cliente o de la persona a la que servías cambió lo que hiciste: qué pasó, qué cambiaste y cómo terminó.',
        senalesPositivas: [
          'Describe qué entendió de la otra persona',
          'El cambio fue concreto',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'empatia',
        tipo: 'hipotetica',
        texto:
          'Tu mejor cocinero te pide el sábado libre para la graduación de su hija. Ese sábado se lanza la carta nueva y ya negaste otros dos permisos para ese día. ¿Qué haces?',
        senalesPositivas: [
          'Reconoce la importancia del evento para él',
          'Busca una solución (cubrir parte del turno, otra persona preparada) con un criterio que pueda explicar a los otros dos',
          'Lo pasa por el gerente si cambia el horario publicado',
        ],
        senalesAlerta: ['Lo amenaza con represalias si falta'],
      },
      // ── Curiosidad (sin señales de alerta) ──
      {
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que probaste una técnica, un ingrediente, una herramienta o una forma de organizarte que nunca habías usado: qué fue, cómo lo probaste y qué aprendiste.',
        senalesPositivas: [
          'Probó de forma ordenada (comparó, midió)',
          'Extrae un aprendizaje concreto',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que fuiste a ver cómo hacía algo otra persona u otro negocio para aprender: qué fuiste a ver, qué aprendiste y qué aplicaste.',
        senalesPositivas: [
          'Buscó activamente la fuente',
          'Adaptó lo aprendido a su contexto',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que unos números o datos te mostraron algo que no esperabas: qué viste, qué hiciste para entenderlo y qué cambió.',
        senalesPositivas: [
          'Investigó antes de concluir',
          'Cruzó la información con otra fuente',
          'Tomó una decisión con lo que encontró',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que te pusiste a entender por qué algo que usabas o hacías todos los días funcionaba como funcionaba: qué era, qué averiguaste y qué hiciste con eso.',
        senalesPositivas: [
          'Buscó la explicación (leyó, preguntó, probó)',
          'Usó lo que entendió para mejorar algo',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'hipotetica',
        texto:
          'Un platillo de la carta se vende bien, pero en el sistema ves que es el que más se devuelve en la noche y casi nunca en la comida. ¿Qué haces?',
        senalesPositivas: [
          'Busca qué cambia entre turnos (quién lo prepara, insumo, tiempos)',
          'Revisa platos devueltos o pregunta a meseros y clientes',
          'Prueba una corrección y vuelve a medir',
        ],
        senalesAlerta: [],
      },
      // ── Optimismo (sin señales de alerta) ──
      {
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que una idea o un proyecto tuyo no funcionó o no te lo aprobaron: qué pasó, qué hiciste después y cómo terminó.',
        senalesPositivas: [
          'Rescató lo aprovechable',
          'Lo intentó de otra forma o con otra idea',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que ayudaste a alguien a mejorar en algo que le costaba: qué hiciste y cómo le fue.',
        senalesPositivas: [
          'Creyó en la capacidad de la persona',
          'Le dio apoyo concreto y sostenido',
          'Celebró el avance',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una época difícil, en un trabajo o en tu vida, en que tuviste que sostener el ánimo de otras personas: qué pasaba, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Fue honesto con la situación',
          'Dio un rumbo concreto',
          'Cuidó a las personas',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que alguien desconfiaba de ti o de tu idea y terminó cambiando de opinión: qué pasó, qué hiciste y cómo terminó.',
        senalesPositivas: [
          'Demostró con hechos, no solo con argumentos',
          'Mantuvo el trato respetuoso',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'hipotetica',
        texto:
          'El dueño rechaza la mitad de tu propuesta de carta nueva por costo, y tu equipo, que trabajó semanas en las pruebas, está desanimado. ¿Qué haces?',
        senalesPositivas: [
          'Reconoce el trabajo del equipo',
          'Rescata lo aprobado y replantea lo rechazado con el costo como reto',
          'Da un siguiente paso concreto',
        ],
        senalesAlerta: [],
      },
    ],
  },
}
