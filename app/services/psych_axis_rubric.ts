// app/services/psych_axis_rubric.ts
//
// Rúbrica con anclas CONCRETAS por competencia (0-100).
//
// Por qué existe: el prompt monolítico pedía los 7 ejes de golpe y sólo daba
// definiciones abstractas ("mide la integridad"). Sin anclas, el modelo no
// tiene contra qué comparar y colapsa: o mete 0 a todo alegando "respuesta
// insuficiente" (bug 2026-07-20, 36 exámenes afectados), o pone 50 parejo.
//
// Cada nivel trae ejemplos de lo que se DICE en una respuesta de ese nivel,
// no adjetivos. El modelo compara texto contra texto.

import type { EjeGuidara } from '#services/psych_question_tags'

export type AnclaRubrica = {
  rango: string
  titulo: string
  senales: string[]
}

export type RubricaEje = {
  labelEs: string
  queMide: string
  anclas: AnclaRubrica[]
  /** Trampas típicas: respuestas que suenan bien pero no son evidencia. */
  noCuenta: string[]
}

export const RUBRICAS: Record<EjeGuidara, RubricaEje> = {
  integridad: {
    labelEs: 'Integridad',
    queMide:
      'Si hace lo correcto cuando nadie lo ve y cuando le cuesta algo: manejo de dinero, cortesías, errores propios, presión de un compañero o de un cliente.',
    anclas: [
      {
        rango: '0-40',
        titulo: 'BAJA',
        senales: [
          'Justifica quedarse con algo que no es suyo, o "lo comento con nadie".',
          'Encubre a un compañero que roba o que se lleva producto.',
          'Aplica cortesías o descuentos por su cuenta sin autorización ni registro.',
          'Ante un error propio, culpa al sistema, a cocina o al cliente.',
          'Responde con evasivas al tema de dinero: "eso lo ve el gerente".',
        ],
      },
      {
        rango: '41-70',
        titulo: 'MEDIA',
        senales: [
          'Dice que reportaría, pero sin decir a quién ni cómo.',
          'Reconoce el error pero sólo cuando ya lo cacharon.',
          'Sabe que hay una regla pero no la describe ("hay un protocolo").',
          'Condiciona el actuar correcto a que sea grave: "si es mucho dinero sí aviso".',
        ],
      },
      {
        rango: '71-100',
        titulo: 'ALTA',
        senales: [
          'Describe el procedimiento concreto: a quién avisa, qué registra, en qué momento.',
          'Se hace responsable del error antes de que se lo señalen y dice cómo lo repara.',
          'Sostiene la regla aunque le cueste con un compañero o con un cliente molesto.',
          'Distingue entre lo que puede autorizar él y lo que debe escalar.',
        ],
      },
    ],
    noCuenta: [
      '"Soy una persona honesta", "siempre hago lo correcto" — afirmación sobre sí mismo sin conducta descrita.',
    ],
  },

  autoconciencia: {
    labelEs: 'Autoconciencia',
    queMide:
      'Si se conoce: reconoce sus límites, cómo reacciona bajo presión, qué le falta aprender, y cómo recibe una corrección.',
    anclas: [
      {
        rango: '0-40',
        titulo: 'BAJA',
        senales: [
          'Dice que no tiene defectos, o convierte el defecto en virtud ("soy muy perfeccionista").',
          'Ante una corrección, se defiende o descalifica a quien lo corrige.',
          'No identifica ninguna situación que lo rebase.',
          'Atribuye todos sus errores a factores externos.',
        ],
      },
      {
        rango: '41-70',
        titulo: 'MEDIA',
        senales: [
          'Nombra una debilidad genérica sin ejemplo ("a veces me estreso").',
          'Acepta la corrección pero no dice qué hizo distinto después.',
          'Reconoce que se enoja pero no describe cómo lo maneja.',
        ],
      },
      {
        rango: '71-100',
        titulo: 'ALTA',
        senales: [
          'Nombra una debilidad concreta CON el ejemplo y qué hace para compensarla.',
          'Describe una corrección específica que recibió y el cambio que hizo después.',
          'Identifica su señal de alarma bajo presión ("cuando alzo la voz, me salgo dos minutos").',
          'Pide ayuda o segunda opinión en lo que sabe que no domina.',
        ],
      },
    ],
    noCuenta: ['Listar cualidades sin ningún ejemplo de conducta propia.'],
  },

  empatia: {
    labelEs: 'Empatía',
    queMide:
      'Si lee lo que le pasa al otro —cliente o compañero— y ajusta su forma de actuar en consecuencia.',
    anclas: [
      {
        rango: '0-40',
        titulo: 'BAJA',
        senales: [
          'Trata a todos igual "porque es su trabajo", sin leer la situación.',
          'Ante una queja, se pone a la defensiva o culpa al cliente.',
          'Habla del cliente como estorbo o del compañero como flojo.',
          'Su respuesta a un problema humano es puramente procedimental.',
        ],
      },
      {
        rango: '41-70',
        titulo: 'MEDIA',
        senales: [
          'Dice "hay que escuchar al cliente" sin describir qué escucha ni qué cambia.',
          'Reconoce que cada persona es distinta pero no da un ejemplo.',
          'Ofrece una solución estándar (disculpa + cortesía) sin diagnosticar.',
        ],
      },
      {
        rango: '71-100',
        titulo: 'ALTA',
        senales: [
          'Describe SEÑALES concretas que observa (tono, lenguaje corporal, prisa, si viene con niños).',
          'Ajusta su actuación según esas señales y lo explica.',
          'Distingue entre lo que el otro pide y lo que en realidad necesita.',
          'Da un ejemplo real de un compañero o cliente al que leyó y cómo le cambió el trato.',
        ],
      },
    ],
    noCuenta: ['"El cliente siempre tiene la razón" — frase hecha sin conducta.'],
  },

  etica_trabajo: {
    labelEs: 'Ética de trabajo',
    queMide:
      'Si sostiene el estándar cuando cuesta y cuando nadie lo supervisa. En puestos operativos se ve en rutinas (cierres, talachas, montaje, pasos que se pueden saltar). En puestos de mando se ve en si NO deja pasar las cosas: si corrige, da seguimiento, aplica la regla parejo y no evade el problema incómodo.',
    anclas: [
      {
        rango: '0-40',
        titulo: 'BAJA',
        senales: [
          'Se va a su hora aunque quede trabajo, o deja pendientes al siguiente turno.',
          'Justifica saltarse pasos por prisa o por cansancio.',
          'Sólo hace bien las cosas cuando lo están viendo.',
          'Habla de "hacer lo mío" y desentenderse del resto.',
          'En mando: deja pasar la falta, la evade, o la escala sin haber hecho nada él.',
        ],
      },
      {
        rango: '41-70',
        titulo: 'MEDIA',
        senales: [
          'Dice ser responsable pero no describe ninguna rutina.',
          'Menciona que se queda si hace falta, sin ejemplo.',
          'Cumple el estándar pero no lo verifica.',
          'En mando: corrige, pero no dice cómo le da seguimiento ni qué pasa si se repite.',
        ],
      },
      {
        rango: '71-100',
        titulo: 'ALTA',
        senales: [
          'Describe su rutina concreta y en qué orden la hace.',
          'Se anticipa: prepara antes para no quedar mal después.',
          'Verifica su propio trabajo o el del equipo antes de darlo por cerrado.',
          'Sostiene el paso completo aunque nadie lo revise, y dice por qué importa.',
          'En mando: enfrenta el problema incómodo, aplica la regla parejo y da seguimiento hasta cerrarlo.',
        ],
      },
    ],
    noCuenta: ['"Soy muy trabajador", "me gusta el trabajo en equipo" sin rutina descrita.'],
  },

  inteligencia_curiosa: {
    labelEs: 'Inteligencia curiosa',
    queMide:
      'Si pregunta, aprende y propone: interés genuino por el producto, el negocio y por mejorar cómo se hacen las cosas.',
    anclas: [
      {
        rango: '0-40',
        titulo: 'BAJA',
        senales: [
          'No pregunta nada, hace lo que le dicen.',
          '"Así se ha hecho siempre" como respuesta a por qué.',
          'No sabe nada del producto que vende ni le interesa.',
          'No propone ninguna mejora.',
        ],
      },
      {
        rango: '41-70',
        titulo: 'MEDIA',
        senales: [
          'Dice que le gusta aprender pero no dice qué aprendió.',
          'Menciona que pregunta cuando no sabe, sin ejemplo.',
          'Propone algo genérico ("mejorar el servicio").',
        ],
      },
      {
        rango: '71-100',
        titulo: 'ALTA',
        senales: [
          'Nombra algo concreto que aprendió por iniciativa propia y cómo lo usó.',
          'Propone una idea específica y aterrizada al negocio.',
          'Muestra conocimiento del producto más allá de lo mínimo.',
          'Cuestiona un procedimiento con argumento, no por comodidad.',
        ],
      },
    ],
    noCuenta: ['"Siempre estoy dispuesto a aprender" sin nada aprendido de ejemplo.'],
  },

  optimismo_bondadoso: {
    labelEs: 'Optimismo bondadoso',
    queMide:
      'Qué energía le mete al turno y cómo trata al equipo: si levanta o si hunde cuando las cosas se ponen difíciles.',
    anclas: [
      {
        rango: '0-40',
        titulo: 'BAJA',
        senales: [
          'Habla mal de compañeros, de jefes anteriores o de clientes.',
          'Ante un turno pesado, se queja o contagia el mal humor.',
          'Ve al equipo como competencia.',
          'Su forma de corregir es exhibir o gritar.',
        ],
      },
      {
        rango: '41-70',
        titulo: 'MEDIA',
        senales: [
          'Dice ser positivo pero no describe qué hace con el equipo.',
          'Menciona que apoya a los compañeros, sin ejemplo.',
          'Habla de buen ambiente en abstracto.',
        ],
      },
      {
        rango: '71-100',
        titulo: 'ALTA',
        senales: [
          'Describe una acción concreta para levantar al equipo en un turno difícil.',
          'Corrige en privado y reconoce en público, y lo dice así.',
          'Da crédito a otros por lo que salió bien.',
          'Mantiene el trato cuidadoso incluso con el cliente que lo trató mal.',
        ],
      },
    ],
    noCuenta: ['"Soy buena onda", "me llevo bien con todos" sin conducta descrita.'],
  },
}

/** La rúbrica formateada para meterla en el prompt. */
export function rubricaComoTexto(eje: EjeGuidara): string {
  const r = RUBRICAS[eje]
  const bloques = r.anclas
    .map(
      (a) =>
        `  ${a.rango} — ${a.titulo}\n` + a.senales.map((s) => `      · ${s}`).join('\n')
    )
    .join('\n\n')
  return (
    `COMPETENCIA: ${r.labelEs}\n` +
    `QUÉ MIDE: ${r.queMide}\n\n` +
    `RÚBRICA (ancla tu número contra estos ejemplos concretos):\n\n${bloques}\n\n` +
    `NO CUENTA COMO EVIDENCIA:\n` +
    r.noCuenta.map((n) => `  · ${n}`).join('\n')
  )
}
