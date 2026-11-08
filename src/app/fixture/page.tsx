import { CabeceraPagina, Seccion, AvisoVacio, Marcador } from "@/components/stats-ui";
import { Escudo } from "@/components/escudo";
import { metadataPagina } from "@/lib/metadata";
import fixture from "../../../data/fixture-2027.json";

export const metadata = metadataPagina("Fixture 2027", "Próximos partidos y resultados del CAF en 2027.", "/fixture");
interface Encuentro { rival: string; fecha: string; cancha: string; direccion: string; gf: number | null; gc: number | null; }

export default function Fixture() {
  const partidos = fixture as Encuentro[];
  const proximos = partidos.filter((p) => p.gf === null || p.gc === null).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const proximo = proximos[0];
  return (
    <>
      <CabeceraPagina titulo="Fixture 2027" descripcion="Días, horarios, canchas y resultados del CAF." />
      <Seccion titulo="Próximo partido">
        {proximo ? (
          <div className="rounded-xl border border-accent bg-surface p-6">
            <h2 className="flex flex-wrap items-center gap-3 font-display text-4xl">
              <Escudo equipo="INGENIERIA" size={42} /> CAF <span className="text-dim">vs</span><Escudo equipo={proximo.rival} size={42} /> {proximo.rival}
            </h2>
            <p className="mt-3">{new Date(proximo.fecha).toLocaleString("es-UY", { timeZone: "America/Montevideo" })}</p>
            <a className="text-accent" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(proximo.direccion || proximo.cancha)}`}>{proximo.cancha} · Cómo llegar</a>
          </div>
        ) : <AvisoVacio>El fixture 2027 todavía no está confirmado. Publicaremos el primer partido cuando la Liga anuncie día, hora y cancha.</AvisoVacio>}
      </Seccion>
      <Seccion titulo="Partidos">
        {partidos.length ? (
          <ul className="grid gap-3">
            {partidos.map((partido, indice) => (
              <li key={indice} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4">
                <span className="flex flex-wrap items-center gap-2">
                  <Escudo equipo="INGENIERIA" size={30} /><span>CAF</span><span className="text-dim">vs</span><Escudo equipo={partido.rival} size={30} /><span>{partido.rival}</span>
                </span>
                {partido.gf !== null && partido.gc !== null ? (
                  <Marcador local={partido.gf} visitante={partido.gc} compacto />
                ) : <span>Por jugar</span>}
                <time className="num text-sm text-dim">{partido.fecha}</time>
              </li>
            ))}
          </ul>
        ) : <AvisoVacio>Todavía no hay partidos ni resultados cargados para 2027.</AvisoVacio>}
      </Seccion>
    </>
  );
}