# Publicación del piloto: Hostess, Encargado de cocina y Gerente

Estado: **preparado, sin publicar.** Requiere la autorización de Héctor.

## Qué se publica

| Repo | PR | Contenido |
|---|---|---|
| `impulso_rrhh_api` | #15 (`hector_dev/rol-unico-privacidad`, ya existe) | Puesto fijo por evaluación, huella de banco, revisión, envíos sin duplicados. **Trae la migración** `1792787972042_add_review_columns_to_tests` (columnas nuevas que aceptan vacío; no reescribe datos). |
| `impulso_rrhh_api` | PR del piloto (`hector_dev/examenes-tres-puestos`, sobre #15) | Catálogo de exámenes, calificadores del piloto y la lista `PUESTOS_PILOTO`. **Sin migraciones.** |
| `impulso_admin_front_page` | #31 (`hector_dev/rol-unico-privacidad`, ya existe) | Front de #15. |
| `impulso_admin_front_page` | PR del piloto (`hector_dev/examenes-tres-puestos-front`, sobre #31) | Examen con el banco del servidor, resumen por evidencia del reclutador. |

Lo que **no** cambia: Mesero, Capitán, Cocinero, Barman, Chef y Subgerente
conservan su banco, su calificador y su traducción de alias (mismas huellas
que producción). Las respuestas históricas no se recalifican. Los otros
puestos del catálogo (Runner, Encargado de barra, Subencargado de cocina y
las versiones nuevas de los seis anteriores) quedan en el código sin
publicarse.

## Ambientes

Estos repos no tienen DEV: no hay rama `dev` (sólo `devJampier`, de Jampier),
Railway tiene sólo `production` y los previews de Vercel usan el mismo API que
producción (y sin token del admin). `main` no tiene protección; el único check
es GitGuardian (y Vercel en el front).

## Orden de publicación

1. **Antes:** respaldo de `psych_tests` y `practical_tests` de producción
   (MariaDB 11.4.13 en BanaHosting, base `toizbseh_impulso_homepage`) y anotar
   el despliegue vigente: API `a82fa11` (Railway `microservicios_api_impulso /
   production`, despliegue `a858c56f-6a10-4ad6-ad6e-dc4caa8759ef`, dominio
   `impulsorrhhapi-production-6c01.up.railway.app`) y front `ba86cef` (Vercel
   `impulso-admin-front-page`, alias `impulso-admin-front-page.vercel.app`).
2. **Migración de #15:** comprobado el 2026-11-19 (solo lectura) que
   `1792787972042_add_review_columns_to_tests` **ya corrió en producción**
   (batch 7) y las columnas existen. No hay migración pendiente; el piloto no
   trae migraciones. Históricos al 2026-11-19: 816 psicométricos y 815
   prácticos, que no se recalifican.
3. **API:** mergear #15 a `main` y después la PR del piloto (retargeteada a
   `main`). Railway despliega `main`.
4. **Front:** mergear #31 y después la PR del front del piloto. Vercel despliega `main`.
5. **Configuración a revisar (solo lectura):** que producción tenga
   `OPENAI_API_KEY` válida y `OPENAI_MODEL_PSYCH=gpt-4o` (el piloto califica
   con `gpt-4o-2024-08-06`). Costo estimado por candidato: ≤ US$0.14 (práctico
   y competencias).
6. **Prueba en producción** (escritura: requiere OK): un candidato de prueba
   por puesto presenta los dos exámenes; revisar el reporte del reclutador y
   borrar o marcar esos registros de prueba según indique Héctor.

## Cómo se revierte

- **Rápido (minutos):** volver a desplegar la versión anterior: Railway
  «Redeploy» de `a82fa11` y Vercel «Promote» de `ba86cef`. Las columnas de la
  migración se quedan: aceptan vacío y el código anterior las ignora.
- **Por código:** revertir los merges (`git revert -m 1 <merge>`) en
  `main`, primero el del piloto y después #15 si hiciera falta.
- **Sólo el piloto:** quitar puestos de `PUESTOS_PILOTO` (un cambio de una
  línea) y desplegar. Esos puestos vuelven a «sin examen propio → revisión»;
  sus evaluaciones ya guardadas se conservan con su banco y su huella.
- **Datos:** ninguna publicación reescribe datos históricos. Las
  evaluaciones del piloto quedan guardadas con su banco, su huella y su
  versión de rúbrica, y pueden releerse después.

## Durante el piloto

- Sin contratación ni descarte automático: el reporte no da aprobado ni no
  aprobado ni puntaje global; la decisión es del reclutador.
- Revisión humana obligatoria cuando hay una respuesta crítica o un
  conocimiento indispensable pendiente de comprobar.
- Las reglas de la casa se presentan como supuestos del ejercicio; confirmar
  con el operador las listadas en `pendientesOperador` de cada ficha antes de
  una versión 3.
