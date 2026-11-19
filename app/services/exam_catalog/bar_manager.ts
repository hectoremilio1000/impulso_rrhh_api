import type { ExamenPuesto } from './types.js'

// Encargado de barra / jefe de barra (code 'bar_manager') — catálogo
// 2026-11-16, v1. Puesto de mando: 30 preguntas de competencias.
//
// No comparte examen con Barman: el barman prepara y despacha; el encargado
// cuenta y explica la merma de la semana, pide al proveedor, recibe, arma y
// capacita al equipo de barra, revisa cortesías y cancelaciones, abre y
// cierra la barra y responde por los incidentes. Ver
// docs/examenes/puestos/bar_manager.md.
//
// Fuentes: «Manual de Introducción Barman» (requisiciones por par stock,
// procedimiento de inventario con supervisión e investigación de diferencias,
// recepción de pedidos con foto de factura al grupo «facturas llorona»,
// rotulados, rotos, reglas de la casa, organigrama: Jefe de Barra →
// Bartenders → Backbar), «Sesion4_Politica_Dinero.md» (cancelación después
// de enviar a producción y cortesías: gerente o subgerente; reembolsos: sólo
// gerente u owner) y «recetario_completo_barra_23_06_26» (copa 60 ml,
// botella 700 ml, Margara Sagrada y Pierde Almas con 45 ml de Llorona
// Espadín). Las cantidades van dentro del enunciado. La Política de dinero no
// nombra al jefe de barra: lo que pueda autorizar va en pendientesOperador.

export const EXAMEN_BAR_MANAGER: ExamenPuesto = {
  code: 'bar_manager',
  label: 'Encargado de barra',
  aliases: [
    'encargado de barra',
    'encargada de barra',
    'jefe de barra',
    'jefa de barra',
    'bar manager',
    'head bartender',
    'capitan de barra',
  ],
  tareas: [
    'Cuenta el inventario de barra, calcula la merma por botella y explica las diferencias',
    'Hace las requisiciones y pedidos según el par stock y recibe al proveedor',
    'Arma los roles del equipo de barra (bartenders y backbar) y lo capacita en recetas y estándares',
    'Revisa cortesías, cancelaciones y mermas de la barra y reporta lo que no cuadra',
    'Abre y cierra la barra: producciones, hielo, inventario de cierre, requisición y entrega al siguiente turno',
    'Responde por los incidentes de la barra (alcohol, seguridad, consumo del personal)',
  ],
  facultades: {
    decide: [
      'Posiciones, descansos y apoyo de bartenders y backbar dentro del turno',
      'Cómo y cuándo capacita y corrige a un bartender en turno',
      'Requisición diaria y ajuste del par stock de barra según el día o un evento',
      'Rechazar o anotar en la factura producto dañado o faltante al recibir',
      'Retirar un insumo y comunicar un faltante (86) o un sustituto de marca',
      'Respaldar el corte de alcohol que decidió un bartender',
    ],
    escala: [
      'Cancelaciones de productos ya enviados a preparar y cortesías (gerente o subgerente)',
      'Cualquier reembolso al cliente (sólo gerente u owner)',
      'Sanciones o bajas de personal, incluido el consumo de alcohol en turno (el reglamento lo marca como baja definitiva)',
      'Diferencias de inventario que apuntan a un posible robo: junta evidencia y deja la decisión al gerente',
      'Notas de crédito y reclamos al proveedor (compras o gerente)',
      'Seguridad o agresión: seguridad y gerente de inmediato',
    ],
    pendientesOperador: [
      'Si el jefe de barra puede autorizar cortesías o cancelaciones de barra (la Política de dinero no lo nombra)',
      'Si el jefe de barra puede retirar del turno o mandar a casa a un bartender, o sólo sacarlo de la barra y avisar; quién decide que salga del establecimiento tras beber en turno',
      'Quién aprueba el par stock y si el jefe de barra pide directo al proveedor o a través del encargado de compras',
      'Si el par stock se cuenta en botellas cerradas o en volumen equivalente (¿la botella abierta cuenta como fracción?) y cómo se redondea el pedido a cajas',
      'Merma aceptable por botella o por semana en La Llorona',
      'Confirmar el recetario vigente (Margara Sagrada y Pierde Almas con 45 ml de Llorona Espadín; copa 60 ml; botella 700 ml)',
      'Quién aprueba un cambio de receta o de marca en un coctel de la carta',
      'Política de llaves y resguardo del almacén de alcohol al cierre: quién es el custodio de las llaves y cómo se entregan (bitácora, firma) si el jefe de barra se va antes',
    ],
  },
  practico: {
    version: 'banco_bar_manager_v1',
    dimensiones: [
      { id: 'inventario', nombre: 'Inventario, merma y compras', peso: 30 },
      { id: 'equipo', nombre: 'Roles y capacitación del equipo de barra', peso: 25 },
      { id: 'controles', nombre: 'Cortesías, cancelaciones y reembolsos', peso: 20 },
      { id: 'operacion', nombre: 'Apertura, cierre e incidentes', peso: 25 },
    ],
    umbralAprobado: 70,
    preguntas: [
      {
        tipo: 'numerica',
        q: 1,
        enunciado:
          'Revisas la semana de Llorona Espadín (botella de 700 ml). Inventario del lunes al abrir: 6 botellas cerradas y una abierta con 350 ml. Compras de la semana: 12 botellas. Inventario del domingo al cerrar: 8 botellas cerradas y una abierta con 200 ml. El POS registra en la semana 40 copas de Llorona Espadín (60 ml cada una), 60 Margara Sagrada y 20 Pierde Almas (cada coctel lleva 45 ml de Llorona Espadín). ¿Cuántos mililitros de Llorona Espadín se consumieron sin una venta registrada?',
        dimension: 'inventario',
        evalua: 'Calcular la merma por botella: inventario inicial + compras − inventario final contra lo vendido',
        tareaReal: 'Procedimiento de inventarios (Manual: «se revisan diferencias entre el inventario anterior, restándole la venta»)',
        indispensable: true,
        clave: 1150,
        tolerancia: 10,
        unidad: 'ml',
        solucion:
          'Inicial: 6 × 700 + 350 = 4,550 ml. Más compras: 12 × 700 = 8,400 → 12,950 ml. Final: 8 × 700 + 200 = 5,800 ml. Consumo real: 12,950 − 5,800 = 7,150 ml. Vendido: 40 × 60 = 2,400 + 60 × 45 = 2,700 + 20 × 45 = 900 → 6,000 ml. Sin venta: 7,150 − 6,000 = 1,150 ml.',
      },
      {
        tipo: 'abierta',
        q: 2,
        enunciado:
          'La revisión de la semana muestra que de Llorona Espadín se fueron unos 1,400 ml que no aparecen en ninguna venta. En la barra trabajan tres bartenders en distintos turnos. ¿Qué haces con esa diferencia?',
        dimension: 'inventario',
        evalua: 'Investigar una merma con datos, poner un control y reportarla sin acusar sin evidencia',
        tareaReal: 'Investigación de diferencias de inventario',
        indispensable: true,
        esenciales: [
          {
            id: 'verifica',
            texto: 'Comprueba que el conteo y las compras registradas estén bien antes de concluir',
          },
          {
            id: 'registrables',
            texto: 'Revisa lo que puede explicarla: mermas y rotos registrados, cortesías y cancelaciones en el POS, comandas sin capturar',
          },
          {
            id: 'turno',
            texto: 'Compara por turno (conteo de la botella en uso al cambio de turno) para ubicar dónde aparece la diferencia',
          },
          {
            id: 'control',
            texto: 'Pone un control concreto: jigger obligatorio, conteo de botella al cambio de turno o botella vacía por llena',
          },
          {
            id: 'reporta',
            texto: 'Reporta al gerente con los números y, si apunta a un posible robo, le deja la decisión con la evidencia',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Hacer un conteo sorpresa de la botella en uso durante varios turnos antes de hablar con el equipo',
        ],
        erroresCriticos: [
          {
            id: 'ajusta',
            texto: 'Ajusta el inventario o la planilla para que cuadre, o dice que la va a ocultar o dejar sin reportar',
          },
          {
            id: 'acusa',
            texto: 'Acusa o castiga a un bartender sin evidencia',
          },
        ],
      },
      {
        tipo: 'numerica',
        q: 3,
        enunciado:
          'El par stock de Llorona Espadín para el fin de semana es de 16 botellas. Hoy jueves tienes 8 botellas cerradas y una abierta con 200 ml (botella de 700 ml). El proveedor sólo vende cajas de 6 botellas. ¿Cuántas cajas pides para no quedar por debajo del par?',
        dimension: 'inventario',
        evalua: 'Calcular un pedido con par stock y presentación del proveedor',
        tareaReal: 'Requisiciones por par stock (Manual: «todas las requisiciones se harán en base al par stock»)',
        indispensable: false,
        clave: 2,
        tolerancia: 0,
        unidad: 'cajas',
        solucion:
          'Par en botellas cerradas: faltan 16 − 8 = 8 botellas (la abierta, con 200 ml, no completa una). Par en volumen: faltan 16 − (8 + 200/700) ≈ 7.7 botellas. En los dos casos una caja (6) no alcanza y dos cajas (12) cubren el par; las cajas se redondean hacia arriba: 2 cajas.',
      },
      {
        tipo: 'abierta',
        q: 4,
        enunciado:
          'Llega el proveedor con el pedido. Pediste 2 cajas de Llorona Espadín y 6 botellas de Controy. La factura cobra 3 cajas de Espadín; al revisar cuentas 2 cajas, una botella tiene el sello roto y el Controy no viene. El repartidor tiene prisa y te pide que firmes. ¿Qué haces?',
        dimension: 'inventario',
        evalua: 'Recibir un pedido contra lo pedido y lo facturado, y resolver el faltante',
        tareaReal: 'Recibo de facturas, notas y pedidos (Manual: foto de la factura con fecha, nombre, firma, hora y lo recibido)',
        indispensable: false,
        esenciales: [
          {
            id: 'cuenta',
            texto: 'Cuenta lo que llegó contra el pedido y la factura antes de firmar',
          },
          {
            id: 'anota',
            texto: 'Anota en la factura o nota lo que realmente recibió (2 cajas, no 3; sin Controy)',
          },
          {
            id: 'sello',
            texto: 'Rechaza o anota la botella con el sello roto y no la pone en servicio',
          },
          {
            id: 'foto',
            texto: 'Manda la foto de la factura firmada al grupo de facturas (los datos del formato —fecha, nombre, hora, lo recibido— son detalle, no condición)',
          },
          {
            id: 'faltante',
            texto: 'Avisa a compras o al gerente de la caja cobrada de más para el reclamo o la nota de crédito (la solicita; no la autoriza él)',
          },
          {
            id: 'controy',
            texto: 'Resuelve el Controy que no llegó: otro proveedor, un sustituto o avisar el faltante en el briefing',
          },
        ],
        minimoCorrecta: 5,
        alternativasValidas: ['Pedir al repartidor que espere o que llame a su oficina para corregir la factura en el momento'],
        erroresCriticos: [
          {
            id: 'firma_completo',
            texto: 'Firma de recibido completo sin contar o sin anotar las diferencias',
          },
          {
            id: 'sello_roto',
            texto: 'Acepta y pone en servicio la botella con el sello roto',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 5,
        enunciado:
          'Es sábado. Tienes tres bartenders —uno entró hace una semana— y un backbar. El servicio abre a la 1 pm, el pico es de 9 a 12 de la noche y a las 8 pm llega un grupo de 30 personas con reserva que va a pedir rondas de cocteles. ¿Cómo repartes al equipo de barra y cómo sabrás a mitad del turno si funcionó?',
        dimension: 'equipo',
        evalua: 'Armar los roles de la barra con criterio y comprobarlos durante el turno',
        tareaReal: 'Roles del equipo de barra (organigrama: Jefe de Barra → Bartenders → Backbar)',
        indispensable: false,
        esenciales: [
          {
            id: 'posiciones',
            texto: 'Asigna posiciones claras (clientes de barra, comandas del piso, producción) y le da al backbar tareas concretas (hielo, cristalería, reposición)',
          },
          {
            id: 'nuevo',
            texto: 'Pone al bartender nuevo con apoyo o junto a alguien con experiencia, no solo en el pico',
          },
          {
            id: 'produccion',
            texto: 'Deja lista antes de las 8 la producción calculada para el grupo (jugos, jarabes, garnish, hielo)',
          },
          {
            id: 'descansos',
            texto: 'Escalona descansos y comida fuera del pico',
          },
          {
            id: 'verifica',
            texto: 'A mitad del turno revisa una señal concreta (tiempo de cocteles contra los 8 minutos, cola de comandas, hielo) y reacomoda',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Ponerse él mismo en la posición de comandas del piso durante el grupo de 30',
        ],
        nucleo: ['nuevo'],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 6,
        enunciado:
          'Un bartender que lleva dos meses en la barra sirve las copas de mezcal sin medir: unas quedan de 70 ml y otras de 50. Dos clientes comentaron que su Margara Sagrada no sabía igual que otras veces. ¿Qué haces?',
        dimension: 'equipo',
        evalua: 'Corregir y capacitar con método: observar, enseñar, practicar, volver a observar',
        tareaReal: 'Capacitación del equipo de barra en recetas y medidas',
        indispensable: false,
        esenciales: [
          {
            id: 'observa',
            texto: 'Confirma con un dato: lo observa preparar o mide algunos servicios',
          },
          {
            id: 'privado',
            texto: 'Habla con él en privado y le describe lo que observó',
          },
          {
            id: 'ensena',
            texto: 'Le enseña con la receta y el jigger, lo demuestra y lo pone a practicar',
          },
          {
            id: 'reobserva',
            texto: 'Vuelve a observarlo en los siguientes turnos y anota si cambió',
          },
          {
            id: 'escala',
            texto: 'Si persiste después de la corrección, lo documenta y lo lleva al gerente',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: ['Hacer una microcapacitación de medidas para todo el equipo en el briefing, además de hablar con él'],
        erroresCriticos: [
          {
            id: 'exhibe',
            texto: 'Lo regaña o lo exhibe frente a clientes o compañeros',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 7,
        enunciado:
          'Revisando el turno en el POS encuentras que un bartender tiene 5 cancelaciones de cocteles que ya se habían enviado a preparar, todas sin nombre de quien autorizó, y hay 3 mezcales registrados como cortesía con la nota «amigos». ¿Qué haces?',
        dimension: 'controles',
        evalua: 'Revisar cancelaciones y cortesías contra la política y llevarlas a quien decide',
        tareaReal: 'Control de cortesías y cancelaciones (Política de dinero: cancelación después de enviar a producción y cortesías las autoriza gerente o subgerente)',
        indispensable: true,
        esenciales: [
          {
            id: 'revisa',
            texto: 'Revisa cada caso en el POS (hora, mesa, quién, motivo) y lo cruza con comandas o con la botella',
          },
          {
            id: 'autorizacion',
            texto: 'Antes de concluir, verifica con el gerente o el subgerente (o en el registro) si alguien autorizó esas cancelaciones y cortesías',
          },
          {
            id: 'escucha',
            texto: 'Habla con el bartender para escuchar su versión',
          },
          {
            id: 'reporta',
            texto: 'Documenta y reporta al gerente con la evidencia; la sanción la decide el gerente',
          },
          {
            id: 'regla',
            texto: 'Refuerza con el equipo que nadie cancela ni regala sin autorización y nota en el POS',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Revisar también los turnos anteriores de ese bartender para ver si es un patrón',
          'Si hubo una autorización real previa, documentar quién y cuándo la dio, con la fecha real (rectificar el registro no es inventar una aprobación)',
        ],
        erroresCriticos: [
          {
            id: 'autoriza_despues',
            texto: 'Las autoriza él mismo después, las borra o les inventa una nota o un autorizador para que parezcan en regla',
          },
          {
            id: 'deja_pasar',
            texto: 'Decide dejarlo pasar o archivarlo sin avisar al gerente',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 8,
        enunciado:
          'Sábado, 12:15 pm; el servicio empieza a la 1:00. El bartender que abre no ha llegado y no contesta. La planilla del inventario de cierre de anoche está vacía, en el riel hay dos botellas vacías de mezcal sin registro y las producciones (jugos, jarabes) no están hechas. ¿Qué haces?',
        dimension: 'operacion',
        evalua: 'Abrir la barra a tiempo y sin perder el control de lo que pasó la noche anterior',
        tareaReal: 'Apertura de barra (Manual: barra lista 10 minutos antes; inventario de cierre en la planilla)',
        indispensable: false,
        esenciales: [
          {
            id: 'cubre',
            texto: 'Cubre la apertura (llama a otro bartender, reasigna o la hace él mismo) y avisa al subgerente de la falta',
          },
          {
            id: 'prioriza',
            texto: 'Prioriza producciones y hielo para tener la barra lista 10 minutos antes de abrir, todo rotulado',
          },
          {
            id: 'conteo',
            texto: 'Hace un conteo rápido de las botellas clave antes de abrir para tener un punto de partida',
          },
          {
            id: 'investiga',
            texto: 'Registra las botellas vacías y la planilla vacía y lo aclara con quien cerró',
          },
          {
            id: 'reporta',
            texto: 'Reporta al gerente o subgerente el cierre sin inventario',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: ['Pedir al backbar que haga producciones mientras él cuenta'],
        nucleo: ['conteo'],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 9,
        enunciado:
          'Son las 2:10 de la madrugada de un sábado y se fue el último cliente. Tus dos bartenders quieren irse ya. Mañana abre el bartender que entró hace una semana y tú llegas hasta las 6 pm. ¿Qué haces antes de irte?',
        dimension: 'operacion',
        evalua: 'Cerrar la barra con inventario, mermas, requisición y entrega al siguiente turno',
        tareaReal: 'Cierre de barra (Manual: inventario al cierre en la planilla, requisición por par stock, rotos y mermas)',
        indispensable: true,
        esenciales: [
          {
            id: 'inventario',
            texto: 'Hace o supervisa el inventario de cierre en la planilla, y verifica al azar algunos productos',
          },
          {
            id: 'mermas',
            texto: 'Registra mermas y rotos del día',
          },
          {
            id: 'requisicion',
            texto: 'Deja la requisición de mañana según el par stock',
          },
          {
            id: 'barra',
            texto: 'Deja la barra limpia y las producciones rotuladas o desechadas',
          },
          {
            id: 'resguardo',
            texto: 'Deja el alcohol y el almacén bajo llave, o entrega las llaves de forma documentada al custodio autorizado',
          },
          {
            id: 'entrega',
            texto: 'Deja instrucciones por escrito para el bartender que abre (pendientes, faltantes, producciones)',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: ['Dividir el cierre entre los dos bartenders y verificar él lo hecho antes de que se vayan'],
        erroresCriticos: [
          {
            id: 'sin_inventario',
            texto: 'Dice que se va o deja ir al equipo sin hacer el inventario de cierre',
          },
          {
            id: 'almacen_abierto',
            texto: 'Dice que deja el almacén de alcohol abierto o las llaves sin entregar a nadie',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 10,
        enunciado:
          'Durante el servicio ves que un bartender que está en periodo de prueba se sirve un shot de mezcal detrás de la barra y se lo toma. ¿Qué haces?',
        dimension: 'equipo',
        evalua: 'Actuar ante el consumo de alcohol en turno y dejar la sanción a quien la decide',
        tareaReal: 'Reglas de la casa (consumo de alcohol en horario laboral: baja definitiva)',
        indispensable: false,
        esenciales: [
          {
            id: 'retira',
            texto: 'Lo aparta de la barra en ese momento (deja de servir) y cubre su posición; la salida del turno o la sanción las decide el gerente',
          },
          {
            id: 'privado',
            texto: 'Habla con él en privado, no frente a clientes',
          },
          {
            id: 'documenta',
            texto: 'Documenta lo que vio (hora, qué tomó, testigos) y lo registra como merma',
          },
          {
            id: 'gerente',
            texto: 'Avisa al gerente o subgerente, que decide la consecuencia',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: ['Pedir al subgerente que esté presente cuando hable con él'],
        erroresCriticos: [
          {
            id: 'encubre',
            texto: 'Decide dejarlo seguir en la barra sin avisar a nadie, o lo encubre',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 11,
        enunciado:
          'Un bartender le cortó el alcohol a un cliente de la barra. El cliente golpea la barra, lo insulta y le dice que lo va a esperar a la salida. Hay otros clientes alrededor. ¿Qué haces?',
        dimension: 'operacion',
        evalua: 'Respaldar el corte de alcohol, bajar la tensión y proteger a clientes y equipo',
        tareaReal: 'Incidentes de seguridad en barra',
        indispensable: false,
        esenciales: [
          {
            id: 'respalda',
            texto: 'Respalda la decisión: no se le sirve más alcohol',
          },
          {
            id: 'calma',
            texto: 'Habla con el cliente con calma y aparta al bartender de la confrontación',
          },
          {
            id: 'seguridad',
            texto: 'Llama a seguridad y al gerente',
          },
          {
            id: 'protege',
            texto: 'Cuida a los demás clientes y que nadie del equipo se enfrente físicamente',
          },
          {
            id: 'salida',
            texto: 'Registra el incidente y, por la amenaza, cuida la salida del bartender al terminar el turno',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: ['Pedir a los acompañantes del cliente que lo ayuden a retirarse'],
        nucleo: ['respalda', 'seguridad'],
        erroresCriticos: [
          {
            id: 'sirve',
            texto: 'Le sirve alcohol para calmarlo',
          },
          {
            id: 'violencia',
            texto: 'Él o su equipo responden con insultos o con la fuerza',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 12,
        enunciado:
          'Un cliente que ya pagó con tarjeta regresa a la barra y reclama que le cobraron un mezcal Tobalá que nunca le sirvieron. Exige que le devuelvan el dinero en ese momento. ¿Qué haces?',
        dimension: 'controles',
        evalua: 'Investigar el reclamo y llevar la devolución a quien la autoriza',
        tareaReal: 'Reembolsos (Política de dinero: cualquier reembolso, sólo gerente u owner, con evidencia)',
        indispensable: false,
        esenciales: [
          {
            id: 'escucha',
            texto: 'Lo escucha sin discutir',
          },
          {
            id: 'revisa',
            texto: 'Revisa la cuenta y la comanda (quién la capturó, si se sirvió) con el bartender o el mesero',
          },
          {
            id: 'gerente',
            texto: 'Si hubo error, lleva la devolución al gerente (u owner), que es quien la autoriza',
          },
          {
            id: 'evidencia',
            texto: 'Junta la evidencia para el gerente: ticket, folio de la terminal o comanda, y el motivo',
          },
          {
            id: 'explica',
            texto: 'Le explica al cliente el siguiente paso (y, si lo sabe, cuánto tardará)',
          },
          {
            id: 'causa',
            texto: 'Corrige la causa (captura equivocada) con quien la hizo',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: ['Llamar al gerente de inmediato mientras él revisa la comanda'],
        nucleo: ['gerente'],
        erroresCriticos: [
          {
            id: 'devuelve',
            texto: 'Devuelve dinero de la caja o de la barra por su cuenta',
          },
          {
            id: 'niega',
            texto: 'Le niega el reclamo sin revisar la comanda',
          },
        ],
      },
    ],
  },
  competencias: {
    version: 'competencias_bar_manager_v1',
    preguntas: [
      // ── Integridad (5, todas de experiencia) ──
      {
        texto:
          'Cuéntame de la última vez que encontraste una diferencia de dinero o de mercancía a tu favor y nadie más lo había notado: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'La reportó o la devolvió aunque nadie lo habría sabido',
          'Da detalles concretos (monto, lugar, a quién avisó)',
        ],
        senalesAlerta: ['Se quedó con la diferencia o la usó para cubrir otro faltante'],
      },
      {
        texto:
          'Cuéntame de una vez que una persona cercana a ti (amigo, familiar, compañero) hizo algo indebido en un lugar donde tú tenías responsabilidad: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Actuó igual que con cualquier otra persona',
          'Reconoce lo que le costó y lo hizo de todos modos',
        ],
        senalesAlerta: ['Encubrió el hecho por la cercanía y lo justifica'],
      },
      {
        texto:
          'Cuéntame de la última vez que tuviste que entregar un resultado o un número que no te favorecía: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo entregó tal cual, con su explicación',
          'Propuso cómo corregirlo',
        ],
        senalesAlerta: ['Maquilló o cambió el número para quedar bien'],
      },
      {
        texto:
          'Cuéntame de una vez que un proveedor, un cliente o alguien con quien negociabas te ofreció un regalo o un favor personal: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo rechazó o lo transparentó con quien correspondía',
          'Entiende por qué compromete su independencia',
        ],
        senalesAlerta: ['Aceptó dinero o producto a cambio de favorecer al proveedor'],
      },
      {
        texto:
          'Cuéntame de la última vez que alguien con más autoridad que tú te pidió hacer algo que te parecía incorrecto: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Expresó su desacuerdo con respeto y con argumentos',
          'No participó en algo deshonesto aunque viniera de arriba',
        ],
        senalesAlerta: ['Hizo algo deshonesto porque se lo pidieron y lo ve normal'],
      },
      // ── Autoconciencia ──
      {
        texto:
          'Cuéntame de la última vez que una persona a tu cargo o con quien trabajabas te dijo algo de tu forma de dirigir o de pedir las cosas: qué te dijo, qué hiciste tú y cómo terminó.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Repite con precisión lo que le dijeron aunque lo deje mal parado',
          'Cuenta un cambio concreto en su forma de dirigir',
        ],
        senalesAlerta: ['Tomó represalias contra quien le hizo el comentario'],
      },
      {
        texto:
          'Cuéntame de una decisión que tomaste y que salió mal: qué pasó, qué hiciste tú después y cómo terminó.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Asume su parte sin repartir culpas',
          'Explica qué haría distinto y por qué',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que delegaste algo y te costó soltarlo: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reconoce su tendencia a controlar o a no delegar',
          'Describe qué hizo para confiar y verificar',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que reaccionaste mal frente a otras personas y después tuviste que repararlo: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reconoce el impacto en los demás',
          'Se disculpó o reparó de forma concreta',
        ],
        senalesAlerta: ['Relata insultos o agresión física y no los ve como problema'],
      },
      {
        texto:
          'Al revisar la merma del mes descubres que la diferencia más grande sale de los turnos que tú cubriste. ¿Qué haces?',
        eje: 'autoconciencia',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Revisa su propia forma de trabajar antes que la de otros',
          'Lo transparenta con el gerente',
        ],
        senalesAlerta: ['Ajusta los números para que la diferencia aparezca en otro turno'],
      },
      // ── Ética de trabajo ──
      {
        texto:
          'Cuéntame de la última vez que te hiciste cargo de algo que no salía bien hasta que quedó resuelto: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Le dio seguimiento hasta el final',
          'Describe pasos concretos, no sólo esfuerzo',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que tuviste que cubrir a alguien que faltó: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Cubrió sin descuidar lo suyo',
          'Atendió después la causa de la falta',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que pusiste orden en algo que estaba desordenado (un almacén, un archivo, un proceso, una casa): qué hiciste tú y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe el método que usó',
          'Dejó algo que otros pudieran mantener',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que una tarea larga y tediosa dependía de ti (un conteo, un inventario, un reporte): qué hiciste tú para hacerla bien y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Mantuvo el cuidado hasta el final',
          'Verificó su propio trabajo',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Es domingo en la madrugada, el equipo está agotado y el inventario de cierre llevaría 40 minutos más. El gerente no está. ¿Qué haces?',
        eje: 'etica_trabajo',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Hace el inventario aunque cueste, o lo organiza para que sea más corto sin saltarlo',
          'Cuida al equipo dentro de lo posible (reparte la tarea)',
          'Organiza el conteo con un límite seguro y, si el agotamiento es recurrente, lo lleva al gerente (no premia aguantar sin más)',
        ],
        senalesAlerta: [],
      },
      // ── Empatía ──
      {
        texto:
          'Cuéntame de la última vez que alguien de tu equipo o de tu familia estaba pasando por un mal momento y eso afectaba lo que hacía: qué notaste, qué hiciste tú y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Se acercó a entender antes de exigir',
          'Equilibró apoyar a la persona y cuidar el resultado',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que tuviste que darle una mala noticia a alguien (una corrección, un no, un cambio que no le gustaba): qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Fue claro sin humillar',
          'Pensó en cómo lo iba a recibir la otra persona',
        ],
        senalesAlerta: ['La humilló o la exhibió frente a otros'],
      },
      {
        texto:
          'Cuéntame de la última vez que enseñaste algo a alguien que no lo entendía a la primera: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Cambió la forma de explicar según la persona',
          'Tuvo paciencia y comprobó que lo aprendió',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que dos personas a tu alrededor estaban en conflicto y tú intervenías: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Escuchó a las dos partes',
          'Buscó una salida que las dos pudieran aceptar',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Un bartender de tu equipo, muy bueno, empieza a llegar tarde y distraído; un compañero te cuenta que tiene un familiar enfermo. ¿Qué haces?',
        eje: 'empatia',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Habla con él en privado y escucha antes de corregir',
          'Busca apoyo concreto (horario, gerente) sin dejar de lado las reglas del turno',
        ],
        senalesAlerta: [],
      },
      // ── Curiosidad ──
      {
        texto:
          'Cuéntame de la última vez que te pusiste a investigar por qué un número o un resultado no cuadraba: qué hiciste tú y qué encontraste.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe cómo buscó la causa paso por paso',
          'Llegó a algo concreto o lo dejó documentado',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que aprendiste algo de otro lugar u otra persona y lo trajiste a donde estabas: qué fue, qué hiciste tú y cómo terminó.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Nombra la idea y de dónde salió',
          'La adaptó y midió si funcionó',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que probaste una forma distinta de hacer algo para ver si salía mejor: qué probaste, cómo lo comparaste y qué pasó.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Comparó con algún criterio (tiempo, costo, resultado)',
          'Cuenta qué aprendió aunque no funcionara',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que le preguntaste a un cliente, un usuario o alguien que recibía tu trabajo qué opinaba de él: qué preguntaste, qué te dijeron y qué hiciste con eso.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Hizo preguntas abiertas',
          'Cambió algo con lo que escuchó',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Los cocteles de mezcal de la carta venden la mitad que hace seis meses y nadie sabe por qué. ¿Qué te gustaría averiguar?',
        eje: 'inteligencia_curiosa',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Propone datos concretos (ventas por coctel y por día, precio, recomendación de meseros, cambios de receta)',
          'Pregunta a clientes y meseros antes de concluir',
        ],
        senalesAlerta: [],
      },
      // ── Optimismo ──
      {
        texto:
          'Cuéntame de la última vez que un equipo o un grupo en el que estabas tuvo un mal resultado: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Ayudó al grupo a levantarse con algo concreto',
          'No buscó culpables',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que reconociste el trabajo de alguien que nadie más había notado: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reconoció algo específico',
          'Se fija en el efecto que tuvo en la persona',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que te tocó una racha difícil (en el trabajo o en tu vida) y cómo mantuviste el ánimo: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe hábitos o apoyos concretos',
          'Habla de la dificultad sin dramatizar ni negarla',
          'Pidió apoyo o puso límites cuando la carga era excesiva (admitir cansancio no resta)',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que alguien que te había fallado tuvo otra oportunidad contigo: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Dio la oportunidad con condiciones claras',
          'Cuenta el resultado sin rencor',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Es el tercer fin de semana seguido en que falta personal en la barra y tu equipo empieza a quejarse de todo. Mañana es sábado. ¿Qué haces con el equipo?',
        eje: 'optimismo_bondadoso',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Propone algo concreto para el sábado (reparto, apoyo, reconocimiento)',
          'Escucha las quejas y lleva lo que no puede resolver al gerente',
          'Plantea al gerente la falta crónica de personal con datos (coberturas, contratación), no sólo pide al equipo que aguante',
        ],
        senalesAlerta: [],
      },
    ],
  },
}
