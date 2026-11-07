// Datos privados de dirigencia.
// - Producción: se leerán de Supabase con RLS (solo rol dirigente/admin).
// - Mientras tanto, en tu PC (`npm run dev`) se leen de data/private/, que NO se sube a GitHub.
// - En cualquier otro caso se muestran datos de ejemplo inventados.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Fichaje } from "./tipos";

export type Origen = "local-privado" | "ejemplo";

export function cargarFichajes(anio = 2026): { fichajes: Fichaje[]; origen: Origen } {
  const archivo = path.join(process.cwd(), "data", "private", `fichajes-${anio}.json`);
  if (process.env.NODE_ENV === "development" && existsSync(archivo)) {
    return { fichajes: JSON.parse(readFileSync(archivo, "utf8")) as Fichaje[], origen: "local-privado" };
  }
  return { fichajes: EJEMPLO, origen: "ejemplo" };
}

const NOMBRES = ["Juan", "Martín", "Nicolás", "Diego", "Santiago", "Bruno", "Federico", "Agustín", "Mateo", "Lucas", "Joaquín", "Facundo"];
const APELLIDOS = ["Pérez", "Rodríguez", "González", "Fernández", "López", "Silva", "Sosa", "Martínez", "Suárez", "Díaz", "Núñez", "Romero"];
const EJEMPLO: Fichaje[] = NOMBRES.map((n, i) => {
  const d = new Date(2026, 9 + i, 1 + ((i * 7) % 27));
  return {
    nombre: n,
    apellido: `${APELLIDOS[i]} (ejemplo)`,
    cedula_hash: `ejemplo-${i}`,
    cedula_ult3: String(100 + i * 37).slice(-3),
    vence_carne: d.toISOString().slice(0, 10),
    extranjero: i % 5 === 0,
  };
});
