import { Seccion, AvisoVacio } from "@/components/stats-ui";
import { leerGoleadores } from "@/lib/goleadores";

export async function Goleadores() {
  const { filas, historico } = await leerGoleadores();
  return (
    <>
      <Seccion titulo="Goleadores por año">
        {filas.length ? (
          <ul className="space-y-3">
            {filas.map((f, i) => (
              <li key={i} className="rounded-xl border border-line p-4">
                {f.anio} · {f.jugador} · {f.goles} gol(es)
                {f.asistencias !== null && ` · ${f.asistencias} asistencias`}
              </li>
            ))}
          </ul>
        ) : <AvisoVacio>Todavía no hay goles individuales verificados.</AvisoVacio>}
      </Seccion>
      {historico.length > 0 && (
        <Seccion titulo="Goleadores históricos">
          <ol className="space-y-3">
            {historico.map(([j, g]) => (
              <li key={j} className="flex justify-between border-b border-line py-3"><span>{j}</span><span className="num">{g}</span></li>
            ))}
          </ol>
        </Seccion>
      )}
    </>
  );
}
