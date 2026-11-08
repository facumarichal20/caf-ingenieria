import { CabeceraPagina, Seccion, AvisoVacio } from "@/components/stats-ui";
import { metadataPagina } from "@/lib/metadata";
import fixture from "../../../data/fixture-2027.json";

export const metadata = metadataPagina("Fixture 2027", "Próximos partidos y resultados del CAF en 2027.", "/fixture");
interface Encuentro { rival: string; fecha: string; cancha: string; direccion: string; gf: number | null; gc: number | null; }
export default function Fixture() {
 const partidos = fixture as Encuentro[];
 const proximos = partidos.filter(p => p.gf === null || p.gc === null).sort((a,b) => a.fecha.localeCompare(b.fecha));
 const proximo = proximos[0];
 return <><CabeceraPagina titulo="Fixture 2027" descripcion="Días, horarios, canchas y resultados del CAF." />
 <Seccion titulo="Próximo partido">{proximo ? <div className="rounded-xl border border-accent bg-surface p-6"><h2 className="font-display text-4xl">CAF vs {proximo.rival}</h2><p>{new Date(proximo.fecha).toLocaleString("es-UY", {timeZone:"America/Montevideo"})}</p><a className="text-accent" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(proximo.direccion || proximo.cancha)}`}>{proximo.cancha} · Cómo llegar</a></div> : <AvisoVacio>El fixture 2027 todavía no está confirmado. Publicaremos el primer partido cuando la Liga anuncie día, hora y cancha.</AvisoVacio>}</Seccion>
 <Seccion titulo="Partidos">{partidos.length ? <ul className="grid gap-3">{partidos.map((p,i)=><li key={i} className="rounded-xl border border-line p-4">CAF vs {p.rival} · {p.gf !== null && p.gc !== null ? `${p.gf}–${p.gc}` : "Por jugar"} · {p.fecha}</li>)}</ul> : <AvisoVacio>Todavía no hay partidos ni resultados cargados para 2027.</AvisoVacio>}</Seccion></>;
}
