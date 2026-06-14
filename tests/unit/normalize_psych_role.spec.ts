import { test } from '@japa/runner'
import { normalizePsychRole } from '#controllers/public_controller'

/**
 * Normalizer del flujo psych (psychSubmit en public_controller.ts).
 *
 * Espejo psych de roleToCode (PR Chef0-BE en public_apply_full_controller.ts).
 * Las 3 variantes vivas en producción de chef ("Chef gerente", "Chef",
 * "Chef y Gerente", incluyendo mayúsculas) canonicalizan a "Chef gerente"
 * — el label que VALID_ROLES_ES sí incluye y que el router de
 * buildPsychPrompt despacha a buildPromptGuidaraChef. Sin esta
 * normalización, "Chef" o "Chef y Gerente" caerían al fallback 'Mesero'
 * y se evaluarían con prompt de Mesero (mismo bug de los 16 candidatos
 * chef-mal-clasificados que motivó Chef0-BE en el flujo apply).
 *
 * Cobertura:
 *   - Las 3 variantes vivas en producción de chef (+ mayúsculas) → "Chef gerente".
 *   - NO-REGRESIÓN: los otros 5 roles del whitelist devuelven el texto crudo intacto.
 *   - NO-COLISIÓN: "Cocinero" NO debe normalizarse a "Chef gerente" pese a que el
 *     check chef usa includes. Si esta aserción falla, el orden del normalizer rompió
 *     la prioridad (mismo razonamiento que role_to_code.spec.ts).
 *   - Texto random NO-chef → devuelto intacto (el whitelist decide el fallback final
 *     a 'Mesero', no este normalizer).
 *   - Variantes futuras razonables (Sous chef, Chef ejecutivo) → "Chef gerente" por
 *     includes — si en el futuro deben distinguirse, insertar check === ANTES.
 */

test.group('normalizePsychRole — alias chef → "Chef gerente"', () => {
  test('"Chef gerente" (label canónico del whitelist) → "Chef gerente"', ({ assert }) => {
    assert.equal(normalizePsychRole('Chef gerente'), 'Chef gerente')
  })

  test('"Chef" (variante en prod, antes caía a Mesero por whitelist estricto) → "Chef gerente"', ({
    assert,
  }) => {
    assert.equal(normalizePsychRole('Chef'), 'Chef gerente')
  })

  test('"Chef y Gerente" (variante en prod, antes caía a Mesero) → "Chef gerente"', ({
    assert,
  }) => {
    assert.equal(normalizePsychRole('Chef y Gerente'), 'Chef gerente')
  })

  test('"CHEF" mayúsculas (normalización .toLowerCase) → "Chef gerente"', ({ assert }) => {
    assert.equal(normalizePsychRole('CHEF'), 'Chef gerente')
  })

  test('"chef gerente" minúsculas (normalización .toLowerCase) → "Chef gerente"', ({ assert }) => {
    assert.equal(normalizePsychRole('chef gerente'), 'Chef gerente')
  })

  test('"  Chef  " con whitespace (trim) → "Chef gerente"', ({ assert }) => {
    assert.equal(normalizePsychRole('  Chef  '), 'Chef gerente')
  })

  test('"Sous chef" (variante razonable, hoy capturada por includes) → "Chef gerente"', ({
    assert,
  }) => {
    // Si en el futuro Sous chef debe normalizarse distinto, insertar
    // un check === ANTES del includes. Misma anatomía que el spec de
    // roleToCode.
    assert.equal(normalizePsychRole('Sous chef'), 'Chef gerente')
  })
})

test.group('normalizePsychRole — NO-regresión otros 5 roles', () => {
  test('"Mesero" → "Mesero" (texto crudo intacto)', ({ assert }) => {
    assert.equal(normalizePsychRole('Mesero'), 'Mesero')
  })

  test('NO-COLISIÓN: "Cocinero" NO contiene "chef" como substring → "Cocinero" (no Chef gerente)', ({
    assert,
  }) => {
    // Verificación estructural: la palabra "cocinero" no comparte
    // substring con "chef". Si esta aserción fallara, alguien rompió
    // el includes o introdujo un alias mal.
    assert.equal(normalizePsychRole('Cocinero'), 'Cocinero')
  })

  test('"Capitán" → "Capitán"', ({ assert }) => {
    assert.equal(normalizePsychRole('Capitán'), 'Capitán')
  })

  test('"Barman" → "Barman"', ({ assert }) => {
    assert.equal(normalizePsychRole('Barman'), 'Barman')
  })

  test('"Subgerente" → "Subgerente"', ({ assert }) => {
    assert.equal(normalizePsychRole('Subgerente'), 'Subgerente')
  })
})

test.group('normalizePsychRole — texto desconocido pasa intacto (el whitelist decide fallback)', () => {
  test('cadena vacía → cadena vacía (sin trim collapse a undefined)', ({ assert }) => {
    assert.equal(normalizePsychRole(''), '')
  })

  test('cadena random sin chef → cadena intacta', ({ assert }) => {
    // El normalizer NO decide fallback — solo aplica alias chef. El
    // whitelist VALID_ROLES_ES en el caller psychSubmit decide qué
    // hacer con un texto que NO matchea (fallback a 'Mesero').
    assert.equal(normalizePsychRole('Algo no estandar'), 'Algo no estandar')
  })

  test('whitespace puro → cadena vacía (post-trim)', ({ assert }) => {
    assert.equal(normalizePsychRole('   '), '')
  })
})
