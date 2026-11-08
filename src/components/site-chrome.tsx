import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { SocialLinks } from "@/components/social-links";

const NAV_PRINCIPAL = [
  { href: "/", label: "Inicio" },
  { href: "/temporada/2026", label: "Temporadas" },
  { href: "/historia", label: "Historia" },
  { href: "/fixture", label: "Fixture" },
  { href: "/galeria", label: "Galería" },
  { href: "/#sumate", label: "Sumate" },
];

const NAV_MAS = [
  { href: "/plantel", label: "Plantel" },
  { href: "/noticias", label: "Noticias" },
  { href: "/club", label: "El club" },
  { href: "/apoyos", label: "Apoyos" },
  { href: "/mi-equipo", label: "Mi equipo" },
  { href: "/dirigencia", label: "Dirigencia" },
];

function EnlacesPrincipales() {
  return NAV_PRINCIPAL.map((item) => (
    <Link key={item.href} href={item.href} className={item.label === "Sumate" ? "boton min-h-10 px-3 py-2" : "rounded px-2.5 py-2 text-dim hover:bg-surface hover:text-text"}>
      {item.label}
    </Link>
  ));
}

function EnlacesMas() {
  return NAV_MAS.map((item) => <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-dim hover:bg-surface hover:text-text">{item.label}</Link>);
}

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-line bg-bg">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5" aria-label="CAF, inicio">
          <Image src="/brand/escudo.png" alt="" width={30} height={35} priority className="w-[30px]" style={{ height: "auto" }} />
          <span className="font-display text-2xl font-black uppercase leading-none tracking-wide">CAF <span className="hidden font-semibold text-dim sm:inline">· Ingeniería F11</span></span>
        </Link>
        <nav aria-label="Navegación principal" className="hidden items-center gap-1 text-sm md:flex">
          <EnlacesPrincipales />
          <details className="menu-mas relative">
            <summary className="flex min-h-10 cursor-pointer list-none items-center gap-1 rounded px-2.5 py-2 text-dim hover:bg-surface hover:text-text">Más <ChevronDown size={15} aria-hidden="true" /></summary>
            <div className="absolute right-0 top-full z-30 mt-2 min-w-44 border border-line bg-bg py-1 shadow-lg"><EnlacesMas /></div>
          </details>
        </nav>
        <details className="menu-movil relative md:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center border border-line text-text" aria-label="Menú">
            <Menu size={24} aria-hidden="true" />
          </summary>
          <nav aria-label="Menú móvil" className="absolute right-0 top-full z-30 mt-2 max-h-[80dvh] w-64 overflow-y-auto border border-line bg-bg py-2 shadow-lg">
            <div className="grid gap-1 px-2"><EnlacesPrincipales /></div>
            <div className="my-2 border-t border-line" />
            <EnlacesMas />
          </nav>
        </details>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pb-3">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-dim">Seguinos</span>
        <SocialLinks />
      </div>
      <div className="bastones-finos h-1" aria-hidden="true" />
    </header>
  );
}

export function SiteFooter() {
  return (
    <>
      <footer className="mt-20 border-t border-line pb-16 md:pb-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 text-sm text-dim">
          <span>Ingeniería Fútbol 11 · Liga Interfacultades UdelaR</span>
          <span>Representando a <a className="hover:text-text" href="https://www.instagram.com/fingudelar/" target="_blank" rel="noreferrer">@fingudelar</a> en la <a className="hover:text-text" href="https://www.instagram.com/ligainterfacultadesoficial/" target="_blank" rel="noreferrer">@ligainterfacultadesoficial</a> desde 2010.</span>
          </div>
          <SocialLinks />
        </div>
      </footer>
      <Link href="/#sumate" className="fixed inset-x-3 bottom-3 z-40 flex min-h-12 items-center justify-center border border-tinta bg-accent px-4 font-semibold text-tinta shadow-lg md:hidden">Sumate</Link>
    </>
  );
}
