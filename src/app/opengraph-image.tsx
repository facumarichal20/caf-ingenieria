import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "CAF · Ingeniería Fútbol 11 · Liga Interfacultades";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ImagenCompartir() {
  const escudo = await readFile(path.join(process.cwd(), "public/brand/escudo.png"));
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#0e0b0b", color: "#f7f3f2", padding: 70, alignItems: "center", gap: 70, borderBottom: "24px solid #f4c6c4" }}>
      {/* El renderizador de Open Graph requiere img y una URL de datos. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/png;base64,${escudo.toString("base64")}`} width={240} height={280} alt="" />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 28, color: "#f4c6c4" }}>LIGA INTERFACULTADES</div>
        <div style={{ fontSize: 110, fontWeight: 900 }}>CAF</div>
        <div style={{ fontSize: 44 }}>Ingeniería Fútbol 11</div>
        <div style={{ fontSize: 24, color: "#d9d4d2" }}>Historia · Plantel · Resultados</div>
      </div>
    </div>, size);
}
