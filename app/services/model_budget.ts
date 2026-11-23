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

/** Control de gasto que usa el cliente del modelo (libro compartido o, sólo en pruebas unitarias, archivo). */
export type ControlGasto = {
  precios: Precios
  reservar(maxUsd: number, etapa: string | null): Promise<unknown>
  liberar(reserva: unknown, registro: RegistroLlamada | null, sinCobro?: boolean): Promise<void>
}

/** Adaptador del contador por archivo (sólo pruebas unitarias o `PRESUPUESTO_SOLO_LOCAL=1`). */
export function controlDeArchivo(p: Presupuesto): ControlGasto {
  return {
    precios: p.precios,
    reservar: async (maxUsd) => p.reservar(maxUsd),
    // Sin respuesta ni certeza de que no cobró: cuenta el máximo reservado.
    liberar: async (r, registro, sinCobro = false) =>
      p.liberar(
        r as number,
        registro ??
          (sinCobro
            ? null
            : { at: new Date().toISOString(), modeloPedido: '?', modeloRespondio: null, systemFingerprint: null, tokensEntrada: 0, tokensSalida: 0, costoUsd: r as number })
      ),
  }
}

let instancia: ControlGasto | null | undefined

/**
 * Control de gasto desde el entorno, o null si no hay tope (producción).
 * Falla cerrado: con PRESUPUESTO_USD o PRESUPUESTO_ID exige precios válidos y
 * el LIBRO COMPARTIDO (PRESUPUESTO_DB_URL). El contador por archivo, que no
 * ve a otros procesos ni sobrevive a un redespliegue, ya no se acepta salvo
 * `PRESUPUESTO_SOLO_LOCAL=1` (auditoría de gasto, 2026-11-20).
 */
export async function controlDelEntorno(): Promise<ControlGasto | null> {
  if (instancia !== undefined) return instancia
  const limite = process.env.PRESUPUESTO_USD
  const id = process.env.PRESUPUESTO_ID
  const url = process.env.PRESUPUESTO_DB_URL
  if (!limite && !id && !url) return (instancia = null)
  const entrada = Number(process.env.PRECIO_ENTRADA_USD_POR_MTOK)
  const salida = Number(process.env.PRECIO_SALIDA_USD_POR_MTOK)
  if (!(entrada > 0) || !(salida > 0)) {
    throw new PresupuestoExcedido(
      'PRESUPUESTO: faltan precios válidos (PRECIO_ENTRADA_USD_POR_MTOK, PRECIO_SALIDA_USD_POR_MTOK); no se envía nada.'
    )
  }
  const precios = { entradaPorMTok: entrada, salidaPorMTok: salida }
  if (url && id) {
    const { LibroGasto } = await import('#services/model_budget_ledger')
    return (instancia = new LibroGasto(url, id, precios))
  }
  if (process.env.PRESUPUESTO_SOLO_LOCAL === '1' && Number(limite) > 0) {
    return (instancia = controlDeArchivo(new Presupuesto(Number(limite), precios, process.env.PRESUPUESTO_BITACORA || null)))
  }
  throw new PresupuestoExcedido(
    'PRESUPUESTO: se exige el libro compartido (PRESUPUESTO_DB_URL y PRESUPUESTO_ID); no se envía nada.'
  )
}

/** Sólo pruebas: olvida el control ya creado. */
export function _reiniciarControlParaPruebas() {
  instancia = undefined
}
