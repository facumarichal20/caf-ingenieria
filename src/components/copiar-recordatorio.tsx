"use client";
import { useState } from "react";
export function CopiarRecordatorio({texto}:{texto:string}) {
 const [estado,setEstado]=useState("");
 return <><button className="boton" onClick={async()=>{try{await navigator.clipboard.writeText(texto);setEstado("Recordatorio copiado");}catch{setEstado("No se pudo copiar. Seleccioná el texto de abajo.");}}}>Copiar recordatorio para WhatsApp</button><p role="status" className="mt-2 text-sm">{estado}</p><p className="mt-2 text-sm text-dim">{texto}</p></>;
}
