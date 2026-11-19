import {
  RUBRICA_SUBGERENTE,
  type PreguntaRubrica,
} from '#services/practical_rubrics/assistant_manager'

// Rúbrica v2 del práctico de Subgerente (2026-11-14), para el banco v2.
//
// Escrita ANTES de calificar con ella. Las preguntas 1, 3, 9 y 12 son
// situaciones de turno: el crédito es por la DECISIÓN (qué hace, en qué orden
// y cómo lo comprueba), no por nombrar temas. Las otras ocho preguntas usan la
// misma rúbrica que la v1.1.
//
// Regla común a todo elemento: cuenta sólo si la acción es la del responsable
// del turno (sobre el equipo, la caja o el salón). Lo que haría sobre su
// propia mesa o estación no cuenta.

const V2: Record<number, PreguntaRubrica> = {
  1: {
    q: 1,
    dimension: 'apertura_cierre',
    evalua: 'Abrir el turno con varios problemas a la vez: prioridad, solución y comprobación',
    tareaReal: 'Apertura del turno (indispensable: checklists y caja)',
    indispensable: true,
    esenciales: [
      {
        id: 'fondo',
        texto:
          'Cuenta el fondo de caja (con quien lo entrega o con testigo) antes de usarlo y deja constancia o avisa que llegó sin firma',
      },
      {
        id: 'cobro',
        texto:
          'Resuelve el cobro sin terminal: reporta la falla y dispone una alternativa (otra terminal, efectivo o transferencia) avisando al equipo',
      },
      {
        id: 'cobertura',
        texto:
          'Cubre la sección del mesero faltante: intenta localizarlo, busca relevo o reparte su sección antes de abrir',
      },
      {
        id: 'agotado',
        texto:
          'Avisa al piso que no hay aguacate: qué platillos no se ofrecen o qué alternativa hay',
      },
      { id: 'reserva', texto: 'Prepara la reserva de 12: mesa o zona y quién la atiende' },
      {
        id: 'orden_verifica',
        texto:
          'Ordena por lo que impide operar (dinero, cobro, personal) antes que lo demás, y comprueba con una acción concreta (conteo firmado, cobro de prueba, confirmación en la junta)',
      },
    ],
    minimoCorrecta: 4,
    alternativasValidas: [
      'Delegar una tarea al capitán si dice a quién y cómo comprueba que se hizo',
      'Retrasar la apertura unos minutos si lo justifica por caja o personal',
    ],
    erroresCriticos: [
      {
        id: 'fondo_sin_contar',
        texto: 'Usa el fondo sin contarlo, o lo da por completo (lo firma o lo dice) sin haberlo contado',
      },
      {
        id: 'seccion_sin_cubrir',
        texto: 'Abre dejando la sección del faltante sin nadie asignado',
      },
    ],
  },
  3: {
    q: 3,
    dimension: 'operacion',
    evalua:
      'Leer los indicadores del turno, decidir qué atender primero y cómo comprobar el efecto',
    tareaReal: 'Indicadores en vivo (Manual: revisa indicadores clave)',
    indispensable: false,
    esenciales: [
      {
        id: 'cocina_primero',
        texto:
          'Identifica la cocina como el cuello de botella y actúa con el chef (causa, ordenar comandas, pausar o quitar platillos lentos)',
      },
      {
        id: 'cuentas',
        texto: 'Libera las 9 mesas que pidieron la cuenta: acelera el cobro con apoyo',
      },
      {
        id: 'entrada',
        texto: 'Controla la entrada: espacia el sentado o da tiempos honestos a la lista de espera',
      },
      {
        id: 'cancelados',
        texto: 'Atiende las mesas con platillo cancelado o revisa la causa de las cancelaciones',
      },
      {
        id: 'verifica',
        texto:
          'Dice qué número revisa después y qué esperaría ver (baja el tiempo de cocina o la espera, se cobraron las cuentas)',
      },
    ],
    minimoCorrecta: 4,
    alternativasValidas: ['Delegar el cobro o la lista de espera si dice a quién'],
    erroresCriticos: [
      {
        id: 'acelera_entrada',
        texto: 'Sienta más mesas o acepta más gente para bajar la espera sin resolver la cocina',
      },
    ],
  },
  9: {
    q: 9,
    dimension: 'apertura_cierre',
    evalua: 'Cerrar el turno con un faltante, una cortesía irregular y propinas pendientes',
    tareaReal: 'Cierre de turno (indispensable: arqueo y entrega)',
    indispensable: true,
    esenciales: [
      {
        id: 'busca_causa',
        texto:
          'Recuenta y busca la causa de la diferencia (vouchers, retiros, propinas en efectivo, error de captura) antes de cerrar',
      },
      {
        id: 'reporta_faltante',
        texto: 'Documenta el faltante de $300 y lo reporta al gerente sin cubrirlo',
      },
      {
        id: 'cortesia',
        texto: 'Averigua quién registró la cortesía y por qué, la deja documentada y la reporta',
      },
      {
        id: 'propinas',
        texto:
          'Reparte las propinas o deja el reparto documentado según la política, con testigo, aunque el mesero se vaya',
      },
      {
        id: 'entrega',
        texto:
          'Deja por escrito al siguiente turno y al gerente: diferencias, pendientes, fondo y llaves',
      },
    ],
    minimoCorrecta: 4,
    alternativasValidas: ['Llamar al gerente en ese momento en lugar de esperar al reporte'],
    erroresCriticos: [
      {
        id: 'tapa',
        texto: 'Cubre el faltante con propinas, dinero propio o de otro, o dice que no lo va a reportar',
      },
      {
        id: 'cortesia_borra',
        texto: 'Autoriza o borra la cortesía, o dice que la deja pasar sin reportarla',
      },
      {
        id: 'propinas_sin_registro',
        texto: 'Reparte propinas sin registro o le da su parte al mesero por fuera del reparto',
      },
    ],
  },
  12: {
    q: 12,
    dimension: 'caja_controles',
    evalua: 'Confirmar hallazgos de auditoría con evidencia y actuar sin acusar de más',
    tareaReal: 'Control antifraude del turno (indispensable)',
    indispensable: true,
    esenciales: [
      {
        id: 'cancelaciones',
        texto:
          'Revisa las cancelaciones en el sistema: ticket, hora, motivo y quién autorizó, antes de concluir',
      },
      {
        id: 'doble_cobro',
        texto:
          'Compara los cobros de la mesa 8 con la terminal o los vouchers y, si se confirma, gestiona la devolución al cliente (o la canaliza al gerente con seguimiento)',
      },
      {
        id: 'cortesias',
        texto: 'Revisa quién registró o autorizó las cortesías y si la política las permite',
      },
      { id: 'reporta', texto: 'Conserva la evidencia y reporta al gerente' },
      {
        id: 'sin_acusar',
        texto:
          'Habla con el mesero o deja la decisión al gerente sin acusarlo antes de tener evidencia; propone prevenir (revisar permisos)',
      },
    ],
    minimoCorrecta: 4,
    alternativasValidas: ['Bloquear de inmediato el permiso de cancelación mientras se revisa'],
    erroresCriticos: [
      { id: 'acusa', texto: 'Acusa o sanciona al mesero frente al equipo o sin evidencia' },
      {
        id: 'arregla_privado',
        texto: 'Dice que lo arregla en privado con el mesero o que lo deja pasar sin reportar',
      },
      {
        id: 'no_devuelve',
        texto:
          'Se queda con el dinero del doble cobro o decide negarle la devolución al cliente (canalizarla al gerente no es negarla)',
      },
    ],
  },
}

export const RUBRICA_SUBGERENTE_V2: PreguntaRubrica[] = RUBRICA_SUBGERENTE.map((p) => V2[p.q] ?? p)
