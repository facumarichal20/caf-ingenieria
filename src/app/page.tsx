import { Redes } from "@/components/redes";
import { metadataPagina } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import { CuentaRegresiva } from "@/components/cuenta-regresiva";
import { LineaDeTiempo, Palmares } from "@/components/historia";
import { FormaStrip, Seccion, StatTile, TablaPosiciones } from "@/components/stats-ui";
import { partidosDe, resumen } from "@/lib/stats";
import { INICIO_2027, TEMPORADAS } from "@/lib/temporadas";

export const metadata = metadataPagina("Inicio", "El CAF: resultados de Ingeniería Fútbol 11, historia y preparación de la próxima temporada.", "/");

export default function Inicio() {
  const t = TEMPORADAS[2026];
  const todos = partidosDe(t, t.equipo);
  const r = resumen(todos);
  const oficial = t.tabla.find((f) => f.equipo === t.equipo)!;
  const mundial = t.etapas.find((e) => e.etapa === "mundial");
  const playoffs = t.etapas.find((e) => e.etapa === "playoffs");

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="bastones corte-diagonal absolute inset-y-0 right-0 hidden w-[42%] opacity-90 md:block" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-accent">Liga Interfacultades · Temporada 2027</div>
            <h1 className="mt-3 font-display text-6xl font-black uppercase leading-[0.85] sm:text-8xl">
              Rumbo
              <br />a 2027
            </h1>
            <p className="mt-5 max-w-md text-dim">
              El 2026 terminó en {t.resumen.charAt(0).toLowerCase() + t.resumen.slice(1)}. Todo lo que pasó, en números, y lo que hay que preparar para el
              arranque.
            </p>
            <div className="mt-7">
              <CuentaRegresiva hasta={INICIO_2027} />
              <div className="mt-2 text-xs text-dim">Hasta la primera fecha (estimada: 20/03/2027, se ajusta cuando salga el fixture)</div>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="rounded-full bg-bg p-6">
              <Image src="/brand/escudo-estrellas.png" alt="Escudo del CAF" width={260} height={260} priority className="h-auto w-40 drop-shadow-2xl sm:w-[260px]" />
            </div>
          </div>
        </div>
      </section>
      <Seccion kicker="Temporada 2026" titulo="El año en números" accion={<Link className="text-sm text-accent hover:underline" href="/temporada/2026">Ver todo →</Link>}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile destacado label="Fase regular" value={`${oficial.pos}°`} sub={`de ${t.tabla.length} · ${oficial.pts} pts`} />
          {mundial && <StatTile label="Mundialito" value={mundial.titulo.split(" · ")[0].replace(".º", "°")} sub={`${mundial.titulo.split(" · ")[1]} · ${mundial.detalle}`} />}
          <StatTile label="Playoffs" value="4tos" sub={playoffs?.detalle?.replace("MEDICINA", "Medicina")} />
          <StatTile label="Partidos" value={r.pj} sub={`${r.g}G ${r.e}E ${r.p}P`} />
          <StatTile label="Goles" value={`${r.gf}–${r.gc}`} sub="a favor – en contra" />
          <StatTile label="Efectividad" value={`${r.efectividad}%`} sub="de los puntos en juego" />
        </div>
        <p className="mt-3 text-sm text-dim">
          {r.vallasInvictas} vallas invictas · mejor racha: {r.mejorRacha} partidos sin perder
        </p>
        <div className="regla mt-6" aria-hidden />
        <h3 className="mb-3 mt-6 text-sm uppercase tracking-wider text-dim">
          Partido a partido · F = fase regular · MO = Mundial Oro · CO = Copa Oro
        </h3>
        <FormaStrip partidos={todos} />
      </Seccion>
      <Seccion kicker="Desde 2017" titulo="Historia del CAF">
        <Palmares />
        <div className="mt-6">
          <LineaDeTiempo />
        </div>
        <p className="mt-2 text-xs text-dim">
          Datos de la planilla oficial (2026) y de las placas de @ligainterfacultadesoficial y @ingenieriafutbol_11. Los años anteriores todavía tienen huecos.
        </p>
      </Seccion>
      <Seccion kicker="Fase regular 2026" titulo="Tabla final">
        <TablaPosiciones filas={t.tabla} resaltar={t.equipo} compacta />
      </Seccion>
      <Seccion titulo="Seguinos" kicker="El CAF en redes"><Redes /></Seccion>
    </>
  );
}
