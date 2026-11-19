import { test } from '@japa/runner'
import { fragmentoLiteral } from '#services/cita_literal'
import {
  buildPromptConfirmaElementos,
  buildPromptPregunta,
  defectoDelElemento,
  elementoAdmiteEscalar,
  gradeConRubrica,
} from '#services/practical_rubric_grader'
import { confirmacionValida, consolidar, gradeCompetencias } from '#services/competency_grader'
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

  test('partes obligatorias: «completo: false» rechaza el elemento (sólo en el catálogo)', ({ assert }) => {
    const ok = { hace: true, generica: false, solo_lo_suyo: false, delega: false, condicionada: false }
    assert.equal(defectoDelElemento({ ...ok, completo: false }, false), 'incompleto')
    assert.isNull(defectoDelElemento({ ...ok, completo: true }, false))
    // Subgerente no pregunta "completo": sin el campo nada cambia.
    assert.isNull(defectoDelElemento(ok, false))
    const c = buildPromptConfirmaElementos('p', [{ id: 'x', texto: 'y', cita: 'z' }], 'z', 'puesto', 'Gerente')
    assert.include(c, '"completo": ¿la respuesta dice TODAS las partes obligatorias')
    assert.notInclude(buildPromptConfirmaElementos('p', [{ id: 'x', texto: 'y', cita: 'z' }], 'z'), '"completo"')
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
    assert.include(a, '("resto inventario" no es contar\n  físicamente)')
  })

  test('cita reformulada: se pide la literal y, si está, el elemento cuenta con la cita del candidato', async ({ assert }) => {
    const resp = 'Pido ambulancia de inmediato y me quedo con el cliente mientras llega.'
    const prompts: string[] = []
    const llm = async (prompt: string) => {
      prompts.push(prompt)
      if (prompt.includes('Copia TEXTUALMENTE'))
        return { citas: [{ id: 'acompana', literal: 'me quedo con el cliente' }] }
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
    assert.isTrue(prompts.some((p) => p.includes('Copia TEXTUALMENTE')))
  })

  test('si la cita literal tampoco está, el elemento no cuenta y queda registrado', async ({ assert }) => {
    const resp = 'Pido ambulancia de inmediato.'
    const llm = async (prompt: string) => {
      if (prompt.includes('Copia TEXTUALMENTE')) return { citas: [{ id: 'acompana', literal: 'me quedo con él' }] }
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
