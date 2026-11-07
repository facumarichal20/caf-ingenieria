import clsx from "clsx";
import { StatTile } from "@/components/stats-ui";
import { diasHasta, estadoCarne, vencimientosPorMes, type EstadoCarne } from "@/lib/carne";
import { cargarFichajes } from "@/lib/privado";
import { INICIO_2027 } from "@/lib/temporadas";
import { FiltroCarnes } from "./filtro";

export const metadata = { title: "Carnés de salud", robots: { index: false } };
export const dynamic = "force-dynamic";

const ETIQUETA: Record<EstadoCarne, string> = { vencido: "Vencido", "por-vencer": "Vence pronto", ok: "Vigente", "sin-dato": "Sin dato" };
const COLOR: Record<EstadoCarne, string> = {
  vencido: "bg-loss text-tinta",
  "por-vencer": "bg-warn text-tinta",
  ok: "bg-win text-tinta",
  "sin-dato": "bg-draw text-tinta",
};

const mesLargo = (ym: string) => new Date(ym + "-15").toLocaleDateString("es-UY", { month: "short", year: "2-digit" });

export default function Carnes() {
  const hoy = new Date();
  const inicio = new Date(INICIO_2027);
  const { fichajes, origen } = cargarFichajes();
  const filas = fichajes
    .map((f) => ({
      ...f,
      estado: estadoCarne(f.vence_carne, hoy),
      dias: f.vence_carne ? diasHasta(f.vence_carne, hoy) : null,
      llegaAl2027: !!f.vence_carne && diasHasta(f.vence_carne, inicio) >= 0,
    }))
    .sort((a, b) => (a.dias ?? -1e9) - (b.dias ?? -1e9));
  const cuenta = (e: EstadoCarne) => filas.filter((f) => f.estado === e).length;
  const meses = [...vencimientosPorMes(filas.map((f) => f.vence_carne))].filter(([m]) => m >= "2026-01" && m <= "2027-12");
  const max = Math.max(1, ...meses.map(([, n]) => n));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <div className="text-xs uppercase tracking-[0.25em] text-accent">Dirigencia</div>
      <h1 className="font-display text-5xl font-black uppercase leading-none sm:text-6xl">Fichajes y carné de salud</h1>
      <div
        className={clsx(
          "mt-4 rounded-lg border px-4 py-3 text-sm",
          origen === "ejemplo" ? "border-warn/50 bg-warn/10" : "border-accent/40 bg-accent/10",
        )}
      >
        {origen === "ejemplo"
          ? "Datos de ejemplo. Los fichados reales se ven en tu PC (npm run dev) o cuando se conecte Supabase con login de dirigencia."
          : "Datos reales de la planilla de la Liga, leídos desde tu PC. No se publican ni se suben a GitHub."}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Fichados" value={filas.length} />
        <StatTile label="Vencidos" value={cuenta("vencido")} sub="hay que renovar" destacado={cuenta("vencido") > 0} />
        <StatTile label="Vencen en 30 días" value={cuenta("por-vencer")} />
        <StatTile label="Llegan al arranque 2027" value={filas.filter((f) => f.llegaAl2027).length} sub="vigentes el 20/03/2027" />
      </div>

      <h2 className="mt-10 mb-3 text-sm uppercase tracking-wider text-dim">Vencimientos por mes</h2>
      <div className="flex h-36 items-end gap-1.5 overflow-x-auto rounded-xl border border-line bg-surface p-4">
        {meses.map(([m, n]) => (
          <div key={m} className="flex min-w-9 flex-1 flex-col items-center gap-1">
            <span className="num text-xs">{n}</span>
            <div
              className={clsx("w-full rounded-t", m < hoy.toISOString().slice(0, 7) ? "bg-loss/70" : "bg-accent")}
              style={{ height: `${(n / max) * 70}px` }}
              title={`${n} vencen en ${mesLargo(m)}`}
            />
            <span className="text-[10px] text-dim">{mesLargo(m)}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-10 mb-3 text-sm uppercase tracking-wider text-dim">Plantel</h2>
      <FiltroCarnes>
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-dim">
              <tr>
                <th className="px-3 py-2 text-left">Jugador</th>
                <th className="px-3 py-2 text-left">CI</th>
                <th className="px-3 py-2 text-left">Vence</th>
                <th className="px-3 py-2 text-right">Días</th>
                <th className="px-3 py-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.cedula_hash} data-estado={f.estado} className="border-t border-line">
                  <td className="px-3 py-2">
                    {f.nombre} {f.apellido}
                    {f.extranjero && <span className="ml-2 rounded bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase text-dim">Extranjero</span>}
                  </td>
                  <td className="num px-3 py-2 text-dim">…{f.cedula_ult3}</td>
                  <td className="num px-3 py-2">{f.vence_carne ? new Date(f.vence_carne + "T12:00").toLocaleDateString("es-UY") : "—"}</td>
                  <td className="num px-3 py-2 text-right">{f.dias ?? "—"}</td>
                  <td className="px-3 py-2">
                    <span className={clsx("rounded-md px-2 py-0.5 text-xs font-semibold", COLOR[f.estado])}>{ETIQUETA[f.estado]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FiltroCarnes>
    </div>
  );
}
