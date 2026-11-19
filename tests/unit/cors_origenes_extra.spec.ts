import { test } from '@japa/runner'
import { origenesExtra } from '#config/cors'

test.group('CORS · orígenes extra por ambiente', () => {
  test('lista separada por coma, sin diagonal final; lo inválido se ignora', ({ assert }) => {
    assert.deepEqual(
      origenesExtra(' https://impulsoadminfrontdev-dev.up.railway.app/ , http://localhost:4000,no-es-url, https://a.com/ruta'),
      ['https://impulsoadminfrontdev-dev.up.railway.app', 'http://localhost:4000']
    )
  })

  test('sin variable no agrega nada (producción queda igual)', ({ assert }) => {
    assert.deepEqual(origenesExtra(undefined), [])
    assert.deepEqual(origenesExtra(''), [])
  })
})
