import {CabeceraPagina,Seccion} from "@/components/stats-ui";
import {ListaConvocatoria} from "@/components/lista-convocatoria";
export const metadata={title:"Convocatoria",description:"Armado de convocatorias del CAF.",robots:{index:false,follow:false}};
export default function Convocatoria(){return <><CabeceraPagina titulo="Convocatoria" kicker="Dirigencia · Demostración" descripcion="Probá la lista con jugadores inventados. Los sancionados y quienes no tienen carné vigente quedan bloqueados."/><Seccion titulo="Armar la lista"><ListaConvocatoria/></Seccion></>;}
