import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface Noticia { slug: string; titulo: string; fecha: string; foto: string; texto: string; }
export async function leerNoticias(): Promise<Noticia[]> {
 const dir = path.join(process.cwd(),"data/noticias");
 let archivos: string[];
 try { archivos = await readdir(dir); } catch (e) { if ((e as NodeJS.ErrnoException).code === "ENOENT") return []; throw e; }
 return (await Promise.all(archivos.filter(f=>f.endsWith(".md")).map(async f=>{
  const contenido = await readFile(path.join(dir,f),"utf8");
  const cab = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(contenido);
  if (!cab) throw new Error(`Noticia sin encabezado: ${f}`);
  const campos=Object.fromEntries(cab[1].split(/\r?\n/).map(l=>{const i=l.indexOf(":");return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^["']|["']$/g,"")];}));
  if (!campos.titulo || !/^\d{4}-\d{2}-\d{2}$/.test(campos.fecha)) throw new Error(`Título o fecha inválidos: ${f}`);
  return {slug:f.slice(0,-3),titulo:campos.titulo,fecha:campos.fecha,foto:campos.foto || "",texto:cab[2]};
 }))).sort((a,b)=>b.fecha.localeCompare(a.fecha));
}
