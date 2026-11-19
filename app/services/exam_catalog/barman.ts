import type { ExamenPuesto } from './types.js'

// Barman / bartender (code 'barman') — catálogo 2026-11-16, v1.
//
// Fuentes: «Manual de Introducción Barman» de La Llorona (procedimientos de
// cócteles, rotulados, lavado de cristalería, tiempos de servicio, comandas,
// precuenta, rotos, clientes en estado de ebriedad, reglas de la casa),
// «Sesion4_Politica_Dinero.md» (el bartender NO autoriza descuentos,
// cancelaciones ni cortesías; reembolsos sólo gerente u owner) y la hoja
// «recetario_completo_barra_23_06_26» (copa de destilado 60 ml, botella
// 700 ml, Margara Sagrada con 45 ml de Llorona Espadín). Las cantidades del
// recetario se dan dentro del enunciado: ninguna pregunta califica que el
// candidato las sepa de memoria. Lo que no está en las fuentes va en
// facultades.pendientesOperador.
// Nota por pregunta: docs/examenes/puestos/barman.md

export const EXAMEN_BARMAN: ExamenPuesto = {
  code: 'barman',
  label: 'Barman',
  aliases: ['barman', 'bartender', 'cantinero', 'cantinera', 'mixologo', 'mixologa', 'bar tender'],
  tareas: [
    'Prepara cócteles y sirve destilados con la receta y la medida de la casa',
    'Despacha las comandas del POS de piso y barra dentro de los tiempos estándar',
    'Sirve alcohol de forma responsable: identifica menores y personas en estado de ebriedad',
    'Controla la botella en uso, registra mermas y rotos y cuenta al cierre',
    'Revisa la precuenta de la barra y cuida el cobro y la terminal',
    'Abre la barra con checklist: producciones rotuladas, hielo, cristalería limpia',
  ],
  facultades: {
    decide: [
      'Negarse a servir alcohol a un menor o a una persona en estado de ebriedad',
      'Desechar y registrar como merma un insumo sin rótulo o en mal estado',
      'No despachar una bebida que no esté capturada en el POS',
      'El orden de preparación de la cola de comandas',
    ],
    escala: [
      'Cortesías, descuentos y cancelaciones (las autoriza gerente o subgerente; el bartender sólo solicita)',
      'Cualquier devolución de dinero o doble cobro en terminal (sólo gerente u owner)',
      'Un cliente en estado de ebriedad que no acepta retirarse o se pone agresivo (gerente o seguridad)',
      'Diferencias de botella que no puede explicar (jefe de barra)',
      'Bebidas fuera de carta: tiempo, precio y alta del producto (jefe de barra o gerente)',
    ],
    pendientesOperador: [
      'Confirmar que «recetario_completo_barra_23_06_26» es el vigente (Margara Sagrada 45/22.5/22.5/22.5 ml; copa de destilado 60 ml; botella 700 ml)',
      'Técnica y garnish de la Margara Sagrada (el recetario sólo trae cantidades)',
      'Cómo se cata en barra: ¿sólo gota de la bailarina en el dorso o también muestra aparte con popote o cuchara de un solo uso?',
      'Si el barman cobra y opera la terminal en la barra o sólo lo hacen subgerente y gerente (el manual dice que sólo ellos cobran). Si no la opera, ¿qué le toca ante un «error de comunicación»: avisar y guardar evidencia, o también verificar el último movimiento?',
      'Si la barra maneja fondo de caja propio y cómo se entregan las propinas de barra',
      'Qué identificaciones acepta la casa para comprobar la mayoría de edad',
      'Procedimiento cuando el POS falla: con el POS caído (no sólo lento), ¿se puede despachar con comanda manual o folio autorizado por el encargado y capturarla después? ¿Quién autoriza y cómo se concilia al volver el sistema?',
      'Dónde se registra la merma de barra (planilla, POS o inventario del sistema)',
    ],
  },
  practico: {
    version: 'banco_barman_v1',
    dimensiones: [
      { id: 'tecnica', nombre: 'Técnica y receta', peso: 20 },
      { id: 'alcohol_responsable', nombre: 'Servicio responsable de alcohol', peso: 20 },
      { id: 'control', nombre: 'Control de botella, cobro y caja', peso: 30 },
      { id: 'operacion', nombre: 'Comandas, higiene y apertura', peso: 30 },
    ],
    umbralAprobado: 70,
    preguntas: [
      {
        tipo: 'abierta',
        q: 1,
        enunciado:
          'Un mesero te marca en el POS tres Margara Sagrada, la margarita de mezcal de la casa. Es tu primera semana y todavía no te sabes la receta de memoria. ¿Cómo las preparas, paso a paso, hasta que salen de la barra?',
        dimension: 'tecnica',
        evalua: 'Preparar un coctel de la casa con método: receta, medida, técnica, prueba y entrega',
        tareaReal: 'Procedimiento para elaborar cócteles (Manual: revisión, mezcla, prueba, corrección, técnica, garnish, entrega)',
        indispensable: true,
        esenciales: [
          {
            id: 'ficha',
            texto: 'Consulta la receta de la casa (recetario o ficha de barra) o pregunta al jefe de barra en vez de improvisar',
          },
          {
            id: 'mise',
            texto: 'Antes de mezclar revisa que tiene todos los insumos, hielo, cristalería y garnish',
          },
          {
            id: 'mide',
            texto: 'Mide cada ingrediente con jigger (o medidor), no a ojo',
          },
          {
            id: 'tecnica',
            texto: 'Aplica la técnica que indica la receta (agitado con hielo y colado, o la que diga la ficha)',
          },
          {
            id: 'prueba',
            texto:
              'Prueba la mezcla sin contaminarla (una gota de la bailarina en el dorso de la mano, o una muestra aparte con popote o cuchara de un solo uso) y corrige si hace falta',
          },
          {
            id: 'garnish',
            texto: 'Decora según la receta',
          },
          {
            id: 'entrega',
            texto: 'La entrega de inmediato (dentro de los 8 minutos del estándar)',
          },
        ],
        minimoCorrecta: 5,
        alternativasValidas: [
          'Preparar las tres en una sola coctelera multiplicando cada medida por tres, si la ficha lo permite',
          'Tomar una muestra aparte con popote o cuchara de un solo uso que se desecha y no vuelve a la mezcla (cuenta como «prueba»)',
        ],
        erroresCriticos: [
          {
            id: 'prueba_insalubre',
            texto:
              'Bebe directo de la coctelera o se lleva a la boca la bailarina, o regresa a la mezcla el utensilio con el que probó',
          },
        ],
      },
      {
        tipo: 'numerica',
        q: 2,
        enunciado:
          'Al abrir la barra pones en servicio una botella nueva de Llorona Espadín de 700 ml. Durante el turno el POS registra 5 copas de Llorona Espadín (cada copa lleva 60 ml) y 4 Margara Sagrada (cada una lleva 45 ml de Llorona Espadín). Al cierre mides lo que queda en la botella: 70 ml. ¿Cuántos mililitros de mezcal faltan sin una venta que los explique?',
        dimension: 'control',
        evalua: 'Controlar la botella en uso contra lo vendido en el POS',
        tareaReal: 'Control de botella y merma (Manual: inventario de cierre; «se revisan diferencias restándole la venta»)',
        indispensable: false,
        clave: 150,
        tolerancia: 5,
        unidad: 'ml',
        solucion:
          'Vendido: 5 × 60 = 300 ml + 4 × 45 = 180 ml = 480 ml. Debería quedar 700 − 480 = 220 ml. Quedan 70 ml: faltan 220 − 70 = 150 ml.',
      },
      {
        tipo: 'abierta',
        q: 3,
        enunciado:
          'Al cerrar la barra, tu conteo muestra que de la botella de mezcal en uso faltan unos 200 ml que no aparecen en ninguna comanda. Tu compañero de turno te dice: «Relájate, mañana abrimos botella nueva y ya». ¿Qué haces?',
        dimension: 'control',
        evalua: 'Tratar una diferencia de botella como diferencia: buscar la causa y reportarla, no taparla',
        tareaReal: 'Inventario de cierre y registro de mermas',
        indispensable: false,
        esenciales: [
          {
            id: 'recuenta',
            texto: 'Revisa que la medición y las ventas estén bien antes de concluir (vuelve a medir o revisa el POS)',
          },
          {
            id: 'causas',
            texto: 'Busca causas concretas: bebidas servidas sin comanda, derrames o rotos sin registrar, medidas servidas de más, cortesías no registradas',
          },
          {
            id: 'registra',
            texto: 'Anota la diferencia en la planilla o el registro de mermas con lo que sabe',
          },
          {
            id: 'reporta',
            texto: 'Avisa al jefe de barra (o al encargado en turno) de la diferencia',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Revisar con su compañero, comanda por comanda, qué se sirvió durante el turno antes de reportar',
        ],
        erroresCriticos: [
          {
            id: 'tapa',
            texto: 'Rellena la botella (con agua u otro producto), ajusta el conteo o la deja así para que no se note',
          },
          {
            id: 'calla',
            texto: 'Acepta dejarlo para mañana sin registrarlo ni avisar a nadie',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 4,
        enunciado:
          'Un cliente lleva tres horas en la barra. Arrastra las palabras, ya tiró un vaso y te pide «el último» mezcal doble. Sus amigos te dicen: «Sírvele, nosotros lo cuidamos». ¿Qué haces?',
        dimension: 'alcohol_responsable',
        evalua: 'Cortar el alcohol a una persona en evidente estado de ebriedad con discreción y escalar si no acepta',
        tareaReal: 'Servicio responsable de alcohol (Manual: se le manda la cuenta, se le invita a retirarse; si no accede, se llama al gerente)',
        indispensable: true,
        esenciales: [
          {
            id: 'no_sirve',
            texto: 'No le sirve el mezcal ni más alcohol',
          },
          {
            id: 'discrecion',
            texto: 'Se lo dice con calma y respeto, sin exhibirlo frente a los demás',
          },
          {
            id: 'ofrece',
            texto: 'Le ofrece agua, comida o café como atención (no como permiso para seguir con alcohol)',
          },
          {
            id: 'cuenta',
            texto: 'Avisa al encargado en turno y, como marca la casa, le lleva la cuenta y lo invita a retirarse',
          },
          {
            id: 'escala',
            texto: 'Si no acepta o se pone agresivo, llama al gerente o a seguridad; ofrece un transporte seguro',
          },
        ],
        minimoCorrecta: 3,
        nucleo: ['no_sirve'],
        alternativasValidas: ['Hablar primero con el amigo más sobrio para que lo acompañe a salir'],
        erroresCriticos: [
          { id: 'sirve', texto: 'Le sirve el mezcal o cualquier otra bebida con alcohol' },
          { id: 'exhibe', texto: 'Lo exhibe, lo humilla o usa la fuerza' },
        ],
      },
      {
        tipo: 'abierta',
        q: 5,
        enunciado:
          'Dos jóvenes se sientan en la barra y piden dos Cantaritos Llorones. Uno de ellos se ve muy joven. Su amigo te dice: «Tranquilo, él tiene 19, nada más dejó la INE en el coche; yo sí traigo la mía». ¿Qué haces?',
        dimension: 'alcohol_responsable',
        evalua: 'No servir alcohol sin comprobar la mayoría de edad y evitar que se lo pasen',
        tareaReal: 'Servicio responsable de alcohol: identificación de menores',
        indispensable: true,
        esenciales: [
          {
            id: 'identificacion',
            texto: 'Pide identificación oficial a cada persona a la que va a servir alcohol',
          },
          {
            id: 'sin_ine',
            texto: 'Al que no muestra identificación no le sirve alcohol',
          },
          {
            id: 'alternativa',
            texto: 'Le ofrece una bebida sin alcohol (mocktail, refresco, agua)',
          },
          {
            id: 'vigila',
            texto: 'Si sirve al amigo, cuida que no le pase su bebida al que no se identificó',
          },
          {
            id: 'respeto',
            texto: 'Lo explica con amabilidad, sin acusarlos',
          },
          {
            id: 'escala',
            texto: 'Si insisten, avisa al jefe de barra o al capitán',
          },
        ],
        minimoCorrecta: 4,
        nucleo: ['sin_ine'],
        alternativasValidas: ['Ofrecer servirle cuando regrese con la identificación del coche'],
        erroresCriticos: [
          {
            id: 'sirve_sin_id',
            texto: 'Sirve alcohol a quien no mostró identificación',
          },
          {
            id: 'pasa_bebida',
            texto: 'Sirve los dos cantaritos sabiendo que uno es para el que no se identificó',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 6,
        enunciado:
          'Viernes, 9:30 pm. Un mesero llega corriendo a la barra: «Sácame cuatro mezcales Tobalá para la mesa 15, ahorita los marco, el sistema está lento». ¿Qué haces?',
        dimension: 'operacion',
        evalua: 'Despachar sólo lo que está capturado en el POS',
        tareaReal: 'Comandas del POS (Manual: está prohibido llevar algo que no se haya ingresado al sistema)',
        indispensable: true,
        esenciales: [
          {
            id: 'no_despacha',
            texto: 'No entrega los mezcales hasta que la comanda aparece en el sistema',
          },
          {
            id: 'pide_captura',
            texto: 'Le pide que los capture en ese momento (o que pida ayuda para capturarlos)',
          },
          {
            id: 'sigue_cola',
            texto: 'Mientras, sigue con las comandas que sí están en el sistema',
          },
          {
            id: 'falla',
            texto:
              'Distingue lento de caído: si el sistema de verdad no funciona, avisa al jefe de barra o al encargado para que autorice la contingencia (comanda manual o folio que se captura después)',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Dejar lista la cristalería mientras el mesero captura, sin servir ni entregar',
          'Con el sistema caído, despachar sólo con la comanda manual o el folio que autorizó el encargado, para capturarla y conciliarla al volver el sistema',
        ],
        erroresCriticos: [
          {
            id: 'sin_comanda',
            texto:
              'Entrega los mezcales con la sola promesa de marcarlos después, sin comanda en el sistema ni contingencia autorizada por el encargado',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 7,
        enunciado:
          'Viernes, 10:15 pm. En la pantalla de barra hay 14 bebidas pendientes: 6 cocteles para el piso que llevan 10 minutos esperando, 4 cervezas, 2 copas de vino y 2 mezcales. Un mesero te reclama que su mesa ya preguntó dos veces por sus bebidas. ¿Qué haces?',
        dimension: 'tecnica',
        evalua: 'Sacar una cola atrasada sin sacrificar la receta y comunicando tiempos reales',
        tareaReal: 'Tiempos de servicio (Manual: embotellados y vino en menos de 5 minutos, cócteles en menos de 8; si no, avisar al cliente)',
        indispensable: false,
        esenciales: [
          {
            id: 'rapidas',
            texto:
              'Saca pronto lo que no requiere preparación (cervezas, vino, mezcales), él mismo o separando ese flujo con un compañero',
          },
          {
            id: 'tandas',
            texto: 'Ordena los cocteles por antigüedad y prepara juntos los que son iguales',
          },
          {
            id: 'medidas',
            texto: 'Mantiene las medidas y la receta aunque vaya con prisa',
          },
          {
            id: 'avisa',
            texto: 'Le da al mesero un tiempo real para que se lo diga a la mesa',
          },
          {
            id: 'apoyo',
            texto: 'Pide apoyo al backbar o a un compañero (hielo, cristalería, garnish) o avisa al jefe de barra',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Atender primero la mesa que ya reclamó dos veces si sus bebidas son de las más antiguas',
          'Repartir la cola: un compañero o el backbar saca las bebidas directas mientras él prepara los cocteles más antiguos (cuenta como «rapidas»)',
          'Sacar primero los cocteles más atrasados y luego las directas, si lo justifica con la antigüedad y el tiempo que comunica',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 8,
        enunciado:
          'En pleno servicio, un compañero saca hielo con un vaso y el vaso se rompe dentro de la hielera de la barra. Tienes varias bebidas en cola. ¿Qué haces?',
        dimension: 'operacion',
        evalua: 'Higiene y seguridad del hielo cuando se rompe cristal',
        tareaReal: 'Higiene de barra y registro de rotos',
        indispensable: false,
        esenciales: [
          {
            id: 'detiene',
            texto: 'Deja de usar ese hielo de inmediato',
          },
          {
            id: 'vacia',
            texto: 'Vacía o derrite con agua caliente todo el hielo de la hielera, no sólo los pedazos que se ven',
          },
          {
            id: 'limpia',
            texto: 'Retira los vidrios con cuidado y lava la hielera antes de volver a llenarla',
          },
          {
            id: 'pala',
            texto: 'Vuelve a llenar con hielo nuevo usando pala o cucharón, nunca un vaso',
          },
          {
            id: 'avisa',
            texto: 'Avisa a los meseros de la demora',
          },
          {
            id: 'registra',
            texto: 'Registra el vaso roto en el formato de rotos',
          },
        ],
        minimoCorrecta: 5,
        alternativasValidas: [
          'Usar hielo de otra hielera limpia mientras se vacía y lava la contaminada (cuenta como «detiene»; no sustituye vaciar, limpiar y rellenar la contaminada)',
        ],
        erroresCriticos: [
          {
            id: 'sigue',
            texto: 'Sigue sirviendo de esa hielera o sólo saca los pedazos de vidrio que ve',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 9,
        enunciado:
          'Te toca abrir la barra un viernes. El servicio empieza a la 1:00 pm y son las 12:30. Encuentras un recipiente de jugo de limón sin etiqueta que huele agrio, la máquina hizo la mitad del hielo de siempre, en el riel falta la botella de Controy y la cristalería de mezcal está húmeda. ¿Qué haces y cómo dejas la barra antes de abrir?',
        dimension: 'operacion',
        evalua: 'Abrir la barra con producciones rotuladas, insumos completos y pendientes comunicados',
        tareaReal: 'Bar set up y rotulados (Manual: barra lista 10 minutos antes de abrir; todo producto con fecha de elaboración y caducidad)',
        indispensable: false,
        esenciales: [
          {
            id: 'desecha',
            texto: 'Desecha el jugo sin etiqueta y lo registra como merma',
          },
          {
            id: 'rotula',
            texto: 'Prepara jugo nuevo y lo rotula con nombre, fecha de elaboración y caducidad',
          },
          {
            id: 'hielo',
            texto: 'Avisa al jefe de barra o al encargado de la falta de hielo para conseguirlo antes del pico',
          },
          {
            id: 'controy',
            texto: 'Repone el Controy del almacén o, si no hay, lo avisa para que se comunique como faltante (86)',
          },
          {
            id: 'cristaleria',
            texto:
              'Deja la cristalería limpia y seca antes de abrir (secándola y puliéndola o con el método de la casa)',
          },
          {
            id: 'lista',
            texto: 'Deja la barra lista 10 minutos antes de abrir e informa los pendientes en el briefing',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Revisar rótulo, aspecto y olor de las demás producciones abiertas antes de decidir cuáles se quedan (el jugo sin etiqueta y agrio se desecha sin probarlo)',
        ],
        erroresCriticos: [
          {
            id: 'usa_sin_rotulo',
            texto: 'Usa en el servicio el jugo sin etiqueta o en mal estado',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 10,
        enunciado:
          'Un cliente sentado en la barra pide su cuenta. Al revisar la precuenta ves que tiene 3 copas de mezcal, pero tú le serviste 4, y que aparece una cerveza que en realidad fue para el cliente de al lado. ¿Qué haces antes de que pague?',
        dimension: 'control',
        evalua: 'Revisar la precuenta y corregirla antes del cobro',
        tareaReal: 'Precuenta y cobro (Manual: si faltan productos se agregan e informan al jefe de turno; si sobran, se informa para resolverlo)',
        indispensable: false,
        esenciales: [
          {
            id: 'revisa',
            texto: 'Revisa la precuenta producto por producto antes de entregarla',
          },
          {
            id: 'agrega',
            texto: 'Agrega la cuarta copa que sí sirvió',
          },
          {
            id: 'cerveza',
            texto: 'Pasa la cerveza a la cuenta correcta o informa al jefe de turno para que la quite',
          },
          {
            id: 'informa',
            texto: 'Avisa al jefe de turno de las dos correcciones',
          },
          {
            id: 'cobro',
            texto: 'El cobro lo hace quien la casa autoriza (o pide autorización para cobrar)',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: ['Explicar al cliente el ajuste al entregarle la cuenta corregida'],
        erroresCriticos: [
          {
            id: 'cobra_ajeno',
            texto: 'Le cobra la cerveza que no fue suya',
          },
          {
            id: 'regala',
            texto: 'Deja sin cobrar la copa que sirvió',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 11,
        enunciado:
          'Un cliente de la barra paga una cuenta de $1,240 con tarjeta. La terminal marca «error de comunicación» y no imprime comprobante. El cliente tiene prisa y te pide que la pases otra vez. ¿Qué haces?',
        dimension: 'control',
        evalua: 'Evitar un doble cobro y dejar evidencia',
        tareaReal: 'Cobro con terminal y comprobantes',
        indispensable: false,
        esenciales: [
          {
            id: 'verifica',
            texto: 'Antes de repetir, revisa en la terminal si la primera operación quedó aprobada (último movimiento o reimpresión)',
          },
          {
            id: 'cliente',
            texto: 'Le pide al cliente que revise en su banco o app si ya le llegó el cargo',
          },
          {
            id: 'no_repite',
            texto: 'Sólo vuelve a cobrar cuando confirmó que el primer intento no pasó',
          },
          {
            id: 'evidencia',
            texto: 'Guarda el comprobante o folio y lo liga a la cuenta en el POS',
          },
          {
            id: 'escala',
            texto: 'Si resulta un doble cargo, avisa al gerente con la evidencia para la devolución',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Ofrecer otro medio de pago, pero cobrarlo sólo después de confirmar que el primer intento no se aprobó (o con la conciliación que autorice el gerente)',
          'Si la terminal la opera el subgerente o el gerente, avisarle en ese momento para que verifique el primer intento antes de cobrar de nuevo (cuenta como «verifica»)',
        ],
        erroresCriticos: [
          {
            id: 'repite',
            texto: 'Vuelve a pasar la tarjeta sin verificar el primer intento',
          },
          {
            id: 'devuelve',
            texto: 'Devuelve dinero en efectivo o hace una devolución por su cuenta',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 12,
        enunciado:
          'Un cliente que viene todas las semanas te dice en la barra: «Invítame este mezcal, ¿no? Siempre vengo». ¿Qué haces?',
        dimension: 'control',
        evalua: 'Manejar una petición de cortesía sin autorizarla por su cuenta',
        tareaReal: 'Cortesías (Política de dinero: cortesía menor la autoriza gerente o subgerente; el bartender sólo solicita)',
        indispensable: false,
        esenciales: [
          {
            id: 'calidez',
            texto: 'Lo trata con calidez y reconoce que es cliente frecuente',
          },
          {
            id: 'no_regala',
            texto: 'No le sirve el mezcal sin cobro por su cuenta',
          },
          {
            id: 'solicita',
            texto: 'Si cree que procede, lo solicita al gerente o al subgerente',
          },
          {
            id: 'registra',
            texto: 'Si se autoriza, queda registrada en el POS como cortesía (con quien la autorizó)',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Explicarle con amabilidad que él no puede autorizarlo y ofrecerle su mezcal de siempre cobrado normalmente',
        ],
        erroresCriticos: [
          {
            id: 'regala',
            texto: 'Le sirve el mezcal sin cobrarlo ni registrarlo',
          },
        ],
      },
    ],
  },
  competencias: {
    version: 'competencias_barman_v1',
    preguntas: [
      // ── Integridad (4, todas de experiencia) ──
      {
        texto:
          'Cuéntame de la última vez que te dieron cambio de más, te cobraron de menos o te pagaron algo que no te correspondía: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Avisó o devolvió la diferencia aunque nadie lo habría notado',
          'Relata el hecho con detalles concretos (lugar, monto, persona)',
        ],
        senalesAlerta: ['Se quedó con la diferencia y lo presenta como algo normal o como suerte'],
      },
      {
        texto:
          'Cuéntame de una vez que un amigo o un conocido te pidió algo gratis o un trato especial en un lugar donde trabajabas: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Separó la amistad de lo que le correspondía decidir',
          'Pidió autorización o se negó con buena manera',
        ],
        senalesAlerta: ['Regaló producto del negocio sin autorización y lo ve normal'],
      },
      {
        texto:
          'Cuéntame de la última vez que rompiste, perdiste o echaste a perder algo que no era tuyo: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo dijo él mismo a quien correspondía',
          'Se hizo cargo de reponerlo o repararlo',
        ],
        senalesAlerta: ['Lo escondió o culpó a otra persona'],
      },
      {
        texto:
          'Cuéntame de una vez que te diste cuenta de que alguien a tu alrededor estaba tomando algo que no era suyo (dinero, producto, tiempo pagado): qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Actuó o lo informó a quien correspondía aunque le costara',
          'Cuenta hechos concretos, no rumores',
        ],
        senalesAlerta: ['Participó o encubrió el robo'],
      },
      // ── Autoconciencia ──
      {
        texto:
          'Cuéntame de la última vez que alguien te corrigió la forma de hacer algo que tú creías que hacías bien: qué te dijo, qué hiciste tú y cómo terminó.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reconoce qué tenía razón la otra persona',
          'Describe el cambio concreto que hizo',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que la presión o el cansancio te hicieron trabajar peor de lo normal: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Identifica qué le pasa cuando está bajo presión',
          'Cuenta lo que hace ahora para que no le gane',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que te diste cuenta de que no sabías algo que se suponía que debías saber: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo admitió en lugar de fingir',
          'Buscó aprenderlo y cuenta cómo',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Un cliente te devuelve un coctel que preparaste y dice que sabe muy distinto al que tomó la semana pasada. ¿Qué haces?',
        eje: 'autoconciencia',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Revisa su propia preparación antes de suponer que el cliente se equivoca',
          'Le ofrece rehacerlo con la receta y le pregunta qué notó distinto',
        ],
        senalesAlerta: [],
      },
      // ── Ética de trabajo ──
      {
        texto:
          'Cuéntame de la última vez que terminaste algo que otra persona dejó a medias: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo terminó bien aunque no le tocaba',
          'Avisó a quien correspondía para que no se repitiera',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que tuviste que cumplir una regla o un procedimiento que te parecía innecesario: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo cumplió y, si no estaba de acuerdo, lo planteó a quien correspondía',
          'Entendió después para qué servía o propuso una mejora',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que te tocó hacer la parte menos visible de un trabajo (limpiar, ordenar, contar, preparar): qué hiciste tú y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'La hizo completa y con cuidado',
          'Explica por qué importaba aunque nadie la viera',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Son las 2:00 de la madrugada, ya se fue el último cliente y a ti y a tu compañero les falta lavar y pulir la cristalería. Él te dice que la dejen para el turno de mañana. ¿Qué haces?',
        eje: 'etica_trabajo',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Termina lo que corresponde a su turno',
          'Deja la cristalería limpia y lista con el método de la casa (pulir no es la única forma válida)',
          'Piensa en cómo encontrará la barra el compañero que abre',
        ],
        senalesAlerta: [],
      },
      // ── Empatía ──
      {
        texto:
          'Cuéntame de la última vez que alguien nuevo en un grupo o un trabajo necesitaba ayuda y tú se la diste: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Notó la necesidad sin que se la pidieran',
          'Ayudó sin hacer sentir mal a la persona',
        ],
        senalesAlerta: ['Relata que se burló del nuevo o lo dejó solo a propósito'],
      },
      {
        texto:
          'Cuéntame de una vez que tuviste que decirle que no a alguien que te caía bien: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Sostuvo el no y cuidó la relación',
          'Explica cómo eligió las palabras pensando en la otra persona',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que te diste cuenta de que alguien estaba incómodo en una reunión, una fiesta o un lugar público: qué notaste, qué hiciste tú y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe señales concretas',
          'Hizo algo que ayudó a esa persona',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Una clienta sola en la barra pide su tercer coctel y te cuenta, llorando, que acaba de terminar con su pareja. ¿Qué haces?',
        eje: 'empatia',
        tipo: 'hipotetica',
        senalesPositivas: [
          'La escucha con respeto sin invadir',
          'Cuida su estado (agua, comida, cómo se va a ir) sin dejar de servir con responsabilidad',
        ],
        senalesAlerta: [],
      },
      // ── Curiosidad ──
      {
        texto:
          'Cuéntame de la última vez que probaste o investigaste algo nuevo (una receta, una técnica, una herramienta) por tu cuenta: qué fue, cómo lo hiciste y qué aprendiste.',
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
          'Cuéntame de una vez que le preguntaste a alguien que sabía más que tú para entender por qué algo se hacía de cierta forma: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Hizo preguntas concretas',
          'Cuenta qué cambió en su forma de hacerlo',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que notaste un patrón en lo que la gente pedía o prefería y lo usaste: qué notaste, qué hiciste tú y cómo terminó.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe la observación con detalle',
          'La convirtió en una acción útil',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Llega a la barra un mezcal nuevo de un agave que no conoces y mañana lo vas a empezar a servir. ¿Qué te gustaría saber de él antes de recomendarlo?',
        eje: 'inteligencia_curiosa',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Pregunta por datos concretos (agave, región, productor, proceso, perfil)',
          'Quiere probarlo y pensar a qué cliente le gustaría',
        ],
        senalesAlerta: [],
      },
      // ── Optimismo ──
      {
        texto:
          'Cuéntame de la última vez que un día de trabajo o de escuela empezó muy mal: qué pasó, qué hiciste tú para enderezarlo y cómo terminó.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe qué hizo para recuperarse',
          'No se quedó en la queja',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que animaste a alguien que estaba por rendirse: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Hizo algo concreto, no sólo decir «échale ganas»',
          'Se fija en lo que le pasó a la otra persona',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que algo que esperabas no salió como querías y aun así le encontraste algo bueno: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reconoce la decepción sin quedarse en ella',
          'Nombra un aprendizaje o una oportunidad concreta',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Es sábado, te devolvieron tres cocteles seguidos y el jefe de barra te corrigió frente al equipo. Todavía faltan cuatro horas de servicio. ¿Cómo sigues el turno?',
        eje: 'optimismo_bondadoso',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Describe cómo se recompone para el siguiente coctel',
          'Busca entender qué falló sin desquitarse con nadie',
        ],
        senalesAlerta: [],
      },
    ],
  },
}
