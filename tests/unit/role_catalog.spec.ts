import { test } from '@japa/runner'
import {
  CURRENT_BANK_FINGERPRINT,
  bankVersionFromTestName,
  decideEvaluationRole,
  evaluatedRoleOf,
  toRoleCode,
  resolveRoleCode,
  roleCodeFromTestName,
} from '#services/role_catalog'

/**
 * Tabla de casos compartida con el front (src/lib/roleCatalog.test.ts en
 * impulso_admin_front_page). Si cambias una fila aquí, cámbiala allá: los dos
 * lados deben resolver igual para que el examen mostrado y el calificado
 * sean el mismo.
 */
const CASOS: Array<[string, string | null]> = [
  ['Mesero', 'waiter'],
  ['Mesera', 'waiter'],
  ['Capitán', 'captain'],
  ['Capitan', 'captain'],
  ['Capitán de meseros', 'captain'],
  ['Cocinero', 'cook'],
  ['Cocinera', 'cook'],
  ['Encargado de cocina', 'cook'],
  ['Barman', 'barman'],
  ['Bartender', 'barman'],
  ['Jefe de barra', 'barman'],
  ['Chef gerente', 'chef_manager'],
  ['Chef y Gerente', 'chef_manager'],
  ['chef_gerente', 'chef_manager'],
  ['Subgerente', 'assistant_manager'],
  ['Sub Gerente', 'assistant_manager'],
  // Puestos sin examen propio: no se adivinan.
  ['Gerente', null],
  ['Gerente general', null],
  ['Gerente operativo', null],
  ['Encargado', null],
  ['', null],
]

test.group('resolveRoleCode — tabla compartida front/back', () => {
  for (const [entrada, esperado] of CASOS) {
    test(`"${entrada}" → ${esperado}`, ({ assert }) => {
      assert.equal(resolveRoleCode(entrada), esperado)
    })
  }
})

test.group('roleCodeFromTestName', () => {
  test('lee el código de psych y práctico', ({ assert }) => {
    assert.equal(roleCodeFromTestName('PSYCH_ASSISTANT_MANAGER_V1'), 'assistant_manager')
    assert.equal(roleCodeFromTestName('PRACTICAL_CHEF_MANAGER_V1'), 'chef_manager')
    assert.equal(roleCodeFromTestName('PSYCH_WAITER_V1'), 'waiter')
  })

  test('código desconocido o formato libre → null', ({ assert }) => {
    assert.isNull(roleCodeFromTestName('PSYCH_GENERAL_MANAGER_V1'))
    assert.isNull(roleCodeFromTestName('Examen de prueba'))
    assert.isNull(roleCodeFromTestName(null))
  })
})

const T = (testName: string, extra: Record<string, unknown> = {}) => ({ testName, ...extra })
const decide = (testName: string, desiredRole: string | null, extra: Record<string, unknown> = {}, shown?: string, fp?: string) =>
  decideEvaluationRole({ kind: 'psych', test: T(testName, extra), desiredRole, shownRoleCode: shown, answersFingerprint: fp })
const reason = (d: ReturnType<typeof decideEvaluationRole>) => (d.status === 'review' ? d.reason : d.status)

test.group('decideEvaluationRole — puesto fijado al asignar', () => {
  test('coinciden prueba y puesto actual → ok', ({ assert }) => {
    assert.deepEqual(decide('PSYCH_CAPTAIN_V1', 'Capitan'), { status: 'ok', code: 'captain' })
  })

  test('role_code de la columna manda sobre testName', ({ assert }) => {
    assert.deepEqual(decide('PSYCH_WAITER_V1', 'Capitán', { roleCode: 'captain' }), { status: 'ok', code: 'captain' })
  })

  test('alias "Sub Gerente" y "Jefe de barra" con su prueba → ok', ({ assert }) => {
    assert.equal(decide('PSYCH_ASSISTANT_MANAGER_V1', 'Sub Gerente').status, 'ok')
    assert.equal(decide('PSYCH_BARMAN_V1', 'Jefe de barra').status, 'ok')
  })

  test('histórico de Gerente con prueba de Mesero → revisión, nunca Mesero', ({ assert }) => {
    assert.equal(reason(decide('PSYCH_WAITER_V1', 'Gerente')), 'unknown_desired_role')
  })

  test('alias con prueba de otro puesto → revisión', ({ assert }) => {
    assert.equal(reason(decide('PSYCH_WAITER_V1', 'Sub Gerente')), 'role_mismatch')
    assert.equal(reason(decide('PSYCH_WAITER_V1', 'Jefe de barra')), 'role_mismatch')
  })

  test('cambio de puesto antes de presentar → revisión', ({ assert }) => {
    assert.equal(reason(decide('PSYCH_CAPTAIN_V1', 'Subgerente')), 'role_mismatch')
  })

  test('error de identificación confirmado con motivo → ok con el puesto asignado', ({ assert }) => {
    const log = [{ action: 'confirm_role', roleCode: 'captain', reason: 'x', at: '', actor: 'a' }]
    assert.deepEqual(decide('PSYCH_CAPTAIN_V1', 'Encargado de piso', { reviewLog: log }), {
      status: 'ok',
      code: 'captain',
    })
  })

  test('la confirmación de otro puesto no sirve', ({ assert }) => {
    const log = [{ action: 'confirm_role', roleCode: 'waiter', reason: 'x', at: '', actor: 'a' }]
    assert.equal(reason(decide('PSYCH_CAPTAIN_V1', 'Gerente', { reviewLog: log })), 'unknown_desired_role')
  })

  test('el front mostró un examen distinto al asignado → revisión', ({ assert }) => {
    assert.equal(reason(decide('PSYCH_CAPTAIN_V1', 'Capitán', {}, 'waiter')), 'shown_role_mismatch')
  })

  test('banco contestado distinto al vigente → revisión', ({ assert }) => {
    assert.equal(reason(decide('PSYCH_WAITER_V1', 'Mesero', {}, 'waiter', '52-0000000000000000')), 'bank_mismatch')
    assert.equal(
      decide('PSYCH_WAITER_V1', 'Mesero', {}, 'waiter', CURRENT_BANK_FINGERPRINT.psych.waiter).status,
      'ok'
    )
  })

  test('instrumento externo ("DISC") nunca es examen Impulso', ({ assert }) => {
    assert.equal(decide('DISC', 'Cocinero').status, 'external')
    assert.equal(decide('PSYCH_COOK_V1', 'Cocinero', { instrument: 'external' }).status, 'external')
  })

  test('prueba reemplazada → superseded', ({ assert }) => {
    assert.deepEqual(decide('PSYCH_COOK_V1', 'Cocinero', { supersededById: 9 }), {
      status: 'superseded',
      supersededById: 9,
    })
  })

  test('puesto desconocido → revisión', ({ assert }) => {
    assert.equal(reason(decide('PSYCH_WAITER_V1', 'Programador')), 'unknown_desired_role')
  })
})

test.group('evaluatedRoleOf — una evaluación terminada conserva su puesto', () => {
  test('no depende del puesto actual del candidato', ({ assert }) => {
    assert.equal(evaluatedRoleOf('psych', { testName: 'PSYCH_CAPTAIN_V1' }), 'captain')
    assert.equal(evaluatedRoleOf('practical', { testName: 'PRACTICAL_COOK_V1', roleCode: 'cook' }), 'cook')
    assert.isNull(evaluatedRoleOf('psych', { testName: 'DISC' }))
  })
})

test.group('bankVersionFromTestName', () => {
  test('versión del nombre (no identifica el banco)', ({ assert }) => {
    assert.equal(bankVersionFromTestName('PSYCH_WAITER_V1'), 'V1')
    assert.isNull(bankVersionFromTestName('DISC'))
  })
})

test.group('toRoleCode — código del admin o texto libre', () => {
  test('acepta el código exacto que manda el panel', ({ assert }) => {
    assert.equal(toRoleCode('waiter'), 'waiter')
    assert.equal(toRoleCode('captain'), 'captain')
    assert.equal(toRoleCode('assistant_manager'), 'assistant_manager')
  })
  test('acepta texto libre y rechaza lo desconocido', ({ assert }) => {
    assert.equal(toRoleCode('Mesera'), 'waiter')
    assert.isNull(toRoleCode('general_manager'))
    assert.isNull(toRoleCode(42))
  })
})
