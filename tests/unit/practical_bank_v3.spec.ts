import { test } from '@japa/runner'
import { fingerprintQuestions } from '#services/bank_fingerprint'
import {
  BANCOS_SUBGERENTE,
  BANCO_SUBGERENTE_V2,
  BANCO_SUBGERENTE_V3,
} from '#services/practical_banks/assistant_manager'
import { RUBRICA_SUBGERENTE } from '#services/practical_rubrics/assistant_manager'
import { RUBRICA_SUBGERENTE_V2 } from '#services/practical_rubrics/assistant_manager_v2'
import { RUBRICA_SUBGERENTE_V3 } from '#services/practical_rubrics/assistant_manager_v3'
import { CURRENT_BANK_FINGERPRINT, decideEvaluationRole } from '#services/role_catalog'

const decide = (huella: string) =>
  decideEvaluationRole({
    kind: 'practical',
    test: { testName: 'PRACTICAL_ASSISTANT_MANAGER_V1', roleCode: 'assistant_manager' } as any,
    desiredRole: 'Subgerente',
    shownRoleCode: 'assistant_manager',
    answersFingerprint: huella,
  }).status

test.group('práctico Subgerente — banco v3', () => {
  test('fuera del piloto el banco vigente de Subgerente sigue siendo el v1', ({ assert }) => {
    // La v3 queda lista para cuando Subgerente entre al piloto (2026-11-19).
    assert.equal(CURRENT_BANK_FINGERPRINT.practical.assistant_manager, BANCOS_SUBGERENTE.v1.huella)
  })

  test('v3 conserva 1, 3, 9 y 12 de la v2 y reescribe las otras ocho', ({ assert }) => {
    const cambiadas = BANCO_SUBGERENTE_V3.map((q, i) =>
      q !== BANCO_SUBGERENTE_V2[i] ? i + 1 : 0
    ).filter(Boolean)
    assert.deepEqual(cambiadas, [2, 4, 5, 6, 7, 8, 10, 11])
    const rub = RUBRICA_SUBGERENTE_V3.filter(
      (p, i) => JSON.stringify(p) !== JSON.stringify(RUBRICA_SUBGERENTE_V2[i])
    ).map((p) => p.q)
    assert.deepEqual(rub, [2, 4, 5, 6, 7, 8, 10, 11])
  })

  test('las indispensables son las del documento de diseño (v1)', ({ assert }) => {
    assert.deepEqual(
      RUBRICA_SUBGERENTE_V3.map((p) => p.indispensable),
      RUBRICA_SUBGERENTE.map((p) => p.indispensable)
    )
  })

  test('ninguna pregunta v3 enumera lo que se califica', ({ assert }) => {
    const pistas =
      /incluye|ejemplos?:|da \d+ ejemplos|qu[eé] le dices a cocina|qu[eé] criterios|checklist|cu[aá]ndo escalas|qu[eé] le ofreces/i
    for (const q of BANCO_SUBGERENTE_V3) assert.notMatch(q, pistas)
  })

  test('fuera del piloto sólo la v1 se califica; v2, v3 o uno ajeno van a revisión', ({
    assert,
  }) => {
    // Fuera del piloto sólo se presenta la v1; v2 y v3 nunca se mostraron a
    // candidatos, así que una respuesta a ellas va a revisión.
    assert.equal(decide(BANCOS_SUBGERENTE.v1.huella), 'ok')
    assert.equal(decide(BANCOS_SUBGERENTE.v3.huella), 'review')
    assert.equal(decide(BANCOS_SUBGERENTE.v2.huella), 'review')
    assert.equal(decide(fingerprintQuestions(['otra'])), 'review')
  })
})
