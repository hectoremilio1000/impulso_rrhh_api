# Revisión independiente de los exámenes de Impulso

Procedimiento permanente para todos los puestos. Es el equivalente a las
rondas de QA del bot: **Claude implementa; Codex revisa** en otra sesión, en su
propio worktree, con su propia base y sus propios puertos. Codex no sustituye
la revisión humana: dos operadores de restaurante califican por separado.

Estado de cada puesto: [`MATRIZ_PUESTOS.md`](./MATRIZ_PUESTOS.md).

## Estados (no se mezclan)

| Estado | Qué significa | Quién lo da |
|---|---|---|
| **Probado técnicamente** | Banco, rúbrica y calificador congelados. La última ronda de Codex no tiene fallas de sistema abiertas y la pregunta mostrada, la respuesta guardada y la rúbrica aplicada son del mismo puesto y versión. | Codex (reporte) |
| **Revisado por operadores** | Dos operadores calificaron la hoja sin ver la IA. Sus desacuerdos con el calificador están resueltos o registrados. | Operadores |
| **Validado para decisiones reales** | Los dos anteriores, más una decisión explícita de Héctor. Mientras no exista, el resultado se presenta como orientativo. | Héctor |

Un puesto puede estar «probado técnicamente» y seguir «pendiente de validación
para decisiones reales».

## Ronda de revisión de un puesto

### 1. Antes de probar (Claude)

- Congelar y sellar las versiones de banco (huella), rúbrica, calificador,
  reglas de decisión y modelo. Cada sello lleva la hora UTC y el sha256 del
  archivo. Ningún archivo sellado cambia durante la ronda.
- Escribir qué decisiones puede tomar ese puesto en el turno (y cuáles le
  corresponden al gerente): eso define cuándo escalar merece crédito.
- Preparar los briefs de candidato: persona y estilo, **sin** claves, rúbricas
  ni resultados esperados.

### 2. Dos papeles de Codex, separados

- **Codex-candidato.** Su carpeta tiene solo los briefs de candidato y la URL
  del front de pruebas. Ve lo mismo que un postulante: el formulario y las
  preguntas. No lee el repositorio, las rúbricas ni las expectativas.
- **Codex-revisor.** Su worktree es una copia de la rama congelada. Escribe y
  sella sus resultados esperados **antes** de ver cualquier calificación, a
  partir de las respuestas y de los criterios de crédito. Luego entra como
  reclutador y revisa el reporte.

### 3. Prueba en navegador

1. El candidato elige el puesto en `/apply`, contesta el examen en
   `/exam/practical/:token` o `/exam/psych/:token`, y lo envía.
2. El revisor entra a `/admin/candidates/:id` y comprueba que **la pregunta
   mostrada, la respuesta guardada y la rúbrica aplicada** correspondan al mismo
   puesto y versión: huella del banco en el front = `bankFingerprint` guardado =
   rúbrica del reporte.
3. Si el front todavía muestra el banco anterior, el bloque se marca **«solo
   probado en backend»**.

### 4. Prueba de calidad: casos obligatorios

En cada bloque debe haber al menos un caso de cada tipo:

- breve y correcto;
- largo y sin método;
- parcialmente correcto;
- «no sé» (es una respuesta y se reporta aparte de «vacía»);
- vacío;
- error crítico dicho con vocabulario correcto;
- solución alternativa válida;
- escalar al gerente cuando **sí** es lo correcto, y pasarle al gerente una
  tarea propia del turno cuando **no** lo es.

En competencias, además:

- distinguir **criterio hipotético** («haría…»), **experiencia relatada**
  («una vez…») y **conducta observada** (evidencia externa); relatar no
  equivale a conducta observada;
- una **alerta** y una **falta de evidencia** pueden coexistir y se muestran
  por separado;
- curiosidad y optimismo bajos no provocan un descarte automático.

### 5. Reporte (formato del bot)

Identificador `EX-<PUESTO>-P<NN>-<NN>` (p. ej. `EX-SUB-P09-01`). Puestos: MES,
CAP, COC, BAR, CHE, SUB, GER. Las competencias usan `C<NN>` en lugar de
`P<NN>`.

Cada falla incluye, en este orden:

1. puesto y versión (banco, rúbrica, calificador);
2. pregunta;
3. respuesta literal;
4. resultado esperado y por qué;
5. resultado obtenido;
6. impacto;
7. cómo reproducirlo (archivo del caso y comando).

Y se clasifica como **error del sistema** (Claude lo corrige) o **desacuerdo
de criterio** (lo resuelven los operadores; Claude no ajusta el calificador
para que un caso gane).

### 6. Ciclo de corrección

1. Claude corrige la causa, no el caso, y sella la nueva versión.
2. Codex repite el caso que falló, comprueba que los anteriores sigan
   pasando y **añade al menos un caso nuevo** que no se usó para ajustar.
3. Un defecto se cierra solo con la evidencia de esa corrida nueva.
4. Si cambió el calificador compartido (`practical_rubric_grader.ts`,
   `psych_*`), se repiten las pruebas de **todos** los puestos que lo usan.
5. Un caso usado para ajustar deja de ser independiente: se conserva como
   regresión, no como prueba de mejora.

### 7. Cierre de la ronda

- Codex entrega fallas abiertas, cerradas y pendientes de criterio humano.
- Se actualiza la matriz con banco y versión, operadores, última ronda de
  Codex, fallas abiertas y evidencia.
- Cuando estén implementados todos los puestos: ronda completa para detectar
  bancos cruzados, rúbricas genéricas y diferencias entre lo que ve el
  candidato y lo que recibe el reclutador.

## Llamadas al modelo (regla dura, 2026-11-15)

- Las pruebas **nunca** usan la llave de producción. Los lanzadores
  (`run.sh`, `run-codex*.sh`) no leen Railway.
- Por defecto corren **sin llamadas externas**: sin llave y con la URL de
  OpenAI apuntando a un puerto local cerrado. El calificador devuelve
  «OPENAI_API_KEY no configurada» sin enviar nada.
- Una corrida real se pide con `MODELO_REAL=1` y usa solo la llave exclusiva de
  pruebas del Llavero (`impulso-examenes-openai-pruebas`). Si no existe, el
  lanzador se detiene con código 3 **antes** de arrancar node.
- Cada reporte separa **probado sin modelo** (reglas, tubería, pantallas) de
  **pendiente de comprobar con el modelo real**. Un defecto del calificador no
  se cierra sin la corrida real.

- Una corrida real exige además `PRESUPUESTO_USD` y los precios por millón de
  tokens (`PRECIO_ENTRADA_USD_POR_MTOK`, `PRECIO_SALIDA_USD_POR_MTOK`); sin
  ellos el lanzador sale con código 4. Antes de cada llamada se reserva su
  costo máximo (`app/services/model_budget.ts`); si excede el tope, no se
  envía. Cada llamada queda en una bitácora JSONL con el modelo exacto que
  respondió (`model`, `system_fingerprint`) y su costo real; el reporte guarda
  `version.modeloRespondio`.

Motivo: el 2026-11-15 las rondas agotaron el saldo de la llave de producción
(`429 You have no credits remaining`).

## Resultado: puntaje y alerta separados

Un error crítico confirmado conserva el puntaje técnico, pero el resultado
queda `decision: "requiere_revision"`, `passed: null` y `alerta.texto` con el
motivo citado. El panel del reclutador muestra «Requiere revisión» en el
práctico y antepone «⚠️ REQUIERE REVISIÓN (práctico)» al veredicto, que pasa a
verse como «veredicto técnico». No hay descarte automático. Que una brecha
indispensable (vacía, «no sé») también alerte lo deciden los operadores.

## Catálogo de exámenes (2026-11-16)

- **Una sola fuente por puesto:** `app/services/exam_catalog/<code>.ts`
  (`ExamenPuesto`). El servidor entrega al front las preguntas de esa ficha
  (`bank.questions` en el link público) y califica con la rúbrica de la misma
  ficha. El front ya no guarda el banco vigente: sólo los anteriores, para leer
  históricos. Huellas anteriores: [`HUELLAS_ANTERIORES.md`](./HUELLAS_ANTERIORES.md).
- **Doce puestos:** Mesero, Capitán, Runner, Hostess, Barman, Encargado de barra,
  Cocinero, Subencargado de cocina, Encargado de cocina, Chef, Subgerente y
  Gerente. Equivalencias de nombres en `resolveRoleCode` (back y front, misma
  tabla de casos). Garrotero, Ayudante de cocina, Bar back y «Encargado» a secas
  no tienen examen propio (decisión de operador).
- **Bloque A · práctico:** preguntas abiertas por rúbrica (`practico-rubrica-v3.3`:
  elementos con cita, confirmación por preguntas cerradas que decide el código,
  error crítico confirmado aparte) y preguntas numéricas que califica el código
  con clave y tolerancia, sin modelo.
- **Bloque B · seis competencias** (`competencias-evidencia-v1`): el modelo sólo
  cita y clasifica cada evidencia (relato, criterio, genérica) y su fuerza
  contra las anclas. El código decide: relato → «conducta relatada» (nunca
  «observada»); sólo criterio → nivel máximo «suficiente» y «sólo criterio
  declarado»; sin evidencia → sin nivel (no cero). Una alerta se confirma con
  una pregunta cerrada aparte y pide revisión humana. Curiosidad y optimismo no
  generan alertas. No hay aprobado ni descarte automático (`passed: null`).
- **Panel del reclutador:** «Resumen por evidencia» con A (qué demostró, con
  cita, y qué no), B (evidencia por competencia) y una lista única de «Qué falta
  verificar». El veredicto Guidara (CONTRATAR/DESCARTAR) sólo se muestra para
  los bancos anteriores.
- Brief para escribir o cambiar un banco: [`BRIEF_BANCOS.md`](./BRIEF_BANCOS.md).
  Notas por puesto (tareas, facultades, pendientes de operador): `puestos/`.
- Exportar lo que ve el candidato (para Codex-candidato) o la ficha completa
  (para Codex-revisor): `node ace exam:catalogo-preguntas --salida=… [--con-rubrica]`.
  Calificar casos sin base: `node ace exam:practico-casos --rol=<code>
  --examen=practico|competencias --casos=… --corridas=3 --salida=…`.

## Reglas permanentes

- No recalificar históricos. Las respuestas a un banco se califican con la
  rúbrica de **ese** banco (por huella); nunca se trata una respuesta al
  enunciado anterior como respuesta al nuevo.
- Sin merge y sin producción durante una ronda.
- El total lo calcula una regla con pesos explícitos; cada punto se rastrea a
  una frase de la respuesta.
- No premiar longitud, vocabulario ni experiencia declarada.

## Dónde vive cada cosa

| Qué | Dónde |
|---|---|
| Bancos del servidor | `app/services/practical_banks/` |
| Rúbricas | `app/services/practical_rubrics/` |
| Calificador por rúbrica | `app/services/practical_rubric_grader.ts` |
| Huella vigente por puesto | `app/services/role_catalog.ts` (`CURRENT_BANK_FINGERPRINT`) |
| Calificar casos sin base | `node ace exam:practico-casos --casos=… --corridas=3 --salida=…` |
| Sellos, casos, resultados y hojas de operadores (fuera del repo, contienen expectativas) | `~/.local/share/impulso-examenes/` |
