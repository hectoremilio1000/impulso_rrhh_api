import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { readFileSync, writeFileSync } from 'node:fs'

// Califica casos de prueba del examen práctico SIN tocar la base: sirve para
// comparar calificadores (antes/después) y medir la variación al recalificar.
//   node ace exam:practico-casos --casos=casos.json --rol=assistant_manager \
//     --calificador=ambos --corridas=3 --salida=resultados.json
// casos.json: [{ "id": "H1", "answers": { "q1": { "question": "…", "answer": "…" } } }]
export default class ExamPracticoCasos extends BaseCommand {
  static commandName = 'exam:practico-casos'
  static description =
    'Califica casos ficticios del práctico con el calificador anterior y/o el nuevo'
  static options: CommandOptions = { startApp: true }

  @flags.string({ required: true }) declare casos: string
  @flags.string({ default: 'assistant_manager' }) declare rol: string
  @flags.string({ description: 'anterior | nuevo | ambos', default: 'ambos' })
  declare calificador: string
  @flags.string({ description: 'practico | competencias', default: 'practico' })
  declare examen: string
  @flags.number({ default: 1 }) declare corridas: number
  @flags.string({ required: true }) declare salida: string

  async run() {
    const { gradePracticalExam, gradePracticalGenerico } = await import(
      '#services/practical_grader'
    )
    const { gradePsychExam } = await import('#services/psych_exam_grader')
    const { ROLE_LABEL_ES } = await import('#services/role_catalog')
    const casos: { id: string; rol?: string; answers: unknown }[] = JSON.parse(readFileSync(this.casos, 'utf8'))
    const usar = this.calificador === 'ambos' ? ['anterior', 'nuevo'] : [this.calificador]
    const out: Record<string, unknown>[] = []
    for (const caso of casos) {
      for (const cal of usar) {
        for (let i = 1; i <= this.corridas; i++) {
          // Cada caso puede traer su puesto (`rol`); si no, el de --rol.
          const rol = caso.rol ?? this.rol
          const r =
            this.examen === 'competencias'
              ? await gradePsychExam((ROLE_LABEL_ES as any)[rol] ?? rol, caso.answers, undefined, rol)
              : cal === 'anterior'
                ? await gradePracticalGenerico(rol, caso.answers)
                : await gradePracticalExam(rol, caso.answers)
          out.push({
            id: caso.id,
            rol: caso.rol ?? this.rol,
            examen: this.examen,
            calificador: cal,
            corrida: i,
            score: r.score,
            report: r.aiReport,
          })
          this.logger.info(`${caso.id} · ${cal} · corrida ${i} → ${r.score}`)
        }
      }
    }
    writeFileSync(this.salida, JSON.stringify(out, null, 1))
    this.logger.success(`Guardado en ${this.salida}`)
  }
}
