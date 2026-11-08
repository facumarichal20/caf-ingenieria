import type { MetadataRoute } from "next";
import { ANIOS } from "@/lib/temporadas";
import { SITE_URL } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/historia", "/plantel", "/fixture", "/noticias", "/galeria", "/club", "/apoyos", ...ANIOS.map((a) => `/temporada/${a}`)].map((ruta) => ({
    url: SITE_URL + ruta, changeFrequency: "monthly", priority: ruta === "/" ? 1 : 0.7,
  }));
}
