// Estadísticas de todas las temporadas juntas (2017 en adelante).
import { caraACara, partidosDe, resumen, type PartidoEquipo, type Resumen } from "./stats";
import type { Etapa, Temporada } from "./tipos";

export interface PartidoHistorico extends PartidoEquipo {
  anio: number;
}

export interface AnioResumen {
  anio: number;
  pos: number | null; // posición en la fase regular
  equipos: number; // equipos en la tabla
  pts: number | null;
  partidos: Resumen; // calculado de los partidos cargados
  completitud: Temporada["completitud"];
  etapas: Partial<Record<Etapa, string>>;
}

export function partidosHistoricos(ts: Temporada[]): PartidoHistorico[] {
  return [...ts]
    .sort((a, b) => a.anio - b.anio)
    .flatMap((t) => partidosDe(t, t.equipo).map((x) => ({ ...x, anio: t.anio })));
}

export function resumenPorAnio(ts: Temporada[]): AnioResumen[] {
  return [...ts]
    .sort((a, b) => b.anio - a.anio)
    .map((t) => {
      const fila = t.tabla.find((f) => f.equipo === t.equipo);
      return {
        anio: t.anio,
        pos: fila?.pos ?? null,
        equipos: t.tabla.length,
        pts: fila?.pts ?? null,
        partidos: resumen(partidosDe(t, t.equipo)),
        completitud: t.completitud,
        etapas: Object.fromEntries(t.etapas.map((e) => [e.etapa, e.titulo])),
      };
    });
}

export interface Records {
  total: Resumen;
  mayorGoleada: PartidoHistorico | null;
  peorDerrota: PartidoHistorico | null;
  masGoles: PartidoHistorico | null; // partido con más goles de Ingeniería
  mejorPosicion: AnioResumen | null;
  mejorEfectividad: AnioResumen | null;
  penales: { jugadas: number; ganadas: number };
}

/** Quién ganó una definición por penales, desde el lado de Ingeniería. "4-3" está en el orden local-visitante. */
export function ganoPenales(x: PartidoEquipo): boolean | null {
  const m = /^(\d+)-(\d+)$/.exec(x.partido.penales ?? "");
  if (!m) return null;
  const [l, v] = [Number(m[1]), Number(m[2])];
  return x.local ? l > v : v > l;
}

export function records(ts: Temporada[]): Records {
  const ps = partidosHistoricos(ts);
  const total = resumen(ps);
  const anios = resumenPorAnio(ts);
  const conPos = anios.filter((a) => a.pos !== null);
  const conPartidos = anios.filter((a) => a.partidos.pj >= 5);
  const definidos = ps.map(ganoPenales).filter((g): g is boolean => g !== null);
  return {
    total,
    // resumen() devuelve el primero que alcanza el máximo; acá preferimos el más reciente ante empate
    mayorGoleada: masReciente(ps.filter((x) => x.gf > x.gc), (x) => x.gf - x.gc),
    peorDerrota: masReciente(ps.filter((x) => x.gf < x.gc), (x) => x.gc - x.gf),
    masGoles: masReciente(ps, (x) => x.gf),
    mejorPosicion: conPos.length ? conPos.reduce((a, b) => (b.pos! < a.pos! ? b : a)) : null,
    mejorEfectividad: conPartidos.length ? conPartidos.reduce((a, b) => (b.partidos.efectividad > a.partidos.efectividad ? b : a)) : null,
    penales: { jugadas: definidos.length, ganadas: definidos.filter(Boolean).length },
  };
}

function masReciente<T>(xs: T[], valor: (x: T) => number): T | null {
  let mejor: T | null = null;
  for (const x of xs) if (mejor === null || valor(x) >= valor(mejor)) mejor = x;
  return mejor;
}

export function caraACaraHistorico(ts: Temporada[]) {
  const ps = partidosHistoricos(ts);
  return caraACara(ps).map((c) => {
    const ultimo = ps.filter((x) => x.rival === c.rival).at(-1)!;
    return { ...c, ultimo };
  });
}
