// Tipos compartidos entre el importador, la web y (más adelante) Supabase.

/**
 * Cada temporada tiene tres etapas:
 *  - Fase regular (todos contra todos)
 *  - Mundialito (eliminatoria → Mundial Oro / Mundial Plata, con series)
 *  - Playoffs (Copa Oro / Copa Plata)
 */
export type Competencia =
  | "fase-regular"
  | "mundial-eliminatoria"
  | "mundial-oro"
  | "mundial-plata"
  | "copa-oro"
  | "copa-plata";

export type Instancia = "fecha" | "eliminatoria" | "grupo" | "octavos" | "cuartos" | "semifinal" | "final";

export type Etapa = "fase-regular" | "mundial" | "playoffs";

export const ETAPA_DE: Record<Competencia, Etapa> = {
  "fase-regular": "fase-regular",
  "mundial-eliminatoria": "mundial",
  "mundial-oro": "mundial",
  "mundial-plata": "mundial",
  "copa-oro": "playoffs",
  "copa-plata": "playoffs",
};

export const ETAPAS: { id: Etapa; titulo: string }[] = [
  { id: "fase-regular", titulo: "Fase regular" },
  { id: "mundial", titulo: "Mundialito" },
  { id: "playoffs", titulo: "Playoffs" },
];

export const NOMBRE_COMPETENCIA: Record<Competencia, string> = {
  "fase-regular": "Fase regular",
  "mundial-eliminatoria": "Eliminatoria del Mundialito",
  "mundial-oro": "Mundial Oro",
  "mundial-plata": "Mundial Plata",
  "copa-oro": "Copa Oro",
  "copa-plata": "Copa Plata",
};

export interface Partido {
  competencia: Competencia;
  instancia: Instancia;
  fecha_nro: number | null; // "Fecha 3" de la fase regular, o 1 = ida / 2 = vuelta en playoffs
  grupo?: string | null; // "Serie A"
  fecha: string | null; // ISO "2026-03-21T09:00" (o solo "2026-08-22")
  cancha: number | null;
  local: string;
  visitante: string;
  goles_local: number | null; // null = no se jugó / sin dato
  goles_visitante: number | null;
  penales?: string | null; // ej. "4-3" o texto de la planilla
}

export interface FilaTabla {
  pos: number;
  equipo: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number | null; // algunas tablas publicadas solo traen la diferencia
  gc: number | null;
  dif: number;
  pts: number;
  amarillas?: number;
  rojas?: number;
  fair_play?: number;
}

export interface ResumenEtapa {
  etapa: Etapa;
  titulo: string; // ej. "7.º de 15", "3.º Serie A · Mundial Oro", "Cuartos de final · Copa Oro"
  detalle?: string;
}

export interface Temporada {
  anio: number;
  torneo: string;
  fuente: string;
  actualizado: string;
  equipo: string; // cómo figura Ingeniería en la planilla
  partidos: Partido[];
  tabla: FilaTabla[]; // tabla de la fase regular
  resumen: string; // una línea: cómo terminó el año
  etapas: ResumenEtapa[];
  campeones: { competencia: Competencia; equipo: string | null }[]; // null = todavía no se jugó
  /** Qué tan completa está la carga de este año. */
  completitud: "completa" | "parcial";
  notas?: string[];
}

// ---- Privado (solo dirigencia) ----
export interface Fichaje {
  nombre: string;
  apellido: string;
  cedula_hash: string; // sha256 de la cédula, para cruzar importaciones sin guardarla
  cedula_ult3: string;
  vence_carne: string | null; // ISO date
  extranjero: boolean;
}
