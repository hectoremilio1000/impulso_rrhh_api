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

## Orden de publicación

1. **Antes:** respaldo de la base de producción (MariaDB en BanaHosting) y
   anotar el despliegue vigente: API `a82fa11` (Railway,
   `microservicios_api_impulso / production`) y front `ba86cef` (Vercel).
2. **Migración de #15** en producción, desde un worktree en el commit que se
   va a publicar: `node ace migration:run --force`. La salida debe decir
   `migrated`; sin `--force` responde «no» en silencio. Las columnas aceptan
   vacío, así que el código actual sigue funcionando con ellas.
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
