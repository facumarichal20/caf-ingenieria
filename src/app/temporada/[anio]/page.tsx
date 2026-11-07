import clsx from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Seccion, StatTile, TablaPosiciones } from "@/components/stats-ui";
import { caraACara, nombreEquipo, partidosDe, resumen, tablaDe, type PartidoEquipo } from "@/lib/stats";
import { ANIOS, NOTAS, TEMPORADAS } from "@/lib/temporadas";
import { ETAPA_DE, ETAPAS, NOMBRE_COMPETENCIA, type Etapa, type Partido, type Temporada } from "@/lib/tipos";

export function generateStaticParams() {
  return ANIOS.map((a) => ({ anio: String(a) }));
}

export async function generateMetadata({ params }: { params: Promise<{ anio: string }> }) {
  return { title: `Temporada ${(await params).anio}` };
}

const fmtFecha = (iso: string | null) =>
  iso ? new Date(iso.length === 10 ? iso + "T12:00" : iso).toLocaleDateString("es-UY", { weekday: "short", day: "2-digit", month: "2-digit" }) : "—";

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
                {x.partido.penales && <span className="ml-2 text-xs text-dim">pen. {/^\d+-\d+$/.test(x.partido.penales) ? x.partido.penales : ""}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EtapaVacia({ t }: { t: Temporada }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-4 py-6 text-sm text-dim">
      Todavía no hay partidos cargados de esta etapa {t.anio}. Si tenés las placas o la planilla, se cargan con{" "}
      <code className="rounded bg-surface px-1">data/historico/{t.anio}.csv</code> (ver README).
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

  // Series del Mundialito donde jugó Ingeniería
  const serieMia = t.partidos.find(
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
        <div className="text-xs uppercase tracking-[0.25em] text-accent">{t.torneo}</div>
        <h1 className="font-display text-6xl font-black uppercase leading-none">Temporada {anio}</h1>
        <p className="mt-2 text-dim">
          {t.resumen || "Sin resumen todavía"} · fuente: {t.fuente}
          {t.completitud === "parcial" && <span className="ml-2 rounded bg-warn/20 px-1.5 py-0.5 text-xs text-warn">datos incompletos</span>}
        </p>

        {t.etapas.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {ETAPAS.map(({ id, titulo }) => {
              const e = t.etapas.find((x) => x.etapa === id);
              return (
                <a key={id} href={`#${id}`} className="rounded-xl border border-line bg-surface p-4 hover:border-accent/60">
                  <div className="text-xs uppercase tracking-wider text-dim">{titulo}</div>
                  <div className="mt-1 font-display text-2xl font-extrabold uppercase leading-tight">{e?.titulo ?? "—"}</div>
                  {e?.detalle && <div className="mt-1 text-sm text-dim">{e.detalle.replace(/[A-ZÁÉÍÓÚ]{3,}/g, (m) => nombreEquipo(m))}</div>}
                </a>
              );
            })}
          </div>
        )}

        {r.pj > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile
              label={t.completitud === "completa" ? "Récord del año" : "Partidos cargados"}
              value={`${r.g}-${r.e}-${r.p}`}
              sub={`G-E-P en ${r.pj} partidos${t.completitud === "completa" ? "" : " (faltan datos)"}`}
            />
            <StatTile label="Goles" value={`${r.gf}:${r.gc}`} sub={`${(r.gf / r.pj).toFixed(1)} a favor por partido`} />
            <StatTile label="Mayor goleada" value={r.mayorGoleada ? `${r.mayorGoleada.gf}-${r.mayorGoleada.gc}` : "—"} sub={r.mayorGoleada && nombreEquipo(r.mayorGoleada.rival)} />
            <StatTile label="Peor derrota" value={r.peorDerrota ? `${r.peorDerrota.gf}-${r.peorDerrota.gc}` : "—"} sub={r.peorDerrota && nombreEquipo(r.peorDerrota.rival)} />
          </div>
        )}
      </div>

      <div id="fase-regular" className="scroll-mt-20">
        <Seccion kicker={`${anio} · Etapa 1`} titulo="Fase regular">
          {de("fase-regular").length ? <TablaPartidos ps={de("fase-regular")} /> : <EtapaVacia t={t} />}
          {t.tabla.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm uppercase tracking-wider text-dim">Tabla</h3>
              <TablaPosiciones filas={t.tabla} resaltar={t.equipo} />
            </div>
          )}
          {NOTAS[anio] && <p className="mt-3 text-xs text-dim">Nota: {NOTAS[anio]}</p>}
        </Seccion>
      </div>

      <div id="mundial" className="scroll-mt-20">
        <Seccion kicker={`${anio} · Etapa 2`} titulo="Mundialito">
          {de("mundial").length ? <TablaPartidos ps={de("mundial")} /> : <EtapaVacia t={t} />}
          {tablaSerie.length > 0 && serieMia && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm uppercase tracking-wider text-dim">
                {NOMBRE_COMPETENCIA[serieMia.competencia]} · {serieMia.grupo}
              </h3>
              <TablaPosiciones filas={tablaSerie} resaltar={t.equipo} compacta />
            </div>
          )}
        </Seccion>
      </div>

      <div id="playoffs" className="scroll-mt-20">
        <Seccion kicker={`${anio} · Etapa 3`} titulo="Playoffs">
          {de("playoffs").length ? <TablaPartidos ps={de("playoffs")} /> : <EtapaVacia t={t} />}
        </Seccion>
      </div>

      {t.notas && t.notas.length > 0 && (
        <Seccion kicker={String(anio)} titulo="Notas">
          <ul className="grid gap-2 text-sm text-dim">
            {t.notas.map((n) => (
              <li key={n} className="rounded-lg border border-line bg-surface px-4 py-3">
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

      {todos.length > 0 && (
        <Seccion titulo="Cara a cara">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {caraACara(todos).map((x) => (
              <div key={x.rival} className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3">
                <span className="font-medium">{nombreEquipo(x.rival)}</span>
                <span className="num text-sm text-dim">
                  {x.g}G {x.e}E {x.p}P · {x.gf}:{x.gc}
                </span>
              </div>
            ))}
          </div>
        </Seccion>
      )}
    </>
  );
}
