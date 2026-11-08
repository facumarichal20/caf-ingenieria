import { readFile } from "node:fs/promises";
import path from "node:path";

export interface JugadorPlantel {
  nombre: string;
  apodo: string;
  posicion: string;
  dorsal: string;
  foto?: string;
}

/** CSV con comas, campos entre comillas y comillas escapadas. */
export function parsearPlantel(texto: string): JugadorPlantel[] {
  const filas: string[][] = [];
  let fila: string[] = [], campo = "", entreComillas = false;
  const csv = texto.replace(/^\uFEFF/, "");
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (c === '"') {
      if (entreComillas && csv[i + 1] === '"') { campo += '"'; i++; }
      else entreComillas = !entreComillas;
    } else if (!entreComillas && (c === "," || c === "\n" || c === "\r")) {
      fila.push(campo.trim()); campo = "";
      if (c !== ",") {
        filas.push(fila); fila = [];
        if (c === "\r" && csv[i + 1] === "\n") i++;
      }
    } else campo += c;
  }
  if (entreComillas) throw new Error("Plantel: campo entre comillas sin cerrar.");
  fila.push(campo.trim());
  filas.push(fila);
  const noVacias = filas.filter((f) => f.some(Boolean));
  if (!noVacias.length) return [];
  const [cabecera, ...datos] = noVacias;
  const columnas = cabecera.map((c) => c.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase());
  const requeridas = ["nombre", "apodo", "posicion", "dorsal"];
  if (requeridas.some((c) => !columnas.includes(c))) {
    throw new Error("Plantel: faltan columnas nombre, apodo, posición o dorsal.");
  }
  return datos.map((f) => {
    const valor = (c: string) => f[columnas.indexOf(c)] ?? "";
    return { nombre: valor("nombre"), apodo: valor("apodo"), posicion: valor("posicion"), dorsal: valor("dorsal"), ...(valor("foto") ? { foto: valor("foto") } : {}) };
  }).filter((j) => j.nombre);
}

export async function leerPlantel(): Promise<JugadorPlantel[]> {
  try {
    return parsearPlantel(await readFile(path.join(process.cwd(), "data", "plantel", "plantel.csv"), "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}
