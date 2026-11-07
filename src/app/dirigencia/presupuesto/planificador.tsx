"use client";

import { useState } from "react";
import { calcularPresupuesto, pesos, SUPUESTOS_2027, type SupuestosTemporada } from "@/lib/presupuesto";

const CLAVE = "caf.presupuesto.2027";

type Campo = { k: keyof SupuestosTemporada; label: string; ayuda?: string; pesos?: boolean };
const GRUPOS: { titulo: string; campos: Campo[] }[] = [
  {
    titulo: "Partidos oficiales",
    campos: [
      { k: "partidos", label: "Partidos en el año", ayuda: "En 2026 fueron 16 (14 + cuartos)" },
      { k: "costoCanchaPartido", label: "Cancha por partido", pesos: true },
      { k: "costoJuezPartido", label: "Juez por partido", pesos: true },
    ],
  },
  {
    titulo: "Entrenamientos",
    campos: [
      { k: "entrenamientos", label: "Entrenamientos con cancha paga", ayuda: "ej. 1 por semana × 36 semanas" },
      { k: "costoCanchaEntrenamiento", label: "Cancha por entrenamiento", pesos: true },
    ],
  },
  {
    titulo: "Gastos fijos del año",
    campos: [
      { k: "inscripcion", label: "Inscripción a la Liga", pesos: true },
      { k: "indumentaria", label: "Indumentaria y material", pesos: true, ayuda: "camisetas, pelotas, botiquín" },
      { k: "otros", label: "Otros", pesos: true },
    ],
  },
  {
    titulo: "Cómo se cubre",
    campos: [
      { k: "jugadoresQuePagan", label: "Jugadores que pagan cuota" },
      { k: "mesesDeCuota", label: "Meses de cuota", ayuda: "mar–dic = 10" },
      { k: "ingresosExtra", label: "Beneficios estimados", pesos: true, ayuda: "rifas, fiestas, sponsors" },
      { k: "colchonPct", label: "Colchón de seguridad (%)" },
    ],
  },
];

function leerGuardado(): SupuestosTemporada {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(CLAVE) : null;
    return raw ? { ...SUPUESTOS_2027, ...JSON.parse(raw) } : SUPUESTOS_2027;
  } catch {
    return SUPUESTOS_2027;
  }
}

export function Planificador() {
  const [s, setS] = useState<SupuestosTemporada>(leerGuardado);
  const r = calcularPresupuesto(s);

  const cambiar = (k: keyof SupuestosTemporada, v: string) => {
    const n = Math.max(0, Number(v.replace(/[^\d]/g, "")) || 0);
    const nuevo = { ...s, [k]: n };
    setS(nuevo);
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(nuevo));
    } catch {
      /* navegador sin almacenamiento: igual funciona, solo no recuerda */
    }
  };

  const partes = [
    { label: "Partidos (cancha + juez)", v: r.costoPartidos },
    { label: "Entrenamientos", v: r.costoEntrenamientos },
    { label: "Fijos", v: r.costoFijo },
    { label: `Colchón ${s.colchonPct}%`, v: r.total - r.costoPartidos - r.costoEntrenamientos - r.costoFijo },
  ];
  const sinDatos = r.total === 0;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
      <form className="grid gap-6 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {GRUPOS.map((g) => (
          <fieldset key={g.titulo} className="rounded-xl border border-line bg-surface p-4">
            <legend className="px-1 font-display text-xl font-extrabold uppercase">{g.titulo}</legend>
            <div className="grid gap-3">
              {g.campos.map((c) => (
                <label key={c.k} className="grid gap-1 text-sm">
                  <span>{c.label}</span>
                  <div className="flex items-center rounded-md border border-line bg-bg focus-within:border-accent">
                    {c.pesos && <span className="pl-3 text-dim">$</span>}
                    <input
                      inputMode="numeric"
                      className="num w-full bg-transparent px-3 py-2 outline-none"
                      value={s[c.k] === 0 ? "" : String(s[c.k])}
                      placeholder="0"
                      onChange={(e) => cambiar(c.k, e.target.value)}
                    />
                  </div>
                  {c.ayuda && <span className="text-xs text-dim">{c.ayuda}</span>}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </form>

      <aside className="h-fit rounded-xl border border-accent/50 bg-surface p-5 lg:sticky lg:top-20" aria-live="polite">
        <div className="text-xs uppercase tracking-wider text-dim">Cuota necesaria por jugador</div>
        <div className="num mt-1 text-5xl font-semibold">
          {pesos(r.cuotaMensual)}
          <span className="text-lg text-dim"> /mes</span>
        </div>
        <div className="bastones-finos mt-4 h-1.5 rounded" aria-hidden />
        <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-dim">Costo del año</dt>
          <dd className="num text-right">{pesos(r.total)}</dd>
          <dt className="text-dim">A juntar por mes</dt>
          <dd className="num text-right">{pesos(r.porMes)}</dd>
          <dt className="text-dim">Cada partido sale</dt>
          <dd className="num text-right">{pesos(r.costoPorPartido)}</dd>
          <dt className="text-dim">Cubren las cuotas</dt>
          <dd className="num text-right">{pesos(r.aCubrirConCuotas)}</dd>
        </dl>
        {!sinDatos && (
          <div className="mt-5 grid gap-2">
            {partes.map((p) => (
              <div key={p.label}>
                <div className="flex justify-between text-xs text-dim">
                  <span>{p.label}</span>
                  <span className="num">{Math.round((p.v / r.total) * 100)}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded bg-surface-2">
                  <div className="h-1.5 rounded bg-accent" style={{ width: `${(p.v / r.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {sinDatos && <p className="mt-5 text-sm text-dim">Empezá cargando lo que cuesta la cancha y el juez por partido.</p>}
      </aside>
    </div>
  );
}
