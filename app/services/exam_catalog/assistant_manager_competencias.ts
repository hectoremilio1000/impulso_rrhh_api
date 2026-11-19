import type { ExamenPuesto } from './types.js'

// Bloque B · seis competencias de Subgerente (code 'assistant_manager').
//
// v1: las 45 preguntas «psychometric» del front (questionBank.ts) con el
//     etiquetado de psych_question_tags.ts. Unas 22 estaban en el eje
//     equivocado, integridad era 100% hipotética, había pistas en el
//     enunciado, dobles preguntas, supuestos «como subgerente…» y tres
//     escenarios repetidos con el práctico.
// v2 (2026-11-16): 30 preguntas, 5 por eje. Integridad: 5 de experiencia.
//     Los demás ejes: 4 de experiencia y 1 dilema del puesto. Las de
//     experiencia sirven para cualquier trabajo o la vida diaria. Ningún
//     escenario repite los del práctico (BANCO_SUBGERENTE_V3).
//     Origen de cada pregunta: docs/examenes/puestos/subgerente_competencias.md

export const COMPETENCIAS_SUBGERENTE_V2: ExamenPuesto['competencias'] = {
  version: 'competencias_assistant_manager_v2',
  preguntas: [
    // ── Ronda 1 ──────────────────────────────────────────────────────────
    {
      texto:
        'Cuéntame de la última vez que te dieron cambio de más, te cobraron de menos o te pagaron algo que no te correspondía: qué pasó, qué hiciste tú y cómo terminó.',
      eje: 'integridad',
      tipo: 'experiencia',
      senalesPositivas: [
        'Avisó o devolvió la diferencia aunque nadie lo habría notado',
        'Relata el hecho con detalles concretos (lugar, monto, persona)',
        'Considera a quién afectaba el error (cajero, negocio, compañero)',
      ],
      senalesAlerta: [
        'Se quedó con la diferencia y lo presenta como algo normal o como suerte',
      ],
    },
    {
      texto:
        'Cuéntame de la última vez que alguien te señaló algo de tu forma de trabajar o de comportarte que no te gustó oír: qué te dijo, qué hiciste tú y cómo terminó.',
      eje: 'autoconciencia',
      tipo: 'experiencia',
      senalesPositivas: [
        'Nombra con precisión el señalamiento, aunque lo deje mal parado',
        'Distingue lo que tenía de cierto de lo que no compartía',
        'Describe un cambio concreto que hizo después, o explica por qué no lo hizo',
      ],
      senalesAlerta: [],
    },
    {
      texto:
        'Cuéntame de la última vez que te tocó cubrir el trabajo de otra persona además del tuyo: qué pasó, qué hiciste tú y cómo terminó.',
      eje: 'etica_trabajo',
      tipo: 'experiencia',
      senalesPositivas: [
        'Sostuvo su propio trabajo sin dejarlo a medias por cubrir el otro',
        'Organizó o priorizó de forma concreta para sacar las dos cosas',
        'Avisó a quien correspondía cuando la carga no se podía sostener',
      ],
      senalesAlerta: [
        'Dejó sin hacer una tarea de seguridad, higiene o dinero y no avisó a nadie',
      ],
    },
    {
      texto:
        'Cuéntame de una vez que alguien cercano a ti, en el trabajo, la escuela o tu familia, se llevó una decepción fuerte, como no recibir un puesto, un lugar o un resultado que esperaba: cómo te diste cuenta, qué hiciste tú y cómo terminó.',
      eje: 'empatia',
      tipo: 'experiencia',
      senalesPositivas: [
        'Notó señales concretas del estado de la otra persona',
        'Escuchó o preguntó antes de aconsejar o minimizar',
        'Su apoyo se tradujo en algo concreto, no sólo en palabras',
      ],
      senalesAlerta: [
        'Se burló de la persona o difundió su situación para dejarla mal',
      ],
    },
    {
      texto:
        'Cuéntame de la última vez que notaste que algo se repetía, como un error, una queja o un gasto, y quisiste entender por qué pasaba: qué notaste, qué hiciste para averiguarlo y cómo terminó.',
      eje: 'inteligencia_curiosa',
      tipo: 'experiencia',
      senalesPositivas: [
        'Describe el patrón con datos o ejemplos concretos',
        'Buscó la causa preguntando, revisando o comparando, no sólo suponiendo',
        'Probó un cambio y revisó si funcionó',
      ],
      senalesAlerta: [],
    },
    {
      texto:
        'Cuéntame de la última vez que un grupo con el que estabas, en el trabajo, un equipo deportivo, la escuela o tu familia, quedó desanimado después de que algo salió mal: qué pasó, qué hiciste tú y cómo terminó.',
      eje: 'optimismo_bondadoso',
      tipo: 'experiencia',
      senalesPositivas: [
        'Reconoció lo que salió mal sin negarlo ni exagerarlo',
        'Hizo algo concreto para que el grupo recuperara el ánimo o el rumbo',
        'Cuenta el resultado, aunque no haya sido el ideal',
      ],
      senalesAlerta: [],
    },

    // ── Ronda 2 ──────────────────────────────────────────────────────────
    {
      texto:
        'Cuéntame de una vez que viste a alguien de tu trabajo o de tu grupo tomar dinero, producto o tiempo que no le correspondía, o saltarse una regla de cobro o de inventario: qué pasó, qué hiciste tú y cómo terminó.',
      eje: 'integridad',
      tipo: 'experiencia',
      senalesPositivas: [
        'Actuó: lo habló con la persona, lo documentó o lo reportó a quien correspondía',
        'Separa lo que vio de lo que supuso',
        'Sostuvo su decisión aunque le costara con la persona o con el grupo',
      ],
      senalesAlerta: [
        'Lo encubrió o ayudó a ocultarlo',
        'Participó o recibió parte del beneficio',
      ],
    },
    {
      texto:
        'Cuéntame de una vez que te diste cuenta, tiempo después, de que un problema de tu equipo, tu casa o tu grupo venía en parte de algo que tú hacías o dejabas de hacer: qué era, cómo te diste cuenta y qué cambiaste.',
      eje: 'autoconciencia',
      tipo: 'experiencia',
      senalesPositivas: [
        'Se señala a sí mismo con precisión, sin repartir la culpa',
        'Explica qué señal le hizo verlo',
        'Describe un cambio de conducta concreto y sostenido',
      ],
      senalesAlerta: [],
    },
    {
      texto:
        'Cuéntame de un compromiso, en el trabajo, la escuela o tu familia, que estuviste a punto de no cumplir a tiempo: qué pasó, qué hiciste tú y cómo terminó.',
      eje: 'etica_trabajo',
      tipo: 'experiencia',
      senalesPositivas: [
        'Avisó con anticipación a quien dependía de él',
        'Hizo un esfuerzo concreto para cumplir o propuso una salida',
        'Asume su parte del retraso sin culpar sólo a otros',
      ],
      senalesAlerta: [
        'Entregó algo incompleto o falso como si estuviera terminado',
      ],
    },
    {
      texto:
        'Cuéntame de una vez que tuviste que pedirle algo difícil a alguien con más antigüedad, edad o experiencia que tú: qué le pediste, cómo se lo planteaste y cómo terminó.',
      eje: 'empatia',
      tipo: 'experiencia',
      senalesPositivas: [
        'Consideró cómo lo iba a recibir la otra persona antes de hablar',
        'Fue claro con lo que pedía sin perderle el respeto',
        'Escuchó su postura y la tomó en cuenta en el resultado',
      ],
      senalesAlerta: [
        'Lo humilló o lo exhibió frente a otros para imponerse',
      ],
    },
    {
      texto:
        'Cuéntame de algo que aprendiste por tu cuenta en el último año, sin que nadie te lo pidiera: qué fue, cómo lo aprendiste y para qué lo has usado.',
      eje: 'inteligencia_curiosa',
      tipo: 'experiencia',
      senalesPositivas: [
        'Nombra algo concreto y reciente',
        'Describe cómo lo aprendió (fuentes, práctica, preguntar a alguien)',
        'Lo aplicó en algo real',
      ],
      senalesAlerta: [],
    },
    {
      texto:
        'Cuéntame de una vez que algo te salió mal y tuviste que volver a intentarlo: qué pasó, qué hiciste distinto la segunda vez y cómo terminó.',
      eje: 'optimismo_bondadoso',
      tipo: 'experiencia',
      senalesPositivas: [
        'Vuelve a intentarlo en lugar de abandonar',
        'Saca una lección concreta del primer intento',
        'Habla del tropiezo sin amargura ni culpar a todos',
      ],
      senalesAlerta: [],
    },

    // ── Ronda 3 ──────────────────────────────────────────────────────────
    {
      texto:
        'Cuéntame de una vez que alguien con quien tenías confianza, un amigo, un familiar o un compañero, te pidió que lo cubrieras en algo que no te parecía correcto: qué te pidió, qué hiciste tú y cómo terminó.',
      eje: 'integridad',
      tipo: 'experiencia',
      senalesPositivas: [
        'Se negó a cubrir lo incorrecto aunque fuera alguien cercano',
        'Le explicó a la persona por qué no lo haría y qué sí podía hacer',
        'Cuidó la relación sin ceder en lo de fondo',
      ],
      senalesAlerta: [
        'Cubrió un faltante de dinero o de producto',
        'Alteró o firmó un registro, reporte o asistencia que no era verdad',
      ],
    },
    {
      texto:
        'Cuéntame de la última vez que estuviste al límite por cansancio o presión, en el trabajo o fuera de él: cómo te diste cuenta, qué hiciste tú y cómo terminó.',
      eje: 'autoconciencia',
      tipo: 'experiencia',
      senalesPositivas: [
        'Reconoce señales propias concretas (físicas, de humor, de errores)',
        'Tomó una medida concreta para manejarlo',
        'Distingue cómo afectó o pudo afectar a otros',
      ],
      senalesAlerta: [
        'Se desquitó con alguien con insultos, gritos o agresión física',
      ],
    },
    {
      texto:
        'Cuéntame de una vez que te diste cuenta, al terminar una jornada o una entrega, de que algo que te tocaba había quedado incompleto o mal hecho: qué era, qué hiciste tú y cómo terminó.',
      eje: 'etica_trabajo',
      tipo: 'experiencia',
      senalesPositivas: [
        'Lo corrigió o avisó a quien lo iba a recibir',
        'Reconoce que era su responsabilidad',
        'Cambió algo para que no se repitiera',
      ],
      senalesAlerta: [
        'Lo ocultó o lo reportó como terminado',
      ],
    },
    {
      texto:
        'Cuéntame de la última vez que notaste que alguien cercano estaba pasando por un mal momento sin que te lo hubiera dicho: cómo te diste cuenta, qué hiciste tú y cómo terminó.',
      eje: 'empatia',
      tipo: 'experiencia',
      senalesPositivas: [
        'Describe señales concretas que lo hicieron notar',
        'Se acercó con discreción y respetó lo que la persona quiso contar',
        'Ofreció un apoyo concreto dentro de lo que le tocaba',
      ],
      senalesAlerta: [
        'Expuso la situación de la persona frente a otros',
      ],
    },
    {
      texto:
        'Cuéntame de la última vez que tuviste que decidir algo importante sin tener toda la información: qué te faltaba, qué hiciste para conseguirla o suplirla y cómo terminó.',
      eje: 'inteligencia_curiosa',
      tipo: 'experiencia',
      senalesPositivas: [
        'Identifica con precisión qué dato le faltaba',
        'Buscó la información disponible (preguntar, revisar, comparar) antes de decidir',
        'Revisó después si la decisión fue correcta y qué aprendió',
      ],
      senalesAlerta: [],
    },
    {
      texto:
        'Cuéntame de la última vez que reconociste el trabajo o el esfuerzo de alguien sin que nadie te lo pidiera: qué había hecho, qué hiciste tú y cómo reaccionó la persona.',
      eje: 'optimismo_bondadoso',
      tipo: 'experiencia',
      senalesPositivas: [
        'Nombra lo que la persona hizo, con detalle',
        'El reconocimiento fue específico y oportuno',
        'Lo hace de forma habitual, no como excepción',
      ],
      senalesAlerta: [],
    },

    // ── Ronda 4 ──────────────────────────────────────────────────────────
    {
      texto:
        'Cuéntame de una vez que supiste algo de otra persona que no te correspondía contar, como un sueldo, un problema personal, una contraseña o un dato de un cliente: cómo lo supiste, qué hiciste tú con eso y cómo terminó.',
      eje: 'integridad',
      tipo: 'experiencia',
      senalesPositivas: [
        'Guardó la información aunque alguien de confianza se la pidiera',
        'Sólo la usó o compartió con quien tenía derecho a saberla',
        'Si la información se filtró, lo dijo y ayudó a corregirlo',
      ],
      senalesAlerta: [
        'Difundió o usó la información para beneficio propio o para perjudicar a alguien',
      ],
    },
    {
      texto:
        'Cuéntame de la última vez que reconociste que algo te rebasaba y pediste ayuda: qué era, a quién se la pediste y cómo terminó.',
      eje: 'autoconciencia',
      tipo: 'experiencia',
      senalesPositivas: [
        'Reconoce el límite propio con precisión',
        'Pidió ayuda a tiempo, antes de que el daño creciera',
        'Explica qué hizo él mientras llegaba la ayuda',
      ],
      senalesAlerta: [],
    },
    {
      texto:
        'Cuéntame de la última vez que ibas a llegar tarde o a faltar a un lugar donde te esperaban: qué pasó, qué hiciste tú y cómo terminó.',
      eje: 'etica_trabajo',
      tipo: 'experiencia',
      senalesPositivas: [
        'Avisó con anticipación y por un medio que llegara',
        'Hizo algo concreto para reducir el impacto en los demás',
        'Asume la causa propia sin inventar pretextos',
      ],
      senalesAlerta: [
        'Faltó sin avisar y lo justifica como algo normal',
      ],
    },
    {
      texto:
        'Cuéntame de la última vez que tuviste que darle a alguien una noticia que no quería oír: qué noticia era, cómo se la diste y cómo terminó.',
      eje: 'empatia',
      tipo: 'experiencia',
      senalesPositivas: [
        'Eligió momento y lugar pensando en la otra persona',
        'Fue claro con la noticia sin suavizarla hasta volverla falsa',
        'Escuchó la reacción y respondió a lo que la persona necesitaba',
      ],
      senalesAlerta: [
        'Dio la noticia de forma que humilló a la persona frente a otros',
      ],
    },
    {
      texto:
        'Cuéntame de una vez que alguien con menos experiencia que tú o de otra área te enseñó una mejor forma de hacer algo: qué pasó, qué hiciste tú con eso y cómo terminó.',
      eje: 'inteligencia_curiosa',
      tipo: 'experiencia',
      senalesPositivas: [
        'Escuchó la idea sin descartarla por quién la traía',
        'Probó el cambio y comparó el resultado',
        'Da crédito a la persona',
      ],
      senalesAlerta: [],
    },
    {
      texto:
        'Cuéntame de una situación difícil que duró semanas o meses, en el trabajo, la escuela o tu casa: cómo la viviste día a día y cómo terminó.',
      eje: 'optimismo_bondadoso',
      tipo: 'experiencia',
      senalesPositivas: [
        'Mantuvo una rutina o acciones concretas mientras duró',
        'Habla de la situación con realismo, sin negarla ni rendirse',
        'Se apoyó en otros o apoyó a otros en el proceso',
      ],
      senalesAlerta: [],
    },

    // ── Ronda 5 ──────────────────────────────────────────────────────────
    {
      texto:
        'Cuéntame de una vez que alguien con autoridad sobre ti, como un jefe, un maestro o un encargado, te pidió hacer algo que no te parecía correcto: qué te pidió, qué hiciste tú y cómo terminó.',
      eje: 'integridad',
      tipo: 'experiencia',
      senalesPositivas: [
        'Planteó su desacuerdo con razones a la persona, en privado',
        'No hizo lo que dañaba a clientes, compañeros o al negocio',
        'Si el asunto era grave, lo llevó a la instancia que correspondía',
      ],
      senalesAlerta: [
        'Hizo algo que ponía en riesgo la salud o la seguridad de otros porque se lo ordenaron',
        'Alteró cuentas, cobros o registros por instrucción de alguien',
      ],
    },
    {
      texto:
        'Un sábado a las 2 de la tarde moviste una reserva de 8 personas a la terraza porque el salón se estaba llenando. El gerente llega y, frente a dos meseros, te dice que fue un error y la regresa al salón. Tú crees que tenías razón. ¿Qué haces?',
      eje: 'autoconciencia',
      tipo: 'hipotetica',
      senalesPositivas: [
        'Maneja su reacción en el momento y no discute frente al equipo',
        'Busca hablarlo después en privado, con sus razones',
        'Está dispuesto a revisar si le faltó información',
      ],
      senalesAlerta: [
        'Le grita o lo insulta frente al equipo o los clientes',
      ],
    },
    {
      texto:
        'Martes, faltan 40 minutos para cerrar y el salón está vacío. El gerente ya se fue y mañana abre otro equipo. Al revisar ves que la limpieza profunda de la barra que tocaba esta semana no se hizo, y los dos meseros que quedan ya quieren irse. ¿Qué haces?',
      eje: 'etica_trabajo',
      tipo: 'hipotetica',
      senalesPositivas: [
        'La tarea se hace o queda organizada con responsable y hora concreta',
        'Deja constancia de lo que se hizo y lo que quedó pendiente para el turno siguiente',
        'Pone el ejemplo participando en el trabajo',
      ],
      senalesAlerta: [
        'Marca la limpieza como hecha sin haberla hecho',
      ],
    },
    {
      texto:
        'Mañana entregas al gerente la evaluación mensual de una mesera: este mes tuvo cuatro retardos y dos mesas que se quejaron de su servicio. Hoy te cuenta que su mamá está hospitalizada desde hace tres semanas. ¿Qué haces?',
      eje: 'empatia',
      tipo: 'hipotetica',
      senalesPositivas: [
        'Escucha a la mesera en privado y reconoce su situación',
        'Mantiene los hechos de la evaluación tal como ocurrieron y añade el contexto por separado',
        'Propone apoyos concretos (cambio de horario, permiso) y los escala al gerente si no son de su facultad',
      ],
      senalesAlerta: [
        'Borra o cambia los hechos de la evaluación por la situación personal',
        'Cuenta la situación de la mesera al resto del equipo',
      ],
    },
    {
      texto:
        'Desde hace un mes, la mayoría de las quejas por tiempo de espera de los fines de semana vienen de la terraza, aunque la terraza tiene menos mesas que el salón. Nadie del equipo sabe decirte por qué. ¿Qué haces?',
      eje: 'inteligencia_curiosa',
      tipo: 'hipotetica',
      senalesPositivas: [
        'Propone formas concretas de averiguar la causa (observar, revisar tiempos en el sistema, preguntar a meseros y clientes)',
        'Plantea más de una posible causa antes de decidir',
        'Prueba un cambio y define cómo sabrá si funcionó',
      ],
      senalesAlerta: [],
    },
    {
      texto:
        'Domingo, 6 de la tarde: llueve fuerte, se cancelaron cuatro reservas y el salón está a una tercera parte. Los meseros están en la barra con el celular y uno dice en voz alta que ya no vale la pena el turno. ¿Qué haces?',
      eje: 'optimismo_bondadoso',
      tipo: 'hipotetica',
      senalesPositivas: [
        'Reconoce el desánimo sin descalificar a quien lo dijo',
        'Da al equipo algo concreto y útil que hacer con el turno flojo',
        'Atiende bien a las mesas que sí están, sin bajar el servicio',
      ],
      senalesAlerta: [],
    },
  ],
}
