import type { ExamenPuesto } from '#services/exam_catalog/types'

// Examen de Subencargado de cocina / sous chef / segundo de cocina
// (catálogo 2026-11-16).
//
// Puesto de mando: coordina la línea en el turno cuando no está el Encargado
// de cocina. No comparte examen con Cocinero (que ejecuta una estación) ni con
// Encargado de cocina / Chef (que decide recetas, compras, costos, plantilla y
// sanciones). El práctico mide reparto de estaciones, revisión de mise en
// place, control al pase, agotados (86) y aviso a piso, recepción de
// mercancía, merma, capacitación, conflictos en la línea y qué escala.
// Competencias: 30 preguntas (5 por eje), como los demás puestos de mando.
//
// Valores de inocuidad: referencia NOM-251-SSA1-2009 y Distintivo H. Donde
// difieren, el elemento califica el método y acepta ambos; el supuesto queda
// en facultades.pendientesOperador.

export const EXAMEN_KITCHEN_SUB_MANAGER: ExamenPuesto = {
  code: 'kitchen_sub_manager',
  label: 'Subencargado de cocina',
  aliases: [
    'subencargado de cocina',
    'sub encargado de cocina',
    'subencargada de cocina',
    'sub encargada de cocina',
    'sous chef',
    'sous-chef',
    'souschef',
    'segundo de cocina',
    'segunda de cocina',
    'subchef',
    'sub chef',
    'kitchen sub manager',
  ],
  tareas: [
    'Coordinar la línea durante el turno cuando no está el Encargado de cocina',
    'Repartir estaciones al inicio del turno y redistribuir durante el servicio',
    'Revisar la mise en place y la producción de cada estación antes de abrir',
    'Controlar la calidad y la temperatura de los platillos en el pase',
    'Manejar los agotados (86): contarlos, marcarlos y comunicarlos a piso',
    'Recibir mercancía y rechazar lo que no cumple',
    'Registrar mermas y descartes del turno',
    'Capacitar a cocineros nuevos en estación',
    'Resolver conflictos en la línea durante el servicio',
    'Escalar al Encargado de cocina o al Chef lo que no es su facultad',
  ],
  facultades: {
    decide: [
      'Qué cocinero va a qué estación y moverlos durante el servicio',
      'Detener en el pase un platillo que no cumple y ordenar que se rehaga',
      'Marcar un platillo como agotado (86) en el POS y avisar a piso',
      'Rechazar en la recepción el producto que no cumple temperatura, caducidad o estado',
      'Descartar producto fuera de norma y registrarlo como merma',
      'Ordenar recalentar, reenfriar o retirar producto de la línea',
      'Retirar de la manipulación de alimentos a un cocinero con síntomas',
      'Asignar acompañante y tareas a un cocinero nuevo',
      'Intervenir en un conflicto de la línea para que el servicio siga',
    ],
    escala: [
      'Cambios de receta, de porción o de presentación (al Chef o Encargado de cocina)',
      'Compras fuera de la lista, marcas sustitutas o proveedores nuevos',
      'Sanciones, suspensiones, enviar a casa sin goce de sueldo o cualquier medida disciplinaria',
      'Un faltante de proveedor que deja sin un platillo clave el servicio siguiente',
      'Descartes de alto costo y reparaciones de equipo',
      'Una reacción alérgica o un incidente de salud de un comensal (además de pedir ayuda de inmediato)',
    ],
    pendientesOperador: [
      'Si el Subencargado puede rechazar mercancía por su cuenta o necesita confirmar con compras/Encargado: el examen supone que rechaza y avisa',
      'Temperatura de recepción y conservación de refrigerados: el examen acepta ≤4 °C (Distintivo H) o ≤7 °C (NOM-251-SSA1-2009); confirmar el estándar de La Llorona',
      'Congelados ≤ -18 °C, mantenimiento en caliente ≥60 °C, recalentado y aves a 74 °C: valores de referencia NOM-251 / Distintivo H; confirmar numerales',
      'Monto a partir del cual un descarte se considera «de alto costo» y se avisa al Encargado: no está en las fuentes',
      'Quién marca el agotado (86) en el POS (Subencargado o también el capitán): el examen supone que lo marca el Subencargado',
      'Política de crema o lácteos con caducidad próxima en recepción (pregunta 5): ¿qué vida útil mínima debe traer un lácteo para aceptarlo? Supuesto; se califica que lo revise y lo registre',
      'Regla de tiempo en zona de peligro para producto caliente que bajó de 60 °C (pregunta 2): ¿se descarta si pasó más de 2 h o no se sabe cuánto? Supuesto; confirmar la regla de la casa',
      'Precios de la pregunta 6 (arrachera, crema, arroz): cifras del caso, no costos de La Llorona',
      'Formato de registro de merma (bitácora en papel o POS/inventario): no está en las fuentes',
      'Plan de capacitación de un cocinero nuevo (días de acompañamiento): no está en las fuentes; la pregunta 7 no fija días',
      'Si el Subencargado puede mandar a casa a un cocinero enfermo o sólo retirarlo de alimentos y avisar: el examen supone lo segundo',
      'Si el Subencargado puede mandar a casa a un cocinero tras una agresión en la línea, o sólo separarlo y avisar (pregunta 8)',
      'Qué sustitutos de marca o proveedores alternos están ya autorizados para lácteos y otros insumos clave cuando no están el Chef ni el Encargado (pregunta 10)',
      'Tiempo estándar de salida por platillo (15 min en la pregunta 11): cifra del caso, no estándar de La Llorona',
    ],
  },
  practico: {
    version: 'banco_kitchen_sub_manager_v1',
    umbralAprobado: 70,
    dimensiones: [
      { id: 'coordinacion', nombre: 'Coordinación de la línea y tiempos', peso: 30 },
      { id: 'calidad', nombre: 'Calidad al pase e inocuidad', peso: 30 },
      { id: 'insumos', nombre: 'Agotados, recepción y merma', peso: 25 },
      { id: 'equipo', nombre: 'Capacitación, conflictos y escalamiento', peso: 15 },
    ],
    preguntas: [
      {
        tipo: 'abierta',
        q: 1,
        enunciado:
          'Sábado, el Encargado de cocina descansa. Tienes cinco cocineros: uno entró hace dos días, otro viene de doblar turno, y el más rápido en plancha te pide otra vez fríos porque «ya se cansó de la plancha». Las estaciones son plancha, comal y antojitos, fríos y ceviches, guisos y caldos, y postres. A las 2:00 llega una reserva de 25 personas con menú fijo de tres tiempos. ¿Cómo repartes las estaciones?',
        dimension: 'coordinacion',
        evalua: 'Repartir estaciones con criterio de carga, experiencia y servicio',
        tareaReal: 'Reparto de estaciones al inicio del turno',
        indispensable: true,
        esenciales: [
          {
            id: 'nuevo',
            texto:
              'Pone al cocinero nuevo en una estación de menor carga o junto a alguien con experiencia, no solo',
          },
          {
            id: 'fuerte',
            texto:
              'Asigna las estaciones de más carga del día (plancha, la del menú fijo) a quien puede con ellas',
          },
          {
            id: 'doblado',
            texto:
              'Cuida al que viene de doblar turno (estación más ligera o un descanso programado)',
          },
          {
            id: 'peticion',
            texto:
              'Decide la petición del cocinero de plancha por la necesidad del servicio y le explica o acuerda una rotación',
          },
          {
            id: 'reserva',
            texto:
              'Define quién saca cada tiempo del menú fijo de los 25 y deja esa producción lista antes de las 2:00',
          },
          {
            id: 'verifica',
            texto:
              'Durante el servicio revisa una señal concreta (tiempos del KDS, comandas acumuladas por estación) y mueve gente si hace falta',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Darle fríos al cocinero de plancha si deja a alguien capaz en plancha y lo compensa con rotación en otro turno',
          'Tomar él mismo una estación en el pico si la plantilla no alcanza, sin dejar de vigilar el pase',
          'Repartir por fases (una distribución para la producción del menú fijo y otra para el pico) o con supervisión compartida del nuevo, si lo explica',
        ],
        erroresCriticos: [
          {
            id: 'nuevo_solo',
            texto: 'Deja al cocinero nuevo solo en plancha o en la producción del menú fijo',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 2,
        enunciado:
          'Son las 12:30 y el servicio abre a la 1:00. Al recorrer la línea encuentras: en fríos falta la mitad del pico de gallo de la hoja de producción; hay un recipiente de ceviche sin etiqueta; la mesa fría de fríos marca 9 °C; el mole está en el baño maría a 45 °C; el comal y la plancha están listos. ¿Qué haces en esa media hora?',
        dimension: 'calidad',
        evalua: 'Revisar mise en place y producción antes de abrir y priorizar por riesgo',
        tareaReal: 'Revisión de estaciones antes del servicio',
        indispensable: false,
        esenciales: [
          {
            id: 'ceviche',
            texto: 'Retira para descarte el ceviche sin etiqueta y lo registra como merma',
          },
          {
            id: 'mole',
            texto:
              'Antes de recuperar el mole pregunta o comprueba cuánto tiempo lleva a 45 °C: si se sabe que es poco, lo recalienta a 74 °C y lo mantiene a 60 °C o más; si no se sabe, lo retiene o lo descarta',
          },
          {
            id: 'mesa_fria',
            texto:
              'Pasa los productos de la mesa fría a una cámara que enfríe y pide la reparación (o mide el producto y decide)',
          },
          {
            id: 'faltante',
            texto:
              'Asigna a alguien concreto a terminar el pico de gallo antes de la 1:00',
          },
          {
            id: 'piso',
            texto:
              'Si algo no va a estar a tiempo, avisa a piso antes de abrir qué no se puede vender todavía',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Abrir con la estación de fríos trabajando desde la cámara o con hielo mientras se repara la mesa fría, midiendo la temperatura',
        ],
        erroresCriticos: [
          {
            id: 'abre_igual',
            texto: 'Abre el servicio usando el ceviche sin etiqueta o el mole a 45 °C sin recalentar',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 3,
        enunciado:
          'Estás en el pase un viernes a las 9:00. En diez minutos llegan: unas enchiladas de mole con media porción de pollo, un caldo de camarón tibio, una tlayuda bien hecha pero con el plato escurrido, y una arrachera pedida término medio que llega bien cocida. Todo es para mesas distintas y el KDS ya marca 18 minutos de espera. ¿Qué haces?',
        dimension: 'calidad',
        evalua: 'Controlar calidad en el pase sin frenar el servicio',
        tareaReal: 'Control de calidad al pase',
        indispensable: true,
        esenciales: [
          {
            id: 'detiene',
            texto:
              'No deja salir lo que no cumple (porción, temperatura, término) aunque haya prisa',
          },
          {
            id: 'arregla',
            texto:
              'Corrige en el momento lo que se arregla en el pase (limpia el plato de la tlayuda) y la deja salir',
          },
          {
            id: 'rehace',
            texto:
              'Ordena rehacer la arrachera con prioridad y completar la porción o recalentar el caldo a temperatura',
          },
          {
            id: 'avisa_piso',
            texto: 'Avisa al mesero o capitán de las mesas que van a esperar unos minutos más',
          },
          {
            id: 'retro',
            texto:
              'Le dice al cocinero de cada estación qué falló, con el estándar concreto (porción, término, temperatura)',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Dejar la retroalimentación detallada para después del pico y en el momento sólo dar la instrucción concreta',
        ],
        erroresCriticos: [
          {
            id: 'deja_salir',
            texto: 'Manda la arrachera bien cocida, el caldo tibio o la media porción como están',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 4,
        enunciado:
          'Viernes, 8:15 de la noche. El cocinero de plancha te dice que quedan 6 porciones de pescado zarandeado y en el KDS hay 4 comandas que suman 7. Falta lo más fuerte de la noche. ¿Qué haces?',
        dimension: 'insumos',
        evalua: 'Manejar un agotado (86) y comunicarlo a piso a tiempo',
        tareaReal: 'Agotados (86) y comunicación cocina-piso',
        indispensable: true,
        esenciales: [
          {
            id: 'confirma',
            texto: 'Confirma físicamente cuántas porciones hay, incluida la cámara o el almacén',
          },
          {
            id: 'orden',
            texto:
              'Cubre las comandas en el orden en que entraron y define qué mesa se queda sin pescado',
          },
          {
            id: 'piso',
            texto:
              'Avisa de inmediato al capitán o al mesero de esa mesa para que le ofrezca otra opción',
          },
          {
            id: 'pos',
            texto:
              'Hace que el pescado quede agotado en el POS (o con las porciones que quedan) para que no entren más comandas: lo marca él o confirma que lo marque el capitán',
          },
          {
            id: 'registra',
            texto:
              'Lo anota para el Encargado (a qué hora se agotó) para ajustar la producción o el pedido',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Ofrecer a piso un platillo de la carta como alternativa con la cantidad disponible',
        ],
        erroresCriticos: [
          {
            id: 'sustituye',
            texto:
              'Manda otro pescado o una porción más chica como si fuera el zarandeado sin avisar al comensal',
          },
          {
            id: 'no_bloquea',
            texto: 'Dice que deja el platillo a la venta o que sigue aceptando comandas que no se pueden cubrir',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 5,
        enunciado:
          'A las 10:00 llega el proveedor con el pedido de la mañana: el pollo marca 9 °C en el termómetro, el camarón congelado trae cristales grandes de hielo y la caja está húmeda, el jitomate viene bien, la crema caduca mañana y la remisión dice 5 kg de aguacate pero en la báscula hay 4. El proveedor tiene prisa. ¿Qué haces?',
        dimension: 'insumos',
        evalua: 'Recibir mercancía y rechazar lo que no cumple',
        tareaReal: 'Recepción de mercancía',
        indispensable: true,
        esenciales: [
          {
            id: 'pollo',
            texto:
              'Rechaza el pollo a 9 °C (refrigerado debe llegar a 4 °C o menos; 7 °C según NOM-251)',
          },
          {
            id: 'camaron',
            texto:
              'Rechaza o retiene el camarón por las señales de descongelado (cristales grandes, caja húmeda), midiendo su temperatura si puede (congelado: -18 °C o menos); no hace falta afirmar que se recongeló',
          },
          {
            id: 'peso',
            texto:
              'Anota en la remisión el faltante de aguacate (4 kg recibidos) y lo que rechazó, con firma del proveedor',
          },
          {
            id: 'caducidad',
            texto:
              'Revisa la caducidad de la crema y la acepta sólo si se usa antes de mañana según la política, o la rechaza',
          },
          {
            id: 'guarda',
            texto:
              'Guarda de inmediato lo aceptado, frío primero, con fecha de recepción y en orden PEPS',
          },
          {
            id: 'avisa',
            texto:
              'Avisa al Encargado o a compras lo rechazado para la reposición y si afecta el servicio',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Pedir al proveedor que regrese con el producto en temperatura antes del servicio, dejando el rechazo por escrito',
        ],
        erroresCriticos: [
          {
            id: 'acepta',
            texto: 'Acepta el pollo a 9 °C o el camarón con esas señales porque el proveedor tiene prisa o hace falta',
          },
          {
            id: 'firma_completo',
            texto: 'Firma la remisión como completa sin anotar el faltante ni lo rechazado',
          },
        ],
      },
      {
        tipo: 'numerica',
        q: 6,
        enunciado:
          'Al cierre registras la merma del turno: 1.8 kg de arrachera que se cayó al piso (costo $420 por kg), 3 litros de crema que se cortaron ($65 por litro) y 12 porciones de arroz que sobraron y no se pueden guardar ($9 por porción). ¿Cuánto suma la merma del turno en pesos? Responde con un solo número.',
        dimension: 'insumos',
        evalua: 'Valorizar la merma del turno',
        tareaReal: 'Registro de mermas',
        indispensable: false,
        clave: 1059,
        tolerancia: 1,
        unidad: 'MXN',
        solucion: 'Arrachera 1.8 × 420 = $756; crema 3 × 65 = $195; arroz 12 × 9 = $108. Total $756 + $195 + $108 = $1,059.',
      },
      {
        tipo: 'abierta',
        q: 7,
        enunciado:
          'El lunes entra un cocinero nuevo que va a cubrir fríos y ceviches. El Encargado te pide que el viernes ya pueda sacar la estación solo. ¿Cómo lo preparas?',
        dimension: 'equipo',
        evalua: 'Capacitar a un cocinero en una estación con un criterio de salida comprobable',
        tareaReal: 'Capacitación en estación',
        indispensable: false,
        esenciales: [
          {
            id: 'receta',
            texto: 'Le enseña las recetas estándar de la estación (fichas, porciones, emplatado)',
          },
          {
            id: 'demuestra',
            texto: 'Le demuestra los platillos preparándolos',
          },
          {
            id: 'practica',
            texto:
              'Lo hace preparar los platillos y le corrige en el momento (él mismo, o el cocinero con experiencia que asignó, con seguimiento suyo)',
          },
          {
            id: 'inocuidad',
            texto:
              'Le enseña lo crítico de inocuidad de esa estación (mariscos en frío, contaminación cruzada, alérgenos, etiquetas)',
          },
          {
            id: 'acompana',
            texto: 'Lo deja los primeros servicios junto a un cocinero con experiencia en fríos',
          },
          {
            id: 'comprueba',
            texto:
              'Antes de dejarlo solo comprueba con algo concreto que puede (le hace sacar la estación en un servicio y revisa tiempos y platos), él o alguien que asignó y le reporta; el viernes es la meta, no la condición',
          },
          {
            id: 'informa',
            texto: 'Le informa al Encargado si el viernes todavía no está listo, en vez de dejarlo solo igual',
          },
        ],
        minimoCorrecta: 5,
        alternativasValidas: [
          'Usar una lista de verificación por platillo que el cocinero firma cuando lo saca bien tres veces',
        ],
        erroresCriticos: [
          {
            id: 'solo_sin_prueba',
            texto: 'Lo deja solo en la estación sin que nadie haya comprobado que la saca',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 8,
        enunciado:
          'En lo más fuerte del sábado, el cocinero de comal y el de antojitos empiezan a discutir porque uno usa el espacio y los utensilios del otro. Suben el tono, se insultan y uno empuja la charola del otro al suelo. ¿Qué haces?',
        dimension: 'equipo',
        evalua: 'Resolver un conflicto en la línea sin detener el servicio y escalar lo disciplinario',
        tareaReal: 'Conflictos en la línea',
        indispensable: false,
        esenciales: [
          {
            id: 'detiene',
            texto:
              'Interviene de inmediato y separa a los dos (mueve a uno a otra tarea o estación); pedir apoyo al gerente o a seguridad si hay riesgo físico también cuenta',
          },
          {
            id: 'servicio',
            texto:
              'Reorganiza para que las comandas sigan saliendo (repone lo que se tiró, reasigna)',
          },
          {
            id: 'despues',
            texto:
              'Habla con cada uno por separado después del pico, sobre hechos, y acuerda cómo se reparte el espacio',
          },
          {
            id: 'documenta',
            texto: 'Anota lo que pasó (hora, quién, qué) con testigos si los hay',
          },
          {
            id: 'escala',
            texto:
              'Le informa al Encargado de cocina o al Chef para que decida la sanción',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Pedir apoyo al gerente en turno si alguno no se calma o hay riesgo de agresión física',
        ],
        erroresCriticos: [
          {
            id: 'sanciona',
            texto: 'Suspende, despide, manda a casa o descuenta el día a alguno por su cuenta',
          },
          {
            id: 'deja_seguir',
            texto: 'Deja que sigan discutiendo o forcejeando en la línea',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 9,
        enunciado:
          'Un cocinero llega al turno pálido y te cuenta que anoche vomitó varias veces. Te pide trabajar porque necesita el día y hoy faltan dos personas. ¿Qué haces?',
        dimension: 'calidad',
        evalua: 'Proteger la inocuidad ante un cocinero con síntomas sin salirse de su facultad',
        tareaReal: 'Salud del personal que manipula alimentos',
        indispensable: false,
        esenciales: [
          {
            id: 'retira',
            texto: 'No lo deja manipular alimentos ese día',
          },
          {
            id: 'alternativa',
            texto:
              'Le recomienda atención médica o lo pasa a una tarea sin contacto con alimentos, según lo permita la casa',
          },
          {
            id: 'reorganiza',
            texto: 'Reorganiza las estaciones para cubrir el turno con quienes están',
          },
          {
            id: 'informa',
            texto:
              'Avisa al Encargado de cocina o a RH, que deciden si se va a casa, sobre el día y el pago',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Pedir que se presente con constancia médica antes de volver a la línea',
        ],
        erroresCriticos: [
          {
            id: 'lo_deja',
            texto: 'Lo pone a trabajar en una estación con alimentos porque falta gente',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 10,
        enunciado:
          'El Chef y el Encargado de cocina están fuera hasta mañana. A las 6:00 de la tarde el proveedor de lácteos te dice que no le llegó la crema de siempre y te ofrece otra marca más barata. Al mismo tiempo, el cocinero de guisos te propone ponerle menos chocolate al mole para que rinda, porque va a faltar para el domingo. ¿Qué haces?',
        dimension: 'equipo',
        evalua: 'Distinguir lo que decide de lo que escala (compras fuera de lista, cambios de receta)',
        tareaReal: 'Escalamiento al Encargado o Chef',
        indispensable: false,
        esenciales: [
          {
            id: 'no_receta',
            texto: 'No cambia la receta del mole y se lo dice al cocinero',
          },
          {
            id: 'consulta_marca',
            texto:
              'No compra la otra marca por su cuenta: consulta al Encargado o Chef por teléfono o usa una alternativa ya autorizada',
          },
          {
            id: 'cubre',
            texto:
              'Resuelve el servicio de hoy con lo que tiene (existencias de crema, agotado si hace falta)',
          },
          {
            id: 'mole_domingo',
            texto:
              'Avisa al Encargado que el mole no alcanza para el domingo para que programe producción o compra',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Producir una tanda extra de mole con la receta estándar si hay insumos y tiempo, avisando al Encargado',
          'Buscar la crema de siempre con otro proveedor ya autorizado, o cotizar, sin comprar hasta tener autorización',
        ],
        nucleo: ['no_receta', 'consulta_marca'],
        erroresCriticos: [
          {
            id: 'cambia_receta',
            texto: 'Autoriza que el mole se haga con menos chocolate',
          },
          {
            id: 'compra',
            texto: 'Dice que acepta la marca nueva o que compra fuera de la lista sin autorización (buscar o cotizar no lo es)',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 11,
        enunciado:
          'Viernes, 9:20 de la noche. El KDS muestra 14 comandas abiertas y un tiempo promedio de salida de 24 minutos contra 15 de costumbre. Plancha tiene 9 de esas comandas; fríos y postres están casi vacíos. El capitán viene a preguntarte cuánto falta para la mesa 20. ¿Qué haces?',
        dimension: 'coordinacion',
        evalua: 'Leer el KDS, atacar el cuello de botella y dar tiempos reales a piso',
        tareaReal: 'Coordinación de tiempos en la línea',
        indispensable: false,
        esenciales: [
          {
            id: 'cuello',
            texto: 'Identifica la plancha como el cuello de botella',
          },
          {
            id: 'mueve',
            texto:
              'Mueve a un cocinero de fríos o postres (o entra él mismo) a apoyar la plancha',
          },
          {
            id: 'prioriza',
            texto:
              'Ordena sacar primero las comandas más antiguas y completar mesas enteras',
          },
          {
            id: 'tiempo_real',
            texto:
              'Le da al capitán un tiempo real para la mesa 20 y le pide avisar a las mesas con espera',
          },
          {
            id: 'verifica',
            texto:
              'Vuelve a revisar el tiempo promedio del KDS en unos minutos para ver si bajó',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Pedir al gerente o capitán que frenen la entrada de mesas o la venta de platillos de plancha mientras baja la espera',
        ],
        erroresCriticos: [
          {
            id: 'promete',
            texto: 'Le dice al capitán «ya sale» sin saber cuánto falta',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 12,
        enunciado:
          'Un mesero te pregunta en el pase si la tlayuda puede salir «sin nada de lácteo» porque el comensal es alérgico a la leche. El cocinero de comal contesta «sí, ahorita le quito el quesillo». La tlayuda de la casa lleva quesillo, asiento de cerdo y frijoles refritos. ¿Qué haces?',
        dimension: 'calidad',
        evalua: 'Controlar un alérgeno desde el pase y corregir al cocinero',
        tareaReal: 'Control de alérgenos en la línea',
        indispensable: false,
        esenciales: [
          {
            id: 'frena',
            texto: 'Frena la respuesta del cocinero hasta revisar todos los componentes',
          },
          {
            id: 'revisa',
            texto:
              'Revisa en la receta o etiquetas si los frijoles, el asiento u otras preparaciones llevan lácteo (mantequilla, crema, queso)',
          },
          {
            id: 'limpio',
            texto:
              'Si se puede preparar, ordena hacerla aparte con comal, utensilios y manos limpios',
          },
          {
            id: 'honesto',
            texto:
              'Si no puede garantizarla sin lácteo, le dice al mesero que no la recomiende y propone otra opción',
          },
          {
            id: 'ensena',
            texto:
              'Le explica después al cocinero por qué quitar el queso no basta',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Dejar que el mesero ofrezca otro platillo que ya se sabe sin lácteo, confirmado contra la receta',
        ],
        nucleo: ['revisa'],
        erroresCriticos: [
          {
            id: 'quita_queso',
            texto: 'Deja salir la tlayuda sólo quitándole el quesillo sin revisar los demás componentes',
          },
        ],
      },
    ],
  },
  competencias: {
    version: 'competencias_kitchen_sub_manager_v1',
    preguntas: [
      // Integridad: todas de experiencia.
      {
        texto:
          'Cuéntame de la última vez que encontraste algo irregular en el trabajo de otra persona (mercancía, inventario, horas, dinero o registros). ¿Qué pasó, qué hiciste tú, qué dejaste documentado y cómo terminó?',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Revisó los hechos antes de acusar',
          'Lo documentó y lo informó a quien le correspondía decidir',
          'Trató el caso igual aunque fuera alguien cercano',
        ],
        senalesAlerta: [
          'Encubrió el faltante o la irregularidad',
          'Resolvió el caso a cambio de algo para él',
        ],
      },
      {
        texto:
          'Cuéntame de una vez en que cometiste un error que podía afectar a otras personas y tuviste que decidir si decirlo. ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo dijo a tiempo para que se pudiera corregir',
          'Asumió la responsabilidad sin culpar a otros',
          'Cambió algo para que no se repita',
        ],
        senalesAlerta: [
          'Ocultó el error y cargó la culpa a otra persona',
        ],
      },
      {
        texto:
          'Cuéntame de la última vez que alguien te ofreció un favor, un regalo o una ventaja a cambio de algo en tu trabajo o en tu escuela. ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo rechazó o lo transparentó con su responsable',
          'Explica por qué era un conflicto de interés',
        ],
        senalesAlerta: [
          'Aceptó dinero o mercancía de un proveedor a cambio de recibir producto o pedidos',
        ],
      },
      {
        texto:
          'Cuéntame de una vez en que te presionaron para dar por bueno algo que no cumplía (un producto, un trabajo, un reporte) para salir del paso. ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Sostuvo el estándar aunque costara',
          'Buscó una alternativa para no dejar el problema sin resolver',
          'Explicó su decisión a quien presionaba',
        ],
        senalesAlerta: [
          'Firmó o dio por bueno algo que ponía en riesgo la salud de otros y lo cuenta como normal',
        ],
      },
      {
        texto:
          'Cuéntame de la última vez que tuviste que aplicar una regla a alguien con quien te llevabas bien. ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Aplicó la regla igual que a los demás',
          'Lo habló de frente y con respeto',
          'Cuidó la relación sin hacer excepción',
        ],
        senalesAlerta: [
          'Le perdonó una falta grave (robo, riesgo de salud) por amistad y la ocultó',
        ],
      },
      // Autoconciencia
      {
        texto:
          'Cuéntame de la última vez que alguien a quien coordinabas o con quien trabajabas te dijo que tu forma de dar instrucciones no funcionaba. ¿Qué te dijo, qué hiciste y qué cambió?',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Escuchó sin defenderse de inmediato',
          'Reconoce qué parte era cierta',
          'Da un cambio concreto que hizo',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una decisión que tomaste bajo presión y que después viste que fue equivocada. ¿Qué decidiste, cómo te diste cuenta y qué hiciste después?',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Explica qué lo llevó a decidir mal',
          'Corrigió o reparó el efecto',
          'Cambió su forma de decidir',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez en que perdiste la paciencia con alguien en un momento de mucha carga. ¿Qué pasó, qué hiciste y qué hiciste después?',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reconoce su reacción sin justificarla',
          'Habló después con la persona',
          'Tiene una forma concreta de manejarlo ahora',
        ],
        senalesAlerta: ['Relata haber humillado o agredido a alguien y no lo ve como un problema'],
      },
      {
        texto:
          'Cuéntame de algo que hoy sabes que no haces bien y que te afecta en el trabajo o en tus estudios. ¿Cómo te diste cuenta y qué estás haciendo al respecto?',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Nombra una debilidad real, no una virtud disfrazada',
          'Da un ejemplo concreto de cómo le afecta',
          'Describe lo que hace para mejorar',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Te toca coordinar la línea un sábado y a mitad del servicio te das cuenta de que el reparto de estaciones que hiciste está atorando la plancha. ¿Qué haces?',
        eje: 'autoconciencia',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Reconoce que el error fue suyo',
          'Corrige el reparto en el momento',
          'Lo usa para decidir mejor la próxima vez',
        ],
        senalesAlerta: [],
      },
      // Ética de trabajo
      {
        texto:
          'Cuéntame de la última vez que te quedaste a terminar algo que no era tu obligación porque si no se hacía afectaba al día siguiente. ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe una acción concreta propia',
          'Piensa en el efecto sobre el siguiente turno',
          'Lo hizo sin descuidar lo suyo',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez en que tuviste que sacar adelante una tarea con menos gente o menos recursos de los necesarios. ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Priorizó lo importante',
          'Organizó a los demás o se puso a trabajar',
          'No sacrificó lo de seguridad para cumplir',
        ],
        senalesAlerta: [
          'Relata haber saltado una regla de higiene o seguridad para terminar y lo cuenta como logro',
        ],
      },
      {
        texto:
          'Cuéntame de la última vez que revisaste con cuidado el trabajo de otros aunque confiabas en ellos. ¿Qué revisaste, qué encontraste y qué hiciste?',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Revisa de forma constante, no sólo cuando hay problema',
          'Encontró algo y lo corrigió',
          'Explica el valor de revisar',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez en que se te pasó algo que te tocaba revisar y eso tuvo consecuencias. ¿Qué pasó, qué hiciste y qué cambiaste?',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo reconoce con detalle',
          'Reparó el efecto',
          'Implementó un control nuevo (lista, horario de revisión)',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Son las 11:30 de la noche, el servicio terminó y el equipo quiere irse. Falta el conteo de proteínas para el pedido de mañana y la bitácora de temperaturas del día está a medias. ¿Qué haces?',
        eje: 'etica_trabajo',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Hace o asigna el conteo y completa la bitácora sólo con mediciones que toma ahora; lo que no se midió queda anotado como no medido',
          'Reparte el cierre para terminar rápido',
          'No inventa los datos que faltan',
        ],
        senalesAlerta: ['Llena la bitácora de temperaturas con valores que no midió'],
      },
      // Empatía
      {
        texto:
          'Cuéntame de la última vez que notaste que alguien de tu equipo o de tu familia rendía menos de lo normal. ¿Qué notaste, qué hiciste y cómo terminó?',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Se acercó a preguntar antes de juzgar',
          'Ofreció un apoyo concreto',
          'Mantuvo la exigencia con respeto',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez en que tuviste que darle una mala noticia o una corrección fuerte a alguien. ¿Qué pasó, cómo lo hiciste y cómo terminó?',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo hizo en privado',
          'Fue claro sobre el hecho y el cambio esperado',
          'Cuidó la dignidad de la persona',
        ],
        senalesAlerta: ['Relata haberlo exhibido o humillado frente a otros'],
      },
      {
        texto:
          'Cuéntame de la última vez que dos personas a tu alrededor estaban en conflicto y te tocó intervenir. ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Escuchó a las dos partes',
          'Se basó en hechos',
          'Llegaron a un acuerdo que se cumplió',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez en que alguien que sabía menos que tú te cuestionó o te propuso otra forma de hacer algo. ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo escuchó en serio',
          'Reconoce si la idea tenía valor',
          'Respondió con respeto aunque no la adoptara',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Un cocinero con años en la casa, mayor que tú, no acepta tus indicaciones en la línea y frente a los demás dice que «él no recibe órdenes del segundo». ¿Qué haces?',
        eje: 'empatia',
        tipo: 'hipotetica',
        senalesPositivas: [
          'No se engancha en público y mantiene el servicio',
          'Habla con él en privado, reconociendo su experiencia',
          'Deja claro el papel de cada uno y escala si persiste',
        ],
        senalesAlerta: [],
      },
      // Curiosidad (sin alertas)
      {
        texto:
          'Cuéntame de la última vez que investigaste la causa de un problema que se repetía, en vez de sólo resolverlo cada vez. ¿Qué era, qué hiciste y qué encontraste?',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Buscó datos o probó hipótesis',
          'Encontró una causa concreta',
          'Cambió algo y vio el resultado',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de algo que aprendiste de otra persona, de otro lugar o de otra forma de trabajar y que luego aplicaste. ¿Qué fue y cómo lo aplicaste?',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe el aprendizaje con detalle',
          'Lo adaptó a su contexto',
          'Explica el resultado',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que usaste números o registros (cuentas, tiempos, cantidades) para decidir algo. ¿Qué miraste, qué decidiste y cómo te fue?',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Nombra el dato concreto',
          'Relaciona el dato con la decisión',
          'Revisó después si funcionó',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de algo nuevo que aprendiste en el último año por iniciativa propia. ¿Qué fue, cómo lo aprendiste y para qué te ha servido?',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Algo concreto',
          'Método de aprendizaje claro',
          'Uso práctico',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'La merma de cocina sube tres semanas seguidas y nadie sabe por qué. El Encargado te pide que lo averigües. ¿Qué haces?',
        eje: 'inteligencia_curiosa',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Revisa los registros por producto, estación y turno',
          'Observa la operación y pregunta al equipo',
          'Propone una prueba o cambio y lo mide',
        ],
        senalesAlerta: [],
      },
      // Optimismo (sin alertas)
      {
        texto:
          'Cuéntame de la última vez que a tu equipo o a tu grupo le salió algo muy mal. ¿Qué pasó, qué hiciste tú y cómo quedaron después?',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Ayudó a que el grupo se recuperara',
          'Se enfocó en lo que se podía hacer',
          'Sacaron un aprendizaje',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez en que reconociste en público el trabajo de alguien. ¿Qué había hecho, cómo lo reconociste y qué efecto tuvo?',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reconocimiento concreto y específico',
          'Nota el efecto en la persona o en el equipo',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que una situación te parecía perdida y aun así seguiste intentando. ¿Qué pasó, qué hiciste y cómo terminó?',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Persistió con un plan',
          'Mantuvo el ánimo sin negar la realidad',
          'Aprende del resultado, sea cual sea',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez en que ayudaste a alguien a mejorar en algo sin que fuera tu obligación. ¿Qué hiciste y qué pasó con esa persona?',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Ayuda concreta y sostenida',
          'Le importa el avance de la otra persona',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cierras un viernes en el que se descompuso la cámara, hubo dos quejas por tiempos y el equipo terminó agotado y de malas. Mañana vuelven a abrir juntos. ¿Qué haces?',
        eje: 'optimismo_bondadoso',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Reconoce el esfuerzo del equipo',
          'Habla de lo que se va a corregir mañana',
          'Cuida el ánimo sin minimizar lo que pasó',
        ],
        senalesAlerta: [],
      },
    ],
  },
}
