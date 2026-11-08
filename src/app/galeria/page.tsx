import postales from "../../../data/postales.json";
import { CabeceraPagina, Seccion } from "@/components/stats-ui";
import { GaleriaPostales } from "@/components/galeria-postales";
import { metadataPagina } from "@/lib/metadata";
import type { Postal } from "@/lib/postales";

export const metadata = metadataPagina("Postales", "Postales del CAF por partido y temporada.", "/galeria");

export default function Galeria() {
  return (
    <>
      <CabeceraPagina titulo="Postales" descripcion="Fotos por partido y temporada." />
      <Seccion titulo="Galería">
        <GaleriaPostales postales={postales as Postal[]} />
      </Seccion>
    </>
  );
}