import { test } from '@japa/runner'
import {
  alertaDe,
  buildPromptConfirmaElementos,
  buildPromptConfirmaError,
  buildPromptPregunta,
  decisionDe,
  elementoAdmiteEscalar,
  gradeConRubrica,
  defectoDelElemento,
} from '#services/practical_rubric_grader'
import { BANCO_SUBGERENTE_V3 } from '#services/practical_banks/assistant_manager'
import { RUBRICA_SUBGERENTE } from '#services/practical_rubrics/assistant_manager'
import { RUBRICA_SUBGERENTE_V3 } from '#services/practical_rubrics/assistant_manager_v3'

// Ronda 2 (2026-11-15). Todo SIN modelo: el modelo se sustituye por respuestas
// fijas. Estas pruebas demuestran la regla y la tubería (qué llega a cada
// confirmación, cómo se calcula el resultado); que el modelo real juzgue bien
// cada frase queda pendiente de comprobar con la llave de pruebas.

const P8 = BANCO_SUBGERENTE_V3[7]
const SIENTA_15 = 'Siento a los 15 ahora en los 8 lugares.'
const OK = { hace: true, generica: false, solo_lo_suyo: false, delega: false, condicionada: false }
const ESPERA = 'Recibo al grupo, explico la espera y solo siento a quienes tengan lugar.'

function respuestasSoloP8(texto: string) {
  return Object.fromEntries(
    BANCO_SUBGERENTE_V3.map((q, i) => [`q${i + 1}`, { question: q, answer: i === 7 ? texto : '' }])
  )
}

/** Modelo simulado: devuelve lo que diría el modelo y guarda cada prompt. */
function modeloFalso(primera: any, confirmaError: (prompt: string) => boolean) {
  const prompts: string[] = []
  const llm = async (prompt: string) => {
    prompts.push(prompt)
    if (prompt.includes('MALA PRÁCTICA')) return { confirma: confirmaError(prompt), motivo: 'simulado' }
    if (prompt.includes('ELEMENTOS ACREDITADOS'))
      return {
        elementos: (primera.elementos ?? []).map((e: any) => ({ id: e.id, ...OK, motivo: '' })),
      }
    return primera
  }
  return { llm, prompts }
}

const opts = (answers: any, llm: any) => ({
  rol: 'Subgerente',
  rubrica: RUBRICA_SUBGERENTE_V3,
  answers,
  version: { prueba: true },
  passThreshold: 82,
  preguntasBanco: BANCO_SUBGERENTE_V3,
  llm,
})

test.group('ronda 2 — P08-02: sentar a 15 en 8 lugares', () => {
  test('la confirmación del error recibe los datos de la pregunta (8 lugares)', ({ assert }) => {
    const prompt = buildPromptConfirmaError('Los acepta sin capacidad', SIENTA_15, SIENTA_15, P8)
    assert.include(prompt, 'quedan dos mesas libres de cuatro')
    assert.include(prompt, 'sentar a más')
  })

  test('A «siento a los 15 en los 8 lugares» → error crítico, requiere revisión', async ({
    assert,
  }) => {
    const { llm, prompts } = modeloFalso(
      {
        elementos: [],
        errores: [{ id: 'acepta_por_gasto', presente: true, cita: SIENTA_15 }],
      },
      // El "modelo" sólo confirma si le llegó la situación con los 8 lugares.
      (p) => p.includes('quedan dos mesas libres de cuatro')
    )
    const r = await gradeConRubrica(opts(respuestasSoloP8(SIENTA_15), llm))
    const p8 = r.aiReport.preguntas.find((p: any) => p.q === 8)!
    assert.equal(p8.estado, 'error_critico')
    assert.equal(p8.errores[0].cita, SIENTA_15)
    assert.equal(r.aiReport.decision, 'requiere_revision')
    assert.isNull(r.passed)
    assert.include(r.aiReport.alerta.texto!, 'P8')
    assert.isTrue(prompts.some((x) => x.includes('MALA PRÁCTICA')))
  })

  test('B «recibo al grupo, explico la espera…» → sin error, crédito por la decisión', async ({
    assert,
  }) => {
    const { llm } = modeloFalso(
      {
        elementos: [{ id: 'decision', presente: true, cita: 'explico la espera y solo siento a quienes tengan lugar' }],
        errores: [],
      },
      () => false
    )
    const r = await gradeConRubrica(opts(respuestasSoloP8(ESPERA), llm))
    const p8 = r.aiReport.preguntas.find((p: any) => p.q === 8)!
    assert.equal(p8.estado, 'parcial')
    assert.deepEqual(
      p8.elementos.map((e: any) => e.id),
      ['decision']
    )
    assert.isFalse(r.aiReport.alerta.requiereRevision)
  })

  test('un error que la confirmación descarta queda auditado con su motivo', async ({ assert }) => {
    const { llm } = modeloFalso(
      { elementos: [], errores: [{ id: 'acepta_por_gasto', presente: true, cita: ESPERA }] },
      () => false
    )
    const r = await gradeConRubrica(opts(respuestasSoloP8(ESPERA), llm))
    const p8 = r.aiReport.preguntas.find((p: any) => p.q === 8)!
    assert.notEqual(p8.estado, 'error_critico')
    assert.deepEqual(p8.erroresDescartados?.map((e: any) => e.id), ['acepta_por_gasto'])
  })
})

test.group('ronda 2 — puntaje y alerta separados', () => {
  const pregunta = (q: number, estado: any, extra: any = {}) => ({
    q,
    evalua: `P${q}`,
    dimension: 'operacion' as const,
    indispensable: false,
    respuesta: 'x',
    estado,
    puntos: estado === 'correcta' ? 1 : 0,
    elementos: [],
    faltantes: [],
    errores: [],
    citasNoVerificadas: [],
    ...extra,
  })

  test('un 89 con error crítico conserva el puntaje y queda «requiere revisión»', ({ assert }) => {
    const alerta = alertaDe([
      pregunta(1, 'correcta'),
      pregunta(10, 'error_critico', {
        errores: [{ id: 'sirve', texto: 'Le sirve la ronda', cita: 'le sirvo una más' }],
      }),
    ])
    assert.isTrue(alerta.requiereRevision)
    assert.equal(alerta.texto, 'Requiere revisión: P10 — Le sirve la ronda («le sirvo una más»)')
    assert.deepEqual(decisionDe(89.2, 82, alerta), { decision: 'requiere_revision', passed: null })
  })

  test('sin error crítico: aprueba o no por el umbral; nunca descarta', ({ assert }) => {
    const sin = alertaDe([pregunta(1, 'correcta'), pregunta(2, 'vacia')])
    assert.isFalse(sin.requiereRevision)
    assert.deepEqual(decisionDe(89.2, 82, sin), { decision: 'aprobado', passed: true })
    assert.deepEqual(decisionDe(60, 82, sin), { decision: 'no_aprobado', passed: false })
  })
})

test.group('ronda 2 — reglas de la confirmación de elementos', () => {
  test('escalar está permitido sólo donde el elemento lo pide (P10 sí, P12 cancelaciones no)', ({
    assert,
  }) => {
    const p10 = RUBRICA_SUBGERENTE.find((p) => p.q === 10)!.esenciales.find((e) => e.id === 'escala')!
    const p12 = RUBRICA_SUBGERENTE_V3.find((p) => p.q === 12)!.esenciales.find(
      (e) => e.id === 'cancelaciones'
    )!
    assert.isTrue(elementoAdmiteEscalar(p10.texto))
    assert.isFalse(elementoAdmiteEscalar(p12.texto))
    const prompt = buildPromptConfirmaElementos(
      'pregunta',
      [
        { id: 'escala', texto: p10.texto, cita: 'aviso al gerente' },
        { id: 'cancelaciones', texto: p12.texto, cita: 'las cancelaciones necesitan tickets' },
      ],
      'resp'
    )
    const lineaEscala = prompt.split('\n').find((l) => l.includes('id "escala"'))!
    const lineaCanc = prompt.split('\n').find((l) => l.includes('id "cancelaciones"'))!
    assert.include(lineaEscala, 'NO es "delega"')
    assert.notInclude(lineaCanc, 'NO es "delega"')
  })

  test('la confirmación pregunta por separado: hace, genérica, solo lo suyo, delega, condicionada', ({
    assert,
  }) => {
    const prompt = buildPromptConfirmaElementos('p', [], 'r')
    for (const k of ['"hace"', '"generica"', '"solo_lo_suyo"', '"delega"', '"condicionada"'])
      assert.include(prompt, k)
    assert.include(prompt, 'constatar no es comprobar')
    assert.include(prompt, 'basta con que')
    assert.include(prompt, 'elija o ejecute UNA')
  })
})

test.group('ronda 2 — costo acotado por llamada', () => {
  test('primera pasada pide hasta 2000 tokens; confirmaciones hasta 800', async ({ assert }) => {
    const vistos: { tipo: string; max?: number }[] = []
    const llm = async (prompt: string, o: { maxTokens?: number }) => {
      const tipo = prompt.includes('MALA PRÁCTICA')
        ? 'error'
        : prompt.includes('ELEMENTOS ACREDITADOS')
          ? 'elementos'
          : 'primera'
      vistos.push({ tipo, max: o.maxTokens })
      if (tipo === 'error') return { confirma: false, motivo: '' }
      if (tipo === 'elementos') return { elementos: [{ id: 'decision', ...OK }] }
      return {
        elementos: [{ id: 'decision', presente: true, cita: 'explico la espera' }],
        errores: [{ id: 'acepta_por_gasto', presente: true, cita: 'explico la espera' }],
      }
    }
    await gradeConRubrica(opts(respuestasSoloP8(ESPERA), llm))
    assert.deepEqual(
      vistos.map((v) => `${v.tipo}:${v.max}`).sort(),
      ['elementos:800', 'error:800', 'primera:2000']
    )
  })
})

test.group('ronda 2 — el código decide si el punto se sostiene (v3.3)', () => {
  const CUPO = 'Explico que hay ocho lugares.'
  /** Primera pasada acredita 'decision'; la confirmación responde `conf`. */
  const conModelo = (cita: string, conf: Record<string, unknown>) => async (prompt: string) => {
    if (prompt.includes('MALA PRÁCTICA')) return { confirma: false, motivo: '' }
    if (prompt.includes('ELEMENTOS ACREDITADOS'))
      return { elementos: [{ id: 'decision', motivo: 'simulado', ...conf }] }
    return { elementos: [{ id: 'decision', presente: true, cita }], errores: [] }
  }
  const p8De = async (texto: string, cita: string, conf: Record<string, unknown>) => {
    const r = await gradeConRubrica(opts(respuestasSoloP8(texto), conModelo(cita, conf)))
    return r.aiReport.preguntas.find((p: any) => p.q === 8)!
  }

  test('B «solo siento a quienes tengan lugar»: hace=true → conserva el punto', async ({ assert }) => {
    const p8 = await p8De(ESPERA, 'explico la espera y solo siento a quienes tengan lugar', OK)
    assert.equal(p8.estado, 'parcial')
    assert.deepEqual(p8.elementos.map((e: any) => e.id), ['decision'])
  })

  test('«explico que hay ocho lugares»: hace=false → sin punto, defecto no_hace', async ({ assert }) => {
    const p8 = await p8De(CUPO, CUPO, { ...OK, hace: false })
    assert.deepEqual(p8.elementos, [])
    assert.deepEqual(
      p8.elementosRechazados?.map((e: any) => [e.id, e.defecto]),
      [['decision', 'no_hace']]
    )
  })

  test('cada pregunta cerrada quita el punto; delega sólo donde no se admite escalar', ({ assert }) => {
    assert.isNull(defectoDelElemento(OK, false))
    assert.equal(defectoDelElemento({ ...OK, hace: false }, false), 'no_hace')
    assert.equal(defectoDelElemento({ ...OK, generica: true }, false), 'generica')
    assert.equal(defectoDelElemento({ ...OK, solo_lo_suyo: true }, false), 'solo_lo_suyo')
    assert.equal(defectoDelElemento({ ...OK, delega: true }, false), 'delega')
    assert.isNull(defectoDelElemento({ ...OK, delega: true }, true))
    assert.equal(defectoDelElemento({ ...OK, condicionada: true }, true), 'condicionada')
  })

  test('falla cerrado: sin las preguntas contestadas no hay punto', ({ assert }) => {
    assert.equal(defectoDelElemento(undefined, false), 'sin_respuesta')
    assert.equal(defectoDelElemento({ confirma: true }, false), 'sin_respuesta')
    assert.equal(defectoDelElemento({ hace: 'sí' }, false), 'sin_respuesta')
  })
})

test.group('piloto 2026-11-19 — sin aprobado automático', () => {
  test('con sinDecisionAutomatica un puntaje alto queda "orientativo" y passed null', async ({ assert }) => {
    // Umbral 0 y sin alerta: sin la opción saldría "aprobado".
    const { llm } = modeloFalso({ elementos: [], errores: [] }, () => false)
    // Sin preguntas indispensables, para aislar la regla del umbral.
    const sinIndispensables = RUBRICA_SUBGERENTE_V3.map((p) => ({ ...p, indispensable: false }))
    const r = await gradeConRubrica({
      ...opts(respuestasSoloP8(ESPERA), llm),
      rubrica: sinIndispensables,
      passThreshold: 0,
      sinDecisionAutomatica: true,
    })
    assert.equal(r.aiReport.decision, 'orientativo')
    assert.isFalse(r.aiReport.revisionHumana!.requerida)
    assert.isNull(r.passed)
    // Mismo caso sin la opción: el umbral sí decide (puestos fuera del piloto).
    const r2 = await gradeConRubrica({ ...opts(respuestasSoloP8(ESPERA), llm), passThreshold: 0 })
    assert.equal(r2.aiReport.decision, 'aprobado')
  })

  test('con sinDecisionAutomatica una alerta sigue pidiendo revisión humana', async ({ assert }) => {
    const { llm } = modeloFalso(
      { elementos: [], errores: [{ id: 'acepta_por_gasto', presente: true, cita: SIENTA_15 }] },
      () => true
    )
    const r = await gradeConRubrica({ ...opts(respuestasSoloP8(SIENTA_15), llm), sinDecisionAutomatica: true })
    assert.equal(r.aiReport.decision, 'requiere_revision')
    assert.isNull(r.passed)
    assert.equal(r.aiReport.revisionHumana!.criticas[0].q, 8)
    assert.equal(r.aiReport.revisionHumana!.criticas[0].cita, SIENTA_15)
  })

  test('indispensable en blanco o «no sé» → «pendiente de comprobar», distinto de respuesta crítica', async ({
    assert,
  }) => {
    const { llm } = modeloFalso({ elementos: [], errores: [] }, () => false)
    const rubrica = RUBRICA_SUBGERENTE_V3.map((p) => ({
      ...p,
      indispensable: p.q === 8,
      motivoIndispensable: p.q === 8 ? 'Sentar a más de la capacidad pone en riesgo a las personas.' : undefined,
    }))
    const answers = Object.fromEntries(
      BANCO_SUBGERENTE_V3.map((q, i) => [`q${i + 1}`, { question: q, answer: i === 7 ? 'No sé' : 'Algo.' }])
    )
    const r = await gradeConRubrica({ ...opts(answers, llm), rubrica, sinDecisionAutomatica: true })
    const rh = r.aiReport.revisionHumana!
    assert.equal(r.aiReport.decision, 'requiere_revision')
    assert.lengthOf(rh.criticas, 0)
    assert.deepInclude(rh.pendientes[0], { q: 8, estado: 'no_sabe' })
    assert.include(rh.pendientes[0].motivo, 'capacidad')
    // «No sé» no es alerta de mala práctica.
    assert.isFalse(r.aiReport.alerta.requiereRevision)
  })
})

test.group('perspectiva del puesto (2026-11-19)', () => {
  const ESP = RUBRICA_SUBGERENTE_V3[7]
  test('Subgerente (por omisión) conserva el criterio de responsable del turno, sin cambios', ({ assert }) => {
    const a = buildPromptPregunta('Subgerente', ESP, P8, ESPERA)
    assert.equal(a, buildPromptPregunta('Subgerente', ESP, P8, ESPERA, 'responsable_turno'))
    assert.include(a, 'Cada elemento es una acción del RESPONSABLE DEL TURNO (sobre el equipo, la\n  caja o el salón).')
    assert.include(a, '("limpio mis\n  mesas", "le llevo agua a mi cliente") NO cuenta.')
    const c = buildPromptConfirmaElementos(P8, [{ id: 'x', texto: 'y', cita: ESPERA }], ESPERA)
    assert.include(c, 'no como responsable del turno?')
  })

  test('catálogo: se juzga desde el puesto; atender en persona al afectado sí cuenta', ({ assert }) => {
    const a = buildPromptPregunta('Gerente', ESP, P8, ESPERA, 'puesto')
    assert.notInclude(a, 'RESPONSABLE DEL TURNO')
    assert.include(a, 'quien ocupa el puesto de Gerente')
    assert.include(a, '"me quedo\n  con el cliente"')
    const c = buildPromptConfirmaElementos(P8, [{ id: 'x', texto: 'y', cita: ESPERA }], ESPERA, 'puesto', 'Hostess')
    assert.include(c, 'Atender en persona al cliente o\n      a la persona afectada NO es "solo_lo_suyo". Puesto: Hostess.')
  })

  test('catálogo: consultar o avisar al jefe del puesto (capitán, dueño) no es «delega»', ({ assert }) => {
    assert.isTrue(elementoAdmiteEscalar('Consulta al capitán antes de prometer mesa', 'puesto'))
    assert.isTrue(elementoAdmiteEscalar('Lo comenta con el dueño con su cifra', 'puesto'))
    // Subgerente sin cambios: sólo gerente, escalar, reportar o seguridad.
    assert.isFalse(elementoAdmiteEscalar('Consulta al capitán antes de prometer mesa'))
  })

  test('catálogo: oración con dos acciones, informar es hacer, pedir al equipo y esperas legítimas', ({ assert }) => {
    const a = buildPromptPregunta('Gerente', ESP, P8, ESPERA, 'puesto')
    assert.include(a, 'Una oración con dos acciones demuestra dos elementos')
    assert.include(a, 'decirlo ES la acción')
    const c = buildPromptConfirmaElementos(P8, [{ id: 'x', texto: 'y', cita: ESPERA }], ESPERA, 'puesto', 'Hostess')
    assert.include(c, 'NO es condicionada: esperar el visto bueno de su jefe')
    assert.include(c, '("los anoto si aceptan")')
    // Nada de esto entra en los prompts de Subgerente.
    const sub = buildPromptConfirmaElementos(P8, [{ id: 'x', texto: 'y', cita: ESPERA }], ESPERA)
    assert.notInclude(sub, 'NO es condicionada')
    assert.notInclude(buildPromptPregunta('Subgerente', ESP, P8, ESPERA), 'decirlo ES la acción')
  })
})
