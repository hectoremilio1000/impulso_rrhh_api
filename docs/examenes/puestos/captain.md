# Capitán de meseros (`captain`): tareas, facultades y por qué de cada pregunta

Ficha: `app/services/exam_catalog/captain.ts` · práctico `banco_captain_v1`
(12 preguntas, 1 numérica) · competencias `competencias_captain_v1` (30,
5 por eje: puesto de mando). Umbral de aprobado: 70.

Fuentes: «Manual de Introducción Mesero y Capitan» (La Llorona) y
«Sesion4_Politica_Dinero.md» (v1.0, sin fecha ni responsable). Estado:
**provisional** hasta que lo confirmen dos operadores.

## Qué cambia respecto al banco anterior (`10-108a04047ed77c0e`)

- Se agregaron reservas y lista de espera (P1 y P3), reparto de propinas (P9,
  numérica) y cierre de turno (P10).
- Cada enunciado tiene una sola pregunta (antes había 3 o 4 subpreguntas) y
  ninguno da pistas («sin gritar»).
- Integridad son 5 de experiencia.

## Tareas del puesto

1. Revisar el montaje y dar el briefing (reservas, 86 y productos que conviene vender).
2. Repartir secciones y ajustarlas durante el turno.
3. Llevar con la hostess las reservas y la lista de espera: tiempos reales, tolerancia de 15 minutos (Manual) y orden justo.
4. Supervisar a meseros y runners, y apoyar en el pase.
5. Resolver los incidentes que le escalan.
6. Autorizar las acciones de dinero que le tocan y escalar las demás.
7. Cobrar cuando el subgerente o el gerente lo autorizan (Manual).
8. Cerrar el piso: checklists, cuentas cerradas, rotos y entrega.
9. Calcular el tronco de propinas por puntos.

## Facultades

**Decide él (escalar no lo sustituye):** reparto de secciones; orden de la
lista de espera; descuentos de 0 a 10 % con motivo y nota en el POS; cancelar
lo aún no enviado por error de captura; quién apoya a quién; revisar y firmar
los checklists de cierre; registrar los rotos.

**Escala (aquí escalar SÍ merece crédito):**
- Cancelar lo ya enviado a producción: subgerente o gerente.
- Cortesías, reembolsos, descuentos de más de 10 % y cualquier acción con impacto de $200 o más.
- Cobrar: solo con autorización del subgerente o gerente.
- Cliente ebrio que no acepta retirarse: gerente.
- Sanciones y faltas repetidas: documenta e informa.

**No merece crédito:** «se lo paso al subgerente» en el reparto de secciones,
la lista de espera, el montaje o el cierre del piso.

**Pendiente de operador:** vigencia de la política de dinero; quién reparte el
tronco, cada cuándo y con qué puntos para capitán y runner; si existe la
hostess (el organigrama del manual no la lista en piso); quién confirma las
reservas; si el capitán puede mandar a cambiarse a un mesero.

## Indispensables (primer día)

P2 (reparto de secciones), P3 (lista de espera y reservas), P4 (incidente de
mesa dentro de su facultad) y P10 (cierre del piso).

## Por pregunta

| P | Tarea real | Por qué la respuesta modelo es correcta |
|---|---|---|
| 1 | Apertura y briefing | Manual: checklist de apertura, código de vestimenta (camisa blanca, calzado negro), confirmar las reservas por teléfono preguntando alergias y poner el letrero de reservado, y briefing antes de abrir con el 86. El capitán asigna y comprueba; no lo hace todo él. |
| 2 | Reparto de secciones | Equilibrio de carga, protección del nuevo y responsable de la reserva grande. La salida programada obliga a transferir las cuentas abiertas en el POS antes de que se vaya. |
| 3 | Lista de espera | Manual: tolerancia de 15 minutos y asignar la mesa por número de personas y disponibilidad. Dar tiempos reales y respetar el orden evita la queja más común en la entrada. Saltarse la lista por propina es un trato desigual. |
| 4 | Plato mal cocido | Atender a la mesa, ver en el POS si fue error de captura o de cocina y reponer. Las cortesías y las cancelaciones de lo enviado no son del capitán (Política de dinero): pedirlas al subgerente o al gerente sí merece crédito. |
| 5 | Error de captura | Política de dinero: antes de enviar, el capitán autoriza si es error de captura; después de enviar, solo el subgerente o el gerente. La corrección de fondo es enseñar a cuadrar la cantidad con las personas (Manual). |
| 6 | Mesa sin carta | Manual: 5 minutos como máximo para presentarse con la carta. Primero el cliente y después el mesero, en privado. |
| 7 | Menor tomando | La ley y el restaurante no permiten que un menor tome, aunque su familia lo autorice. Se retira la bebida con discreción y, si se repite, se deja de servir alcohol a la mesa. |
| 8 | Cobro con autorización | Manual: el capitán cobra solo si el subgerente o el gerente lo autorizan. División: 3,180 − 1,200 = 1,980; 990 por tarjeta. Registrar y entregar a caja de inmediato evita faltantes. |
| 9 (numérica, $6,000) | Tronco de propinas | Manual: tronco por puntos, meseros con 9 puntos y retardos que descuentan puntos. Puntos totales 56; valor del punto 750; Pedro 8 × 750. Los puntos de runners y capitán son datos del caso (pendiente). |
| 10 | Cierre del piso | Manual: checklist de cierre de mesero, formato de rotos (fecha, nombre, hora, concepto, firma), salsas faltantes al grupo de cocina y avisar el cierre a la mesa. Firmar un checklist sin revisarlo es alterar un registro (regla de la casa). |
| 11 | Pleito por una mesa | Primero el cliente y la imagen del salón; después una regla igual para todos. Decidir por amistad rompe la confianza del equipo. |
| 12 | Pase saturado | Manual: todos los comensales reciben sus platos al mismo tiempo; mover al piso a llevar platos y no mandar comida fría. |

## Competencias

30 preguntas, 5 por eje. Integridad: 5 de experiencia (dinero de más,
deshonestidad ajena, trato especial a un cercano, repartir algo entre varios,
error propio que afectó a otros). Los demás ejes: 4 de experiencia válidas
fuera del restaurante y 1 hipotética de mando (reparto equivocado, checklists
sin revisar, mesero con mala noche, espera de viernes, equipo quejándose frente
a clientes). Curiosidad y optimismo sin señales de alerta.

## Pendientes para la versión 2 del banco

Cambian el enunciado; no se aplican en `banco_captain_v1`.

- **P1:** dividir en dos casos (apertura material; reservas y briefing) y decir en el caso quién confirma reservas, si hay hostess y si el capitán puede mandar a cambiarse a un mesero.
- **P2:** dar ocupación esperada y la carga de terraza si se quiere un reparto comprobable.
- **P3:** decir en el caso quién puede decidir respetar una reserva tardía.
- **P4 y P5:** adjuntar la política de dinero vigente y los precios (rib eye, paloma) para comprobar el límite de $200; separar autorizar de ejecutar en el POS.
- **P6:** pedir de forma expresa quién conserva el seguimiento de la mesa 31.
- **P8:** decir en el caso quién está autorizado a cobrar (¿hay cajero?).
- **P9:** presentar los puntos (incluido el de Pedro) como datos del ejercicio, sin que el descuento por retardos parezca norma del puesto.
- **P12:** decir qué platos faltan y si hay lámpara o zona caliente para conservar.
- **Competencias 10, 15, 20, 25 y 30:** repiten reparto, checklist, mesero que necesita apoyo, espera y pase saturado. Usar casos distintos o separar la aplicación; anclas de nivel por evidencia; un episodio narrado en una pregunta hipotética cuenta como relato, nunca como conducta observada.

## Revisión de Codex r3 aplicada

Entrada: `revision_bancos/captain.md` (10 problemas). Enunciados, textos de
competencias, número, orden, tipos y ejes sin cambio (huella igual).

| Problema | Clase | Qué se hizo |
|---|---|---|
| 1. P1: pregunta múltiple, facultades pendientes, alergias y letreros no enunciados | A | `reservas` sólo pide que alguien confirme hoy las tres reservas (alergias y letreros suman, no se exigen); `uniforme` acepta reportarlo al subgerente. Facultades ya pendientes; dividir el caso → v2. |
| 2. P2 sin datos para un reparto único; P5 iguala cantidad con personas | A | `equilibra` acepta cualquier criterio razonado y explicado. P5 `ensena`: cotejar contra la orden confirmada. Datos de ocupación → v2. |
| 3. P3: tolerancia contradictoria con la alternativa | A + C | `tolerancia` acepta las dos rutas (espera real, o respetar la reserva si quien decide en el turno lo resuelve, comunicándolo a la lista); la alternativa dice cuándo cuenta. Nuevo pendiente: quién decide la excepción. |
| 4. P4 y P5: política de dinero sin vigencia ni datos | C | Vigencia ya pendiente; nuevo pendiente: cómo se combinan 0–10 %, menos de $200 y si ya se envió a producción. Precios → v2. |
| 5. P6: alcance de la delegación | A | `atiende` acepta que un mesero asignado y comprobado atienda la mesa; la alternativa dice que el capitán conserva el seguimiento y que solo pasar la queja al subgerente no cuenta. |
| 6. P8: cajero no definido; `cobra` y `registra` compuestos | A + C | Separados `cobra`, `registra` y `entrega_caja` (mínimo 4 de 5). Nueva alternativa: cobro por responsable autorizado equivale a `autorizacion` + `cobra`. `sin_autorizacion` sólo con un acto expreso. Nuevo pendiente: ¿hay cajero autorizado? |
| 7. P9: rol y regla de propinas | C | Clave verificada (56 puntos, $750 por punto, $6,000). Quién calcula y los puntos ya estaban pendientes; nuevo pendiente: si los retardos descuentan puntos. Enunciado → v2. |
| 8. P10: crítico por omisión; cuenta activa en sobremesa | A | El error `rotos` ahora pide un acto expreso (a sabiendas a nombre de otro, o decide no registrarlas). `cuentas` acepta transferir la cuenta activa a quien se queda con la sobremesa. |
| 9. P12: mesa junta contra temperatura | A | `completos` ya no exige simultaneidad a costa de la temperatura; alternativas: retener con revisión de cocina, o secuenciar con apoyo priorizando la temperatura. Datos de conservación → v2. |
| 10. Competencias que repiten el práctico; sin anclas | B | Anotado en «Pendientes para la versión 2 del banco». |
