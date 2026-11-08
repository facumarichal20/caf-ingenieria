import type { Metadata, Viewport } from "next";
import { Big_Shoulders, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

const display = Big_Shoulders({ variable: "--font-big-shoulders", subsets: ["latin"], weight: ["600", "800", "900"] });
const sans = IBM_Plex_Sans({ variable: "--font-plex-sans", subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://caf-ingenieria.vercel.app"),
  title: { default: "CAF · Ingeniería Fútbol 11", template: "%s · CAF" },
  description: "Estadísticas, temporada y gestión del cuadro de fútbol 11 de la Facultad de Ingeniería en la Liga Interfacultades.",
  icons: { icon: "/brand/escudo.png" },
};

export const viewport: Viewport = { themeColor: "#0e0b0b" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-UY">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} min-h-dvh flex flex-col`}>
        <a href="#contenido" className="salto-contenido">Saltar al contenido</a>
        <SiteHeader />
        <main id="contenido" className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
