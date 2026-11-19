// Rúbrica del examen práctico de Subgerente (v1.1, 2026-10-29).
//
// v1.1: en la pregunta 7, "sin tope" cuenta explícitamente como fuera de
// política (hallazgo de los casos de control H1–H6; se valida con casos nuevos).
//
// Escrita ANTES de ejecutar el calificador nuevo. Fuente de las tareas: Manual
// de Subgerente de La Llorona (apoya al Gerente, supervisa al equipo del turno,
// revisa indicadores, cuida asistencia) y el documento de diseño "Evaluación
// por puesto" (indispensables de Subgerente: checklists, arqueo, asignación,
// incidentes del turno). Estado: PROPUESTA; los pesos y elementos los valida un
// operador antes de usarse para decidir.
//
// Cómo se califica (reglas fijas, el modelo no decide el total):
// - El modelo sólo señala, por elemento, si la respuesta lo contiene y con qué
//   cita textual. La cita se verifica contra la respuesta; sin cita, no cuenta.
// - Estado por pregunta: vacía · no sabe · incorrecta · parcial · correcta ·
//   error crítico. "No sé" es una respuesta honesta, pero no demuestra
//   conocimiento: vale 0 igual que una incorrecta, y se reporta aparte.
// - Puntos por pregunta = min(1, elementos esenciales encontrados / mínimo para
//   "correcta"). Un error crítico deja la pregunta en 0.
// - Dimensión = promedio de sus preguntas. Total = suma ponderada.
// - No cuentan: longitud, vocabulario, ni experiencia declarada sin el
//   conocimiento ("tengo 5 años haciendo cortes" no es un procedimiento).

export type Elemento = { id: string; texto: string }
export type PreguntaRubrica = {
  q: number
  dimension: DimensionId
  evalua: string
  tareaReal: string
  indispensable: boolean
  esenciales: Elemento[]
  // Cuántos esenciales bastan para "correcta".
  minimoCorrecta: number
  // Ids de esenciales sin los cuales no hay "correcta" (opcional).
  nucleo?: string[]
  alternativasValidas: string[]
  erroresCriticos: Elemento[]
}

export type DimensionId =
  | 'apertura_cierre'
  | 'caja_controles'
  | 'personal'
  | 'operacion'
  | 'clientes'

export const DIMENSIONES: Record<DimensionId, { nombre: string; peso: number }> = {
  caja_controles: { nombre: 'Caja y controles', peso: 30 },
  apertura_cierre: { nombre: 'Apertura y cierre', peso: 20 },
  personal: { nombre: 'Personal del turno', peso: 20 },
  operacion: { nombre: 'Operación en vivo', peso: 15 },
  clientes: { nombre: 'Clientes e incidentes', peso: 15 },
}

export const RUBRICA_SUBGERENTE: PreguntaRubrica[] = [
  {
    q: 1,
    dimension: 'apertura_cierre',
    evalua: 'Checklist de apertura completo y en orden',
    tareaReal: 'Abrir el turno (indispensable: checklists)',
    indispensable: true,
    esenciales: [
      {
        id: 'personal',
        texto: 'Revisa al personal: asistencia, uniforme o junta/briefing del turno',
      },
      { id: 'montaje', texto: 'Verifica montaje y limpieza de salón, mesas, baños o estaciones' },
      { id: 'insumos', texto: 'Revisa insumos o faltantes de cocina y barra antes de abrir' },
      {
        id: 'caja',
        texto: 'Abre caja: cuenta o verifica el fondo y que el POS o la terminal funcionen',
      },
      { id: 'comunicacion', texto: 'Se comunica con cocina y bar: agotados, especiales o tiempos' },
    ],
    minimoCorrecta: 4,
    alternativasValidas: [
      'Cualquier orden razonable; el briefing puede cubrir comunicación y personal a la vez',
    ],
    erroresCriticos: [],
  },
  {
    q: 2,
    dimension: 'personal',
    evalua: 'Criterios para asignar secciones, capitanes y meseros',
    tareaReal: 'Asignar al equipo del turno (indispensable: asignación)',
    indispensable: true,
    esenciales: [
      { id: 'capacidad', texto: 'Asigna según experiencia o capacidad de cada persona' },
      {
        id: 'carga',
        texto:
          'Equilibra la carga (número de mesas o cubiertos) o rota de forma justa entre turnos',
      },
      { id: 'reservas', texto: 'Considera reservas, grupos o zonas especiales al asignar' },
      {
        id: 'apoyo',
        texto: 'Prevé apoyo: capitán por zona, cobertura de descansos o refuerzo en pico',
      },
    ],
    minimoCorrecta: 3,
    alternativasValidas: [
      'Asignar por ventas del mesero, siempre que no deje la carga desequilibrada',
    ],
    erroresCriticos: [
      {
        id: 'favoritismo',
        texto: 'Asigna las mejores secciones por amistad o favoritismo declarado',
      },
    ],
  },
  {
    q: 3,
    dimension: 'operacion',
    evalua: 'Qué indicadores vigila en vivo y para qué',
    tareaReal: 'Revisar indicadores del turno (Manual: "revisa indicadores clave")',
    indispensable: false,
    esenciales: [
      {
        id: 'tres_metricas',
        texto:
          'Nombra al menos tres indicadores pertinentes (venta o ticket promedio, tiempos de cocina, espera o rotación de mesas, cubiertos, quejas, cortesías o cancelaciones, propina)',
      },
      {
        id: 'para_que',
        texto: 'Explica qué decisión toma o qué detecta con cada indicador, no sólo los lista',
      },
      {
        id: 'tiempo',
        texto: 'Incluye al menos un indicador de tiempo de servicio (cocina, espera o mesa)',
      },
    ],
    minimoCorrecta: 3,
    alternativasValidas: ['Otros indicadores operativos razonables si explica su uso'],
    erroresCriticos: [],
  },
  {
    q: 4,
    dimension: 'clientes',
    evalua: 'Cliente que exige al dueño: atender, resolver y escalar',
    tareaReal: 'Incidentes con clientes (indispensable: incidentes del turno)',
    indispensable: true,
    esenciales: [
      {
        id: 'escucha',
        texto: 'Se presenta como responsable del turno y escucha o entiende la queja',
      },
      { id: 'solucion', texto: 'Ofrece una solución dentro de sus facultades o de la política' },
      {
        id: 'escala',
        texto:
          'Tiene un criterio claro para llamar al gerente (excede sus facultades, sigue molesto o es grave)',
      },
    ],
    minimoCorrecta: 3,
    alternativasValidas: ['Llamar al gerente de inmediato si la queja es grave (seguridad, salud)'],
    erroresCriticos: [
      { id: 'miente', texto: 'Miente: dice ser el dueño o inventa que no hay a quién escalar' },
      {
        id: 'promete',
        texto:
          'Promete algo fuera de política sin autorización (cuenta gratis completa, reembolso)',
      },
    ],
  },
  {
    q: 5,
    dimension: 'personal',
    evalua: 'Cubrir a un mesero clave que no llegó',
    tareaReal: 'Asistencia y cobertura del turno',
    indispensable: false,
    esenciales: [
      {
        id: 'localiza',
        texto: 'Intenta localizarlo (llamada, mensaje o contacto) y registra la falta',
      },
      {
        id: 'cobertura',
        texto: 'Busca cobertura: alguien de descanso, turno extra o apoyo de otra área',
      },
      {
        id: 'redistribuye',
        texto:
          'Redistribuye secciones, cierra una zona o ajusta reservas según el personal que hay',
      },
      { id: 'informa', texto: 'Informa al gerente o deja registro para el seguimiento' },
    ],
    minimoCorrecta: 3,
    alternativasValidas: ['Que el capitán o el propio subgerente cubra la sección'],
    erroresCriticos: [
      { id: 'sin_cubrir', texto: 'Deja la sección sin atender o abre sin reasignarla' },
    ],
  },
  {
    q: 6,
    dimension: 'caja_controles',
    evalua: 'Verificar el corte del turno anterior y qué hacer ante un faltante',
    tareaReal: 'Caja del turno (indispensable: arqueo)',
    indispensable: true,
    esenciales: [
      {
        id: 'cuenta_compara',
        texto:
          'Cuenta el efectivo o el fondo y lo compara contra el corte o reporte del POS (esperado = fondo + ventas en efectivo − retiros)',
      },
      {
        id: 'concilia',
        texto:
          'Concilia tarjetas o terminal y comprobantes (vouchers, retiros o gastos documentados)',
      },
      {
        id: 'faltante',
        texto:
          'Ante un faltante: recuenta o revisa movimientos, lo documenta y lo reporta al gerente antes de seguir',
      },
    ],
    minimoCorrecta: 3,
    alternativasValidas: ['Firmas de quien entrega y recibe; arqueo con testigo'],
    erroresCriticos: [
      {
        id: 'tapa',
        texto: 'Cubre o "tapa" el faltante (con su dinero, el de otro turno o no reportándolo)',
      },
      { id: 'descuenta', texto: 'Descuenta el faltante del sueldo de alguien por decisión propia' },
    ],
  },
  {
    q: 7,
    dimension: 'caja_controles',
    evalua: 'Criterio y límites para cortesías y descuentos',
    tareaReal: 'Cortesías dentro de facultades',
    indispensable: false,
    esenciales: [
      {
        id: 'politica',
        texto:
          'Se apega a una política o tope autorizado (o lo consulta si no lo conoce, sin inventarlo)',
      },
      { id: 'registra', texto: 'Registra la cortesía en el POS con motivo o autorización' },
      {
        id: 'ejemplos',
        texto:
          'Da ejemplos concretos y proporcionales (error del restaurante, espera larga, platillo devuelto)',
      },
      { id: 'escala', texto: 'Escala al gerente lo que excede su tope' },
    ],
    minimoCorrecta: 3,
    alternativasValidas: [
      'Un tope en pesos o en porcentaje; cualquiera es válido si es explícito o consultado',
    ],
    erroresCriticos: [
      { id: 'amigos', texto: 'Da cortesías o descuentos a amigos o conocidos' },
      {
        id: 'sin_registro',
        texto:
          'Las da sin registrarlas, fuera de política o sin tope ("el que sea necesario") por decisión propia',
      },
    ],
  },
  {
    q: 8,
    dimension: 'operacion',
    evalua: 'Decidir sobre un grupo grande sin reserva en hora pico',
    tareaReal: 'Capacidad y coordinación en vivo',
    indispensable: false,
    esenciales: [
      {
        id: 'capacidad',
        texto: 'Evalúa capacidad real (mesas, personal y cocina) antes de aceptar',
      },
      { id: 'cocina', texto: 'Avisa o consulta a cocina por el impacto en tiempos' },
      {
        id: 'grupo',
        texto:
          'Da al grupo opciones honestas: tiempo de espera, dividir mesas, menú limitado o rechazar con amabilidad',
      },
      { id: 'piso', texto: 'Organiza al equipo de piso: quién atiende y con qué apoyo' },
    ],
    minimoCorrecta: 3,
    alternativasValidas: [
      'Rechazarlos es válido si lo justifica por capacidad y ofrece alternativa',
    ],
    erroresCriticos: [],
  },
  {
    q: 9,
    dimension: 'apertura_cierre',
    evalua: 'Rutina completa de cierre de turno',
    tareaReal: 'Cerrar el turno (indispensable: checklists, arqueo)',
    indispensable: true,
    esenciales: [
      {
        id: 'corte',
        texto: 'Corte de caja: cuenta efectivo, concilia tarjetas o POS y documenta diferencias',
      },
      {
        id: 'propinas',
        texto: 'Cuenta o reparte propinas según la política y lo deja documentado',
      },
      {
        id: 'incidencias',
        texto: 'Reporte de incidencias o bitácora para el gerente o el siguiente turno',
      },
      {
        id: 'cierre_fisico',
        texto: 'Limpieza o cierre de áreas, apagado y seguridad (llaves, gas, puertas)',
      },
    ],
    minimoCorrecta: 3,
    alternativasValidas: ['Inventario o merma básica como parte del cierre'],
    erroresCriticos: [],
  },
  {
    q: 10,
    dimension: 'clientes',
    evalua: 'Cliente en estado inconveniente que molesta a otros',
    tareaReal: 'Servicio responsable de alcohol e incidentes',
    indispensable: true,
    esenciales: [
      { id: 'discrecion', texto: 'Se acerca con discreción y respeto, sin exhibirlo' },
      { id: 'no_alcohol', texto: 'Deja de servirle alcohol u ofrece agua, comida o café' },
      {
        id: 'escala',
        texto:
          'Escala a seguridad o al gerente si hay agresión, riesgo o no coopera; ofrece transporte seguro',
      },
    ],
    minimoCorrecta: 3,
    alternativasValidas: ['Hablar con sus acompañantes para apoyar'],
    erroresCriticos: [
      { id: 'sigue_sirviendo', texto: 'Le sigue sirviendo alcohol' },
      { id: 'humilla', texto: 'Lo confronta o exhibe en público, o usa la fuerza' },
    ],
  },
  {
    q: 11,
    dimension: 'operacion',
    evalua: 'Coordinar cuando cocina va atrasada',
    tareaReal: 'Coordinación piso–cocina',
    indispensable: false,
    esenciales: [
      {
        id: 'chef',
        texto:
          'Coordina con el chef: causa, tiempo real y prioridades (pausar entradas, suspender platillos lentos, ordenar comandas)',
      },
      {
        id: 'cliente',
        texto:
          'Informa a los clientes afectados con honestidad (tiempo estimado) y ofrece algo según la política',
      },
      {
        id: 'piso',
        texto: 'Pone al piso a apoyar: revisar mesas, correr platos, controlar nuevas comandas',
      },
    ],
    minimoCorrecta: 3,
    alternativasValidas: ['Ajustar el ritmo de sentado de mesas nuevas'],
    erroresCriticos: [
      {
        id: 'miente_culpa',
        texto: 'Miente al cliente ("ya sale" sin saberlo) o culpa a cocina frente al cliente',
      },
    ],
  },
  {
    q: 12,
    dimension: 'caja_controles',
    evalua: 'Auditar tickets, cortesías, cancelaciones y dobles cobros',
    tareaReal: 'Control antifraude del turno',
    indispensable: true,
    esenciales: [
      {
        id: 'reportes',
        texto:
          'Revisa en el POS cancelaciones, cortesías, descuentos o reaperturas con su motivo y autorización',
      },
      {
        id: 'cobros',
        texto:
          'Compara cobros contra terminal o vouchers para detectar dobles cobros o diferencias',
      },
      {
        id: 'senales',
        texto:
          'Nombra señales de alerta concretas (cancelar después de cobrar, reaperturas, muchas cortesías de la misma persona, tickets sin firma)',
      },
      {
        id: 'actua',
        texto: 'Al encontrar algo, lo documenta y lo reporta al gerente sin acusar sin evidencia',
      },
    ],
    minimoCorrecta: 3,
    alternativasValidas: ['Muestreo de tickets en lugar de revisión total, si explica cómo elige'],
    erroresCriticos: [
      { id: 'arregla_privado', texto: 'Lo arregla en privado o lo deja pasar sin reportar' },
    ],
  },
]
