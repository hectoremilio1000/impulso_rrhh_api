import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

// Estima SIN MODELO cuánto costaría calificar casos: corre los calificadores
// reales con un modelo simulado que acredita todo (peor caso de llamadas de
// confirmación) y cuenta los tokens de cada prompt real.
//   node ace exam:estimar-costo --casos=<dir con caso_*.json> --salida=estimacion.json
export default class ExamEstimarCosto extends BaseCommand {
  static commandName = 'exam:estimar-costo'
  static description = 'Estima tokens y costo de calificar casos, sin llamar al modelo'
  static options: CommandOptions = { startApp: true }

  @flags.string({ required: true }) declare casos: string
  @flags.string({ required: true }) declare salida: string
  @flags.number({ default: 2.5 }) declare entrada: number
  @flags.number({ default: 10 }) declare salidaPrecio: number

  async run() {
    const { gradeConRubrica } = await import('#services/practical_rubric_grader')
    const { gradeCompetencias } = await import('#services/competency_grader')
    const idx = await import('#services/exam_catalog/index')
    const { tokensEntradaMax } = await import('#services/model_budget')
    let tin = 0
    let tout = 0
    let llamadas = 0
    const porRol: Record<string, { usd: number; casos: number }> = {}
    const SALIDA: [RegExp, number][] = [
      [/MALA PRÁCTICA|Pregunta cerrada/, 120],
      [/ELEMENTOS ACREDITADOS/, 250],
      [/Evalúas UNA competencia/, 500],
    ]
    for (const f of readdirSync(this.casos).filter((x) => /^caso_.*\.json$/.test(x))) {
      const c = JSON.parse(readFileSync(`${this.casos}/${f}`, 'utf8'))
      const ficha = idx.fichaDe(c.rol)
      if (!ficha) continue
      let usd = 0
      const llm = async (prompt: string) => {
        const i = tokensEntradaMax(prompt)
        const o = SALIDA.find(([re]) => re.test(prompt))?.[1] ?? 400
        tin += i
        tout += o
        llamadas++
        usd += (i * this.entrada + o * this.salidaPrecio) / 1e6
        if (/MALA PRÁCTICA|Pregunta cerrada/.test(prompt)) return { confirma: false }
        if (/ELEMENTOS ACREDITADOS/.test(prompt)) return { elementos: [] }
        if (/Evalúas UNA competencia/.test(prompt)) return { evidencias: [] }
        // Primera pasada del práctico: acredita todo y señala un error (peor caso).
        const q = idx.preguntasAbiertas(ficha).find((p) => prompt.includes(p.evalua))
        return {
          elementos: (q?.esenciales ?? []).map((e) => ({ id: e.id, presente: true, cita: 'x' })),
          errores: (q?.erroresCriticos ?? [])
            .slice(0, 1)
            .map((e) => ({ id: e.id, presente: true, cita: 'x' })),
        }
      }
      const ans = (arr: string[], qs: string[]) =>
        Object.fromEntries(qs.map((q, i) => [`q${i + 1}`, { question: q, answer: arr[i] ?? '' }]))
      await gradeConRubrica({
        rol: ficha.label,
        rubrica: idx.preguntasAbiertas(ficha),
        numericas: idx.preguntasNumericas(ficha),
        dimensiones: ficha.practico.dimensiones,
        answers: ans(c.practico, idx.enunciadosPractico(ficha)),
        preguntasBanco: idx.enunciadosPractico(ficha),
        version: {},
        passThreshold: 70,
        llm,
      })
      await gradeCompetencias({
        ficha,
        answers: ans(c.competencias, idx.enunciadosCompetencias(ficha)),
        version: {},
        llm,
      })
      porRol[c.rol] = {
        usd: (porRol[c.rol]?.usd ?? 0) + usd,
        casos: (porRol[c.rol]?.casos ?? 0) + 1,
      }
    }
    const total = (tin * this.entrada + tout * this.salidaPrecio) / 1e6
    writeFileSync(
      this.salida,
      JSON.stringify({ llamadas, tokensEntrada: tin, tokensSalida: tout, usdUnaCorrida: total, porRol }, null, 1)
    )
    this.logger.success(`${llamadas} llamadas · US$${total.toFixed(2)} por corrida de todos los casos`)
  }
}
