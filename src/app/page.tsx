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
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-8 sm:gap-10 sm:py-12 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:px-8 md:py-14 lg:gap-16 lg:px-12">
          <div className="order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">CAF · Selección de fútbol de la Facultad de Ingeniería, Udelar</p>
            <h1 className="mt-4 font-display text-6xl font-black uppercase leading-[0.82] tracking-tight sm:text-8xl md:text-[clamp(3.5rem,8vw,7.5rem)]">Temporada<br />2027</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-dim sm:text-lg">
              Representando a <a className="text-accent hover:underline" href="https://www.instagram.com/fingudelar/" target="_blank" rel="noreferrer">@fingudelar</a> en la <a className="text-accent hover:underline" href="https://www.instagram.com/ligainterfacultadesoficial/" target="_blank" rel="noreferrer">@ligainterfacultadesoficial</a> desde 2010.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4 sm:gap-6">
              <Link href="#sumate" className="boton min-h-12 px-6">Quiero jugar</Link>
              <CuentaRegresiva hasta={INICIO_2027} />
            </div>
          </div>
          <figure className="relative order-2 m-0 aspect-[4/3] overflow-hidden bg-surface md:aspect-[1.3]">
            <Image
              src="/postales/2026/Liga Interfacultades/WhatsApp_Image_2026-11-08_at_11.21.12_AM.webp"
              alt="Plantel del CAF en una cancha, junto a su bandera (2026)"
              width={1600}
              height={1200}
              priority
              sizes="(max-width: 767px) 100vw, 58vw"
              className="h-full w-full object-cover object-[center_58%]"
            />
            <figcaption className="absolute bottom-3 left-3 border-l-2 border-accent bg-bg/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-text sm:bottom-5 sm:left-5">Plantel · 2026</figcaption>
          </figure>
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
