import Image from "next/image";
import Link from "next/link";

const NAV = [
  { href: "/", label: "Inicio", corto: "Inicio" },
  { href: "/temporada/2026", label: "Temporadas", corto: "Temporadas" },
  { href: "/historia", label: "Historia", corto: "Historia" },
  { href: "/plantel", label: "Plantel", corto: "Plantel" },
  { href: "/fixture", label: "Fixture 2027", corto: "Fixture" },
  { href: "/noticias", label: "Noticias", corto: "Noticias" },
  { href: "/galeria", label: "Galería", corto: "Galería" },
  { href: "/club", label: "El club", corto: "El club" },
  { href: "/apoyos", label: "Apoyos", corto: "Apoyos" },
  { href: "/mi-equipo", label: "Mi equipo", corto: "Mi equipo" },
  { href: "/dirigencia", label: "Dirigencia", corto: "Dirigencia" },
];

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5" aria-label="CAF, inicio">
          <Image src="/brand/escudo.png" alt="" width={30} height={35} priority className="w-[30px]" style={{ height: "auto" }} />
          <span className="font-display text-2xl font-black uppercase leading-none tracking-wide">
            CAF <span className="hidden font-semibold text-dim sm:inline">· Ingeniería F11</span>
          </span>
        </Link>
        <nav aria-label="Navegación principal" className="flex w-full flex-wrap gap-1 text-sm sm:ml-auto sm:w-auto">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-md px-2.5 py-1.5 text-dim hover:bg-surface hover:text-text">
              <span className="hidden sm:inline">{n.label}</span>
              <span className="sm:hidden">{n.corto}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap gap-4 px-4 pb-3 text-xs text-dim"><a href="https://www.instagram.com/ingenieriafutbol_11/">Instagram CAF</a><a href="https://www.facebook.com/ingenieriafutbol11/">Facebook CAF</a><a href="https://www.instagram.com/ligainterfacultadesoficial/">Instagram Liga</a></div>
      <div className="bastones-finos h-1" aria-hidden />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6 text-sm text-dim">
        <span>Ingeniería Fútbol 11 · Liga Interfacultades UdelaR</span>
        <a className="hover:text-text" href="https://www.instagram.com/ingenieriafutbol_11/" target="_blank" rel="noreferrer">
          Instagram @ingenieriafutbol_11
        </a>
        <a href="https://www.facebook.com/ingenieriafutbol11/">Facebook CAF</a><a href="https://www.instagram.com/ligainterfacultadesoficial/">Instagram Liga</a>
        <span>Representando a <a className="hover:text-text" href="https://www.instagram.com/fingudelar/" target="_blank" rel="noreferrer">@fingudelar</a> en la <a className="hover:text-text" href="https://www.instagram.com/ligainterfacultadesoficial/" target="_blank" rel="noreferrer">@ligainterfacultadesoficial</a> desde 2010.</span>
      </div>
    </footer>
  );
}
