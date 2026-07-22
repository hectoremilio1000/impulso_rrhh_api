import { test } from '@japa/runner'
import { gradePsychExam } from '#services/psych_exam_grader'

/**
 * Smoke EN VIVO del orquestador de calificación (gradePsychExam).
 *
 * Hace llamadas REALES a OpenAI, así que NO corre en el suite normal: sólo con
 *   RUN_PSYCH_LIVE=1 node ace test functional
 * Es la verificación de que el flujo por-eje que valimos a mano (rúbrica +
 * evidencia + gpt-4o) produce el reporte con la forma que el front espera.
 *
 * Usa respuestas de mentira construidas con contenido real, para no depender de
 * la base ni escribir en ella.
 */

const LIVE = process.env.RUN_PSYCH_LIVE === '1'

const EJES_EVAL = [
  'integridad',
  'autoconciencia',
  'empatia',
  'etica_trabajo',
  'inteligencia_curiosa',
  'optimismo_bondadoso',
]

// Respuestas de un candidato SÓLIDO a Mesero (contenido con conducta concreta).
function answersSolidas() {
  const base: Record<string, string> = {
    q1: 'Cuando veo que un cliente llega con prisa o mirando el reloj, le acerco la carta de lo que sale rápido y le aviso los tiempos, así no se desespera.',
    q3: 'Si me equivoco en una comanda lo reporto de una vez a mi capitán, corrijo con el cliente y me hago cargo, no espero a que lo cachen.',
    q4: 'Sé que me cuesta la paciencia en horas pico; cuando me siento así respiro, priorizo mesas y pido apoyo en vez de tronarme con el equipo.',
    q7: 'En el cierre no me voy hasta dejar mi estación surtida y limpia para el turno de mañana, aunque ya sea mi hora.',
    q9: 'Cuando el turno se pone pesado le echo porras al equipo y reparto las mesas para que nadie se ahogue, prefiero que salgamos todos bien.',
    q18: 'Me gusta preguntar de dónde vienen los platillos y los maridajes para poder recomendar mejor y venderle más al cliente.',
  }
  const out: Record<string, { question: string; answer: string }> = {}
  for (let i = 1; i <= 37; i++) {
    out[`q${i}`] = { question: `Pregunta ${i}`, answer: base[`q${i}`] || base.q1 }
  }
  return out
}

test.group('gradePsychExam — smoke en vivo (por eje)', (group) => {
  group.tap((t) => (LIVE ? t : t.skip(true, 'Sólo con RUN_PSYCH_LIVE=1 (llama a OpenAI)')))

  test('produce el reporte con la forma que el front espera', async ({ assert }) => {
    const res = await gradePsychExam('Mesero', answersSolidas(), 99999)

    assert.equal(res.estrategia, 'por_eje', 'Mesero debe ir por la vía por-eje')
    assert.isObject(res.aiReport.competenciesGuidara)
    assert.lengthOf(Object.keys(res.aiReport.competenciesGuidara), 7)

    // conocimientos_practicos SIEMPRE null (se evalúa en el práctico).
    assert.isNull(res.aiReport.competenciesGuidara.conocimientos_practicos.score)

    // Un candidato sólido NO puede salir con todos los ejes evaluables en 0.
    const scores = EJES_EVAL.map((e) => res.aiReport.competenciesGuidara[e].score)
    const enCero = scores.filter((s) => s === 0).length
    assert.notEqual(enCero, EJES_EVAL.length, 'no todos los ejes pueden ser 0 (ese era el bug)')

    // score y passed coherentes.
    if (res.score !== null) {
      assert.isTrue(res.score >= 0 && res.score <= 100)
      assert.equal(res.passed, res.score >= 82)
    }
  }).timeout(120_000)
})
