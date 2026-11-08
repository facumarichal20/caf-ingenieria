import t2017 from "../../data/public/temporada-2017.json";
import t2018 from "../../data/public/temporada-2018.json";
import t2020 from "../../data/public/temporada-2020.json";
import t2021 from "../../data/public/temporada-2021.json";
import t2022 from "../../data/public/temporada-2022.json";
import t2023 from "../../data/public/temporada-2023.json";
import t2024 from "../../data/public/temporada-2024.json";
import t2025 from "../../data/public/temporada-2025.json";
import t2026 from "../../data/public/temporada-2026.json";
import type { Temporada } from "./tipos";

// Cuando estén cargadas en Supabase, esto pasa a leer de la base.
// 2026 sale de la planilla oficial (`npm run import:liga`); los años anteriores, de data/historico (`npm run cargar:temporada`).
export const TEMPORADAS: Record<number, Temporada> = {
  2017: t2017 as Temporada,
  2018: t2018 as Temporada,
  2020: t2020 as Temporada,
  2021: t2021 as Temporada,
  2022: t2022 as Temporada,
  2023: t2023 as Temporada,
  2024: t2024 as Temporada,
  2025: t2025 as Temporada,
  2026: t2026 as Temporada,
};

export const ANIOS = Object.keys(TEMPORADAS).map(Number).sort((a, b) => b - a);

/** Primera fecha estimada de 2027 (en 2026 arrancó el 21/03). Cambiar cuando salga el fixture. */
export const INICIO_2027 = "2027-03-20T09:00:00-03:00";
