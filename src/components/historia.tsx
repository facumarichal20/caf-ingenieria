import clsx from "clsx";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { nombreEquipo } from "@/lib/stats";
import { ANIOS, TEMPORADAS } from "@/lib/temporadas";
import { ETAPAS } from "@/lib/tipos";

/** Logros destacados, a mano: son pocos y cada uno merece su texto. */
const LOGROS = [
  { anio: 2020, titulo: "Campeón Copa Plata", detalle: "Dos series por penales y final 2-0 a UDE en el Obdulio Varela", oro: true },
  { anio: 2024, titulo: "Subcampeón del Mundialito", detalle: "3 series ganadas por penales; final 0-1 con ISEF", oro: false },
  { anio: 2024, titulo: "Semifinal Copa Oro", detalle: "Afuera con ISEF por un gol en el global", oro: false },
  { anio: 2025, titulo: "Semifinal Copa Oro", detalle: "Eliminó a ISEF y le ganó la ida 3-1 a Contadores", oro: false },
  { anio: 2021, titulo: "Semifinal Copa Oro", detalle: "2-0 a Química en cuartos", oro: false },
  { anio: 2018, titulo: "Semifinal Copa Oro", detalle: "\"El año más competitivo del CAF\"; afuera con ISEF", oro: false },
];

export function Palmares() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {LOGROS.map((l) => (
        <Link
          key={l.anio + l.titulo}
          href={`/temporada/${l.anio}`}
          className={clsx(
            "rounded-xl border p-4 transition hover:border-accent/70",
            l.oro ? "border-accent/60 bg-accent/15" : "border-line bg-surface",
          )}
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-dim">
            <Trophy className={clsx("h-4 w-4", l.oro ? "text-accent" : "text-dim")} aria-hidden />
            <span className="num">{l.anio}</span>
          </div>
          <div className="mt-2 font-display text-2xl font-extrabold uppercase leading-tight">{l.titulo}</div>
          <div className="mt-1 text-sm text-dim">{l.detalle}</div>
        </Link>
      ))}
    </div>
  );
}

/** Una fila por temporada: cómo le fue en cada etapa. */
export function LineaDeTiempo() {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wider text-dim">
          <tr>
            <th className="px-3 py-2 text-left">Año</th>
            {ETAPAS.map((e) => (
              <th key={e.id} className="px-3 py-2 text-left">
                {e.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ANIOS.map((a) => {
            const t = TEMPORADAS[a];
            return (
              <tr key={a} className="border-t border-line align-top">
                <td className="px-3 py-3">
                  <Link href={`/temporada/${a}`} className="num font-semibold text-accent hover:underline">
                    {a}
                  </Link>
                </td>
                {ETAPAS.map((e) => {
                  const r = t.etapas.find((x) => x.etapa === e.id);
                  return (
                    <td key={e.id} className="px-3 py-3">
                      {r ? (
                        <>
                          <div className="font-medium">{r.titulo}</div>
                          {r.detalle && <div className="text-xs text-dim">{r.detalle.replace(/[A-ZÁÉÍÓÚ]{3,}/g, (m) => nombreEquipo(m))}</div>}
                        </>
                      ) : (
                        <span className="text-dim">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
