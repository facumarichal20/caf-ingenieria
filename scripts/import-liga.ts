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
import { tablaDe } from "../src/lib/stats";
import type { FilaTabla, Fichaje, Partido, ResumenEtapa, Temporada } from "../src/lib/tipos";

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
      competencia: "fase-regular",
      instancia: "fecha",
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
      { competencia: "copa-oro", instancia: "cuartos", fecha_nro: 1, ...ida, local: str(a[2]), visitante: str(b[2]), goles_local: num(a[3]), goles_visitante: num(b[3]) },
      { competencia: "copa-oro", instancia: "cuartos", fecha_nro: 2, ...vuelta, local: str(b[2]), visitante: str(a[2]), goles_local: num(b[4]), goles_visitante: num(a[4]), penales: [str(a[5]), str(b[5])].filter((s) => s.startsWith("pk")).join(" / ") || null },
    );
    i += 2;
  }
  return out;
}
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
// En la planilla los equipos van abreviados.
const ABREV: Record<string, string> = {
  CON: "CONTADORES", CONT: "CONTADORES", ING: "INGENIERIA", IPA: "IPA", DER: "DERECHO", ODO: "ODONTOLOGIA",
  ISEF: "ISEF", MED: "MEDICINA", EMA: "EMA", CIE: "CIENCIAS", CIEN: "CIENCIAS", SOC: "SOCIALES",
  NUT: "NUTRICION", PSI: "PSICOLOGIA", QUI: "QUIMICA", FIC: "FIC", ECO: "ECONOMISTAS",
};
const equipoDe = (s: string) => ABREV[s.toUpperCase()] ?? s.toUpperCase();

// Excel convierte resultados como "2-1" en la fecha 2 de enero: se recupera día-mes como goles.
function marcador(v: unknown): [number, number] | null {
  if (typeof v === "string") {
    const m = /^\s*(\d+)\s*-\s*(\d+)\s*$/.exec(v);
    return m ? [Number(m[1]), Number(m[2])] : null;
  }
  if (typeof v === "number" && v > 40000 && v < 60000) {
    const d = XLSX.SSF.parse_date_code(v);
    return [d.d, d.m];
  }
  return null;
}
function fechaISO(v: unknown): string | null {
  if (typeof v === "number" && v > 40000) {
    const d = XLSX.SSF.parse_date_code(v);
    return `${d.y}-${String(d.m).padStart(2, "0")}-${String(d.d).padStart(2, "0")}`;
  }
  const m = /(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/.exec(str(v));
  return m ? `${m[3] ?? anio}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : null;
}

function mundial(): Partido[] {
  // Se relee sin convertir fechas para poder decodificar los marcadores.
  const ws = XLSX.read(readFileSync(archivo), { type: "buffer", cellDates: false }).Sheets["Mundiales"];
  if (!ws) return [];
  const rows = XLSX.utils.sheet_to_json<Fila>(ws, { header: 1, defval: null, raw: true });
  const out: Partido[] = [];

  // 1) Eliminatoria: columna B equipo, C goles ("0 pk" = ganó/perdió por penales), parejas en filas seguidas.
  const fechaElim = fechaISO(str(rows[0]?.[0]).replace(/.*?(\d{1,2}\/\d{1,2}).*/, "$1"));
  for (let i = 1; i < 40; i++) {
    const a = rows[i], b = rows[i + 1];
    if (!a || !b || !/^[A-ZÁÉÍÓÚ]{3,}$/.test(str(a[1])) || !/^[A-ZÁÉÍÓÚ]{3,}$/.test(str(b[1]))) continue;
    const ga = parseInt(String(a[2] ?? ""), 10), gb = parseInt(String(b[2] ?? ""), 10);
    if (Number.isNaN(ga) || Number.isNaN(gb)) continue;
    const pk = /pk/i.test(String(a[2])) || /pk/i.test(String(b[2]));
    out.push({
      competencia: "mundial-eliminatoria", instancia: "eliminatoria", fecha_nro: null, fecha: fechaElim, cancha: null,
      local: equipoDe(str(a[1])), visitante: equipoDe(str(b[1])), goles_local: ga, goles_visitante: gb,
      penales: pk ? "definido por penales" : null,
    });
    i++;
  }

  // 2) Series: bloques de 5 columnas (F, K, P) con "MUNDIAL ORO"/"M.PLATA" + fecha, "Serie A/B" y partidos.
  for (const c of [5, 10, 15]) {
    let comp: "mundial-oro" | "mundial-plata" | null = null;
    let fecha: string | null = null;
    let serie: string | null = null;
    let nro = c === 5 ? 1 : c === 10 ? 2 : 3;
    for (const r of rows) {
      const h = str(r[c]).toUpperCase();
      if (h === "MUNDIAL ORO" || h === "M.PLATA") {
        comp = h === "MUNDIAL ORO" ? "mundial-oro" : "mundial-plata";
        fecha = fechaISO(r[c + 1]);
        continue;
      }
      if (/^SERIE\s+[AB]$/i.test(h)) { serie = h.replace(/^SERIE/i, "Serie"); continue; }
      if (!comp || !str(r[c]) || !str(r[c + 1]) || /libre/i.test(str(r[c + 1]))) continue;
      const m = marcador(r[c + 2]);
      if (!m && r[c + 2] != null) continue;
      out.push({
        competencia: comp, instancia: "grupo", grupo: serie, fecha_nro: nro, fecha, cancha: null,
        local: equipoDe(str(r[c])), visitante: equipoDe(str(r[c + 1])),
        goles_local: m ? m[0] : null, goles_visitante: m ? m[1] : null,
      });
    }
    nro++;
  }
  return out;
}

// Campeones que la planilla menciona en texto ("Campeón Mundial Oro CONTADORES").
function campeones(): Temporada["campeones"] {
  const texto = wb.SheetNames.flatMap((n) => hoja(n).flat().map(str)).join(" ");
  const busca = (re: RegExp) => re.exec(texto)?.[1]?.toUpperCase() ?? null;
  return [
    { competencia: "mundial-oro", equipo: busca(/Campe.n Mundial Oro\s+([A-ZÁÉÍÓÚ]+)/i) },
    { competencia: "mundial-plata", equipo: busca(/Campe.n Mundial Plata\s+([A-ZÁÉÍÓÚ]+)/i) },
    { competencia: "copa-oro", equipo: null },
    { competencia: "copa-plata", equipo: null },
  ];
}

const t = tabla();
const EQUIPOS = new Set(t.map((f) => f.equipo));
// Solo partidos entre equipos reales (la hoja Mundiales tiene notas sueltas en las mismas columnas).
const partidos = [...faseRegular(), ...mundial(), ...cuartos()].filter((p) => EQUIPOS.has(p.local) && EQUIPOS.has(p.visitante));
const ingFR = t.find((f) => f.equipo === EQUIPO);
const mios = partidos.filter((p) => p.local === EQUIPO || p.visitante === EQUIPO);
const gfgc = (ps: Partido[]) =>
  ps.reduce(
    ([gf, gc], p) => [gf + ((p.local === EQUIPO ? p.goles_local : p.goles_visitante) ?? 0), gc + ((p.local === EQUIPO ? p.goles_visitante : p.goles_local) ?? 0)],
    [0, 0],
  );

const etapas: ResumenEtapa[] = [];
if (ingFR) etapas.push({ etapa: "fase-regular", titulo: `${ingFR.pos}.º de ${t.length}`, detalle: `${ingFR.pts} pts · ${ingFR.g}G ${ingFR.e}E ${ingFR.p}P` });

const grupoMio = mios.find((p) => p.competencia === "mundial-oro" || p.competencia === "mundial-plata");
if (grupoMio) {
  const delGrupo = partidos.filter((p) => p.competencia === grupoMio.competencia && p.grupo === grupoMio.grupo);
  const tg = tablaDe(delGrupo);
  const yo = tg.find((f) => f.equipo === EQUIPO)!;
  const elim = mios.find((p) => p.competencia === "mundial-eliminatoria");
  const [egf, egc] = elim ? gfgc([elim]) : [0, 0];
  etapas.push({
    etapa: "mundial",
    titulo: `${yo.pos}.º ${grupoMio.grupo} · ${grupoMio.competencia === "mundial-oro" ? "Mundial Oro" : "Mundial Plata"}`,
    detalle: `${elim ? `Eliminatoria ${egf}-${egc} · ` : ""}${yo.pts} pts en la serie`,
  });
}

const playoffs = mios.filter((p) => p.competencia === "copa-oro" || p.competencia === "copa-plata");
if (playoffs.length) {
  const [gf, gc] = gfgc(playoffs);
  const rival = playoffs[0].local === EQUIPO ? playoffs[0].visitante : playoffs[0].local;
  const copa = playoffs[0].competencia === "copa-oro" ? "Copa Oro" : "Copa Plata";
  etapas.push({
    etapa: "playoffs",
    titulo: `${gf > gc ? "Semifinal" : "Cuartos de final"} · ${copa}`,
    detalle: `${gf > gc ? "Le ganó" : "Eliminado por"} ${rival} (global ${gf}-${gc})`,
  });
}

const temporada: Temporada = {
  anio,
  torneo: "Liga Interfacultades — Bienestar Universitario",
  fuente: archivo.split(/[\\/]/).pop() ?? archivo,
  actualizado: new Date().toISOString().slice(0, 10),
  equipo: EQUIPO,
  partidos,
  tabla: t,
  resumen: etapas.find((e) => e.etapa === "playoffs")?.titulo ?? etapas.at(-1)?.titulo ?? "",
  etapas,
  campeones: campeones(),
  completitud: "completa",
};

mkdirSync("data/public", { recursive: true });
mkdirSync("data/private", { recursive: true });
writeFileSync(`data/public/temporada-${anio}.json`, JSON.stringify(temporada, null, 2) + "\n");
const fi = fichajes();
writeFileSync(`data/private/fichajes-${anio}.json`, JSON.stringify(fi, null, 2) + "\n");

const ing = t.find((f) => f.equipo === EQUIPO);
console.log(`✔ ${partidos.length} partidos, ${t.length} equipos en la tabla, ${fi.length} fichados de Ingeniería`);
if (ing) console.log(`  Ingeniería: ${ing.pos}° · ${ing.pts} pts · ${ing.g}G ${ing.e}E ${ing.p}P · ${ing.gf}-${ing.gc}`);
for (const e of etapas) console.log(`  ${e.etapa}: ${e.titulo} — ${e.detalle ?? ""}`);
console.log(`  Campeones: ${temporada.campeones.map((c) => `${c.competencia}=${c.equipo ?? "?"}`).join(", ")}`);
