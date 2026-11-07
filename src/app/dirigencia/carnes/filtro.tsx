"use client";

import clsx from "clsx";
import { useState } from "react";

const OPCIONES = [
  { id: "todos", label: "Todos" },
  { id: "vencido", label: "Vencidos" },
  { id: "por-vencer", label: "Vencen pronto" },
  { id: "ok", label: "Vigentes" },
] as const;

/** Filtra las filas de la tabla por data-estado sin volver a pedir datos. */
export function FiltroCarnes({ children }: { children: React.ReactNode }) {
  const [filtro, setFiltro] = useState<(typeof OPCIONES)[number]["id"]>("todos");
  return (
    <div data-filtro={filtro} className="filtro-carnes">
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
        {OPCIONES.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setFiltro(o.id)}
            aria-pressed={filtro === o.id}
            className={clsx(
              "rounded-full border px-3 py-1 text-sm",
              filtro === o.id ? "border-accent bg-accent text-tinta" : "border-line text-dim hover:text-text",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <style>{`
        .filtro-carnes[data-filtro="vencido"] tr[data-estado]:not([data-estado="vencido"]),
        .filtro-carnes[data-filtro="por-vencer"] tr[data-estado]:not([data-estado="por-vencer"]),
        .filtro-carnes[data-filtro="ok"] tr[data-estado]:not([data-estado="ok"]) { display: none; }
      `}</style>
      {children}
    </div>
  );
}
