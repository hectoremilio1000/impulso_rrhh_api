# Auditoría del gasto de pruebas con modelo (2026-11-20)

Llave de pruebas: Llavero `impulso-examenes-openai-pruebas`. Proyecto
`proj_mGtNAnTXa2J8clchzeFfi4SU`, organización `org-9Gx9…`. Tope autorizado:
US$24, acumulado. Todas las llamadas pagadas están detenidas.

## 1. Conciliación

**Proveedor: no comprobado.** La llave de pruebas no tiene el permiso
`api.usage.read`. Los endpoints `/v1/organization/costs` y `/usage` la rechazan,
y el endpoint antiguo `/v1/usage` responde vacío. Para conciliar hace falta una
de estas dos cosas:
- una llave de solo lectura de uso, guardada en el Llavero como `impulso-examenes-openai-uso`;
- o la exportación de https://platform.openai.com/usage filtrada por ese proyecto, del 15 al 20 de noviembre.

| Tipo | Llamadas | US$ | Fuente |
|---|---:|---:|---|
| Confirmado: local | 2,281 | 13.64 | Una línea por llamada, con el `usage` que devolvió el proveedor (`bitacora_modelo.jsonl`). |
| Confirmado: DEV `c12a6a1` | 763 | 4.80 | Bitácora del contenedor, copiada por `railway ssh` antes del siguiente redespliegue. |
| Estimado: DEV v3.4, 66 calificaciones | — | 4.50 | Su bitácora se perdió en el redespliegue. Se tomó la corrida local equivalente (US$3.52) con margen. |
| Sin registro | ? | ? | Ver la lista de abajo. |
| **Total en bitácora** | | **22.94** | |

**Sin registro:**
- **Intento DEV v3.7 (27 prácticos).** Se quedó sin crédito. Los registros muestran 429 en las calificaciones fallidas, pero no se puede descartar que algunas llamadas se cobraran antes de agotarse el crédito. Su bitácora se perdió en el redespliegue a `c12a6a1`.
- **Tres comprobaciones de crédito de 1 token**, hechas con `curl` (menos de US$0.001 en total).
- **Codex no gastó de esta llave:** usa la cuenta de ChatGPT (`auth_mode: chatgpt`).

## 2. Por qué la corrida real costó más que lo estimado

La estimación registrada (`estimacion/resultado.json`, 19 de noviembre) daba
**396 llamadas y US$3.55** por corrida de 27 candidatos (US$0.13 por
candidato). La corrida real en DEV hizo **763 llamadas y costó US$4.80**
(US$0.178 por candidato). La diferencia, **367 llamadas**, coincide con lo que
el estimador nunca contaba:
- **Citas que nunca pasaban la verificación:** el «peor caso» devolvía la cita `'x'` y competencias sin evidencia. El verificador literal lo descartaba todo, así que nunca había confirmaciones.

Desglose de la corrida DEV `c12a6a1`:

| Etapa | Llamadas | Entrada reconstruida |
|---|---:|---:|
| Práctico: extracción | 227 | ≈374k tok |
| Práctico: confirmar elementos | 172 | ≈253k |
| Práctico: confirmar error crítico | 7 | ≈3k |
| Práctico: recuperar citas | ≈10 | — |
| Competencias: extracción | 162 | ≈247k |
| Competencias: confirmar citas | 160 | ≈175k |
| Competencias: reintentos, relatos omitidos y alertas | ≈25 | — |
| **Total** | **763** (exacto) | 1,102,873 (medido) |

Notas sobre la tabla:
- **Llamadas:** el total es exacto, por la suma de `modeloRespondio` de cada reporte. La división por etapa se deduce de la estructura del reporte.
- **Entrada:** se reconstruyó con los prompts reales y se escaló al total medido.
- **Salida:** 204,321 tokens (US$2.04). No se puede atribuir por etapa, porque antes no se registraba. Desde ahora el libro guarda la etapa de cada llamada.

El cálculo de US$2.23 por 18 candidatos no aparece en mis registros, así que
no puedo reconstruirlo.

## 3. Desperdicio

| Concepto | US$ | Certeza |
|---|---:|---|
| Recalificar competencias que no habían cambiado: corrida local v3.5, competencias v2.1 iguales a la corrida 1 | ≈2.0 | Estimado. Proporción de llamadas de competencias en DEV (45%) aplicada a US$4.83. |
| Ejecuciones accidentales: dos veces `calificar_dev.py \| head` | 0 | Según los registros, todas sus llamadas fallaron (403 y 429). No está confirmado por el proveedor. |
| Diagnósticos de una llamada | 0.01 | Confirmado. |
| Corrección B2, después retirada: parte de competencias de DEV `c12a6a1` | ≈2.1 | Estimado. No fue un accidente, pero no aportó una mejora. |

**Corrección.** Consultar y calificar ahora son comandos separados:
- `herramientas/reportes_dev.py` usa un cliente que solo permite GET, y tiene una prueba que lo garantiza.
- `herramientas/calificar_dev.py` exige `--calificar`, la lista explícita de pruebas y un tope `--max`.
- En el API, `tests/unit/consulta_no_califica.spec.ts` prueba que ningún GET llega a la calificación ni al modelo.

## 4. Registro perdido en DEV y control compartido

**Causa:**
- **La bitácora vivía en `/tmp` del contenedor:** `PRESUPUESTO_BITACORA=/tmp/…`. Cada cambio de variable redespliega, y hubo cuatro cambios.
- **El contador era de cada proceso:** vivía en memoria, así que cada contenedor empezaba de cero.
- **Local y DEV nunca compartieron el tope.**

**Corrección: libro compartido** (`app/services/model_budget_ledger.ts`), en
MariaDB DEV, base `presupuesto_modelo`:
- **Un tope que no se reinicia:** la fila `presupuestos` fija el tope. Un reinicio o un redespliegue no lo reinicia.
- **Reserva atómica:** se hace bajo `FOR UPDATE` y suma lo cerrado más lo reservado pendiente de todos los procesos.
- **Cierre de cada llamada:**
  - una reserva sin cerrar cuenta su máximo;
  - si no hay respuesta, se cierra al máximo;
  - un error HTTP se cierra sin cobro.
- **Falla cerrado:** con `PRESUPUESTO_USD` pero sin el libro, no se envía nada.
- **Prueba de integración** (base real): dos procesos simultáneos no pasan el tope, un reinicio ve lo mismo y lo pendiente cuenta.
- **Historial importado:** 3,045 llamadas, US$22.938, igual que la bitácora. La de origen `importado:estimado` va marcada como estimada.

## 5. Antes de otra corrida completa

**Sin modelo:**
- B3, negaciones: corregido.
- B2: retirado (competencias v2.3).
- Estimador de peor caso: corregido.

**Prueba pequeña** (`tres-puestos/prueba_pequena/`):
- **Práctico:** 11 preguntas que fallan y 23 correctas que deben conservarse.
- **Competencias:** 24 ejes que fallan, incluidos los 19 que B2 bajó, y 33 correctos que deben conservarse.
- **Contrastes nuevos de Codex:** 16 pares, con expectativas selladas.

**Costo** (estimador corregido; el libro lo hace cumplir):

| Paso | Máximo absoluto (max_tokens) | Esperado (salida media) |
|---|---:|---:|
| Prueba pequeña | 7.27 | 2.56 (≈1.2 por la proporción observada) |
| Contrastes nuevos de Codex (16 pares) | 1.92 | 0.63 |
| Corrida final completa en DEV | 30.03 | 10.68 (4.80 observado) |
