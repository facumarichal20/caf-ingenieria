/**
 * Importa la planilla oficial de la Liga Interfacultades (.xlsm) y genera:
 *   data/public/temporada-<año>.json   → resultados y tabla (va al repo, es público)
 *   data/private/fichajes-<año>.json   → fichados de Ingeniería con vencimiento de carné (NO va al repo)
 *
 * Uso:  npm run import:liga -- "data/private/2026 - Interfacultades.xlsm" 2026
 *
 * Solo lee valores: las macros del .xlsm nunca se ejecutan.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import * as XLSX from "xlsx";
import type { FilaTabla, Fichaje, Partido, Temporada } from "../src/lib/tipos";

const [archivo = "data/private/2026 - Interfacultades.xlsm", anioArg = "2026"] = process.argv.slice(2);
const anio = Number(anioArg);
const EQUIPO = "INGENIERIA";

const wb = XLSX.read(readFileSync(archivo), { type: "buffer", cellDates: true });
type Fila = unknown[];
const hoja = (nombre: string): Fila[] => {
  const ws = wb.Sheets[nombre];
  if (!ws) throw new Error(`No encuentro la hoja "${nombre}" en ${archivo}`);
  return XLSX.utils.sheet_to_json<Fila>(ws, { header: 1, defval: null, raw: true });
};
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

// ---------- Fase regular ----------
function faseRegular(): Partido[] {
  const out: Partido[] = [];
  let fechaNro = 1;
  for (const r of hoja("Fase Regular")) {
    const m = /^Fecha\s+(\d+)/i.exec(str(r[0]));
    if (m) {
      fechaNro = Number(m[1]);
      continue;
    }
    if (str(r[2]).toLowerCase() !== "v" || !str(r[0]) || !str(r[4])) continue;
    const f = /(\d{2})\/(\d{2})\/(\d{2})\s*-\s*(\d{1,2}):(\d{2})/.exec(str(r[6]));
    out.push({
      fase: "regular",
      fecha_nro: fechaNro,
      fecha: f ? `20${f[3]}-${f[2]}-${f[1]}T${f[4].padStart(2, "0")}:${f[5]}` : null,
      cancha: num(r[5]),
      local: str(r[0]),
      visitante: str(r[4]),
      goles_local: num(r[1]),
      goles_visitante: num(r[3]),
    });
  }
  return out;
}

// ---------- Cuartos de final Copa Oro (ida y vuelta) ----------
// Bloques de 3 filas: equipo A (col C, ida D, vuelta E), equipo B, fila de fechas "3/10/2026 c4 1110".
function cuartos(): Partido[] {
  const rows = hoja("Playoffs");
  const out: Partido[] = [];
  const fechaDe = (v: unknown): { fecha: string | null; cancha: number | null } => {
    const m = /(\d{1,2})\/(\d{1,2})\/(\d{4})\s+c(\d)\s+(\d{3,4})/i.exec(str(v));
    if (!m) return { fecha: null, cancha: null };
    const hhmm = m[5].padStart(4, "0");
    return {
      fecha: `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}T${hhmm.slice(0, 2)}:${hhmm.slice(2)}`,
      cancha: Number(m[4]),
    };
  };
  for (let i = 0; i < Math.min(rows.length - 2, 16); i++) {
    const a = rows[i], b = rows[i + 1], d = rows[i + 2];
    if (!str(a[2]) || !str(b[2]) || num(a[3]) === null || num(b[3]) === null) continue;
    const ida = fechaDe(d[3]);
    const vuelta = fechaDe(d[4]);
    out.push(
      { fase: "cuartos", fecha_nro: 1, ...ida, local: str(a[2]), visitante: str(b[2]), goles_local: num(a[3]), goles_visitante: num(b[3]) },
      { fase: "cuartos", fecha_nro: 2, ...vuelta, local: str(b[2]), visitante: str(a[2]), goles_local: num(b[4]), goles_visitante: num(a[4]), penales: [str(a[5]), str(b[5])].filter((s) => s.startsWith("pk")).join(" / ") || null },
    );
    i += 2;
  }
  return out;
}

// ---------- Tabla ----------
function tabla(): FilaTabla[] {
  return hoja("Tabla")
    .filter((r) => num(r[0]) !== null && str(r[1]) && num(r[2]) !== null)
    .slice(0, 30)
    .map((r) => ({
      pos: num(r[0])!, equipo: str(r[1]), pj: num(r[2])!, g: num(r[3])!, e: num(r[4])!, p: num(r[5])!,
      gf: num(r[6])!, gc: num(r[7])!, dif: num(r[8])!, pts: num(r[9])!,
      amarillas: num(r[10]) ?? 0, rojas: num(r[12]) ?? 0, fair_play: num(r[13]) ?? 0,
    }))
    // la hoja "Tabla" tiene muchas tablas debajo; la primera es la general
    .filter((f, i, arr) => arr.findIndex((x) => x.equipo === f.equipo) === i);
}

// ---------- Fichados de Ingeniería ----------
function fichajes(): Fichaje[] {
  const rows = hoja("Jugadores");
  const ini = rows.findIndex((r) => str(r[0]).toUpperCase() === EQUIPO);
  if (ini < 0) return [];
  const out: Fichaje[] = [];
  for (let i = ini + 1; i < rows.length; i++) {
    const r = rows[i];
    if (str(r[0]) && /^[A-ZÁÉÍÓÚÑ ]+$/.test(str(r[0]))) break; // empieza otra facultad
    if (!(r[4] instanceof Date) || !str(r[1])) continue;
    const ci = String(num(r[3]) ?? str(r[3])).replace(/\D/g, "");
    out.push({
      nombre: str(r[1]),
      apellido: str(r[2]),
      cedula_hash: createHash("sha256").update(ci).digest("hex"),
      cedula_ult3: ci.slice(-3),
      vence_carne: (r[4] as Date).toISOString().slice(0, 10),
      extranjero: /extranjero/i.test(str(r[8])),
    });
  }
  return out;
}

const partidos = [...faseRegular(), ...cuartos()];
const t = tabla();
const temporada: Temporada = {
  anio,
  torneo: "Liga Interfacultades — Bienestar Universitario",
  fuente: archivo.split(/[\\/]/).pop() ?? archivo,
  actualizado: new Date().toISOString().slice(0, 10),
  equipo: EQUIPO,
  partidos,
  tabla: t,
  resumen: "",
};
const cuartosIng = partidos.filter((p) => p.fase === "cuartos" && (p.local === EQUIPO || p.visitante === EQUIPO));
if (cuartosIng.length) {
  const gf = cuartosIng.reduce((s, p) => s + ((p.local === EQUIPO ? p.goles_local : p.goles_visitante) ?? 0), 0);
  const gc = cuartosIng.reduce((s, p) => s + ((p.local === EQUIPO ? p.goles_visitante : p.goles_local) ?? 0), 0);
  temporada.resumen = gf > gc ? "Semifinal Copa Oro" : "Cuartos de final Copa Oro";
}

mkdirSync("data/public", { recursive: true });
mkdirSync("data/private", { recursive: true });
writeFileSync(`data/public/temporada-${anio}.json`, JSON.stringify(temporada, null, 2) + "\n");
const fi = fichajes();
writeFileSync(`data/private/fichajes-${anio}.json`, JSON.stringify(fi, null, 2) + "\n");

const ing = t.find((f) => f.equipo === EQUIPO);
console.log(`✔ ${partidos.length} partidos, ${t.length} equipos en la tabla, ${fi.length} fichados de Ingeniería`);
if (ing) console.log(`  Ingeniería: ${ing.pos}° · ${ing.pts} pts · ${ing.g}G ${ing.e}E ${ing.p}P · ${ing.gf}-${ing.gc}`);
console.log(`  Resumen: ${temporada.resumen || "(sin playoffs)"}`);
