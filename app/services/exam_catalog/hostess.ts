import type { ExamenPuesto } from './types.js'

// Hostess / anfitrión (code 'hostess') — catálogo 2026-11-16; práctico v2
// (2026-11-19): P5, P7, P8, P10 y P11 declaran en el caso la regla de la casa
// que necesitan; P9 sólo cambia la rúbrica (jerarquía hostess → capitán →
// gerente). v2.1 (revisión Codex del v2): P12 declara la regla de objetos
// olvidados; rúbrica de P3, P5, P8, P9, P11 y P12. v2.2: toda regla interna
// del caso dice «Para este ejercicio, supón que…» (también P2); los
// indispensables son los de seguridad de personas (P6, P10, P11). Esas reglas
// son del ejercicio: siguen por confirmar con el operador
// (facultades.pendientesOperador).
//
// Fuentes: «Manual de Introducción Barman» de La Llorona (secciones comunes a
// piso: «Cómo tomar una reserva», «Cómo acompañar y ubicar a un cliente»,
// horarios de servicio, clientes en estado de ebriedad, objetos perdidos,
// pet friendly, organigrama: Runners / Hostess bajo Piso) y
// «Sesion4_Politica_Dinero.md» (quién autoriza cortesías). Lo que no está en
// esas fuentes va en facultades.pendientesOperador.
// Nota por pregunta: docs/examenes/puestos/hostess.md

export const EXAMEN_HOSTESS: ExamenPuesto = {
  code: 'hostess',
  label: 'Hostess',
  aliases: ['hostess', 'host', 'anfitrion', 'anfitriona', 'recepcionista de restaurante', 'recepcion'],
  tareas: [
    'Recibe a cada cliente, confirma reservas y registra a quien llega sin reserva',
    'Lleva la lista de espera y da tiempos de espera honestos',
    'Asigna mesa según número de personas, disponibilidad, preferencia y la carga de cada mesero',
    'Pasa al capitán y al mesero los datos de cada mesa (alergias, celebraciones, necesidades)',
    'Toma reservas y contesta consultas de clientes por teléfono y WhatsApp',
    'Controla la entrada: personas en estado de ebriedad, accesibilidad, objetos perdidos',
  ],
  facultades: {
    decide: [
      'Qué mesa libre asigna a cada grupo dentro de las secciones que repartió el capitán',
      'El orden de la lista de espera y el tiempo de espera que comunica',
      'Tomar, confirmar y liberar reservas según la tolerancia de 15 minutos',
      'Qué contesta a un cliente por WhatsApp con la información de la casa',
      'Registrar y resguardar un objeto perdido siguiendo la política',
      'Negar la entrada a consumir a una persona en estado de ebriedad (supuesto del ejercicio, pregunta 11)',
    ],
    escala: [
      'Cortesías, descuentos o cualquier cosa sin costo para un cliente (las autoriza gerente o subgerente)',
      'Grupos de 10 personas o más sin reserva (visto bueno del capitán; supuesto del ejercicio, pregunta 5)',
      'Una persona en estado de ebriedad que insiste en entrar o se pone agresiva (capitán por radio; gerente o seguridad)',
      'Un cliente molesto que pide compensación (capitán, su jefe directo; por encima, el gerente)',
    ],
    // v2: lo marcado «supuesto del ejercicio» ya va declarado en el caso y deja
    // de ser pendiente para el examen, pero sigue siendo un supuesto: el
    // operador debe confirmar que así es en el restaurante.
    pendientesOperador: [
      'Confirmar el supuesto del ejercicio (pregunta 2): estancia promedio de una mesa de 4 un viernes (el examen usa 90 minutos) y tiempo de montaje (usa 5 minutos)',
      'Último horario para reservar (el manual dice 9 pm) y si sigue vigente «tomamos reservas hasta las 6 pm»',
      'Quién contesta el WhatsApp de reservas y qué sistema de reservas se usa hoy',
      'Confirmar el supuesto del ejercicio (pregunta 11): la hostess puede negar la entrada a consumir por su cuenta y tiene al capitán a la mano por radio',
      'Confirmar el supuesto del ejercicio (pregunta 5): un grupo de 10 personas o más sin reserva necesita el visto bueno del capitán',
      'Confirmar el supuesto del ejercicio (pregunta 7): se permite traer pastel propio sin cargo; cocina lo guarda y lo sirve',
      'Confirmar el supuesto del ejercicio (pregunta 10): la mesa 4, junto a la entrada, es la única sin escalón y el baño accesible está en planta baja (en el caso está libre)',
      'Confirmar la jerarquía usada: la hostess reporta al capitán y el gerente está por encima del capitán (el organigrama la pone en Piso, bajo el capitán)',
      'Confirmar el supuesto del ejercicio (pregunta 12): los objetos olvidados se anotan en la libreta de objetos olvidados y se guardan en caja (el manual pide además reportarlos al encargado en turno o, si no está, foto al grupo de temas generales)',
      'Confirmar el supuesto del ejercicio (pregunta 8): en la lista de espera se llama al grupo dos veces con 5 minutos de diferencia; si no contesta pasa el siguiente; si regresa se le ofrece la siguiente mesa de su tamaño (la tolerancia de 15 minutos es de reservas)',
    ],
  },
  practico: {
    version: 'banco_hostess_v2',
    dimensiones: [
      { id: 'reservas_espera', nombre: 'Reservas y lista de espera', peso: 30 },
      { id: 'asignacion', nombre: 'Asignación de mesas', peso: 20 },
      { id: 'coordinacion', nombre: 'Coordinación con piso', peso: 20 },
      { id: 'comunicacion', nombre: 'Comunicación con clientes', peso: 30 },
    ],
    umbralAprobado: 70,
    preguntas: [
      {
        tipo: 'abierta',
        q: 1,
        enunciado:
          'Viernes, 8:55 pm. Llega la familia Ramírez, que reservó una mesa para 4 a las 9:00. Al mismo tiempo entra detrás de ellos una pareja sin reserva que te pregunta si hay lugar. La única mesa libre es la de 4 que está apartada para los Ramírez; la siguiente mesa de 2 se desocupa en unos 20 minutos. ¿Qué haces?',
        dimension: 'reservas_espera',
        evalua: 'Resolver una reserva y una llegada sin reserva al mismo tiempo sin descuidar a ninguno',
        tareaReal: 'Recepción y confirmación de reservas (Manual: «Cómo acompañar y ubicar a un cliente»)',
        indispensable: false,
        esenciales: [
          {
            id: 'reconoce',
            texto: 'Saluda a la pareja de inmediato y le dice que en un momento la atiende (no la ignora mientras sienta a la familia)',
          },
          {
            id: 'confirma',
            texto: 'Confirma la reserva de los Ramírez (nombre y número de personas) y los sienta en la mesa apartada',
          },
          {
            id: 'mesa_reservada',
            texto: 'No le da a la pareja la mesa reservada',
          },
          {
            id: 'opcion',
            texto: 'Ofrece a la pareja una opción real: unos 20 minutos de espera o un lugar alternativo (barra), dicho con claridad',
          },
          {
            id: 'registra',
            texto: 'Anota a la pareja en la lista de espera con nombre y un dato de contacto (o cómo les avisará)',
            // v2.3: el elemento existe para esos datos; «la anoto» sin ellos no basta.
            partes: ['el nombre', 'un dato de contacto o cómo les avisará'],
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Pedir a un compañero que acompañe a los Ramírez a su mesa mientras ella atiende a la pareja',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'numerica',
        q: 2,
        enunciado:
          'Viernes, 9:00 pm. Llega un grupo de 4 sin reserva. Las tres mesas de 4 del salón están ocupadas: una se sentó a las 8:00, otra a las 8:20 y otra a las 8:40. Para este ejercicio, supón que los viernes una mesa de 4 se queda en promedio 90 minutos y que desocuparla y volver a montarla toma 5 minutos. Ya hay dos grupos de 4 en la lista de espera antes que ellos y no hay otra mesa que les sirva. ¿Cuántos minutos de espera le dirías a este grupo?',
        dimension: 'reservas_espera',
        evalua: 'Estimar una espera con los datos del salón en vez de decir un número al azar',
        tareaReal: 'Lista de espera en horario pico',
        indispensable: false,
        clave: 75,
        tolerancia: 5,
        unidad: 'minutos',
        solucion:
          'Las mesas quedan listas a las 9:35 (8:00 + 90 + 5), 9:55 y 10:15. Los dos grupos que ya esperan toman las de 9:35 y 9:55; a este grupo le toca la de 10:15: 75 minutos desde las 9:00.',
      },
      {
        tipo: 'abierta',
        q: 3,
        enunciado:
          'Un grupo de 6 sin reserva llega a las 9:15 de un sábado. Con lo que tienes en el salón, calculas que su mesa estaría lista en unos 45 minutos. El organizador te dice: «Pero son como 10 minutos, ¿verdad? Es que ya nos dijeron en otro lado que no». ¿Qué le contestas y qué haces?',
        dimension: 'reservas_espera',
        evalua: 'Comunicar una espera honesta y dar opciones mientras esperan',
        tareaReal: 'Lista de espera y comunicación del tiempo real',
        indispensable: false,
        esenciales: [
          {
            id: 'tiempo_real',
            texto:
              'Le dice el tiempo real (unos 45 minutos o un rango cercano), no los 10 que pide; si en algún punto acepta o confirma los 10 minutos, este elemento no cuenta',
          },
          {
            id: 'explica',
            texto: 'Explica brevemente de qué depende (mesas para 6 ocupadas, cuándo se desocupan)',
          },
          {
            id: 'alternativa',
            // v3.11 (VERIFICACION_V24 D2, H C6 P3): «esperar fuera con aviso» es
            // una alternativa, no `actualiza`; sólo «esperar» no lo es (C3).
            texto:
              'Ofrece algo mientras esperan o en lugar de esperar (barra, mesa más chica para empezar si cabe, regresar a una hora, esperar fuera o en otro lugar con aviso cuando su mesa esté lista); ofrecerla sujeta a la política del lugar también cuenta. Sólo invitarlos a esperar no es una alternativa',
          },
          {
            id: 'lista',
            texto: 'Si deciden esperar, los anota en la lista con nombre, número de personas y contacto',
            // v2.3 (cierre): Codex acredita con un solo dato (C5: «tomo su contacto»),
            // no «registro que hay un grupo esperando» (contraste V2-01−).
            partes: ['al menos un dato para identificarlos o avisarles: su nombre o un contacto'],
            // Cierre v3.10 (H C6 P3): «registro su decisión y contacto» se
            // rechazaba como incompleto teniendo el contacto.
            completoSi: '(nombre|contacto|tel[eé]fono|celular|n[uú]mero de (tel|cel)|whats)',
          },
          {
            id: 'actualiza',
            texto:
              'Se compromete a avisarles si el tiempo cambia (o les da seguimiento a mitad de la espera); avisarles sólo cuando su mesa esté lista no es esto, es la alternativa de esperar fuera',
          },
        ],
        minimoCorrecta: 3,
        // v2.1 (Codex): sin el tiempo real no hay "correcta"; omitirlo es
        // parcial, no error crítico.
        nucleo: ['tiempo_real'],
        alternativasValidas: ['Dar un rango (40 a 50 minutos) en vez de un número exacto'],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 4,
        enunciado:
          'Son las 9:00 pm de un viernes. Llega un grupo de 5 que festeja un cumpleaños. Tienes dos mesas libres que les sirven: la 12, en la sección de Ana, y la 20, en la sección de Luis. Ana tiene 4 mesas y acabas de sentarle dos hace 5 minutos; Luis tiene 2 mesas que ya están pidiendo la cuenta. Carla, que entró esta semana, tiene una sola mesa en la sección de al lado. ¿Dónde los sientas y qué haces después de sentarlos?',
        dimension: 'asignacion',
        evalua: 'Asignar mesa según carga y rotación de meseros, y avisar al piso',
        tareaReal: 'Asignación de mesas por secciones (Manual: «Actualizar el plano de las mesas»)',
        indispensable: false,
        esenciales: [
          {
            id: 'carga',
            texto: 'No los sienta con Ana, porque acaba de recibir dos mesas y ya tiene la mayor carga',
          },
          {
            id: 'decision',
            texto: 'Elige la mesa 20 (Luis) o justifica otra opción por la carga y la rotación de los meseros',
          },
          {
            id: 'avisa',
            texto: 'Avisa al mesero que le sentó la mesa de 5 (avisar también al capitán suma, no se exige)',
          },
          {
            id: 'cumple',
            texto: 'Pasa al mesero o al capitán que la mesa festeja un cumpleaños',
          },
          {
            id: 'plano',
            texto: 'Actualiza el plano o la rotación para saber a quién le toca la siguiente mesa',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Consultar con el capitán si a Carla le conviene recibir la mesa con apoyo, siempre que no se la cargue a Ana',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 5,
        enunciado:
          'Sábado, 9:30 pm, el salón está casi lleno. Para este ejercicio, supón que un grupo de 10 personas o más sin reserva necesita el visto bueno del capitán. Entra un grupo de 10 personas sin reserva y el que organiza te dice que quieren estar todos juntos y que van a consumir mucho. Para juntarlos habría que unir tres mesas, dos de ellas ocupadas en este momento. ¿Qué haces?',
        dimension: 'coordinacion',
        evalua: 'Manejar un grupo grande sin reserva en pico: no prometer y coordinar con el responsable',
        tareaReal: 'Control de entrada de grupos grandes',
        indispensable: false,
        esenciales: [
          {
            id: 'no_promete',
            texto: 'No les promete mesa ni tiempo antes de saber si se puede',
          },
          {
            id: 'consulta',
            texto:
              'Consulta al capitán (o al gerente, si el capitán no está) si se puede acomodar al grupo de 10 en este momento',
          },
          {
            id: 'espera_real',
            texto:
              'Pregunta al piso (capitán o meseros) cómo van las mesas que habría que unir y da una estimación solo si tiene con qué; vale decir con honestidad que todavía no puede dar un tiempo (no se exigen minutos)',
          },
          {
            id: 'opciones',
            texto: 'Ofrece opciones honestas: dividir el grupo, esperar con un tiempo real, regresar más tarde o reservar otro día',
          },
          {
            id: 'mesas_actuales',
            texto: 'No apura ni mueve a las mesas que ya están sentadas para hacer lugar',
          },
        ],
        minimoCorrecta: 3,
        // v2: la regla del visto bueno va en el caso. Declinar no la rompe
        // (la regla pide visto bueno para aceptar); aceptar sin él, sí.
        alternativasValidas: [
          'Declinar con amabilidad y ofrecer reservar para otro día: cuenta como «no_promete» y «opciones»; si antes consulta o calcula la espera, suma esos elementos',
        ],
        erroresCriticos: [
          {
            id: 'mueve_clientes',
            texto: 'Le pide a una mesa sentada que se cambie o se vaya para darle lugar al grupo',
          },
          {
            id: 'sin_visto_bueno',
            texto:
              'Le promete o le asigna mesa al grupo de 10 por su cuenta, sin el visto bueno del capitán (o del gerente)',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 6,
        enunciado:
          'A las 7:30 pm revisas las reservas de la noche. Hay una de 12 personas a las 8:30 a nombre de Sofía Mendoza, con estas notas: alergia a la nuez en una persona, una silla para bebé y un cumpleaños. A las 8:10 ves que las mesas para ese grupo todavía no están unidas y que el mesero de esa zona tiene cinco mesas. ¿Qué haces antes de que llegue el grupo?',
        dimension: 'coordinacion',
        evalua: 'Coordinar con capitán y meseros una reserva grande con necesidades especiales',
        tareaReal: 'Preparación de reservas y paso de información al piso',
        indispensable: true,
        motivoIndispensable:
          'Si la alergia a la nuez no llega a cocina y barra, o se le resta importancia, un cliente puede tener una reacción grave (anafilaxia) por un platillo o bebida con nuez o contaminado con ella.',
        esenciales: [
          {
            id: 'capitan',
            texto: 'Avisa al capitán que el montaje para 12 no está listo y que el mesero de esa zona va cargado',
          },
          {
            id: 'alergia',
            texto: 'Pasa al capitán o al mesero la alergia a la nuez para que llegue a cocina y a barra',
          },
          {
            id: 'silla_cumple',
            texto: 'Consigue la silla para bebé y pasa el dato del cumpleaños',
          },
          {
            id: 'confirma',
            texto: 'Confirma antes de las 8:30 que el montaje quedó listo y quién atiende al grupo',
          },
        ],
        minimoCorrecta: 3,
        // Revisión Codex r3: omitir la alergia no es error crítico; sin ella
        // no hay "correcta". Avisar directo a cocina también cumple.
        nucleo: ['alergia'],
        alternativasValidas: [
          'Llamar o escribir a la anfitriona del grupo para confirmar la llegada y el número de personas',
          'Avisar directamente a cocina y barra de la alergia a la nuez',
        ],
        erroresCriticos: [
          {
            id: 'resta_alergia',
            texto:
              'Le resta importancia a la alergia o le asegura al grupo que no habrá nuez sin haberlo confirmado con cocina',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 7,
        enunciado:
          'Aquí no se mide si te sabes de memoria los datos del restaurante, sino qué tan bien le contestas a un cliente con los datos que te damos. Es viernes y te llega este WhatsApp al número del restaurante: «Hola! Somos 8 este sábado, queremos llegar como a las 10:30 pm porque es el cumpleaños de mi hermana. ¿Nos apartan mesa? ¿Nos pueden regalar un pastel? Ah, y vamos con nuestro perrito». Para este ejercicio, supón que estos son los datos de la casa que tienes a la mano: el sábado se abre de 1 pm a 2 am; el último horario para reservar es a las 9 pm; las reservas tienen 15 minutos de tolerancia; el lugar es pet friendly dentro y fuera; los clientes pueden traer su propio pastel sin cargo, cocina lo guarda y lo sirve; cualquier cosa que la casa regale la autoriza solo el gerente. Escribe el mensaje exacto que le enviarías.',
        dimension: 'comunicacion',
        evalua: 'Contestar por escrito con datos correctos, sin prometer lo que no controla y con un siguiente paso',
        tareaReal: 'Reservas por medios electrónicos (Manual: «Cómo tomar una reserva»)',
        indispensable: false,
        esenciales: [
          {
            id: 'horario',
            texto: 'Dice que no puede reservar a las 10:30 porque el último horario de reserva es a las 9 pm, y ofrece reservar a las 9 o antes (o llegar sin reserva sujeto a disponibilidad)',
          },
          {
            id: 'tolerancia',
            texto: 'Menciona la tolerancia de 15 minutos de la reserva',
          },
          {
            id: 'perro',
            texto: 'Confirma que el perro es bienvenido',
          },
          {
            id: 'pastel',
            texto:
              'Sobre el pastel, le dice que pueden traer el suyo sin cargo y que cocina lo guarda y lo sirve (sin prometer que la casa lo regala)',
          },
          {
            id: 'siguiente_paso',
            texto: 'Cierra con un siguiente paso claro: pide los datos para la reserva (nombre, teléfono, alergias) o le pide que confirme el horario',
          },
          {
            id: 'claridad',
            texto: 'El mensaje es cordial, breve y se entiende sin tener que volver a preguntar',
          },
        ],
        minimoCorrecta: 4,
        // Revisión Codex r3: sin resolver el horario (10:30 fuera de reserva)
        // no hay "correcta".
        nucleo: ['horario'],
        alternativasValidas: [
          'Ofrecer un horario de reserva más temprano y, a la vez, explicar que a las 10:30 pueden llegar sin reserva sin garantía de mesa',
          'Además de ofrecer que traigan su pastel, decir que consulta con el gerente si la casa puede tener un detalle, sin prometerlo (cuenta como «pastel»)',
        ],
        erroresCriticos: [
          {
            id: 'promete_cortesia',
            texto: 'Promete que la casa regala el pastel u otra cortesía sin autorización del gerente',
          },
          {
            id: 'garantiza_mesa',
            texto: 'Le confirma una mesa garantizada para 8 a las 10:30 pm',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 8,
        enunciado:
          'Son las 9:40 pm y tienes cinco grupos en lista de espera. Para este ejercicio, supón que la lista de espera funciona así: cuando se libera la mesa de un grupo, se le llama dos veces con 5 minutos de diferencia; si no contesta, la mesa pasa al siguiente de la lista, y si después regresa, se le ofrece la siguiente mesa de su tamaño que se libere. (La tolerancia de 15 minutos es solo para reservas, no para la lista de espera.) Pasan dos cosas. Primera: se desocupa una mesa de 2 y sientas a una pareja que llegó hace 10 minutos; un señor que espera con su grupo de 4 desde hace 35 minutos se te acerca molesto: «¿Por qué ellos pasan antes si llegamos primero?». Segunda: poco después se libera una mesa de 4; le toca al grupo de 4 que está primero en la lista, pero no contesta cuando lo llamas. El grupo del señor es el segundo de la lista. ¿Qué haces con cada una de las dos situaciones?',
        dimension: 'reservas_espera',
        evalua: 'Llevar una lista de espera justa, aplicar la regla de llamadas y explicar el criterio con transparencia',
        tareaReal: 'Lista de espera',
        indispensable: false,
        // v2: dos incidentes separados y la regla de llamadas dada en el caso.
        // Un núcleo por incidente: sin atender ambos no hay "correcta".
        // v2.1 (Codex): `pasa_siguiente` exige la segunda llamada.
        esenciales: [
          {
            id: 'explica',
            texto: 'Al señor le explica con respeto que la mesa que se liberó era de 2 y no les servía a 4, sin discutir',
          },
          {
            id: 'tiempo',
            texto:
              'Al señor le dice su lugar real: su grupo es el segundo para una mesa de 4, detrás de otro grupo; no le garantiza la próxima mesa de 4 (solo le toca si el primero no responde según la regla)',
          },
          {
            id: 'segunda_llamada',
            texto: 'Al primer grupo lo vuelve a llamar una segunda vez, unos 5 minutos después, antes de pasar al siguiente',
          },
          {
            id: 'pasa_siguiente',
            texto:
              'Da la mesa de 4 al siguiente de la lista (el grupo del señor) solo después de la segunda llamada sin respuesta; dársela sin esa segunda llamada no cuenta',
          },
          {
            id: 'reincorpora',
            texto: 'Si el primer grupo regresa después, le ofrece la siguiente mesa de 4 que se libere',
          },
        ],
        minimoCorrecta: 3,
        nucleo: ['explica', 'pasa_siguiente'],
        alternativasValidas: [
          'Ofrecerle al grupo de 4 esperar en la barra mientras se libera su mesa',
          'Buscar también en persona al primer grupo (barra, afuera) además de llamarlo: cuenta como llamada',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 9,
        enunciado:
          'Una clienta llega con tres amigas y dice que reservó ayer por WhatsApp para las 8:00. No aparece en la lista de reservas y el salón está lleno. Ella levanta la voz: «¡Yo sí reservé, tengo el mensaje! Esto es una falta de respeto». ¿Qué haces?',
        dimension: 'comunicacion',
        evalua: 'Atender a un cliente molesto en la entrada, buscar la reserva y dar la mejor salida real',
        tareaReal: 'Recepción y manejo de inconformidades en la entrada',
        indispensable: false,
        esenciales: [
          {
            id: 'escucha',
            texto: 'La escucha sin discutir y se disculpa por la confusión sin culparla',
          },
          {
            id: 'busca',
            texto: 'Busca la reserva (le pide ver el mensaje, revisa otro nombre, otra fecha o el WhatsApp del restaurante)',
          },
          {
            id: 'solucion',
            // v2.1 (Codex): la prioridad depende de lo que se compruebe; no
            // se exige saltarse la lista.
            texto:
              'Le ofrece una opción real acorde con lo que comprobó y con lo que hay (si la reserva se confirma, la siguiente mesa que les sirva; si no, lugar en la lista o barra), siempre con un tiempo honesto',
          },
          {
            id: 'escala',
            // v2: la hostess reporta al capitán; el gerente está por encima.
            texto:
              'Si pide compensación o sigue molesta, llama al capitán (su jefe directo); llamar al gerente o al subgerente también cuenta',
          },
          {
            id: 'registro',
            texto: 'Avisa o anota qué falló con la reserva para que no se repita',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Llamar al capitán desde el inicio mientras ella misma busca la reserva y ofrece una opción real',
        ],
        erroresCriticos: [
          {
            id: 'culpa',
            texto:
              'La culpa, le grita o discute con ella frente a otros clientes, o le afirma que se equivocó sin haberlo comprobado (aclarar con respeto un dato comprobado en el mensaje, como otra fecha, no es error)',
          },
          {
            id: 'promete',
            texto: 'Le promete una cortesía o una mesa que no existe para calmarla',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 10,
        enunciado:
          'Llega una reserva de 3 personas: una de ellas usa silla de ruedas y otra es una señora mayor con bastón. La mesa que tenías asignada para ellos está en una zona con un escalón. Para este ejercicio, supón que la mesa 4, junto a la entrada, es la única sin escalón y en este momento está libre, y que el baño accesible está en planta baja. ¿Qué haces desde que los recibes hasta que se sientan?',
        dimension: 'asignacion',
        evalua: 'Recibir y ubicar a clientes con necesidades de accesibilidad',
        tareaReal: 'Acompañar y ubicar al cliente (Manual: indicar escalones, no adelantarse, caminar despacio)',
        indispensable: true,
        motivoIndispensable:
          'Si no sabe ubicar y acompañar a una persona en silla de ruedas o con bastón, hay riesgo de caída en un escalón y de un trato discriminatorio, prohibido por la ley.',
        // v2: el caso da la mesa accesible y el baño; ya se pueden pedir.
        esenciales: [
          {
            id: 'pregunta',
            texto: 'Les pregunta qué necesitan o prefieren en lugar de suponerlo',
          },
          {
            id: 'mesa',
            texto: 'Cambia la asignación a la mesa 4, la que no tiene escalón',
          },
          {
            id: 'ruta',
            texto: 'Revisa o despeja el camino hasta la mesa (sin obstáculos y con espacio para la silla)',
          },
          {
            id: 'acompana',
            texto: 'Los acompaña a su ritmo, avisando de desniveles',
          },
          {
            id: 'avisa',
            texto: 'Avisa al mesero de la mesa de sus necesidades',
          },
          {
            id: 'bano',
            texto: 'Les dice (o le pasa al mesero) que el baño accesible está en planta baja',
          },
        ],
        minimoCorrecta: 4,
        nucleo: ['mesa'],
        alternativasValidas: [
          'Quitar una silla de la mesa para que la silla de ruedas entre de frente',
          'Si el grupo prefiere otra mesa después de que les explica lo del escalón, respetar su decisión (cuenta como «mesa»)',
        ],
        erroresCriticos: [
          {
            id: 'discrimina',
            texto: 'Les niega la mesa, los manda a un lugar peor o los hace esperar más por la discapacidad',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 11,
        enunciado:
          'Son las 11:30 pm de un sábado. Para este ejercicio, supón que la hostess puede negar la entrada a consumir y que tienes al capitán a la mano por radio. Llegan tres amigos a la entrada. Uno se tambalea, arrastra las palabras y se apoya en la pared; otro te dice: «Nada más vamos por unos mezcales, ahorita se le baja». ¿Qué haces?',
        dimension: 'comunicacion',
        evalua: 'No dejar entrar a consumir alcohol a una persona en evidente estado de ebriedad, con respeto y escalando a tiempo',
        tareaReal: 'Control de entrada y servicio responsable de alcohol (Manual: clientes en estado de ebriedad)',
        indispensable: true,
        motivoIndispensable:
          'Si deja pasar a consumir a una persona en evidente estado de ebriedad, o la saca con fuerza, pone en riesgo su salud y la de otros (intoxicación, riñas, accidentes al salir) y puede exponer al restaurante a una sanción.',
        esenciales: [
          {
            id: 'no_entra',
            texto:
              'No lo deja pasar a consumir alcohol (dejarlo esperar o recibir ayuda sin servirle no es dejarlo consumir)',
          },
          {
            id: 'respeto',
            texto: 'Se lo dice con calma y discreción, sin exhibirlo ni discutir frente a otros',
          },
          {
            id: 'escala',
            texto:
              'Avisa al capitán por radio para coordinarse, o pide apoyo del capitán, el gerente o seguridad si insisten o se ponen agresivos (no se exige para negar la entrada; pedirle al capitán que decida la entrada en su lugar no cuenta)',
          },
          {
            id: 'seguro',
            texto: 'Ofrece una salida segura: agua, llamarles un taxi o invitarlos a regresar otro día',
          },
        ],
        minimoCorrecta: 3,
        nucleo: ['no_entra'],
        alternativasValidas: [
          'Ofrecer que los otros dos entren a cenar si el amigo se va acompañado y seguro',
          'Avisar al capitán por radio mientras ella misma le dice que no puede pasar a consumir (cuenta como «no_entra» y «escala»)',
        ],
        erroresCriticos: [
          {
            id: 'lo_sienta',
            texto: 'Lo deja entrar a consumir alcohol (lo sienta o lo pasa a la barra para que siga tomando)',
          },
          {
            id: 'fuerza',
            texto: 'Lo empuja, lo exhibe o lo humilla para sacarlo',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 12,
        enunciado:
          'Para este ejercicio, supón que los objetos olvidados se anotan en la libreta de objetos olvidados y se guardan en caja. Al limpiar la mesa 7, el mesero te trae un celular y una chamarra que dejó un cliente que ya se fue. Veinte minutos después alguien llama al restaurante y dice que el celular es suyo y que pasa por él en media hora. ¿Qué haces con los objetos y cuando llega esa persona?',
        dimension: 'comunicacion',
        evalua: 'Seguir la política de objetos perdidos y devolverlos sólo a su dueño',
        tareaReal: 'Objetos perdidos (Manual: se reporta al encargado en turno; resguardo en caja)',
        indispensable: false,
        // v2.1 (Codex): la regla de la libreta y la caja va en el caso; el
        // grupo de temas generales y el jefe inmediato ya no se exigen.
        esenciales: [
          {
            id: 'reporta',
            texto: 'Avisa al encargado en turno o al capitán de los objetos encontrados',
          },
          {
            id: 'resguardo',
            texto: 'Los guarda en caja, no en la entrada ni en sus cosas',
          },
          {
            id: 'registro',
            texto: 'Los anota en la libreta de objetos olvidados (qué, en qué mesa, a qué hora y quién lo encontró)',
            // v2.3: son los datos del registro, no opciones (revisión Codex r4).
            partes: ['qué objetos son', 'en qué mesa estaban', 'a qué hora', 'quién los encontró'],
          },
          {
            id: 'verifica',
            texto:
              'Antes de entregar comprueba que es el dueño: que diga, sin que ella se lo sugiera, un dato del objeto (cómo es, qué contiene, o que lo desbloquee) y que su visita coincida con la mesa 7 y el horario (por ejemplo, la reserva de esa mesa a su nombre, con identificación); otras pruebas igual de sólidas también cuentan. La chamarra solo se entrega si también la reclama y la acredita',
          },
          {
            id: 'registra_entrega',
            texto: 'Registra a quién entregó cada objeto y cuándo',
          },
        ],
        minimoCorrecta: 3,
        nucleo: ['verifica'],
        alternativasValidas: [
          'Pedir al encargado que sea él quien haga la entrega, con ella como testigo, siempre que se haga la misma comprobación (que el encargado esté no basta por sí solo)',
        ],
        erroresCriticos: [
          {
            id: 'se_lo_queda',
            texto: 'Se queda con algún objeto o lo guarda en sus cosas',
          },
          {
            id: 'entrega_sin_verificar',
            texto:
              'Dice que entrega el celular o la chamarra con solo que la persona diga que es suyo, sin ninguna comprobación',
          },
        ],
      },
    ],
  },
  competencias: {
    version: 'competencias_hostess_v1',
    preguntas: [
      // ── Integridad (4, todas de experiencia) ──
      {
        texto:
          'Cuéntame de la última vez que encontraste algo que no era tuyo (dinero, un objeto, un pago de más): qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo devolvió o lo entregó a quien correspondía aunque nadie lo habría sabido',
          'Da detalles concretos del hecho (qué, dónde, a quién)',
        ],
        senalesAlerta: ['Se quedó con el objeto o el dinero y lo presenta como algo normal'],
      },
      {
        texto:
          'Cuéntame de una vez que alguien te pidió que dijeras algo que no era cierto (a un cliente, a un jefe, a un familiar): qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Se negó a mentir o buscó una forma honesta de resolver',
          'Reconoce el costo que tuvo decir la verdad',
        ],
        senalesAlerta: ['Mintió para cubrir a alguien en algo que perjudicaba a un tercero y lo ve bien'],
      },
      {
        texto:
          'Cuéntame de la última vez que prometiste algo y después te diste cuenta de que no lo ibas a poder cumplir: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Avisó a tiempo a la persona afectada en lugar de esconderlo',
          'Ofreció una alternativa o reparó el daño',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que viste a alguien de tu trabajo o de tu escuela hacer algo indebido (tomar algo, saltarse una regla importante, tratar mal a alguien): qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Actuó o lo informó a quien correspondía aunque le incomodara',
          'Distingue entre lo grave y lo menor',
        ],
        senalesAlerta: ['Encubrió un robo o un maltrato y lo justifica'],
      },
      // ── Autoconciencia ──
      {
        texto:
          'Cuéntame de la última vez que alguien te hizo una crítica sobre tu forma de tratar a la gente: qué te dijo, qué hiciste tú y cómo terminó.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Repite con precisión la crítica aunque lo deje mal parado',
          'Cuenta un cambio concreto que hizo después',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una situación reciente en la que perdiste la paciencia con alguien: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reconoce su parte sin culpar sólo a la otra persona',
          'Identifica qué lo detona y qué hace ahora distinto',
        ],
        senalesAlerta: ['Relata insultos o agresión física y no los ve como problema'],
      },
      {
        texto:
          'Cuéntame de una vez que te tocó algo que no sabías hacer y tuviste que pedir ayuda: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reconoce el límite de lo que sabía sin minimizarlo',
          'Pidió ayuda a tiempo y aprendió algo concreto',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'En la entrada te das cuenta de que, por apurarte, sentaste a un grupo en una mesa que estaba reservada para otra familia que llega en cinco minutos. ¿Qué haces?',
        eje: 'autoconciencia',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Reconoce el error ante el capitán o quien corresponda en lugar de esconderlo',
          'Busca una solución para la familia antes de que llegue',
        ],
        senalesAlerta: ['Culpa a otro compañero del error'],
      },
      // ── Ética de trabajo ──
      {
        texto:
          'Cuéntame de la última vez que te tocó quedarte o hacer más de lo que te correspondía para terminar algo: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe qué hizo exactamente y por qué era necesario',
          'Lo terminó o lo dejó en buenas manos',
          'Si no podía quedarse, lo entregó explicado a un relevo: vale igual que quedarse (no se premia la disponibilidad por sí sola)',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que tuviste que hacer una tarea repetitiva o aburrida durante mucho tiempo: qué hiciste tú para hacerla bien y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Mantuvo la calidad hasta el final',
          'Encontró una forma de hacerla mejor o más ordenada',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que ibas a llegar tarde a un compromiso importante: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Avisó antes de la hora, con motivo y tiempo estimado',
          'Tomó medidas para que no se repitiera',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Es sábado, la entrada está llena y una compañera te pide que le cubras la lista de espera diez minutos para salir a fumar. Tú ya tienes tres grupos esperando que los atiendas. ¿Qué haces?',
        eje: 'etica_trabajo',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Prioriza a los clientes que esperan y lo dice con claridad',
          'Propone un momento o una forma que no deje la entrada descubierta',
        ],
        senalesAlerta: [],
      },
      // ── Empatía ──
      {
        texto:
          'Cuéntame de la última vez que te diste cuenta de que alguien la estaba pasando mal sin que te lo dijera: qué notaste, qué hiciste tú y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe señales concretas que notó',
          'Hizo algo útil para esa persona, no sólo para sí',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que atendiste o ayudaste a alguien que estaba muy enojado contigo o con tu lugar de trabajo: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Escuchó y entendió qué le molestaba antes de responder',
          'Separó el enojo de la persona del trato que le dio',
        ],
        senalesAlerta: ['Relata que humilló o se burló de la persona'],
      },
      {
        texto:
          'Cuéntame de la última vez que adaptaste tu forma de hablar o de tratar a alguien porque te diste cuenta de que lo necesitaba (una persona mayor, un niño, alguien que no hablaba bien tu idioma): qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe el ajuste concreto que hizo',
          'Se fijó en el resultado para la otra persona',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Un señor llega solo a la entrada, sin reserva, y te dice que es la fecha en que venía cada año con su esposa, que falleció. El salón está lleno y la espera es de 40 minutos. ¿Qué haces?',
        eje: 'empatia',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Reconoce lo que el señor dijo con respeto y sin prisa',
          'Busca una opción real (barra, avisar al capitán) sin prometer lo que no controla',
        ],
        senalesAlerta: [],
      },
      // ── Curiosidad ──
      {
        texto:
          'Cuéntame de la última cosa que aprendiste por tu cuenta, sin que nadie te lo pidiera: qué fue, cómo lo aprendiste y para qué te sirvió.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Nombra algo concreto y cómo lo buscó',
          'Lo aplicó o lo compartió',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que algo se repetía mal (en tu trabajo, en tu casa, en la escuela) y te pusiste a averiguar por qué: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Hizo preguntas o buscó la causa en vez de quedarse con el síntoma',
          'Propuso o probó un cambio',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que te diste cuenta de algo que le gustaba a una persona sin que te lo dijera, y lo usaste para tratarla mejor: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe qué observó y cómo lo conectó',
          'Lo recordó y lo usó después',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Notas que casi todas las noches de viernes la lista de espera se atora entre las 9 y las 10 y la gente se va sin cenar. ¿Qué te gustaría averiguar para entender por qué pasa?',
        eje: 'inteligencia_curiosa',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Propone datos concretos que revisaría (horas de llegada, tiempo por mesa, reservas, tamaño de grupos)',
          'Pregunta a quienes lo viven (meseros, capitán) antes de concluir',
        ],
        senalesAlerta: [],
      },
      // ── Optimismo ──
      {
        texto:
          'Cuéntame de la última vez que algo te salió mal frente a otras personas: qué pasó, qué hiciste tú después y cómo terminó.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Se repuso y siguió con buena disposición',
          'Saca un aprendizaje sin culparse en exceso',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que tu buen ánimo ayudó a que un día difícil saliera mejor para otras personas: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe una acción concreta, no sólo una actitud',
          'Se fija en el efecto que tuvo en los demás',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que alguien fue grosero contigo y aun así terminaste tratándolo bien: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Mantuvo el buen trato sin dejarse humillar',
          'No guardó rencor en su forma de contarlo',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Llevas cuatro horas en la entrada de un sábado lleno, tres clientes seguidos te han hablado de mala manera y todavía llegan más. ¿Cómo recibes al siguiente grupo?',
        eje: 'optimismo_bondadoso',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Describe cómo se recompone antes de recibir al siguiente',
          'Recibe al nuevo grupo sin cargarle lo anterior',
        ],
        senalesAlerta: [],
      },
    ],
  },
}
