import { test } from '@japa/runner'
import { fragmentoLiteral } from '#services/cita_literal'
import {
  buildPromptConfirmaElementos,
  buildPromptPregunta,
  citaNegada,
  elementoTraeCondicion,
  sinAccionClave,
  idDelCatalogo,
  defectoDelElemento,
  elementoAdmiteEscalar,
  gradeConRubrica,
} from '#services/practical_rubric_grader'
import {
  confirmacionValida,
  consolidar,
  cuentaAlgoHecho,
  gradeCompetencias,
  leerConfirmaciones,
} from '#services/competency_grader'
import { CATALOGO, enunciadosPractico, preguntasAbiertas } from '#services/exam_catalog/index'

// Defectos confirmados por la verificación independiente de Codex, ronda 4
// (2026-11-19). Cada uno queda como prueba permanente. Todo sin modelo: el
// modelo se sustituye por respuestas fijas; se prueba la regla y la tubería.

test.group('ronda 4 · citas literales (defecto 7)', () => {
  test('devuelve el tramo original, con la parte omitida y la mayúscula del candidato', ({ assert }) => {
    const r = 'Pido silla alta, preparo la silla sin tapar el paso. Comunico a cocina y servicio la alergia y el cumpleaños.'
    const cita = 'preparo la silla sin tapar el paso. Comunico a cocina y servicio el cumpleaños'
    assert.equal(
      fragmentoLiteral(cita, r),
      'preparo la silla sin tapar el paso. Comunico a cocina y servicio la alergia y el cumpleaños'
    )
    assert.equal(fragmentoLiteral('Entregué un reporte', 'Como responsable, entregué un reporte real.'), 'entregué un reporte')
  })

  test('no inventa: una frase que no está en la respuesta da null', ({ assert }) => {
    assert.isNull(fragmentoLiteral('cobro la cuenta completa', 'Le ofrezco agua y espero al capitán.'))
    // Un tramo mucho más largo que la cita no es la misma frase.
    assert.isNull(fragmentoLiteral('agua capitán', 'agua ' + 'x '.repeat(30) + 'capitán'))
  })
})

test.group('ronda 4 · práctico (defectos 1, 2 y 5)', () => {
  const GM = CATALOGO.general_manager
  const P8 = preguntasAbiertas(GM).find((p) => p.q === 8)!
  const BANCO = enunciadosPractico(GM)
  const answers = (q: number, texto: string) =>
    Object.fromEntries(BANCO.map((t, i) => [`q${i + 1}`, { question: t, answer: i + 1 === q ? texto : '' }]))

  test('partes obligatorias: «completo» sólo se exige en elementos con `partes` (v3.5)', ({ assert }) => {
    const ok = { hace: true, generica: false, solo_lo_suyo: false, delega: false, condicionada: false }
    assert.equal(defectoDelElemento({ ...ok, completo: false }, false, true), 'incompleto')
    assert.isNull(defectoDelElemento({ ...ok, completo: true }, false, true))
    // Con partes, "completo" es obligatorio y booleano: ausente, null o "false" no confirman.
    for (const v of [undefined, null, 'false'])
      assert.equal(defectoDelElemento({ ...ok, completo: v } as any, false, true), 'sin_respuesta')
    // Sin partes (y en Subgerente) "completo" no decide: falsos «parcial» en DEV, 2026-11-20.
    assert.isNull(defectoDelElemento({ ...ok, completo: false }, false, false))
    assert.isNull(defectoDelElemento(ok, false))
    const c = buildPromptConfirmaElementos(
      'p',
      [{ id: 'x', texto: 'Anota al grupo', cita: 'z', partes: ['el nombre', 'un contacto'] }, { id: 'w', texto: 'y', cita: 'z' }],
      'z', 'puesto', 'Hostess', ['Avisar directamente a cocina']
    )
    assert.include(c, 'PARTES OBLIGATORIAS: el nombre; un contacto')
    assert.equal(c.split('PARTES OBLIGATORIAS:').length - 1, 2) // una en la instrucción, una en el elemento x
    assert.include(c, '- Avisar directamente a cocina')
    assert.notInclude(buildPromptConfirmaElementos('p', [{ id: 'x', texto: 'y', cita: 'z' }], 'z'), '"completo"')
    assert.notInclude(buildPromptConfirmaElementos('p', [{ id: 'x', texto: 'y', cita: 'z', partes: ['a'] }], 'z'), 'PARTES')
  })

  test('la ficha declara partes sólo donde el elemento existe para esos datos', ({ assert }) => {
    const conPartes = (['hostess', 'kitchen_manager', 'general_manager'] as const).flatMap((code) =>
      preguntasAbiertas(CATALOGO[code]).flatMap((p) =>
        p.esenciales.filter((e) => e.partes?.length).map((e) => `${code}:${p.q}:${e.id}`)
      )
    )
    assert.deepEqual(conPartes, ['hostess:1:registra', 'hostess:3:lista', 'hostess:12:registro', 'kitchen_manager:1:tortilla', 'kitchen_manager:8:reabre', 'kitchen_manager:12:precio'])
    const h1 = preguntasAbiertas(CATALOGO.hostess).find((p) => p.q === 1)!
    assert.include(buildPromptPregunta('Hostess', h1, 'x', 'x', 'puesto'), '[partes obligatorias: el nombre; un dato de contacto o cómo les avisará]')
  })

  test('ids con acento o eñe del modelo se reconocen («acompaña» = acompana)', async ({ assert }) => {
    const cat = [{ id: 'acompana' }, { id: 'bano' }, { id: 'emergencias' }]
    assert.equal(idDelCatalogo('acompaña', cat), 'acompana')
    assert.equal(idDelCatalogo('Baño', cat), 'bano')
    assert.equal(idDelCatalogo('otro', cat), 'otro')
    const resp = 'Pido ambulancia de inmediato y me quedo con el cliente mientras llega.'
    const llm = async (prompt: string) => {
      if (prompt.includes('ELEMENTOS ACREDITADOS'))
        return {
          elementos: ['emergencias', 'acompaña'].map((id) => ({
            id, hace: true, generica: false, solo_lo_suyo: false, delega: false, condicionada: false,
          })),
        }
      return {
        elementos: [
          { id: 'emergencias', presente: true, cita: 'Pido ambulancia de inmediato' },
          { id: 'acompaña', presente: true, cita: 'me quedo con el cliente mientras llega' },
        ],
        errores: [],
      }
    }
    const r = await gradeConRubrica({
      rol: 'Gerente', rubrica: [P8], answers: answers(8, resp), version: {}, passThreshold: 70,
      preguntasBanco: BANCO, perspectiva: 'puesto', sinDecisionAutomatica: true, llm,
    })
    const q8 = r.aiReport.preguntas.find((p: any) => p.q === 8)!
    assert.sameMembers(q8.elementos.map((e: any) => e.id), ['emergencias', 'acompana'])
  })

  test('una cita que niega la acción no la acredita (contraste F-)', async ({ assert }) => {
    assert.isTrue(citaNegada('No volvería a contar las botellas', 'Revisa el conteo (vuelve a contar inicial o final)'))
    assert.isTrue(citaNegada('«Nunca lo anoto»', 'Anota qué falló'))
    assert.isFalse(citaNegada('volver a contar las botellas', 'Revisa el conteo'))
    // El elemento ya es una negación: su cita negativa sí lo cumple.
    assert.isFalse(citaNegada('No los siento con Ana', 'No los sienta con Ana, porque ya tiene la mayor carga'))
    assert.isFalse(citaNegada('Noto que falta', 'Revisa el conteo'))
    // Revisión final de Codex (B3): negaciones que afirman la acción.
    assert.isFalse(citaNegada('No omito el conteo: vuelvo a contar las botellas', 'Revisa el conteo'))
    assert.isFalse(citaNegada('No sólo reviso el conteo: vuelvo a contar las botellas', 'Revisa el conteo'))
    assert.isFalse(citaNegada('no espero a que se le pase, llamo al 911', 'Activa de inmediato la ayuda médica'))
    assert.isFalse(citaNegada('No dejo de contar las botellas', 'Revisa el conteo'))
    assert.isTrue(citaNegada('No volvería a contar las botellas; no hace falta', 'Revisa el conteo'))
    // DEV (Encargado P8): «no … hasta que …» afirma la acción con su condición.
    assert.isFalse(citaNegada('no se reabre hasta que personal autorizado descarte la fuga', 'Solo reabre el gas cuando un técnico confirma'))
    assert.isFalse(citaNegada('No dejamos entrar ni reanudamos hasta que personal competente descarte la fuga', 'Solo reabre el gas cuando un técnico confirma'))
    assert.isTrue(citaNegada('No uso la mesa fría', 'Atiende primero la mesa fría'))
    const resp = 'No llamo a emergencias. Me quedo con el cliente.'
    const llm = async (prompt: string) => {
      if (prompt.includes('ELEMENTOS ACREDITADOS'))
        return {
          elementos: ['emergencias', 'acompana'].map((id) => ({
            id, hace: true, generica: false, solo_lo_suyo: false, delega: false, condicionada: false,
          })),
        }
      return {
        elementos: [
          { id: 'emergencias', presente: true, cita: 'No llamo a emergencias' },
          { id: 'acompana', presente: true, cita: 'Me quedo con el cliente' },
        ],
        errores: [],
      }
    }
    const r = await gradeConRubrica({
      rol: 'Gerente', rubrica: [P8], answers: answers(8, resp), version: {}, passThreshold: 70,
      preguntasBanco: BANCO, perspectiva: 'puesto', sinDecisionAutomatica: true, llm,
    })
    const q8 = r.aiReport.preguntas.find((p: any) => p.q === 8)!
    assert.deepEqual(q8.elementos.map((e: any) => e.id), ['acompana'])
    assert.equal(q8.elementosRechazados!.find((x: any) => x.id === 'emergencias')!.defecto, 'negada')
  })

  test('el elemento que trae su condición no se rechaza por «condicionada» (DEV)', ({ assert }) => {
    assert.isTrue(elementoTraeCondicion('Si deciden esperar, los anota en la lista con nombre, número de personas y contacto'))
    assert.isTrue(elementoTraeCondicion('No usa lo que no puede demostrar como inocuo: lo desecha o, si es de alto valor, lo aparta hasta que el gerente autorice el desecho'))
    assert.isFalse(elementoTraeCondicion('Revisa el conteo (vuelve a contar inicial o final)'))
    const ok = { hace: true, generica: false, solo_lo_suyo: false, delega: false }
    assert.isNull(defectoDelElemento({ ...ok, condicionada: true }, false, false, true))
    assert.equal(defectoDelElemento({ ...ok, condicionada: true }, false, false, false), 'condicionada')
  })

  test('acción clave por vocabulario: «resto inventario» no es contar (cierre)', ({ assert }) => {
    const KM = preguntasAbiertas(CATALOGO.kitchen_manager).find((p) => p.q === 12)!
    const conteo = KM.esenciales.find((e) => e.id === 'conteo')!
    assert.isTrue(sinAccionClave('resto inventario utilizable', conteo))
    assert.isFalse(sinAccionClave('cuento lo que hay en cámara', conteo))
    assert.isFalse(sinAccionClave('hago un conteo físico', conteo))
    assert.isFalse(sinAccionClave('reviso las existencias reales', conteo))
    assert.isFalse(sinAccionClave('cualquier cosa', { texto: 'x' }))
  })

  test('con error crítico, los elementos también se confirman (cierre, V2-07−)', async ({ assert }) => {
    const KM8 = preguntasAbiertas(CATALOGO.kitchen_manager).find((p) => p.q === 8)!
    const banco = enunciadosPractico(CATALOGO.kitchen_manager)
    const resp = 'Mantengo cerrado. Lo abro cuando yo considero que ya no hay fuga. Sigo cocinando.'
    const prompts: string[] = []
    const llm = async (prompt: string) => {
      prompts.push(prompt)
      if (prompt.includes('MALA PRÁCTICA')) return { confirma: true, motivo: 'sigue cocinando' }
      if (prompt.includes('ELEMENTOS ACREDITADOS'))
        return { elementos: [{ id: 'reabre', completo: false, hace: true, generica: false, solo_lo_suyo: false, delega: false, condicionada: false }] }
      return {
        elementos: [{ id: 'reabre', presente: true, cita: 'Lo abro cuando yo considero que ya no hay fuga' }],
        errores: [{ id: KM8.erroresCriticos[0].id, presente: true, cita: 'Sigo cocinando' }],
      }
    }
    const answers = Object.fromEntries(banco.map((t, i) => [`q${i + 1}`, { question: t, answer: i + 1 === 8 ? resp : '' }]))
    const r = await gradeConRubrica({
      rol: 'Encargado de cocina', rubrica: [KM8], answers, version: {}, passThreshold: 70,
      preguntasBanco: banco, perspectiva: 'puesto', sinDecisionAutomatica: true, llm,
    })
    const q8 = r.aiReport.preguntas.find((p: any) => p.q === 8)!
    assert.equal(q8.estado, 'error_critico')
    assert.isTrue(prompts.some((p) => p.includes('ELEMENTOS ACREDITADOS')))
    assert.deepEqual(q8.elementos.map((e: any) => e.id), [])
  })

  test('escalar se decide por destinatario y verbo, no por mencionar al gerente', ({ assert }) => {
    assert.isTrue(elementoAdmiteEscalar('Consulta al capitán antes de prometer mesa', 'puesto'))
    assert.isTrue(elementoAdmiteEscalar('Activa emergencias de inmediato', 'puesto'))
    // Cocina C6 P2: que el gerente apruebe no vuelve delegable armar el horario.
    assert.isFalse(elementoAdmiteEscalar('Arma la propuesta de horario que el gerente aprueba', 'puesto'))
  })

  test('reglas del puesto: informar a su destinatario, coordinar sin delegar lo propio, partes completas', ({ assert }) => {
    const a = buildPromptPregunta('Encargado de cocina', P8, BANCO[7], 'x', 'puesto')
    assert.include(a, 'Repetir un dato del caso\n  sin dirigirlo a nadie no cuenta.')
    assert.include(a, '("que el gerente arme el horario") NO cumple ese elemento.')
    assert.include(a, 'No infieras acciones no\n  dichas ("resto inventario" no es contar físicamente)')
  })

  test('cita reformulada: se pide la literal y, si está, el elemento cuenta con la cita del candidato', async ({ assert }) => {
    const resp = 'Pido ambulancia de inmediato y me quedo con el cliente mientras llega.'
    const prompts: string[] = []
    const llm = async (prompt: string) => {
      prompts.push(prompt)
      if (prompt.includes('copia TEXTUALMENTE'))
        return { citas: [{ clave: 'elementos:acompana', literal: 'me quedo con el cliente' }] }
      if (prompt.includes('ELEMENTOS ACREDITADOS'))
        return {
          elementos: ['emergencias', 'acompana'].map((id) => ({
            id, completo: true, hace: true, generica: false, solo_lo_suyo: false, delega: false, condicionada: false,
          })),
        }
      return {
        elementos: [
          { id: 'emergencias', presente: true, cita: 'Pido ambulancia de inmediato' },
          // El modelo reformuló: "permanezco con el cliente" no está escrito.
          { id: 'acompana', presente: true, cita: 'permanezco junto al cliente' },
        ],
        errores: [],
      }
    }
    const r = await gradeConRubrica({
      rol: 'Gerente',
      rubrica: [P8],
      answers: answers(8, resp),
      version: {},
      passThreshold: 70,
      preguntasBanco: BANCO,
      perspectiva: 'puesto',
      sinDecisionAutomatica: true,
      llm,
    })
    const q8 = r.aiReport.preguntas.find((p: any) => p.q === 8)!
    assert.sameMembers(q8.elementos.map((e: any) => e.id), ['emergencias', 'acompana'])
    assert.equal(q8.elementos.find((e: any) => e.id === 'acompana')!.cita, 'me quedo con el cliente')
    assert.equal(q8.estado, 'correcta')
    assert.isTrue(prompts.some((p) => p.includes('copia TEXTUALMENTE')))
    assert.equal((q8.elementos.find((e: any) => e.id === 'acompana') as any).citaPropuesta, 'permanezco junto al cliente')
  })

  test('si la cita literal tampoco está, el elemento no cuenta y queda registrado', async ({ assert }) => {
    const resp = 'Pido ambulancia de inmediato.'
    const llm = async (prompt: string) => {
      if (prompt.includes('copia TEXTUALMENTE')) return { citas: [{ clave: 'elementos:acompana', literal: 'me quedo con él' }] }
      if (prompt.includes('ELEMENTOS ACREDITADOS'))
        return { elementos: [{ id: 'emergencias', completo: true, hace: true, generica: false, solo_lo_suyo: false, delega: false, condicionada: false }] }
      return {
        elementos: [
          { id: 'emergencias', presente: true, cita: 'Pido ambulancia de inmediato' },
          { id: 'acompana', presente: true, cita: 'me quedo con el cliente' },
        ],
        errores: [],
      }
    }
    const r = await gradeConRubrica({
      rol: 'Gerente', rubrica: [P8], answers: answers(8, resp), version: {}, passThreshold: 70,
      preguntasBanco: BANCO, perspectiva: 'puesto', sinDecisionAutomatica: true, llm,
    })
    const q8 = r.aiReport.preguntas.find((p: any) => p.q === 8)!
    assert.deepEqual(q8.elementos.map((e: any) => e.id), ['emergencias'])
    assert.include(q8.citasNoVerificadas, 'me quedo con el cliente')
  })
})

test.group('ronda 4 · competencias (defectos 3 y 4)', () => {
  const H = CATALOGO.hostess

  test('la confirmación exige los dos booleanos', ({ assert }) => {
    assert.isTrue(confirmacionValida({ accion_propia: true, ya_lo_hizo: false }))
    assert.isFalse(confirmacionValida({ accion_propia: true }))
    assert.isFalse(confirmacionValida(undefined))
  })

  test('sólo una pregunta marcada «hipotetica» da nivel a lo que haría', ({ assert }) => {
    const p = (tipo: any) => ({ q: 1, p: { texto: 't', eje: 'empatia', tipo, senalesPositivas: [], senalesAlerta: [] } as any })
    const ev = [{ q: 1, cita: 'x', clase: 'criterio' as const, fuerza: 'suficiente' as const, senal: '' }]
    assert.equal(consolidar([p('hipotetica')], ev).nivel, 2)
    assert.isNull(consolidar([p('experiencia')], ev).nivel)
    assert.isNull(consolidar([p(undefined)], ev).nivel)
  })

  test('el prompt pide revisar todas las preguntas y dividir las respuestas mixtas', async ({ assert }) => {
    const prompts: string[] = []
    const llm = async (prompt: string) => {
      prompts.push(prompt)
      return { evidencias: [] }
    }
    const answers = Object.fromEntries(
      H.competencias.preguntas.map((x, i) => [`q${i + 1}`, { question: x.texto, answer: 'Algo concreto que hice.' }])
    )
    await gradeCompetencias({ ficha: H, answers, version: {}, llm })
    const p = prompts.find((x) => x.includes('Evalúas UNA competencia'))!
    assert.include(p, 'Revisa TODAS las preguntas')
    assert.include(p, 'extrae dos citas')
    assert.notInclude(p, 'hasta 4 evidencias')
  })

  test('una cita sin confirmación válida (tras reintento) no cuenta y queda señalada', async ({ assert }) => {
    const q1 = H.competencias.preguntas.findIndex((x) => x.eje === 'integridad') + 1
    const resp = 'Encontré una cartera y la entregué al gerente esa misma noche.'
    let confirmaciones = 0
    const llm = async (prompt: string) => {
      if (prompt.includes('Preguntas cerradas sobre frases')) {
        confirmaciones++
        return { citas: [{ n: 0, accion_propia: true }] } // falta ya_lo_hizo
      }
      if (prompt.includes('Evalúas UNA competencia') && prompt.includes(resp))
        return { evidencias: [{ q: q1, cita: 'la entregué al gerente esa misma noche', clase: 'relato', fuerza: 'fuerte', senal: '' }], alerta: { presente: false } }
      return { evidencias: [] }
    }
    const answers = Object.fromEntries(
      H.competencias.preguntas.map((x, i) => [`q${i + 1}`, { question: x.texto, answer: i + 1 === q1 ? resp : '' }])
    )
    const r = await gradeCompetencias({ ficha: H, answers, version: {}, llm })
    const integ = r.aiReport.competencias.find((c: any) => c.eje === 'integridad')!
    assert.equal(confirmaciones, 2)
    assert.isNull(integ.nivel)
    assert.isTrue(integ.faltaVerificar.some((f: string) => /sin clasificar/.test(f)))
  })
})

test.group('ronda 4 · contrastes de la segunda revisión de Codex (sin modelo)', () => {
  test('citas: la negación y la mezcla de cláusulas no pasan como la misma frase', ({ assert }) => {
    assert.isNull(fragmentoLiteral('Entregué el dinero encontrado al gerente', 'No entregué el dinero encontrado al gerente.'))
    assert.isNull(fragmentoLiteral('No entregué el dinero encontrado al gerente', 'Entregué el dinero encontrado al gerente.'))
    assert.isNull(fragmentoLiteral('Avisé al gerente de la diferencia', 'No avisé al gerente de la diferencia; mañana lo haría.'))
    assert.isNull(fragmentoLiteral('entregué el sobre', 'entregué dinero; el gerente abrió el sobre.'))
    // Una negación anterior separada por puntuación no afecta: "No espero; llamo al 911".
    assert.equal(fragmentoLiteral('llamo al 911', 'No espero; llamo al 911 de inmediato.'), 'llamo al 911')
  })

  test('confirmador: índices inválidos o repetidos no se atribuyen a ninguna cita', ({ assert }) => {
    const ok = { accion_propia: true, ya_lo_hizo: true }
    const m = leerConfirmaciones(
      { citas: [{ n: null, ...ok }, { n: '', ...ok }, { n: false, ...ok }, { n: 7, ...ok }, { n: 1.5, ...ok }, { n: '1', ...ok }] },
      [0, 1]
    )
    assert.deepEqual([...m.keys()], [1])
    const dup = leerConfirmaciones({ citas: [{ n: 0, ...ok }, { n: 0, accion_propia: false, ya_lo_hizo: false }] }, [0])
    assert.isFalse(dup.has(0))
  })

  test('reintento: conserva la cita ya confirmada y sólo resuelve la que faltaba', async ({ assert }) => {
    const H = CATALOGO.hostess
    const ejeQs = H.competencias.preguntas.map((x, i) => ({ ...x, q: i + 1 })).filter((x) => x.eje === 'integridad')
    const [a, b] = ejeQs
    const ra = 'Encontré una cartera y la entregué al gerente.'
    const rb = 'Avisé a la pareja que su mesa seguía ocupada.'
    let intento = 0
    const llm = async (prompt: string) => {
      if (prompt.includes('Preguntas cerradas sobre frases')) {
        intento++
        if (intento === 1) return { citas: [{ n: 0, accion_propia: true, ya_lo_hizo: true }] } // falta n 1
        // El segundo intento sólo recibe la cita que faltaba (n 1).
        assert.notInclude(prompt, 'n 0 ·')
        return { citas: [{ n: 1, accion_propia: true, ya_lo_hizo: true }] }
      }
      if (prompt.includes('Evalúas UNA competencia') && prompt.includes(ra))
        return {
          revisadas: [a.q, b.q],
          evidencias: [
            { q: a.q, cita: 'la entregué al gerente', clase: 'relato', fuerza: 'suficiente', senal: '' },
            { q: b.q, cita: 'Avisé a la pareja que su mesa seguía ocupada', clase: 'relato', fuerza: 'suficiente', senal: '' },
          ],
          alerta: { presente: false },
        }
      return { evidencias: [] }
    }
    const answers = Object.fromEntries(
      H.competencias.preguntas.map((x, i) => [`q${i + 1}`, { question: x.texto, answer: i + 1 === a.q ? ra : i + 1 === b.q ? rb : '' }])
    )
    const r = await gradeCompetencias({ ficha: H, answers, version: {}, llm })
    const integ = r.aiReport.competencias.find((c: any) => c.eje === 'integridad')!
    assert.equal(intento, 2)
    assert.equal(integ.nivel, 2)
    assert.isTrue(integ.evidencias.every((e: any) => e.confirmada))
  })

  test('cobertura: una pregunta con respuesta que no se reporta revisada queda señalada', async ({ assert }) => {
    const H = CATALOGO.hostess
    const q = H.competencias.preguntas.findIndex((x) => x.eje === 'empatia') + 1
    const llm = async (prompt: string) =>
      prompt.includes('Evalúas UNA competencia') ? { revisadas: [], evidencias: [] } : { citas: [] }
    const answers = Object.fromEntries(
      H.competencias.preguntas.map((x, i) => [`q${i + 1}`, { question: x.texto, answer: i + 1 === q ? 'Le ofrecí agua y una silla.' : '' }])
    )
    const r = await gradeCompetencias({ ficha: H, answers, version: {}, llm })
    const emp = r.aiReport.competencias.find((c: any) => c.eje === 'empatia')!
    assert.isTrue(emp.faltaVerificar.some((f: string) => f.includes(`P${q}`) && /no reportó revisadas/.test(f)))
  })

  test('escalar: "Prepara el reporte" y "Arma la propuesta y pide autorización" no son escalar', ({ assert }) => {
    assert.isFalse(elementoAdmiteEscalar('Prepara el reporte de inventario', 'puesto'))
    assert.isFalse(elementoAdmiteEscalar('Arma la propuesta de horario y pide autorización al gerente', 'puesto'))
    assert.isTrue(elementoAdmiteEscalar('Si sigue molesta, llama al capitán (su jefe directo)', 'puesto'))
  })

  test('recuperación: un fragmento que niega lo pedido no se acepta', async ({ assert }) => {
    const GM = CATALOGO.general_manager
    const P8 = preguntasAbiertas(GM).find((p) => p.q === 8)!
    const BANCO = enunciadosPractico(GM)
    const resp = 'Pido ambulancia de inmediato. No me quedo con el cliente: regreso a la caja.'
    const llm = async (prompt: string) => {
      if (prompt.includes('copia TEXTUALMENTE')) return { citas: [{ clave: 'elementos:acompana', literal: 'me quedo con el cliente' }] }
      if (prompt.includes('ELEMENTOS ACREDITADOS'))
        return { elementos: [{ id: 'emergencias', completo: true, hace: true, generica: false, solo_lo_suyo: false, delega: false, condicionada: false }] }
      return {
        elementos: [
          { id: 'emergencias', presente: true, cita: 'Pido ambulancia de inmediato' },
          { id: 'acompana', presente: true, cita: 'Me quedo con el cliente' },
        ],
        errores: [],
      }
    }
    const answers = Object.fromEntries(BANCO.map((t, i) => [`q${i + 1}`, { question: t, answer: i === 7 ? resp : '' }]))
    const r = await gradeConRubrica({
      rol: 'Gerente', rubrica: [P8], answers, version: {}, passThreshold: 70,
      preguntasBanco: BANCO, perspectiva: 'puesto', sinDecisionAutomatica: true, llm,
    })
    const q8 = r.aiReport.preguntas.find((p: any) => p.q === 8)!
    assert.deepEqual(q8.elementos.map((e: any) => e.id), ['emergencias'])
  })
})

test.group('revisión final de Codex · competencias (B1)', () => {
  test('B1: detecta respuestas que cuentan algo hecho', ({ assert }) => {
    assert.isTrue(cuentaAlgoHecho('Fui con permiso a observar el pase'))
    assert.isTrue(cuentaAlgoHecho('Probé que las reservas tuvieran confirmación'))
    assert.isTrue(cuentaAlgoHecho('Aprendí a identificar cargos pendientes'))
    assert.isFalse(cuentaAlgoHecho('Así lo haría: revisaría qué falta y avisaría aquí'))
    assert.isFalse(cuentaAlgoHecho(''))
  })

  test('B1: un relato omitido en una respuesta mixta se recupera y se confirma', async ({ assert }) => {
    const ficha = CATALOGO.general_manager
    const preguntas = ficha.competencias.preguntas
    const q = preguntas.findIndex((p) => p.eje === 'inteligencia_curiosa') + 1
    const resp = 'Fui con permiso a observar cómo cerraban caja en otra sucursal. Si me pasara hoy, preguntaría al gerente.'
    const answers = Object.fromEntries(preguntas.map((p, i) => [`q${i + 1}`, { question: p.texto, answer: i + 1 === q ? resp : '' }]))
    const prompts: string[] = []
    const llm = async (prompt: string) => {
      prompts.push(prompt)
      if (prompt.includes('no se extrajo ningún RELATO'))
        return { evidencias: [{ q, cita: 'Fui con permiso a observar cómo cerraban caja en otra sucursal', clase: 'relato', fuerza: 'fuerte', senal: 'busca aprender' }] }
      if (prompt.includes('Preguntas cerradas sobre frases'))
        return { citas: [0, 1].map((n) => ({ n, accion_propia: true, ya_lo_hizo: n === 1 })) }
      if (prompt.includes('inteligencia') || prompt.includes('Curiosidad') || prompt.includes('curios'))
        return { evidencias: [{ q, cita: 'preguntaría al gerente', clase: 'criterio', fuerza: 'suficiente', senal: 'x' }], revisadas: [q], alerta: { presente: false } }
      return { evidencias: [], revisadas: [], alerta: { presente: false } }
    }
    const r = await gradeCompetencias({ ficha, answers, version: {}, llm })
    const c = r.aiReport.competencias.find((x: any) => x.eje === 'inteligencia_curiosa')!
    assert.isTrue(prompts.some((p) => p.includes('no se extrajo ningún RELATO')))
    const rel = c.evidencias.find((e: any) => e.clase === 'relato')!
    assert.isTrue(rel.recuperada)
    assert.equal(rel.fuerza, 'fuerte')
    assert.equal(c.tipoEvidencia, 'conducta_relatada')
    assert.equal(c.nivel, 3)
  })
})
