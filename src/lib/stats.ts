import type { Competencia, FilaTabla, Partido, Temporada } from "./tipos";

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

const ORDEN_COMP: Record<Competencia, number> = {
  "fase-regular": 0, "mundial-eliminatoria": 1, "mundial-oro": 2, "mundial-plata": 2, "copa-oro": 3, "copa-plata": 3,
};
const ORDEN_INST = { fecha: 0, eliminatoria: 0, grupo: 1, octavos: 2, cuartos: 3, semifinal: 4, final: 5 } as const;
function orden(p: Partido): number {
  // algunas fechas vienen sin día: se ordena por etapa, instancia y nro de fecha
  return ORDEN_COMP[p.competencia] * 10000 + ORDEN_INST[p.instancia] * 100 + (p.fecha_nro ?? 0);
}

export function tablaDe(ps: Partido[]): FilaTabla[] {
  const m = new Map<string, FilaTabla>();
  const fila = (e: string) => m.get(e) ?? m.set(e, { pos: 0, equipo: e, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dif: 0, pts: 0 }).get(e)!;
  for (const p of ps) {
    const a = fila(p.local), b = fila(p.visitante);
    if (p.goles_local === null || p.goles_visitante === null) continue;
    for (const [x, gf, gc] of [[a, p.goles_local, p.goles_visitante], [b, p.goles_visitante, p.goles_local]] as const) {
      x.pj++; x.gf = (x.gf ?? 0) + gf; x.gc = (x.gc ?? 0) + gc; x.dif = x.gf - x.gc;
      if (gf > gc) { x.g++; x.pts += 3; } else if (gf === gc) { x.e++; x.pts += 1; } else x.p++;
    }
  }
  return [...m.values()]
    .sort((x, y) => y.pts - x.pts || y.dif - x.dif || (y.gf ?? 0) - (x.gf ?? 0) || x.equipo.localeCompare(y.equipo))
    .map((f, i) => ({ ...f, pos: i + 1 }));
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

/** "INGENIERIA" → "Ingeniería" */
const NOMBRES: Record<string, string> = {
  INGENIERIA: "Ingeniería", PSICOLOGIA: "Psicología", QUIMICA: "Química", NUTRICION: "Nutrición",
  ODONTOLOGIA: "Odontología", ECONOMISTAS: "Economistas", CONTADORES: "Contadores", MEDICINA: "Medicina",
  SOCIALES: "Sociales", DERECHO: "Derecho", CIENCIAS: "Ciencias", ISEF: "ISEF", IPA: "IPA", EMA: "EMA", FIC: "FIC",
  ADMINISTRACION: "Administración", AGRONOMIA: "Agronomía", CLINICAS: "Dep. Clínicas", UDE: "UDE", FADU: "FADU",
  "ODON / ADMIN": "Odonto. / Admin.", ARQUITECTURA: "Arquitectura", SOCIOLOGIA: "Sociología", NOTARIADO: "Notariado",
};
export const nombreEquipo = (s: string) => NOMBRES[s] ?? s.charAt(0) + s.slice(1).toLowerCase();
