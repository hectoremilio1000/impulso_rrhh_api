import type { ExamenPuesto } from '#services/exam_catalog/types'

// Examen de Capitán de meseros (catálogo 2026-11-16). Puesto de mando:
// 30 preguntas de competencias (5 por eje).
//
// Fuentes: «Manual de Introducción Mesero y Capitan» (La Llorona) y
// «Sesion4_Politica_Dinero.md» (v1.0, sin fecha ni responsable). Lo que no
// está en ellas va en facultades.pendientesOperador. Nota por pregunta:
// docs/examenes/puestos/captain.md
//
// Alcance: el capitán coordina el piso (meseros y runners), no atiende una
// sección como un mesero más. Autoriza solo acciones de dinero bajas
// (descuento 0–10 % con motivo y nota; cancelar lo no enviado por error de
// captura; menos de $200 de impacto). Lo demás lo escala al subgerente o al
// gerente y ahí escalar sí merece crédito. Pasarles el reparto de secciones,
// la lista de espera o el cierre del piso no lo merece.

export const EXAMEN_CAPTAIN: ExamenPuesto = {
  code: 'captain',
  label: 'Capitán de meseros',
  aliases: [
    'capitan',
    'capitana',
    'capitan de meseros',
    'capitana de meseros',
    'jefe de meseros',
    'jefa de meseros',
    'captain',
  ],
  tareas: [
    'Revisar el montaje del salón y las estaciones antes de abrir y dar el briefing (reservas, 86 y productos a vender)',
    'Repartir las secciones entre los meseros y ajustarlas durante el turno',
    'Coordinar con la hostess las reservas y la lista de espera: tiempos reales, tolerancia y orden justo',
    'Supervisar a meseros y runners en servicio y apoyar donde se atora',
    'Resolver los incidentes que le escalan los meseros (errores de comanda, demoras, quejas, alcohol)',
    'Autorizar las acciones de dinero que le tocan y escalar las que no',
    'Cobrar cuando el subgerente o el gerente lo autorizan',
    'Cerrar el piso: checklists de cierre, cuentas cerradas, rotos y entrega al responsable del turno',
    'Calcular el reparto de propinas del tronco por puntos',
  ],
  facultades: {
    decide: [
      'El reparto de secciones y los ajustes durante el turno',
      'El orden de la lista de espera junto con la hostess y los tiempos que se le dan al cliente',
      'Descuentos de 0 a 10 % con motivo y nota en el POS (Política de dinero)',
      'Cancelar un producto aún no enviado a cocina o barra cuando es error de captura (Política de dinero)',
      'Qué mesero apoya a quién y cuándo pone al piso a correr platos',
      'Revisar y firmar los checklists de cierre del piso y registrar los rotos',
    ],
    escala: [
      'Cancelaciones de lo ya enviado a producción: las autoriza el subgerente o el gerente (Política de dinero)',
      'Cortesías de cualquier tamaño, reembolsos y descuentos de más de 10 %, y cualquier acción con impacto de $200 o más (Política de dinero)',
      'El cobro: solo cobra si el subgerente o el gerente se lo autorizan (Manual)',
      'Un cliente en estado de ebriedad que no acepta retirarse: se llama al gerente (Manual)',
      'Sanciones a un empleado y faltas repetidas: documenta y lo informa al subgerente o gerente',
    ],
    pendientesOperador: [
      'Si la «Sesion4_Politica_Dinero.md» (v1.0, sin fecha ni responsable) está vigente y es la que aplica en piso',
      'Quién calcula y reparte el tronco de propinas (capitán, subgerente o gerente), con qué periodicidad (diaria o semanal) y con qué puntos para capitán y runners; el manual solo dice que los meseros tienen 9 puntos. Los puntos de la pregunta 9 son datos del caso',
      'Si existe el puesto de hostess: el organigrama del manual en piso solo lista capitán, meseros y runners. El examen asume que hay alguien en la entrada que lleva la lista de espera',
      'Quién confirma las reservas del día (el manual pide confirmarlas por teléfono preguntando alergias, sin decir quién)',
      'Si el capitán puede mandar a cambiarse a un mesero que llega sin uniforme completo o eso lo decide el subgerente',
      'Quién puede decidir respetar una reserva que llegó después de los 15 minutos de tolerancia (capitán, hostess o subgerente) y en qué condiciones (pregunta 3)',
      'Cómo se combinan los límites de la Política de dinero para el capitán: descuento de 0 a 10 %, impacto menor a $200 y si el producto ya se envió a producción (p. ej., si puede cancelar una bebida no enviada de más de $200) (preguntas 4 y 5)',
      'Si en caja hay un cajero autorizado para cobrar y, si lo hay, si el capitán le entrega la cuenta en lugar de cobrar él (pregunta 8)',
      'Si los retardos descuentan puntos del tronco y cuántos; en la pregunta 9 es un dato del caso, no una facultad del capitán',
      'Los precios, tiempos y nombres de los casos son ilustrativos',
    ],
  },
  practico: {
    version: 'banco_captain_v1',
    umbralAprobado: 70,
    dimensiones: [
      { id: 'equipo', nombre: 'Reparto y supervisión de meseros', peso: 30 },
      { id: 'montaje_espera', nombre: 'Montaje, reservas y lista de espera', peso: 20 },
      { id: 'incidentes', nombre: 'Incidentes de servicio y servicio responsable', peso: 25 },
      { id: 'control_cierre', nombre: 'Controles de dinero, propinas y cierre', peso: 25 },
    ],
    preguntas: [
      {
        tipo: 'abierta',
        q: 1,
        enunciado:
          'Es viernes, faltan 20 minutos para abrir a la 1 pm. Al recorrer el salón ves dos mesas de la terraza sin montar, la estación del runner sin salsas ni limones y a un mesero con la camisa manchada y tenis blancos. En la libreta hay tres reservas de Calendly que nadie ha confirmado; una es de 10 personas a las 2:30. ¿Qué haces antes de abrir?',
        dimension: 'montaje_espera',
        evalua: 'Dejar el piso listo para abrir: montaje, estaciones, imagen y reservas, y comprobarlo',
        tareaReal: 'Apertura de salón y briefing (Manual: checklist de apertura, reservas, código de vestimenta)',
        indispensable: false,
        esenciales: [
          {
            id: 'asigna_montaje',
            texto: 'Asigna a personas concretas el montaje de la terraza y la estación del runner',
          },
          {
            id: 'verifica',
            texto: 'Revisa antes de abrir que el montaje y la estación quedaron listos',
          },
          {
            id: 'uniforme',
            texto:
              'Resuelve el uniforme del mesero antes de que atienda: que se cambie o consiga camisa y calzado del código, o lo reporta al subgerente si no le toca decidirlo',
          },
          {
            id: 'reservas',
            texto:
              'Se asegura de que alguien confirme hoy las tres reservas (él mismo, la hostess o quien tenga esa tarea); preguntar por alergias o poner letreros suma, pero no se exige',
          },
          {
            id: 'grupo',
            texto: 'Prepara la reserva de 10: mesa asignada y montada, y mesero responsable',
          },
          {
            id: 'briefing',
            texto: 'Da el briefing antes de abrir: reservas, 86 de cocina y barra, y qué conviene vender',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Pedir a la hostess que confirme las reservas mientras él revisa el montaje',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 2,
        enunciado:
          'Sábado. Tienes seis meseros para un salón de 22 mesas y una terraza de 8. Uno está en su segunda semana; otra tiene salida a las 5 pm por un permiso; a las 3 llega una reserva de 14 personas. ¿Cómo organizas las secciones para este turno?',
        dimension: 'equipo',
        evalua: 'Repartir secciones con criterio y sostener el reparto durante el turno',
        tareaReal: 'Asignación de rangos o secciones (Manual: "una vez asignados los rangos")',
        indispensable: true,
        esenciales: [
          {
            id: 'equilibra',
            texto:
              'Reparte la carga con un criterio razonado (mesas, cubiertos, distancia o la terraza) y lo dice; no hay un único reparto correcto',
          },
          {
            id: 'nuevo',
            texto: 'Al mesero nuevo le da menos mesas o lo pone junto a alguien con experiencia',
          },
          {
            id: 'reserva',
            texto: 'Asigna un responsable y un apoyo para la reserva de 14',
          },
          {
            id: 'salida',
            texto:
              'Planea quién toma la sección de la mesera que sale a las 5 y que le transfiera en el POS sus cuentas abiertas',
          },
          {
            id: 'ajusta',
            texto: 'Durante el turno revisa la carga de cada sección y redistribuye si alguien se satura',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Dejar la sección de la mesera que sale con menos mesas desde el principio para que no tenga cuentas abiertas a las 5',
        ],
        erroresCriticos: [
          {
            id: 'nuevo_solo',
            texto: 'Deja al mesero nuevo solo a cargo de la reserva de 14 o de la sección más cargada',
          },
          {
            id: 'favoritismo',
            texto: 'Da las mejores secciones por amistad o porque el mesero lo pide, sin otro criterio',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 3,
        enunciado:
          'Viernes, 9:00 pm, salón lleno. En la entrada hay cinco grupos en espera: dos de 2 personas, uno de 4, uno de 6 y uno de 8. Dos mesas de 4 acaban de pedir la cuenta y una de 6 está en el postre. A las 9:20 llega una pareja con reserva para las 9:00. ¿Qué haces?',
        dimension: 'montaje_espera',
        evalua: 'Llevar la lista de espera con tiempos reales, orden justo y la tolerancia de reservas',
        tareaReal: 'Reservas y lista de espera (Manual: tolerancia de 15 minutos, asignación por pax y disponibilidad)',
        indispensable: true,
        esenciales: [
          {
            id: 'tiempos',
            texto:
              'Revisa con los meseros cuándo se liberan las mesas y le da a la hostess tiempos de espera reales',
          },
          {
            id: 'orden',
            texto: 'Asigna las mesas que se liberan según el orden de llegada y el tamaño del grupo',
          },
          {
            id: 'tolerancia',
            texto:
              'Con la pareja que llegó 20 minutos tarde aplica la tolerancia de 15 minutos con un criterio explícito: le explica que la pasó y le da su lugar real en la espera, o, si quien decide en el turno resuelve respetar la reserva, la sienta en la siguiente mesa de dos y lo explica a quien espera',
          },
          {
            id: 'rotacion',
            texto: 'Pone a alguien a retirar y montar de inmediato cada mesa que se libera',
          },
          {
            id: 'espera',
            texto: 'Atiende a quien espera: les avisa el tiempo, les ofrece algo en barra o los llama cuando esté su mesa',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Sentar primero a un grupo más pequeño que llegó después si la mesa que se libera no le sirve al grupo grande, explicándolo',
          'Sentar a la pareja con reserva en cuanto se libere una mesa de dos si el turno decidió respetar la reserva pese al retraso (cuenta como «tolerancia» si dice quién lo decidió o lo comunica a la lista)',
        ],
        erroresCriticos: [
          {
            id: 'salta_lista',
            texto: 'Sienta antes a alguien por conocido o por propina, saltándose la lista',
          },
          {
            id: 'promete',
            texto: 'Da tiempos de espera que no comprobó para retener a los grupos',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 4,
        enunciado:
          'El mesero de la sección 2 te busca: en la mesa 14 (cuatro personas) ya llegaron tres platos, y el cuarto, un rib eye que la clienta pidió término medio, llegó bien cocido. Los demás ya van a la mitad y la clienta está molesta. ¿Qué haces?',
        dimension: 'incidentes',
        evalua: 'Resolver un incidente de mesa dentro de sus facultades y escalar lo que no le toca',
        tareaReal: 'Incidentes que el mesero escala al capitán',
        indispensable: true,
        esenciales: [
          {
            id: 'va_mesa',
            texto: 'Va a la mesa, se presenta y escucha a la clienta sin culpar a nadie frente a ella',
          },
          {
            id: 'causa',
            texto: 'Revisa en el POS si el término se capturó bien para saber si fue error de captura o de cocina',
          },
          {
            id: 'repone',
            texto: 'Pide a cocina reponer el rib eye con prioridad y le da a la clienta un tiempo real',
          },
          {
            id: 'compensa',
            texto:
              'Si procede compensar, ofrece solo lo que le permite su facultad y pide autorización al subgerente o gerente para cortesías o cancelaciones',
          },
          {
            id: 'seguimiento',
            texto: 'Regresa cuando llega el nuevo plato para confirmar que está bien',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Ofrecer algo para picar mientras sale el nuevo, con la autorización correspondiente',
        ],
        erroresCriticos: [
          {
            id: 'promete',
            texto: 'Promete no cobrar el platillo o la cuenta, o regala algo, sin autorización del subgerente o gerente',
          },
          {
            id: 'culpa',
            texto: 'Culpa al mesero o a cocina frente a la clienta',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 5,
        enunciado:
          'Un mesero nuevo te avisa que capturó "enchiladas suizas ×4" en vez de ×1 y ya lo envió a cocina hace un minuto. En otra de sus mesas capturó una paloma que la mesa no pidió, y esa todavía no la envía. ¿Qué haces?',
        dimension: 'control_cierre',
        evalua: 'Corregir errores de captura según quién puede autorizar cada cancelación',
        tareaReal: 'Cancelaciones (Política de dinero: antes y después de enviar a producción)',
        indispensable: false,
        esenciales: [
          {
            id: 'detiene',
            texto: 'Avisa de inmediato a cocina para que no preparen las tres enchiladas de más',
          },
          {
            id: 'escala_enviado',
            texto:
              'Pide al subgerente o al gerente que autorice la cancelación de lo ya enviado, con el motivo',
          },
          {
            id: 'no_enviado',
            texto: 'La paloma no enviada la corrige él como error de captura, con motivo y nota en el POS',
          },
          {
            id: 'ensena',
            texto:
              'Le enseña al mesero a cotejar cantidades contra la orden confirmada con la mesa antes de enviar (no se exige un platillo por persona)',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [],
        erroresCriticos: [
          {
            id: 'cancela_enviado',
            texto: 'Cancela por su cuenta lo que ya se envió a cocina',
          },
          {
            id: 'cobra_error',
            texto: 'Deja que se le cobren a la mesa las enchiladas de más o se las descuenta al mesero',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 6,
        enunciado:
          'La mesa 31 te detiene: llevan 15 minutos sentados y nadie les ha dado la carta. Su mesero, Luis, está en la terminal del POS y tiene cinco mesas más. ¿Qué haces?',
        dimension: 'equipo',
        evalua: 'Atender primero al cliente y luego corregir la carga o el desempeño del mesero',
        tareaReal: 'Supervisión en servicio (Manual: máximo 5 minutos para presentarse con la carta)',
        indispensable: false,
        esenciales: [
          {
            id: 'atiende',
            texto:
              'Se asegura de inmediato de que atiendan a la mesa 31 (él mismo o un mesero que asigna y comprueba): disculpa, carta y bebidas',
          },
          {
            id: 'pregunta',
            texto: 'Habla con Luis en privado para saber qué pasa',
          },
          {
            id: 'redistribuye',
            texto: 'Si Luis está saturado, le quita mesas o le pone apoyo',
          },
          {
            id: 'retro',
            texto: 'Después del rush le da retroalimentación concreta y, si se repite, lo informa al subgerente',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Pedir a otro mesero que tome la mesa 31 mientras él habla con Luis, comprobando que la atendió (cuenta como «atiende»; el capitán conserva el seguimiento). Solo pasarle la queja al subgerente no cuenta',
        ],
        erroresCriticos: [
          {
            id: 'exhibe',
            texto: 'Regaña a Luis frente a clientes o compañeros',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 7,
        enunciado:
          'Un mesero te avisa que en la mesa 8, una familia con adolescentes, vio a un adulto pasarle su cerveza a un muchacho que se ve de unos 15 años. ¿Qué haces?',
        dimension: 'incidentes',
        evalua: 'Impedir que un menor consuma alcohol, con discreción y respaldando al mesero',
        tareaReal: 'Servicio responsable de alcohol (prohibida la venta y el consumo de menores)',
        indispensable: false,
        esenciales: [
          {
            id: 'acerca',
            texto: 'Se acerca a la mesa y habla con el adulto con discreción',
          },
          {
            id: 'retira',
            texto: 'Retira la bebida del menor',
          },
          {
            id: 'explica',
            texto: 'Explica que en el restaurante un menor no puede tomar alcohol, aunque lo autorice su familia',
          },
          {
            id: 'repite',
            texto: 'Si se repite, deja de servir alcohol a esa mesa y avisa al subgerente o gerente',
          },
          {
            id: 'respalda',
            texto: 'Respalda al mesero y le pide estar atento al resto de la visita',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [],
        erroresCriticos: [
          {
            id: 'tolera',
            texto: 'Deja que el menor siga tomando o sigue sirviendo a la mesa como si nada',
          },
          {
            id: 'exhibe',
            texto: 'Exhibe a la familia o la regaña frente a otras mesas',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 8,
        enunciado:
          'La mesa 5 pidió la cuenta hace 8 minutos y tiene prisa. La subgerente está atendiendo una queja. La cuenta es de $3,180; quieren pagar $1,200 en efectivo y el resto en partes iguales con dos tarjetas. ¿Qué haces?',
        dimension: 'control_cierre',
        evalua: 'Cobrar con autorización, sin errores y dejando el dinero registrado',
        tareaReal: 'Cobro de cuentas (Manual: solo subgerente y gerente; el capitán con su autorización)',
        indispensable: false,
        esenciales: [
          {
            id: 'autorizacion',
            texto: 'Pide a la subgerente autorización para cobrar él',
          },
          {
            id: 'divide',
            texto: 'Calcula bien la división: $1,980 restantes, $990 en cada tarjeta',
          },
          {
            id: 'cobra',
            texto: 'Cobra frente al cliente cada pago por su monto: el efectivo con su cambio y cada tarjeta por $990',
          },
          {
            id: 'registra',
            texto: 'Registra los tres pagos en el POS',
          },
          {
            id: 'entrega_caja',
            texto: 'Entrega el efectivo y los vouchers a caja de inmediato',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Avisarle a la mesa un tiempo real y pedir al gerente que cobre si la subgerente no puede autorizar',
          'Si el cobro lo hace un responsable autorizado (subgerente, gerente o cajero), coordinarlo con la división correcta cuenta como «autorizacion» y «cobra»',
        ],
        erroresCriticos: [
          {
            id: 'guarda',
            texto: 'Se guarda el efectivo o los vouchers para entregarlos después sin registrarlos',
          },
          {
            id: 'sin_autorizacion',
            texto:
              'Dice que cobra él sin que la subgerente o el gerente se lo autoricen, o que no hace falta pedirlo (no mencionar el permiso no cuenta como este error)',
          },
        ],
      },
      {
        tipo: 'numerica',
        q: 9,
        enunciado:
          'Esta semana el tronco de propinas suma $42,000 y se reparte por puntos. Participan cuatro meseros con 9 puntos cada uno, salvo Pedro, a quien por sus retardos le tocan 8 puntos esta semana; dos runners con 5 puntos cada uno, y el capitán con 11 puntos. ¿Cuánto le toca a Pedro?',
        dimension: 'control_cierre',
        evalua: 'Calcular el reparto del tronco por puntos con un descuento por retardos',
        tareaReal: 'Reparto de propinas (Manual: tronco por puntos; meseros con 9 puntos; retardos descuentan puntos)',
        indispensable: false,
        clave: 6000,
        tolerancia: 1,
        unidad: 'MXN',
        solucion:
          'Puntos: 3 × 9 + 8 = 35 de meseros; 2 × 5 = 10 de runners; 11 del capitán. Total 56. Valor del punto: 42,000 / 56 = 750. Pedro: 8 × 750 = 6,000.',
      },
      {
        tipo: 'abierta',
        q: 10,
        enunciado:
          'Domingo, 11 pm, cierra el salón. Tres meseros quieren irse ya, la estación del runner está sucia, faltan salsas para mañana, se rompieron dos copas en el turno y una mesa sigue en sobremesa. ¿Cómo cierras el piso?',
        dimension: 'control_cierre',
        evalua: 'Cerrar el piso dejando verificado, registrado y comunicado lo del turno',
        tareaReal: 'Cierre de turno (Manual: checklist de cierre de mesero, formato de rotos, salsas al grupo de cocina)',
        indispensable: true,
        esenciales: [
          {
            id: 'checklists',
            texto: 'Revisa el checklist de cierre de cada mesero antes de dejarlo ir',
          },
          {
            id: 'cuentas',
            texto:
              'Comprueba que cada mesero que se va tenga sus cuentas cerradas en el POS o transferidas a quien se queda con la mesa en sobremesa',
          },
          {
            id: 'rotos',
            texto: 'Registra las dos copas en el formato de rotos con fecha, hora, responsable, concepto y firma',
          },
          {
            id: 'salsas',
            texto: 'Asigna la limpieza de la estación del runner y manda al grupo de cocina las salsas que faltan',
          },
          {
            id: 'sobremesa',
            texto: 'Atiende a la mesa en sobremesa con cortesía: le avisa del cierre y deja a alguien a cargo de ella',
          },
          {
            id: 'entrega',
            texto: 'Informa al subgerente o gerente de las novedades del turno antes de irse',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Dejar ir primero a un mesero con su checklist revisado y quedarse con otro para la mesa en sobremesa',
        ],
        erroresCriticos: [
          {
            id: 'firma_sin_revisar',
            texto: 'Firma o marca como hechos los checklists sin revisarlos',
          },
          {
            id: 'rotos',
            texto:
              'Anota a sabiendas las copas a nombre de alguien que no las rompió, o decide expresamente no registrarlas',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 11,
        enunciado:
          'Dos meseros discuten junto a la barra, a la vista de los clientes: uno sentó en su sección a una mesa de 8 que, según el otro, le tocaba a él. ¿Qué haces?',
        dimension: 'equipo',
        evalua: 'Resolver un conflicto entre meseros con un criterio igual para todos',
        tareaReal: 'Reparto de mesas y convivencia del equipo de piso',
        indispensable: false,
        esenciales: [
          {
            id: 'separa',
            texto: 'Detiene la discusión y la saca de la vista de los clientes',
          },
          {
            id: 'mesa',
            texto: 'Se asegura primero de que la mesa de 8 esté atendida',
          },
          {
            id: 'criterio',
            texto: 'Decide de quién es la mesa con la regla de secciones o de rotación, la misma para todos',
          },
          {
            id: 'escucha',
            texto: 'Escucha a los dos por separado cuando baja el rush',
          },
          {
            id: 'repite',
            texto: 'Si vuelve a pasar, lo documenta e informa al subgerente',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Dejar la mesa con quien ya la está atendiendo y compensar al otro con la siguiente mesa grande',
        ],
        erroresCriticos: [
          {
            id: 'favoritismo',
            texto: 'Decide por amistad o por cuál de los dos vende más',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 12,
        enunciado:
          'Viernes, 9:30 pm. En el pase hay platos de cuatro mesas esperando, hay un solo runner porque el otro faltó y cocina avisa que dos platos ya se están enfriando. ¿Qué haces?',
        dimension: 'incidentes',
        evalua: 'Mover al piso para que la comida salga caliente y completa',
        tareaReal: 'Coordinación del pase entre cocina, runner y meseros',
        indispensable: false,
        esenciales: [
          {
            id: 'piso',
            texto: 'Pone a los meseros a llevar los platos de su sección (o los lleva él)',
          },
          {
            id: 'prioridad',
            texto: 'Prioriza los platos que se enfrían y los más antiguos',
          },
          {
            id: 'completos',
            texto:
              'Cuida que cada mesa reciba sus platos juntos, sin dejar enfriar otros por esperar (si no se puede, lo coordina con cocina)',
          },
          {
            id: 'cocina',
            texto: 'Le pide a cocina rehacer o recalentar lo que ya no está en condiciones, en lugar de mandarlo frío',
          },
          {
            id: 'mesas',
            texto: 'Avisa a las mesas afectadas con un tiempo real',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Pedir a cocina que detenga por unos minutos los platos de una mesa hasta tener manos para bajarlos juntos, y que los revise antes de que salgan',
          'Secuenciar la salida con apoyo de los meseros dando prioridad a la temperatura, aunque una mesa reciba sus platos con un minuto de diferencia',
        ],
        erroresCriticos: [
          {
            id: 'frio',
            texto: 'Manda a la mesa platos que ya se enfriaron para no perder tiempo',
          },
        ],
      },
    ],
  },
  competencias: {
    version: 'competencias_captain_v1',
    preguntas: [
      // Integridad (5, todas de experiencia)
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
          'Cuéntame de la última vez que te enteraste de que alguien con quien trabajabas o convivías hacía algo deshonesto con dinero, horas, registros o cosas: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Lo habló con la persona o lo informó a quien correspondía',
          'Cuidó los hechos: no acusó sin saber',
        ],
        senalesAlerta: ['Lo encubrió, participó o recibió parte de lo obtenido'],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que alguien cercano te pidió un trato especial que no era justo para los demás: qué te pidió, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Le dijo que no y lo explicó',
          'Mantuvo la misma regla para todos aunque le costara la relación',
        ],
        senalesAlerta: ['Le concedió el trato a costa de otras personas'],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que te tocó repartir algo entre varias personas (dinero, tareas, turnos o comida): cómo lo repartiste, qué hiciste tú cuando alguien no estuvo de acuerdo y cómo terminó.',
        senalesPositivas: [
          'Usó una regla clara y la explicó',
          'Revisó el reparto cuando le señalaron un error',
        ],
        senalesAlerta: ['Se quedó con más de lo que le tocaba o favoreció a sus cercanos'],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de un error tuyo que afectó a otras personas: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Lo reconoció ante los afectados',
          'Lo reparó o evitó que se repitiera',
        ],
        senalesAlerta: ['Culpó a otra persona por su error'],
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
          'Cuéntame de una vez en que coordinabas a otras personas (en un trabajo, la escuela, un equipo o tu familia) y algo salió mal por una decisión tuya: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Asume la decisión como suya',
          'Cuenta qué cambió en su forma de decidir',
        ],
        senalesAlerta: ['Hizo pagar a otra persona por su decisión'],
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
          'A las 10 de la noche de un viernes te das cuenta de que el reparto de secciones que hiciste al abrir dejó a un mesero con el doble de mesas que otro, y ya hay quejas en su sección. ¿Qué haces?',
        senalesPositivas: [
          'Reconoce el error de reparto sin buscar culpables',
          'Lo corrige en ese momento (redistribuye o apoya)',
          'Lo toma en cuenta para el siguiente reparto',
        ],
        senalesAlerta: [],
      },
      // Ética de trabajo
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que tuviste que cumplir con algo estando muy cansado o sin ganas: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: ['Cumplió con lo comprometido', 'Se organizó para lograrlo'],
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
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que hiciste algo más de lo que te tocaba para que un trabajo saliera bien: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Describe un esfuerzo concreto y por qué lo hizo',
          'Cuidó que el resultado fuera bueno para otros, no solo para sí',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que te comprometiste a algo y no pudiste cumplirlo a tiempo: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Avisó antes de la fecha y propuso otra solución',
          'Cumplió después y aprendió algo de su planeación',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'hipotetica',
        texto:
          'Al cierre, tres meseros quieren irse sin que revises su checklist porque "el capitán anterior nunca lo revisaba". Ya es tarde y tú también quieres irte. ¿Qué haces?',
        senalesPositivas: [
          'Revisa los checklists antes de dejarlos ir',
          'Explica la regla sin humillar a nadie',
        ],
        senalesAlerta: ['Firma los checklists sin revisarlos'],
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
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que alguien con quien trabajabas o estudiabas tenía un problema personal que afectaba lo que hacía: cómo te diste cuenta, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Habló con la persona en privado',
          'Equilibró apoyar a la persona con que el trabajo saliera',
        ],
        senalesAlerta: ['Exhibió el problema de la persona ante otros o se burló de ella'],
      },
      {
        eje: 'empatia',
        tipo: 'hipotetica',
        texto:
          'Un mesero con buen historial se equivoca tres veces en la misma noche y una mesa se queja de él contigo. ¿Qué haces?',
        senalesPositivas: [
          'Atiende primero a la mesa',
          'Habla con el mesero en privado para saber qué le pasa',
          'Ajusta su carga o lo apoya ese turno',
        ],
        senalesAlerta: ['Lo regaña o lo exhibe frente a clientes o compañeros'],
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
          'Cuéntame de una vez en que viste que otra persona o lugar hacía algo mejor que tú y lo adoptaste: qué viste, qué hiciste tú y cómo resultó.',
        senalesPositivas: [
          'Describe con detalle lo que observó',
          'Lo adaptó y comprobó si funcionaba',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que algo fallaba una y otra vez y quisiste entender por qué: cómo lo investigaste, qué encontraste y qué hiciste tú.',
        senalesPositivas: [
          'Buscó la causa con datos u observación, no por intuición',
          'Propuso o hizo un cambio a partir de lo que encontró',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'hipotetica',
        texto:
          'Notas que los viernes la lista de espera crece mucho entre las 8:30 y las 9:30, aunque varias mesas tardan en volver a montarse después de que se van los clientes. ¿Qué haces?',
        senalesPositivas: [
          'Mide o registra cuánto tarda el remontaje y cuántas mesas esperan',
          'Prueba un cambio (asignar a alguien al remontaje) y revisa si bajó la espera',
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
          'Cuéntame de una vez en que ayudaste a una persona a levantar el ánimo: qué le pasaba, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Hizo algo concreto por la otra persona',
          'Lo hizo sin esperar algo a cambio',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que un grupo en el que estabas (de trabajo, deporte, escuela o familia) estaba desanimado: qué pasaba, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Hizo algo concreto para mover al grupo',
          'Reconoció lo difícil sin negar el problema',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'hipotetica',
        texto:
          'Sábado, 10 pm: faltaron dos meseros, cocina va atrasada y tu equipo empieza a quejarse en voz alta frente a los clientes. ¿Qué haces?',
        senalesPositivas: [
          'Corta las quejas frente a clientes con calma y sin regaños públicos',
          'Da al equipo un plan concreto para el resto de la noche',
          'Reconoce el esfuerzo del equipo al terminar',
        ],
        senalesAlerta: [],
      },
    ],
  },
}
