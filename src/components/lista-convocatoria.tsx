"use client";
import {useState} from "react";
import {puedeConvocarse} from "@/lib/gestion";
const jugadores=[{nombre:"Jugador de ejemplo A",vence:"2027-12-31",sancionado:false},{nombre:"Jugador de ejemplo B",vence:"2026-01-01",sancionado:false},{nombre:"Jugador de ejemplo C",vence:"2027-12-31",sancionado:true},{nombre:"Jugador de ejemplo D",vence:null,sancionado:false}];
export function ListaConvocatoria(){
 const [fecha,setFecha]=useState("2027-03-20"),[lista,setLista]=useState<string[]>([]);
 const habilitados=lista.filter(n=>{const j=jugadores.find(j=>j.nombre===n)!;return puedeConvocarse(j.vence,j.sancionado,fecha)});
 return <div><label className="grid max-w-xs gap-2">Fecha del partido<input type="date" value={fecha} onChange={e=>{setFecha(e.target.value);setLista([]);}}/></label><ul className="mt-6 space-y-4">{jugadores.map(j=>{const ok=!!fecha&&puedeConvocarse(j.vence,j.sancionado,fecha);return <li key={j.nombre}><label className="flex items-center gap-3"><input type="checkbox" disabled={!ok} checked={habilitados.includes(j.nombre)} onChange={e=>setLista(e.target.checked?[...lista,j.nombre]:lista.filter(n=>n!==j.nombre))}/><span>{j.nombre} · {ok?"Habilitado":j.sancionado?"Sancionado":j.vence?"Carné vencido":"Sin carné registrado"}</span></label></li>})}</ul><h3 className="mt-8 font-display text-3xl">Convocados: {habilitados.length}</h3><p>{habilitados.join(", ")||"Todavía no seleccionaste jugadores."}</p></div>;
}
