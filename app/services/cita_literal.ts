// Fragmento literal de una respuesta (2026-11-19, ronda 4 de Codex).
//
// El modelo a veces devuelve la cita con cambios menores (mayúscula inicial,
// una parte omitida en medio). El reclutador debe leer lo que el candidato
// escribió, tal cual: esta función devuelve el tramo ORIGINAL de la respuesta
// que contiene las palabras de la cita, en orden, o null si ese tramo no es
// la misma frase. En el catálogo es también el verificador de citas: una cita
// sin tramo literal no cuenta.
//
// No es la misma frase (null) si:
// - faltan más del 15 % de las palabras de la cita (todas, con 1–2 palabras);
// - el tramo mete muchas palabras ajenas (junta cláusulas distintas);
// - una negación de la respuesta queda fuera de la cita, o al revés
//   ("No entregué…" citado como "entregué…").

type Tok = { t: string; i: number; j: number }

const NEGACION = new Set(['no', 'nunca', 'jamas', 'tampoco', 'ni'])

function norm(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

function tokens(s: string): Tok[] {
  const out: Tok[] = []
  for (const m of s.matchAll(/[\p{L}\p{N}]+/gu)) out.push({ t: norm(m[0]), i: m.index!, j: m.index! + m[0].length })
  return out
}

export function fragmentoLiteral(cita: string, respuesta: string): string | null {
  const c = tokens(cita).map((x) => x.t)
  const r = tokens(respuesta)
  if (!c.length || !r.length) return null
  const necesarias = c.length <= 2 ? c.length : Math.ceil(c.length * 0.85)
  // Un tramo mucho más largo que la cita no es "la misma frase".
  const limite = Math.ceil(c.length * 1.6) + 3
  let mejor: { a: number; b: number; vistas: number } | null = null
  for (let a = 0; a < r.length; a++) {
    // Empareja en orden, permitiendo saltar palabras de la cita que no estén.
    let k = 0
    let vistas = 0
    let b = -1
    for (let x = a; x < r.length && k < c.length && x - a < limite; x++) {
      const idx = c.indexOf(r[x].t, k)
      if (idx === -1) continue
      if (vistas === 0 && x !== a) break // el tramo empieza en una palabra de la cita
      vistas++
      k = idx + 1
      b = x
    }
    if (vistas < necesarias || b < a) continue
    // Muchas palabras ajenas: el tramo junta cláusulas distintas
    // ("entregué dinero; el gerente abrió el sobre" no es "entregué el sobre").
    const ajenas = b - a + 1 - vistas
    if (ajenas > Math.max(2, Math.floor((b - a + 1) * 0.3))) continue
    // Gana el tramo que cubre más palabras de la cita; a igualdad, el más corto.
    if (!mejor || vistas > mejor.vistas || (vistas === mejor.vistas && b - a < mejor.b - mejor.a))
      mejor = { a, b, vistas }
  }
  if (!mejor) return null
  // La negación debe coincidir: la de la respuesta (dentro del tramo o pegada
  // justo antes, sin puntuación de por medio) tiene que estar en la cita, y la
  // de la cita, en el tramo. "No espero; llamo al 911" sí sostiene "llamo al 911".
  const tramo = r.slice(mejor.a, mejor.b + 1).map((x) => x.t)
  const previa = mejor.a > 0 ? r[mejor.a - 1] : null
  const pegada = previa !== null && /^\s+$/.test(respuesta.slice(previa.j, r[mejor.a].i))
  const negCita = c.some((t) => NEGACION.has(t))
  const negResp = tramo.some((t) => NEGACION.has(t)) || (pegada && NEGACION.has(previa!.t))
  if (negCita !== negResp) return null
  return respuesta.slice(r[mejor.a].i, r[mejor.b].j)
}

/**
 * Respaldo del catálogo práctico (v3.12, Gerente C6 P13): cuando la cita del
 * modelo no tiene tramo literal y la recuperación tampoco lo trae, se ancla a
 * la ORACIÓN de la respuesta que contiene al menos el 75 % de sus palabras, si
 * esa oración es la única que lo hace y su negación coincide. Se devuelve la
 * oración tal cual la escribió el candidato; el elemento sigue pasando por la
 * confirmación cerrada sobre ese texto. No depende de tiempos ni de listas de
 * palabras: mide coincidencia de palabras dentro de una sola oración.
 */
export function oracionQueContiene(cita: string, respuesta: string): string | null {
  const c = [...new Set(tokens(cita).map((x) => x.t))]
  if (c.length < 3) return null
  const oraciones: { a: number; b: number }[] = []
  let a = 0
  for (const m of respuesta.matchAll(/[.!?;\n]+/g)) {
    oraciones.push({ a, b: m.index! })
    a = m.index! + m[0].length
  }
  oraciones.push({ a, b: respuesta.length })
  const puntuadas = oraciones
    .map((o) => {
      const texto = respuesta.slice(o.a, o.b).trim()
      const ts = new Set(tokens(texto).map((x) => x.t))
      return { texto, ts, cubre: c.filter((t) => ts.has(t)).length / c.length }
    })
    .filter((o) => o.texto)
    .sort((x, y) => y.cubre - x.cubre)
  const [mejor, segunda] = puntuadas
  if (!mejor || mejor.cubre < 0.75 || (segunda && segunda.cubre >= mejor.cubre)) return null
  const neg = (ts: Iterable<string>) => [...ts].some((t) => NEGACION.has(t))
  if (neg(c) !== neg(mejor.ts)) return null
  return mejor.texto
}
