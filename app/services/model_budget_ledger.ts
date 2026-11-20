import { hostname } from 'node:os'
import { createConnection, type Connection } from 'mysql2/promise'
import { PresupuestoExcedido, type Precios, type RegistroLlamada } from '#services/model_budget'

// Libro de gasto COMPARTIDO para las pruebas con modelo (auditoría 2026-11-20).
//
// Antes cada proceso llevaba su propio contador: leía la bitácora al arrancar
// y reservaba sólo en memoria. Dos procesos a la vez no veían las reservas del
// otro, y en DEV la bitácora vivía en /tmp del contenedor y se perdía en cada
// redespliegue (el tope volvía a empezar). Ahora local, DEV y cualquier
// lanzador usan el mismo libro en MariaDB:
//
//   · El tope vive en la fila `presupuestos` (no en el entorno): reiniciar un
//     proceso no lo reinicia.
//   · Reservar es atómico: se bloquea la fila del presupuesto (FOR UPDATE) y se
//     suma lo cerrado + lo reservado pendiente, de todos los procesos.
//   · Una reserva que nunca se cierra (proceso caído) sigue contando su máximo.
//   · Sin respuesta del proveedor y sin saber si cobró: se cierra al máximo.
//
// Producción no define PRESUPUESTO_DB_URL y no usa nada de esto.

export const ESQUEMA_LIBRO = [
  `CREATE TABLE IF NOT EXISTS presupuestos (
     id VARCHAR(64) PRIMARY KEY,
     limite_usd DECIMAL(10,4) NOT NULL,
     nota VARCHAR(255) NULL,
     creado_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS llamadas (
     id BIGINT AUTO_INCREMENT PRIMARY KEY,
     presupuesto_id VARCHAR(64) NOT NULL,
     estado ENUM('reservada','cerrada','sin_cobro','incierta') NOT NULL,
     max_usd DECIMAL(12,6) NOT NULL,
     costo_usd DECIMAL(12,6) NULL,
     tokens_entrada INT NULL,
     tokens_salida INT NULL,
     modelo VARCHAR(80) NULL,
     fingerprint VARCHAR(80) NULL,
     etapa VARCHAR(60) NULL,
     origen VARCHAR(120) NULL,
     nota VARCHAR(255) NULL,
     reservada_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
     cerrada_at DATETIME(3) NULL,
     INDEX (presupuesto_id, estado))`,
]

/** Comprometido = cerrado + lo reservado que sigue abierto (a su máximo). */
export const SQL_COMPROMETIDO = `SELECT COALESCE(SUM(CASE WHEN estado IN ('reservada') THEN max_usd ELSE costo_usd END), 0) AS usd
  FROM llamadas WHERE presupuesto_id = ?`

export type Reserva = { id: number; maxUsd: number }

export class LibroGasto {
  constructor(
    private readonly url: string,
    readonly presupuestoId: string,
    readonly precios: Precios,
    readonly origen = `${hostname()}:${process.pid}`
  ) {}

  // Una conexión corta por operación: un pool abierto mantenía vivo el
  // proceso al terminar (los comandos de prueba no salían; cierre 2026-11-20).
  private async con<T>(fn: (cx: Connection) => Promise<T>): Promise<T> {
    const cx = await createConnection({ uri: this.url, decimalNumbers: true })
    try {
      return await fn(cx)
    } finally {
      await cx.end().catch(() => cx.destroy())
    }
  }

  async comprometidoUsd(): Promise<number> {
    return this.con(async (cx) => {
      const [rows] = await cx.query(SQL_COMPROMETIDO, [this.presupuestoId])
      return Number((rows as any[])[0]?.usd ?? 0)
    })
  }

  /** Reserva el máximo de una llamada o lanza PresupuestoExcedido sin enviarla. */
  async reservar(maxUsd: number, etapa: string | null): Promise<Reserva> {
    return this.con(async (cx) => {
      try {
        await cx.beginTransaction()
        const [p] = await cx.query('SELECT limite_usd FROM presupuestos WHERE id = ? FOR UPDATE', [this.presupuestoId])
        const limite = (p as any[])[0]?.limite_usd
        if (limite === undefined) throw new PresupuestoExcedido(`PRESUPUESTO: no existe el presupuesto «${this.presupuestoId}» en el libro; no se envía nada.`)
        const [c] = await cx.query(SQL_COMPROMETIDO, [this.presupuestoId])
        const comprometido = Number((c as any[])[0]?.usd ?? 0)
        if (comprometido + maxUsd > Number(limite)) {
          throw new PresupuestoExcedido(
            `PRESUPUESTO: se detiene antes de enviar. Comprometido $${comprometido.toFixed(4)} (cerrado + reservado de todos los procesos) + esta llamada hasta $${maxUsd.toFixed(4)} > tope $${Number(limite).toFixed(2)}`
          )
        }
        const [ins] = await cx.query(
          `INSERT INTO llamadas (presupuesto_id, estado, max_usd, etapa, origen) VALUES (?, 'reservada', ?, ?, ?)`,
          [this.presupuestoId, maxUsd, etapa, this.origen]
        )
        await cx.commit()
        return { id: Number((ins as any).insertId), maxUsd }
      } catch (e) {
        await cx.rollback().catch(() => {})
        throw e
      }
    })
  }

  /**
   * Cierra la reserva. Con registro: costo real. Sin registro: si el proveedor
   * respondió con un error HTTP no hubo cobro; si no hubo respuesta (o no se
   * sabe), se cierra al máximo reservado: nunca se subestima.
   */
  async liberar(r: Reserva, registro: RegistroLlamada | null, sinCobro = false) {
    await this.con(async (cx) => {
      if (registro) {
        await cx.query(
          `UPDATE llamadas SET estado='cerrada', costo_usd=?, tokens_entrada=?, tokens_salida=?, modelo=?, fingerprint=?, cerrada_at=CURRENT_TIMESTAMP(3) WHERE id=?`,
          [registro.costoUsd, registro.tokensEntrada, registro.tokensSalida, registro.modeloRespondio, registro.systemFingerprint, r.id]
        )
      } else if (sinCobro) {
        await cx.query(`UPDATE llamadas SET estado='sin_cobro', costo_usd=0, cerrada_at=CURRENT_TIMESTAMP(3) WHERE id=?`, [r.id])
      } else {
        await cx.query(`UPDATE llamadas SET estado='incierta', costo_usd=max_usd, cerrada_at=CURRENT_TIMESTAMP(3) WHERE id=?`, [r.id])
      }
    })
  }

  /** Compatibilidad: ya no hay conexiones abiertas que cerrar. */
  async cerrar() {}
}

/**
 * Etapa de una llamada, deducida del prompt en un solo lugar (para el
 * desglose de gasto). `forzada` la fija quien llama (p. ej. reintentos).
 */
export function etapaDePrompt(prompt: string, forzada?: string): string {
  if (forzada) return forzada
  if (prompt.startsWith('Eres evaluador técnico de restaurantes')) return 'practico:extraccion'
  if (prompt.startsWith('Revisa si cada frase de una respuesta de examen')) return 'practico:confirmar_elementos'
  if (prompt.startsWith('Revisa si una respuesta de examen describe una MALA PRÁCTICA')) return 'practico:confirmar_error'
  if (/copia TEXTUALMENTE/.test(prompt) && /"citas"/.test(prompt)) return 'practico:recuperar_citas'
  if (prompt.includes('no se extrajo ningún RELATO')) return 'competencias:relatos_omitidos'
  if (prompt.startsWith('Evalúas UNA competencia')) return 'competencias:extraccion'
  if (prompt.startsWith('Preguntas cerradas sobre frases')) return 'competencias:confirmar_citas'
  if (prompt.startsWith('Pregunta cerrada.')) return 'competencias:confirmar_alerta'
  return 'otro'
}
