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
