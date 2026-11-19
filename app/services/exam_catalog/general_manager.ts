import type { ExamenPuesto } from './types.js'

// Gerente de restaurante (code 'general_manager'), etapas 1 y 2 en línea.
//
// Origen: diseño «Impulso — Evaluación por puesto y piloto Gerente» (Claude Doc,
// rev 43, estado «Propuesta»), con las correcciones de la revisión experta
// (DIAGNOSTICO_EXAMENES_IMPULSO.md §5.2). Mapa pieza del diseño → pregunta,
// lo que no entra y por qué: docs/examenes/puestos/general_manager.md
//
// Todos los datos son FICTICIOS (montos, nombres, porcentajes): no son cifras
// de La Llorona. Las facultades H1–H6 son hipótesis del diseño, no política
// aprobada; cada enunciado repite las que aplican, siempre como supuesto
// («Para este ejercicio, supón que…»), nunca como política del restaurante.
//
// Práctico (bloque A):
//   etapa 1 → q1–q8  (K1–K7; K5 partida en ml y %; K7 abierta, sin opciones)
//   etapa 2 → q9–q14 (casos 1, 2, 3 y 6; el caso 3 separa cálculo y razonamiento)
//   No entran: K8 (revisión legal pendiente), casos 4 y 5 (presenciales, etapa 3).
//   Banco v2 (2026-11-19): q6 y q12 con dato propio, q8 «primeros minutos»
//   sin protocolo médico exigido, q9 con nómina anterior en pesos, q13 sin la
//   pista de los cocteles, y una sola regla de sanciones en q9, q10 y q13.
// Competencias (bloque B): 30 preguntas, 5 por eje, en rondas de seis.
//   Incluye B1, B3, B6 y B10 (versión alterna) y los dilemas A, C y D como
//   hipotéticas abiertas; el dilema B pasa a experiencia (integridad es toda
//   de experiencia) con su conducta como señal de alerta.

// v2: una sola regla de sanciones (H1 + H3), dicha igual en cada caso que la
// necesita (q9, q10, q13).
const REGLA_SANCIONES =
  'Supón también que tú decides las amonestaciones documentadas, que los descuentos al sueldo y las suspensiones los decide el dueño, y que nadie atribuye responsabilidad ni pide una sanción por un faltante que no esté probado.'

const FAC_RESULTADOS =
  'Para este ejercicio, supón que autorizas cortesías hasta $800 por mesa y hasta 1 % de la venta semanal; que haces arqueos e investigas faltantes; que reportas al dueño cada lunes, y que el dueño fija metas y políticas y decide descuentos fuera de política y acciones legales. ' +
  REGLA_SANCIONES

const FAC_CAJA =
  'Para este ejercicio, supón que haces arqueos, investigas faltantes y puedes cambiar el procedimiento de caja; que reportas al dueño cada lunes y ante cualquier incidente grave, y que las acciones legales las decide el dueño. ' +
  REGLA_SANCIONES

const DATOS_TEQUILA =
  'Tequila premium en botellas de 750 ml: inventario inicial 18 botellas, compras de la semana 12, inventario final 14. El POS registra 240 copas de 45 ml de ese tequila. Precio de venta por copa: $180.'

export const EXAMEN_GENERAL_MANAGER: ExamenPuesto = {
  code: 'general_manager',
  label: 'Gerente',
  aliases: [
    'gerente',
    'gerenta',
    'gerente general',
    'gerente de restaurante',
    'gerente operativo',
    'gerente de unidad',
    'general manager',
  ],
  tareas: [
    'Lee los resultados de la semana (venta, costo, nómina, cortesías, cancelaciones) y reporta al dueño cada lunes',
    'Controla caja e inventario: arqueos, faltantes, varianzas de barra, cancelaciones y cortesías',
    'Organiza la plantilla contra la demanda y el presupuesto',
    'Da la primera respuesta a incidentes de clientes y de salud, los documenta y escala lo que no le toca',
    'Sostiene el estándar de servicio: reservas, tiempos, notas de clientes y recuperación de experiencias',
    'Hace los pedidos recurrentes con el chef dentro del presupuesto',
  ],
  facultades: {
    decide: [
      'H1 Personal: horarios, asignaciones y amonestaciones documentadas (hipótesis del diseño)',
      'H2 Cortesías: hasta $800 por mesa y hasta 1 % de la venta semanal (hipótesis del diseño)',
      'H3 Caja: arqueos, investigar faltantes y cambiar el procedimiento de caja (hipótesis del diseño)',
      'H4 Compras: pedidos recurrentes dentro del presupuesto, con el chef (hipótesis del diseño)',
      'H5 Incidentes: primera respuesta, documentación y contacto privado con los afectados (hipótesis del diseño)',
      'H6 Dueño: reporta cada lunes y ante cualquier incidente grave (hipótesis del diseño)',
    ],
    escala: [
      'H1 Contrataciones y despidos (los decide el dueño)',
      'H2 Descuentos o cortesías fuera de política (los decide el dueño)',
      'H3 Descuentos al salario y acciones legales (los decide el dueño)',
      'H4 Proveedores nuevos y compras fuera de presupuesto (los decide el dueño)',
      'H5 Comunicación pública, abogados y aseguradora (los decide el dueño)',
      'H6 Metas y políticas (las fija el dueño)',
    ],
    pendientesOperador: [
      'Confirmar H1: el gerente decide horarios, asignaciones y amonestaciones documentadas; contratar y despedir es del dueño',
      'Confirmar H2: tope de cortesías de $800 por mesa y 1 % de la venta semanal; fuera de eso decide el dueño',
      'Confirmar H3: el gerente hace arqueos, investiga faltantes y cambia el procedimiento de caja; descuentos al salario y acciones legales son del dueño',
      'Confirmar H4: pedidos recurrentes dentro de presupuesto con el chef; proveedores nuevos y compras fuera de presupuesto son del dueño',
      'Confirmar H5: primera respuesta, documentación y contacto privado con afectados; comunicación pública, abogados y aseguradora son del dueño',
      'Confirmar H6: reporte al dueño cada lunes y ante cualquier incidente grave; el dueño fija metas y políticas',
      'Definir si el gerente puede suspender un platillo de la carta (inocuidad, falta de insumo) sin consultar al chef o al dueño',
      'Definir qué permisos tiene el gerente en el POS para cancelar después de cobrar y para revisar o quitar ese permiso a otros usuarios',
      'Definir cuándo el gerente llama a seguridad o a la policía sin consultar al dueño (agresión, robo, amenaza)',
      'K8 (faltante de $500 de un cajero, LFT art. 110 fr. I): no entra hasta que un abogado laboral revise la clave',
      'Confirmar si K3 (arqueo, q3) y K7 (alergia, q8) son subhabilidades indispensables, como propone el diseño',
      'Confirmar pesos de las dimensiones y umbral de 70: el diseño no fija pesos ni cortes de porcentaje',
      'Confirmar la regla de sanciones que usa el banco v2 en q9, q10 y q13: el gerente decide amonestaciones documentadas; descuentos al sueldo y suspensiones los decide el dueño; nadie atribuye responsabilidad ni pide sanción por un faltante no probado',
    ],
  },
  practico: {
    version: 'banco_general_manager_v2',
    dimensiones: [
      { id: 'lectura_resultados', nombre: 'A1 Lectura de resultados', peso: 30 },
      { id: 'controles', nombre: 'A2 Controles de caja e inventario', peso: 35 },
      { id: 'incidentes', nombre: 'A4 Incidentes y cumplimiento', peso: 15 },
      { id: 'servicio', nombre: 'A5 Estándar de servicio y operación', peso: 20 },
    ],
    preguntas: [
      // ── Etapa 1 · conocimientos con clave (K1–K7) ─────────────────────────
      {
        tipo: 'numerica',
        q: 1,
        enunciado:
          'En una semana de octubre la venta neta fue de $380,000 y el consumo de alimentos y bebidas, de $121,600. ¿Qué porcentaje de la venta representó el costo de alimentos y bebidas? Responde con un solo número, en porcentaje, con un decimal.',
        dimension: 'lectura_resultados',
        evalua: 'Calcular el costo de alimentos y bebidas como porcentaje de la venta (K1)',
        tareaReal: 'Lectura del resultado semanal',
        indispensable: false,
        clave: 32,
        tolerancia: 0.1,
        unidad: '%',
        solucion: '121,600 ÷ 380,000 = 0.32 → 32.0 %. (Datos distintos a los del caso 1 para que el caso no revele la respuesta.)',
      },
      {
        tipo: 'numerica',
        q: 2,
        enunciado:
          'En esa misma semana de octubre la venta neta fue de $380,000 y el consumo de alimentos y bebidas, de $121,600. La meta de costo es 30 % de la venta. ¿Cuántos pesos de costo hubo por encima de la meta? Responde con un solo número, en pesos.',
        dimension: 'lectura_resultados',
        evalua: 'Traducir la desviación de costo contra la meta a pesos (K2)',
        tareaReal: 'Lectura del resultado semanal',
        indispensable: false,
        clave: 7600,
        tolerancia: 50,
        unidad: 'pesos',
        solucion: 'Meta: 30 % × 380,000 = 114,000. Exceso: 121,600 − 114,000 = 7,600.',
      },
      {
        tipo: 'numerica',
        q: 3,
        enunciado:
          'Al cierre: el fondo de caja era de $3,000, las ventas en efectivo fueron de $18,450 y hubo retiros documentados a caja fuerte por $10,000. Cuentas $11,120 en efectivo. ¿De cuánto es la diferencia? Responde con un solo número, en pesos: positivo si sobra dinero, con signo menos (-) si falta.',
        dimension: 'controles',
        evalua: 'Hacer un arqueo y determinar el signo y el monto de la diferencia (K3)',
        tareaReal: 'Arqueo de caja',
        indispensable: true,
        motivoIndispensable:
          'Si no sabe calcular lo que debe haber en caja ni distinguir un faltante de un sobrante, no puede detectar ni investigar faltantes, que es su control de dinero de cada cierre.',
        clave: -330,
        tolerancia: 0,
        unidad: 'pesos',
        solucion:
          'Esperado: 3,000 + 18,450 − 10,000 = 11,450. Contado 11,120 − esperado 11,450 = −330: faltante de $330.',
      },
      {
        tipo: 'numerica',
        q: 4,
        enunciado:
          'En una semana de septiembre la nómina fue de $104,500. Si la venta hubiera llegado a la meta de $400,000, ¿qué porcentaje de la venta habría sido la nómina? Responde con un solo número, en porcentaje, con un decimal.',
        dimension: 'lectura_resultados',
        evalua: 'Separar el efecto de la venta en el porcentaje de nómina (K4)',
        tareaReal: 'Lectura del resultado semanal',
        indispensable: false,
        // v2.1: clave canónica 26.1 (lo que pide el enunciado: un decimal).
        // ±0.05 acepta 26.1, 26.12, 26.125 y 26.13, y rechaza 26.0 y 26.2.
        clave: 26.1,
        tolerancia: 0.05,
        unidad: '%',
        solucion:
          '104,500 ÷ 400,000 = 0.26125 → 26.125 %, que a un decimal es 26.1 %. La tolerancia de ±0.05 acepta a quien da más decimales (26.12, 26.125, 26.13) y rechaza 26.2 y 26.0.',
      },
      {
        tipo: 'numerica',
        q: 5,
        enunciado:
          'Vodka en botellas de 1,000 ml: inventario inicial 10 botellas, compras 6, inventario final 7. El POS registra 168 copas de 50 ml. ¿Cuántos mililitros se consumieron sin estar registrados en el POS? Responde con un solo número, en mililitros.',
        dimension: 'controles',
        evalua: 'Calcular la varianza de una botella entre inventario y POS (K5, cantidad)',
        tareaReal: 'Varianza de barra',
        indispensable: false,
        clave: 600,
        tolerancia: 10,
        unidad: 'ml',
        solucion:
          'Consumo real: (10 + 6 − 7) × 1,000 = 9,000 ml. Registrado: 168 × 50 = 8,400 ml. Diferencia: 600 ml.',
      },
      {
        tipo: 'numerica',
        q: 6,
        enunciado:
          'Supón que en otra semana el inventario de vodka indica un consumo real de 7,500 ml y que 450 ml de ese consumo no están registrados en el POS. ¿Qué porcentaje del consumo real representa lo que no está registrado en el POS? Responde con un solo número, en porcentaje, con un decimal.',
        dimension: 'controles',
        evalua: 'Expresar la varianza como porcentaje del consumo real (K5, porcentaje)',
        tareaReal: 'Varianza de barra',
        indispensable: false,
        // v2: dato propio, para que un error en q5 no arrastre a q6. 6.0 exacto;
        // ±0.05 acepta 6, 6.0 y 6.05 y rechaza 6.4 (450 ÷ 7,050, sobre lo registrado).
        clave: 6,
        tolerancia: 0.05,
        unidad: '%',
        solucion:
          '450 ÷ 7,500 = 0.06 → 6.0 %. Sobre lo registrado (450 ÷ (7,500 − 450) = 450 ÷ 7,050 = 6.4 %) es incorrecto. Dato propio (v2): no depende del resultado de la pregunta 5.',
      },
      {
        tipo: 'numerica',
        q: 7,
        enunciado:
          'Para este ejercicio, supón que la política permite cortesías hasta por el 1 % de la venta semanal. En una semana de octubre la venta fue de $380,000 y las cortesías registradas suman $9,500. ¿Cuántos pesos de cortesías hubo por encima del límite? Responde con un solo número, en pesos.',
        dimension: 'lectura_resultados',
        evalua: 'Comparar cortesías contra el límite de la política (K6)',
        tareaReal: 'Control de cortesías',
        indispensable: false,
        clave: 5700,
        tolerancia: 10,
        unidad: 'pesos',
        solucion: 'Límite: 1 % × 380,000 = 3,800. Exceso: 9,500 − 3,800 = 5,700.',
      },
      {
        tipo: 'abierta',
        q: 8,
        enunciado:
          'Sábado, 9 de la noche. Al ordenar, un cliente avisó que es alérgico al cacahuate. Quince minutos después de recibir su platillo te llama y te dice que se le está cerrando la garganta. ¿Qué haces en los primeros minutos?',
        dimension: 'incidentes',
        evalua: 'Primera respuesta ante una posible reacción alérgica grave (K7)',
        tareaReal: 'Incidente de salud de un cliente en el servicio',
        indispensable: true,
        motivoIndispensable:
          'Si no activa de inmediato a emergencias ante una posible reacción alérgica grave, el cliente puede morir en minutos; el gerente es quien da la primera respuesta en el turno.',
        // v2: las esenciales no dependen de un protocolo de primeros auxilios
        // (activar emergencias, no dejarlo solo, pasar la información a los
        // paramédicos). Cualquier medida médica es sólo alternativa válida.
        esenciales: [
          {
            id: 'emergencias',
            texto:
              'Activa de inmediato la ayuda médica: llama al 911 o al servicio médico del lugar, o le indica a una persona concreta que llame ya',
          },
          {
            id: 'acompana',
            texto:
              'No deja sola a la persona mientras llega la ayuda: dice que él mismo se queda con el cliente o que pone a alguien a su lado. Basta una frase como «me quedo con el cliente» o «alguien se queda con él»; aquí quedarse uno mismo con el cliente es la acción del responsable y cuenta',
          },
          {
            id: 'paramedicos',
            texto:
              'Se asegura de que los paramédicos reciban la información del caso: se la da él o encarga a alguien que se la dé, por ejemplo la alergia al cacahuate, qué comió o cuándo empezaron los síntomas; basta uno de esos datos',
          },
        ],
        // Llamar a emergencias y no dejarlo solo ya es «correcta»; sin
        // emergencias no hay «correcta» (revisión de Codex r3).
        minimoCorrecta: 2,
        nucleo: ['emergencias'],
        alternativasValidas: [
          'Llamar al servicio médico con el que el restaurante tenga convenio en lugar del 911, siempre de inmediato',
          'Preguntar si trae autoinyector de epinefrina o su medicamento recetado y ayudarle a usarlo, o seguir las indicaciones que dé por teléfono el operador de emergencias (cuenta a favor; no se exige)',
          'Designar a alguien que reciba a los paramédicos en la entrada y los lleve hasta la mesa',
          'Conservar el platillo y la comanda para revisarlos después con cocina',
        ],
        erroresCriticos: [
          {
            id: 'espera',
            texto:
              'Decide esperar a ver si mejora, o atenderlo sólo con agua o una pastilla, en lugar de llamar a emergencias',
          },
          {
            id: 'retrasa',
            texto: 'Va primero a preguntar a cocina si el platillo tenía cacahuate antes de pedir ayuda médica',
          },
          {
            id: 'solo',
            texto: 'Lo deja solo o lo aparta a un lugar donde nadie lo vigila',
          },
        ],
      },

      // ── Etapa 2 · casos con datos ─────────────────────────────────────────
      {
        tipo: 'abierta',
        q: 9,
        enunciado:
          'Estos son los resultados de la semana (entre paréntesis, la meta o política y la semana anterior): venta neta $420,000 (meta $450,000; anterior $447,000); cubiertos 1,400 (anterior 1,490); costo de alimentos y bebidas 34.0 % (meta 30 %; anterior 30.8 %); nómina $117,600, 28.0 % (meta 25 %; anterior $117,500, 26.3 %); cortesías $13,020, 3.1 % (política hasta 1 %; anterior 1.1 %); cancelaciones después de cobrar: 12 tickets por $9,850, 8 de ellos del mismo usuario en el turno de la noche (anterior 2). De las cortesías, $4,500 las autorizaste tú el jueves para una mesa de amigos del dueño, sin registrar el motivo. ' +
          FAC_RESULTADOS +
          ' Es lunes y hoy le reportas la semana al dueño. Escribe lo que le dirás, en máximo una página. Al hablar de la nómina, separa cuánto de la desviación viene de la venta y cuánto del gasto.',
        dimension: 'lectura_resultados',
        evalua: 'Leer los resultados de la semana, priorizar qué revisar y reportarlo al dueño (caso 1)',
        tareaReal: 'Reporte semanal al dueño',
        indispensable: false,
        esenciales: [
          {
            id: 'cancelaciones',
            texto:
              'Pone las 8 cancelaciones después de cobrar del mismo usuario entre lo primero a revisar y dice que las verificará antes de señalar a alguien',
          },
          {
            id: 'cortesias',
            texto: 'Revisa quién autorizó cada cortesía y con qué motivo',
          },
          {
            id: 'costo',
            texto:
              'Revisa el costo con el chef por al menos una causa concreta (conteo, precios de compra, porciones, mermas o mezcla de venta)',
          },
          {
            id: 'nomina',
            // v2: con la nómina anterior en pesos se puede demostrar la causa.
            // Contra la semana anterior: el gasto casi no cambió (+$100) y el
            // % subió 26.3 → 28.0 por la venta. Contra la meta: con la venta de
            // la meta sería 26.1 % (117,600 ÷ 450,000): ~1.9 puntos por la venta
            // y ~1.1 por el gasto ($5,100 sobre $112,500 = 25 % × 450,000).
            texto:
              'Separa con al menos una cifra el efecto de la venta del efecto del gasto en la nómina. Vale cualquiera de dos lecturas: contra la semana anterior, el gasto casi no cambió, $117,600 contra $117,500, y el porcentaje subió porque bajó la venta; o contra la meta, con la venta de la meta la nómina sería alrededor de 26.1 %, 117,600 ÷ 450,000, así que cerca de 1.9 puntos vienen de la venta y cerca de 1.1 del gasto, unos $5,100 sobre los $112,500 de la meta. Solo nombrar el 28 % o el exceso en pesos no basta',
          },
          {
            id: 'propia',
            texto:
              'Reconoce ante el dueño la cortesía de $4,500 que él autorizó sin motivo, que excede su tope por mesa, y la documenta sin alterar el registro original',
          },
          {
            id: 'hechos',
            texto: 'Separa lo que ya sabe de lo que todavía es hipótesis y pone fecha a lo que revisará',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Empezar por las cortesías argumentando que pueden ocultar faltantes',
          'Pedir un conteo físico de inventario antes de revisar el costo con el chef',
        ],
        erroresCriticos: [
          {
            id: 'acusa',
            texto:
              'Señala o sanciona al usuario de las cancelaciones como responsable sin haberlas revisado',
          },
          {
            id: 'maquilla',
            texto:
              'Propone ajustar las cifras o dice que no reportará las cortesías de $4,500 que autorizó',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 10,
        enunciado:
          'En los últimos seis martes el cierre nocturno tuvo estos faltantes de caja: $420, $0, $310, $780, $550 y $640. Los martes cierra Carla, subgerente con dos años en el restaurante y amiga del dueño. El fondo lo entrega el turno de la mañana sin conteo conjunto y los retiros a caja fuerte no llevan doble firma. ' +
          FAC_CAJA +
          ' Describe, en orden, lo que haces esta semana.',
        dimension: 'controles',
        evalua: 'Investigar un faltante recurrente con método y corregir el procedimiento (caso 2)',
        tareaReal: 'Investigación de faltantes de caja',
        indispensable: false,
        esenciales: [
          {
            id: 'datos',
            texto:
              'Revisa los registros de esos martes antes de concluir (retiros, propinas con tarjeta, cortes parciales o cambio)',
          },
          {
            id: 'procedimiento',
            texto:
              'Cambia el procedimiento: conteo conjunto y firmado del fondo al cambio de turno (o doble firma en los retiros, o arqueo sin aviso)',
          },
          {
            id: 'mide',
            texto:
              'Mide los martes o cierres siguientes para comprobar si el faltante desaparece; basta dar seguimiento al faltante en cada cierre después del cambio',
          },
          {
            id: 'distingue',
            texto:
              'Explica cómo sabrá si es un error del proceso o de una persona y qué hará en cada caso',
          },
        ],
        minimoCorrecta: 3,
        alternativasValidas: [
          'Hablar primero con el dueño o empezar por corregir el procedimiento. Avisar al dueño no reemplaza investigar ni cambiar el procedimiento (le tocan al gerente): por sí solo no acredita ningún elemento',
          'Hablar con Carla antes de revisar los datos, si es para entender cómo hace el cierre y no para acusarla',
          'Para medir (mide): implantar conteo conjunto y doble firma y dar seguimiento en cada cierre para ver si el faltante desaparece, sin indicador ni comparación formal',
        ],
        erroresCriticos: [
          {
            id: 'descuenta',
            texto:
              'Descuenta el faltante del sueldo de Carla o la suspende (o anuncia que lo hará), o la sanciona o pide al dueño que la sancione por el faltante sin haberlo probado',
          },
          {
            id: 'acusa',
            texto: 'Acusa a Carla del faltante sin haber revisado los registros, o lo hace frente a otros',
          },
          {
            id: 'deja_pasar',
            texto:
              'Deja pasar el faltante o acuerda con Carla no informarle al dueño',
          },
        ],
      },
      {
        tipo: 'numerica',
        q: 11,
        enunciado:
          DATOS_TEQUILA +
          ' ¿Cuántos mililitros de diferencia hay entre lo que se consumió según el inventario y lo que registró el POS? Responde con un solo número, en mililitros.',
        dimension: 'controles',
        evalua: 'Calcular la varianza de tequila en mililitros (caso 3, cálculo)',
        tareaReal: 'Varianza de barra',
        indispensable: false,
        clave: 1200,
        tolerancia: 10,
        unidad: 'ml',
        solucion:
          'Consumo real: (18 + 12 − 14) × 750 = 12,000 ml. Registrado: 240 × 45 = 10,800 ml. Diferencia: 1,200 ml (10.0 % del consumo real). q11 y q13 son un caso compuesto: el cálculo se califica sólo aquí; q13 no lo vuelve a acreditar.',
      },
      {
        tipo: 'numerica',
        q: 12,
        enunciado:
          'Tequila premium servido en copas de 45 ml, con precio de venta de $180 por copa. Supón que la varianza fue de 900 ml: según el inventario se consumieron 900 ml que el POS no registró. ¿Cuánto valen esos 900 ml a precio de venta? Es un valor a precio de venta, no una pérdida demostrada. Responde con un solo número, en pesos.',
        dimension: 'controles',
        evalua: 'Valorar la varianza de tequila a precio de venta (caso 3, cálculo)',
        tareaReal: 'Varianza de barra',
        indispensable: false,
        // v2: dato propio (900 ml), para que un error en q11 no arrastre a q12.
        // 900 ÷ 45 = 20 copas exactas: no hay redondeo que tolerar.
        clave: 3600,
        tolerancia: 0,
        unidad: 'pesos',
        solucion:
          '900 ml ÷ 45 ml = 20 copas × $180 = $3,600 (o $180 ÷ 45 = $4 por ml × 900). Las copas salen exactas, así que la clave es exacta. Dato propio (v2): no depende del resultado de la pregunta 11. Es valor a precio de venta, no una pérdida demostrada ni prueba de robo.',
      },
      {
        tipo: 'abierta',
        q: 13,
        enunciado:
          DATOS_TEQUILA +
          ' Según el inventario se consumió más tequila del que registró el POS. Para este ejercicio, supón que investigas y puedes cambiar procedimientos de barra. ' +
          REGLA_SANCIONES +
          ' Primero di qué causas posibles ves para esta diferencia. Después, antes de concluir algo, ¿qué revisarías y en qué orden?',
        dimension: 'controles',
        // v2.1: q11 y q13 son un caso compuesto. q13 se califica con la
        // diferencia dada en el enunciado (inventario > POS); el cálculo ya se
        // calificó en q11 y aquí no da puntos ni cuenta como evidencia aparte.
        evalua:
          'Investigar una varianza de barra por causas probables antes de concluir, partiendo de la diferencia dada (caso 3, razonamiento; el cálculo se califica en q11, aquí no da puntos)',
        tareaReal: 'Varianza de barra',
        indispensable: false,
        // v2: el enunciado ya no menciona los cocteles; el candidato tiene que
        // pensar por su cuenta que el tequila pudo salir en otros productos.
        esenciales: [
          {
            id: 'recetas',
            texto:
              'Revisa si el tequila salió en otros productos que en el POS no descuentan esas copas (cocteles, botellas, promociones o un producto capturado con otro nombre)',
          },
          {
            id: 'conteo',
            texto: 'Revisa el conteo (vuelve a contar inicial o final, o las botellas abiertas)',
          },
          {
            id: 'sin_registro',
            texto: 'Revisa cortesías no capturadas o botellas rotas sin registro',
          },
          {
            id: 'medidor',
            texto: 'Revisa si se sirve con medidor (observa el servicio o mide copas servidas)',
          },
          {
            id: 'orden',
            texto:
              'Ordena la revisión de lo más probable o barato de verificar a lo menos, y deja el robo para después de descartar lo demás',
          },
          {
            id: 'mide_ajuste',
            texto: 'Dice cómo medirá en los conteos siguientes si el ajuste funcionó',
          },
        ],
        minimoCorrecta: 4,
        alternativasValidas: [
          'Incluir el robo como posible causa si lo deja al final y dice cómo lo verificaría',
          'Rehacer o citar el cálculo de la diferencia no suma ni resta: aquí se califica la investigación a partir de la diferencia dada',
        ],
        erroresCriticos: [
          {
            id: 'concluye_robo',
            texto:
              'Concluye que es robo, o acusa o sanciona al barman por el faltante (o pide al dueño que lo sancione) sin haberlo probado; o le descuenta el faltante del sueldo (o anuncia que lo hará)',
          },
        ],
      },
      {
        tipo: 'abierta',
        q: 14,
        enunciado:
          'Sábado, 9:30 de la noche, comedor al 95 %. En la mesa 12 está una pareja que viene cada mes y celebra su aniversario; estaba anotado en la reserva, pero nadie lo vio. Esperaron 40 minutos el plato fuerte y llegó uno equivocado. El cliente, molesto, pide hablar con el gerente. Daniel, su mesero, lleva dos semanas en el puesto y está en la estación a punto de llorar porque el cliente le levantó la voz. Luis, el capitán, está disponible. Para este ejercicio, supón que puedes dar cortesías de hasta $800 por mesa y que esta semana todavía tienes margen suficiente dentro del 1 % de la venta semanal. Describe lo que haces desde este momento y hasta el día siguiente.',
        dimension: 'servicio',
        evalua: 'Recuperar una experiencia de servicio, cuidar al equipo y corregir el proceso que falló (caso 6)',
        tareaReal: 'Recuperación de servicio y seguimiento',
        indispensable: false,
        esenciales: [
          {
            id: 'va',
            texto: 'Va personalmente a la mesa pronto y escucha la queja sin excusas',
          },
          {
            id: 'plato',
            texto:
              'Resuelve el plato: hace que cocina saque el correcto con prioridad, o acuerda con el cliente otra solución si ya no lo quiere (otro platillo, retirarlo de la cuenta)',
          },
          {
            id: 'aniversario',
            texto: 'Reconoce el aniversario con la pareja',
          },
          {
            id: 'daniel',
            texto:
              'Cubre a Daniel en la mesa (Luis la toma o lo acompaña) y habla con él después sin culparlo',
          },
          {
            id: 'proceso',
            texto:
              'Al día siguiente revisa por qué nadie vio la nota de la reserva o por qué tardó el plato, y cambia algo del proceso',
          },
          {
            id: 'seguimiento',
            texto:
              'Da seguimiento a la pareja después de esa noche (mensaje, invitación o un detalle en su próxima visita)',
          },
        ],
        minimoCorrecta: 4,
        // v2.1: sin ir a la mesa y sin resolver el plato no hay «correcta»
        // (omitirlos baja a parcial; no es error crítico).
        nucleo: ['va', 'plato'],
        alternativasValidas: [
          'Atender primero a Daniel unos segundos y luego ir a la mesa, o al revés',
          'Un postre, una bebida o ningún gesto económico, si hay atención personal y seguimiento',
          'Un gesto mayor a $800 consultado antes con el dueño',
          'Consultar al dueño una cortesía de $800 o menos no suma: está dentro de sus facultades y del margen semanal que da el caso',
        ],
        erroresCriticos: [
          {
            id: 'exhibe',
            texto: 'Regaña o corrige a Daniel frente a otros durante el servicio',
          },
          {
            id: 'culpa',
            texto:
              'Le dice al cliente que la culpa fue de cocina o de Daniel, o discute con él quién tuvo la culpa',
          },
        ],
      },
    ],
    umbralAprobado: 70,
  },
  competencias: {
    version: 'competencias_general_manager_v2',
    preguntas: [
      // ── Ronda 1 · B1, B3, B6, B10 del diseño (versión alterna) ────────────
      {
        // B1
        texto:
          'Cuéntame de la última vez que un error tuyo, en cualquier trabajo, afectó dinero, inventario o a un cliente: qué pasó, a quién se lo dijiste y cuándo.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo dijo él mismo, antes de que alguien más lo descubriera',
          'Se lo dijo pronto a quien correspondía (jefe, encargado, cliente)',
          'Asumió su parte: repuso, corrigió o cambió algo para que no se repitiera',
        ],
        senalesAlerta: [
          'Ocultó el error o lo cuadró con otro dinero o registro para que no se notara',
          'Culpó a otra persona de su propio error',
        ],
      },
      {
        // B3
        texto:
          'Cuéntame de una decisión tuya que afectó a tu turno, a tu equipo o a otras personas y salió mal: cuándo te diste cuenta y qué cambiaste.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Identifica su parte concreta en la decisión, sin repartirla entre otros',
          'Describe el impacto que tuvo en otras personas',
          'Nombra un cambio concreto que hizo después',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que algo que te habían encargado se iba a retrasar o a quedar distinto de lo prometido: cuándo te diste cuenta, qué hiciste tú y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Avisó a quien dependía de eso en cuanto lo supo, no al final',
          'Propuso o hizo algo concreto para cumplir lo más posible',
          'Cumplió lo que sí se comprometió a entregar',
        ],
        senalesAlerta: [
          'Dejó sin hacer algo de seguridad, higiene o dinero del que dependían otros y no avisó a nadie',
        ],
      },
      {
        // B6
        texto:
          'Cuéntame de la última vez que lograste recuperar a un cliente, o a cualquier persona a la que atendías, que estaba molesto: qué notaste, qué hiciste tú y qué pasó después.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe qué necesitaba la persona, más allá de la queja',
          'Escuchó y adaptó lo que hizo a esa persona, sin dar todo ni negar todo',
          'Sabe qué pasó después (volvió, respondió, cambió su trato)',
        ],
        senalesAlerta: ['Humilló o exhibió al cliente, o lo trató como adversario'],
      },
      {
        texto:
          'Cuéntame de la última vez que un número o un resultado no te cuadraba, como una cuenta, un inventario, una venta o un gasto de tu casa: qué notaste, qué hiciste para entenderlo y qué encontraste.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Buscó la causa en lugar de quedarse con la primera explicación',
          'Preguntó a otras personas o revisó datos para entenderlo',
          'Aplicó lo que encontró',
        ],
        senalesAlerta: [],
      },
      {
        // B10
        texto:
          'Cuéntame de una vez que tú o un compañero hicieron algo excepcional por un cliente o por alguien a quien atendían: qué pasó, qué hiciste tú para que fuera posible y cómo se reconoció.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe una acción concreta suya que lo hizo posible (dar tiempo, recursos, permiso o apoyo)',
          'Reconoció a quien lo hizo de forma concreta',
          'Habla del equipo o del compañero con aprecio, no sólo de sí mismo',
        ],
        senalesAlerta: [],
      },

      // ── Ronda 2 ──────────────────────────────────────────────────────────
      {
        texto:
          'Cuéntame de una vez que tuviste que entregar un resultado o un reporte que te dejaba mal, como una meta no cumplida, un número bajo o un error: qué mostraba, cómo lo presentaste y qué pasó después.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo presentó completo y a tiempo, incluida la parte que lo dejaba mal',
          'Separó su parte de lo que dependía de otros sin esconderla',
          'Propuso qué haría para corregirlo',
        ],
        senalesAlerta: [
          'Cambió cifras, omitió a propósito la parte que lo dejaba mal o la presentó como de otra persona',
        ],
      },
      {
        texto:
          'Cuéntame de la última vez que te diste cuenta de que tu forma de hablarle a alguien, un compañero, alguien a tu cargo o un familiar, le había afectado más de lo que pensabas: cómo te diste cuenta, qué hiciste tú y cómo terminó.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reconoce qué dijo o hizo, con sus palabras, sin minimizarlo',
          'Describe el efecto en la otra persona',
          'Cuenta qué hizo después (disculpa, conversación, cambio de trato)',
        ],
        // Revisión de Codex r3: reconocer el error y repararlo NO es alerta;
        // solo lo es una conducta grave que además justifica.
        senalesAlerta: ['Relata insultos, humillaciones o amenazas y los justifica, sin reparar'],
      },
      {
        texto:
          'Cuéntame de una vez que dejaste a otras personas a cargo de algo tuyo, como un turno, un proyecto o una tarea, y tenía que salir bien sin ti: cómo lo preparaste, qué pasó y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Dejó instrucciones, responsables o una lista concreta',
          'Revisó después cómo salió, sin depender de estar presente',
          'Ajustó algo a partir de lo que pasó',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que un compañero o alguien a tu cargo cometió un error frente a un cliente o frente a otras personas: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Atendió primero la situación sin exhibir a la persona',
          'Habló con ella en privado y escuchó su versión',
          'Cuidó también al cliente o a los afectados',
        ],
        senalesAlerta: ['Lo regañó, se burló o lo exhibió frente a otros'],
      },
      {
        texto:
          'Cuéntame de una vez que alguien de tu equipo o un compañero no estaba de acuerdo con una idea tuya: qué te dijo, qué hiciste para entender su punto y cómo terminó.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Preguntó para entender sus razones antes de defender la idea',
          'Cambió o ajustó algo por lo que escuchó, o explica con datos por qué no',
          'Comprobó después cuál de las dos opciones funcionó',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que te tocó trabajar con alguien a quien los demás daban por perdido o con quien nadie quería trabajar: qué pasó, qué hiciste tú y cómo terminó.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Le dio una oportunidad real con algo concreto (tarea, apoyo, conversación)',
          'Reconoce el problema sin negarlo ni culpar sólo a la persona',
          'Describe un resultado, aunque haya sido parcial',
        ],
        senalesAlerta: [],
      },

      // ── Ronda 3 ──────────────────────────────────────────────────────────
      {
        // Dilema B del diseño, pasado a experiencia (integridad es toda de experiencia).
        texto:
          'Cuéntame de una vez que alguien con más autoridad que tú, como un jefe, un dueño o un cliente importante, te pidió saltarte un registro, un control o una regla: qué te pidió, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Se negó y explicó el riesgo, aunque no propusiera alternativa',
          'Propuso una forma registrada o permitida de lograr lo que se buscaba',
          'Sostuvo su postura aunque le costara algo en la relación',
        ],
        senalesAlerta: [
          'Cumplió la instrucción de no registrar ventas, alterar un registro o saltarse un control (aunque se la dieran por escrito) y lo presenta como normal',
        ],
      },
      {
        texto:
          'Cuéntame de una vez que estabas seguro de tener la razón sobre algo y resultó que no: qué pensabas, cómo te diste cuenta y qué hiciste después.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe con precisión en qué se equivocó',
          'Cuenta cómo lo reconoció ante los demás',
          'Nombra qué cambió en su forma de decidir',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que diste seguimiento a algo que ya habías entregado o encargado, para comprobar que de verdad se hizo: qué era, qué revisaste y qué encontraste.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Revisó por su cuenta, sin que nadie se lo pidiera',
          'Describe qué revisó de forma concreta',
          'Corrigió o avisó lo que encontró',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que tuviste que decirle que no a alguien que te pedía algo importante para él o ella, como un permiso, un cambio o un favor: qué te pidió, cómo se lo dijiste y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Entendió por qué era importante para la persona',
          'Se lo dijo de frente, con honestidad y una razón explicable',
          'Buscó una opción que atendiera la necesidad de fondo',
        ],
        senalesAlerta: ['Se burló de la petición o lo humilló al negarse'],
      },
      {
        texto:
          'Cuéntame de la última vez que fuiste a ver por ti mismo cómo se hacía algo en otro lugar o en otra área, como otro restaurante, otro negocio u otro equipo: qué fuiste a ver, qué te llevaste y qué aplicaste.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Fue por iniciativa propia a observar o preguntar',
          'Describe algo concreto que aprendió',
          'Lo aplicó o lo propuso en su trabajo',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que un cambio que no elegiste, como un nuevo jefe, nuevas reglas, otro lugar u otro horario, afectó tu trabajo o tu vida: cómo lo tomaste, qué hiciste tú y cómo terminó.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reconoce lo difícil del cambio sin negarlo',
          'Describe acciones concretas para adaptarse o sacarle provecho',
          'Habla de los demás sin culparlos de forma sistemática',
        ],
        senalesAlerta: [],
      },

      // ── Ronda 4 ──────────────────────────────────────────────────────────
      {
        // Mitad «reglas parejas» del dilema C, en experiencia.
        texto:
          'Cuéntame de una vez que tuviste que aplicar una regla a alguien que te caía bien o que era muy bueno en su trabajo: qué regla era, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'La aplicó igual que a cualquier otra persona',
          'Lo hizo aunque le costara algo en la relación',
          'Trató a la persona con justicia y respeto al hacerlo',
        ],
        senalesAlerta: [
          'Le dejó pasar una falta de dinero, inventario o seguridad que a otros sí les sancionaba',
        ],
      },
      {
        texto:
          'Cuéntame de una vez que le pediste a alguien que te dijera con franqueza cómo lo estabas haciendo: por qué se lo pediste, qué te dijo y qué hiciste con eso.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'La pidió por iniciativa propia',
          'Repite lo que le dijeron, incluso lo que no le gustó',
          'Describe un cambio concreto y cómo comprobó que se sostuvo',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de la última vez que tuviste que mantener un estándar de limpieza, higiene, seguridad o calidad cuando nadie te estaba revisando y era más fácil saltártelo: qué era, qué hiciste tú y cómo terminó.',
        eje: 'etica_trabajo',
        tipo: 'experiencia',
        senalesPositivas: [
          'Cumplió el estándar completo sin supervisión',
          'Explica por qué importaba (a quién afectaba)',
          'Si no podía cumplirlo, avisó a tiempo',
        ],
        senalesAlerta: [
          'Se saltó un estándar de inocuidad o seguridad, no avisó y lo presenta como normal',
        ],
      },
      {
        texto:
          'Cuéntame de una vez que notaste lo que alguien necesitaba antes de que te lo pidiera, en el trabajo o fuera de él: qué notaste, qué hiciste tú y cómo terminó.',
        eje: 'empatia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe la señal concreta que notó',
          'Actuó de forma adecuada a esa persona',
          'Sabe cómo lo recibió la persona',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que probaste una forma nueva de hacer algo y tuviste que comprobar si de verdad funcionaba: qué probaste, cómo lo comprobaste y qué resultó.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe qué cambió y por qué lo intentó',
          'Comprobó el resultado con algo concreto (datos, opinión de otros, comparación)',
          'Ajustó o descartó según lo que encontró',
        ],
        senalesAlerta: [],
      },
      {
        texto:
          'Cuéntame de una vez que encontraste una oportunidad dentro de un problema, en el trabajo o fuera de él: cuál era el problema, qué viste y qué hiciste tú.',
        eje: 'optimismo_bondadoso',
        tipo: 'experiencia',
        senalesPositivas: [
          'Reconoce el problema sin minimizarlo',
          'La oportunidad que describe es realista',
          'Describe acciones concretas, no sólo ánimo',
        ],
        senalesAlerta: [],
      },

      // ── Ronda 5 · incluye los dilemas C, A y D ───────────────────────────
      {
        texto:
          'Cuéntame de la última vez que un proveedor, un cliente o alguien con quien trabajabas te ofreció un regalo, un descuento o un favor personal: qué te ofreció, qué hiciste tú y cómo terminó.',
        eje: 'integridad',
        tipo: 'experiencia',
        senalesPositivas: [
          'Lo rechazó o lo transparentó con su jefe o con quien correspondía',
          'Separó el regalo de sus decisiones de trabajo (pedidos, precios, trato)',
          'Explica por qué lo hizo así',
        ],
        senalesAlerta: [
          'Aceptó un beneficio personal a cambio de favorecer a esa persona en pedidos, precios o trato, sin decirlo a nadie',
        ],
      },
      {
        texto:
          'Cuéntame de una tarea o responsabilidad que te costaba más que a los demás: cómo te diste cuenta, qué hiciste tú y cómo te ha ido desde entonces.',
        eje: 'autoconciencia',
        tipo: 'experiencia',
        senalesPositivas: [
          'Nombra con precisión qué le costaba',
          'Describe qué hizo al respecto (practicar, pedir ayuda, delegar)',
          'Sabe si mejoró y cómo lo sabe',
        ],
        senalesAlerta: [],
      },
      {
        // Dilema C del diseño, sólo la mitad «sostener la regla en el equipo».
        texto:
          'Tu capitán con mejor desempeño llega tarde por tercera vez este mes y el equipo ya lo comenta. Para este ejercicio, supón que el reglamento marca amonestación por escrito a la tercera llegada tarde en el mes y que amonestar te corresponde a ti. ¿Qué haces?',
        eje: 'etica_trabajo',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Le aplica la amonestación que marca el reglamento, igual que a cualquiera',
          'La documenta',
          'Da seguimiento a su puntualidad en las semanas siguientes',
        ],
        senalesAlerta: ['Lo amonesta o lo exhibe frente al equipo como ejemplo'],
      },
      {
        // Dilema A del diseño.
        texto:
          'Viernes, en pleno servicio: el chef y la subgerente discuten a gritos junto al pase y los clientes de la barra los escuchan. Los dos son buenos en lo suyo. ¿Qué haces?',
        eje: 'empatia',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Los separa en ese momento, con discreción y lejos de los clientes',
          'Habla después con cada uno por separado y escucha las dos versiones',
          'Atiende a los clientes que lo escucharon, si hace falta',
          'Si hay agresión física o amenaza, pide apoyo de seguridad o escala de inmediato',
        ],
        senalesAlerta: [
          'Los deja seguir discutiendo frente a los clientes y lo pospone para otro día',
          'Los regaña a gritos o los humilla frente a clientes o equipo',
        ],
      },
      {
        // B8 queda para la entrevista; esta pide enseñar lo aprendido (ancla 4).
        texto:
          'Cuéntame de algo que le enseñaste a otra persona porque tú lo habías aprendido hace poco: qué era, cómo se lo enseñaste y cómo le fue.',
        eje: 'inteligencia_curiosa',
        tipo: 'experiencia',
        senalesPositivas: [
          'Describe con precisión lo que aprendió y de dónde',
          'Lo compartió o enseñó por iniciativa propia',
          'Comprobó si a la otra persona le funcionó',
        ],
        senalesAlerta: [],
      },
      {
        // Dilema D del diseño (reclasificado de empatía a optimismo; ver la nota).
        texto:
          'Un cliente que viene cada semana te pide un platillo que salió de la carta hace dos meses. Son las 9 de la noche y cocina va al 85 % de su capacidad. ¿Qué haces?',
        eje: 'optimismo_bondadoso',
        tipo: 'hipotetica',
        senalesPositivas: [
          'Pregunta al chef si se puede preparar ahora sin afectar las otras comandas, y ofrece una alternativa si no',
          'Ofrece preparárselo en su próxima visita con aviso previo',
          'Le da al cliente una respuesta honesta y una opción concreta, sin prometer antes de saber si cocina puede',
        ],
        senalesAlerta: [],
      },
    ],
  },
}
