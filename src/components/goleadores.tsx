import {Seccion,AvisoVacio} from "@/components/stats-ui";
import {leerGoleadores} from "@/lib/goleadores";
export async function Goleadores(){
 const {filas,historico}=await leerGoleadores();
 return <><Seccion titulo="Goleadores por año"><p className="mb-4 text-sm text-dim">Registro parcial: incluye únicamente los goles verificados en publicaciones. No representa los totales de cada temporada.</p>{filas.length ? <ul className="space-y-3">{filas.map((f,i)=><li key={i} className="rounded-xl border border-line p-4">{f.anio} · {f.jugador} · {f.goles} gol(es) · {f.asistencias===null?"Asistencias sin dato":f.asistencias+" asistencias"} <a href={f.fuente} className="text-accent">Ver fuente</a></li>)}</ul> : <AvisoVacio>Todavía no hay goles individuales verificados.</AvisoVacio>}</Seccion><Seccion titulo="Goleadores históricos"><p className="mb-4 text-sm text-dim">Suma de los registros parciales disponibles.</p><ol className="space-y-3">{historico.map(([j,g])=><li key={j} className="flex justify-between border-b border-line py-3"><span>{j}</span><span className="num">{g}</span></li>)}</ol></Seccion></>;
}
