"use client";

import { useSyncExternalStore } from "react";

// Reloj compartido: un tick por segundo. En el servidor devuelve null (se muestran "--").
function suscribir(cb: () => void) {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
}
const leerAhora = () => Math.floor(Date.now() / 1000) * 1000;
const leerServidor = () => null;

function partes(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { dias: Math.floor(s / 86400), horas: Math.floor((s % 86400) / 3600), min: Math.floor((s % 3600) / 60), seg: s % 60 };
}

export function CuentaRegresiva({ hasta }: { hasta: string }) {
  const objetivo = new Date(hasta).getTime();
  const ahora = useSyncExternalStore<number | null>(suscribir, leerAhora, leerServidor);
  const p = partes(ahora === null ? 0 : objetivo - ahora);
  const celdas: [string, number][] = [
    ["días", p.dias],
    ["horas", p.horas],
    ["min", p.min],
    ["seg", p.seg],
  ];
  return (
    <div className="flex gap-2" aria-live="off" suppressHydrationWarning>
      {celdas.map(([l, v]) => (
        <div key={l} className="min-w-16 rounded-lg border border-line bg-surface px-3 py-2 text-center">
          <div className="num text-3xl font-semibold leading-none sm:text-4xl">{ahora === null ? "--" : String(v).padStart(2, "0")}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-dim">{l}</div>
        </div>
      ))}
    </div>
  );
}
