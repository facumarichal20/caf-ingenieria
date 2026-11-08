import type { Metadata } from "next";
import Link from "next/link";
import { LineaDeTiempo, Palmares } from "@/components/historia";
import { Seccion, StatTile } from "@/components/stats-ui";
import { caraACaraHistorico, records, resumenPorAnio, type PartidoHistorico } from "@/lib/historia";
import { nombreEquipo } from "@/lib/stats";
import { NOTAS, TEMPORADAS } from "@/lib/temporadas";

export const metadata: Metadata = { title: "Historia" };

function detalle(p: PartidoHistorico | null) {
  return p ? `vs ${nombreEquipo(p.rival)} · ${p.anio}` : "Sin partidos registrados";
}

export default function Historia() {
  const temporadas = Object.values(TEMPORADAS);
  const r = records(temporadas);
  const anios = resumenPorAnio(temporadas);
  const rivales = caraACaraHistorico(temporadas);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-12">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Liga Interfacultades</p>
        <h1 className="mt-3 font-display text-6xl font-black uppercase">Historia del CAF</h1>
        <p className="mt-4 max-w-2xl text-dim">
          Todas las temporadas registradas. Los totales y récords se calculan sobre los partidos cargados;
          los años con carga parcial pueden tener resultados pendientes.
        </p>
      </div>
      <Seccion titulo="El CAF en números">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile destacado label="Partidos" value={r.total.pj} sub={`${r.total.g}G ${r.total.e}E ${r.total.p}P`} />
          <StatTile label="Goles" value={`${r.total.gf}–${r.total.gc}`} sub="a favor – en contra" />
          <StatTile label="Efectividad" value={`${r.total.efectividad}%`} sub="de los puntos en juego" />
          <StatTile label="Vallas invictas" value={r.total.vallasInvictas} />
        </div>
      </Seccion>
      <Seccion titulo="Récords" kicker="Sobre los resultados registrados">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatTile label="Mayor goleada" value={r.mayorGoleada ? `${r.mayorGoleada.gf}–${r.mayorGoleada.gc}` : "—"} sub={detalle(r.mayorGoleada)} />
          <StatTile label="Peor derrota" value={r.peorDerrota ? `${r.peorDerrota.gf}–${r.peorDerrota.gc}` : "—"} sub={detalle(r.peorDerrota)} />
          <StatTile label="Más goles en un partido" value={r.masGoles?.gf ?? "—"} sub={detalle(r.masGoles)} />
          <StatTile label="Mejor posición regular" value={r.mejorPosicion ? `${r.mejorPosicion.pos}°` : "—"} sub={r.mejorPosicion ? `${r.mejorPosicion.anio} · de ${r.mejorPosicion.equipos} equipos` : undefined} />
          <StatTile label="Mejor efectividad" value={r.mejorEfectividad ? `${r.mejorEfectividad.partidos.efectividad}%` : "—"} sub={r.mejorEfectividad ? `${r.mejorEfectividad.anio} · mínimo 5 partidos` : "Sin temporadas con 5 partidos"} />
          <StatTile label="Definiciones por penales" value={`${r.penales.ganadas}/${r.penales.jugadas}`} sub="ganadas / jugadas" />
        </div>
      </Seccion>
      <Seccion titulo="Palmarés"><Palmares /></Seccion>
      <Seccion titulo="Temporada por temporada">
        <p className="mb-4 text-sm text-dim">Posición y puntos oficiales de fase regular; PJ, G, E, P y goles incluyen todas las etapas cargadas.</p>
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-surface text-xs uppercase text-dim">
              <tr>{["Año", "Posición", "Pts FR", "PJ", "G", "E", "P", "GF:GC", "Efectividad", "Carga"].map((c) => <th key={c} scope="col" className="px-3 py-3 text-left">{c}</th>)}</tr>
            </thead>
            <tbody className="num">
              {anios.map((a) => (
                <tr key={a.anio} className="border-t border-line">
                  <th scope="row" className="px-3 py-3 text-left"><Link className="text-accent hover:underline" href={`/temporada/${a.anio}`}>{a.anio}</Link></th>
                  <td className="px-3 py-3">{a.pos === null ? "—" : `${a.pos}° / ${a.equipos}`}</td>
                  <td className="px-3 py-3">{a.pts ?? "—"}</td>
                  {[a.partidos.pj, a.partidos.g, a.partidos.e, a.partidos.p, `${a.partidos.gf}:${a.partidos.gc}`, `${a.partidos.efectividad}%`].map((v, i) => <td key={i} className="px-3 py-3">{v}</td>)}
                  <td className="px-3 py-3 font-sans">{a.completitud === "completa" ? "Completa" : "Parcial"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {anios.filter((a) => NOTAS[a.anio]).map((a) => <p key={a.anio} className="mt-3 text-xs text-dim">{a.anio}: {NOTAS[a.anio]}</p>)}
      </Seccion>
      <Seccion titulo="Recorrido por etapas"><LineaDeTiempo /></Seccion>
      <Seccion titulo="Cara a cara histórico">
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-surface text-xs uppercase text-dim">
              <tr>{["Rival", "PJ", "G", "E", "P", "GF:GC", "Último partido"].map((c) => <th key={c} scope="col" className="px-3 py-3 text-left">{c}</th>)}</tr>
            </thead>
            <tbody className="num">
              {rivales.map((c) => (
                <tr key={c.rival} className="border-t border-line">
                  <th scope="row" className="px-3 py-3 text-left font-sans">{nombreEquipo(c.rival)}</th>
                  {[c.pj, c.g, c.e, c.p, `${c.gf}:${c.gc}`].map((v, i) => <td key={i} className="px-3 py-3">{v}</td>)}
                  <td className="px-3 py-3"><Link className="text-accent hover:underline" href={`/temporada/${c.ultimo.anio}`}>{c.ultimo.gf}–{c.ultimo.gc} · {c.ultimo.anio}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-dim">Marcadores desde el lado de Ingeniería. Las definiciones por penales se contabilizan por separado.</p>
      </Seccion>
    </>
  );
}
