import { test } from '@japa/runner'
import { PUBLIC_SUBMIT_RESPONSE, publicExamView } from '#services/public_exam_view'

/**
 * El link público de un examen lo tiene cualquiera que lo reciba. Ninguna
 * respuesta pública puede llevar calificación, reporte de IA, respuestas,
 * notas ni el puesto escrito del candidato.
 */
const PROHIBIDAS = ['score', 'passed', 'aiReportJson', 'aiReport', 'answersJson', 'notes']

function claves(obj: unknown, prefijo = ''): string[] {
  if (!obj || typeof obj !== 'object') return []
  return Object.entries(obj).flatMap(([k, v]) => [`${prefijo}${k}`, ...claves(v, `${prefijo}${k}.`)])
}

test.group('publicExamView — lista blanca', () => {
  // Un modelo "sucio" con todo lo que hoy existe en la tabla.
  const testRow = {
    id: 7,
    testName: 'PSYCH_CAPTAIN_V1',
    assignedAt: '2026-10-01',
    takenAt: '2026-10-02',
    score: 91,
    passed: true,
    aiReportJson: { competenciesGuidara: { integridad: { score: 30 } } },
    answersJson: { q1: { question: 'x', answer: 'y' } },
    notes: 'nota interna',
    accessToken: 'tok',
  }
  const cand = { id: 3, firstName: 'Ana', lastName: 'Ruiz', desiredRole: 'Capitán' }

  test('no expone campos internos en ningún nivel', ({ assert }) => {
    const todas = claves(publicExamView('psych', testRow, cand))
    for (const p of PROHIBIDAS) {
      assert.isFalse(
        todas.some((k) => k.split('.').includes(p)),
        `"${p}" no debe salir en la vista pública`
      )
    }
    assert.notInclude(todas, 'candidate.desiredRole')
    assert.notInclude(todas, 'test.accessToken')
  })

  test('en revisión no dice el motivo al candidato', ({ assert }) => {
    const v = publicExamView('psych', testRow, { ...cand, desiredRole: 'Gerente' })
    assert.deepEqual(v.roleCheck, { status: 'review' })
  })

  test('ok entrega el código de puesto a mostrar', ({ assert }) => {
    assert.deepEqual(publicExamView('psych', testRow, cand).roleCheck, { status: 'ok', roleCode: 'captain' })
  })

  test('instrumento externo y prueba reemplazada no muestran examen', ({ assert }) => {
    assert.deepEqual(publicExamView('psych', { ...testRow, testName: 'DISC' }, cand).roleCheck, {
      status: 'external',
    })
    assert.deepEqual(publicExamView('psych', { ...testRow, supersededById: 8 }, cand).roleCheck, {
      status: 'superseded',
    })
  })

  test('el submit público sólo confirma recepción', ({ assert }) => {
    assert.deepEqual(PUBLIC_SUBMIT_RESPONSE, { ok: true })
  })
})
