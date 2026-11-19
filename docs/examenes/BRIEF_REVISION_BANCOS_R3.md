# Aplicar la revisión de bancos de Codex (ronda 3) — alcance cerrado

Entrada: `~/.local/share/impulso-examenes/ronda3-catalogo/revisor/revision_bancos/<code>.md`
(problemas que Codex vio en el examen ANTES de cualquier calificación).
Archivo a corregir: `app/services/exam_catalog/<code>.ts` (y su nota `docs/examenes/puestos/<code>.md`).

Clasifica CADA problema en una de tres:

**A · error del sistema que se corrige en la rúbrica** → corrígelo en la ficha:
- error crítico que describe una omisión → quítalo o reescríbelo como acto explícito;
- respuesta que puede salir «correcta» sin resolver el riesgo central (alergia,
  alcohol, dinero, seguridad) → añade `nucleo: ['<id del esencial>']`;
- elemento compuesto (dos o tres acciones en uno) → sepáralo o simplifícalo;
- alternativa válida que la rúbrica no acepta → añádela a `alternativasValidas`
  o amplía el texto del esencial;
- clave o tolerancia mal calculada con los datos del enunciado → corrígela;
- criterio contradictorio entre un esencial y un error crítico → resuélvelo.
Si ajustas `minimoCorrecta`, que siga siendo ≤ número de esenciales.

**B · requiere cambiar el enunciado** (pista en el enunciado, doble pregunta,
dato faltante, fuga de datos entre preguntas, pregunta que no es del puesto)
→ NO lo cambies ahora (las respuestas ya guardadas quedarían sin banco). Anótalo
en la nota del puesto, sección «Pendientes para la versión 2 del banco», con la
propuesta concreta.

**C · depende de una facultad o política no confirmada** → añádelo a
`facultades.pendientesOperador` (pregunta concreta) si no está ya.

PROHIBIDO cambiar: `enunciado` de cualquier pregunta del práctico, `texto` de
cualquier pregunta de competencias, el número u orden de preguntas, `tipo`,
`eje`. Así la huella del banco no cambia. Las señales (`senalesPositivas`,
`senalesAlerta`) sí se pueden afinar si el problema es A.

Al final, en la nota del puesto, agrega «Revisión de Codex r3 aplicada» con una
tabla: problema | clase (A/B/C) | qué hiciste. Verifica con
`npx tsc --noEmit -p .` en `impulso_rrhh_api-examenes`. No toques otros archivos.
