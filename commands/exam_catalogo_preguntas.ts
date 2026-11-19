import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { mkdirSync, writeFileSync } from 'node:fs'

// Exporta, por puesto, SOLO lo que ve el candidato (enunciado y tipo de
// captura), igual que lo entrega el link público. Sirve para darle a un
// revisor ciego las preguntas sin rúbricas, claves ni señales.
//   node ace exam:catalogo-preguntas --salida=dir
export default class ExamCatalogoPreguntas extends BaseCommand {
  static commandName = 'exam:catalogo-preguntas'
  static description = 'Exporta las preguntas visibles de cada puesto del catálogo'
  static options: CommandOptions = { startApp: true }

  @flags.string({ required: true }) declare salida: string
  @flags.boolean({ description: 'Exporta la ficha completa (rúbricas, claves, señales) para el revisor' })
  declare conRubrica: boolean

  async run() {
    const { CATALOGO, CATALOG_CODES, preguntasVisibles, huellaPractico, huellaCompetencias, huellaRubrica } =
      await import('#services/exam_catalog/index')
    mkdirSync(this.salida, { recursive: true })
    const indice: Record<string, unknown> = {}
    for (const c of CATALOG_CODES) {
      const f = CATALOGO[c]
      if (this.conRubrica) writeFileSync(`${this.salida}/${c}_ficha.json`, JSON.stringify(f, null, 1))
      writeFileSync(`${this.salida}/${c}_practico.json`, JSON.stringify(preguntasVisibles(f, 'practical'), null, 1))
      writeFileSync(`${this.salida}/${c}_competencias.json`, JSON.stringify(preguntasVisibles(f, 'psych'), null, 1))
      indice[c] = { puesto: f.label, practico: huellaPractico(f), competencias: huellaCompetencias(f), rubrica: huellaRubrica(f) }
    }
    writeFileSync(`${this.salida}/indice.json`, JSON.stringify(indice, null, 1))
    this.logger.success(`Guardado en ${this.salida}`)
  }
}
