import { test } from '@japa/runner'
import { roleToCode } from '#controllers/public_apply_full_controller'

/**
 * Mapper público desiredRole → roleCode interno.
 *
 * Cierra la asimetría histórica con el frontend (ExamRunner.roleFromDesiredRole
 * en impulso_admin_front_page ya usaba includes("chef"); este mapper usaba ===
 * estricto solo contra "chef gerente" / "chef_gerente"). Resultado del bug:
 * 16 candidatos en producción con desiredRole="Chef" o "Chef y Gerente"
 * cayeron al fallback 'waiter' y se evaluaron con prompt Mesero.
 *
 * Cobertura:
 *   - Las 3 variantes vivas en producción de chef → chef_manager.
 *   - Casos canónicos para los otros 5 roles → su roleCode esperado.
 *   - NO-COLISIÓN: "cocinero" NO debe caer a chef_manager pese a que el
 *     check de chef usa includes. Si esta aserción falla, el orden del
 *     mapper rompió la prioridad.
 *   - Variantes futuras razonables (Sous chef, Chef ejecutivo) → chef_manager
 *     por includes. Si en algún momento esos roles deben mapear distinto,
 *     insertar un check === ANTES del includes(chef).
 *   - Fallback documentado: cadenas desconocidas o vacías → waiter.
 */

test.group('roleToCode mapper público (public_apply_full_controller)', () => {
  test('Chef gerente (variante histórica, 7 candidatos en prod) → chef_manager', ({ assert }) => {
    assert.equal(roleToCode('Chef gerente'), 'chef_manager')
  })

  test('chef_gerente (variante con underscore) → chef_manager', ({ assert }) => {
    assert.equal(roleToCode('chef_gerente'), 'chef_manager')
  })

  test('Chef (10 candidatos en prod, antes caían a waiter por mapper estricto) → chef_manager', ({
    assert,
  }) => {
    assert.equal(roleToCode('Chef'), 'chef_manager')
  })

  test('Chef y Gerente (6 candidatos en prod, antes caían a waiter) → chef_manager', ({
    assert,
  }) => {
    assert.equal(roleToCode('Chef y Gerente'), 'chef_manager')
  })

  test('CHEF mayúsculas (normalización .toLowerCase) → chef_manager', ({ assert }) => {
    assert.equal(roleToCode('CHEF'), 'chef_manager')
  })

  test('Sous chef (variante razonable, hoy capturada por includes) → chef_manager', ({
    assert,
  }) => {
    // Si en el futuro sous chef debe mapear a un roleCode distinto,
    // agregar `if (v.includes('sous')) return 'sous_chef'` ANTES del
    // check de chef.
    assert.equal(roleToCode('Sous chef'), 'chef_manager')
  })

  test('Mesero (control) → waiter', ({ assert }) => {
    assert.equal(roleToCode('Mesero'), 'waiter')
  })

  test('NO-COLISIÓN: Cocinero NO contiene "chef" como substring → cook (no chef_manager)', ({
    assert,
  }) => {
    // Verificación estructural del orden del mapper. Cocinero (L15) se
    // evalúa ANTES del check chef (L17); además 'cocinero'.includes('chef')
    // es false. Si esta aserción falla, alguien rompió uno de los dos.
    assert.equal(roleToCode('Cocinero'), 'cook')
  })

  test('Capitán → captain', ({ assert }) => {
    assert.equal(roleToCode('Capitán'), 'captain')
  })

  test('Capitan sin tilde → captain', ({ assert }) => {
    assert.equal(roleToCode('Capitan'), 'captain')
  })

  test('Barman → barman', ({ assert }) => {
    assert.equal(roleToCode('Barman'), 'barman')
  })

  test('Bartender → barman', ({ assert }) => {
    assert.equal(roleToCode('Bartender'), 'barman')
  })

  test('Subgerente (definido DESPUÉS del check chef en el mapper) → assistant_manager', ({
    assert,
  }) => {
    // Si chef colisionara con substring "chef" en "subgerente" (no lo
    // hace, pero validamos), Subgerente caería a chef_manager. Esta
    // aserción protege ese contrato.
    assert.equal(roleToCode('Subgerente'), 'assistant_manager')
  })

  test('Cadena vacía → waiter (fallback documentado)', ({ assert }) => {
    assert.equal(roleToCode(''), 'waiter')
  })

  test('Rol desconocido → waiter (fallback documentado)', ({ assert }) => {
    assert.equal(roleToCode('Algo no estandar'), 'waiter')
  })
})
