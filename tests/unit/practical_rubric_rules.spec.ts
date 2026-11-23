import { test } from '@japa/runner'
import {
  interpretarPregunta,
  totales,
  type ResultadoPregunta,
} from '#services/practical_rubric_grader'
import { RUBRICA_SUBGERENTE } from '#services/practical_rubrics/assistant_manager'

// Reglas del práctico por rúbrica (Subgerente v1), sin OpenAI.
const P6 = RUBRICA_SUBGERENTE.find((p) => p.q === 6)!
const R6 =
  'Cuento el efectivo y lo comparo contra el corte del POS. Concilio la terminal con los vouchers. Si falta dinero recuento, lo documento y aviso al gerente.'

test.group('práctico por rúbrica — estado de cada pregunta', () => {
  test('todos los elementos con cita real → correcta, 1 punto', ({ assert }) => {
    const r = interpretarPregunta(P6, R6, {
      elementos: [
        {
          id: 'cuenta_compara',
          presente: true,
          cita: 'Cuento el efectivo y lo comparo contra el corte del POS',
        },
        { id: 'concilia', presente: true, cita: 'Concilio la terminal con los vouchers' },
        {
          id: 'faltante',
          presente: true,
          cita: 'Si falta dinero recuento, lo documento y aviso al gerente',
        },
      ],
    })
    assert.equal(r.estado, 'correcta')
    assert.equal(r.puntos, 1)
  })

  test('cita inventada no cuenta → parcial', ({ assert }) => {
    const r = interpretarPregunta(P6, R6, {
      elementos: [
        {
          id: 'cuenta_compara',
          presente: true,
          cita: 'Cuento el efectivo y lo comparo contra el corte del POS',
        },
        {
          id: 'faltante',
          presente: true,
          cita: 'levanto un acta administrativa con firma de testigos',
        },
      ],
    })
    assert.equal(r.estado, 'parcial')
    assert.closeTo(r.puntos, 1 / 3, 0.01)
    assert.lengthOf(r.citasNoVerificadas, 1)
  })

  test('error crítico con cita → 0 aunque tenga elementos', ({ assert }) => {
    const resp = R6 + ' Si son veinte pesos yo los pongo para que no haya reporte.'
    const r = interpretarPregunta(P6, resp, {
      elementos: [
        {
          id: 'cuenta_compara',
          presente: true,
          cita: 'Cuento el efectivo y lo comparo contra el corte del POS',
        },
      ],
      errores: [
        {
          id: 'tapa',
          presente: true,
          cita: 'Si son veinte pesos yo los pongo para que no haya reporte',
        },
      ],
    })
    assert.equal(r.estado, 'error_critico')
    assert.equal(r.puntos, 0)
  })

  test('dice que no sabe y no aporta elementos → no_sabe (0 puntos, distinto de vacía)', ({
    assert,
  }) => {
    const r = interpretarPregunta(P6, 'No sé cómo se hace, nunca me ha tocado recibir un corte.', {
      declara_no_saber: true,
      elementos: [],
    })
    assert.equal(r.estado, 'no_sabe')
    assert.equal(r.puntos, 0)
  })

  test('dice que no sabe pero aporta un elemento correcto → parcial', ({ assert }) => {
    const resp =
      'No sé hacer el corte, pero si falta dinero lo documento y aviso al gerente antes de firmar.'
    const r = interpretarPregunta(P6, resp, {
      declara_no_saber: true,
      elementos: [
        { id: 'faltante', presente: true, cita: 'si falta dinero lo documento y aviso al gerente' },
      ],
    })
    assert.equal(r.estado, 'parcial')
  })

  test('respuesta con contenido sin ningún elemento → incorrecta', ({ assert }) => {
    const r = interpretarPregunta(
      P6,
      'Llevo ocho años haciendo cortes sin un peso de diferencia.',
      { elementos: [] }
    )
    assert.equal(r.estado, 'incorrecta')
  })

  test('id fuera de la rúbrica se ignora', ({ assert }) => {
    const r = interpretarPregunta(P6, R6, {
      elementos: [
        {
          id: 'inventado',
          presente: true,
          cita: 'Cuento el efectivo y lo comparo contra el corte del POS',
        },
      ],
    })
    assert.equal(r.estado, 'incorrecta')
  })
})

test.group('práctico por rúbrica — total con pesos explícitos', () => {
  const fila = (
    q: number,
    puntos: number,
    estado: ResultadoPregunta['estado']
  ): ResultadoPregunta => {
    const p = RUBRICA_SUBGERENTE.find((x) => x.q === q)!
    return {
      q,
      evalua: p.evalua,
      dimension: p.dimension,
      indispensable: p.indispensable,
      respuesta: 'x',
      estado,
      puntos,
      elementos: [],
      faltantes: [],
      errores: [],
      citasNoVerificadas: [],
    }
  }

  test('todo correcto → 100', ({ assert }) => {
    assert.equal(totales(RUBRICA_SUBGERENTE.map((p) => fila(p.q, 1, 'correcta'))).total, 100)
  })

  test('sólo caja y controles en cero → 70 (pesa 30)', ({ assert }) => {
    const t = totales(
      RUBRICA_SUBGERENTE.map((p) =>
        fila(
          p.q,
          p.dimension === 'caja_controles' ? 0 : 1,
          p.dimension === 'caja_controles' ? 'no_sabe' : 'correcta'
        )
      )
    )
    assert.equal(t.total, 70)
    assert.equal(t.conteo.no_sabe, 3)
    assert.deepEqual(
      t.brechasIndispensables.map((b) => b.q),
      [6, 12]
    )
  })

  test('vacía y "no sé" valen 0 pero se cuentan por separado', ({ assert }) => {
    const filas = RUBRICA_SUBGERENTE.map((p) => fila(p.q, 1, 'correcta'))
    filas[2] = fila(3, 0, 'vacia')
    filas[7] = fila(8, 0, 'no_sabe')
    const t = totales(filas)
    assert.equal(t.conteo.vacia, 1)
    assert.equal(t.conteo.no_sabe, 1)
    assert.isBelow(t.total, 100)
  })
})

test.group('práctico por rúbrica — citas breves (hallazgo de los casos de control)', () => {
  const p1 = RUBRICA_SUBGERENTE.find((p) => p.q === 1)!
  const resp =
    'Reviso asistencia, higiene, montaje, limpieza, equipos e insumos; verifico fondo de caja; confirmo disponibles con cocina y bar; doy briefing y abro.'

  test('una cita de 2 palabras que está tal cual en la respuesta cuenta', ({ assert }) => {
    const r = interpretarPregunta(p1, resp, {
      elementos: [
        { id: 'personal', presente: true, cita: 'Reviso asistencia' },
        { id: 'montaje', presente: true, cita: 'montaje, limpieza' },
        { id: 'caja', presente: true, cita: 'verifico fondo de caja' },
        { id: 'comunicacion', presente: true, cita: 'confirmo disponibles con cocina y bar' },
      ],
    })
    assert.equal(r.estado, 'correcta')
  })

  test('una cita breve que NO está en la respuesta no cuenta', ({ assert }) => {
    const r = interpretarPregunta(p1, resp, {
      elementos: [{ id: 'personal', presente: true, cita: 'pase de lista' }],
    })
    assert.equal(r.estado, 'incorrecta')
  })

  test('cita breve sin palabra sustantiva ("y la") no cuenta', ({ assert }) => {
    const r = interpretarPregunta(p1, resp, {
      elementos: [{ id: 'personal', presente: true, cita: 'y bar' }],
    })
    assert.equal(r.estado, 'incorrecta')
  })
})
