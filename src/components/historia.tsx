import clsx from "clsx";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { nombreEquipo } from "@/lib/stats";
import { ANIOS, TEMPORADAS } from "@/lib/temporadas";
import { ETAPAS } from "@/lib/tipos";

/** Logros destacados, a mano: son pocos y cada uno merece su texto. */
const LOGROS = [
  { anio: 2013, titulo: "Copa de Plata", detalle: null, medalla: "plata" },
  { anio: 2020, titulo: "Copa de Plata", detalle: "Dos series por penales y final 2-0 a UDE en el Obdulio Varela", medalla: "plata" },
  { anio: 2024, titulo: "Subcampeón del Mundialito", detalle: "3 series ganadas por penales; final 0-1 con ISEF", medalla: "plata" },
  { anio: 2024, titulo: "Semifinal Copa Oro", detalle: "Afuera con ISEF por un gol en el global", medalla: null },
  { anio: 2025, titulo: "Semifinal Copa Oro", detalle: "Eliminó a ISEF y le ganó la ida 3-1 a Contadores", medalla: null },
  { anio: 2021, titulo: "Semifinal Copa Oro", detalle: "2-0 a Química en cuartos", medalla: null },
  { anio: 2018, titulo: "Semifinal Copa Oro", detalle: "3.º en la fase regular, la mejor registrada; afuera con ISEF", medalla: null },
];

export function Palmares({ soloTitulos = false }: { soloTitulos?: boolean }) {
  const logros = soloTitulos ? LOGROS.filter((l) => l.medalla === "plata") : LOGROS;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {logros.map((l) => {
        const className = clsx(
          "rounded-xl border p-4 transition",
          TEMPORADAS[l.anio] && "hover:border-accent/70",
          l.medalla === "plata" ? "border-plata/60 bg-plata/10" : "border-line bg-surface",
        );
        const contenido = (
          <>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-dim">
              <Trophy className={clsx("h-4 w-4", l.medalla === "plata" ? "text-plata" : "text-dim")} aria-hidden />
              <span className="num">{l.anio}</span>
            </div>
            <div className="mt-2 font-display text-2xl font-extrabold uppercase leading-tight">{l.titulo}</div>
            {l.detalle && <div className="mt-1 text-sm text-dim">{l.detalle}</div>}
          </>
        );
        return TEMPORADAS[l.anio] ? (
          <Link key={l.anio + l.titulo} href={"/temporada/" + l.anio} className={className}>{contenido}</Link>
        ) : (
          <div key={l.anio + l.titulo} className={className}>{contenido}</div>
        );
      })}
    </div>
  );
}

const HITOS: Record<number, { texto: string; destacado?: boolean }> = {
  2010: { texto: "Debut en la Liga" },
  2013: { texto: "Copa de Plata · Campeón", destacado: true },
};

export function LineaDeTiempo() {
  const anios = [...new Set([...ANIOS, ...Object.keys(HITOS).map(Number)])].sort((a, b) => b - a);

  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wider text-dim">
          <tr>
            <th className="px-3 py-2 text-left">Año</th>
            <th className="px-3 py-2 text-left">Hito</th>
            {ETAPAS.map((e) => <th key={e.id} className="px-3 py-2 text-left">{e.titulo}</th>)}
          </tr>
        </thead>
        <tbody>
          {anios.map((a) => {
            const t = TEMPORADAS[a];
            return (
              <tr key={a} className={clsx("border-t border-line align-top", HITOS[a]?.destacado && "bg-accent/10")}>
                <td className="px-3 py-3">
                  {t ? <Link href={"/temporada/" + a} className="num font-semibold text-accent hover:underline">{a}</Link> : <span className="num font-semibold">{a}</span>}
                </td>
                <td className={clsx("px-3 py-3", HITOS[a]?.destacado && "font-semibold text-accent")}>{HITOS[a]?.texto}</td>
                {ETAPAS.map((e) => {
                  const r = t?.etapas.find((x) => x.etapa === e.id);
                  return (
                    <td key={e.id} className="px-3 py-3">
                      {r && <>
                        <div className="font-medium">{r.titulo}</div>
                        {r.detalle && <div className="text-xs text-dim">{r.detalle.replace(/[A-ZÁÉÍÓÚ]{3,}/g, (m) => nombreEquipo(m))}</div>}
                      </>}
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
