import { test } from '@japa/runner'
import { calificarNumerica, numerosDe } from '#services/practical_rubric_grader'
import { claseConfirmada, consolidar, gradeCompetencias, interpretarCompetencia } from '#services/competency_grader'
import {
  CATALOGO,
  CATALOG_CODES,
  PUESTOS_PILOTO,
  fichaPorHuella,
  huellaCompetencias,
  huellaPractico,
  preguntasPorEje,
  preguntasVisibles,
} from '#services/exam_catalog/index'
import { EJES, type ExamenPuesto, type PreguntaNumerica } from '#services/exam_catalog/types'
import { CURRENT_BANK_FINGERPRINT, ROLE_LABEL_ES, resolveRoleCode, toRoleCode } from '#services/role_catalog'
import { practicalGradingVersion } from '#services/practical_grader'
import { PSYCH_GRADING_VERSION, psychGradingVersion } from '#services/psych_exam_grader'
import { publicExamView } from '#services/public_exam_view'

// Catálogo 2026-11-16. Todo sin modelo: el modelo se sustituye por respuestas
// fijas; estas pruebas fijan las reglas, no el juicio del modelo.

test.group('catálogo — fichas de los 12 puestos', () => {
  test('hay ficha para cada puesto del catálogo de roles', ({ assert }) => {
    assert.sameMembers(CATALOG_CODES, Object.keys(ROLE_LABEL_ES))
  })

  test('cada ficha cumple las reglas del brief', ({ assert }) => {
    for (const code of CATALOG_CODES) {
      const f: ExamenPuesto = CATALOGO[code]
      const ctx = `${code}`
      assert.equal(f.code, code, ctx)
      const pesos = f.practico.dimensiones.reduce((a, d) => a + d.peso, 0)
      assert.equal(pesos, 100, `${ctx}: pesos de dimensiones`)
      const dims = new Set(f.practico.dimensiones.map((d) => d.id))
      f.practico.preguntas.forEach((p, i) => {
        assert.equal(p.q, i + 1, `${ctx}: numeración del práctico`)
        assert.isTrue(dims.has(p.dimension), `${ctx} P${p.q}: dimensión ${p.dimension}`)
        if (p.tipo === 'abierta') {
          assert.isAtLeast(p.esenciales.length, 2, `${ctx} P${p.q}: esenciales`)
          assert.isAtMost(p.minimoCorrecta, p.esenciales.length, `${ctx} P${p.q}: mínimo`)
          assert.isAtLeast(p.minimoCorrecta, 1, `${ctx} P${p.q}: mínimo`)
          // El enunciado no enumera lo que se califica.
          assert.notMatch(p.enunciado, /\bincluye\s*:/i, `${ctx} P${p.q}: enunciado con lista`)
        } else {
          assert.isTrue(Number.isFinite(p.clave) && p.tolerancia >= 0, `${ctx} P${p.q}: clave`)
        }
      })
      assert.isAtLeast(f.practico.preguntas.length, 8, `${ctx}: tamaño del práctico`)
      const porEje = preguntasPorEje(f)
      for (const e of EJES) {
        assert.isAtLeast(porEje[e].length, 3, `${ctx}: ${e} con al menos 3 preguntas`)
        const integ = f.competencias.preguntas.filter((p) => p.eje === 'integridad')
        assert.isTrue(integ.every((p) => p.tipo === 'experiencia'), `${ctx}: integridad sólo experiencia`)
      }
      for (const p of f.competencias.preguntas) {
        if (p.eje === 'inteligencia_curiosa' || p.eje === 'optimismo_bondadoso')
          assert.lengthOf(p.senalesAlerta, 0, `${ctx}: ${p.eje} sin alertas`)
      }
      const enunciados = f.practico.preguntas.map((p) => p.enunciado.trim().toLowerCase())
      assert.equal(new Set(enunciados).size, enunciados.length, `${ctx}: enunciados repetidos`)
    }
  })

  test('cada puesto tiene banco propio: ninguna huella se repite', ({ assert }) => {
    const prac = CATALOG_CODES.map((c) => huellaPractico(CATALOGO[c]))
    const psy = CATALOG_CODES.map((c) => huellaCompetencias(CATALOGO[c]))
    assert.equal(new Set(prac).size, prac.length)
    assert.equal(new Set(psy).size, psy.length)
  })

  test('piloto: la huella vigente del rol = la de su ficha; otra huella no tiene ficha', ({ assert }) => {
    for (const c of PUESTOS_PILOTO) {
      assert.equal(CURRENT_BANK_FINGERPRINT.practical[c], huellaPractico(CATALOGO[c]))
      assert.equal(CURRENT_BANK_FINGERPRINT.psych[c], huellaCompetencias(CATALOGO[c]))
    }
    for (const c of CATALOG_CODES) {
      assert.isNotNull(fichaPorHuella('practical', c, huellaPractico(CATALOGO[c])))
      assert.isNull(fichaPorHuella('practical', c, '10-9ad52a41e44e1391'))
    }
  })

  test('fuera del piloto: el banco vigente es el anterior, o no hay examen', ({ assert }) => {
    assert.deepEqual([...PUESTOS_PILOTO], ['hostess', 'kitchen_manager', 'general_manager'])
    const anteriores = {
      waiter: ['37-af094d031b88c587', '10-9ad52a41e44e1391'],
      captain: ['40-4d4e489b57059a85', '10-108a04047ed77c0e'],
      cook: ['20-7e55b1b2692786f2', '10-1aa369d8bf1afbc1'],
      barman: ['25-cb6e12a20f72048d', '10-e38368b5042afafc'],
      chef_manager: ['30-4e5e876442b3a429', '12-c92f22724125b897'],
      assistant_manager: ['45-a6ece8b51ac6720b', '12-da76df97f9c7bdfc'],
    } as const
    for (const [c, [psy, prac]] of Object.entries(anteriores)) {
      assert.equal(CURRENT_BANK_FINGERPRINT.psych[c as 'waiter'], psy, c)
      assert.equal(CURRENT_BANK_FINGERPRINT.practical[c as 'waiter'], prac, c)
    }
    for (const c of ['runner', 'bar_manager', 'kitchen_sub_manager'] as const) {
      assert.isUndefined(CURRENT_BANK_FINGERPRINT.psych[c])
      assert.isUndefined(CURRENT_BANK_FINGERPRINT.practical[c])
      assert.isNull(toRoleCode(c))
    }
  })

  test('la etiqueta de cada puesto del piloto vuelve a su código (lo que manda el formulario)', ({ assert }) => {
    for (const c of PUESTOS_PILOTO) assert.equal(resolveRoleCode(CATALOGO[c].label), c, c)
  })

  test('Subgerente conserva el práctico v3 revisado por Codex', ({ assert }) => {
    assert.equal(huellaPractico(CATALOGO.assistant_manager), '12-b76ae418bdeb02cd')
  })
})

test.group('catálogo — lo que ve el candidato', () => {
  test('fuera del piloto el link no trae banco del catálogo (el front usa el anterior)', ({ assert }) => {
    for (const [code, testName, desired] of [
      ['waiter', 'PRACTICAL_WAITER_V1', 'Mesero'],
      ['assistant_manager', 'PRACTICAL_ASSISTANT_MANAGER_V1', 'Subgerente'],
      ['chef_manager', 'PRACTICAL_CHEF_MANAGER_V1', 'Chef'],
    ] as const) {
      const v = publicExamView(
        'practical',
        { id: 1, testName, roleCode: code, instrument: 'impulso_practical' },
        { id: 9, firstName: 'A', lastName: 'B', desiredRole: desired }
      )
      assert.equal(v.roleCheck.status, 'ok', code)
      assert.isNull(v.bank, code)
    }
  })

  test('fuera del piloto se califica como antes (misma versión de calificador)', ({ assert }) => {
    assert.equal(practicalGradingVersion('waiter', '10-9ad52a41e44e1391').grader, 'practico-generico-piso-v1')
    assert.equal(
      practicalGradingVersion('assistant_manager', '12-da76df97f9c7bdfc').grader,
      'practico-generico-piso-v1'
    )
    assert.equal(psychGradingVersion('waiter', '37-af094d031b88c587').grader, PSYCH_GRADING_VERSION.grader)
    for (const c of PUESTOS_PILOTO) {
      assert.equal(
        practicalGradingVersion(c, huellaPractico(CATALOGO[c])).grader,
        'practico-rubrica-v3.8',
        c
      )
      assert.equal(psychGradingVersion(c, huellaCompetencias(CATALOGO[c])).grader, 'competencias-evidencia-v2.3', c)
    }
  })

  test('el link público trae el banco del puesto, sin rúbrica ni claves', ({ assert }) => {
    const v = publicExamView(
      'practical',
      { id: 1, testName: 'PRACTICAL_HOSTESS_V1', roleCode: 'hostess', instrument: 'impulso_practical' },
      { id: 9, firstName: 'A', lastName: 'B', desiredRole: 'Hostess' }
    )
    assert.equal(v.roleCheck.status, 'ok')
    assert.deepEqual(
      v.bank!.questions.map((q: any) => q.text),
      CATALOGO.hostess.practico.preguntas.map((p) => p.enunciado)
    )
    const json = JSON.stringify(v)
    for (const p of CATALOGO.hostess.practico.preguntas)
      if (p.tipo === 'abierta') for (const e of p.esenciales) assert.notInclude(json, e.texto)
    assert.notInclude(json, 'senalesAlerta')
    assert.notInclude(json, '"clave"')
  })

  test('en revisión no se entrega banco', ({ assert }) => {
    const v = publicExamView(
      'psych',
      { id: 1, testName: 'PSYCH_WAITER_V1', roleCode: 'waiter', instrument: 'impulso_psych' },
      { id: 9, firstName: 'A', lastName: 'B', desiredRole: 'Hostess' }
    )
    assert.equal(v.roleCheck.status, 'review')
    assert.isNull(v.bank)
  })

  test('las preguntas numéricas llegan como numéricas con su unidad', ({ assert }) => {
    for (const c of CATALOG_CODES) {
      const vis = preguntasVisibles(CATALOGO[c], 'practical')
      CATALOGO[c].practico.preguntas.forEach((p, i) => {
        assert.equal(vis[i].type, p.tipo === 'numerica' ? 'numerica' : 'abierta')
      })
    }
  })
})

test.group('catálogo — preguntas de cálculo (sin modelo)', () => {
  const p: PreguntaNumerica = {
    tipo: 'numerica',
    q: 3,
    enunciado: 'x',
    dimension: 'costos',
    evalua: 'Costo %',
    tareaReal: 'x',
    indispensable: false,
    clave: 34,
    tolerancia: 0.5,
    unidad: '%',
    solucion: 'x',
  }
  test('lee formatos mexicanos', ({ assert }) => {
    assert.deepEqual(numerosDe('$16,800'), [16800])
    assert.deepEqual(numerosDe('34.0 %'), [34])
    assert.deepEqual(numerosDe('6,7'), [6.7])
    assert.deepEqual(numerosDe('1,234.5 y luego 2'), [1234.5, 2])
  })
  test('dentro de la tolerancia → correcta; fuera → incorrecta; vacía y «no sé» aparte', ({
    assert,
  }) => {
    assert.equal(calificarNumerica(p, '34.2%').estado, 'correcta')
    assert.equal(calificarNumerica(p, 'costo 12,000 / venta 35,000 = 34.3').estado, 'correcta')
    assert.equal(calificarNumerica(p, '36').estado, 'incorrecta')
    assert.equal(calificarNumerica(p, '').estado, 'vacia')
    assert.equal(calificarNumerica(p, 'no sé').estado, 'no_sabe')
  })
})

test.group('catálogo — competencias por evidencia (sin modelo)', () => {
  const f = CATALOGO.hostess
  const delEje = (eje: string, respuesta: string) =>
    f.competencias.preguntas
      .map((p, i) => ({ q: i + 1, p, respuesta }))
      .filter((x) => x.p.eje === eje)

  test('relato verificado → conducta relatada, y siempre «falta verificar»', ({ assert }) => {
    const qs = delEje('etica_trabajo', 'Me quedé a cerrar sola y dejé la lista lista para el turno.')
    const r = interpretarCompetencia('etica_trabajo', qs, {
      evidencias: [{ q: qs[0].q, cita: 'Me quedé a cerrar sola', clase: 'relato', fuerza: 'fuerte', senal: 's' }],
    })
    assert.equal(r.tipoEvidencia, 'conducta_relatada')
    assert.equal(r.nivel, 3)
    assert.match(r.faltaVerificar.join(' '), /no conducta observada/)
  })

  test('sólo lo que haría → tope en suficiente y se marca criterio declarado', ({ assert }) => {
    const qs = delEje('empatia', 'Le ofrecería agua y una mesa en cuanto se libere.')
    // Desde v2 lo que haría da nivel sólo si la pregunta pide lo que haría.
    const hip = qs.find((x) => x.p.tipo === 'hipotetica')!
    const r = interpretarCompetencia('empatia', qs, {
      evidencias: [{ q: hip.q, cita: 'Le ofrecería agua', clase: 'criterio', fuerza: 'fuerte', senal: 's' }],
    })
    assert.equal(r.tipoEvidencia, 'solo_criterio_declarado')
    assert.equal(r.nivel, 2)
  })

  test('sin evidencia → nivel null (no cero) y cita inventada no cuenta', ({ assert }) => {
    const qs = delEje('integridad', 'Siempre trato de hacer lo correcto.')
    const r = interpretarCompetencia('integridad', qs, {
      evidencias: [{ q: qs[0].q, cita: 'devolví el dinero al cliente', clase: 'relato', fuerza: 'fuerte', senal: '' }],
    })
    assert.isNull(r.nivel)
    assert.isNull(r.score)
    assert.equal(r.tipoEvidencia, 'sin_evidencia')
    assert.lengthOf(r.citasNoVerificadas, 1)
    assert.match(r.faltaVerificar[0], /No equivale a cero/)
  })

  test('curiosidad y optimismo nunca generan alerta', ({ assert }) => {
    const qs = delEje('optimismo_bondadoso', 'Me da igual el equipo, que se las arreglen.')
    const r = interpretarCompetencia('optimismo_bondadoso', qs, {
      evidencias: [],
      alerta: { presente: true, q: qs[0].q, cita: 'que se las arreglen', conducta: 'x' },
    })
    assert.isNull(r.alertaPropuesta)
  })

  test('alerta confirmada → requiere revisión, sin aprobar ni descartar', async ({ assert }) => {
    const respuestas: Record<string, any> = {}
    f.competencias.preguntas.forEach((p, i) => {
      respuestas[`q${i + 1}`] = {
        question: p.texto,
        answer: p.eje === 'integridad' ? 'Me quedé con el cambio que dejó el cliente y no dije nada.' : '',
      }
    })
    const qInt = f.competencias.preguntas.findIndex((p) => p.eje === 'integridad') + 1
    const llm = async (prompt: string) => {
      if (prompt.startsWith('Pregunta cerrada')) return { confirma: true, motivo: 'lo hizo' }
      if (prompt.includes('Integridad'))
        return {
          evidencias: [{ q: qInt, cita: 'Me quedé con el cambio que dejó el cliente', clase: 'relato', fuerza: 'fuerte', senal: 's' }],
          alerta: { presente: true, q: qInt, cita: 'Me quedé con el cambio que dejó el cliente', conducta: 'Se quedó con dinero de un cliente' },
        }
      return { evidencias: [] }
    }
    const r = await gradeCompetencias({ ficha: f, answers: respuestas, version: {}, llm })
    assert.isNull(r.passed)
    assert.equal(r.aiReport.decision, 'requiere_revision')
    assert.isTrue(r.aiReport.alerta.requiereRevision)
    const integ = r.aiReport.competencias.find((c: any) => c.eje === 'integridad')!
    assert.equal(integ.alerta!.q, qInt)
    // Con alerta confirmada el eje no puede verse fuerte.
    assert.equal(integ.nivel, 1)
    // Ejes sin respuestas: no se llama al modelo y quedan sin evidencia.
    const emp = r.aiReport.competencias.find((c: any) => c.eje === 'empatia')!
    assert.isNull(emp.nivel)
    assert.isAtLeast(emp.sinRespuesta.length, 3)
  })

  test('alerta que la confirmación descarta queda auditada y no pide revisión', async ({ assert }) => {
    const respuestas: Record<string, any> = {}
    f.competencias.preguntas.forEach((p, i) => {
      respuestas[`q${i + 1}`] = { question: p.texto, answer: 'Vi que un compañero se quedó el cambio y lo reporté.' }
    })
    const qInt = f.competencias.preguntas.findIndex((p) => p.eje === 'integridad') + 1
    const llm = async (prompt: string) => {
      if (prompt.startsWith('Pregunta cerrada')) return { confirma: false, motivo: 'lo reportó' }
      if (prompt.includes('Integridad'))
        return {
          evidencias: [],
          alerta: { presente: true, q: qInt, cita: 'se quedó el cambio', conducta: 'Encubre' },
        }
      return { evidencias: [] }
    }
    const r = await gradeCompetencias({ ficha: f, answers: respuestas, version: {}, llm })
    assert.isFalse(r.aiReport.alerta.requiereRevision)
    const integ = r.aiReport.competencias.find((c: any) => c.eje === 'integridad')!
    assert.equal(integ.alertaDescartada!.motivo, 'lo reportó')
  })
})

test.group('catálogo — núcleo de la pregunta (sin modelo)', () => {
  test('juntar el mínimo sin el núcleo no es correcta, y no es error crítico', async ({ assert }) => {
    const { interpretarPregunta } = await import('#services/practical_rubric_grader')
    const p: any = {
      q: 1,
      dimension: 'd',
      evalua: 'x',
      tareaReal: 'x',
      indispensable: false,
      esenciales: [
        { id: 'a', texto: 'A' },
        { id: 'b', texto: 'B' },
        { id: 'alergia', texto: 'Avisa la alergia a cocina' },
      ],
      minimoCorrecta: 2,
      nucleo: ['alergia'],
      alternativasValidas: [],
      erroresCriticos: [],
    }
    const resp = 'hago a y hago b'
    const r = interpretarPregunta(p, resp, {
      elementos: [
        { id: 'a', presente: true, cita: 'hago a' },
        { id: 'b', presente: true, cita: 'hago b' },
      ],
      errores: [],
    })
    assert.equal(r.estado, 'parcial')
    assert.isBelow(r.puntos, 1)
    const r2 = interpretarPregunta({ ...p, nucleo: undefined }, resp, {
      elementos: [
        { id: 'a', presente: true, cita: 'hago a' },
        { id: 'b', presente: true, cita: 'hago b' },
      ],
      errores: [],
    })
    assert.equal(r2.estado, 'correcta')
  })

  test('ningún error crítico del catálogo describe una omisión', ({ assert }) => {
    for (const c of CATALOG_CODES)
      for (const p of CATALOGO[c].practico.preguntas)
        if (p.tipo === 'abierta')
          for (const e of p.erroresCriticos)
            assert.notMatch(e.texto, /^\s*(no|omite|olvida|nunca)\b/i, `${c} P${p.q} ${e.id}: ${e.texto}`)
  })

  test('el núcleo sólo nombra esenciales que existen', ({ assert }) => {
    for (const c of CATALOG_CODES)
      for (const p of CATALOGO[c].practico.preguntas)
        if (p.tipo === 'abierta')
          for (const id of p.nucleo ?? [])
            assert.isTrue(p.esenciales.some((e) => e.id === id), `${c} P${p.q} núcleo ${id}`)
  })
})

test.group('catálogo — huella de la rúbrica (ronda 3)', () => {
  test('cambiar un criterio cambia la huella de rúbrica y no la del banco', async ({ assert }) => {
    const { huellaRubrica } = await import('#services/exam_catalog/index')
    const f = CATALOGO.general_manager
    const g = structuredClone(f) as typeof f
    const p = g.practico.preguntas.find((x) => x.tipo === 'numerica')!
    if (p.tipo === 'numerica') p.tolerancia = p.tolerancia + 1
    assert.notEqual(huellaRubrica(g), huellaRubrica(f))
    assert.equal(huellaPractico(g), huellaPractico(f))
  })
})

test.group('competencias v2 — clase confirmada y regla de lo hipotético (sin modelo)', () => {
  const exp = { texto: 'Cuéntame una vez que…', eje: 'integridad', tipo: 'experiencia', senalesPositivas: [], senalesAlerta: [] } as any
  const hip = { ...exp, texto: '¿Qué harías si…?', tipo: 'hipotetica' }
  const ev = (q: number, clase: any, fuerza: any = 'suficiente') => ({ q, cita: 'x', clase, fuerza, senal: '' })

  test('un valor declarado sin acción es genérico; la acción en condicional es criterio; la hecha, relato', ({ assert }) => {
    assert.equal(claseConfirmada({ accion_propia: false, ya_lo_hizo: false }, 'criterio'), 'generica')
    assert.equal(claseConfirmada({ accion_propia: true, ya_lo_hizo: false }, 'relato'), 'criterio')
    assert.equal(claseConfirmada({ accion_propia: true, ya_lo_hizo: true }, 'criterio'), 'relato')
    // Sin respuesta del modelo se conserva la clase de la primera pasada.
    assert.equal(claseConfirmada(undefined, 'relato'), 'relato')
  })

  test('contestar lo que haría a una pregunta de hechos → «Por verificar», no nivel', ({ assert }) => {
    const r = consolidar([{ q: 1, p: exp }], [ev(1, 'criterio')])
    assert.equal(r.tipoEvidencia, 'solo_criterio_declarado')
    assert.isNull(r.nivel)
    assert.match(r.faltaVerificar[0], /por verificar/)
  })

  test('lo que haría en una pregunta hipotética da nivel, con tope en suficiente', ({ assert }) => {
    const r = consolidar([{ q: 1, p: hip }], [ev(1, 'criterio', 'fuerte')])
    assert.equal(r.nivel, 2)
  })

  test('un relato manda sobre el criterio; genéricas no cuentan', ({ assert }) => {
    assert.equal(consolidar([{ q: 1, p: exp }, { q: 2, p: hip }], [ev(1, 'relato', 'fuerte'), ev(2, 'criterio', 'debil')]).nivel, 3)
    assert.isNull(consolidar([{ q: 1, p: exp }], [ev(1, 'generica', 'fuerte')]).nivel)
  })
})
