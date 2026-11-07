import { notFound } from "next/navigation";
import { Seccion, StatTile, TablaPosiciones } from "@/components/stats-ui";
import { caraACara, nombreEquipo, partidosDe, resumen } from "@/lib/stats";
import { ANIOS, NOTAS, TEMPORADAS } from "@/lib/temporadas";
import clsx from "clsx";

export function generateStaticParams() {
  return ANIOS.map((a) => ({ anio: String(a) }));
}

export async function generateMetadata({ params }: { params: Promise<{ anio: string }> }) {
  return { title: `Temporada ${(await params).anio}` };
}

const fmtFecha = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("es-UY", { weekday: "short", day: "2-digit", month: "2-digit" }) : "—";

export default async function TemporadaPage({ params }: { params: Promise<{ anio: string }> }) {
  const anio = Number((await params).anio);
  const t = TEMPORADAS[anio];
  if (!t) notFound();
  const ps = partidosDe(t, t.equipo);
  const r = resumen(ps);
  const h2h = caraACara(ps);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-10">
        <div className="text-xs uppercase tracking-[0.25em] text-accent">{t.torneo}</div>
        <h1 className="font-display text-6xl font-black uppercase leading-none">Temporada {anio}</h1>
        <p className="mt-2 text-dim">
          {t.resumen} · fuente: {t.fuente} (actualizado {t.actualizado})
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Récord" value={`${r.g}-${r.e}-${r.p}`} sub="G-E-P (todos los partidos)" />
          <StatTile label="Goles" value={`${r.gf}:${r.gc}`} sub={`${(r.gf / r.pj).toFixed(1)} a favor por partido`} />
          <StatTile
            label="Mayor goleada"
            value={r.mayorGoleada ? `${r.mayorGoleada.gf}-${r.mayorGoleada.gc}` : "—"}
            sub={r.mayorGoleada && nombreEquipo(r.mayorGoleada.rival)}
          />
          <StatTile
            label="Peor derrota"
            value={r.peorDerrota ? `${r.peorDerrota.gf}-${r.peorDerrota.gc}` : "—"}
            sub={r.peorDerrota && nombreEquipo(r.peorDerrota.rival)}
          />
        </div>
      </div>

      <Seccion titulo="Partidos">
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-dim">
              <tr>
                <th className="px-3 py-2 text-left">Fase</th>
                <th className="px-3 py-2 text-left">Día</th>
                <th className="px-3 py-2 text-left">Rival</th>
                <th className="px-3 py-2 text-center">Resultado</th>
                <th className="px-3 py-2 text-right">Cancha</th>
              </tr>
            </thead>
            <tbody>
              {ps.map((x, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="num px-3 py-2 text-dim">
                    {x.partido.fase === "regular" ? `Fecha ${x.partido.fecha_nro}` : `Cuartos (${x.partido.fecha_nro === 1 ? "ida" : "vuelta"})`}
                  </td>
                  <td className="num px-3 py-2 text-dim">{fmtFecha(x.partido.fecha)}</td>
                  <td className="px-3 py-2">
                    <span className="text-dim">vs</span> {nombreEquipo(x.rival)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={clsx(
                        "num inline-block min-w-14 rounded-md px-2 py-0.5 font-semibold text-tinta",
                        x.resultado === "G" ? "bg-win" : x.resultado === "E" ? "bg-draw" : "bg-loss",
                      )}
                    >
                      {x.gf}–{x.gc}
                    </span>
                  </td>
                  <td className="num px-3 py-2 text-right text-dim">{x.partido.cancha ? `C${x.partido.cancha}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {NOTAS[anio] && <p className="mt-3 text-xs text-dim">Nota: {NOTAS[anio]}</p>}
      </Seccion>

      <Seccion titulo="Cara a cara">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {h2h.map((x) => (
            <div key={x.rival} className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3">
              <span className="font-medium">{nombreEquipo(x.rival)}</span>
              <span className="num text-sm text-dim">
                {x.g}G {x.e}E {x.p}P · {x.gf}:{x.gc}
              </span>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Tabla de la fase regular">
        <TablaPosiciones filas={t.tabla} resaltar={t.equipo} />
      </Seccion>
    </>
  );
}
