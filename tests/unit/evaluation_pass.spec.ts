import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { mergeSignals, newShortCode, previewStatus, sha256 } from '#services/evaluation_pass'
import type EvaluationPass from '#models/evaluation_pass'

// Pase presencial (2026-10-27): partes puras del servicio.
const pass = (over: Partial<EvaluationPass>) =>
  ({
    status: 'issued',
    sessionHash: null,
    claimOpen: true,
    claimDeadlineAt: DateTime.now().plus({ hours: 1 }),
    ...over,
  }) as EvaluationPass

test.group('pase presencial — estado público', () => {
  test('disponible, en uso, terminado, vencido y en pausa', ({ assert }) => {
    assert.equal(previewStatus(pass({})), 'available')
    assert.equal(previewStatus(pass({ sessionHash: 'x' })), 'in_use')
    assert.equal(previewStatus(pass({ status: 'completed', sessionHash: 'x' })), 'completed')
    assert.equal(
      previewStatus(pass({ claimDeadlineAt: DateTime.now().minus({ minutes: 1 }) })),
      'expired'
    )
    assert.equal(previewStatus(pass({ status: 'in_progress', claimOpen: false })), 'needs_staff')
  })
})

test.group('pase presencial — interrupciones (informativo)', () => {
  test('suma conteos y tiempos', ({ assert }) => {
    const a = mergeSignals(null, {
      hiddenCount: 2,
      hiddenMs: 5000,
      reloads: 1,
      stepMs: { 1: 1000 },
    })
    const b = mergeSignals(a, {
      hiddenCount: 1,
      hiddenMs: 1000,
      pasteCount: 1,
      pasteFields: ['psych:q3'],
      stepMs: { 1: 500, 2: 2000 },
    })
    assert.equal(b.hiddenCount, 3)
    assert.equal(b.hiddenMs, 6000)
    assert.equal(b.pasteCount, 1)
    assert.deepEqual(b.pasteFields, ['psych:q3'])
    assert.deepEqual(b.stepMs, { 1: 1500, 2: 2000, 3: 0 })
  })

  test('nunca guarda texto: sólo identificadores de campo con formato fijo', ({ assert }) => {
    const s = mergeSignals(null, {
      pasteCount: 2,
      pasteFields: ['psych:q3', 'Esto es lo que pegó el candidato', 'step1:firstName'],
      clipboard: 'texto secreto',
    })
    assert.deepEqual(s.pasteFields, ['psych:q3', 'step1:firstName'])
    assert.notInclude(JSON.stringify(s), 'secreto')
  })

  test('valores negativos, basura o enormes se acotan', ({ assert }) => {
    const s = mergeSignals(null, {
      hiddenCount: -5,
      hiddenMs: 'abc',
      offlineMs: 10 ** 12,
      reloads: 1e9,
    })
    assert.equal(s.hiddenCount, 0)
    assert.equal(s.hiddenMs, 0)
    assert.equal(s.offlineMs, 6 * 3_600_000)
    assert.equal(s.reloads, 100)
  })
})

test.group('pase presencial — códigos', () => {
  test('código corto de 6, sin caracteres ambiguos', ({ assert }) => {
    for (let i = 0; i < 200; i++) assert.match(newShortCode(), /^[A-HJKMNP-Z2-9]{6}$/)
  })
  test('el token se guarda sólo como hash', ({ assert }) => {
    assert.lengthOf(sha256('token'), 64)
    assert.notEqual(sha256('token'), 'token')
  })
})
