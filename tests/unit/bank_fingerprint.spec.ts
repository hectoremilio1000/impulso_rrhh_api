import { test } from '@japa/runner'
import { fingerprintAnswers, fingerprintQuestions, questionsFromAnswers } from '#services/bank_fingerprint'

test.group('bank_fingerprint', () => {
  test('ordena por número de pregunta, no por orden de llegada', ({ assert }) => {
    const a = { q2: { question: 'B', answer: '' }, q10: { question: 'C', answer: '' }, q1: { question: 'A', answer: '' } }
    assert.deepEqual(questionsFromAnswers(a), ['A', 'B', 'C'])
  })

  test('ignora mayúsculas y espacios, no el texto', ({ assert }) => {
    assert.equal(fingerprintQuestions(['¿Hola  Mundo?']), fingerprintQuestions([' ¿hola mundo? ']))
    assert.notEqual(fingerprintQuestions(['¿Hola mundo?']), fingerprintQuestions(['¿Hola mundo!']))
  })

  test('incluye el número de preguntas', ({ assert }) => {
    assert.match(fingerprintQuestions(['a', 'b', 'c']), /^3-[0-9a-f]{16}$/)
  })

  test('respuestas sin texto de pregunta → null (no se puede identificar el banco)', ({ assert }) => {
    assert.isNull(fingerprintAnswers({ q1: 'sólo respuesta' }))
    assert.isNull(fingerprintAnswers(null))
  })

  test('vector fijo compartido con el front (src/lib/bankFingerprint.test.ts)', ({ assert }) => {
    assert.equal(fingerprintQuestions(['¿Qué haces si un cliente se queja?', 'Describe tu último turno']), FIXED)
  })
})

const FIXED = '2-6fff40f1d4330946'
