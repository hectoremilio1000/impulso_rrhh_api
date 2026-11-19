import type { ExamenPuesto } from '#services/exam_catalog/types'

// Examen de Runner / auxiliar de servicio (catálogo 2026-11-16).
//
// Fuentes: «Manual de Introducción Mesero y Capitan» (La Llorona: checklist de
// apertura mesero/runner, estación del runner, retiro de platos, dirección de
// servicio, "solo el vendedor del rango toma la orden") y
// «Sesion4_Politica_Dinero.md» (el runner no autoriza, solo solicita). Lo que
// no está en ellas va en facultades.pendientesOperador. Nota por pregunta:
// docs/examenes/puestos/runner.md
//
// Alcance: lleva el platillo correcto a la mesa y posición correctas, cuida
// temperatura y alérgenos, comunica cocina y mesero y retira platos. NO toma
// órdenes, NO cobra, NO promete cortesías: pasar eso al mesero o al capitán
// es lo correcto y sí merece crédito. Detener un plato dudoso es facultad
// propia: "se lo dejo al mesero" no la sustituye.

export const EXAMEN_RUNNER: ExamenPuesto = {
  code: 'runner',
  label: 'Runner / auxiliar de servicio',
  aliases: [
    'runner',
    'runners',
    'auxiliar de servicio',
    'auxiliar de meseros',
    'corredor',
    'corredor de platos',
  ],
  tareas: [
    'Montar la estación del runner antes de abrir: salsas en cambro con cama de hielo, limones lavados y lo necesario para el servicio',
    'Revisar en el pase que cada plato coincida con la comanda: mesa, posición, cambios y alergias marcadas',
    'Llevar los platos a la mesa correcta y entregarlos en la posición de cada comensal, por la derecha y a tiempo',
    'Sacar primero lo que pierde temperatura y que cada mesa reciba sus platos juntos',
    'Avisar a cocina y al mesero de cualquier error, faltante o plato dudoso antes de que llegue a la mesa',
    'Retirar platos cuando la mesa terminó, por la izquierda, sin apilar, y llevarlos al descamoche',
    'Pasar al mesero los pedidos, la cuenta y cualquier petición de la mesa (no toma órdenes ni cobra)',
    'Dejar limpia la estación del runner al cierre',
  ],
  facultades: {
    decide: [
      'Detener un plato que no coincide con la comanda, que no está en condiciones o cuya alergia no está confirmada, y regresarlo a cocina',
      'El orden de salida de los platos listos según temperatura y antigüedad',
      'Cuándo y cómo retirar platos sucios, siguiendo el estándar',
      'Pedir apoyo a meseros para bajar una mesa grande al mismo tiempo',
    ],
    escala: [
      'Pedidos, bebidas y la cuenta: al mesero de la mesa (Manual: solo el vendedor del rango toma la orden; solo él baja la cuenta)',
      'Cambios de platillo, sustituciones y precios: al mesero, que lo consulta con la mesa y lo corrige en el POS',
      'Descuentos, cortesías y quejas de dinero: al mesero o al capitán; el runner no autoriza (Política de dinero)',
      'Un accidente con un cliente (derrame, golpe, corte): al capitán o encargado en turno',
    ],
    pendientesOperador: [
      'Cómo se numeran las posiciones de los comensales en La Llorona (desde qué silla y en qué sentido)',
      'Si el máximo de tres platos por persona sin apilar, que el manual da para retirar, aplica también para bajar platos (la pregunta 1 lo da como dato)',
      'Si hay lámpara o zona caliente en el pase para mantener platos mientras se completa una mesa',
      'Si el runner puede llevarse para recalentar o reponer un plato que la mesa reclama, o primero debe avisar al mesero',
      'Si el runner llena el formato de rotos o lo hace el encargado',
      'Cómo marca cocina un plato con alergia al sacarlo al pase (ticket, palillo, plato distinto)',
      'Qué procedimiento sigue cocina para decidir si una salsa del día anterior se usa o se tira, y si al terminar el montaje se manda evidencia (foto) al grupo y a qué hora (pregunta 9)',
      'Si «garrotero» se usa en La Llorona como sinónimo de runner; no se agregó como alias',
      'Los platillos y números de mesa de los casos son ilustrativos',
    ],
  },
  practico: {
    version: 'banco_runner_v1',
    umbralAprobado: 70,
    dimensiones: [
      { id: 'entrega_correcta', nombre: 'Plato correcto a la mesa y posición correctas', peso: 35 },
      { id: 'inocuidad', nombre: 'Temperatura, alérgenos e higiene', peso: 30 },
      { id: 'comunicacion', nombre: 'Comunicación con cocina y mesero, y límites del puesto', peso: 20 },
      { id: 'retiro_seguridad', nombre: 'Retiro de platos y seguridad en el piso', peso: 15 },
    ],
    preguntas: [
      {
        tipo: 'numerica',
        q: 1,
        enunciado:
          'La mesa 20, de 10 personas, pidió sus platos fuertes al mismo tiempo y cocina los está terminando. Para que los diez lleguen juntos y nadie cargue más de tres platos a la vez sin apilarlos, ¿cuántas personas, contándote a ti, se necesitan para bajarlos en un solo viaje?',
        dimension: 'entrega_correcta',
        evalua: 'Organizar la entrega sincronizada de una mesa grande',
        tareaReal: 'Cambio de platos: todos los comensales reciben al mismo tiempo; máximo 3 platos por persona sin apilar (Manual)',
        indispensable: false,
        clave: 4,
        tolerancia: 0,
        unidad: 'personas',
        solucion: '10 platos / 3 por persona = 3.33; se redondea hacia arriba: 4 personas (3 + 3 + 3 + 1, o 3 + 3 + 2 + 2).',
      },
      {
        tipo: 'abierta',
        q: 2,
        enunciado:
          'En el pase te entregan los cuatro platos de la mesa 7. En el ticket, la posición 2 dice: "enmoladas — ALERGIA CACAHUATE". ¿Qué haces con esos platos?',
        dimension: 'inocuidad',
        evalua: 'Asegurar que un plato con alergia llegue preparado como se pidió y a la persona correcta',
        tareaReal: 'Alérgenos marcados en la comanda (Manual: alergias en la orden; chequeo del pedido al recibir los platos)',
        indispensable: true,
        esenciales: [
          {
            id: 'confirma_cocina',
            texto:
              'Confirma con cocina que las enmoladas de la posición 2 se prepararon sin cacahuate antes de llevarlas',
          },
          {
            id: 'separado',
            texto:
              'Lo lleva sin que toque otros platos ni utensilios que lo contaminen, sabiendo cuál es (no se exige una marca concreta)',
          },
          {
            id: 'posicion',
            texto: 'Lo entrega directamente a la persona de la posición 2',
          },
          {
            id: 'avisa_mesa',
            texto: 'Al entregarlo dice que es el plato sin cacahuate, o pide al mesero que lo confirme en la mesa',
          },
          {
            id: 'si_duda',
            texto: 'Si cocina no puede confirmarlo, no lo lleva y pide que se rehaga o se cambie',
          },
        ],
        minimoCorrecta: 4,
        nucleo: ['confirma_cocina'],
        alternativasValidas: [
          'Llevar primero los otros tres y regresar por el de la alergia para entregarlo solo, ya confirmado',
        ],
        erroresCriticos: [
          {
            id: 'sin_confirmar',
            texto: 'Lleva el plato de la alergia sin confirmar con cocina cómo se preparó',
          },
          {
            id: 'posicion_errada',
            texto: 'Deja el plato en el centro o a cualquier comensal para que ellos se lo repartan',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 3,
        enunciado:
          'Llegas a la mesa 12 con tres tacos de cochinita y la mesa te dice que ellos pidieron arrachera. ¿Qué haces?',
        dimension: 'entrega_correcta',
        evalua: 'Corregir un plato o mesa equivocados sin dejar el error en la mesa',
        tareaReal: 'Chequeo del pedido al recibir los platos y entrega a la mesa correcta',
        indispensable: false,
        esenciales: [
          {
            id: 'no_deja',
            texto: 'No deja los tacos en la mesa ni los ofrece "de todos modos"',
          },
          {
            id: 'revisa_ticket',
            texto: 'Revisa el ticket para saber si los tacos eran de otra mesa o si cocina se equivocó',
          },
          {
            id: 'avisa',
            texto: 'Avisa al mesero y a cocina para que la arrachera salga con prioridad',
          },
          {
            id: 'informa',
            texto: 'Le dice a la mesa con honestidad que su platillo viene en camino y que su mesero se acerca',
          },
          {
            id: 'mesa_correcta',
            texto:
              'Si los tacos eran de otra mesa, solo los lleva a la correcta si no llegó a dejarlos en la mesa equivocada (siguieron en su mano) y cocina lo valida; si los dejó o hay duda, los regresa a cocina',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Regresar siempre los tacos a cocina y pedir que salgan de nuevo para la mesa correcta (no recircular) cuenta como «mesa_correcta»',
        ],
        erroresCriticos: [
          {
            id: 'reusa',
            texto: 'Sirve en otra mesa comida que los clientes ya tocaron o probaron',
          },
          {
            id: 'cambia_pos',
            texto: 'Cambia o captura el pedido en el POS él mismo',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 4,
        enunciado:
          'Al dejar los platos en la mesa 9, un cliente te pide dos mezcales más y la cuenta, y otro te dice que su sopa llegó tibia y pregunta si le pueden hacer un descuento. ¿Qué haces?',
        dimension: 'comunicacion',
        evalua: 'Atender lo que pide la mesa sin tomar órdenes, cobrar ni prometer descuentos',
        tareaReal: 'Límites del puesto (Manual: solo el vendedor del rango toma la orden y baja la cuenta; Política de dinero: el runner no autoriza)',
        indispensable: true,
        esenciales: [
          {
            id: 'mesero',
            texto: 'Le pasa de inmediato al mesero de la mesa los mezcales y la cuenta',
          },
          {
            id: 'dice_mesa',
            texto: 'Le dice a la mesa que su mesero viene enseguida',
          },
          {
            id: 'sopa',
            texto: 'Ofrece llevarse la sopa para que cocina la sirva caliente, o avisa al mesero para que lo resuelva',
          },
          {
            id: 'descuento',
            texto: 'No promete el descuento: lo pasa al mesero o al capitán',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Avisar al capitán si el mesero no está disponible',
        ],
        erroresCriticos: [
          {
            id: 'promete',
            texto: 'Le promete o le aplica el descuento',
          },
          {
            id: 'sin_capturar',
            texto: 'Lleva los mezcales sin que el mesero los haya capturado',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 5,
        enunciado:
          'Viernes, 9 pm. En el pase hay: una sopa de tortilla y un caldo de camarón que llevan tres minutos ahí; un aguachile de la mesa 4; cuatro platos de una mesa de seis cuyos otros dos platos salen en tres minutos, y una nieve de mamey. Estás solo en el pase. ¿Cómo lo sacas?',
        dimension: 'inocuidad',
        evalua: 'Priorizar la salida por temperatura y sincronizar una mesa incompleta',
        tareaReal: 'Pase: temperatura de lo que sale y sincronización de la mesa (Manual: todos reciben al mismo tiempo)',
        indispensable: true,
        esenciales: [
          {
            id: 'caliente',
            texto: 'Saca primero lo caliente que ya lleva tiempo (la sopa y el caldo)',
          },
          {
            id: 'frio',
            texto: 'Saca enseguida la nieve y el aguachile, que pierden su temperatura fuera del frío',
          },
          {
            id: 'mesa_seis',
            texto:
              'No baja cuatro de seis platos: espera a que salgan juntos, pide a cocina que los resguarde o coordina para completarlos',
          },
          {
            id: 'apoyo',
            texto: 'Pide apoyo a meseros o al capitán para no dejar platos esperando',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Cualquier orden de salida justificado por el estado real de los platos (p. ej. la nieve primero si está por derretirse y enseguida la sopa y el caldo) cuenta como «caliente» y «frio»',
        ],
        erroresCriticos: [
          {
            id: 'manda_frio',
            texto: 'Lleva a la mesa un plato que ya se enfrió o un postre derretido sin avisar a cocina',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 6,
        enunciado:
          'Llevas cinco platos a la mesa 15. La comanda dice: posición 1 rib eye término medio, posición 2 enchiladas, posición 3 rib eye bien cocido, posición 4 sopa, posición 5 aguachile. Al llegar ves que los comensales se cambiaron de lugar. ¿Cómo los entregas?',
        dimension: 'entrega_correcta',
        evalua: 'Entregar cada plato a la persona correcta sin subastar los platos',
        tareaReal: 'Posición de comensal y dirección de servicio (Manual: servir por la derecha, cara frontal del plato hacia el cliente)',
        indispensable: true,
        esenciales: [
          {
            id: 'mesero',
            texto: 'Pide al mesero que esté presente al bajar los platos para indicar quién pidió qué',
          },
          {
            id: 'terminos',
            texto: 'No confunde los dos rib eye: confirma el término con quien lo recibe',
          },
          {
            id: 'derecha',
            texto:
              'Sirve por la derecha sin cruzar el brazo frente al comensal (o por el acceso seguro si la derecha está bloqueada)',
          },
          {
            id: 'cara',
            texto: 'Coloca cada plato con su cara frontal hacia el comensal',
          },
        ],
        // Revisión Codex r3: lo central es entregar a la persona correcta;
        // derecha y cara frontal suman pero no deciden la "correcta".
        minimoCorrecta: 2,
        nucleo: ['mesero', 'terminos'],
        alternativasValidas: [
          'Preguntar discretamente nombrando el platillo y el término ("¿el rib eye término medio?"), sin gritar a toda la mesa: cuenta como «mesero»',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 7,
        enunciado:
          'En la mesa 3, de seis personas, cuatro ya terminaron y dos siguen comiendo. Un cliente que ya terminó te hace señas para que te lleves su plato. ¿Qué haces?',
        dimension: 'retiro_seguridad',
        evalua: 'Retirar platos según el estándar, atendiendo lo que pide el comensal',
        tareaReal: 'Cómo retirar platos sucios y descamoche (Manual)',
        indispensable: false,
        esenciales: [
          {
            id: 'retira_pedido',
            texto:
              'Le retira el plato a quien lo pide (su seña ya es la petición) y deja los de quienes siguen comiendo',
          },
          {
            id: 'izquierda',
            texto: 'Retira por la izquierda, sin estorbar a quienes siguen comiendo',
          },
          {
            id: 'sin_apilar',
            texto: 'No apila los platos ni raspa restos frente a la mesa',
          },
          {
            id: 'descamoche',
            texto: 'Lleva lo retirado al descamoche y deja restos, platos y cubiertos en su lugar',
          },
        ],
        // Revisión Codex r3: la pregunta es a quién retirar; el estándar de
        // retiro suma pero no se exige completo.
        minimoCorrecta: 2,
        nucleo: ['retira_pedido'],
        alternativasValidas: [
          'Preguntar discretamente a los otros que terminaron si también desean que se retire su plato, sin apurar a quien sigue comiendo',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 8,
        enunciado:
          'Al llegar al pase te dan el plato de la mesa 11 con una nota de cocina: "No hay pulpo, va con camarón". ¿Qué haces?',
        dimension: 'comunicacion',
        evalua: 'No entregar una sustitución que la mesa no aceptó y cuidar el posible alérgeno',
        tareaReal: 'Faltantes del día (86) y comunicación cocina–mesero',
        indispensable: false,
        esenciales: [
          {
            id: 'no_lleva',
            texto: 'No lleva el plato hasta que la mesa acepte el cambio',
          },
          {
            id: 'mesero',
            texto: 'Avisa al mesero para que consulte a la mesa (la comanda y el precio en el POS los corrige el mesero)',
          },
          {
            id: 'alergia',
            texto:
              'Antes de que salga el camarón se asegura (él o el mesero) de que nadie en la mesa tenga alergia o restricción al camarón o a los mariscos',
          },
          {
            id: 'cocina',
            texto: 'Le regresa a cocina la respuesta de la mesa',
          },
          {
            id: 'faltante',
            texto: 'Se asegura de que el capitán o encargado sepa que se acabó el pulpo para que se informe a todo el piso',
          },
        ],
        minimoCorrecta: 3,
        nucleo: ['no_lleva', 'alergia'],
        alternativasValidas: [],
        erroresCriticos: [
          {
            id: 'sustituye',
            texto: 'Lleva el plato con camarón sin decirle a la mesa que se cambió',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 9,
        enunciado:
          'Llegas a las 12:20; el salón abre a la 1 pm. En el refrigerador de tu estación está el cambro de salsas que quedó de ayer, sin emplayar; no hay hielo en la estación y faltan limones lavados. ¿Qué haces?',
        dimension: 'inocuidad',
        evalua: 'Montar la estación del runner con salsas e insumos en condiciones',
        tareaReal: 'Checklist de apertura mesero/runner y de cierre (Manual: salsas en cambro con cama de hielo, lavar limones, emplayar salsas)',
        indispensable: false,
        esenciales: [
          {
            id: 'salsas_ayer',
            texto:
              'No usa por su cuenta las salsas que quedaron sin emplayar: avisa a cocina para que decida si se usan, se tiran o se reponen',
          },
          {
            id: 'cama_hielo',
            texto: 'Consigue hielo y monta las salsas en frío (cambro con cama de hielo)',
          },
          {
            id: 'limones',
            texto: 'Lava los limones y deja la estación surtida para el servicio',
          },
          {
            id: 'evidencia',
            texto: 'Si no alcanza a dejar la estación lista antes de abrir, pide ayuda a un compañero o avisa al capitán',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [],
        erroresCriticos: [
          {
            id: 'sirve_dudosas',
            texto:
              'Dice que sirve las salsas de ayer sin consultar a cocina (decidir por su aspecto no basta)',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 10,
        enunciado:
          'Bajando una charola con tres bebidas, se te cae una cerveza: el vaso se rompe en el piso y salpica el vestido de una clienta. ¿Qué haces?',
        dimension: 'retiro_seguridad',
        evalua: 'Atender a la persona, quitar el riesgo del piso y avisar lo que no le toca resolver',
        tareaReal: 'Seguridad en piso y formato de rotos (Manual)',
        indispensable: false,
        esenciales: [
          {
            id: 'persona',
            texto: 'Se asegura de que la clienta y nadie más se cortó ni se lastimó (disculparse suma)',
          },
          {
            id: 'vidrio',
            texto: 'Limpia la zona sin usar las manos para el vidrio (escoba y recogedor) y no deja el piso mojado',
          },
          {
            id: 'aleja',
            texto: 'Mientras limpia, evita que alguien pise la zona (avisa o pone un letrero)',
          },
          {
            id: 'capitan',
            texto: 'Avisa al mesero o al capitán para que atiendan a la clienta y decidan cualquier compensación',
          },
          {
            id: 'rotos',
            texto:
              'Reporta el vaso roto al encargado para que quede en el formato de rotos (o lo anota él si le toca)',
          },
          {
            id: 'repone',
            texto: 'Pide que se reponga la bebida a la mesa',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [],
        erroresCriticos: [
          {
            id: 'deja',
            texto: 'Deja el vidrio o el piso mojado para limpiarlo después',
          },
          {
            id: 'promete',
            texto: 'Le promete a la clienta pagar la tintorería o una cortesía por su cuenta',
          },
        ],
      },
    ],
  },
  competencias: {
    version: 'competencias_runner_v1',
    preguntas: [
      // Integridad (todas de experiencia)
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que te dieron de más (cambio, un pago o un producto) y te diste cuenta: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Lo devolvió o avisó aunque nadie lo hubiera notado',
          'Explica por qué lo hizo con un motivo propio',
        ],
        senalesAlerta: ['Se quedó con el dinero o el producto y lo cuenta como algo normal'],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que cometiste un error que nadie más había notado y que te podía costar algo (dinero, un regaño, una calificación): qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Lo reconoció ante quien correspondía',
          'Hizo algo para repararlo',
        ],
        senalesAlerta: ['Ocultó el error o culpó a otra persona y no lo corrigió'],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que alguien cercano (compañero, amigo o familiar) te pidió que lo cubrieras diciendo o firmando algo que no era cierto: qué te pidió, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Se negó a mentir o a firmar algo falso',
          'Buscó otra forma de ayudar sin engañar',
        ],
        senalesAlerta: ['Mintió o alteró un registro (asistencia, firma) para cubrirlo'],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que encontraste algo que no era tuyo (dinero, un celular, una cartera u otro objeto): qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Lo entregó a su dueño o a quien correspondía',
          'Hizo el esfuerzo de encontrar al dueño',
        ],
        senalesAlerta: ['Se quedó con el objeto o el dinero'],
      },
      // Autoconciencia
      {
        eje: 'autoconciencia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que alguien te criticó tu forma de trabajar o de tratar a otros: qué te dijo, qué hiciste tú con eso y cómo terminó.',
        senalesPositivas: [
          'Reconoce qué parte de la crítica era cierta',
          'Cambió algo concreto después',
        ],
        senalesAlerta: ['Tomó represalias contra quien lo criticó'],
      },
      {
        eje: 'autoconciencia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una situación reciente en la que perdiste la paciencia: qué la provocó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Identifica qué lo hizo reaccionar',
          'Reconoce su parte y reparó el trato',
        ],
        senalesAlerta: ['Insultó, amenazó o agredió físicamente a alguien y lo justifica'],
      },
      {
        eje: 'autoconciencia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de algo que al principio hacías mal y después corregiste: cómo te diste cuenta, qué hiciste tú y cómo resultó.',
        senalesPositivas: [
          'Describe con precisión qué hacía mal',
          'Cuenta qué hizo para mejorar',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'autoconciencia',
        tipo: 'hipotetica',
        texto:
          'Vas a mitad del salón con tres platos y te das cuenta de que no recuerdas si eran para la mesa 12 o para la 21. ¿Qué haces?',
        senalesPositivas: [
          'No adivina: revisa el ticket o pregunta al mesero antes de dejarlos',
          'Ajusta su forma de trabajar para que no se repita (leer el ticket antes de salir)',
        ],
        senalesAlerta: [],
      },
      // Ética de trabajo
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que tuviste que cumplir con algo (en el trabajo, la escuela o la casa) estando muy cansado o sin ganas: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: ['Cumplió con lo comprometido', 'Se organizó para lograrlo'],
        senalesAlerta: [],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que no pudiste llegar a tiempo a un compromiso: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Avisó antes y explicó el motivo',
          'Hizo algo para que no se repitiera',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una tarea pesada o aburrida que te tocó hacer y que nadie iba a revisar: qué era, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'La hizo completa aunque nadie la revisara',
          'Explica por qué le importa hacerla bien',
        ],
        senalesAlerta: ['Marcó como hecha una tarea que no hizo'],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'hipotetica',
        texto:
          'Al cierre te falta limpiar el refrigerador, el congelador y las paredes de la estación del runner. Tu compañero te dice que mañana nadie lo revisa y que ya se vayan. ¿Qué haces?',
        senalesPositivas: [
          'Termina la limpieza o se la reparten para acabar',
          'Avisa al encargado si de verdad no se puede terminar',
        ],
        senalesAlerta: ['Marca la limpieza como hecha sin haberla hecho'],
      },
      // Empatía
      {
        eje: 'empatia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que alguien estaba molesto contigo o por algo que no dependía de ti: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Escuchó antes de defenderse',
          'Entendió qué necesitaba la otra persona y actuó en consecuencia',
        ],
        senalesAlerta: ['Le respondió con insultos o lo humilló'],
      },
      {
        eje: 'empatia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que notaste que alguien necesitaba ayuda sin que te la pidiera: cómo te diste cuenta, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Describe la señal concreta que notó',
          'Ofreció ayuda respetando a la persona',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'empatia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que tuviste que atender o ayudar a alguien muy distinto a ti (por edad, idioma, costumbres o una discapacidad): qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Adaptó su forma de hablar o de ayudar a esa persona',
          'Se fijó en cómo se sintió la persona',
        ],
        senalesAlerta: ['Se burló de la persona o la trató peor por su origen, edad o apariencia'],
      },
      {
        eje: 'empatia',
        tipo: 'hipotetica',
        texto:
          'Al dejar un plato, una clienta te dice de mal modo que lleva 30 minutos esperando y que "aquí nunca saben nada". ¿Qué haces?',
        senalesPositivas: [
          'Le ofrece una disculpa sin discutir',
          'Avisa al mesero o al capitán para que la atiendan y le den un tiempo real',
        ],
        senalesAlerta: ['Le contesta con insultos o se burla de ella'],
      },
      // Curiosidad (sin señales de alerta)
      {
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        texto:
          'Cuéntame de lo último que aprendiste por tu cuenta, sin que nadie te lo pidiera: qué fue, cómo lo aprendiste y para qué te ha servido.',
        senalesPositivas: [
          'Describe un aprendizaje concreto y reciente',
          'Buscó fuentes o práctica por iniciativa propia',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que preguntaste el porqué de una regla o de una forma de hacer las cosas: qué preguntaste, qué te respondieron y qué hiciste tú con eso.',
        senalesPositivas: [
          'Preguntó para entender, no para evitar la regla',
          'Usó la respuesta para hacer mejor su trabajo',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que observaste a alguien hacer algo mejor o más rápido que tú y aprendiste a hacerlo: qué viste, qué hiciste tú y cómo resultó.',
        senalesPositivas: [
          'Describe con detalle lo que observó',
          'Lo practicó y comprobó si le funcionaba',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'hipotetica',
        texto:
          'Un cliente te pregunta qué lleva el platillo que le acabas de dejar y no lo sabes. ¿Qué haces?',
        senalesPositivas: [
          'No inventa: dice que lo consulta o llama al mesero',
          'Después aprende los ingredientes de ese platillo',
        ],
        senalesAlerta: [],
      },
      // Optimismo (sin señales de alerta)
      {
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que un día empezó muy mal (en el trabajo o fuera de él): qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Hizo algo concreto para cambiar el rumbo del día',
          'No descargó su mal día en otras personas',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que algo no te salió como esperabas (un examen, un trabajo, un plan): qué pasó, qué hiciste tú después y cómo terminó.',
        senalesPositivas: [
          'Lo volvió a intentar o buscó otro camino',
          'Saca un aprendizaje concreto sin culpar a todos',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que ayudaste a alguien a levantar el ánimo: qué le pasaba, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Hizo algo concreto por la otra persona',
          'Lo hizo sin esperar algo a cambio',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'hipotetica',
        texto:
          'Viernes, 10 pm: el pase está lleno, cocina está tensa y un mesero te culpa frente a otros de un plato frío que no se enfrió por ti. ¿Qué haces?',
        senalesPositivas: [
          'Sigue sacando platos sin engancharse en la discusión',
          'Lo aclara con el mesero en privado cuando baja el ritmo',
        ],
        senalesAlerta: [],
      },
    ],
  },
}
