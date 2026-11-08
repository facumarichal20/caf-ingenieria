import Link from "next/link";
import { CabeceraPagina } from "@/components/stats-ui";

export default function NoEncontrada() {
  return <><CabeceraPagina kicker="404 · Fuera de la cancha" titulo="No encontramos esa página" descripcion="El enlace puede haber cambiado. Volvé al inicio para seguir con el CAF." /><div className="mx-auto mt-8 max-w-6xl px-4"><Link href="/" className="boton">Volver al inicio</Link></div></>;
}
