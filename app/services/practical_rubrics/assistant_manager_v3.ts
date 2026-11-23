import type { PreguntaRubrica } from '#services/practical_rubrics/assistant_manager'
import { RUBRICA_SUBGERENTE_V2 } from '#services/practical_rubrics/assistant_manager_v2'

// Rúbrica v3 del práctico de Subgerente (2026-11-15), para el banco v3.
//
// Escrita ANTES de calificar con ella. Reescribe las ocho preguntas que en la
// v2 seguían dando pistas (2, 4, 5, 6, 7, 8, 10, 11); 1, 3, 9 y 12 quedan
// como en la v2. Los indispensables son los de la v1 (documento de diseño:
// checklists, arqueo, asignación, incidentes del turno); no se inventan.
//
// Cómo se escribe cada elemento: UNA acción verificable. Lo que va entre
// paréntesis son alternativas — basta una —, no requisitos acumulados.
//
// Escalar al gerente (criterio PROVISIONAL, pendiente de los operadores):
// merece crédito cuando el elemento lo pide (excede su autorización, riesgo,
// posible fraude, sanción a un empleado, cliente que insiste tras ofrecerle
// solución). No sustituye una tarea propia del turno: "se lo paso al gerente"
// no cubre una sección, no cuenta un fondo ni ordena comandas.

const V3: Record<number, PreguntaRubrica> = {
  2: {
    q: 2,
    dimension: 'personal',
    evalua: 'Repartir al equipo con criterio y comprobar el reparto durante el turno',
    tareaReal: 'Asignación de secciones (Manual: secciones, capitanes y meseros)',
    indispensable: true,
    esenciales: [
      {
        id: 'nuevos',
        texto:
          'Pone a los meseros nuevos con apoyo (junto a alguien con experiencia, con menos mesas o bajo un capitán)',
      },
      {
        id: 'carga',
        texto:
          'Equilibra la carga entre zonas (mesas o cubiertos) y cuida al que viene de doblar turno (menos mesas o un descanso)',
      },
      {
        id: 'rotacion',
        texto:
          'Decide la terraza por un criterio justo (rotación o carga), no por la preferencia del mesero',
      },
      {
        id: 'reserva',
        texto: 'Asigna responsable y apoyo para la reserva de 20',
      },
      {
        id: 'verifica',
        texto:
          'A mitad del turno revisa una señal concreta (mesas o cubiertos por mesero, tiempos, quejas) y redistribuye si hace falta',
      },
    ],
    minimoCorrecta: 4,
    alternativasValidas: [
      'Darle la terraza al mejor vendedor si lo justifica por la carga o la reserva y lo compensa con rotación',
    ],
    erroresCriticos: [
      {
        id: 'favoritismo',
        texto: 'Asigna las mejores zonas por amistad o porque el mesero lo pide, sin otro criterio',
      },
      {
        id: 'nuevos_solos',
        texto: 'Deja a los meseros nuevos solos con la reserva de 20 o con la zona más cargada',
      },
    ],
  },
  4: {
    q: 4,
    dimension: 'clientes',
    evalua: 'Cliente molesto que exige al dueño: atender, resolver y escalar a tiempo',
    tareaReal: 'Manejo de quejas (Manual: el responsable del turno atiende primero)',
    indispensable: true,
    esenciales: [
      {
        id: 'escucha',
        texto: 'Se presenta como responsable del turno y escucha la queja sin discutir',
      },
      {
        id: 'resuelve',
        texto:
          'Resuelve él mismo el problema de fondo: confirma con cocina y hace salir el platillo con un tiempo real (o acuerda con la familia otra solución que acepten)',
      },
      {
        id: 'compensa',
        texto: 'Ofrece una compensación proporcional dentro de la política (o dice que la consulta)',
      },
      {
        id: 'escala',
        texto:
          'Llama al gerente si el cliente sigue pidiéndolo después de atenderlo o si lo que pide excede su autorización',
      },
    ],
    minimoCorrecta: 3,
    alternativasValidas: [
      'Avisar al gerente desde el principio MIENTRAS él mismo atiende y resuelve',
    ],
    erroresCriticos: [
      { id: 'miente', texto: 'Dice ser el dueño, inventa que no hay a quién llamar o culpa a cocina frente al cliente' },
      {
        id: 'promete',
        texto: 'Promete algo fuera de política sin autorización (cuenta gratis completa, reembolso)',
      },
    ],
  },
  5: {
    q: 5,
    dimension: 'personal',
    evalua: 'Cubrir a una mesera que se va a mitad del turno sin dejar mesas ni cuentas sueltas',
    tareaReal: 'Cobertura de personal durante el turno',
    indispensable: false,
    esenciales: [
      {
        id: 'reasigna',
        texto: 'Reasigna sus cinco mesas a personas concretas (o las toma él mismo)',
      },
      {
        id: 'cuentas',
        texto:
          'Pasa sus cuentas abiertas a un responsable concreto (en el sistema o con otro relevo verificable, con los saldos confirmados)',
      },
      {
        id: 'cobro',
        texto: 'Cobra (o asigna quién cobra) las dos mesas que pidieron la cuenta',
      },
      {
        id: 'mesas',
        texto: 'Avisa a las mesas del cambio o comprueba que ninguna quede sin atender',
      },
      {
        id: 'persona',
        texto: 'Atiende a la mesera: que se vaya segura o acompañada (o pide ayuda médica si es grave)',
      },
      {
        id: 'registro',
        texto:
          'Registra su salida (hora, propinas que le tocan) o informa al gerente para el seguimiento',
      },
    ],
    minimoCorrecta: 4,
    alternativasValidas: ['Pedirle que termine de cobrar sus dos cuentas si puede hacerlo sin riesgo'],
    erroresCriticos: [
      { id: 'mesas_sueltas', texto: 'Deja mesas o cuentas sin responsable' },
      {
        id: 'castiga',
        texto: 'La obliga a quedarse estando enferma o le quita las propinas que ya ganó',
      },
    ],
  },
  6: {
    q: 6,
    dimension: 'caja_controles',
    evalua: 'Recibir la caja con un sobrante y un voucher faltante antes de que se vaya quien entrega',
    tareaReal: 'Recepción de caja entre turnos (indispensable: arqueo)',
    indispensable: true,
    esenciales: [
      {
        id: 'cuenta_con',
        texto: 'Cuenta con quien entrega antes de que se vaya (o con un testigo)',
      },
      {
        id: 'sobrante',
        texto:
          'Trata los $200 de más como diferencia: busca la causa (cambio mal dado, venta sin capturar) y no los usa para cuadrar nada',
      },
      {
        id: 'voucher',
        texto: 'Busca el voucher de $850 o confirma la venta en el cierre de la terminal',
      },
      {
        id: 'constancia',
        texto: 'Deja constancia firmada de lo que recibió, con las dos diferencias',
      },
      { id: 'reporta', texto: 'Reporta las diferencias al gerente' },
    ],
    minimoCorrecta: 4,
    alternativasValidas: ['Pedir que la persona espere o llamarla para aclarar, si ya se fue'],
    erroresCriticos: [
      {
        id: 'tapa',
        texto: 'Se queda el sobrante, lo usa para cubrir otra diferencia o dice que no lo va a reportar',
      },
      {
        id: 'firma_completo',
        texto: 'Recibe sin contar o firma que la caja está completa',
      },
    ],
  },
  7: {
    q: 7,
    dimension: 'caja_controles',
    evalua: 'Decidir cortesías proporcionales a la falla, dentro de la política, y escalar lo que excede',
    tareaReal: 'Cortesías y descuentos (Manual: tope por puesto)',
    indispensable: false,
    esenciales: [
      {
        id: 'crudo',
        texto: 'Corte crudo: lo repone o lo corrige de inmediato y, si procede, compensa',
      },
      {
        id: 'cumple',
        texto:
          'Cumpleaños: ofrece lo que la política permite (postre, detalle), no un descuento por ser conocido',
      },
      {
        id: 'demora',
        texto:
          'Mesa de 6: compensa en proporción a la falla y, si piden no pagar nada, lo escala al gerente en lugar de concederlo',
      },
      {
        id: 'politica',
        texto: 'Se apega al tope o a la política del restaurante (o la consulta, sin inventarla)',
      },
      {
        id: 'registra',
        texto: 'Registra las cortesías en el sistema con motivo o autorización',
      },
    ],
    minimoCorrecta: 4,
    // Revisión de Codex r3: la pregunta pide «qué haces en cada caso»; sin
    // atender los tres casos no hay «correcta» (política y registro no
    // compensan un caso omitido).
    nucleo: ['crudo', 'cumple', 'demora'],
    alternativasValidas: ['No cobrar el platillo de la mesa de 6 que tardó, dentro de su tope'],
    erroresCriticos: [
      { id: 'amigos', texto: 'Hace el descuento al cliente frecuente por ser conocido, sin política' },
      {
        id: 'sin_tope',
        texto: 'Concede por su cuenta la cuenta completa gratis, o dice que da cortesías sin registrarlas',
      },
    ],
  },
  8: {
    q: 8,
    dimension: 'operacion',
    evalua: 'Decidir si se acepta un grupo grande con capacidad limitada, y comunicarlo con honestidad',
    tareaReal: 'Control de entrada en horario pico',
    indispensable: false,
    esenciales: [
      {
        id: 'capacidad',
        texto: 'Evalúa la capacidad real (mesas, personal y cocina) antes de decidir',
      },
      { id: 'cocina', texto: 'Consulta a cocina cuánto tardaría una orden de 15' },
      {
        id: 'decision',
        texto:
          'Le da al grupo una decisión clara con opciones honestas (tiempo real de espera, dividirlos, menú limitado, otra hora o declinar)',
      },
      {
        id: 'equipo',
        texto:
          'Si los acepta, dice quién los atiende y con qué apoyo; si los declina o los hace esperar, cuida a las mesas que ya están (y a la espera le da un tiempo actualizado)',
      },
    ],
    minimoCorrecta: 3,
    alternativasValidas: ['Declinar con amabilidad y ofrecer reservar otro día'],
    erroresCriticos: [
      {
        id: 'acepta_por_gasto',
        texto:
          'Los acepta por lo que prometen gastar sin tener capacidad, o les promete un tiempo que cocina no puede cumplir',
      },
    ],
  },
  10: {
    q: 10,
    dimension: 'clientes',
    evalua: 'Cliente en estado de ebriedad: cortar el alcohol con discreción y proteger a los demás',
    tareaReal: 'Servicio responsable de alcohol',
    indispensable: true,
    esenciales: [
      { id: 'discrecion', texto: 'Se acerca con discreción y respeto, sin exhibirlo' },
      { id: 'no_ronda', texto: 'No sirve la ronda (corta el alcohol)' },
      { id: 'ofrece', texto: 'Le ofrece otra cosa (agua, comida, café)' },
      {
        id: 'vecinos',
        texto: 'Atiende a la mesa que se quejó (la escucha, la reubica o le da seguimiento)',
      },
      {
        id: 'escala',
        texto: 'Escala a seguridad o al gerente si se pone agresivo o no coopera',
      },
      { id: 'transporte', texto: 'Ofrece o gestiona un transporte seguro' },
    ],
    minimoCorrecta: 4,
    nucleo: ['no_ronda'],
    alternativasValidas: ['Hablar primero con un acompañante sobrio de la mesa'],
    erroresCriticos: [
      { id: 'sirve', texto: 'Le sirve la ronda (o más alcohol)' },
      { id: 'exhibe', texto: 'Lo confronta o exhibe frente a otros, o usa la fuerza' },
    ],
  },
  11: {
    q: 11,
    dimension: 'operacion',
    evalua: 'Cocina atrasada: coordinar con el chef, corregir lo que se le dice al cliente y mover al piso',
    tareaReal: 'Coordinación cocina–piso',
    indispensable: false,
    esenciales: [
      {
        id: 'chef',
        texto:
          'Va con el chef por un tiempo real o prioridades (o quita platillos lentos, o pausa entradas)',
      },
      {
        id: 'mesero',
        texto: 'Corrige al mesero: que deje de decir "ya sale" y dé el tiempo real',
      },
      {
        id: 'clientes',
        texto:
          'Informa a las mesas afectadas con honestidad (puede ofrecer algo dentro de la política)',
      },
      {
        id: 'piso',
        texto: 'Pone al piso a apoyar (correr platos, revisar mesas o controlar nuevas comandas)',
      },
    ],
    minimoCorrecta: 3,
    alternativasValidas: ['Ir él mismo a las mesas que se quejaron'],
    erroresCriticos: [
      {
        id: 'miente',
        texto: 'Sigue o propone diciendo "ya sale" sin saberlo, o culpa a cocina frente al cliente',
      },
    ],
  },
}

export const RUBRICA_SUBGERENTE_V3: PreguntaRubrica[] = RUBRICA_SUBGERENTE_V2.map(
  (p) => V3[p.q] ?? p
)
