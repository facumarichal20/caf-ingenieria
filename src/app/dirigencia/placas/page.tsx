import {CabeceraPagina,Seccion} from "@/components/stats-ui";
import {EditorPlacas} from "@/components/editor-placas";
export const metadata={title:"Placas",description:"Placas del CAF para descargar.",robots:{index:false,follow:false}};
export default function Placas(){return <><CabeceraPagina titulo="Placas para Instagram" descripcion="Prepará resultados, convocatorias y goleadores con los colores del CAF."/><Seccion titulo="Crear placa"><EditorPlacas/></Seccion></>;}
