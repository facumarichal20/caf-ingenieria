import {readdir,readFile} from "node:fs/promises";
import path from "node:path";
export async function leerGoleadores(){
 const dir=path.join(process.cwd(),"data/plantel");
 const archivos=(await readdir(dir)).filter(f=>/^goles-\d{4}\.csv$/.test(f));
 const filas=(await Promise.all(archivos.map(async f=>{
  const lineas=(await readFile(path.join(dir,f),"utf8")).replace(/^\uFEFF/,"").trim().split(/\r?\n/).slice(1);
  return lineas.filter(Boolean).map(l=>{const [jugador,goles,asistencias,fuente]=l.split(",");return {anio:Number(f.slice(6,10)),jugador,goles:Number(goles||0),asistencias:asistencias===""?null:Number(asistencias),fuente};});
 }))).flat();
 const historico=new Map<string,number>();
 for(const f of filas) historico.set(f.jugador,(historico.get(f.jugador)||0)+f.goles);
 return {filas,historico:[...historico].sort((a,b)=>b[1]-a[1])};
}
