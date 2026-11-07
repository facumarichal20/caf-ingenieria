// Tipos compartidos entre el importador, la web y (más adelante) Supabase.

export type Fase = "regular" | "cuartos" | "semifinal" | "final";

export interface Partido {
  fase: Fase;
  fecha_nro: number | null; // "Fecha 3" de la fase regular
  fecha: string | null; // ISO "2026-03-21T09:00"
  cancha: number | null;
  local: string;
  visitante: string;
  goles_local: number | null; // null = no se jugó / sin dato
  goles_visitante: number | null;
  penales?: string | null;
}

export interface FilaTabla {
  pos: number;
  equipo: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  dif: number;
  pts: number;
  amarillas: number;
  rojas: number;
  fair_play: number;
}

export interface Temporada {
  anio: number;
  torneo: string;
  fuente: string;
  actualizado: string;
  equipo: string; // cómo figura Ingeniería en la planilla
  partidos: Partido[];
  tabla: FilaTabla[];
  resumen: string; // ej. "Cuartos de final Copa Oro"
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
