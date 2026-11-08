import { metadataPagina } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import { CuentaRegresiva } from "@/components/cuenta-regresiva";
import { Palmares } from "@/components/historia";
import { FormaStrip, Seccion, StatTile } from "@/components/stats-ui";
import { partidosDe, resumen } from "@/lib/stats";
import { INICIO_2027, TEMPORADAS } from "@/lib/temporadas";
import club from "../../data/club.json";

export const metadata = metadataPagina("Inicio", "CAF · Fútbol de Ingeniería, Liga Interfacultades.", "/");

export default function Inicio() {
  const t = TEMPORADAS[2026];
  const todos = partidosDe(t, t.equipo);
  const r = resumen(todos);
  const oficial = t.tabla.find((f) => f.equipo === t.equipo)!;
  const mundial = t.etapas.find((e) => e.etapa === "mundial");
  const playoffs = t.etapas.find((e) => e.etapa === "playoffs");
  const datosEntrenamiento = [
    ["Días", club.entrenamientos.dias],
    ["Horario", club.entrenamientos.horario],
    ["Lugar", club.entrenamientos.lugar],
  ].filter(([, valor]) => valor.trim().length > 0);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="bastones corte-diagonal absolute inset-y-0 right-0 hidden w-[42%] opacity-90 md:block" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:py-16 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">CAF · Selección de fútbol de la Facultad de Ingeniería, Udelar</p>
            <h1 className="mt-3 font-display text-6xl font-black uppercase leading-[0.85] sm:text-8xl">Temporada<br />2027</h1>
            <p className="mt-5 max-w-xl text-lg">
              Representando a <a className="text-accent hover:underline" href="https://www.instagram.com/fingudelar/" target="_blank" rel="noreferrer">@fingudelar</a> en la <a className="text-accent hover:underline" href="https://www.instagram.com/ligainterfacultadesoficial/" target="_blank" rel="noreferrer">@ligainterfacultadesoficial</a> desde 2010.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Link href="#sumate" className="boton">Quiero jugar</Link>
              <CuentaRegresiva hasta={INICIO_2027} />
            </div>
          </div>
          <div className="relative flex items-center justify-center md:justify-end">
            <Image src="/brand/escudo-estrellas.png" alt="Escudo del CAF" width={260} height={260} priority className="h-auto w-48 sm:w-64" />
          </div>
        </div>
      </section>

      <Seccion kicker="CAF" titulo="Palmarés"><Palmares soloTitulos /></Seccion>

      <Seccion kicker="2026" titulo="La última temporada" accion={<Link className="text-sm text-accent hover:underline" href="/temporada/2026">Temporada completa</Link>}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile destacado label="Fase regular" value={oficial.pos + "°"} sub={t.tabla.length + " equipos · " + oficial.pts + " pts"} />
          {mundial && <StatTile label="Mundialito" value={mundial.titulo.split(" · ")[0].replace(".º", "°")} sub={[mundial.titulo.split(" · ")[1], mundial.detalle].filter(Boolean).join(" · ")} />}
          {playoffs && <StatTile label="Playoffs" value={playoffs.titulo} sub={playoffs.detalle} />}
          <StatTile label="Partidos" value={r.pj} sub={r.g + "G " + r.e + "E " + r.p + "P"} />
          <StatTile label="Goles" value={r.gf + "–" + r.gc} sub="a favor – en contra" />
          <StatTile label="Efectividad" value={r.efectividad + "%"} sub="de los puntos en juego" />
        </div>
        <div className="mt-6"><FormaStrip partidos={todos} /></div>
      </Seccion>

      <section id="sumate" className="mx-auto mt-12 max-w-6xl scroll-mt-24 px-4 sm:mt-16">
        <div className="relative overflow-hidden border border-accent/50 bg-surface p-6 sm:p-10">
          <div className="bastones-finos absolute inset-x-0 top-0 h-1" aria-hidden="true" />
          <p className="text-xs uppercase tracking-[0.2em] text-accent">CAF · 2027</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-black uppercase leading-none sm:text-6xl">Temporada 2027: armamos el plantel</h2>
          <div className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
            <div><h3 className="text-sm uppercase tracking-wider text-dim">¿Quién puede jugar?</h3><p className="mt-2">Estudiantes de la Facultad de Ingeniería, Udelar.</p></div>
            <div><h3 className="text-sm uppercase tracking-wider text-dim">Qué necesitás</h3><p className="mt-2">Ganas de comprometerte con el equipo y escribirnos por Instagram.</p></div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-dim">Entrenamientos</h3>
              {datosEntrenamiento.length > 0 ? (
                <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                  {datosEntrenamiento.map(([label, valor]) => <div key={label}><dt className="text-xs uppercase text-dim">{label}</dt><dd className="mt-1 font-semibold">{valor}</dd></div>)}
                </dl>
              ) : (
                <p className="mt-3 text-dim">Se anuncian al inicio de la temporada 2027, seguinos en Instagram</p>
              )}
            </div>
            <a className="boton w-full sm:w-auto" href="https://www.instagram.com/ingenieriafutbol_11/" target="_blank" rel="noreferrer">Escribinos por Instagram</a>
          </div>
        </div>
      </section>
    </>
  );
}
