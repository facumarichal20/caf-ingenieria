export type EstadoCarne = "vencido" | "por-vencer" | "ok" | "sin-dato";

export const DIAS_AVISO = 30;

export function diasHasta(venceISO: string, hoy: Date = new Date()): number {
  const v = new Date(venceISO + "T00:00:00");
  const h = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return Math.round((v.getTime() - h.getTime()) / 86_400_000);
}

export function estadoCarne(venceISO: string | null, hoy: Date = new Date(), aviso = DIAS_AVISO): EstadoCarne {
  if (!venceISO) return "sin-dato";
  const d = diasHasta(venceISO, hoy);
  if (d < 0) return "vencido";
  if (d <= aviso) return "por-vencer";
  return "ok";
}

/** ¿Puede jugar un partido en `fechaPartido`? (el carné tiene que estar vigente ese día) */
export function habilitadoPara(venceISO: string | null, fechaPartido: Date): boolean {
  return !!venceISO && diasHasta(venceISO, fechaPartido) >= 0;
}

/** Agrupa vencimientos por mes "2027-03" para la línea de tiempo. */
export function vencimientosPorMes(vences: (string | null)[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const v of vences) if (v) m.set(v.slice(0, 7), (m.get(v.slice(0, 7)) ?? 0) + 1);
  return new Map([...m.entries()].sort(([a], [b]) => a.localeCompare(b)));
}
