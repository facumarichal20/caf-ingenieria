import Image from "next/image";

const LINK_CLASS = "group inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-text transition-colors hover:border-accent hover:bg-accent hover:text-tinta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function InstagramMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M13.3 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.1H6.7v3.2h2.9V21h3.7Z" />
    </svg>
  );
}

function XMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
      <path d="M18.9 2H22l-7.3 8.3L23.3 22h-6.7l-5.2-7.4L4.8 22H1.7l7.8-8.9L1.7 2h6.8l4.9 6.8Zm-1.2 18h1.7L7.4 3.9H5.6Z" />
    </svg>
  );
}

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Redes sociales" className={className}>
      <ul className="flex items-center gap-2">
        <li>
          <a className={LINK_CLASS} href="https://www.instagram.com/ingenieriafutbol_11/" target="_blank" rel="noopener noreferrer" aria-label="Instagram del CAF" title="Instagram del CAF">
            <InstagramMark />
          </a>
        </li>
        <li>
          <a className={LINK_CLASS} href="https://www.facebook.com/ingenieriafutbol11/" target="_blank" rel="noopener noreferrer" aria-label="Facebook del CAF" title="Facebook del CAF">
            <FacebookMark />
          </a>
        </li>
        <li>
          <a className={LINK_CLASS} href="https://www.instagram.com/ligainterfacultadesoficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de la Liga Interfacultades" title="Instagram de la Liga Interfacultades">
            <Image src="/escudos/logo-del-interfacultades.webp" alt="" width={25} height={25} className="h-[25px] w-[25px] scale-[1.3] rounded-full object-cover" />
          </a>
        </li>
        <li>
          <a className={LINK_CLASS} href="https://x.com/11Ingenieria" target="_blank" rel="noopener noreferrer" aria-label="CAF en X" title="CAF en X">
            <XMark />
          </a>
        </li>
      </ul>
    </nav>
  );
}
