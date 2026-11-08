import { metadataPagina } from "@/lib/metadata";

import Link from "next/link";
import { LineaDeTiempo, Palmares } from "@/components/historia";
import { Seccion, StatTile } from "@/components/stats-ui";
import { records, resumenPorAnio, type PartidoHistorico } from "@/lib/historia";
import { nombreEquipo } from "@/lib/stats";
import { TEMPORADAS } from "@/lib/temporadas";

export const metadata = { ...metadataPagina("Historia", "Récords y temporadas del CAF en la Liga Interfacultades.", "/historia") };

function detalle(p: PartidoHistorico | null) {
  return p ? `vs ${nombreEquipo(p.rival)} · ${p.anio}` : "Sin partidos registrados";
}

export default function Historia() {
  const temporadas = Object.values(TEMPORADAS);
  const r = records(temporadas);
  const anios = resumenPorAnio(temporadas);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-12">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Liga Interfacultades</p>
        <h1 className="mt-3 font-display text-6xl font-black uppercase">Historia del CAF</h1>
        <p className="mt-4 max-w-2xl text-dim">
          El recorrido del CAF en la Liga Interfacultades.
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
      <Seccion titulo="Récords">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {r.mayorGoleada && <StatTile label="Mayor goleada" value={`${r.mayorGoleada.gf}–${r.mayorGoleada.gc}`} sub={detalle(r.mayorGoleada)} />}
          {r.peorDerrota && <StatTile label="Peor derrota" value={`${r.peorDerrota.gf}–${r.peorDerrota.gc}`} sub={detalle(r.peorDerrota)} />}
          {r.masGoles && <StatTile label="Más goles en un partido" value={r.masGoles.gf} sub={detalle(r.masGoles)} />}
          {r.mejorPosicion && <StatTile label="Mejor posición regular" value={`${r.mejorPosicion.pos}°`} sub={`${r.mejorPosicion.anio} · de ${r.mejorPosicion.equipos} equipos`} />}
          {r.mejorEfectividad && <StatTile label="Mejor efectividad" value={`${r.mejorEfectividad.partidos.efectividad}%`} sub={`${r.mejorEfectividad.anio} · mínimo 5 partidos`} />}
          <StatTile label="Definiciones por penales" value={`${r.penales.ganadas}/${r.penales.jugadas}`} sub="ganadas / jugadas" />
        </div>
      </Seccion>
      <Seccion titulo="Palmarés"><Palmares /></Seccion>
      <Seccion titulo="Temporada por temporada">
        <p className="mb-4 text-sm text-dim">Posición y puntos oficiales de fase regular; PJ, G, E, P y goles incluyen todas las etapas cargadas.</p>
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-surface text-xs uppercase text-dim">
              <tr>{["Año", "Posición", "Pts FR", "PJ", "G", "E", "P", "GF:GC", "Efectividad"].map((c) => <th key={c} scope="col" className="px-3 py-3 text-left">{c}</th>)}</tr>
            </thead>
            <tbody className="num">
              {anios.map((a) => (
                <tr key={a.anio} className="border-t border-line">
                  <th scope="row" className="px-3 py-3 text-left"><Link className="text-accent hover:underline" href={`/temporada/${a.anio}`}>{a.anio}</Link></th>
                  <td className="px-3 py-3">{a.pos === null ? null : `${a.pos}° / ${a.equipos}`}</td>
                  <td className="px-3 py-3">{a.pts}</td>
                  {[a.partidos.pj, a.partidos.g, a.partidos.e, a.partidos.p, `${a.partidos.gf}:${a.partidos.gc}`, `${a.partidos.efectividad}%`].map((v, i) => <td key={i} className="px-3 py-3">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>
      <Seccion titulo="Recorrido por etapas"><LineaDeTiempo /></Seccion>
    </>
  );
}
