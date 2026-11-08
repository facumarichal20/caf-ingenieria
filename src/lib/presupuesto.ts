
export interface SupuestosTemporada {
  partidos: number; // oficiales del año (fase regular + playoffs)
  costoCanchaPartido: number;
  costoJuezPartido: number;
  entrenamientos: number; // en el año
  costoCanchaEntrenamiento: number;
  inscripcion: number; // a la liga, por año
  indumentaria: number; // camisetas, pelotas, botiquín…
  otros: number;
  jugadoresQuePagan: number;
  mesesDeCuota: number; // ej. 10 (mar–dic)
  ingresosExtra: number; // rifas, fiestas, sponsors estimados
  colchonPct: number; // margen de seguridad, ej. 10
}

export interface ResultadoPresupuesto {
  costoPartidos: number;
  costoEntrenamientos: number;
  costoFijo: number;
  total: number; // incluye colchón
  aCubrirConCuotas: number;
  cuotaMensual: number; // por jugador, redondeada hacia arriba a múltiplos de 10
  costoPorPartido: number;
  porMes: number;
}

export function calcularPresupuesto(s: SupuestosTemporada): ResultadoPresupuesto {
  const costoPartidos = s.partidos * (s.costoCanchaPartido + s.costoJuezPartido);
  const costoEntrenamientos = s.entrenamientos * s.costoCanchaEntrenamiento;
  const costoFijo = s.inscripcion + s.indumentaria + s.otros;
  const base = costoPartidos + costoEntrenamientos + costoFijo;
  const total = Math.round(base * (1 + s.colchonPct / 100));
  const aCubrirConCuotas = Math.max(0, total - s.ingresosExtra);
  const cuotas = s.jugadoresQuePagan * s.mesesDeCuota;
  const cuotaMensual = cuotas > 0 ? Math.ceil(aCubrirConCuotas / cuotas / 10) * 10 : 0;
  return {
    costoPartidos,
    costoEntrenamientos,
    costoFijo,
    total,
    aCubrirConCuotas,
    cuotaMensual,
    costoPorPartido: s.partidos ? Math.round(total / s.partidos) : 0,
    porMes: s.mesesDeCuota ? Math.round(total / s.mesesDeCuota) : 0,
  };
}

/** Valores de arranque. Son ejemplos: la dirigencia los cambia por los reales. */
export const SUPUESTOS_2027: SupuestosTemporada = {
  partidos: 16, // 14 de fase regular + 2 de cuartos (lo que se jugó en 2026)
  costoCanchaPartido: 0,
  costoJuezPartido: 0,
  entrenamientos: 36,
  costoCanchaEntrenamiento: 0,
  inscripcion: 0,
  indumentaria: 0,
  otros: 0,
  jugadoresQuePagan: 25,
  mesesDeCuota: 10,
  ingresosExtra: 0,
  colchonPct: 10,
};

export const pesos = (n: number) =>
  new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 }).format(n);
