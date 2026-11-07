"use client";

import dynamic from "next/dynamic";

// El planificador lee lo guardado en el navegador: se renderiza solo en el cliente
// para que el valor inicial no difiera entre servidor y navegador.
export const PlanificadorCliente = dynamic(() => import("./planificador").then((m) => m.Planificador), {
  ssr: false,
  loading: () => <div className="mt-8 h-96 animate-pulse rounded-xl border border-line bg-surface" />,
});
