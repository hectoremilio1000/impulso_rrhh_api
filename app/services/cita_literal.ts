// Fragmento literal de una respuesta (2026-11-19, ronda 4 de Codex).
//
// El modelo a veces devuelve la cita con cambios menores (mayúscula inicial,
// una parte omitida en medio). La verificación tolera esos recortes, pero el
// reclutador debe leer lo que el candidato escribió, tal cual. Esta función
// devuelve el tramo ORIGINAL de la respuesta que contiene las palabras de la
// cita, en orden; si hubo una omisión en medio, el tramo la incluye (nunca
// se inventa ni se edita texto).

type Tok = { t: string; i: number; j: number }

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

/**
 * Tramo literal más corto de `respuesta` que contiene, en orden, al menos el
 * 85 % de las palabras de `cita` (todas si la cita tiene 1–2 palabras).
 * null si no existe: entonces la cita no está en la respuesta.
 */
export function fragmentoLiteral(cita: string, respuesta: string): string | null {
  const c = tokens(cita).map((x) => x.t)
  const r = tokens(respuesta)
  if (!c.length || !r.length) return null
  const necesarias = c.length <= 2 ? c.length : Math.ceil(c.length * 0.85)
  let mejor: { a: number; b: number; vistas: number } | null = null
  for (let a = 0; a < r.length; a++) {
    // Empareja en orden, permitiendo saltar palabras de la cita que no estén.
    let k = 0
    let vistas = 0
    let b = -1
    // Un tramo mucho más largo que la cita no es "la misma frase".
    const limite = Math.ceil(c.length * 1.6) + 3
    for (let x = a; x < r.length && k < c.length && x - a < limite; x++) {
      const idx = c.indexOf(r[x].t, k)
      if (idx === -1) continue
      if (vistas === 0 && x !== a) break // el tramo empieza en una palabra de la cita
      vistas++
      k = idx + 1
      b = x
    }
    if (vistas < necesarias || b < a) continue
    // Gana el tramo que cubre más palabras de la cita; a igualdad, el más corto.
    if (!mejor || vistas > mejor.vistas || (vistas === mejor.vistas && b - a < mejor.b - mejor.a))
      mejor = { a, b, vistas }
  }
  if (!mejor) return null
  return respuesta.slice(r[mejor.a].i, r[mejor.b].j)
}
