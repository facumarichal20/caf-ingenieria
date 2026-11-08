import Image from "next/image";
import { CabeceraPagina, Seccion, AvisoVacio } from "@/components/stats-ui";
import { metadataPagina } from "@/lib/metadata";
import sponsors from "../../../data/club/sponsors.json";
export const metadata = metadataPagina("Apoyos","Sponsors y formas de apoyar al CAF.","/apoyos");
export default function Apoyos() {return <><CabeceraPagina titulo="Apoyos" descripcion="El club se sostiene con el esfuerzo del plantel y de quienes nos acompañan."/><Seccion titulo="Sponsors">{sponsors.length ? <ul className="grid gap-4 sm:grid-cols-3">{(sponsors as {nombre:string;logo:string;url:string}[]).map(s=><li key={s.nombre}><a href={s.url}><Image src={s.logo} alt={s.nombre} width={300} height={160}/></a></li>)}</ul> : <AvisoVacio>Próximamente publicaremos los apoyos confirmados para la temporada.</AvisoVacio>}</Seccion><Seccion titulo="¿Querés apoyar al CAF?"><p>Podés colaborar con indumentaria, materiales o los gastos de la temporada.</p><a className="boton mt-4" href="https://www.instagram.com/ingenieriafutbol_11/">Hablemos por Instagram</a></Seccion></>;}
