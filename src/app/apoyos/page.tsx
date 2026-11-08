import Image from "next/image";
import { CabeceraPagina, Seccion, AvisoVacio } from "@/components/stats-ui";
import { metadataPagina } from "@/lib/metadata";
import sponsors from "../../../data/club/sponsors.json";

export const metadata = metadataPagina("Apoyos", "Sponsors y formas de apoyar al CAF.", "/apoyos");

type Sponsor = { nombre: string; logo: string; url: string };

function TarjetaSponsor({ s }: { s: Sponsor }) {
  const contenido = (
    <>
      <Image src={s.logo} alt={`Logo de ${s.nombre}`} width={160} height={160} className="h-32 w-32 object-contain sm:h-40 sm:w-40" />
      <span className="font-display text-xl font-extrabold uppercase">{s.nombre}</span>
    </>
  );
  const clase = "flex flex-col items-center gap-3 rounded-xl border border-line bg-surface p-6 text-center";
  return s.url ? (
    <a href={s.url} target="_blank" rel="noopener noreferrer" className={`${clase} transition-colors hover:border-accent`}>{contenido}</a>
  ) : (
    <div className={clase}>{contenido}</div>
  );
}

export default function Apoyos() {
  const lista = sponsors as Sponsor[];
  return (
    <>
      <CabeceraPagina titulo="Apoyos" descripcion="El club se sostiene con el esfuerzo del plantel y de quienes nos acompañan." />
      <Seccion titulo="Sponsors">
        {lista.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((s) => <li key={s.nombre}><TarjetaSponsor s={s} /></li>)}
          </ul>
        ) : (
          <AvisoVacio>Próximamente publicaremos los apoyos confirmados para la temporada.</AvisoVacio>
        )}
      </Seccion>
      <Seccion titulo="¿Querés apoyar al CAF?">
        <p>Podés colaborar con indumentaria, materiales o los gastos de la temporada.</p>
        <a className="boton mt-4" href="https://www.instagram.com/ingenieriafutbol_11/">Hablemos por Instagram</a>
      </Seccion>
    </>
  );
}
