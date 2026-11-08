import Image from "next/image";
import { CabeceraPagina, Seccion } from "@/components/stats-ui";
import { metadataPagina } from "@/lib/metadata";

export const metadata = metadataPagina("El club", "Quiénes somos, el cuerpo técnico y la Facultad que representa Ingeniería Fútbol 11.", "/club");

const CUERPO_TECNICO = [
  { nombre: "Rodrigo “Tero” Silveira", cargo: "Director técnico" },
  { nombre: "Ignacio Medina", cargo: "Ayudante técnico" },
];

export default function Club() {
  return (
    <>
      <CabeceraPagina titulo="El club" descripcion="Ingeniería Fútbol 11 · Rosado y negro desde 2010." />

      <Seccion titulo="Quiénes somos">
        <div className="grid items-center gap-6 sm:grid-cols-[180px_1fr]">
          <Image src="/brand/escudo.png" alt="Escudo del CAF: bastones negros y rosados y la Facultad de Ingeniería" width={150} height={180} className="w-[150px]" style={{ height: "auto" }} />
          <div className="max-w-2xl space-y-4">
            <p className="text-lg">
              Las iniciales <strong className="text-accent">CAF</strong> son de <strong>Club Absurdo de Fútbol</strong>.
            </p>
            <p>
              Representamos a la Facultad de Ingeniería en la Liga Interfacultades de la Udelar. Con dos Copas de Plata en la vitrina, año a año buscamos engranajes para formar nuestro plantel.
            </p>
          </div>
        </div>
      </Seccion>

      <Seccion titulo="Cuerpo técnico">
        <ul className="grid gap-3 sm:grid-cols-2">
          {CUERPO_TECNICO.map((p) => (
            <li key={p.nombre} className="rounded-xl border border-line bg-surface p-5">
              <div className="text-xs uppercase tracking-wider text-dim">{p.cargo}</div>
              <div className="mt-1 font-display text-2xl font-extrabold uppercase">{p.nombre}</div>
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion titulo="La Facultad">
        <div className="max-w-2xl space-y-4">
          <p>
            Jugamos por la Facultad de Ingeniería de la Udelar, en el Parque Rodó, frente a la rambla de Montevideo. Representamos a toda la comunidad FIng: queremos integrar a estudiantes, egresados y a todos los que forman parte de la Facultad.
          </p>
          <p className="text-dim">Av. Julio Herrera y Reissig 565, Montevideo.</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a className="text-accent hover:underline" href="https://www.fing.edu.uy/" target="_blank" rel="noopener noreferrer">fing.edu.uy</a>
            <a className="text-accent hover:underline" href="https://www.instagram.com/fingudelar/" target="_blank" rel="noopener noreferrer">@fingudelar</a>
          </div>
        </div>
      </Seccion>

      <Seccion titulo="Sumate al CAF">
        <p>¿Estudiás en Ingeniería y querés jugar? Escribinos por Instagram para conocer los entrenamientos y cómo sumarte.</p>
        <a href="https://www.instagram.com/ingenieriafutbol_11/" className="boton mt-4">Contactar al CAF</a>
      </Seccion>
    </>
  );
}
