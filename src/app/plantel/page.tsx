import Image from "next/image";
import { metadataPagina } from "@/lib/metadata";

import { Seccion } from "@/components/stats-ui";
import { leerPlantel } from "@/lib/plantel";

export const metadata = { ...metadataPagina("Plantel", "Jugadores de Ingeniería Fútbol 11: nombres, apodos, posiciones y dorsales.", "/plantel") };

export default async function Plantel() {
  const jugadores = await leerPlantel();
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-12">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Ingeniería Fútbol 11</p>
        <h1 className="mt-3 font-display text-6xl font-black uppercase">El plantel</h1>
        <p className="mt-4 text-dim">Los nombres que defienden la camiseta del CAF.</p>
      </div>
      <Seccion titulo="Jugadores">
        {jugadores.length === 0 ? (
          <p role="status" className="rounded-xl border border-line bg-surface p-6 text-dim">
            Todavía no hay jugadores cargados. Próximamente vas a poder conocer al plantel.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jugadores.map((j, i) => (
              <li key={i} className="rounded-xl border border-line bg-surface p-5">
                {j.foto && <Image src={j.foto} alt={j.nombre} width={450} height={600} className="mb-4 h-auto w-full rounded-lg" />}
                <div className="num text-5xl font-semibold text-accent" aria-label={j.dorsal ? `Dorsal ${j.dorsal}` : "Sin dorsal asignado"}>{j.dorsal || "—"}</div>
                <h2 className="mt-4 font-display text-3xl font-extrabold uppercase">{j.nombre}</h2>
                {j.apodo && <p className="mt-1 text-dim">“{j.apodo}”</p>}
                <p className="mt-3 text-sm text-dim">{j.posicion || "Posición por confirmar"}</p>
              </li>
            ))}
          </ul>
        )}
      </Seccion>
    </>
  );
}
