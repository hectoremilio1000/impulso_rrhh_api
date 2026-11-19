import type { ExamenPuesto } from '#services/exam_catalog/types'

// Examen de Mesero (catálogo 2026-11-16).
//
// Fuentes: «Manual de Introducción Mesero y Capitan» (La Llorona) y
// «Sesion4_Politica_Dinero.md». Lo que no está en ellas va en
// facultades.pendientesOperador. Nota por pregunta: docs/examenes/puestos/waiter.md
//
// Alcance: el mesero atiende SU sección. No reparte meseros, no autoriza
// cancelaciones, descuentos ni cortesías (la política de dinero dice que el
// mesero solo solicita) y no cobra salvo autorización (el manual reserva el
// cobro al subgerente y al gerente). Por eso escalar esas acciones sí merece
// crédito aquí; pasar al encargado una tarea propia (capturar, revisar la
// precuenta, preguntar por alergias) no.

export const EXAMEN_WAITER: ExamenPuesto = {
  code: 'waiter',
  label: 'Mesero',
  aliases: ['mesero', 'mesera', 'meseros', 'meseras', 'waiter', 'mesero de piso', 'mesera de piso'],
  tareas: [
    'Montar y dejar lista su sección según el checklist de apertura de piso',
    'Recibir a la mesa con la carta en los primeros minutos y tomar la orden de bebidas',
    'Seguir la secuencia de servicio: orden, repetición, entrega, chequeo de satisfacción, refill, retiro, postre y café, cuenta y despedida',
    'Capturar cada producto en el POS en la mesa y posición correctas antes de llevarlo a la mesa',
    'Preguntar por alergias y restricciones, registrarlas en la comanda y confirmarlas con cocina',
    'Servir alcohol con responsabilidad: comprobar la mayoría de edad y no servir a quien está en estado de ebriedad',
    'Explicar la carta, incluidos tequilas y mezcales, y hacer venta sugerida honesta',
    'Revisar la precuenta producto por producto y calcular la cuenta dividida cuando la mesa lo pide',
    'Atender la primera queja de su mesa y pedir al encargado lo que no le toca autorizar',
  ],
  facultades: {
    decide: [
      'El ritmo y el orden de atención de las mesas de su sección',
      'Qué recomendar de la carta, según lo que la mesa dice que quiere',
      'No servir alcohol a quien no acredita su mayoría de edad o muestra signos de ebriedad, y avisar al encargado',
      'Capturar en el POS, repetir la orden y revisar la precuenta antes de llevarla',
      'Ofrecer a la mesa cambiar un platillo que no le gustó (el cambio o la cancelación los gestiona con el encargado en turno)',
    ],
    escala: [
      'Cancelaciones, descuentos y cortesías: el mesero no las autoriza, solo las solicita al encargado (Política de dinero)',
      'Productos de menos en la precuenta: los agrega e informa al jefe de turno; productos de más: los informa al jefe de turno o encargado, que es quien los cancela (Manual; Política de dinero)',
      'El cobro: lo hacen el subgerente o el gerente; el capitán solo si ellos lo autorizan (Manual)',
      'Un cliente en estado de ebriedad que no acepta retirarse: se llama al gerente (Manual, pregunta frecuente 7)',
      'Pedidos fuera de carta: se consulta al jefe de cocina, de barra o al gerente, que da precio, tiempo y alta en el sistema (Manual, pregunta frecuente 10)',
    ],
    pendientesOperador: [
      'Qué identificación acepta La Llorona para comprobar la mayoría de edad (INE, pasaporte, licencia) y si se pide a todos los que van a beber',
      'Si el mesero puede dejar de servir alcohol por su cuenta o necesita que lo decida el encargado; el examen da crédito a dejar de servir y avisar',
      'Si el mesero divide la cuenta en el POS o lo hace quien cobra',
      'Cómo se marca una alergia en el POS (modificador, nota, campo) y si cocina la confirma de vuelta',
      'Los precios y platillos de los casos son ilustrativos, no la carta vigente',
      'La carta real de tequilas y mezcales (marcas, categorías, precios) para afinar la pregunta 6',
      'El manual dice «en la comanda manual» al tomar la orden y a la vez pide cargarla al sistema; el examen asume captura en el POS',
      'La recomendación del manual de pedir reseña solo a quien dará 5 estrellas no se evalúa; confirmar si sigue vigente',
    ],
  },
  practico: {
    version: 'banco_waiter_v1',
    umbralAprobado: 70,
    dimensiones: [
      { id: 'secuencia_servicio', nombre: 'Secuencia de servicio y atención de la sección', peso: 25 },
      { id: 'pos_cuenta', nombre: 'Captura en POS, precuenta y cuenta', peso: 30 },
      { id: 'seguridad_comensal', nombre: 'Alergias y servicio responsable de alcohol', peso: 25 },
      { id: 'venta_carta', nombre: 'Conocimiento de la carta y venta sugerida', peso: 20 },
    ],
    preguntas: [
      {
        tipo: 'numerica',
        q: 1,
        enunciado:
          'En la mesa 12, cuatro amigos piden la cuenta y quieren pagar por separado: cada quien lo suyo, y lo que compartieron, a partes iguales entre los cuatro. Compartieron un guacamole de $180 y un chicharrón de queso de $160. Laura pidió unas enmoladas de $230 y dos mezcales de $150 cada uno. ¿Cuánto le toca pagar a Laura, sin contar propina?',
        dimension: 'pos_cuenta',
        evalua: 'Calcular una cuenta dividida con consumo propio y compartido',
        tareaReal: 'Cobro dividido a petición de la mesa (precuenta por comensal)',
        indispensable: false,
        clave: 615,
        tolerancia: 1,
        unidad: 'MXN',
        solucion:
          'Compartido: 180 + 160 = 340; entre 4 = 85. Propio de Laura: 230 + 2 × 150 = 530. Total: 530 + 85 = 615.',
      },
      {
        tipo: 'abierta',
        q: 2,
        enunciado:
          'Al tomar la orden de la mesa 7, una señora te dice que su hijo de 9 años es alérgico al cacahuate y te pregunta si las enmoladas son seguras para él. ¿Qué haces?',
        dimension: 'seguridad_comensal',
        evalua: 'Manejar una alergia alimentaria sin adivinar y asegurar que llegue a cocina y a la mesa',
        tareaReal: 'Alergias y restricciones (Manual: anotar alergias en la orden y conocer los platos aptos)',
        indispensable: true,
        esenciales: [
          {
            id: 'no_adivina',
            texto: 'No afirma que el platillo es seguro sin confirmarlo; reconoce que el mole puede llevar cacahuate',
          },
          {
            id: 'consulta_cocina',
            texto:
              'Consulta con cocina los ingredientes y el riesgo de contaminación cruzada antes de que el niño pida',
          },
          {
            id: 'registra',
            texto: 'Registra la alergia en la comanda del POS en el platillo y la posición del niño',
          },
          {
            id: 'alternativa',
            texto: 'Si no es seguro, le ofrece una alternativa que cocina confirme sin cacahuate',
          },
          {
            id: 'entrega',
            texto:
              'Al llegar el plato confirma que es el preparado sin cacahuate (lo entrega o supervisa la entrega a esa posición)',
          },
        ],
        minimoCorrecta: 4,
        // Revisión Codex r3: sin confirmar con cocina y registrar la alergia no
        // hay "correcta" aunque junte el mínimo (omitirlos baja a parcial).
        nucleo: ['consulta_cocina', 'registra'],
        alternativasValidas: [
          'Recomendar desde el principio no pedir platillos con mole y elegir uno que cocina ya confirmó libre de cacahuate',
        ],
        erroresCriticos: [
          {
            id: 'asegura_sin_confirmar',
            texto: 'Le dice que el platillo es seguro sin haberlo confirmado con cocina',
          },
          {
            id: 'no_registra',
            texto:
              'Dice expresamente que manda la orden sin anotar la alergia o que no hace falta avisar a cocina (no mencionar el registro no cuenta como este error)',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 3,
        enunciado:
          'Llega a tu sección una mesa de cuatro jóvenes y piden una botella de mezcal para compartir. Uno de ellos se ve más joven que los demás. ¿Qué haces?',
        dimension: 'seguridad_comensal',
        evalua: 'Comprobar la mayoría de edad antes de servir alcohol, con respeto y sin dejar huecos',
        tareaReal: 'Servicio responsable de alcohol (venta a menores prohibida)',
        indispensable: true,
        esenciales: [
          {
            id: 'pide_id',
            texto:
              'Pide una identificación que acredite la edad antes de servir (al menos a quien parece menor); no se exige nombrar un documento concreto',
          },
          {
            id: 'no_sirve_menor',
            texto: 'Si no acredita los 18 años, no le sirve alcohol a esa persona',
          },
          {
            id: 'respeto',
            texto: 'Lo explica con amabilidad como regla de la casa y le ofrece bebidas sin alcohol',
          },
          {
            id: 'vigila',
            texto: 'Está atento a que no le pasen bebida durante la visita y, si ocurre, avisa al encargado o al capitán',
          },
        ],
        minimoCorrecta: 3,
        nucleo: ['no_sirve_menor'],
        alternativasValidas: [
          'Pedir identificación a los cuatro como práctica general antes de servir la botella',
          'Servir la botella a los que sí acreditan edad y llevar copas solo para ellos',
        ],
        erroresCriticos: [
          {
            id: 'sirve_sin_comprobar',
            texto: 'Sirve la botella a toda la mesa sin comprobar la edad de quien parece menor',
          },
          {
            id: 'tolera',
            texto: 'Ve que le pasan alcohol al menor y sigue sirviendo a la mesa sin hacer nada',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 4,
        enunciado:
          'Un cliente de la mesa 15 lleva cinco tequilas en dos horas, arrastra las palabras, ya tiró un vaso con agua y te pide "la última, doble". ¿Qué haces?',
        dimension: 'seguridad_comensal',
        evalua: 'No servir a una persona en estado de ebriedad, con discreción, y seguir el procedimiento de la casa',
        tareaReal: 'Clientes en estado de ebriedad (Manual, pregunta frecuente 7)',
        indispensable: false,
        esenciales: [
          { id: 'no_sirve', texto: 'No le sirve el tequila' },
          {
            id: 'discrecion',
            texto: 'Se lo dice con discreción y respeto y le ofrece agua, café o algo de comer',
          },
          {
            id: 'avisa',
            texto: 'Avisa al capitán o al encargado en turno de la situación',
          },
          {
            id: 'procedimiento',
            texto:
              'Sigue el procedimiento de la casa: se le lleva la cuenta y se le invita a retirarse; si no acepta, se llama al gerente',
          },
          {
            id: 'transporte',
            texto: 'Pregunta si alguien de su grupo lo lleva o le ofrece pedir un transporte seguro',
          },
        ],
        minimoCorrecta: 3,
        nucleo: ['no_sirve'],
        alternativasValidas: [
          'Hablar primero con un acompañante sobrio de la mesa',
          'No servirle mientras avisa al encargado para que él decida cómo seguir (cuenta como «no_sirve» y «avisa»; no se exige saber quién decide suspender el alcohol)',
        ],
        erroresCriticos: [
          { id: 'sirve', texto: 'Le sirve el tequila u otra bebida con alcohol' },
          {
            id: 'exhibe',
            texto: 'Lo confronta en voz alta, lo exhibe frente a otras mesas o lo toca para sacarlo',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 5,
        enunciado:
          'Mesa 9, cinco personas. Piden: dos aguachiles, un rib eye término medio sin chimichurri, unas enchiladas suizas que una persona quiere sin crema y una sopa de tortilla; de tomar, tres cervezas y dos palomas. Tienes otras tres mesas esperando. ¿Qué haces con esta orden desde que la tomas hasta que llega a cocina y barra?',
        dimension: 'pos_cuenta',
        evalua: 'Tomar y capturar una orden completa sin errores aun con prisa',
        tareaReal: 'Repetición de pedidos y captura en el sistema (Manual)',
        indispensable: true,
        esenciales: [
          { id: 'repite', texto: 'Repite la orden completa a la mesa antes de irse' },
          {
            id: 'posicion',
            texto: 'Captura cada platillo y bebida en el POS asignado a la posición de cada comensal',
          },
          {
            id: 'modificadores',
            texto: 'Registra los cambios en su platillo: término medio, sin chimichurri, sin crema',
          },
          {
            id: 'cuadra_pax',
            texto:
              'Antes de enviar coteja cantidades y cambios capturados contra la orden que repitió a la mesa (no se exige un platillo por persona)',
          },
          {
            id: 'envia_ya',
            texto: 'Envía la orden al sistema de inmediato, antes de atender lo demás',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Enviar primero las bebidas y enseguida los alimentos, si ambas capturas se hacen antes de atender otra mesa',
        ],
        erroresCriticos: [
          {
            id: 'sin_capturar',
            texto: 'Lleva bebidas o platillos a la mesa sin haberlos capturado en el POS',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 6,
        enunciado:
          'Una pareja de visitantes canadienses te dice que solo ha tomado tequila en shots con limón y sal. Quieren probar "algo bueno para tomar despacio" y te preguntan qué diferencia hay entre el tequila y el mezcal. ¿Cómo los atiendes?',
        dimension: 'venta_carta',
        evalua: 'Explicar con datos correctos tequila y mezcal y recomendar según el gusto de la mesa',
        tareaReal: 'Conocimiento del producto: carta de destilados (Manual)',
        indispensable: false,
        esenciales: [
          {
            id: 'tequila',
            texto:
              'Explica correctamente al menos un rasgo que distingue al tequila: se hace solo con agave azul (tequilana Weber) o solo en su región con denominación de origen',
          },
          {
            id: 'mezcal',
            texto:
              'Explica correctamente al menos un rasgo que distingue al mezcal: puede hacerse con distintos agaves (p. ej. espadín) o su cocimiento tradicional (horno de tierra) suele darle notas ahumadas',
          },
          {
            id: 'pregunta_gusto',
            texto: 'Pregunta qué les gusta (suave, dulce, ahumado, intenso) antes de recomendar',
          },
          {
            id: 'recomienda',
            texto:
              'Recomienda una opción concreta según lo que dijeron (una etiqueta o un tipo, p. ej. un espadín joven o un tequila reposado); el precio suma pero no se exige porque el caso no trae carta',
          },
          {
            id: 'como_tomar',
            texto: 'Sugiere cómo tomarlo: a sorbos, a temperatura ambiente, con naranja o algo de comer',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Explicar las categorías por reposo en barrica (blanco, reposado, añejo) como forma de elegir: cuenta para «recomienda» si termina en una opción concreta, pero no sustituye la diferencia entre tequila y mezcal',
          'Proponer probar una copa de cada uno para comparar',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 7,
        enunciado:
          'Llevas un pescado zarandeado a la mesa 4. Después del primer bocado, el cliente te dice que está seco y frío. ¿Qué haces?',
        dimension: 'secuencia_servicio',
        evalua: 'Atender una queja de platillo dentro de lo que le toca y pedir lo que no le toca autorizar',
        tareaReal: 'Chequeo de satisfacción y platillo que no gustó (Manual, pregunta frecuente 1)',
        indispensable: false,
        esenciales: [
          { id: 'escucha', texto: 'Escucha y se disculpa sin discutir ni culpar a cocina' },
          {
            id: 'ofrece',
            texto: 'Ofrece cambiarlo por otro igual bien preparado o por otro platillo, o retirarlo',
          },
          {
            id: 'encargado',
            texto:
              'Avisa al encargado en turno para que autorice el cambio o la cancelación (el mesero no cancela por su cuenta)',
          },
          {
            id: 'cocina',
            texto: 'Le dice a cocina el motivo y pide que el nuevo salga con prioridad',
          },
          {
            id: 'seguimiento',
            texto: 'Regresa a confirmar que el nuevo platillo está bien',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Si el cliente no quiere otro platillo, pedir al encargado que lo cancele y ofrecerle otra cosa de la carta',
        ],
        erroresCriticos: [
          {
            id: 'cancela_solo',
            texto:
              'Dice que él mismo cancela el platillo o le aplica un descuento en el sistema sin pedir autorización al encargado (decir «lo cambio» o «lo corrijo» sin más no cuenta como este error)',
          },
          {
            id: 'discute',
            texto: 'Le dice al cliente que así es el platillo y no le ofrece ninguna solución',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 8,
        enunciado:
          'Sábado, 2:10 pm. En tu sección sientan casi al mismo tiempo tres mesas: la 21, una pareja con un bebé; la 22, seis personas que vienen a un cumpleaños con reserva; y la 23, dos personas que te dicen que tienen 40 minutos para comer. ¿Cómo atiendes a las tres en los primeros diez minutos?',
        dimension: 'secuencia_servicio',
        evalua: 'Organizar la secuencia de servicio con varias mesas a la vez sin dejar ninguna desatendida',
        tareaReal: 'Bienvenida, presentación de carta y orden de bebidas (Manual: tiempos máximos)',
        indispensable: true,
        esenciales: [
          {
            id: 'presenta',
            texto:
              'Se presenta en las tres mesas en los primeros minutos con la carta, aunque sea para decir que enseguida regresa',
          },
          {
            id: 'bebidas',
            texto:
              'Toma pronto las bebidas de las tres mesas antes de detenerse en una orden larga (tomar enseguida la orden completa de la 23 cuenta si no deja a las otras dos sin carta ni bebidas, o pide apoyo para ellas)',
          },
          {
            id: 'prisa',
            texto:
              'A la mesa con prisa le sugiere opciones rápidas y le toma la orden completa cuanto antes',
          },
          {
            id: 'bebe',
            texto: 'En la 21 atiende lo del bebé (silla periquera o espacio para la carriola)',
          },
          {
            id: 'reserva',
            texto: 'En la 22 usa los datos de la reserva: el nombre y la celebración del cumpleaños',
          },
          {
            id: 'apoyo',
            texto: 'Si no alcanza, pide apoyo al capitán o a un compañero en lugar de dejar esperando a una mesa',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Tomar la orden de comida completa de la mesa con prisa al mismo tiempo que sus bebidas',
          'Atender primero la orden completa de la 23 y pedir apoyo al capitán o a un compañero para cartas y bebidas de la 21 y la 22 (equivale a «bebidas» y «apoyo»)',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 9,
        enunciado:
          'La mesa 10 te pide la cuenta. Al revisar la precuenta ves que aparecen dos margaritas que la mesa no pidió y que falta un pastel de elote que sí se comieron. ¿Qué haces?',
        dimension: 'pos_cuenta',
        evalua: 'Corregir la precuenta con honestidad hacia la mesa y hacia el restaurante',
        tareaReal: 'Revisión de precuenta (Manual: si faltan productos se agregan; si sobran se informa al jefe de turno)',
        indispensable: false,
        esenciales: [
          {
            id: 'no_lleva',
            texto: 'No lleva la cuenta a la mesa hasta corregirla',
          },
          {
            id: 'agrega',
            texto: 'Agrega el pastel de elote que faltaba e informa al jefe de turno',
          },
          {
            id: 'sobran',
            texto:
              'Pide al encargado o jefe de turno que corrija las dos margaritas, porque él no puede cancelarlas',
          },
          {
            id: 'causa',
            texto: 'Averigua si las margaritas eran de otra mesa para que se cobren donde corresponde',
          },
          {
            id: 'entrega',
            texto: 'Entrega la cuenta corregida y pregunta cómo desean pagar',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [],
        erroresCriticos: [
          {
            id: 'cobra_de_mas',
            texto: 'Lleva la cuenta con las margaritas que la mesa no pidió',
          },
          {
            id: 'regala',
            texto: 'Deja fuera el postre que sí consumieron, sin capturarlo ni avisar',
          },
          {
            id: 'cancela_solo',
            texto:
              'Dice que él mismo borra o cancela las margaritas en el sistema sin pedir autorización (decir «la corrijo» sin más no cuenta como este error)',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 10,
        enunciado:
          'Un cliente de la mesa 3 te pide unos chilaquiles verdes con huevo, que no están en la carta. ¿Qué haces?',
        dimension: 'venta_carta',
        evalua: 'Atender un pedido fuera de carta sin negarse de entrada ni prometer lo que no sabe',
        tareaReal: 'Pedidos especiales y "nunca decir no" (Manual, pregunta frecuente 10)',
        indispensable: false,
        esenciales: [
          {
            id: 'no_niega_ni_promete',
            texto: 'Le dice que lo va a consultar, sin negarse de entrada ni prometer que sí',
          },
          {
            id: 'consulta',
            texto: 'Consulta al jefe de cocina o al gerente si se puede preparar',
          },
          {
            id: 'precio_tiempo',
            texto: 'Regresa con el precio y el tiempo de preparación antes de pedirlo',
          },
          {
            id: 'alta',
            texto: 'Si se acepta, se da de alta en el sistema y se captura en su cuenta antes de prepararlo',
          },
          {
            id: 'alternativa',
            texto: 'Si no se puede, le ofrece algo parecido de la carta',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [],
        erroresCriticos: [
          {
            id: 'por_fuera',
            texto: 'Le pide el platillo a cocina sin capturarlo o le inventa un precio',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 11,
        enunciado:
          'Una familia (dos adultos, una abuela y dos niños) ordena solo platos fuertes y aguas naturales. ¿Qué les ofreces a lo largo de la comida?',
        dimension: 'venta_carta',
        evalua: 'Hacer venta sugerida en los momentos correctos, según la mesa, y respetando un no',
        tareaReal: 'Técnicas de venta: adicionales, complementarios y necesidad aditiva (Manual)',
        indispensable: false,
        esenciales: [
          {
            id: 'adicional',
            texto: 'Al tomar la orden ofrece una entrada o algo para compartir',
          },
          {
            id: 'bebida',
            texto:
              'Ofrece otra bebida cuando ve los vasos por terminarse, con opciones sin alcohol para los niños (no se exige una fracción del vaso)',
          },
          {
            id: 'postre',
            texto: 'Presenta los postres en cuanto retira los platos fuertes',
          },
          {
            id: 'complementario',
            texto: 'Ofrece café, carajillo o infusión con el postre',
          },
          {
            id: 'respeta_no',
            texto: 'Si dicen que no o cuidan su presupuesto, no insiste',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Recomendar un platillo para compartir pensado para los niños o la abuela en lugar de una entrada',
        ],
        erroresCriticos: [],
      },
    ],
  },
  competencias: {
    version: 'competencias_waiter_v1',
    preguntas: [
      // Integridad (todas de experiencia)
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que te dieron de más (cambio, un pago o un producto) y te diste cuenta: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Lo devolvió o avisó aunque nadie lo hubiera notado',
          'Explica por qué lo hizo con un motivo propio, no por miedo a que lo descubrieran',
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
          'Acepta la consecuencia sin culpar a otros',
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
        senalesAlerta: [
          'Mintió o alteró un registro (asistencia, firma, cuenta) para cubrirlo',
        ],
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
          'Reconoce su parte y reparó el trato (se disculpó, habló después)',
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
          'Cuenta qué hizo para mejorar y cómo lo comprobó',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'autoconciencia',
        tipo: 'hipotetica',
        texto:
          'En pleno servicio te das cuenta de que tienes más mesas de las que puedes atender bien y una ya lleva rato esperando la carta. ¿Qué haces?',
        senalesPositivas: [
          'Reconoce el límite en el momento',
          'Pide apoyo al capitán o a un compañero',
          'Atiende primero a la mesa que espera aunque sea para decirle que enseguida regresa',
        ],
        senalesAlerta: [],
      },
      // Ética de trabajo
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que tuviste que cumplir con algo (en el trabajo, la escuela o la casa) estando muy cansado o sin ganas: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Cumplió con lo comprometido',
          'Se organizó para lograrlo (pidió ayuda, priorizó)',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que no pudiste llegar a tiempo a un compromiso: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Avisó antes y explicó el motivo',
          'Hizo algo para reponer o evitar que se repitiera',
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
          'Es domingo a las 11:40 de la noche, ya cerró el salón y te falta tu checklist de cierre: rellenar azucareras, emplayar las salsas y limpiar la estación. Tu compañero te dice que mañana nadie lo revisa y que mejor se vayan. ¿Qué haces?',
        senalesPositivas: [
          'Termina su checklist o se reparten las tareas para acabar',
          'Avisa al encargado si de verdad no se puede terminar',
        ],
        senalesAlerta: ['Firma o marca el checklist como hecho sin haberlo hecho'],
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
          'Se fijó en cómo se sintió la persona, no solo en terminar',
        ],
        senalesAlerta: ['Se burló de la persona o la trató peor por su origen, edad o apariencia'],
      },
      {
        eje: 'empatia',
        tipo: 'hipotetica',
        texto:
          'Una señora mayor que vino sola tarda mucho en decidir qué pedir y te pregunta varias veces por los mismos platillos. Tienes otras tres mesas en tu sección. ¿Qué haces?',
        senalesPositivas: [
          'Le da tiempo y le ofrece dos o tres recomendaciones claras',
          'Atiende sus otras mesas y regresa con ella sin hacerla sentir apurada',
        ],
        senalesAlerta: ['La apura con malos modos o la deja sin atender'],
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
          'Cuéntame de una vez en que probaste algo nuevo (una comida, una bebida, un lugar, una actividad) y luego se lo explicaste o recomendaste a alguien: qué fue, qué le dijiste y cómo resultó.',
        senalesPositivas: [
          'Describe el producto con detalle (sabor, origen, por qué le gustó)',
          'Adaptó la recomendación a la otra persona',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'hipotetica',
        texto:
          'Un cliente te pregunta por un mezcal de la carta que nunca has probado y del que no sabes nada. ¿Qué haces?',
        senalesPositivas: [
          'No inventa: dice que lo va a consultar',
          'Pregunta en barra y le lleva la información',
          'Se propone conocerlo después (probarlo en una cata, leer la ficha)',
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
          'Es sábado, llevas seis horas de pie, tu última mesa fue grosera y dejó poca propina, y acaban de sentar a una familia en tu sección. ¿Qué haces?',
        senalesPositivas: [
          'Recibe a la familia con la misma atención que a cualquier mesa',
          'Tiene una forma concreta de soltar el mal momento (respirar, un minuto, hablarlo después)',
        ],
        senalesAlerta: [],
      },
    ],
  },
}
