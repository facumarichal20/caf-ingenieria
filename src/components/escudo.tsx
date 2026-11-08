"use client";

import Image from "next/image";
import { useState } from "react";
import equipos from "../../data/equipos.json";
import { nombreEquipo } from "@/lib/stats";

type EquipoEscudo = { slug: string; nombre: string; escudo: string };
const LISTA_EQUIPOS = equipos as EquipoEscudo[];

function slugificar(valor: string) {
  return valor.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function iniciales(nombre: string) {
  const partes = nombre.normalize("NFD").replace(/\p{Diacritic}/gu, "").split(/[\s./-]+/).filter(Boolean);
  if (partes.length > 1) return partes.slice(0, 2).map((parte) => parte[0]).join("").toUpperCase();
  return (partes[0] ?? "?").slice(0, 3).toUpperCase();
}

export function Escudo({ equipo, size = 32, className = "" }: { equipo: string; size?: number; className?: string }) {
  const nombre = nombreEquipo(equipo);
  const slug = slugificar(nombre);
  const datos = LISTA_EQUIPOS.find((item) => item.slug === slug || slugificar(item.nombre) === slug);
  const src = slug === "ingenieria" ? "/brand/escudo-estrellas.png" : datos?.escudo;
  const [srcFallida, setSrcFallida] = useState<string | null>(null);
  const [srcCargada, setSrcCargada] = useState<string | null>(null);

  return (
    <span
      role="img"
      aria-label={`Escudo de ${nombre}`}
      title={nombre}
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface-2 align-middle font-display font-bold text-accent ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.34)) }}
    >
      {(!src || srcFallida === src || srcCargada !== src) && <span aria-hidden="true">{iniciales(nombre)}</span>}
      {src && srcFallida !== src && (
        <Image src={src} alt="" fill sizes={`${size}px`} className="bg-surface-2 object-contain p-[10%]" onLoad={() => setSrcCargada(src)} onError={() => setSrcFallida(src)} />
      )}
    </span>
  );
}