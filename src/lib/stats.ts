import type { Partido, Temporada } from "./tipos";

export type Resultado = "G" | "E" | "P";

export interface PartidoEquipo {
  partido: Partido;
  rival: string;
  local: boolean;
  gf: number;
  gc: number;
  resultado: Resultado;
}

/** Partidos jugados por `equipo`, vistos desde su lado, en orden cronológico. */
export function partidosDe(t: Pick<Temporada, "partidos">, equipo: string): PartidoEquipo[] {
  return t.partidos
    .filter((p) => (p.local === equipo || p.visitante === equipo) && p.goles_local !== null && p.goles_visitante !== null)
    .map((p) => {
      const local = p.local === equipo;
      const gf = (local ? p.goles_local : p.goles_visitante)!;
      const gc = (local ? p.goles_visitante : p.goles_local)!;
      const resultado: Resultado = gf > gc ? "G" : gf < gc ? "P" : "E";
      return { partido: p, rival: local ? p.visitante : p.local, local, gf, gc, resultado };
    })
    .sort((a, b) => orden(a.partido) - orden(b.partido));
}

const FASES = { regular: 0, cuartos: 1, semifinal: 2, final: 3 } as const;
function orden(p: Partido): number {
  // la última fecha de la fase regular puede venir sin día: se ordena por fase y nro de fecha
  return FASES[p.fase] * 1000 + (p.fecha_nro ?? 0);
}

export interface Resumen {
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  pts: number;
  efectividad: number; // % de puntos obtenidos
  vallasInvictas: number;
  mayorGoleada: PartidoEquipo | null;
  peorDerrota: PartidoEquipo | null;
  mejorRacha: number; // partidos seguidos sin perder
}

export function resumen(ps: PartidoEquipo[]): Resumen {
  const r: Resumen = { pj: ps.length, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0, efectividad: 0, vallasInvictas: 0, mayorGoleada: null, peorDerrota: null, mejorRacha: 0 };
  let racha = 0;
  for (const x of ps) {
    r.gf += x.gf;
    r.gc += x.gc;
    if (x.gc === 0) r.vallasInvictas++;
    if (x.resultado === "G") r.g++;
    else if (x.resultado === "E") r.e++;
    else r.p++;
    racha = x.resultado === "P" ? 0 : racha + 1;
    r.mejorRacha = Math.max(r.mejorRacha, racha);
    const dif = x.gf - x.gc;
    if (dif > 0 && (!r.mayorGoleada || dif > r.mayorGoleada.gf - r.mayorGoleada.gc)) r.mayorGoleada = x;
    if (dif < 0 && (!r.peorDerrota || dif < r.peorDerrota.gf - r.peorDerrota.gc)) r.peorDerrota = x;
  }
  r.pts = r.g * 3 + r.e;
  r.efectividad = r.pj ? Math.round((r.pts / (r.pj * 3)) * 100) : 0;
  return r;
}

/** Historial contra cada rival (para "cara a cara"). */
export function caraACara(ps: PartidoEquipo[]): { rival: string; pj: number; g: number; e: number; p: number; gf: number; gc: number }[] {
  const m = new Map<string, { rival: string; pj: number; g: number; e: number; p: number; gf: number; gc: number }>();
  for (const x of ps) {
    const c = m.get(x.rival) ?? { rival: x.rival, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 };
    c.pj++;
    c.gf += x.gf;
    c.gc += x.gc;
    if (x.resultado === "G") c.g++;
    else if (x.resultado === "E") c.e++;
    else c.p++;
    m.set(x.rival, c);
  }
  return [...m.values()].sort((a, b) => b.g - b.p - (a.g - a.p) || b.gf - b.gc - (a.gf - a.gc));
}

/** "INGENIERIA" → "Ingeniería" */
const NOMBRES: Record<string, string> = {
  INGENIERIA: "Ingeniería", PSICOLOGIA: "Psicología", QUIMICA: "Química", NUTRICION: "Nutrición",
  ODONTOLOGIA: "Odontología", ECONOMISTAS: "Economistas", CONTADORES: "Contadores", MEDICINA: "Medicina",
  SOCIALES: "Sociales", DERECHO: "Derecho", CIENCIAS: "Ciencias", ISEF: "ISEF", IPA: "IPA", EMA: "EMA", FIC: "FIC",
};
export const nombreEquipo = (s: string) => NOMBRES[s] ?? s.charAt(0) + s.slice(1).toLowerCase();
