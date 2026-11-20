import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

// Estima SIN MODELO cuánto costaría calificar casos: corre los calificadores
// reales con un modelo simulado y cuenta los tokens de cada prompt real.
//   node ace exam:estimar-costo --casos=<dir con caso_*.json> --salida=estimacion.json
//
// Auditoría de gasto (2026-11-20): la versión anterior decía «peor caso» pero
// devolvía citas inexistentes ('x') y competencias sin evidencia, así que el
// verificador literal descartaba todo y NUNCA contaba confirmaciones,
// reintentos, recuperaciones ni alertas (396 llamadas estimadas frente a 763
// reales). Ahora el simulador recorre la ruta MÁS CARA: citas literales de la
// respuesta (pasan la verificación), un error crítico propuesto y descartado
// por pregunta (dispara su confirmación y la de elementos), una cita
// reformulada (dispara la recuperación), competencias con dos citas por
// pregunta, primera confirmación inválida (dispara el reintento), relatos
// omitidos y una alerta confirmada por eje.
//
// Dos cifras: «maximo» usa max_tokens de salida (lo que reserva el tope de
// gasto) y «esperado» la salida media observada por llamada.
export default class ExamEstimarCosto extends BaseCommand {
  static commandName = 'exam:estimar-costo'
  static description = 'Estima tokens y costo máximo de calificar casos, sin llamar al modelo'
  static options: CommandOptions = { startApp: true }

  @flags.string({ required: true }) declare casos: string
  @flags.string({ required: true }) declare salida: string
  @flags.number({ default: 2.5 }) declare entrada: number
  @flags.number({ default: 10 }) declare salidaPrecio: number
  /** Salida media observada por llamada (DEV, 2026-11-20: 204,321 / 763). */
  @flags.number({ default: 268 }) declare salidaMedia: number

  async run() {
    const { gradeConRubrica } = await import('#services/practical_rubric_grader')
    const { gradeCompetencias } = await import('#services/competency_grader')
    const idx = await import('#services/exam_catalog/index')
    const { tokensEntradaMax } = await import('#services/model_budget')
    const { etapaDePrompt } = await import('#services/model_budget_ledger')

    const porEtapa: Record<string, { llamadas: number; entrada: number; salidaMax: number }> = {}
    const porRol: Record<string, { usdMax: number; casos: number }> = {}
    let rolActual = ''
    const literal = (txt: string, n = 6) => txt.trim().split(/\s+/).slice(0, n).join(' ')
    const respuestas = (prompt: string) => [...prompt.matchAll(/<<<([\s\S]*?)>>>/g)].map((m) => m[1])
    const numeros = (prompt: string) => [...prompt.matchAll(/\[P(\d+)\]/g)].map((m) => Number(m[1]))
    const confirmacionesVistas = new Set<string>()

    const llm = async (prompt: string, o: { maxTokens?: number; etapa?: string } = {}) => {
      const etapa = etapaDePrompt(prompt, o.etapa)
      const e = (porEtapa[etapa] ??= { llamadas: 0, entrada: 0, salidaMax: 0 })
      const tin = tokensEntradaMax(prompt) + 30
      const tout = o.maxTokens ?? 4000
      e.llamadas++
      e.entrada += tin
      e.salidaMax += tout
      porRol[rolActual].usdMax += (tin * this.entrada + tout * this.salidaPrecio) / 1e6

      const [resp = ''] = respuestas(prompt)
      switch (etapa) {
        case 'practico:extraccion': {
          const ficha = idx.fichaDe(rolActual)!
          const q = idx.preguntasAbiertas(ficha).find((p) => p.esenciales.every((x) => prompt.includes(`- ${x.id}: `)))
          const cita = literal(resp)
          return {
            elementos: (q?.esenciales ?? []).map((x, i) => ({ id: x.id, presente: true, cita: i === 0 ? `${cita} dicho con otras palabras distintas` : cita })),
            errores: (q?.erroresCriticos ?? []).slice(0, 1).map((x) => ({ id: x.id, presente: true, cita })),
          }
        }
        case 'practico:recuperar_citas':
          return { citas: [...prompt.matchAll(/clave "([^"]+)"/g)].map((m) => ({ clave: m[1], literal: literal(resp) })) }
        case 'practico:confirmar_error':
          return { confirma: false }
        case 'practico:confirmar_elementos':
          return {
            elementos: [...prompt.matchAll(/- id "([^"]+)"/g)].map((m) => ({
              id: m[1], completo: true, hace: true, generica: false, solo_lo_suyo: false, delega: false, condicionada: false,
            })),
          }
        case 'competencias:extraccion': {
          const qs = numeros(prompt)
          const rs = respuestas(prompt)
          return {
            evidencias: qs.flatMap((q, i) => [
              { q, cita: literal(rs[i] ?? ''), clase: 'criterio', fuerza: 'fuerte', senal: 's' },
              { q, cita: literal(rs[i] ?? '', 3), clase: 'criterio', fuerza: 'suficiente', senal: 's' },
            ]),
            revisadas: qs,
            alerta: qs.length ? { presente: true, q: qs[0], cita: literal(rs[0] ?? ''), conducta: 'c' } : { presente: false },
          }
        }
        case 'competencias:relatos_omitidos': {
          const qs = numeros(prompt)
          const rs = respuestas(prompt)
          return { evidencias: qs.map((q, i) => ({ q, cita: literal(rs[i] ?? '', 4), clase: 'relato', fuerza: 'fuerte', senal: 's' })) }
        }
        case 'competencias:confirmar_citas': {
          // Primera confirmación inválida → reintento (peor caso).
          const k = prompt.slice(0, 400)
          if (!confirmacionesVistas.has(k)) {
            confirmacionesVistas.add(k)
            return { citas: [] }
          }
          return { citas: [] }
        }
        case 'competencias:reintento_confirmacion':
          return {
            citas: [...prompt.matchAll(/- n (\d+)/g)].map((m) => ({ n: Number(m[1]), accion_propia: true, ya_lo_hizo: true })),
          }
        case 'competencias:confirmar_alerta':
          return { confirma: true, motivo: 'm' }
        default:
          return {}
      }
    }

    const ans = (arr: string[], qs: string[]) =>
      Object.fromEntries(qs.map((q, i) => [`q${i + 1}`, { question: q, answer: arr[i] ?? '' }]))
    for (const f of readdirSync(this.casos).filter((x) => /^caso_.*\.json$/.test(x))) {
      const c = JSON.parse(readFileSync(`${this.casos}/${f}`, 'utf8'))
      const ficha = idx.fichaDe(c.rol)
      if (!ficha) continue
      rolActual = c.rol
      porRol[c.rol] ??= { usdMax: 0, casos: 0 }
      porRol[c.rol].casos++
      if (c.practico)
        await gradeConRubrica({
          rol: ficha.label,
          rubrica: idx.preguntasAbiertas(ficha),
          numericas: idx.preguntasNumericas(ficha),
          dimensiones: ficha.practico.dimensiones,
          answers: ans(c.practico, idx.enunciadosPractico(ficha)),
          preguntasBanco: idx.enunciadosPractico(ficha),
          version: {},
          passThreshold: 70,
          perspectiva: 'puesto',
          sinDecisionAutomatica: true,
          llm,
        })
      if (c.competencias)
        await gradeCompetencias({ ficha, answers: ans(c.competencias, idx.enunciadosCompetencias(ficha)), version: {}, llm })
    }

    const usd = (tin: number, tout: number) => (tin * this.entrada + tout * this.salidaPrecio) / 1e6
    const filas = Object.entries(porEtapa).map(([etapa, e]) => ({
      etapa,
      ...e,
      usdMaximo: usd(e.entrada, e.salidaMax),
      usdEsperado: usd(e.entrada, e.llamadas * this.salidaMedia),
    }))
    const total = filas.reduce(
      (a, x) => ({
        llamadas: a.llamadas + x.llamadas,
        entrada: a.entrada + x.entrada,
        usdMaximo: a.usdMaximo + x.usdMaximo,
        usdEsperado: a.usdEsperado + x.usdEsperado,
      }),
      { llamadas: 0, entrada: 0, usdMaximo: 0, usdEsperado: 0 }
    )
    writeFileSync(this.salida, JSON.stringify({ total, porEtapa: filas, porRol }, null, 1))
    this.logger.success(
      `${total.llamadas} llamadas · máximo US$${total.usdMaximo.toFixed(2)} · esperado US$${total.usdEsperado.toFixed(2)}`
    )
  }
}
