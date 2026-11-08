import { metadataPagina } from "@/lib/metadata";
import { PlanificadorCliente } from "./sin-ssr";

export const metadata = { ...metadataPagina("Planificador 2027", "Presupuesto de canchas, jueces y cuota del CAF para 2027.", ""), robots: { index: false, follow: false } };

export default function Presupuesto() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <div className="text-xs uppercase tracking-[0.25em] text-accent">Dirigencia</div>
      <h1 className="font-display text-5xl font-black uppercase leading-none sm:text-6xl">Planificador 2027</h1>
      <p className="mt-3 max-w-2xl text-dim">
        Cargá lo que cuesta cada cosa y te dice cuánto sale el año, cuánto hay que juntar por mes y la cuota necesaria por jugador.
        Los números se guardan en este navegador. Cuando se conecte Supabase, se van a compartir con toda la dirigencia.
      </p>
      <PlanificadorCliente />
    </div>
  );
}
