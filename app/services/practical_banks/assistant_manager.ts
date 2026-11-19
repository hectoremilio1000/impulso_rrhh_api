import { fingerprintQuestions } from '#services/bank_fingerprint'

// Banco del examen práctico de Subgerente, en el servidor.
//
// v1: el banco que hoy muestra el front (questionBank.ts). Sus preguntas 1, 3,
//     9 y 12 enumeraban en el enunciado los elementos que la rúbrica califica:
//     repetir la pregunta bastaba para sacar "correcta".
// v2 (2026-11-14): esas cuatro se reescriben como situaciones de turno donde
//     hay que decidir qué hacer, en qué orden y cómo comprobarlo. Las otras
//     ocho no cambian.
//
// Las respuestas se califican con la rúbrica del banco con que se
// contestaron (por huella): una respuesta a la v1 nunca se califica como
// respuesta a la v2.

export const BANCO_SUBGERENTE_V1: string[] = [
  'Describe tu checklist completo de apertura de turno: desde que llegas hasta que abres la puerta al primer cliente. Incluye revisión de personal, montaje, insumos, caja, comunicación con cocina y bar.',
  'Explica paso a paso cómo asignas secciones, capitanes y meseros al inicio del turno. ¿Qué criterios usas (experiencia, ventas, descansos, cargas anteriores)?',
  '¿Cuáles son las 5 métricas que vigilas en vivo durante un turno y por qué cada una? (ejemplos: ticket promedio, tiempos de cocina, rotación de mesa, tiempo de espera para sentar, % de propina del turno).',
  'Un cliente exige hablar con “el dueño”. ¿Qué le dices, qué le ofreces y en qué momento decides llamar al gerente real?',
  'Te avisan 30 minutos antes de abrir que un mesero clave no va a llegar y no contesta el teléfono. ¿Qué pasos sigues en orden y cómo cubres su sección?',
  'Explica cómo verificas que el corte de caja del turno anterior cuadra antes de abrir el tuyo. ¿Qué haces si encuentras un faltante?',
  '¿Cómo decides cuándo aplicar una cortesía o descuento y cuál es tu tope sin pedir autorización al gerente? Da 3 ejemplos concretos.',
  'Un viernes te llega un grupo de 15 personas sin reserva en pleno horario pico. ¿Cómo decides si los aceptas, los esperas afuera o los rechazas? ¿Qué le dices a cocina, qué a tu equipo de piso, qué al grupo?',
  'Describe tu rutina completa de cierre de turno: corte de caja, reporte de incidencias, conteo de propinas, limpieza, llaves, comunicación al siguiente turno.',
  'Un cliente lleva 3 horas consumiendo, ya está hablando fuerte y otros comensales empiezan a voltear. ¿Qué haces, qué le dices, cuándo escalas a seguridad?',
  'Cocina está atrasada 15 minutos en cada salida y empiezan a llegar quejas. ¿Cómo coordinas con el chef, qué le dices al cliente y qué hace tu equipo de piso mientras tanto?',
  'Explica cómo auditas tickets, cortesías, cancelaciones y dobles cobros al cierre del turno. ¿Qué señales te dicen que algo huele mal en una cuenta?',
]

export const BANCO_SUBGERENTE_V2: string[] = [
  'Faltan 25 minutos para abrir un viernes. Al llegar te encuentras con esto: un mesero de tu turno no ha llegado y no contesta, la terminal de cobro con tarjeta no enciende, el sobre con el fondo de caja que dejó el turno anterior no tiene firma, y cocina te avisa que no llegó el aguacate. A la 1:15 llega una reserva de 12 personas. ¿Qué haces, en qué orden y cómo compruebas que cada cosa quedó resuelta antes de abrir la puerta?',
  BANCO_SUBGERENTE_V1[1],
  'Son las 9 de la noche de un viernes y en el sistema ves: los platillos tardan 28 minutos en salir de cocina (lo normal es 15), hay 9 mesas que ya pidieron la cuenta, la espera para sentar va en 25 minutos y en la última hora se cancelaron 3 platillos por demora. El ticket promedio está igual que siempre. ¿Qué atiendes primero, qué decides y qué número revisarías 20 minutos después para saber si funcionó?',
  BANCO_SUBGERENTE_V1[3],
  BANCO_SUBGERENTE_V1[4],
  BANCO_SUBGERENTE_V1[5],
  BANCO_SUBGERENTE_V1[6],
  BANCO_SUBGERENTE_V1[7],
  'Al cerrar tu turno: el corte del sistema dice que debe haber $14,350 en efectivo y tú cuentas $14,050; encuentras una cortesía de $600 registrada sin autorización; un mesero quiere irse antes de que se repartan las propinas; y mañana el turno de la mañana abre sin el gerente. ¿Qué haces, en qué orden y qué dejas por escrito?',
  BANCO_SUBGERENTE_V1[9],
  BANCO_SUBGERENTE_V1[10],
  'Revisando el turno encuentras: un mesero tiene 6 cancelaciones hechas después de cobrar (los demás tienen 0 o 1), la mesa 8 tiene dos cobros con tarjeta del mismo monto con un minuto de diferencia, y hay 4 cortesías marcadas como “cliente frecuente” sin autorización. ¿Qué revisas para confirmar cada cosa, qué haces y a quién se lo dices?',
]

// v3 (2026-11-15): las ocho preguntas restantes también daban pistas (listaban
//     criterios o pedían "qué le dices a cocina, qué al piso, qué al grupo").
//     Se reescriben como situaciones; 1, 3, 9 y 12 quedan como en la v2.
export const BANCO_SUBGERENTE_V3: string[] = [
  BANCO_SUBGERENTE_V2[0],
  'Es sábado y abres con 7 meseros: dos entraron esta semana, uno viene de doblar turno y tu mejor vendedor te pide otra vez la terraza. A las 3 llega una reserva de 20 personas y el salón tiene tres zonas de distinto tamaño. ¿Cómo repartes al equipo y cómo sabrás a mitad del turno si el reparto funcionó?',
  BANCO_SUBGERENTE_V2[2],
  'Una familia lleva 40 minutos esperando un platillo porque su comanda se perdió. El papá está molesto, levanta la voz y te dice: "Quiero hablar con el dueño ahora mismo". El dueño no está y el gerente está en una junta en la oficina. ¿Qué haces y qué le dices?',
  'A las 3:30, en lo más fuerte de la comida, una mesera se siente mal y tiene que irse. Tiene cinco mesas: dos ya pidieron la cuenta, una acaba de ordenar y dos están en el postre. ¿Qué haces?',
  'Recibes la caja del turno de la mañana. El reporte dice que debe haber $8,200 en efectivo y tú cuentas $8,400. Además falta el voucher de una venta con tarjeta de $850, y la persona que te entrega ya se está yendo. ¿Qué haces antes de empezar tu turno?',
  'En una misma noche: a una mesa le llegó un corte de carne crudo y lo devolvió; un cliente frecuente te pide que le "hagas algo" en la cuenta porque es su cumpleaños; y una mesa de 6 esperó 50 minutos su comida porque cocina perdió la comanda, y pide que no le cobren nada. ¿Qué haces en cada caso?',
  'Viernes, 9 de la noche: el salón está al 90 %, cocina va en 20 minutos por platillo y quedan dos mesas libres de cuatro. Llega un grupo de 15 personas sin reserva y el organizador te asegura que van a gastar bien. ¿Qué decides y cómo lo comunicas?',
  BANCO_SUBGERENTE_V2[8],
  'Un cliente lleva tres horas tomando, ya habla muy fuerte, tiró una copa y le pide al mesero otra ronda de tequilas para su mesa. La mesa de al lado ya se quejó. ¿Qué haces?',
  'A cocina le falta un cocinero hoy y los platillos salen con 15 minutos de retraso. Tres mesas ya se quejaron y el mesero de la sección 2 le dice a todos "ya sale". ¿Qué haces?',
  BANCO_SUBGERENTE_V2[11],
]

export const BANCOS_SUBGERENTE = {
  v1: {
    version: 'banco_subgerente_v1',
    preguntas: BANCO_SUBGERENTE_V1,
    huella: fingerprintQuestions(BANCO_SUBGERENTE_V1),
  },
  v2: {
    version: 'banco_subgerente_v2',
    preguntas: BANCO_SUBGERENTE_V2,
    huella: fingerprintQuestions(BANCO_SUBGERENTE_V2),
  },
  v3: {
    version: 'banco_subgerente_v3',
    preguntas: BANCO_SUBGERENTE_V3,
    huella: fingerprintQuestions(BANCO_SUBGERENTE_V3),
  },
} as const

export type BancoSubgerente = (typeof BANCOS_SUBGERENTE)[keyof typeof BANCOS_SUBGERENTE]

/** Banco con que se contestó (por huella de las preguntas guardadas), o null. */
export function bancoPorHuella(huella: string | null): BancoSubgerente | null {
  if (!huella) return null
  return Object.values(BANCOS_SUBGERENTE).find((b) => b.huella === huella) ?? null
}
