import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import equipos from "../data/equipos.json";

const DIRECTORIO = path.join(process.cwd(), "public", "escudos");
const EXTENSIONES = new Set([".avif", ".jpeg", ".jpg", ".png", ".tif", ".tiff", ".webp"]);
const ALIAS_ARCHIVO: Record<string, string> = {
  administracion: "administracion", agronomia: "agronomia", arquitectura: "arquitectura",
  ciencias: "ciencias", clinicas: "dep-clinicas", contadores: "contadores", derecho: "derecho",
  economistas: "economistas", ema: "ema", fadu: "fadu", fic: "fic", isef: "isef", ipa: "ipa",
  medicina: "medicina", nutricion: "nutricion", "odon-admin": "odonto-admin",
  "odonto-admin": "odonto-admin", odontologia: "odontologia", psicologia: "psicologia",
  quimica: "quimica", sociales: "sociales", sociologia: "sociologia", ude: "ude",
};

function slugificar(valor: string) {
  return valor.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  const entradas = await readdir(DIRECTORIO, { withFileTypes: true });
  const archivos = entradas.filter((entrada) => entrada.isFile() && EXTENSIONES.has(path.extname(entrada.name).toLowerCase()));
  let procesados = 0;
  for (const entrada of archivos) {
    const base = path.basename(entrada.name, path.extname(entrada.name));
    const clave = slugificar(base);
    const slug = ALIAS_ARCHIVO[clave] ?? ALIAS_ARCHIVO[clave.replace(/-/g, "")] ?? equipos.find((equipo) => slugificar(equipo.nombre) === clave || equipo.slug === clave)?.slug ?? clave;
    if (!slug) continue;
    const origen = path.join(DIRECTORIO, entrada.name);
    const destino = path.join(DIRECTORIO, slug + ".webp");
    const buffer = await sharp(origen)
      .rotate()
      .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 88, alphaQuality: 100 })
      .toBuffer();
    await writeFile(destino, buffer);
    procesados++;
  }
  console.log(`Escudos normalizados: ${procesados}`);
  if (procesados === 0) console.log("No hay imágenes para procesar; el sitio usará iniciales.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});