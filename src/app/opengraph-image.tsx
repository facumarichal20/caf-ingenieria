import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import postales from "../../data/postales.json";

export const alt = "Plantel del CAF en 2026 junto al escudo de Ingeniería Fútbol 11";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ImagenCompartir() {
  const postal = postales.find((item) => item.anio === 2026)?.fotos[0];
  const escudo = await readFile(path.join(process.cwd(), "public", "brand", "escudo.png"));
  const foto = postal ? await readFile(path.join(process.cwd(), "public", postal.archivo.replace(/^\/+/, ""))) : null;
  const fotoPng = foto ? await sharp(foto).resize(508, 586, { fit: "cover" }).png({ compressionLevel: 8 }).toBuffer() : null;
  const fotoData = fotoPng ? `data:image/png;base64,${fotoPng.toString("base64")}` : null;

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#100808", color: "#f7f3f2", borderBottom: "20px solid #f8c0c4" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "54%", padding: 54 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/png;base64,${escudo.toString("base64")}`} width={118} height={140} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 24, color: "#f8c0c4", letterSpacing: 3 }}>LIGA INTERFACULTADES</div>
            <div style={{ fontSize: 98, fontWeight: 900, lineHeight: 1 }}>CAF</div>
            <div style={{ fontSize: 32 }}>Ingeniería Fútbol 11</div>
          </div>
        </div>
        <div style={{ display: "flex", width: 92, height: 7, marginTop: 42, background: "#f8c0c4" }} />
        <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontSize: 27, lineHeight: 1.35 }}>
          <span>Selección de fútbol</span>
          <span>de la Facultad de Ingeniería · Udelar</span>
        </div>
      </div>
      <div style={{ display: "flex", width: "46%", padding: 22 }}>
        {fotoData && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fotoData} width={508} height={586} alt="" style={{ width: 508, height: 586, objectFit: "cover", borderRadius: 12 }} />
        )}
      </div>
    </div>,
    size,
  );
}
