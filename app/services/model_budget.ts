import { appendFileSync, existsSync, readFileSync } from 'node:fs'

// Tope de gasto para corridas de prueba contra el modelo (2026-11-15).
//
// Sólo se activa si existe PRESUPUESTO_USD (los lanzadores de prueba lo exigen
// con MODELO_REAL=1). Producción no lo define y no cambia nada.
//
// Regla: antes de CADA llamada se reserva su costo máximo posible (tokens de
// entrada estimados por lo alto + max_tokens de salida). Si lo ya gastado +
// lo reservado + esa reserva excede el presupuesto, la llamada NO se envía.
// Al volver, la reserva se cambia por el costo real (usage de la respuesta) y
// se anota en una bitácora JSONL con el modelo exacto que respondió.

export type Precios = { entradaPorMTok: number; salidaPorMTok: number }

export type RegistroLlamada = {
  at: string
  modeloPedido: string
  modeloRespondio: string | null
  systemFingerprint: string | null
  tokensEntrada: number
  tokensSalida: number
  costoUsd: number
}

export class PresupuestoExcedido extends Error {}

/** Tokens de entrada estimados POR LO ALTO (español ≈ 3.5–4 caracteres/token). */
export function tokensEntradaMax(texto: string): number {
  return Math.ceil(texto.length / 3) + 50
}

export function costoUsd(p: Precios, tokensEntrada: number, tokensSalida: number): number {
  return (tokensEntrada * p.entradaPorMTok + tokensSalida * p.salidaPorMTok) / 1_000_000
}

export class Presupuesto {
  private gastado = 0
  private reservado = 0

  constructor(
    readonly limiteUsd: number,
    readonly precios: Precios,
    private readonly bitacora: string | null
  ) {
    if (bitacora && existsSync(bitacora)) {
      for (const linea of readFileSync(bitacora, 'utf8').split('\n')) {
        if (!linea.trim()) continue
        this.gastado += Number(JSON.parse(linea).costoUsd) || 0
      }
    }
  }

  get gastadoUsd() {
    return this.gastado
  }

  /** Reserva el máximo de una llamada o lanza PresupuestoExcedido sin enviarla. */
  reservar(maxUsd: number): number {
    if (this.gastado + this.reservado + maxUsd > this.limiteUsd) {
      throw new PresupuestoExcedido(
        `PRESUPUESTO: se detiene antes de enviar. Gastado $${this.gastado.toFixed(4)} + reservado $${this.reservado.toFixed(4)} + esta llamada hasta $${maxUsd.toFixed(4)} > tope $${this.limiteUsd.toFixed(2)}`
      )
    }
    this.reservado += maxUsd
    return maxUsd
  }

  liberar(reserva: number, registro: RegistroLlamada | null) {
    this.reservado -= reserva
    if (!registro) return
    this.gastado += registro.costoUsd
    if (this.bitacora) appendFileSync(this.bitacora, JSON.stringify(registro) + '\n')
  }
}

let instancia: Presupuesto | null | undefined

/** Presupuesto desde el entorno, o null si no hay tope. Falla cerrado si está a medias. */
export function presupuestoDelEntorno(): Presupuesto | null {
  if (instancia !== undefined) return instancia
  const limite = process.env.PRESUPUESTO_USD
  if (!limite) return (instancia = null)
  const entrada = Number(process.env.PRECIO_ENTRADA_USD_POR_MTOK)
  const salida = Number(process.env.PRECIO_SALIDA_USD_POR_MTOK)
  if (!(Number(limite) > 0) || !(entrada > 0) || !(salida > 0)) {
    throw new PresupuestoExcedido(
      'PRESUPUESTO: PRESUPUESTO_USD definido sin precios válidos (PRECIO_ENTRADA_USD_POR_MTOK, PRECIO_SALIDA_USD_POR_MTOK); no se envía nada.'
    )
  }
  instancia = new Presupuesto(
    Number(limite),
    { entradaPorMTok: entrada, salidaPorMTok: salida },
    process.env.PRESUPUESTO_BITACORA || null
  )
  return instancia
}
