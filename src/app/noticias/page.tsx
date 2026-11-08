import Link from "next/link";
import { notFound } from "next/navigation";
import { CabeceraPagina, Seccion, AvisoVacio } from "@/components/stats-ui";
import { leerNoticias } from "@/lib/noticias";
import { metadataPagina } from "@/lib/metadata";
export const metadata = metadataPagina("Noticias","Crónicas y novedades del CAF.","/noticias");
export default async function Noticias() {
 // Sección oculta por ahora: se vuelve a activar sacando esta línea y sumándola al menú.
 notFound();
 const noticias=await leerNoticias();
 return <><CabeceraPagina titulo="Noticias" descripcion="Lo que pasa dentro y fuera de la cancha." /><Seccion titulo="Últimas novedades">{noticias.length ? <ul className="grid gap-4 sm:grid-cols-2">{noticias.map(n=><li key={n.slug} className="rounded-xl border border-line bg-surface p-5"><time>{n.fecha}</time><h2 className="font-display text-3xl"><Link href={`/noticias/${n.slug}`}>{n.titulo}</Link></h2></li>)}</ul> : <AvisoVacio>Todavía no hay crónicas publicadas.</AvisoVacio>}</Seccion></>;
}
