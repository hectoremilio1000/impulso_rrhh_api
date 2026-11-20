import { test } from '@japa/runner'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { costoUsd, Presupuesto, PresupuestoExcedido, tokensEntradaMax } from '#services/model_budget'

const precios = { entradaPorMTok: 2.5, salidaPorMTok: 10 }

test.group('tope de presupuesto de las pruebas con modelo', () => {
  test('reserva el máximo y se detiene ANTES de exceder el tope', ({ assert }) => {
    const p = new Presupuesto(0.1, precios, null)
    const max = costoUsd(precios, 2000, 4000) // 0.045
    const r1 = p.reservar(max)
    const r2 = p.reservar(max)
    assert.throws(() => p.reservar(max), PresupuestoExcedido as any)
    p.liberar(r1, null)
    p.liberar(r2, null)
    assert.equal(p.gastadoUsd, 0)
  })

  test('cambia la reserva por el costo real y lo anota con el modelo que respondió', ({ assert }) => {
    const dir = mkdtempSync(join(tmpdir(), 'presupuesto-'))
    const bit = join(dir, 'bitacora.jsonl')
    const p = new Presupuesto(1, precios, bit)
    const r = p.reservar(0.05)
    p.liberar(r, {
      at: 'x',
      modeloPedido: 'gpt-4o',
      modeloRespondio: 'gpt-4o-2024-08-06',
      systemFingerprint: 'fp_x',
      tokensEntrada: 1000,
      tokensSalida: 200,
      costoUsd: costoUsd(precios, 1000, 200),
    })
    assert.closeTo(p.gastadoUsd, 0.0045, 1e-9)
    assert.include(readFileSync(bit, 'utf8'), 'gpt-4o-2024-08-06')
    // Una corrida nueva arranca con lo ya gastado en la bitácora.
    const otra = new Presupuesto(1, precios, bit)
    assert.closeTo(otra.gastadoUsd, 0.0045, 1e-9)
  })

  test('la estimación de entrada es por lo alto', ({ assert }) => {
    assert.isAtLeast(tokensEntradaMax('a'.repeat(3500)), 1000)
  })
})

test.group('reintento sólo por error de conexión', () => {
  test('conexión caída se reintenta; una respuesta HTTP no', async ({ assert }) => {
    const { esErrorDeConexion } = await import('#services/openai')
    class APIConnectionError extends Error {}
    assert.isTrue(esErrorDeConexion(new APIConnectionError('Connection error.')))
    assert.isTrue(esErrorDeConexion(new Error('fetch failed')))
    assert.isFalse(esErrorDeConexion(Object.assign(new Error('Rate limit'), { status: 429 })))
    assert.isFalse(esErrorDeConexion(new Error('JSON inválido')))
  })
})

test.group('libro compartido de gasto (auditoría 2026-11-20)', (group) => {
  // Sólo con una base de pruebas: PRESUPUESTO_DB_URL_TEST=mysql://…/presupuesto_test
  const url = process.env.PRESUPUESTO_DB_URL_TEST
  const id = `test-${process.pid}-${Date.now()}`
  let libro: any
  group.setup(async () => {
    if (!url) return
    const { LibroGasto, ESQUEMA_LIBRO } = await import('#services/model_budget_ledger')
    const { createConnection } = await import('mysql2/promise')
    const cx = await createConnection({ uri: url })
    for (const q of ESQUEMA_LIBRO) await cx.query(q)
    await cx.query('INSERT INTO presupuestos (id, limite_usd, nota) VALUES (?, 0.10, ?)', [id, 'prueba unitaria'])
    await cx.end()
    libro = new LibroGasto(url, id, precios, 'prueba')
  })
  group.teardown(async () => libro?.cerrar())

  test('reservas simultáneas de dos «procesos» no pasan el tope; pendientes cuentan', async ({ assert }) => {
    if (!url) return assert.isTrue(true)
    const { LibroGasto } = await import('#services/model_budget_ledger')
    const otro = new LibroGasto(url, id, precios, 'otro-proceso')
    const intentos = await Promise.allSettled([
      libro.reservar(0.04, 'a'), otro.reservar(0.04, 'b'), libro.reservar(0.04, 'c'), otro.reservar(0.04, 'd'),
    ])
    const ok = intentos.filter((x) => x.status === 'fulfilled') as PromiseFulfilledResult<any>[]
    assert.equal(ok.length, 2) // 0.04 × 2 ≤ 0.10 < 0.04 × 3
    assert.closeTo(await libro.comprometidoUsd(), 0.08, 1e-9)
    // Un proceso «nuevo» (reinicio) ve lo mismo: el tope no se reinicia.
    const reinicio = new LibroGasto(url, id, precios, 'reinicio')
    await assert.rejects(async () => {
      await reinicio.reservar(0.03, "e")
    })
    // Cerrar con costo real libera la diferencia; sin respuesta cuenta el máximo.
    await libro.liberar(ok[0].value, { at: 'x', modeloPedido: 'm', modeloRespondio: 'm', systemFingerprint: null, tokensEntrada: 1, tokensSalida: 1, costoUsd: 0.01 })
    await libro.liberar(ok[1].value, null, false)
    assert.closeTo(await libro.comprometidoUsd(), 0.05, 1e-9)
    const r = await reinicio.reservar(0.04, 'f')
    await reinicio.liberar(r, null, true) // error HTTP: sin cobro
    assert.closeTo(await libro.comprometidoUsd(), 0.05, 1e-9)
    await otro.cerrar()
    await reinicio.cerrar()
  })
})

test.group('etapa de cada llamada', () => {
  test('se deduce del prompt y el reintento se marca aparte', async ({ assert }) => {
    const { etapaDePrompt } = await import('#services/model_budget_ledger')
    assert.equal(etapaDePrompt('Eres evaluador técnico de restaurantes. Revisas UNA respuesta'), 'practico:extraccion')
    assert.equal(etapaDePrompt('Revisa si cada frase de una respuesta de examen hace'), 'practico:confirmar_elementos')
    assert.equal(etapaDePrompt('Evalúas UNA competencia de un candidato'), 'competencias:extraccion')
    assert.equal(etapaDePrompt('Evalúas UNA competencia…\nEn estas respuestas no se extrajo ningún RELATO'), 'competencias:relatos_omitidos')
    assert.equal(etapaDePrompt('Preguntas cerradas sobre frases', 'competencias:reintento_confirmacion'), 'competencias:reintento_confirmacion')
  })

  test('sin libro compartido, un tope en el entorno no envía nada', async ({ assert }) => {
    const m = await import('#services/model_budget')
    const antes = { ...process.env }
    try {
      m._reiniciarControlParaPruebas()
      process.env.PRESUPUESTO_USD = '5'
      process.env.PRECIO_ENTRADA_USD_POR_MTOK = '2.5'
      process.env.PRECIO_SALIDA_USD_POR_MTOK = '10'
      delete process.env.PRESUPUESTO_DB_URL
      delete process.env.PRESUPUESTO_ID
      delete process.env.PRESUPUESTO_SOLO_LOCAL
      await assert.rejects(async () => {
        await m.controlDelEntorno()
      }, /libro compartido/)
    } finally {
      process.env = antes
      m._reiniciarControlParaPruebas()
    }
  })
})
