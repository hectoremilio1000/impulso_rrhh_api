import { test } from '@japa/runner'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Consultar nunca califica (auditoría de gasto, 2026-11-20). Ningún GET puede
// llegar al modelo: la calificación sólo ocurre al enviar el examen (POST
// submit) o al pedirla explícitamente (POST grade-reviewed).
const raiz = fileURLToPath(new URL('../../', import.meta.url))
const leer = (p: string) => readFileSync(raiz + p, 'utf8')
const CALIFICA =
  /\b(grade\w*|submitExam|gradeAndSave|gradeExamJson|gradeConRubrica|gradeCompetencias|gradePsychExam|gradePracticalExam)\s*\(|chat\.completions/

/** Cuerpo del método `async nombre(` de una clase (hasta el siguiente método). */
function cuerpo(src: string, metodo: string): string | null {
  const i = src.search(new RegExp(`\\n\\s+async ${metodo}\\s*\\(`))
  if (i < 0) return null
  const resto = src.slice(i + 1)
  const fin = resto.slice(1).search(/\n\s+(async |private |public |static )?[a-zA-Z_]\w*\s*\(.*\)\s*(:[^{]*)?\{\s*\n/)
  return fin < 0 ? resto : resto.slice(0, fin + 1)
}

test.group('consultar nunca califica', () => {
  const rutas = leer('start/routes.ts')
  const controladores = new Map<string, string>()
  for (const m of rutas.matchAll(/const (\w+Controller) = \(\) =>\s*import\('#controllers\/(\w+)'\)/g))
    controladores.set(m[1], `app/controllers/${m[2]}.ts`)
  const gets = [...rutas.matchAll(/router\.get\(\s*[`'"]([^`'"]+)[`'"]\s*,\s*\[(\w+),\s*'(\w+)'\]/g)].map((m) => ({
    ruta: m[1],
    ctrl: m[2],
    metodo: m[3],
  }))

  test('hay GETs que revisar y todos apuntan a un controlador conocido', ({ assert }) => {
    assert.isAbove(gets.length, 5)
    for (const g of gets) assert.isTrue(controladores.has(g.ctrl), `${g.ruta} → ${g.ctrl}`)
  })

  test('ningún GET llama a la calificación ni al modelo', ({ assert }) => {
    for (const g of gets) {
      const src = leer(controladores.get(g.ctrl)!)
      const b = cuerpo(src, g.metodo)
      assert.isNotNull(b, `${g.ctrl}.${g.metodo} no encontrado`)
      assert.notMatch(b!, CALIFICA, `GET ${g.ruta} (${g.ctrl}.${g.metodo}) llama a calificar`)
    }
  })

  test('los GET en línea de routes.ts tampoco califican', ({ assert }) => {
    for (const m of rutas.matchAll(/router\.get\([^\n]*async[\s\S]*?\n\}\)/g)) assert.notMatch(m[0], CALIFICA)
  })

  test('la calificación sí está en los POST previstos (el detector funciona)', ({ assert }) => {
    const rev = leer('app/controllers/evaluation_reviews_controller.ts')
    assert.match(cuerpo(rev, 'gradeReviewed')!, CALIFICA)
    const prac = leer('app/controllers/public_practical_tests_controller.ts')
    assert.match(cuerpo(prac, 'submit')!, CALIFICA)
  })
})
