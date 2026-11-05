import { test } from '@japa/runner'
import { interpretarRespuestaIA, type RespuestaEje } from '#services/psych_axis_grader'

// Reglas del calificador por eje (2026-10-26), sin llamar a OpenAI. Los casos
// salen de la prueba de punta a punta del 25-oct: Diego (respuestas vagas
// convertidas en 0 y 30) y Elena (respuestas hipotéticas contadas como
// conducta).
const resp = (respuesta: string, qid = 'q1'): RespuestaEje => ({ qid, pregunta: 'x', respuesta })

test.group('calificador por eje — reglas sobre la respuesta de la IA', () => {
  test('sólo citas genéricas → Pendiente por evidencia insuficiente, no un número', ({
    assert,
  }) => {
    const r = interpretarRespuestaIA(
      'etica_trabajo',
      {
        quotes: [{ text: 'Que se arreglen entre ellos.', type: 'generica' }],
        score: 0,
        negative_conduct: false,
      },
      [resp('Que se arreglen entre ellos.')]
    )
    assert.isNull(r.score)
    assert.equal(r.motivoPendiente, 'evidencia_insuficiente')
  })

  test('20 o menos sin conducta negativa → Pendiente', ({ assert }) => {
    const r = interpretarRespuestaIA(
      'empatia',
      {
        quotes: [{ text: 'Les digo que sigan trabajando y ya.', type: 'hipotetica' }],
        score: 15,
        negative_conduct: false,
      },
      [resp('Les digo que sigan trabajando y ya.')]
    )
    assert.isNull(r.score)
    assert.equal(r.motivoPendiente, 'bajo_sin_conducta_negativa')
  })

  test('20 o menos CON conducta negativa citada → se sostiene', ({ assert }) => {
    const r = interpretarRespuestaIA(
      'integridad',
      {
        quotes: [{ text: 'con un amigo de confianza podría cubrirlo', type: 'hipotetica' }],
        score: 10,
        negative_conduct: true,
      },
      [resp('Si es poquito, con un amigo de confianza podría cubrirlo antes de entregar.')]
    )
    assert.equal(r.score, 10)
    assert.isTrue(r.negativeConduct)
  })

  test('sólo citas hipotéticas → número con etiqueta "sólo criterio declarado"', ({ assert }) => {
    const r = interpretarRespuestaIA(
      'integridad',
      {
        quotes: [
          { text: 'Rechazaría la gratificación y lo informaría al gerente.', type: 'hipotetica' },
        ],
        score: 85,
        negative_conduct: false,
      },
      [resp('Rechazaría la gratificación y lo informaría al gerente.')]
    )
    assert.equal(r.score, 85)
    assert.equal(r.evidenceType, 'solo_criterio_declarado')
    assert.include(r.evidence, 'Sólo criterio declarado')
  })

  test('una cita observada → conducta relatada, sin etiqueta', ({ assert }) => {
    const r = interpretarRespuestaIA(
      'inteligencia_curiosa',
      {
        quotes: [
          {
            text: 'Separé fondo y venta, revisé pagos por folio y encontré el error.',
            type: 'observada',
          },
          { text: 'Yo pondría una conciliación antes del corte.', type: 'hipotetica' },
        ],
        score: 85,
      },
      [
        resp('Separé fondo y venta, revisé pagos por folio y encontré el error.'),
        resp('Yo pondría una conciliación antes del corte.', 'q2'),
      ]
    )
    assert.equal(r.evidenceType, 'conducta_relatada')
    assert.notInclude(r.evidence, 'Sólo criterio declarado')
    assert.deepEqual(r.quoteTypes, ['observada', 'hipotetica'])
  })

  test('cita inventada → Pendiente (se mantiene la regla anterior)', ({ assert }) => {
    const r = interpretarRespuestaIA(
      'empatia',
      {
        quotes: [
          { text: 'Siempre escucho a todos con mucha paciencia y cariño', type: 'observada' },
        ],
        score: 90,
      },
      [resp('No sé.')]
    )
    assert.isNull(r.score)
    assert.equal(r.motivoPendiente, 'citas_no_verificables')
  })

  test('formato anterior (citas como texto) se trata como genérico → Pendiente', ({ assert }) => {
    const r = interpretarRespuestaIA('empatia', { quotes: ['Lo hablaría con ellos.'], score: 30 }, [
      resp('Lo hablaría con ellos.'),
    ])
    assert.isNull(r.score)
    assert.equal(r.motivoPendiente, 'evidencia_insuficiente')
  })

  test('la evidencia ya no se corta a 600 caracteres', ({ assert }) => {
    const larga = 'Expliqué paso a paso cómo cuadré la caja. '.repeat(30)
    const r = interpretarRespuestaIA(
      'etica_trabajo',
      {
        quotes: [{ text: 'Expliqué paso a paso cómo cuadré la caja.', type: 'observada' }],
        score: 80,
        reasoning: larga,
      },
      [resp('Expliqué paso a paso cómo cuadré la caja.')]
    )
    assert.isAbove(r.evidence.length, 600)
  })
})
