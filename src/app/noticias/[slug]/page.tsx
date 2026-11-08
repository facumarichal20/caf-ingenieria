import Image from "next/image";
import { notFound } from "next/navigation";
import { CabeceraPagina, Seccion } from "@/components/stats-ui";
import { leerNoticias } from "@/lib/noticias";
import { metadataPagina } from "@/lib/metadata";
export async function generateStaticParams() { return (await leerNoticias()).map(n=>({slug:n.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const n=(await leerNoticias()).find(n=>n.slug===slug);

 return n ? metadataPagina(n.titulo,n.texto.slice(0,150),`/noticias/${n.slug}`) : {};
}

export default async function Noticia({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params;
 const n=(await leerNoticias()).find(n=>n.slug===slug); if (!n) notFound();
 return <><CabeceraPagina titulo={n.titulo} kicker={n.fecha} descripcion="Crónica del CAF" /><Seccion titulo="La crónica">{n.foto && <Image src={n.foto} alt={n.titulo} width={1200} height={800} className="mb-6 h-auto w-full rounded-xl" />}<article className="max-w-3xl space-y-4">{n.texto.split(/\r?\n\r?\n/).map((p,i)=><p key={i}>{p}</p>)}</article></Seccion></>;
}
