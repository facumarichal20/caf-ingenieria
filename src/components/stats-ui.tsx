import clsx from "clsx";
import { nombreEquipo, type PartidoEquipo } from "@/lib/stats";
import type { FilaTabla, Partido } from "@/lib/tipos";

export function StatTile({ label, value, sub, destacado }: { label: string; value: React.ReactNode; sub?: React.ReactNode; destacado?: boolean }) {
  return (
    <div className={clsx("rounded-xl border p-4", destacado ? "border-accent/50 bg-accent/10" : "border-line bg-surface")}>
      <div className="text-xs uppercase tracking-wider text-dim">{label}</div>
      <div className="num mt-1 text-3xl font-semibold leading-none">{value}</div>
      {sub && <div className="mt-1.5 text-sm text-dim">{sub}</div>}
    </div>
  );
}

const COLOR = { G: "bg-win text-tinta", E: "bg-draw text-tinta", P: "bg-loss text-tinta" } as const;
const RONDA = { octavos: "8vos", cuartos: "4tos", semifinal: "Semi", final: "Final" } as const;

/** Etiqueta corta: "F3", "Elim", "MO·A1", "CO 4tos ida" */
export function etiquetaCorta(p: Partido): string {
  if (p.instancia === "fecha") return p.fecha_nro ? `F${p.fecha_nro}` : "FR";
  if (p.instancia === "eliminatoria") return "Elim";
  if (p.instancia === "grupo") return `${p.competencia === "mundial-oro" ? "MO" : "MP"}·${(p.grupo ?? "").replace("Serie ", "")}${p.fecha_nro ?? ""}`;
  const copa = { "copa-oro": "CO", "copa-plata": "CP", "mundial-oro": "MO", "mundial-plata": "MP", "mundial-eliminatoria": "M", "fase-regular": "" }[p.competencia];
  return `${copa} ${RONDA[p.instancia]}${p.fecha_nro ? (p.fecha_nro === 1 ? " ida" : " vta") : ""}`;
}

/** Tira de partidos tipo "forma reciente", uno por partido. */
export function FormaStrip({ partidos }: { partidos: PartidoEquipo[] }) {
  return (
    <ol className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {partidos.map((x, i) => (
        <li key={i} className="overflow-hidden rounded-lg border border-line bg-surface">
          <div className={clsx("num flex items-center justify-between px-2 py-1 text-xs font-semibold", COLOR[x.resultado])}>
            <span>{x.resultado}</span>
            <span>{etiquetaCorta(x.partido)}</span>
          </div>
          <div className="px-2 py-1.5">
            <div className="num text-xl font-semibold leading-none">
              {x.gf}–{x.gc}
            </div>
            <div className="mt-1 truncate text-xs text-dim" title={nombreEquipo(x.rival)}>
              vs {nombreEquipo(x.rival)}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function TablaPosiciones({ filas, resaltar, compacta }: { filas: FilaTabla[]; resaltar: string; compacta?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[480px] text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wider text-dim">
          <tr>
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Equipo</th>
            <th className="px-2 py-2 text-right">PJ</th>
            <th className="px-2 py-2 text-right">G</th>
            <th className="px-2 py-2 text-right">E</th>
            <th className="px-2 py-2 text-right">P</th>
            <th className="px-2 py-2 text-right">GF:GC</th>
            {!compacta && <th className="px-2 py-2 text-right">Dif</th>}
            <th className="px-3 py-2 text-right">Pts</th>
          </tr>
        </thead>
        <tbody className="num">
          {filas.map((f) => (
            <tr key={f.equipo} className={clsx("border-t border-line", f.equipo === resaltar && "bg-accent/15 font-semibold")}>
              <td className="px-3 py-2">{f.pos}</td>
              <td className="px-3 py-2 font-sans">
                {f.equipo === resaltar && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-accent align-middle" />}
                {nombreEquipo(f.equipo)}
              </td>
              <td className="px-2 py-2 text-right">{f.pj}</td>
              <td className="px-2 py-2 text-right">{f.g}</td>
              <td className="px-2 py-2 text-right">{f.e}</td>
              <td className="px-2 py-2 text-right">{f.p}</td>
              <td className="px-2 py-2 text-right">
                {f.gf === null ? "—" : `${f.gf}:${f.gc}`}
              </td>
              {!compacta && <td className="px-2 py-2 text-right">{f.dif > 0 ? `+${f.dif}` : f.dif}</td>}
              <td className="px-3 py-2 text-right">{f.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Seccion({ titulo, kicker, children, accion }: { titulo: string; kicker?: string; children: React.ReactNode; accion?: React.ReactNode }) {
  return (
    <section className="mx-auto mt-14 max-w-6xl px-4">
      <div className="mb-4 flex items-end gap-4">
        <div>
          {kicker && <div className="text-xs uppercase tracking-[0.2em] text-accent">{kicker}</div>}
          <h2 className="font-display text-3xl font-extrabold uppercase leading-none sm:text-4xl">{titulo}</h2>
        </div>
        {accion && <div className="ml-auto">{accion}</div>}
      </div>
      {children}
    </section>
  );
}
