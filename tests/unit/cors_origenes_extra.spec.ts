import { test } from '@japa/runner'
import { origenesExtra, origenFijoPermitido } from '#config/cors'

test.group('CORS · orígenes extra por ambiente', () => {
  test('lista separada por coma, sin diagonal final; lo inválido se ignora', ({ assert }) => {
    assert.deepEqual(
      origenesExtra(
        ' https://impulsoadminfrontdev-dev.up.railway.app/ , http://localhost:4000,no-es-url, https://a.com/ruta'
      ),
      ['https://impulsoadminfrontdev-dev.up.railway.app', 'http://localhost:4000']
    )
  })

  test('sin variable no agrega nada (producción queda igual)', ({ assert }) => {
    assert.deepEqual(origenesExtra(undefined), [])
    assert.deepEqual(origenesExtra(''), [])
  })
})

test.group('CORS · GrowthSuite Talento', () => {
  test('permite su dominio, su Vercel y la app de Android', ({ assert }) => {
    for (const o of [
      'https://talento.growthsuite.com.mx',
      'https://growthsuite-talento.vercel.app',
      'https://growthsuite-talento-abc123-hectoremilio1000-s-team.vercel.app',
      'https://localhost',
    ])
      assert.isTrue(origenFijoPermitido(o), o)
  })

  test('no abre otros subdominios ni imitaciones', ({ assert }) => {
    for (const o of [
      'https://growthsuite.com.mx',
      'https://otro.growthsuite.com.mx',
      'https://talento.growthsuite.com.mx.evil.com',
      'http://talento.growthsuite.com.mx',
      'https://growthsuite-talento.vercel.app.evil.com',
      'http://localhost',
      'https://localhost:8443',
    ])
      assert.isFalse(origenFijoPermitido(o), o)
  })

  test('lo que ya estaba sigue permitido', ({ assert }) => {
    assert.isTrue(origenFijoPermitido('https://www.impulsorestaurantero.com'))
    assert.isTrue(origenFijoPermitido('https://impulso-admin-front-page.vercel.app'))
    assert.isTrue(origenFijoPermitido('http://localhost:5173'))
  })
})
