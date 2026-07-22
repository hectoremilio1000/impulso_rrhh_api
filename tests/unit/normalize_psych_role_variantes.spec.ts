import { test } from '@japa/runner'
import { normalizePsychRole } from '#controllers/public_controller'

/**
 * Variantes REALES de `desired_role` encontradas en producción (auditoría 2026-07-20).
 *
 * Antes de este fix, normalizePsychRole sólo canonicalizaba las variantes de chef;
 * el resto se comparaba letra por letra contra VALID_ROLES_ES y lo que no coincidía
 * caía en silencio al prompt de 'Mesero'. Conteo real en la tabla `candidates`:
 *
 *   "Capitan"               107   ← sin acento, el más grande
 *   "Cocinero "              90   ← espacio al final (el trim ya lo cubría)
 *   "subgerente"             25   ← minúscula
 *   "Capitán de meseros "     8   ← contiene "meseros": el orden de reglas importa
 *   "Mesera"                  6
 *   "Bartender "              3
 *   "Jefe de barra"           2
 *   "Cocinera "               1
 *   "Encargado de cocina "    1
 *
 * ≈159 candidatos (1 de cada 4) contestaban el examen de su puesto y se
 * calificaban con el de Mesero.
 */

test.group('normalizePsychRole — variantes reales de producción', () => {
  test('"Capitan" sin acento (107 candidatos) → "Capitán"', ({ assert }) => {
    assert.equal(normalizePsychRole('Capitan'), 'Capitán')
  })

  test('"capitán" minúscula → "Capitán"', ({ assert }) => {
    assert.equal(normalizePsychRole('capitán'), 'Capitán')
  })

  test('"Capitán de meseros " (8) → "Capitán", NO "Mesero"', ({ assert }) => {
    // Regresión de orden: contiene "meseros". Si el check de mesero corriera
    // antes que el de capitán, estos 8 candidatos se calificarían mal.
    assert.equal(normalizePsychRole('Capitán de meseros '), 'Capitán')
  })

  test('"subgerente" minúscula (25) → "Subgerente"', ({ assert }) => {
    assert.equal(normalizePsychRole('subgerente'), 'Subgerente')
  })

  test('"Sub Gerente " con espacio → "Subgerente"', ({ assert }) => {
    assert.equal(normalizePsychRole('Sub Gerente '), 'Subgerente')
  })

  test('"Mesera" (6) → "Mesero"', ({ assert }) => {
    assert.equal(normalizePsychRole('Mesera'), 'Mesero')
  })

  test('"Bartender " (3) → "Barman"', ({ assert }) => {
    assert.equal(normalizePsychRole('Bartender '), 'Barman')
  })

  test('"Jefe de barra" (2) → "Barman"', ({ assert }) => {
    assert.equal(normalizePsychRole('Jefe de barra'), 'Barman')
  })

  test('"Cocinera " (1) → "Cocinero"', ({ assert }) => {
    assert.equal(normalizePsychRole('Cocinera '), 'Cocinero')
  })

  test('"Encargado de cocina " (1) → "Cocinero"', ({ assert }) => {
    assert.equal(normalizePsychRole('Encargado de cocina '), 'Cocinero')
  })
})

test.group('normalizePsychRole — no-regresión de prioridad', () => {
  test('"Chef gerente" → "Chef gerente" (chef gana sobre "gerente")', ({ assert }) => {
    assert.equal(normalizePsychRole('Chef gerente'), 'Chef gerente')
  })

  test('"Chef y Gerente " → "Chef gerente"', ({ assert }) => {
    assert.equal(normalizePsychRole('Chef y Gerente '), 'Chef gerente')
  })

  test('"Cocinero" NO colisiona con chef', ({ assert }) => {
    assert.equal(normalizePsychRole('Cocinero'), 'Cocinero')
  })

  test('los 6 labels canónicos son idempotentes', ({ assert }) => {
    for (const rol of ['Mesero', 'Capitán', 'Cocinero', 'Barman', 'Chef gerente', 'Subgerente']) {
      assert.equal(normalizePsychRole(rol), rol, `${rol} debe devolverse igual`)
    }
  })

  test('puesto ajeno al restaurante se devuelve crudo (el whitelist decide el fallback)', ({
    assert,
  }) => {
    // "Programador Full Stack" existe en prod (3 candidatos). No mapea a ningún
    // puesto de piso: debe caer al fallback CON su logger.warn, no adivinarse.
    assert.equal(normalizePsychRole('Programador Full Stack'), 'Programador Full Stack')
  })

  test('cadena vacía y whitespace → cadena vacía', ({ assert }) => {
    assert.equal(normalizePsychRole(''), '')
    assert.equal(normalizePsychRole('   '), '')
  })
})
