/**
 * Carga una temporada vieja a partir de datos tipeados a mano (placas de IG/Facebook, notas, etc.).
 *
 *   data/historico/AAAA.csv        → un partido de Ingeniería por fila
 *   data/historico/AAAA.meta.json  → posiciones, campeones y notas (opcional)
 *
 * Uso:  npm run cargar:temporada -- 2025        (o sin año para cargar todas)
 *
 * Columnas del CSV (separado por comas, con encabezado):
 *   competencia  fase-regular | mundial-eliminatoria | mundial-oro | mundial-plata | copa-oro | copa-plata
 *   instancia    fecha | eliminatoria | grupo | octavos | cuartos | semifinal | final
 *   nro          nro de fecha (fase regular / serie) o 1 = ida, 2 = vuelta (playoffs). Puede ir vacío.
 *   grupo        "Serie A" (solo Mundialito). Puede ir vacío.
 *   fecha        AAAA-MM-DD. Puede ir vacío.
 *   rival        nombre del rival: MEDICINA, QUIMICA, ...
 *   gf, gc       goles de Ingeniería y del rival
 *   penales      opcional, ej. "4-3"
 *   fuente       opcional, de dónde salió el dato (link a la placa)
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import type { Competencia, Instancia, Partido, Temporada } from "../src/lib/tipos";

const EQUIPO = "INGENIERIA";
const DIR = "data/historico";
const COMPETENCIAS: Competencia[] = ["fase-regular", "mundial-eliminatoria", "mundial-oro", "mundial-plata", "copa-oro", "copa-plata"];
const INSTANCIAS: Instancia[] = ["fecha", "eliminatoria", "grupo", "octavos", "cuartos", "semifinal", "final"];

const sinTildes = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().trim();

export function parsearCsv(texto: string, anio: number): Partido[] {
  const lineas = texto.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#"));
  const [cab, ...filas] = lineas;
  const cols = cab.split(",").map((c) => c.trim().toLowerCase());
  return filas.map((linea, i) => {
    const v = Object.fromEntries(linea.split(",").map((x, j) => [cols[j], x.trim()]));
    const err = (m: string) => new Error(`${anio}.csv fila ${i + 2}: ${m}`);
    if (!COMPETENCIAS.includes(v.competencia as Competencia)) throw err(`competencia "${v.competencia}" no válida`);
    if (!INSTANCIAS.includes(v.instancia as Instancia)) throw err(`instancia "${v.instancia}" no válida`);
    if (!v.rival) throw err("falta el rival");
    const gf = v.gf === "" || v.gf === undefined ? null : Number(v.gf);
    const gc = v.gc === "" || v.gc === undefined ? null : Number(v.gc);
    if ((gf !== null && Number.isNaN(gf)) || (gc !== null && Number.isNaN(gc))) throw err("goles no numéricos");
    return {
      competencia: v.competencia as Competencia,
      instancia: v.instancia as Instancia,
      fecha_nro: v.nro ? Number(v.nro) : null,
      grupo: v.grupo || null,
      fecha: v.fecha || null,
      cancha: null,
      local: EQUIPO,
      visitante: sinTildes(v.rival),
      goles_local: gf,
      goles_visitante: gc,
      penales: v.penales || null,
    };
  });
}

function cargar(anio: number) {
  const csv = `${DIR}/${anio}.csv`;
  const meta = `${DIR}/${anio}.meta.json`;
  const partidos = existsSync(csv) ? parsearCsv(readFileSync(csv, "utf8"), anio) : [];
  const m: Partial<Temporada> = existsSync(meta) ? JSON.parse(readFileSync(meta, "utf8")) : {};
  const t: Temporada = {
    anio,
    torneo: "Liga Interfacultades — Bienestar Universitario",
    fuente: m.fuente ?? "Carga manual (placas y notas)",
    actualizado: new Date().toISOString().slice(0, 10),
    equipo: EQUIPO,
    partidos,
    tabla: m.tabla ?? [],
    resumen: m.resumen ?? "",
    etapas: m.etapas ?? [],
    campeones: m.campeones ?? [],
    completitud: m.completitud ?? "parcial",
    notas: m.notas,
  };
  writeFileSync(`data/public/temporada-${anio}.json`, JSON.stringify(t, null, 2) + "\n");
  console.log(`✔ ${anio}: ${partidos.length} partidos de Ingeniería, ${t.campeones.length} campeones, ${t.completitud}`);
}

if (process.argv[1]?.includes("cargar-temporada")) {
  const arg = process.argv[2];
  const anios = arg
    ? [Number(arg)]
    : [...new Set(readdirSync(DIR).map((f) => Number(f.slice(0, 4))).filter((n) => n > 2000))].sort();
  anios.forEach(cargar);
}
