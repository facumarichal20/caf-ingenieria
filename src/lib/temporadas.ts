import t2026 from "../../data/public/temporada-2026.json";
import type { Temporada } from "./tipos";

// Cuando estén cargadas en Supabase, esto pasa a leer de la base.
// Por ahora las temporadas viven en data/public/*.json (generadas por `npm run import:liga`).
export const TEMPORADAS: Record<number, Temporada> = {
  2026: t2026 as Temporada,
};

export const ANIOS = Object.keys(TEMPORADAS).map(Number).sort((a, b) => b - a);

/** Notas que la dirigencia tiene que revisar sobre los datos oficiales. */
export const NOTAS: Record<number, string> = {
  2026: "La tabla oficial suma una victoria (y 2 goles a favor) más que los resultados cargados partido a partido. Probablemente sea un fallo de mesa: falta confirmar en qué partido.",
};

/** Primera fecha estimada de 2027 (en 2026 arrancó el 21/03). Cambiar cuando salga el fixture. */
export const INICIO_2027 = "2027-03-20T09:00:00-03:00";
