import Link from "next/link";
import { BadgeCheck, Calculator, Camera, HeartPulse, PiggyBank, Users } from "lucide-react";

export const metadata = { title: "Dirigencia" };

const MODULOS = [
  { href: "/dirigencia/carnes", icon: HeartPulse, titulo: "Fichajes y carné de salud", texto: "Quién está habilitado, qué carné vence y cuándo.", listo: true },
  { href: "/dirigencia/presupuesto", icon: Calculator, titulo: "Planificador 2027", texto: "Canchas, jueces y gastos fijos: cuánto hay que juntar por mes y la cuota necesaria.", listo: true },
  { href: "#", icon: PiggyBank, titulo: "Finanzas y cuotas", texto: "Caja, ingresos y egresos, quién pagó cada mes.", listo: false },
  { href: "#", icon: BadgeCheck, titulo: "Beneficios", texto: "Rifas, fiestas y sponsors con meta y avance.", listo: false },
  { href: "#", icon: Camera, titulo: "Placas para Instagram", texto: "Resultado, convocatoria, goleador y cumpleaños, listas para subir.", listo: false },
  { href: "#", icon: Users, titulo: "Usuarios y roles", texto: "Quién es jugador, DT o dirigente.", listo: false },
];

export default function Dirigencia() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <div className="text-xs uppercase tracking-[0.25em] text-accent">Acceso restringido</div>
      <h1 className="font-display text-6xl font-black uppercase leading-none">Dirigencia</h1>
      <p className="mt-3 max-w-2xl text-dim">
        Todavía no hay login: cuando se conecte Supabase, esta sección va a pedir cuenta con rol de dirigente. Hasta entonces, los datos
        reales solo se ven en tu PC y en el sitio publicado aparecen datos de ejemplo.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MODULOS.map(({ href, icon: Icon, titulo, texto, listo }) => {
          const card = (
            <div className={`h-full rounded-xl border border-line bg-surface p-5 ${listo ? "transition hover:border-accent/60" : "opacity-60"}`}>
              <Icon className="h-6 w-6 text-accent" aria-hidden />
              <div className="mt-3 font-display text-2xl font-extrabold uppercase leading-tight">{titulo}</div>
              <p className="mt-1 text-sm text-dim">{texto}</p>
              {!listo && <div className="mt-3 text-xs uppercase tracking-wider text-dim">Próximamente</div>}
            </div>
          );
          return listo ? (
            <Link key={titulo} href={href}>
              {card}
            </Link>
          ) : (
            <div key={titulo}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
