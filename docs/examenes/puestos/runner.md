# Runner / auxiliar de servicio (`runner`): tareas, facultades y por qué de cada pregunta

Ficha: `app/services/exam_catalog/runner.ts` · práctico `banco_runner_v1`
(10 preguntas, 1 numérica) · competencias `competencias_runner_v1` (24).
Umbral de aprobado: 70.

Fuentes: «Manual de Introducción Mesero y Capitan» (La Llorona: organigrama
de piso con runners, checklist de apertura mesero/runner, estación del runner,
retiro de platos, dirección de servicio) y «Sesion4_Politica_Dinero.md». No
existía banco de Runner (diagnóstico §2.2). Estado: **provisional** hasta que
lo confirmen dos operadores.

## Tareas del puesto

1. Montar la estación del runner: salsas en cambro con cama de hielo y limones lavados (checklist de apertura).
2. Revisar en el pase que cada plato coincida con la comanda: mesa, posición, cambios y alergia.
3. Llevar el plato a la mesa y a la posición correctas, por la derecha, con la cara frontal hacia el comensal.
4. Priorizar por temperatura y entregar cada mesa completa.
5. Comunicar a cocina y al mesero errores, faltantes y platos dudosos.
6. Retirar platos: cuando todos terminaron, por la izquierda, máximo 3 sin apilar, y llevarlos al descamoche.
7. Pasar al mesero pedidos, la cuenta y peticiones. **No toma órdenes ni cobra.**
8. Dejar limpia la estación al cierre.

## Facultades

**Decide él:** detener y regresar a cocina un plato que no coincide, que no
está en condiciones o cuya alergia no está confirmada; el orden de salida del
pase; el retiro de platos; pedir manos para una mesa grande.

**Escala (aquí escalar SÍ merece crédito):** pedidos, bebidas y cuenta al
mesero (Manual: solo el vendedor del rango toma la orden y baja la cuenta);
cambios de platillo y precios al mesero; descuentos y cortesías al mesero o al
capitán (el runner no autoriza, Política de dinero); accidentes con clientes
al capitán.

**No merece crédito:** «se lo dejo al mesero» cuando el plato dudoso ya está en
sus manos. Detenerlo es tarea propia.

**Pendiente de operador:** numeración de posiciones; si el máximo de 3 platos
aplica para bajar; lámpara o zona caliente; si puede llevarse un plato para
recalentarlo sin consultar; quién llena el formato de rotos; cómo marca cocina
una alergia en el pase; si «garrotero» es sinónimo (el resolvedor de puestos
hoy lo deja sin examen a propósito).

## Indispensables (primer día)

P2 (alergia marcada), P4 (no tomar órdenes ni prometer descuentos), P5
(temperatura y mesa completa) y P6 (posición del comensal).

## Por pregunta

| P | Tarea real | Por qué la respuesta modelo es correcta |
|---|---|---|
| 1 (numérica, 4 personas) | Mesa grande | Manual: todos los comensales reciben al mismo tiempo y máximo 3 platos sin apilar; 10 / 3 = 3.33 → 4. La regla de 3 se da en el enunciado porque el manual la da para retirar (pendiente si aplica para bajar). |
| 2 | Alergia marcada | Un plato con alergia no sale sin confirmarse con cocina; se lleva separado y directo a su posición. Es el único punto donde el runner puede frenar un error de cocina antes de que llegue al cliente. |
| 3 | Plato equivocado | No dejar el error en la mesa, encontrar la causa en el ticket y avisar a mesero y cocina. Servir en otra mesa comida que otros ya tocaron es un riesgo de inocuidad. |
| 4 | Límites del puesto | Manual: «la única persona que puede tomar la orden de comida es el vendedor del rango» y «si una mesa quiere ordenar, le informamos que inmediatamente se acerca su mesero»; prohibido llevar algo no capturado. El runner no autoriza descuentos (Política de dinero). |
| 5 | Pase en el pico | Lo caliente que ya esperó y lo frío (nieve, aguachile) pierden primero. No se baja una mesa incompleta (Manual: sincronización). |
| 6 | Posición del comensal | El manual pide la posición de cada plato en la comanda, que el mesero esté presente al bajar los platos, servir por la derecha y la cara frontal hacia el cliente. Los dos rib eye con distinto término son el error típico. |
| 7 | Retiro de platos | Manual: retirar cuando todos terminaron, pedir permiso, máximo 3 sin apilar, cubiertos sobre el plato; descamoche con restos a la basura, platos al pasaplatos y cubiertos al tupper con detergente. Retirar el plato de quien lo pide es la excepción razonable. |
| 8 | Sustitución de cocina | Cambiar un ingrediente sin preguntar a la mesa puede meter un alérgeno (mariscos) y cambia el precio. El mesero lo consulta y corrige en el POS; el faltante se informa como 86. |
| 9 | Estación del runner | Checklist: salsas en cambro con cama de hielo, limones lavados y evidencia al grupo; al cierre las salsas se emplayan. Una salsa que quedó sin emplayar no se sirve sin revisarla. |
| 10 | Accidente en piso | Primero la persona y el vidrio; después el registro (formato de rotos del manual). La compensación a la clienta la decide el encargado, no el runner. |

## Competencias

24 preguntas, 4 por eje. Integridad: 4 de experiencia. Los demás ejes: 3 de
experiencia válidas fuera del restaurante y 1 hipotética del puesto (platos
sin saber la mesa, limpieza de la estación sin revisar, clienta molesta, no
saber qué lleva un platillo, mesero que lo culpa). Curiosidad y optimismo sin
señales de alerta.

## Pendientes para la versión 2 del banco

Cambian el enunciado; no se aplican en `banco_runner_v1`.

- **P1 y P6:** P6 empieza «Llevas cinco platos» cuando P1 fija un máximo de tres por persona. Decir en P6 que los cinco están listos y que organice el traslado (con apoyo o charola) antes de identificar a cada comensal. La clave de P1 (4 personas) es correcta.
- **P2:** decir en el caso que cocina debe confirmar preparación y contacto cruzado, y cómo se identifica el plato con alergia.
- **P4:** separar la canalización (bebidas y cuenta al mesero) del reclamo de la sopa y del descuento.
- **P5:** decir si hay lámpara o zona caliente y pedir que justifique el orden.
- **P6:** si se van a evaluar derecha y cara frontal, pedirlas de forma expresa.
- **P7:** si se evalúa el descamoche, pedir que describa el retiro hasta el lavado.
- **P8:** pedir de forma expresa qué confirma antes de que salga el plato.
- **P9:** dar el procedimiento de cocina para salsas del día anterior y si se manda evidencia al grupo.
- **Competencias 8, 12, 16 y 20:** repiten mesa equivocada, limpieza, queja e ingredientes. Usar versiones distintas, distinguir relato de hipótesis y respuestas genéricas, y anclar los niveles a la calidad de acciones y resultados sin premiar la longitud.

## Revisión de Codex r3 aplicada

Entrada: `revision_bancos/runner.md` (11 problemas). Enunciados, textos de
competencias, número, orden, tipos y ejes sin cambio (huella igual).

| Problema | Clase | Qué se hizo |
|---|---|---|
| 1. P1 y P6: carga máxima contra «llevas cinco platos» | B | Anotado en v2. Clave de P1 verificada. El límite para entregar ya estaba pendiente. |
| 2. P2: el mínimo puede omitir confirmar con cocina | A | `nucleo: ['confirma_cocina']`. `separado` ya no exige una marca concreta; `si_duda` acepta rehacer o cambiar. Cómo marca cocina: ya pendiente. |
| 3. P3: reasignar solo por «no los tocaron» | A | `mesa_correcta` distingue el plato que siguió en su mano (y cocina valida) del que ya dejó en la mesa; nueva alternativa: no recircular nunca. |
| 4. P4: facultad de retirar la sopa | C | Ya pendiente («si puede llevarse para recalentar o primero avisar al mesero»); `sopa` ya acepta las dos rutas. Separar subcasos → v2. |
| 5. P5: sin zona caliente; prioridad fija | A | `mesa_seis` acepta resguardo en cocina; la alternativa acepta cualquier orden justificado por el estado real. Zona caliente: ya pendiente. |
| 6. P6: derecha y cara frontal pesan como la identificación | A | Mínimo 2 de 4 con `nucleo: ['mesero', 'terminos']`; la pregunta discreta cuenta como `mesero`; `derecha` acepta el acceso seguro si está bloqueada. |
| 7. P7: permiso literal y estándar no pedido | A | Se quitó `permiso` (la seña ya es la petición); `sin_apilar` y `descamoche` simplificados; mínimo 2 de 4 con `nucleo: ['retira_pedido']`; nueva alternativa: preguntar discretamente a los otros que terminaron. |
| 8. P8: controles clave no obligatorios; alergia imprecisa | A | `nucleo: ['no_lleva', 'alergia']`; `alergia` pide asegurarse (él o el mesero) de que nadie tenga alergia o restricción al camarón; el POS lo corrige el mesero y el 86 solo se asegura de que se sepa. |
| 9. P9: «sin revisarlas» indefinido; evidencia no enunciada | A + C | `salsas_ayer` y el crítico: no usarlas sin consultar a cocina (el aspecto no basta); `cama_hielo` acepta conseguir hielo y montar en frío; `evidencia` → pedir ayuda o avisar si no alcanza. Nuevo pendiente: procedimiento de cocina y evidencia. |
| 10. P10: quién llena rotos; elementos compuestos | A | Separados `persona`, `aleja`, `vidrio`, `capitan`, `rotos` (reporte trazable al encargado) y `repone`; mínimo 4 de 6. Quién llena el formato: ya pendiente. |
| 11. Competencias que repiten el práctico; sin anclas | B | Anotado en v2. |
