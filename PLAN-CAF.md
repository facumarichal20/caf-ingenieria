# Plan: "CAF" — web de Ingeniería Fútbol 11

## Context
El cuadro de fútbol 11 de Ingeniería (el CAF, IG `@ingenieriafutbol_11`) no tiene un lugar central para: estadísticas históricas de los Interfacultades, planificación de la temporada 2027, finanzas/cuotas y control de fichajes (vencimiento del carné de salud). El campeonato 2026 ya terminó, así que el objetivo es llegar a 2027 con todo cargado y planificado. La web será pública para hinchas/facultad, con login para plantel y una zona restringida para dirigencia. El código va a GitHub para que otros colaboren con el diseño. Las estadísticas viejas están en Google Sheets/Excel. Instagram se usa para **generar placas listas para subir**, no para publicar automáticamente.

**¿Docker?** No hace falta en producción. Se despliega gratis en **Vercel** (frontend + API) + **Supabase** (base Postgres, login, permisos, fotos). Docker solo aparece opcionalmente en local si un colaborador quiere correr Supabase en su PC (`supabase start`). Se incluye un `docker-compose.yml` opcional para quien prefiera, pero no es requisito.

## Stack
- **Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui** — mucho material y fácil para colaboradores.
- **Supabase**: Postgres, Auth (magic link por email / Google), Row Level Security para roles, Storage para fotos.
- **Recharts** para gráficos, **Framer Motion** para micro-animaciones, **@vercel/og (satori)** para generar placas PNG de Instagram.
- **Vercel** para deploy automático desde GitHub (cada PR genera un preview link — ideal para revisar diseño en equipo).
- PWA (instalable en el celular) para el uso diario.

## Paso 0 — Identidad visual (lo primero que hace Code)
1. Abrir `https://www.instagram.com/ingenieriafutbol_11/` en el browser y tomar capturas de perfil, escudo y 6–9 posts.
2. Leer la carpeta de Drive `17PXx3wE5U99UmTfrn6wUBvk2srTIq5k0` con el conector de Google Drive (listar, bajar escudo + fotos de plantel/partidos a `public/brand/` y `public/photos/` — o mejor, subir a Supabase Storage).
3. Extraer paleta del escudo/camiseta (colores dominantes con `node-vibrant`) → definir tokens en `DESIGN.md` y `tailwind.config.ts` (`--caf-primary`, `--caf-secondary`, `--caf-accent`, neutros, modo oscuro por defecto "noche de partido").
4. Tipografía: una display condensada deportiva (ej. *Barlow Condensed* / *Anton*) + una legible para datos (*Inter* / *JetBrains Mono* para números tabulares).
5. Usar la skill `impeccable` / `frontend-design` para cerrar dirección de arte: estilo "matchday" con texturas de cancha, números grandes, fotos reales del plantel. Nada de template genérico.

## Estructura del repo
```
caf-ingenieria/
  app/
    (public)/            home, plantel, jugador/[id], historia, temporada/[año], fixture, galeria
    (plantel)/           mi-perfil, disponibilidad, mis-cuotas, votar-mvp
    (dirigencia)/        finanzas, cuotas, presupuesto-2027, fichajes, carnes, placas, admin
    api/og/[tipo]/       generador de placas IG (resultado, convocatoria, goleador, cumple, cuota)
  components/ lib/ (supabase client, permisos, cálculos de stats)
  supabase/migrations/   esquema SQL + políticas RLS + seed
  scripts/import-sheets.ts   importador desde Google Sheets/Excel (CSV)
  DESIGN.md  CONTRIBUTING.md  README.md  .env.example  docker-compose.yml (opcional)
  .github/workflows/ci.yml   (lint + typecheck + tests en cada PR)
```

## Modelo de datos (Supabase)
- `profiles` (user_id, nombre, rol: `publico|jugador|dt|dirigente|admin`)
- `jugadores` (nombre, apodo, posición, dorsal, foto, fecha_nac, generación/carrera, activo, contacto)
- `temporadas` (año, torneo, posición final), `rivales` (facultades)
- `partidos` (temporada, fecha, rival, cancha, local/visita, goles a favor/contra, fase)
- `eventos_partido` (partido, jugador, tipo: gol/asistencia/amarilla/roja/atajada/minutos, minuto)
- `convocatorias` y `asistencias` (partidos y entrenamientos)
- **Dirigencia (RLS solo `dirigente|admin`):**
  - `fichajes` (jugador, fecha_fichaje, nro_carne_salud, vencimiento_carne, estado, archivo del carné en Storage privado)
  - `cuotas` (jugador, mes, monto, pagado, fecha_pago, medio)
  - `movimientos` (fecha, tipo ingreso/egreso, categoría: cancha/juez/inscripción/indumentaria/sponsor/evento, monto, comprobante)
  - `presupuesto_items` (año, concepto, costo unitario, cantidad, mensual/anual) — ej. cancha × partidos, juez × partidos
- Vista SQL `stats_jugador_temporada` y `stats_historicas` para no recalcular en el front.

> El carné de salud es dato sensible: bucket privado, RLS estricta, nunca expuesto en rutas públicas.

## Secciones

### Públicas
- **Home "Matchday"**: próximo partido con cuenta regresiva, último resultado, goleador del momento, racha, últimas placas.
- **Historia / Interfacultades**: tabla por año, evolución de posiciones, récords (mayor goleada, goleador histórico, más partidos), head-to-head contra cada facultad.
- **Plantel**: cards tipo figurita con foto real, stats por temporada y totales; perfil de jugador con gráfico de evolución.
- **Temporada 2027**: fixture, resultados en vivo cargados por DT, tabla.
- **Galería** desde Drive/Storage.

### Plantel (login)
- Confirmar disponibilidad para el partido/entrenamiento (1 tap).
- Ver mis cuotas y deuda, mi carné (fecha de vencimiento propia).
- Votar MVP del partido.

### Dirigencia (rol restringido)
- **Finanzas**: dashboard de caja (saldo, ingresos vs egresos por mes, categorías), carga rápida de movimientos con comprobante.
- **Cuotas**: grilla jugador × mes con estado (pagó / debe / exonerado), % de cobro, morosos, botón "copiar recordatorio para WhatsApp".
- **Planificador 2027**: simulador — inputs: costo cancha por partido, costo juez por partido, cantidad de partidos/entrenamientos, inscripción, indumentaria; salida: costo anual y mensual, **cuota necesaria por jugador** según plantel activo, brecha a cubrir con beneficios (rifas, cantina, sponsors, eventos) — con sliders para escenarios.
- **Beneficios/ingresos extra**: lista de ideas con meta $ y avance (rifa, fiesta, sponsors de camiseta, venta de indumentaria).
- **Fichajes y carné de salud**: tabla con semáforo (vencido / vence < 30 días / ok), timeline de vencimientos, filtro "habilitados para jugar el próximo partido"; un jugador con carné vencido aparece bloqueado en la convocatoria.
- **Generador de placas IG**: elegir plantilla (resultado, convocatoria, goleador, MVP, cumpleaños, "pagá la cuota", fixture del mes) → preview → descargar PNG 1080×1350 / 1080×1920 con colores y fotos del CAF.
- **Admin**: gestionar roles de usuarios.

### Extras "atrapantes" para el uso diario
- Notificaciones (email / push PWA): carné por vencer, cuota impaga, partido mañana.
- Ranking de compromiso (asistencia + puntualidad de cuota), badges.
- Cumpleaños del plantel con placa automática.
- Pizarra táctica simple (arrastrar fichas en la cancha y guardar formaciones).
- Inventario de camisetas/pelotas/conos.
- Modo "carga en vivo" del partido para el DT desde el celular.

## Fases de ejecución (para Code)
1. **Setup**: crear repo `caf-ingenieria` en GitHub, Next.js + Tailwind + shadcn, Supabase proyecto, Vercel conectado, CI. README + CONTRIBUTING (cómo levantar local, convenciones de ramas/PR, cómo proponer cambios de diseño).
2. **Identidad visual** (Paso 0) + `DESIGN.md` + componentes base (cards, tablas, stat tiles, header con escudo).
3. **Esquema + RLS + Auth con roles** (migraciones en `supabase/migrations`).
4. **Importador de Sheets/Excel**: exportar a CSV o leer vía conector de Google Sheets → `scripts/import-sheets.ts` que normaliza jugadores, partidos y goles. Validar con el usuario los totales.
5. **Secciones públicas + stats históricas**.
6. **Dirigencia: fichajes/carnés** (prioridad alta antes de 2027).
7. **Dirigencia: cuotas, finanzas, planificador 2027**.
8. **Generador de placas IG**.
9. **Zona plantel** + extras (notificaciones, MVP, pizarra) + PWA.

## Colaboración en GitHub
- Repo público (el código no tiene secretos; claves en Vercel/Supabase env vars, `.env.example` documentado). Datos sensibles solo en Supabase.
- Ramas `main` (producción) + PRs con preview de Vercel; issues etiquetados `diseño`, `good first issue`.
- Seed con datos ficticios para que colaboradores trabajen sin acceso a datos reales.

## Verificación
- `npm run lint && npm run typecheck && npm test` (tests de cálculos: stats, presupuesto, semáforo de carné).
- Probar RLS: usuario público y jugador NO pueden leer `fichajes`, `cuotas`, `movimientos` (test SQL o script con distintos JWT).
- Correr local con `npm run dev`, recorrer cada sección en el browser (desktop y móvil 375px).
- Comparar totales importados (goles/partidos por temporada) con las planillas originales.
- Generar una placa de cada tipo y revisarla visualmente.
- Deploy en Vercel y abrir la URL pública.

## Fuentes de datos (revisado 2026-11-07)

### Interfacultades 2026 — planilla oficial de la Liga
Drive `1ZIK0DbPmbgaEbhJSLGxId1ZHIWQV9zsU` → `2026 - Interfacultades.xlsm` (planilla de la Liga, actualizada al 06/11/2026). Es un Excel con macros: leerlo con `openpyxl` (`data_only=True`), **nunca ejecutar las macros**. Hojas útiles y su mapeo:

| Hoja | Qué tiene | Va a |
|---|---|---|
| `Fase Regular` | Local, goles, "v", goles, Visitante, cancha, "día - hora" (15 equipos, 14 fechas) | `partidos`, `rivales` |
| `Tabla` | Pos, P, G, E, P, GF, GC, dif, Pts, amarillas, 2A, rojas, fair play, prórrogas | `temporadas` + tabla final |
| `Playoffs` | Cuartos/semis/finales Oro, ida y vuelta, penales | `partidos` (fase) |
| `Sanciones 2026` | Fecha, jugador, equipo, motivo, sanción, regreso | nueva tabla `sanciones` (privada) |
| `Jugadores` | Por facultad: nombre, apellido, cédula, **vencimiento carné de salud**, marca "Extranjero" | `jugadores` + `fichajes` (privado) |
| `Delegados` | Email del delegado por facultad | dato de contacto (privado) |

Lo que ya sale para Ingeniería 2026: **7.º de 15**, 14 PJ, 7G 1E 6P, 23 GF / 30 GC, 22 pts. Quedó eliminado en cuartos de la Copa Oro contra Medicina (1-0 y 0-2). Hay 6 sanciones de Ingeniería, una que sigue en 2027 (5 partidos). El listado de Ingeniería tiene ~83 fichados: ~27 con carné ya vencido, ~10 vencen antes de marzo 2027 y ~28 durante 2027. Esto ya alcanza para arrancar la sección de carnés con datos reales.

**La planilla no trae goleadores ni asistencias por jugador**: los goles individuales hay que cargarlos desde las placas de IG/Facebook o a mano.

### Temporadas anteriores (las busca Code con el navegador)
- IG de la Liga: `https://www.instagram.com/ligainterfacultadesoficial/` (tablas, fixtures, resultados por fecha)
- Facebook del CAF: `https://www.facebook.com/ingenieriafutbol11/photos` (placas de resultados y goleadores de años anteriores)
- Facebook de CIM UdelaR: `https://www.facebook.com/CIMUdelaR/`
- Buscar en la web "Interfacultades Liga Bienestar Universitario" + año (planillas viejas en Drive con el mismo formato, notas de prensa).
- Si aparecen planillas `.xlsm` de años anteriores con el mismo formato, se reusa el mismo importador. Lo que salga de las imágenes se carga en un CSV intermedio (`data/historico/AAAA.csv`) que revisa la dirigencia antes de importarlo.

### Reglas de privacidad para estos datos
- La cédula y el vencimiento del carné **no van al repo de GitHub**: el `.xlsm` y los CSV con datos personales van en `.gitignore` (`data/private/`). Se importan directo a Supabase, en tablas con RLS solo para dirigencia.
- En la web pública: solo nombre/apodo, foto y stats deportivas. La cédula no se muestra en ningún lado (si hace falta, solo los últimos 3 dígitos para la dirigencia).
- El seed del repo usa jugadores ficticios.

### Ajustes al modelo de datos por lo que trae la planilla
- `jugadores`: agregar `extranjero` (bool) y `cedula_hash` (para cruzar importaciones sin guardar la cédula en texto plano).
- Nueva tabla `sanciones` (jugador, fecha, motivo, partidos, cumple_hasta) → bloquea al jugador en la convocatoria igual que un carné vencido.
- `partidos`: agregar `cancha`, `ida_vuelta` y `penales`.
- `temporadas`: guardar la tabla final completa (los 15 equipos) para mostrar la posición y comparar contra cada facultad.
- Importador: `scripts/import-liga-xlsm.ts` (o `.py`) con opción `--anio 2026`, idempotente (se puede volver a correr cuando la Liga actualice la planilla).

## Pendiente que necesita el usuario
- ~~Link a las planillas~~ → 2026 listo; faltan años anteriores si existen en Drive.
- Confirmar en qué partido de 2026 hubo fallo de mesa (la tabla oficial suma una victoria más que los resultados).
- Costos reales 2026 de cancha y juez por partido, monto de cuota actual, moneda.
- Lista de dirigentes (emails) para asignar rol.
- Nombre de dominio (opcional; si no, `caf-ingenieria.vercel.app`).
