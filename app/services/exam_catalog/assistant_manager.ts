import type { ExamenPuesto } from './types.js'
import { BANCO_SUBGERENTE_V3 } from '#services/practical_banks/assistant_manager'
import { RUBRICA_SUBGERENTE_V3 } from '#services/practical_rubrics/assistant_manager_v3'
import { DIMENSIONES } from '#services/practical_rubrics/assistant_manager'
import { COMPETENCIAS_SUBGERENTE_V2 } from './assistant_manager_competencias.js'

// Subgerente: el práctico es el banco v3 con su rúbrica v3 (revisado por Codex
// en las rondas 1 y 2); aquí sólo se reúne en la ficha común del catálogo.
// Las competencias son el banco v2 de 30 preguntas (re-etiquetado).
export const EXAMEN_ASSISTANT_MANAGER: ExamenPuesto = {
  code: 'assistant_manager',
  label: 'Subgerente',
  aliases: ['subgerente', 'sub gerente', 'subgerenta', 'gerente de turno', 'asistente de gerente'],
  tareas: [
    'Abre y cierra el turno con checklist, fondo y corte de caja',
    'Asigna secciones y cubre ausencias del turno',
    'Vigila tiempos, espera y cancelaciones en vivo y decide qué atender',
    'Resuelve incidentes de clientes y de alcohol con discreción',
    'Revisa cancelaciones, cortesías y cobros, y reporta al gerente',
  ],
  facultades: {
    decide: [
      'Reasignar secciones y cubrir ausencias del turno',
      'Cortar el servicio de alcohol a un cliente',
      'Aceptar o declinar un grupo sin reserva según capacidad',
      'Cortesías dentro de la política vigente',
    ],
    escala: [
      'Faltantes de caja sin explicación',
      'Sanciones al personal',
      'Seguridad o agresión',
      'Devoluciones de dinero fuera de política',
    ],
    pendientesOperador: [
      'Monto máximo de cortesía que autoriza sin el gerente',
      'Si puede gestionar una devolución por doble cobro o sólo reportarla',
      'Si el crédito por responder como mesero («mi mesa») debe ser cero',
    ],
  },
  practico: {
    version: 'banco_subgerente_v3',
    dimensiones: Object.entries(DIMENSIONES).map(([id, d]) => ({ id, nombre: d.nombre, peso: d.peso })),
    preguntas: RUBRICA_SUBGERENTE_V3.map((r) => ({
      ...r,
      tipo: 'abierta' as const,
      enunciado: BANCO_SUBGERENTE_V3[r.q - 1],
    })),
    umbralAprobado: 82,
  },
  competencias: COMPETENCIAS_SUBGERENTE_V2,
}
