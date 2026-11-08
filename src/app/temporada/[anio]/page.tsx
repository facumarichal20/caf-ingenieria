import { metadataPagina } from "@/lib/metadata";
import clsx from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Marcador, Seccion, StatTile, TablaPosiciones } from "@/components/stats-ui";
import { nombreEquipo, partidosDe, resumen, tablaDe, type PartidoEquipo } from "@/lib/stats";
import { ANIOS, TEMPORADAS } from "@/lib/temporadas";
import { ETAPA_DE, ETAPAS, NOMBRE_COMPETENCIA, type Etapa, type Partido } from "@/lib/tipos";

export function generateStaticParams() {
  return ANIOS.map((a) => ({ anio: String(a) }));
}

export async function generateMetadata({ params }: { params: Promise<{ anio: string }> }) {
  const { anio } = await params;
  return metadataPagina(`Temporada ${anio}`, `Resultados, tabla y etapas del CAF en la temporada ${anio}.`, `/temporada/${anio}`);
}

const fmtFecha = (iso: string | null) =>
  iso ? new Date(iso.length === 10 ? iso + "T12:00" : iso).toLocaleDateString("es-UY", { weekday: "short", day: "2-digit", month: "2-digit" }) : "";

function etiquetaInstancia(p: Partido) {
  if (p.instancia === "fecha") return p.fecha_nro ? `Fecha ${p.fecha_nro}` : "Fase regular";
  if (p.instancia === "eliminatoria") return "Eliminatoria";
  if (p.instancia === "grupo") return `${NOMBRE_COMPETENCIA[p.competencia]} · ${p.grupo ?? ""} F${p.fecha_nro ?? "?"}`;
  const ronda = { octavos: "Octavos", cuartos: "Cuartos", semifinal: "Semifinal", final: "Final" }[p.instancia];
  return `${NOMBRE_COMPETENCIA[p.competencia]} · ${ronda}${p.fecha_nro ? (p.fecha_nro === 1 ? " (ida)" : " (vuelta)") : ""}`;
}

function TablaPartidos({ ps }: { ps: PartidoEquipo[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[540px] text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wider text-dim">
          <tr>
            <th className="px-3 py-2 text-left">Instancia</th>
            <th className="px-3 py-2 text-left">Día</th>
            <th className="px-3 py-2 text-left">Rival</th>
            <th className="px-3 py-2 text-center">Resultado</th>
          </tr>
        </thead>
        <tbody>
          {ps.map((x, i) => (
            <tr key={i} className="border-t border-line">
              <td className="num px-3 py-2 text-dim">{etiquetaInstancia(x.partido)}</td>
              <td className="num px-3 py-2 text-dim">{fmtFecha(x.partido.fecha)}</td>
              <td className="px-3 py-2">
                <span><span className="text-dim">vs</span> {nombreEquipo(x.rival)}</span>
              </td>
              <td className="px-3 py-2 text-center">
                <span
                  className={clsx(
                    "num inline-block min-w-14 rounded-md px-2 py-0.5 font-semibold text-tinta",
                    x.resultado === "G" ? "bg-win" : x.resultado === "E" ? "bg-draw" : "bg-loss",
                  )}
                >
                  <Marcador local={x.gf} visitante={x.gc} localEquipo="INGENIERIA" visitanteEquipo={x.rival} />
                </span>
                {x.partido.penales && <span className="ml-2 text-xs text-dim">pen. {/^\d+-\d+$/.test(x.partido.penales) ? x.partido.penales : ""}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function TemporadaPage({ params }: { params: Promise<{ anio: string }> }) {
  const anio = Number((await params).anio);
  const t = TEMPORADAS[anio];
  if (!t) notFound();
  const todos = partidosDe(t, t.equipo);
  const r = resumen(todos);
  const de = (e: Etapa) => todos.filter((x) => ETAPA_DE[x.partido.competencia] === e);
  const campeones = t.campeones.filter((c) => c.equipo);
  const etapasVisibles = ETAPAS.filter(({ id }) => (id !== "mundial" || anio >= 2024) && (de(id).length > 0 || (id === "fase-regular" && t.tabla.length > 0)));

  // Series del Mundialito donde jugó Ingeniería
  const serieMia = anio >= 2024 && t.partidos.find(
    (p) =>
      p.instancia === "grupo" &&
      (p.competencia === "mundial-oro" || p.competencia === "mundial-plata") &&
      (p.local === t.equipo || p.visitante === t.equipo),
  );
  const tablaSerie = serieMia ? tablaDe(t.partidos.filter((p) => p.competencia === serieMia.competencia && p.grupo === serieMia.grupo)) : [];

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-10">
        <nav className="mb-4 flex flex-wrap gap-2 text-sm" aria-label="Temporadas">
          {ANIOS.map((a) => (
            <Link
              key={a}
              href={`/temporada/${a}`}
              className={clsx("num rounded-full border px-3 py-1", a === anio ? "border-accent bg-accent text-tinta" : "border-line text-dim hover:text-text")}
            >
              {a}
            </Link>
          ))}
        </nav>
        <div className="text-xs uppercase tracking-[0.25em] text-accent">Liga Interfacultades</div>
        <h1 className="font-display text-6xl font-black uppercase leading-none">Temporada {anio}</h1>
        <p className="mt-2 text-dim">
          {t.resumen}
        </p>

        {etapasVisibles.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {etapasVisibles.map(({ id, titulo }) => {
              const e = t.etapas.find((x) => x.etapa === id);
              return (
                <a key={id} href={`#${id}`} className="rounded-xl border border-line bg-surface p-4 hover:border-accent/60">
                  <div className="text-xs uppercase tracking-wider text-dim">{titulo}</div>
                  <div className="mt-1 font-display text-2xl font-extrabold uppercase leading-tight">{e?.titulo ?? titulo}</div>
                  {e?.detalle && <div className="mt-1 text-sm text-dim">{e.detalle.replace(/[A-ZÁÉÍÓÚ]{3,}/g, (m) => nombreEquipo(m))}</div>}
                </a>
              );
            })}
          </div>
        )}

        {r.pj > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Partidos" value={`${r.g}-${r.e}-${r.p}`} sub={`G-E-P en ${r.pj} partidos`} />
            <StatTile label="Goles" value={`${r.gf}:${r.gc}`} sub={`${(r.gf / r.pj).toFixed(1)} a favor por partido`} />
            {r.mayorGoleada && <StatTile label="Mayor goleada" value={`${r.mayorGoleada.gf}-${r.mayorGoleada.gc}`} sub={nombreEquipo(r.mayorGoleada.rival)} />}
            {r.peorDerrota && <StatTile label="Peor derrota" value={`${r.peorDerrota.gf}-${r.peorDerrota.gc}`} sub={nombreEquipo(r.peorDerrota.rival)} />}
          </div>
        )}
      </div>

      {(de("fase-regular").length > 0 || t.tabla.length > 0) && <div id="fase-regular" className="scroll-mt-20">
        <Seccion kicker={`${anio} · Etapa 1`} titulo="Fase regular">
          {de("fase-regular").length > 0 && <TablaPartidos ps={de("fase-regular")} />}
          {t.tabla.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm uppercase tracking-wider text-dim">Tabla</h3>
              <TablaPosiciones filas={t.tabla} resaltar={t.equipo} />
            </div>
          )}
        </Seccion>
      </div>}

      {anio >= 2024 && de("mundial").length > 0 && <div id="mundial" className="scroll-mt-20">
        <Seccion kicker={`${anio} · Etapa 2`} titulo="Mundialito">
          <TablaPartidos ps={de("mundial")} />
          {tablaSerie.length > 0 && serieMia && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm uppercase tracking-wider text-dim">
                {NOMBRE_COMPETENCIA[serieMia.competencia]} · {serieMia.grupo}
              </h3>
              <TablaPosiciones filas={tablaSerie} resaltar={t.equipo} compacta />
            </div>
          )}
        </Seccion>
      </div>}

      {de("playoffs").length > 0 && <div id="playoffs" className="scroll-mt-20">
        <Seccion kicker={`${anio} · Etapa 3`} titulo="Playoffs">
          <TablaPartidos ps={de("playoffs")} />
        </Seccion>
      </div>}

      {t.notas?.some((n) => n.trim()) && (
        <Seccion kicker={String(anio)} titulo="Notas">
          <ul className="grid gap-2 text-sm text-dim">
            {t.notas.filter((n) => n.trim()).map((n) => (
              <li key={n} className="min-w-0 break-words rounded-lg border border-line bg-surface px-4 py-3">
                {n}
              </li>
            ))}
          </ul>
        </Seccion>
      )}

      {campeones.length > 0 && (
        <Seccion kicker={String(anio)} titulo="Campeones">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {campeones.map((c) => (
              <div key={c.competencia} className="rounded-xl border border-line bg-surface p-4">
                <div className="text-xs uppercase tracking-wider text-dim">{NOMBRE_COMPETENCIA[c.competencia]}</div>
                <div className="mt-1 font-display text-2xl font-extrabold uppercase">{nombreEquipo(c.equipo!)}</div>
              </div>
            ))}
          </div>
        </Seccion>
      )}

    </>
  );
}
