"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AvisoVacio } from "@/components/stats-ui";
import type { FotoPostal, Postal } from "@/lib/postales";

export function GaleriaPostales({ postales }: { postales: Postal[] }) {
  const anios = useMemo(() => [...new Set(postales.map((postal) => postal.anio))].sort((a, b) => b - a), [postales]);
  const [anio, setAnio] = useState("todos");
  const [seleccion, setSeleccion] = useState<{ postal: Postal; indice: number } | null>(null);
  const visibles = (anio === "todos" ? postales : postales.filter((postal) => postal.anio === Number(anio))).filter((postal) => postal.fotos.length > 0);
  const fotosPostal = seleccion?.postal.fotos ?? [];

  const mover = useCallback((direccion: number) => {
    setSeleccion((actual) => {
      if (!actual || actual.postal.fotos.length < 2) return actual;
      const indice = (actual.indice + direccion + actual.postal.fotos.length) % actual.postal.fotos.length;
      return { ...actual, indice };
    });
  }, []);

  useEffect(() => {
    if (!seleccion) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSeleccion(null);
      if (event.key === "ArrowLeft") mover(-1);
      if (event.key === "ArrowRight") mover(1);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [seleccion, mover]);

  if (postales.length === 0 || visibles.length === 0) return <AvisoVacio>Postales próximamente</AvisoVacio>;

  return (
    <div>
      <label className="mb-5 flex max-w-xs flex-col gap-2 text-sm text-dim">
        Año
        <select value={anio} onChange={(event) => setAnio(event.target.value)} aria-label="Filtrar postales por año">
          <option value="todos">Todos los años</option>
          {anios.map((valor) => <option key={valor} value={valor}>{valor}</option>)}
        </select>
      </label>
      {visibles.length === 0 ? <AvisoVacio>Postales próximamente</AvisoVacio> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((postal) => {
            const portada = postal.fotos[0];
            if (!portada) return null;
            return (
              <button key={postal.id} type="button" onClick={() => setSeleccion({ postal, indice: 0 })}
                className="group overflow-hidden border border-line bg-surface text-left transition hover:border-accent focus-visible:outline-offset-4"
                aria-label={`Abrir postales${postal.rival ? ` vs ${postal.rival}` : ""}, ${postal.anio}`}>
                <Image src={portada.miniatura} alt={portada.alt} width={portada.ancho} height={portada.alto} loading="lazy" className="aspect-[4/3] h-auto w-full object-cover transition group-hover:scale-[1.02]" />
                <span className="block p-4">
                  <span className="block font-display text-2xl font-bold uppercase">{postal.rival ? `vs ${postal.rival}` : postal.competencia ?? postal.anio}</span>
                  <span className="mt-1 block text-xs text-dim">{postal.fecha ?? postal.anio}{postal.competencia ? ` · ${postal.competencia}` : ""}</span>
                  {postal.golesCAF !== null && postal.golesRival !== null && <span className="marcador mt-3 block text-4xl">{postal.golesCAF}–{postal.golesRival}</span>}
                  <span className="mt-3 block text-xs uppercase tracking-wider text-accent">{postal.fotos.length} {postal.fotos.length === 1 ? "foto" : "fotos"}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
      {seleccion && <Lightbox postal={seleccion.postal} foto={fotosPostal[seleccion.indice]} onCerrar={() => setSeleccion(null)} onMover={mover} puedeNavegar={fotosPostal.length > 1} />}
    </div>
  );
}

function Lightbox({ postal, foto, onCerrar, onMover, puedeNavegar }: { postal: Postal; foto: FotoPostal; onCerrar: () => void; onMover: (direccion: number) => void; puedeNavegar: boolean }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" aria-label={foto.alt} onMouseDown={(event) => { if (event.target === event.currentTarget) onCerrar(); }}>
      <button type="button" onClick={onCerrar} className="absolute right-3 top-3 rounded-full border border-white/30 p-3 text-white" aria-label="Cerrar"><X /></button>
      {puedeNavegar && <>
        <button type="button" onClick={() => onMover(-1)} className="absolute left-2 rounded-full border border-white/30 p-3 text-white sm:left-6" aria-label="Postal anterior"><ChevronLeft /></button>
        <button type="button" onClick={() => onMover(1)} className="absolute right-2 rounded-full border border-white/30 p-3 text-white sm:right-6" aria-label="Postal siguiente"><ChevronRight /></button>
      </>}
      <figure className="flex max-h-full max-w-6xl flex-col items-center">
        <Image src={foto.archivo} alt={foto.alt} width={foto.ancho} height={foto.alto} className="max-h-[78vh] w-auto max-w-full object-contain" sizes="100vw" priority />
        <figcaption className="mt-3 text-center text-sm text-white">{foto.alt}{postal.golesCAF !== null && postal.golesRival !== null ? ` · ${postal.golesCAF}–${postal.golesRival}` : ""}</figcaption>
      </figure>
    </div>
  );
}