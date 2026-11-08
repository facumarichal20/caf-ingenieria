import Image from "next/image";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { CabeceraPagina, Seccion, AvisoVacio } from "@/components/stats-ui";
import { metadataPagina } from "@/lib/metadata";
export const metadata = metadataPagina("Galería","Fotos del CAF por partido y temporada.","/galeria");
export default async function Galeria() {
 const archivos=await readdir(path.join(process.cwd(),"public/photos"),{recursive:true});
 const fotos=archivos.filter(f=>/\.(png|jpe?g|webp)$/i.test(f));
 return <><CabeceraPagina titulo="Galería" descripcion="El CAF, dentro y fuera de la cancha." /><Seccion titulo="Fotos">{fotos.length ? <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{fotos.map(f=><li key={f}><Image src={"/photos/"+f.replaceAll("\\","/")} alt={"CAF · "+f.replace(/\.[^.]+$/,"").replaceAll(/[-_/]/g," ")} width={900} height={600} className="h-auto w-full rounded-xl" /></li>)}</ul> : <AvisoVacio>Estamos preparando las fotos del plantel y los partidos.</AvisoVacio>}</Seccion></>;
}
