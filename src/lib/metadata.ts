import type { Metadata } from "next";

export const SITE_URL = "https://caf-ingenieria.vercel.app";

export function metadataPagina(title: string, description: string, ruta?: string): Metadata {
  return {
    title,
    description,
    ...(ruta ? { alternates: { canonical: ruta } } : {}),
    openGraph: { title: `${title} · CAF`, description, siteName: "CAF · Ingeniería Fútbol 11", locale: "es_UY", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Plantel del CAF en 2026 junto al escudo de Ingeniería Fútbol 11" }], ...(ruta ? { url: ruta } : {}) },
    twitter: { card: "summary_large_image", title, description, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Plantel del CAF en 2026 junto al escudo de Ingeniería Fútbol 11" }] },
  };
}
