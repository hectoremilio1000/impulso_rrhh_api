import type { ExamenPuesto } from '#services/exam_catalog/types'

// Examen de Encargado de cocina / jefe de cocina (catálogo 2026-11-16).
//
// Puesto que DIRIGE la operación diaria de la cocina en todos los turnos:
// plantilla y estaciones, apertura y cierre, inocuidad (temperaturas,
// bitácoras, recepción, alergias), costos de receta, merma, inventario y
// pedidos, recetas estándar y capacitación, incidentes, coordinación con el
// gerente. NO diseña la carta ni fija precios: eso es del Chef o del dueño.
//
// Fuente real: «Manual de capacitación cocinero Cantina La Llorona» (jun-2021),
// que asigna al jefe/encargado de cocina la producción, la revisión de lo que
// llega del proveedor y el registro de mermas. Todo lo demás (temperaturas de
// la casa, gramajes, precios, topes) es supuesto: ver pendientesOperador.
//
// Banco v2 (2026-11-19): P1, P2, P6, P9 y P12 cambian de enunciado; las reglas
// de la casa que necesitan (temperaturas, 4 horas, tope de $3,000, quién
// autoriza) se declaran en el caso como «Para este ejercicio, supón que…».
//
// Nota completa por pregunta: docs/examenes/puestos/kitchen_manager.md

export const EXAMEN_KITCHEN_MANAGER: ExamenPuesto = {
  code: 'kitchen_manager',
  label: 'Encargado de cocina',
  aliases: [
    'encargado de cocina',
    'encargada de cocina',
    'jefe de cocina',
    'jefa de cocina',
    'kitchen manager',
    'responsable de cocina',
  ],
  tareas: [
    'Abrir y cerrar la cocina: equipos, temperaturas, producción del día y entrega al siguiente turno',
    'Repartir estaciones y relevos del equipo de cocina en cada turno',
    'Recibir a los proveedores: pesar, revisar temperatura, calidad y caducidad, y anotar diferencias',
    'Llevar las bitácoras sanitarias (temperaturas, mermas) con lecturas reales',
    'Costear recetas: costo por porción y porcentaje de costo con rendimiento real',
    'Controlar merma e inventario y hacer los pedidos de la semana',
    'Mantener recetas estándar y fichas técnicas y capacitar al equipo con ellas',
    'Atender incidentes de cocina: gas, equipo de frío, alergias de clientes',
    'Coordinarse con el gerente y con piso: platillos agotados, tiempos, faltantes',
  ],
  facultades: {
    decide: [
      'Armar la propuesta de horario semanal de cocina (la aprueba el gerente)',
      'Asignar estaciones, tareas y relevos de comida dentro del horario ya publicado',
      'Rechazar o devolver mercancía que llega fuera de temperatura, en mal estado o con peso distinto, y anotarlo en la remisión',
      'Desechar alimento fuera de temperatura o de vida útil y registrarlo en la bitácora de mermas (el de alto valor, con autorización del gerente)',
      'Suspender temporalmente un platillo por falta de insumo o riesgo sanitario, avisando a piso',
      'Hacer el pedido semanal a proveedores autorizados con los niveles de inventario vigentes y autorizar compras hasta $3,000 (supuesto del examen)',
      'Aplicar las fichas técnicas y corregir y capacitar al equipo de cocina',
      'Detener un proceso o un equipo que pone en riesgo a una persona (gas, alergia, contaminación)',
    ],
    escala: [
      'Cambios de horario y permisos del personal (los autoriza el gerente, según el manual de cocina)',
      'Faltantes de inventario o sospecha de robo: documenta y reporta; la investigación y la sanción son del gerente',
      'Aumentos de precio de un proveedor, cambio de proveedor, compras de más de $3,000 o fuera de presupuesto, y reparaciones',
      'Cambios a receta, porción o precio de un platillo de la carta (al chef o al gerente)',
      'Producción echada a perder o pérdidas grandes de producto: reporta al gerente, que autoriza el desecho de lo de alto valor y la reposición urgente fuera del pedido normal',
      'Suspender el servicio de cocina completo o una emergencia que afecta al salón',
    ],
    pendientesOperador: [
      'Si en La Llorona hay un chef por encima del encargado de cocina, o si el encargado reporta directo al gerente; y quién aprueba cambios de receta (banco v2: P1, P6 y P9 declaran como supuesto del ejercicio que el encargado reporta al gerente)',
      'Estándar de temperaturas de la casa: el examen usa 4 °C o menos en refrigeración, -18 °C en congelación y 60 °C o más en caliente; la NOM-251 permite hasta 7 °C en refrigeración (banco v2: P1 y P9 lo declaran como supuesto del ejercicio; quien cite los 7 °C de la NOM no pierde puntos si aplica la regla del caso)',
      'Regla de tiempo fuera de refrigeración de la casa (el examen usa: más de 4 horas arriba de 4 °C se desecha; banco v2: declarada como supuesto en P1 y P9; no es de la NOM-251: se basa en el control por tiempo de 4 horas del FDA Food Code, 3-501.19)',
      'Los precios, gramajes y rendimientos de las preguntas 4 y 5 son ilustrativos, no datos de La Llorona',
      'Tope de compra o de gasto que el encargado puede autorizar sin el gerente (banco v2: P12 usa $3,000; falta confirmar la cifra y si el pedido semanal normal cuenta contra ese tope)',
      'Si existe una matriz de alérgenos de la carta y un procedimiento escrito para comandas con alergia',
      'Quién arma el horario semanal de cocina y quién lo aprueba (el manual de 2021 dice que se publica cada domingo y que los cambios los autoriza el gerente; banco v2: P2 declara que el encargado propone y el gerente aprueba)',
      'Vigencia de las reglas del manual de cocina de 2021 (permisos firmados por el gerente, revisión de producto al llegar de la central o del proveedor, bitácora de mermas con evidencia)',
      'Umbral de aprobado 70: el mismo que Subgerente mientras no haya un criterio del operador',
      'Quién autoriza desechar producto de alto valor (por ejemplo toda la carne de una cámara que falló) y la reposición urgente fuera del pedido normal o del tope de gasto (revisión de Codex r3, P9; banco v2: P9 declara que los autoriza el gerente) y qué cuenta como «alto valor»',
    ],
  },
  practico: {
    version: 'banco_kitchen_manager_v2',
    umbralAprobado: 70,
    dimensiones: [
      { id: 'operacion_turno', nombre: 'Apertura, incidentes y coordinación del turno', peso: 20 },
      { id: 'inocuidad', nombre: 'Inocuidad: recepción, temperaturas, bitácoras y alergias', peso: 35 },
      { id: 'costos_inventario', nombre: 'Costos de receta, merma, inventario y pedidos', peso: 25 },
      { id: 'equipo_estandares', nombre: 'Plantilla, recetas estándar y capacitación', peso: 20 },
    ],
    preguntas: [
      {
        tipo: 'abierta',
        q: 1,
        enunciado:
          'Sábado, 9:00 de la mañana. La cocina abre al público a la 1:00 y a las 2:00 llega una reserva de 30 personas que pidió cochinita y enchiladas. Al llegar encuentras esto: la mesa fría de la línea, donde a mediodía se montan la crema, el queso y las salsas del servicio, marca 9 °C (anoche se vació y todo quedó guardado en la cámara, que hoy marca 3 °C); el cocinero de plancha avisó a las 8:30 que no viene; la bitácora de temperaturas del turno de anoche está en blanco, y el proveedor de tortilla todavía no llega. Para este ejercicio, supón que esta cocina usa un límite más estricto que el de la NOM-251 (que permite hasta 7 °C): refrigeración a 4 °C o menos, y que lo que pasa más de 4 horas arriba de 4 °C se desecha. Supón también que reportas al gerente. ¿Qué haces y en qué orden hasta abrir?',
        dimension: 'operacion_turno',
        evalua: 'Ordenar la apertura por riesgo y dejar resuelto cada problema antes de abrir',
        tareaReal: 'Apertura de cocina (manual: la producción es responsabilidad del jefe de cocina)',
        indispensable: true,
        motivoIndispensable:
          'Si no sabe ordenar la apertura por riesgo, la cocina abre sirviendo crema, queso o salsas sin frío seguro, con riesgo de intoxicar a los clientes desde el primer día.',
        esenciales: [
          {
            id: 'mesa_fria',
            texto:
              'Atiende primero la mesa fría: confirma la lectura con otro termómetro, revisa puerta, empaque, ajuste o ventilación y, si no baja, pide al técnico (o al gerente que lo llame) antes del servicio',
          },
          {
            id: 'producto',
            texto:
              'No monta crema, queso ni salsas en la mesa fría mientras no esté a 4 °C o menos, y los mantiene fríos de otra forma (charolas sobre hielo, porciones chicas que se reponen desde la cámara u otro equipo frío)',
          },
          {
            id: 'plancha',
            texto:
              'Cubre la plancha con una persona concreta del equipo del turno (mueve a un cocinero o la toma él) y reacomoda las estaciones; llamar a alguien en su descanso cuenta solo si lo autoriza el gerente',
          },
          {
            id: 'reserva',
            texto: 'Adelanta la producción de la reserva de 30 para tenerla lista antes de las 2:00',
          },
          {
            id: 'tortilla',
            texto:
              'Llama al proveedor de tortilla por una hora real y prepara un plan B (avisar a piso, o comprar con otro proveedor autorizado dentro de lo que puede autorizar o con el visto bueno del gerente)',
          },
          {
            id: 'bitacora',
            texto:
              'Registra las lecturas de hoy y pregunta al responsable de anoche por qué la bitácora quedó en blanco, sin llenar lo que no se midió',
          },
        ],
        minimoCorrecta: 4,
        nucleo: ['producto'],
        alternativasValidas: [
          'Avisar al gerente de la mesa fría y de la falta MIENTRAS él mismo cubre la plancha y resuelve el frío de la línea',
          'Aplicar el máximo de 7 °C de la NOM-251-SSA1-2009 en lugar del supuesto de 4 °C no resta puntos: la mesa a 9 °C está fuera de rango con los dos límites',
        ],
        erroresCriticos: [
          {
            id: 'monta_fuera_de_rango',
            texto:
              'Monta crema, queso o salsas en la mesa fría a 9 °C para el servicio sin ninguna otra forma de mantenerlos a 4 °C o menos',
          },
          {
            id: 'inventa_bitacora',
            texto: 'Llena la bitácora de anoche con lecturas que nadie tomó',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 2,
        enunciado:
          'Te toca proponer el horario de la cocina para la semana que viene. Para este ejercicio, supón que tú armas la propuesta y el gerente la aprueba antes de publicarla. Son 7 personas; la cocina abre de martes a domingo, de 1:00 a 11:00 de la noche, y viernes y sábado se necesitan dos personas más que entre semana. Un cocinero pide descansar el viernes por tercera semana seguida y una ayudante solo puede trabajar en la tarde porque estudia en la mañana. No te pedimos el horario terminado: ¿cómo lo armas y qué datos necesitas para hacerlo?',
        dimension: 'equipo_estandares',
        evalua: 'Método para armar el rol semanal: datos, cobertura por día, descansos y peticiones con criterio parejo',
        tareaReal: 'Plantilla y roles de cocina (manual: el horario se publica cada domingo; los cambios los autoriza el gerente)',
        indispensable: false,
        esenciales: [
          {
            id: 'datos',
            texto:
              'Dice qué datos necesita antes de armarlo: cuántas personas pide cada franja o estación, qué estaciones domina cada quien, qué días y horas puede cada uno y las reglas de jornada y descanso',
          },
          {
            id: 'demanda',
            texto:
              'Cubre cada día según la demanda, con más personas el viernes y el sábado',
          },
          {
            id: 'descansos',
            texto: 'Da a cada persona su descanso semanal y respeta la duración de la jornada',
          },
          {
            id: 'mezcla',
            texto:
              'Reparte la experiencia: en cada turno queda alguien capaz de sacar las estaciones de más carga',
          },
          {
            id: 'viernes',
            texto:
              'Resuelve el descanso del viernes con un criterio parejo (rotación de fines de semana) y le explica la respuesta al cocinero',
          },
          {
            id: 'ayudante',
            texto:
              'Acomoda a la ayudante en las tardes si así se cubre lo que la cocina necesita, o le dice con claridad qué turnos puede ofrecerle',
          },
          {
            id: 'publica',
            texto: 'Pasa la propuesta al gerente para que la apruebe antes de publicarla',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Conceder el viernes al cocinero si otra persona con experiencia equivalente lo cubre y la rotación lo justifica',
          'Armar un horario de ejemplo con supuestos que declara (mínimos por día, quién cubre cada estación) en lugar de solo describir el método',
        ],
        erroresCriticos: [
          {
            id: 'sin_descanso',
            texto: 'Propone dejar a alguien sin descanso en la semana para cubrir el fin de semana',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 3,
        enunciado:
          'Al revisar las remisiones del último mes del proveedor de carne ves que en 3 de 8 entregas el cocinero que recibió firmó 10 kg de arrachera, y en el conteo del día siguiente faltaba cerca de 1 kg cada vez. Hoy a las 11:00 llega otra entrega y el repartidor tiene prisa. ¿Qué haces?',
        dimension: 'inocuidad',
        evalua: 'Corregir el sistema de recepción de proveedores, no solo la entrega de hoy',
        tareaReal:
          'Recepción de proveedores (manual: el encargado pesa, revisa caducidad y calidad el día que llega el producto)',
        indispensable: false,
        esenciales: [
          {
            id: 'hoy',
            texto:
              'Recibe hoy él mismo: pesa todo en la báscula, anota el peso real en la remisión y firma solo lo recibido',
          },
          {
            id: 'completa',
            texto: 'Revisa también la temperatura y el estado del producto, no solo el peso',
          },
          {
            id: 'proceso',
            texto:
              'Fija cómo se recibe en adelante (quién puede recibir, pesar siempre antes de firmar, anotar diferencias) y capacita al cocinero que firmó',
          },
          {
            id: 'reclama',
            texto:
              'Concilia las remisiones pasadas contra consumos, mermas y movimientos, y reclama al proveedor solo las diferencias que queden demostradas',
          },
          {
            id: 'gerente',
            texto:
              'Informa al gerente para que se ajusten los pagos y, si el patrón sigue, se evalúe al proveedor',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Pedir al proveedor que el repartidor espere a que se pese, o que regrese si no puede esperar',
        ],
        erroresCriticos: [
          { id: 'firma_sin_pesar', texto: 'Firma la entrega de hoy sin pesarla' },
          {
            id: 'acusa',
            texto: 'Acusa de robo al cocinero o al repartidor sin evidencia',
          },
        ],
      },
      {
        tipo: 'numerica',
        q: 4,
        enunciado:
          'La receta de cochinita usa 5 kg de pierna de cerdo con hueso a $110 el kilo. Después de cocer y deshebrar quedan 3 kg de carne lista. El achiote, la naranja agria y las especias de la receta completa cuestan $90 en total. Cada orden lleva 150 g de carne, y la tortilla, la cebolla morada y la salsa de cada orden cuestan $8. ¿Cuánto cuesta producir una orden de cochinita? Contesta en pesos.',
        dimension: 'costos_inventario',
        evalua: 'Costo por porción usando el rendimiento real, no el peso de compra',
        tareaReal: 'Costeo de recetas estándar',
        indispensable: false,
        clave: 40,
        tolerancia: 0.5,
        unidad: 'pesos',
        solucion:
          'Costo de la receta: 5 kg × $110 = $550 + $90 = $640. Rinde 3,000 g de carne lista: $640 / 3,000 g × 150 g = $32. Más $8 de guarnición = $40. Error típico: dividir entre los 5 kg de compra ($19.20 + $8 = $27.20), que ignora la merma de cocción y hueso.',
      },
      {
        tipo: 'numerica',
        q: 5,
        enunciado:
          'Compraste 10 kg de aguacate a $60 el kilo y, después de quitarle cáscara y hueso, obtuviste 6.5 kg de pulpa. Una orden de guacamole lleva 200 g de pulpa y $6 de otros ingredientes (jitomate, cebolla, chile, limón y totopos). Se vende en $145 sin IVA. ¿Qué porcentaje del precio de venta sin IVA representa el costo de una orden? Contesta en porcentaje.',
        dimension: 'costos_inventario',
        evalua: 'Porcentaje de costo de un platillo con la merma de limpieza del insumo',
        tareaReal: 'Costeo de recetas y control de merma',
        indispensable: false,
        clave: 16.87,
        tolerancia: 0.3,
        unidad: '%',
        solucion:
          'Pulpa: $600 / 6.5 kg = $92.31 por kg. 200 g = $18.46. Más $6 = $24.46 por orden. $24.46 / $145 = 16.87 %. Error típico: costear con el peso de compra ($12 + $6 = $18; 12.41 %).',
      },
      {
        tipo: 'abierta',
        q: 6,
        enunciado:
          'Al cerrar el inventario mensual, el queso Oaxaca tiene 4 kg menos de lo que debería según las compras y las ventas del sistema. En la bitácora de mermas ves que cada lunes se tiran unos 3 kg de arroz y 2 litros de salsa verde, y el queso no tiene ninguna merma registrada en el mes. Para este ejercicio, supón que reportas al gerente. ¿Qué haces con cada uno de los dos casos: el faltante de queso y la merma de los lunes?',
        dimension: 'costos_inventario',
        evalua: 'Investigar un faltante de inventario y bajar una merma recurrente',
        tareaReal:
          'Inventario mensual y bitácora de mermas (manual: el faltante se justifica; toda merma se registra con evidencia)',
        indispensable: false,
        esenciales: [
          {
            id: 'verifica',
            texto:
              'Faltante de queso: lo verifica antes de concluir: reconteo, recetas y porciones cargadas en el sistema, cancelaciones, comida de personal o entradas sin registrar',
          },
          {
            id: 'porcion',
            texto:
              'Pesa físicamente la porción de queso que llevan las quesadillas y otros platillos y la compara con la ficha (revisar la receta en papel o en el sistema cuenta en «verifica», no aquí)',
          },
          {
            id: 'lunes',
            texto:
              'Merma de los lunes: ajusta la producción de arroz y salsa del fin de semana (menos cantidad el domingo, tandas más chicas o mejor rotación) para bajarla',
          },
          {
            id: 'registro',
            texto:
              'Pide al equipo registrar en la bitácora, con evidencia, toda merma que ocurra; la del queso solo si se demuestra que ocurrió, y mientras tanto el faltante queda sin justificar hasta terminar de investigarlo',
          },
          {
            id: 'seguimiento',
            texto:
              'Sigue la merma de arroz y salsa de los lunes en las semanas siguientes (cuánto se tira) para comprobar si bajó',
          },
          {
            id: 'reporta',
            texto:
              'Informa al gerente el faltante con lo que encontró y, si apunta a robo, le deja la investigación y la sanción con la evidencia',
          },
        ],
        minimoCorrecta: 4,
        nucleo: ['verifica', 'lunes'],
        alternativasValidas: [
          'Contar el queso cada día o cada semana por ser un insumo de alto valor',
          'Para la merma de los lunes, aprovechar el sobrante en otra preparación solo si está en una receta autorizada, se conservó en refrigeración y sigue dentro de su vida útil',
        ],
        erroresCriticos: [
          {
            id: 'maquilla',
            texto: 'Ajusta el inventario o registra una merma que no ocurrió para que cuadre',
          },
          { id: 'acusa', texto: 'Acusa o castiga a un cocinero sin evidencia' },
        ],
      },
      {
        tipo: 'abierta',
        q: 7,
        enunciado:
          'Revisas las bitácoras de temperatura de la semana. La de la mesa fría de la línea tiene «4 °C» todos los días a la misma hora y con la misma letra, incluido el martes, el día que el técnico vino a repararla porque no enfriaba. La de la cámara tiene los domingos en blanco. ¿Qué haces?',
        dimension: 'inocuidad',
        evalua: 'Detectar bitácoras sin medición real y hacer que las temperaturas se midan de verdad',
        tareaReal: 'Control de temperaturas y bitácoras sanitarias',
        indispensable: true,
        motivoIndispensable:
          'Si no sabe exigir lecturas reales, la cocina opera con bitácoras que no protegen a nadie y un equipo de frío descompuesto puede pasar días sin detectarse.',
        esenciales: [
          {
            id: 'mide',
            texto: 'Mide hoy mismo, con su propio termómetro, la mesa fría y la cámara',
          },
          {
            id: 'aclara',
            texto:
              'Habla en privado con quien llenó la bitácora para saber si medía, y por qué los domingos no se registra',
          },
          {
            id: 'sistema',
            texto:
              'Fija quién mide en cada turno y a qué hora, con termómetro en cada equipo y firma de quien mide',
          },
          {
            id: 'correctiva',
            texto:
              'Pide que cada lectura fuera de rango se anote con la acción que se tomó',
          },
          {
            id: 'revisa',
            texto: 'Revisa él mismo las bitácoras cada día o cada semana',
          },
          {
            id: 'reporta',
            texto:
              'Informa al gerente la inconsistencia con su evidencia (misma letra y hora, 4 °C el día de la reparación, domingos vacíos) sin afirmar que se inventó hasta corroborarlo; la sanción, si hay, la decide el gerente',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Poner termómetros con registro automático y revisarlos contra la bitácora',
          'Dejar los domingos en blanco tal como están, con una nota fechada «sin registro; medición no corroborada» (afirmar que no se midió solo después de comprobarlo)',
        ],
        erroresCriticos: [
          {
            id: 'rellena',
            texto: 'Pide llenar los domingos en blanco con lecturas que no se tomaron',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 8,
        enunciado:
          'Viernes, 8:30 de la noche, con 14 comandas en la línea y el salón lleno: se apagan todos los quemadores y la plancha, y se siente olor a gas cerca del calentador. ¿Qué haces?',
        dimension: 'operacion_turno',
        evalua: 'Corte de gas con olor: seguridad primero y servicio después',
        tareaReal: 'Incidentes de cocina',
        indispensable: true,
        motivoIndispensable:
          'Si no sabe actuar ante olor a gas, puede mantener al equipo en el área o provocar una chispa, con riesgo de explosión, incendio o intoxicación de personas.',
        esenciales: [
          {
            id: 'llave',
            texto:
              'No enciende ni acciona nada que haga chispa y, solo si puede hacerlo sin riesgo y sabe cómo, cierra la llave general del gas y abre para ventilar',
          },
          {
            id: 'personas',
            texto:
              'Saca al equipo del área sin esperar a ver si el olor sigue y, desde un lugar seguro, llama (o hace que llamen) a emergencias o a la compañía de gas',
          },
          {
            id: 'gerente',
            texto: 'Avisa al gerente de inmediato para que atienda el salón y decida sobre el servicio',
          },
          {
            id: 'comandas',
            texto:
              'Fuera del área de riesgo, revisa qué se puede terminar sin gas (fríos, lo ya cocinado, equipo eléctrico seguro) y le da a piso la lista real',
          },
          {
            id: 'reabre',
            texto:
              'Solo reabre el gas cuando un técnico o la compañía confirman que no hay fuga, y reenciende con procedimiento',
          },
        ],
        minimoCorrecta: 4,
        nucleo: ['personas'],
        alternativasValidas: [
          'Pedir al gerente que llame a emergencias mientras él asegura la cocina',
        ],
        erroresCriticos: [
          {
            id: 'reenciende',
            texto: 'Intenta reencender quemadores o la plancha con olor a gas presente',
          },
          {
            id: 'sigue',
            texto: 'Mantiene al equipo cocinando en el área con olor a gas',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 9,
        enunciado:
          'Llegas a las 8:00 de la mañana y la cámara de refrigeración marca 12 °C. La última lectura de la bitácora es del cierre, a las 11:30 de la noche: 3 °C. Después no hay ninguna. Adentro hay carne cruda de res y de cerdo, pollo, crema y quesos, salsas preparadas ayer y la cochinita que se coció anoche. Abres a la 1:00. Para este ejercicio, supón que esta cocina usa un límite más estricto que el de la NOM-251 (que permite hasta 7 °C): refrigeración a 4 °C o menos, y que lo que pasa más de 4 horas arriba de 4 °C se desecha. Supón también que reportas al gerente y que él autoriza el desecho de producto de alto valor y cualquier reposición urgente fuera del pedido normal. ¿Qué haces?',
        dimension: 'inocuidad',
        evalua: 'Falla de refrigeración: decidir con la evidencia qué se salva, qué se tira y cómo se abre',
        tareaReal: 'Incidentes de equipo de frío',
        indispensable: true,
        motivoIndispensable:
          'Si no sabe decidir con la evidencia qué se desecha tras una falla de frío, puede servir alimento de alto riesgo que estuvo fuera de temperatura y causar una intoxicación.',
        esenciales: [
          {
            id: 'tiempo',
            texto:
              'Usa la bitácora para acotar el tiempo: entre las 11:30 y las 8:00 hay 8 horas y media sin lectura, así que no puede demostrar que no pasó más de 4 horas arriba de 4 °C; además mide la temperatura de los productos',
          },
          {
            id: 'desecha',
            texto:
              'No usa lo que no puede demostrar como inocuo, sobre todo cocidos, lácteos, salsas y pollo: lo desecha y lo registra con evidencia o, si es de alto valor, lo aparta y rotula sin usar hasta que el gerente autorice el desecho',
          },
          {
            id: 'traslada',
            texto: 'Pasa de inmediato a otro equipo frío lo que pueda demostrar rescatable o, si nada lo es, mantiene todo apartado y rotulado en frío sin usarlo (cuenta igual)',
          },
          { id: 'tecnico', texto: 'Llama al técnico y reporta la falla' },
          {
            id: 'carta',
            texto:
              'Arma la lista de reposición urgente y le avisa a piso qué platillos no salen hasta tener insumo',
          },
          {
            id: 'gerente',
            texto:
              'Reporta al gerente la pérdida, con las lecturas y la lista de lo afectado, y le pide la autorización para desechar lo de alto valor y para la reposición urgente fuera del pedido normal',
          },
        ],
        minimoCorrecta: 4,
        nucleo: ['desecha'],
        alternativasValidas: [
          'Usar carnes crudas solo si hay evidencia de que no pasaron más de 4 horas arriba de 4 °C (por ejemplo, un registro automático de la cámara); la lectura de hoy, aunque sea de todas las piezas, no reconstruye las 8 horas y media sin registro, y el visto bueno del gerente no sustituye esa evidencia; sin ella, apartar y rotular sin usar',
          'Inmovilizar (apartar y rotular sin usar) todo lo de la cámara mientras el gerente decide, sin usarlo en el servicio',
          'Aplicar el máximo de 7 °C de la NOM-251-SSA1-2009 en lugar del supuesto de 4 °C no resta puntos: la cámara a 12 °C está fuera de rango con los dos límites y la ventana sin registro es la misma',
        ],
        erroresCriticos: [
          {
            id: 'sirve',
            texto:
              'Sirve (o recalienta para servir) la cochinita, las salsas o los lácteos sin poder demostrar que no pasaron más de 4 horas arriba de 4 °C',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 10,
        enunciado:
          'En plena comida, un mesero entra a la cocina: la clienta de la mesa 12 pidió enchiladas suizas y avisó que es alérgica al cacahuate; la comanda traía la nota. Después de unos bocados dice que le pica la boca y siente la garganta cerrada. ¿Qué haces de inmediato y qué haces después de activar la atención?',
        dimension: 'inocuidad',
        evalua: 'Reacción alérgica reportada por una clienta: atención inmediata (fase 1) y, después, causa y corrección (fase 2)',
        tareaReal: 'Alergias reportadas por clientes',
        indispensable: true,
        motivoIndispensable:
          'Si no reconoce una posible anafilaxia y no activa la ayuda médica de inmediato, la clienta puede morir.',
        esenciales: [
          {
            id: 'emergencia',
            texto:
              'De inmediato: pide que llamen a emergencias y avisa al gerente para que atienda a la clienta',
          },
          {
            id: 'conserva',
            texto: 'De inmediato: aparta y conserva el platillo (y, si puede, los ingredientes usados) y la comanda, sin tirarlos',
          },
          {
            id: 'causa',
            texto:
              'Después: revisa en cocina de dónde pudo venir el cacahuate (ficha de las suizas, aceite, comal, utensilios y quién lo preparó)',
          },
          {
            id: 'resto',
            texto:
              'Después: corrige lo que causó el contacto para que no se repita en el resto del servicio',
          },
          {
            id: 'registro',
            texto: 'Después: deja por escrito lo que pasó y lo que encontró',
          },
          {
            id: 'proceso',
            texto:
              'Después: revisa con el equipo cómo se preparan los platillos con alergia (persona y utensilios designados, aviso en el pase)',
          },
        ],
        minimoCorrecta: 4,
        nucleo: ['emergencia'],
        alternativasValidas: [
          'Llamar él mismo a emergencias si el gerente no está a la mano',
          'Si la clienta trae su autoinyector de adrenalina, ayudarla o pedir que la ayuden a usarlo mientras llega la ayuda (primer tratamiento de la anafilaxia según las guías de la WAO); no se exige',
          'Correcta pide la fase inmediata (emergencia, núcleo) y al menos parte del seguimiento; lo que falte del seguimiento solo baja puntos, nunca es error crítico',
        ],
        erroresCriticos: [
          {
            id: 'minimiza',
            texto:
              'Dice que no puede ser por la comida o espera a ver si se le pasa, sin pedir ayuda médica',
          },
          {
            id: 'borra',
            texto: 'Tira el platillo o la comanda antes de revisar qué pasó',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 11,
        enunciado:
          'Dos clientes frecuentes le dijeron al gerente que la cochinita de la noche no sabe igual que la de la comida. Revisas y ves que el cocinero de la mañana marina la carne con la receta escrita, y el de la noche, que entró hace un mes, la prepara «como se la enseñó un compañero». ¿Qué haces?',
        dimension: 'equipo_estandares',
        evalua: 'Estandarizar una receta entre turnos y capacitar con la ficha técnica',
        tareaReal: 'Recetas estándar, fichas técnicas y capacitación',
        indispensable: false,
        esenciales: [
          {
            id: 'ficha',
            texto:
              'Verifica que la ficha esté completa (ingredientes con gramaje, rendimiento, tiempos y procedimiento) y a la vista en la estación',
          },
          {
            id: 'capacita',
            texto: 'Capacita al cocinero de la noche haciendo la receta con él, con la ficha',
          },
          {
            id: 'comprueba',
            texto:
              'Comprueba en los días siguientes que la cochinita de los dos turnos sale igual (la prueba o la compara)',
          },
          {
            id: 'sistema',
            texto:
              'Hace que todo el que prepare cochinita aprenda con la ficha (en la inducción o la capacitación), no de oídas',
          },
          {
            id: 'informa',
            texto: 'Le cuenta al gerente lo que encontró y lo que corrigió',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Si la versión de la noche resulta mejor, proponerla al chef o al gerente para actualizar la ficha, sin cambiarla por su cuenta',
        ],
        erroresCriticos: [],
      },
      {
        tipo: 'abierta',
        q: 12,
        enunciado:
          'Es domingo y te toca hacer el pedido de la semana. El jueves hay un evento de 60 personas con menú cerrado de suadero, arroz y frijoles. El proveedor de carne avisa que el suadero sube 15 % desde el lunes, y la cámara está casi llena con producto de la semana pasada. Para este ejercicio, supón que puedes autorizar compras hasta $3,000 y que arriba de eso decide el gerente. No te pedimos cifras: explica cómo calculas las cantidades y cómo haces el pedido.',
        dimension: 'costos_inventario',
        evalua: 'Pedido semanal con evento, espacio limitado y un aumento de precio',
        tareaReal: 'Inventario y pedidos',
        indispensable: false,
        esenciales: [
          {
            id: 'conteo',
            texto: 'Parte de un conteo físico de lo que hay, no de memoria',
          },
          {
            id: 'cantidades',
            texto:
              'Explica cómo calcula las cantidades: consumo normal de la semana (o máximos y mínimos) menos lo que hay, más lo del evento por persona; no se le exigen cifras que el enunciado no da',
          },
          {
            id: 'peps',
            texto:
              'Usa primero lo que ya está en la cámara y escalona las entregas para no saturarla (por ejemplo, el suadero del evento llega el miércoles)',
          },
          {
            id: 'precio',
            texto:
              'Avisa al gerente del aumento con su efecto en el costo del evento y de la carta, y deja la decisión de precio o de proveedor a quien le toca',
          },
          {
            id: 'tope',
            texto:
              'Pasa al gerente para su autorización lo que rebase $3,000 (por ejemplo, el pedido completo o la compra del evento) y solo autoriza él lo que queda dentro del tope',
          },
          { id: 'escrito', texto: 'Deja el pedido por escrito' },
        ],
        minimoCorrecta: 4,
        nucleo: ['cantidades'],
        alternativasValidas: [
          'Comprar suadero antes del aumento solo si hay espacio para congelarlo con etiqueta y, si rebasa $3,000, con autorización del gerente',
          'Cotizar con otro proveedor autorizado',
          'Pedir entregas parciales al proveedor autorizado para resolver el espacio de la cámara',
          'Dar cifras de ejemplo con supuestos que declara, siempre que explique cómo las calcula',
        ],
        erroresCriticos: [
          {
            id: 'rebasa_tope',
            texto:
              'Dice que autoriza él mismo una compra que sabe que pasa de $3,000, o que la parte en pedidos chicos para no pasarla al gerente',
          },
        ],
      },
    ],
  },
  competencias: {
    version: 'competencias_kitchen_manager_v1',
    preguntas: [
      // ── Integridad (todas de experiencia) ──
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que te diste cuenta de un error tuyo que nadie más había notado y que te costaba reconocer: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Lo reconoció o lo corrigió aunque nadie lo hubiera notado',
          'Asumió la consecuencia sin culpar a otros',
          'Cuenta qué cambió para que no se repitiera',
        ],
        senalesAlerta: ['Relata que lo ocultó o se lo atribuyó a otra persona'],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que tuviste en tus manos algo que no era tuyo (dinero, un objeto, un pago de más) y nadie se habría enterado si te lo quedabas: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Lo devolvió o lo reportó',
          'Buscó al dueño o a quien correspondía',
          'Lo hizo aunque le costara tiempo o esfuerzo',
        ],
        senalesAlerta: ['Relata habérselo quedado'],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que tuviste a tu cargo dinero, mercancía o cosas de otra persona y algo no cuadró: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Lo reportó en cuanto lo detectó',
          'Buscó la causa con datos (conteo, registros)',
          'Dejó constancia de lo que encontró',
        ],
        senalesAlerta: [
          'Cubrió el faltante con dinero o producto de otro lado sin reportarlo',
          'Se quedó con un sobrante',
        ],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que viste a un compañero o a alguien cercano tomar algo que no era suyo o saltarse una regla de seguridad: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Habló con la persona o lo reportó a quien correspondía',
          'Distinguió lo que le constaba de lo que suponía',
          'Mantuvo la decisión aunque afectara la relación',
        ],
        senalesAlerta: ['Encubrió el robo o la falta de seguridad', 'Participó en lo indebido'],
      },
      {
        eje: 'integridad',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que tuviste que anotar o reportar algo (una hora, una cantidad, una revisión) y anotarlo tal como fue te dejaba mal parado: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Anotó el dato real',
          'Explicó la causa y lo que hizo para corregirla',
        ],
        senalesAlerta: ['Relata haber anotado un dato falso o una revisión que no hizo'],
      },
      // ── Autoconciencia ──
      {
        eje: 'autoconciencia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que te diste cuenta, sin que nadie te lo dijera, de que algo que hacías no te estaba saliendo bien: cómo lo notaste, qué hiciste y qué cambió.',
        senalesPositivas: [
          'Describe la señal concreta que lo hizo notar',
          'Reconoce su parte sin excusas',
          'Da un cambio concreto que hizo',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'autoconciencia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que la presión o el cansancio te hicieron reaccionar de una forma que después no te gustó: qué pasó, qué hiciste después y cómo terminó.',
        senalesPositivas: [
          'Identifica qué lo detonó',
          'Reparó con la persona afectada',
          'Cuenta qué hace ahora para no repetirlo',
        ],
        senalesAlerta: [
          'Relata haber agredido físicamente o amenazado a alguien y lo justifica',
        ],
      },
      {
        eje: 'autoconciencia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de algo que te costó aprender en un trabajo, en la escuela o en tu vida: qué te costaba, qué hiciste para aprenderlo y cómo vas ahora.',
        senalesPositivas: [
          'Nombra con precisión qué le costaba',
          'Describe un esfuerzo concreto (práctica, pedir ayuda)',
          'Evalúa con honestidad dónde está hoy',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'autoconciencia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que pediste ayuda porque algo te rebasaba: qué pasó, a quién se la pediste y cómo terminó.',
        senalesPositivas: [
          'Reconoció su límite a tiempo',
          'Pidió ayuda concreta a la persona adecuada',
          'Aprendió algo para la siguiente vez',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'autoconciencia',
        tipo: 'hipotetica',
        texto:
          'Es viernes a las 9 de la noche, la línea va llena y te das cuenta de que tú mismo anotaste mal la cantidad de pollo en el pedido de ayer: va a faltar para el sábado. ¿Qué haces?',
        senalesPositivas: [
          'Reconoce el error como propio ante el gerente o el equipo',
          'Resuelve el abasto (otro proveedor, ajuste de carta) antes del sábado',
          'Propone cómo revisar el pedido para que no se repita',
        ],
        senalesAlerta: ['Culpa al proveedor o a otra persona del error'],
      },
      // ── Ética de trabajo ──
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que te tocó terminar una tarea pesada o aburrida sin que nadie te estuviera revisando: qué era, qué hiciste y cómo quedó.',
        senalesPositivas: [
          'La terminó completa y bien',
          'Describe el estándar que se puso a sí mismo',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que tuviste que reorganizarte o quedarte más tiempo porque faltó alguien: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Tomó la carga sin descuidar la calidad',
          'Organizó a los demás para cubrir',
          'Lo habló después para prevenirlo',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que encontraste algo mal hecho que no era tu responsabilidad directa: qué era, qué hiciste y cómo terminó.',
        senalesPositivas: [
          'Lo corrigió o avisó a quien le tocaba',
          'Le dio seguimiento hasta que quedó resuelto',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        texto:
          'Cuéntame de un compromiso que hiciste y cumpliste aunque te costó mucho: cuál era, qué hiciste para cumplirlo y cómo terminó.',
        senalesPositivas: [
          'Describe obstáculos reales y cómo los superó',
          'Cumplió en tiempo o avisó con anticipación si no podía',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'etica_trabajo',
        tipo: 'hipotetica',
        texto:
          'Un sábado a las 4 de la tarde se descompone el termómetro de punzón y la bitácora de cocción del pollo se llena cada hora. Nadie la va a revisar hasta el lunes. ¿Qué haces?',
        senalesPositivas: [
          'Consigue otro termómetro o uno de repuesto para seguir midiendo',
          'Mientras no puede medir, no libera pollo cuya cocción no puede comprobar y lo anota tal cual; un control alterno cuenta solo si explica cómo comprueba con él el estándar de cocción (no basta nombrarlo)',
          'Reporta la falla para reponer el equipo',
        ],
        senalesAlerta: ['Anota lecturas sin medir'],
      },
      // ── Empatía ──
      {
        eje: 'empatia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que notaste que alguien con quien trabajabas o vivías estaba pasando por algo difícil sin que te lo dijera: qué notaste, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Describe señales concretas que notó',
          'Se acercó con respeto y en privado',
          'Ofreció un apoyo concreto',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'empatia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que tuviste que decirle a alguien algo que no quería oír: qué pasó, cómo se lo dijiste y cómo terminó.',
        senalesPositivas: [
          'Lo dijo claro y en privado',
          'Cuidó la dignidad de la persona',
          'Escuchó su reacción',
        ],
        senalesAlerta: ['Relata haberla exhibido o humillado frente a otros'],
      },
      {
        eje: 'empatia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que le enseñaste algo a alguien que aprendía más lento que los demás: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Ajustó su forma de enseñar',
          'Tuvo paciencia sin bajar el estándar',
          'Comprobó que la persona aprendió',
        ],
        senalesAlerta: ['Relata burlas o insultos hacia la persona'],
      },
      {
        eje: 'empatia',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que tuviste un desacuerdo fuerte con alguien que tenía otras prioridades que las tuyas: qué pasó, qué hiciste tú y cómo terminó.',
        senalesPositivas: [
          'Entendió qué necesitaba la otra persona',
          'Buscaron un acuerdo',
          'Mantuvo el respeto',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'empatia',
        tipo: 'hipotetica',
        texto:
          'Un ayudante de cocina que lleva dos semanas te dice al terminar el turno que se quiere ir porque los cocineros se burlan de cómo habla. ¿Qué haces?',
        senalesPositivas: [
          'Lo escucha y le pide detalles concretos',
          'Habla con los cocineros y deja claro que la burla no se tolera',
          'Da seguimiento con el ayudante en los días siguientes',
        ],
        senalesAlerta: ['Le dice que aguante porque así es la cocina, o se ríe de él'],
      },
      // ── Curiosidad (sin señales de alerta) ──
      {
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que aprendiste algo por tu cuenta sin que nadie te lo pidiera: qué fue, cómo lo aprendiste y para qué te sirvió.',
        senalesPositivas: [
          'Describe la fuente y el método (probar, leer, preguntar)',
          'Lo aplicó en algo concreto',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que algo salía mal una y otra vez y te pusiste a buscar la causa: qué era, cómo la buscaste y qué encontraste.',
        senalesPositivas: [
          'Observó o midió antes de concluir',
          'Probó hipótesis',
          'Encontró la causa y la corrigió',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que le preguntaste a alguien cómo hacía algo que a ti te salía distinto: qué le preguntaste, qué aprendiste y qué cambiaste.',
        senalesPositivas: [
          'Hizo preguntas específicas',
          'Probó lo aprendido y comparó el resultado',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        texto:
          'Cuéntame de un cambio que propusiste para que algo fuera más fácil, más barato o mejor: cómo se te ocurrió, qué hiciste y qué pasó.',
        senalesPositivas: [
          'La idea nació de observar un problema real',
          'La probó o la midió',
          'Cuenta el resultado, aunque no haya funcionado',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'inteligencia_curiosa',
        tipo: 'hipotetica',
        texto:
          'En la bitácora de mermas ves que la de tortilla sube un poco cada mes. Nadie se ha quejado y el costo total de la cocina sigue dentro de lo normal. ¿Qué haces?',
        senalesPositivas: [
          'Investiga la causa aunque no haya presión (almacenamiento, pedido, uso)',
          'Revisa datos o pregunta al equipo',
          'Propone una prueba para bajarla',
        ],
        senalesAlerta: [],
      },
      // ── Optimismo (sin señales de alerta) ──
      {
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que algo te salió mal y aun así lo volviste a intentar: qué pasó, qué hiciste y cómo terminó.',
        senalesPositivas: [
          'Aprendió algo concreto del primer intento',
          'Lo intentó de otra forma',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        texto:
          'Cuéntame de una vez en que el grupo con el que estabas (en el trabajo, en un equipo, en tu familia) estaba desanimado y tú hiciste algo para levantarlo: qué pasó, qué hiciste y cómo terminó.',
        senalesPositivas: [
          'Describe una acción o frase concreta',
          'Reconoció el esfuerzo de los demás',
          'El grupo terminó mejor de lo que empezó',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        texto:
          'Cuéntame de la última vez que reconociste en voz alta el buen trabajo de alguien: qué hizo esa persona, qué le dijiste y qué pasó después.',
        senalesPositivas: [
          'El reconocimiento fue específico',
          'Lo hizo de forma que otros lo vieran o lo supieran',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        texto:
          'Cuéntame de un problema que al principio parecía no tener solución y que terminaste resolviendo: qué era, qué hiciste y cómo terminó.',
        senalesPositivas: [
          'Buscó opciones en lugar de rendirse',
          'Involucró a otros',
        ],
        senalesAlerta: [],
      },
      {
        eje: 'optimismo_bondadoso',
        tipo: 'hipotetica',
        texto:
          'Una revisión sanitaria interna encontró muchas fallas en la cocina. El equipo está desanimado y dos cocineros dicen que «esto nunca va a quedar». Mañana empieza el plan para corregirlas. ¿Qué haces en la junta con el equipo?',
        senalesPositivas: [
          'Reconoce lo que sí está bien y es honesto con lo que falta',
          'Divide el plan en metas cortas con responsables',
          'Da un primer logro alcanzable en los próximos días',
        ],
        senalesAlerta: [],
      },
    ],
  },
}
