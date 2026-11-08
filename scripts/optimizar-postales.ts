import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { Postal } from "../src/lib/postales";

const ROOT = process.cwd();
const POSTALES_DIR = path.join(ROOT, "public", "postales");
const OUTPUT_FILE = path.join(ROOT, "data", "postales.json");
const EXTENSIONES = new Set([".jpg", ".jpeg", ".png", ".tif", ".tiff", ".avif"]);

const ALIASES: Record<string, string> = {
  admin: "Administración",
  administracion: "Administración",
  agronomia: "Agronomía",
  ciencias: "Ciencias",
  clinicas: "Clínicas",
  contadores: "Contadores",
  derecho: "Derecho",
  economistas: "Economistas",
  ema: "EMA",
  fagro: "Fagro",
  fic: "FIC",
  fmed: "Medicina",
  isef: "ISEF",
  ipa: "IPA",
  medicina: "Medicina",
  nutricion: "Nutrición",
  "odon admin": "Odonto. / Admin.",
  odon: "Odontología",
  odontologia: "Odontología",
  psicologia: "Psicología",
  psique: "Psicología",
  quimica: "Química",
  sociales: "Sociales",
  ude: "UDE",
};
const PALABRAS_NO_RIVAL = new Set([
  "caf", "fecha", "final", "octavos", "cuartos", "semifinal", "ida", "vuelta",
  "mundialito", "copa", "de", "oro", "plata", "apertura", "clausura", "fase", "regular",
  "liga", "interfacultades", "amistoso", "penales", "penal",
]);

function normalizarRival(valor: string): string | null {
  const limpio = valor.replace(/\s*[([{].*$/, "").replace(/[_.]+/g, " ").replace(/\s+/g, " ").trim();
  if (!limpio) return null;
  const clave = limpio.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  if (ALIASES[clave]) return ALIASES[clave];
  return limpio.replace(/\b\p{L}/gu, (letra) => letra.toLocaleUpperCase("es-UY"));
}

function leerEvento(nombre: string, anio: number) {
  const matchFecha = /(\d{4})[.-](\d{2})[.-](\d{2})/.exec(nombre);
  const fecha = matchFecha ? matchFecha.slice(1).join("-") : null;
  const resto = matchFecha ? nombre.slice(matchFecha.index + matchFecha[0].length).replace(/^[\s._-]+/, "") : nombre;
  const marcador = /\bCAF\s+(\d+)\s*[-–—]\s*(\d+)\s+(.+)$/i.exec(resto);
  const golesCAF = marcador ? Number(marcador[1]) : null;
  const golesRival = marcador ? Number(marcador[2]) : null;
  const textoRival = marcador
    ? marcador[3]
    : resto.split(/[^\p{L}\p{N}]+/u).filter((parte) => parte && !/^\d+$/.test(parte) && !PALABRAS_NO_RIVAL.has(parte.toLowerCase())).join(" ");
  const rival = normalizarRival(textoRival);
  const min = resto.toLowerCase();
  const competencia = /mundialito/.test(min)
    ? "Mundialito"
    : /copa(?:[-_ ]*de)?[-_ ]*oro/.test(min)
      ? "Copa Oro"
      : /copa(?:[-_ ]*de)?[-_ ]*plata/.test(min)
        ? "Copa Plata"
        : /fase[-_ ]*regular/.test(min)
          ? "Fase regular"
          : /\bfecha\s*\d+/i.test(resto)
            ? "Liga Interfacultades"
            : null;
  return { anio, fecha, rival, golesCAF, golesRival, competencia };
}

function urlPublica(archivo: string) {
  return "/" + path.relative(path.join(ROOT, "public"), archivo).split(path.sep).join("/");
}

async function optimizarEvento(anio: number, carpeta: string): Promise<Postal | null> {
  const archivos = (await readdir(carpeta, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && EXTENSIONES.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  if (archivos.length === 0) return null;

  const datos = leerEvento(path.basename(carpeta), anio);
  const fotos = [];
  for (const nombre of archivos) {
    const origen = path.join(carpeta, nombre);
    const nombreBase = path.basename(nombre, path.extname(nombre));
    const optimizada = path.join(carpeta, nombreBase + ".webp");
    const miniatura = path.join(carpeta, nombreBase + "-480.webp");
    await sharp(origen).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 84 }).toFile(optimizada);
    await sharp(origen).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(miniatura);
    const metadata = await sharp(optimizada).metadata();
    const descripcion = ["Postal del CAF", datos.rival ? "vs " + datos.rival : null, datos.fecha ?? String(anio)].filter(Boolean).join(" · ");
    fotos.push({
      archivo: urlPublica(optimizada),
      miniatura: urlPublica(miniatura),
      ancho: metadata.width ?? 1600,
      alto: metadata.height ?? 1000,
      alt: descripcion,
    });
  }
  return { id: anio + "/" + path.basename(carpeta), ...datos, fotos };
}

async function main() {
  await mkdir(POSTALES_DIR, { recursive: true });
  const anios = (await readdir(POSTALES_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^\d{4}$/.test(entry.name))
    .map((entry) => Number(entry.name))
    .sort((a, b) => b - a);
  const postales: Postal[] = [];
  const vistos = new Set<string>();
  for (const anio of anios) {
    const directorioAnio = path.join(POSTALES_DIR, String(anio));
    const carpetas = (await readdir(directorioAnio, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(directorioAnio, entry.name))
      .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
    for (const carpeta of carpetas) {
      const datos = leerEvento(path.basename(carpeta), anio);
      const clave = [anio, datos.fecha, datos.rival, datos.golesCAF, datos.golesRival, datos.competencia].join("|");
      if (vistos.has(clave)) continue;
      const postal = await optimizarEvento(anio, carpeta);
      if (!postal) continue;
      vistos.add(clave);
      postales.push(postal);
    }
  }
  postales.sort((a, b) => (b.fecha ?? "").localeCompare(a.fecha ?? "") || b.id.localeCompare(a.id));
  await writeFile(OUTPUT_FILE, JSON.stringify(postales, null, 2) + "\n", "utf8");
  console.log("Postales procesadas: " + postales.reduce((total, postal) => total + postal.fotos.length, 0));
  console.log("Partidos indexados: " + postales.length);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});