# Pedido para Codex — web del CAF (Ingeniería Fútbol 11)

Trabajás en el repo `C:\Users\facun\Desktop\CAF` (Next.js 16 + TypeScript + Tailwind 4, deploy automático en Vercel desde `main`, repo público `facumarichal20/caf-ingenieria`).

Antes de tocar nada, leé:
- `PLAN-CAF.md` (plan completo, modelo de datos, fuentes y reglas de privacidad)
- `DESIGN.md` (identidad visual: colores del escudo, tipografías)
- `AGENTS.md` (esta versión de Next.js tiene cambios: revisá `node_modules/next/dist/docs/` antes de usar una API)
- `src/lib/tipos.ts`, `src/lib/stats.ts`, `src/lib/historia.ts`, `src/lib/temporadas.ts`
- `scripts/cargar-temporada.ts` y `data/historico/PLANTILLA.csv` (formato de carga de resultados)

Trabajá en una rama nueva (`feat/completar-web`) y hacé un commit por cada parte. No hagas push a `main` sin que yo lo apruebe.

---

## Parte 1 — Cargar los resultados que faltan

Estado actual de `data/public/temporada-AAAA.json`:

| Año | Estado | Qué falta |
|---|---|---|
| 2026 | completa | Confirmar el partido con fallo de mesa (la tabla oficial suma 1 victoria y 2 goles más que los resultados; ver `NOTAS` en `src/lib/temporadas.ts`) |
| 2025 | parcial | Partidos sin cargar; cómo se definió la serie de cuartos con ISEF (global 4-4) |
| 2024 | parcial | Partidos sin cargar; GF/GC de la tabla (solo hay diferencia) |
| 2023 | parcial | Completar fase regular y Mundialito (hay 14 partidos de unos 20) |
| 2022 | parcial | Casi todo: solo hay 4 partidos y no hay tabla |
| 2021 | parcial | Completar partidos |
| 2020 | parcial | Completar grupo y partidos |
| 2019 | no existe | Buscar si se jugó y cargarla entera |
| 2018 / 2017 | parcial | Completar partidos; 2017 no tiene tabla |

Fuentes, en este orden:
1. Instagram de la Liga: https://www.instagram.com/ligainterfacultadesoficial/ (tablas, fixtures y resultados por fecha)
2. Instagram del CAF: https://www.instagram.com/ingenieriafutbol_11/ (resultados y goleadores)
3. Facebook del CAF: https://www.facebook.com/ingenieriafutbol11/photos
4. Facebook de CIM UdelaR: https://www.facebook.com/CIMUdelaR/
5. Búsqueda web: "Interfacultades Liga Bienestar Universitario" + año

Instagram y Facebook necesitan sesión: si te pide login, pará y avisame. No ingreses contraseñas.

Cómo cargar:
- Un partido por fila en `data/historico/AAAA.csv` (formato de `PLANTILLA.csv`), con el link de la publicación en la columna `fuente`. Las tablas y etapas van en `AAAA.meta.json`.
- Regenerá el JSON con `npm run cargar:temporada`.
- No inventes resultados. Si un dato no aparece, dejalo vacío y anotalo en `notas` del `.meta.json`.
- Si un año queda completo, cambiá `completitud` a `"completa"`.
- Si aparecen goleadores o asistencias por jugador, guardalos en `data/plantel/goles-AAAA.csv` (`jugador,goles,asistencias,fuente`). Solo nombre o apodo, nunca cédula ni datos de salud.
- Al terminar, dame una tabla por año: qué cargaste, qué falta y de dónde salió cada dato.

## Parte 2 — Que la web se vea profesional

- Seguí `DESIGN.md`: estilo de día de partido, números grandes, colores del escudo (negro, rosa y gris hormigón) y nada que parezca de plantilla.
- Revisá cada página en el navegador a 375 px (celular) y en escritorio. Nada puede desbordar ni generar scroll horizontal.
- Consistencia: mismos espaciados, títulos, tablas y tarjetas en todas las páginas. Reusá `src/components/stats-ui.tsx`.
- Accesibilidad: contraste suficiente en modo claro y oscuro, textos alternativos en imágenes y foco visible con teclado.
- Metadatos: título y descripción por página, imagen para compartir en WhatsApp e Instagram (Open Graph), favicon con el escudo y `sitemap.xml`.
- Estados vacíos claros (por ejemplo, Plantel sin jugadores cargados) y una página 404 con el estilo del sitio.
- Rendimiento: imágenes con `next/image` y nada de librerías pesadas en el cliente si no hacen falta.

## Parte 3 — Limpiar comentarios que parezcan escritos por IA

- Revisá los comentarios de `src/` y `scripts/`. Borrá los que repiten lo que el código ya dice, los que narran ("Ahora calculamos…", "Este componente se encarga de…") y los decorativos.
- Dejá solo los que explican un porqué que no se ve en el código (por ejemplo, el fallo de mesa de 2026 o las reglas de privacidad).
- Revisá también los textos visibles de la web: tienen que sonar a un club uruguayo, en español rioplatense, directos y sin frases de relleno ni muletillas de marketing.
- No cambies la lógica al limpiar.

## Parte 4 — Secciones que necesita un club amateur

Públicas:
- **Fixture y resultados 2027**: próximo partido destacado (rival, día, hora, cancha con link a Google Maps) y resultados a medida que se cargan.
- **Plantel**: fichas de jugadores (foto, apodo, posición y dorsal), goleadores por año y tabla histórica de goleadores cuando haya datos.
- **Noticias / crónicas**: posts cortos en `data/noticias/*.md` (fecha, título, foto y texto), con listado y página de cada uno.
- **Galería**: fotos por partido o temporada desde `public/photos/`.
- **El club**: historia, escudo y colores, cuerpo técnico y dirigencia (solo nombres y cargos), cómo sumarse a jugar y contacto.
- **Sponsors / apoyos**: logos con link y un "¿Querés apoyar al CAF?" con contacto.
- **Redes**: links visibles en el header y el footer a Instagram del CAF, Facebook del CAF e Instagram de la Liga. En el inicio, un bloque "Seguinos" con las últimas publicaciones. Si no hay forma de traerlas sin token de Meta, usá los embeds oficiales de Instagram para posts elegidos a mano, listados en `data/redes.json`. No guardes tokens en el repo.

Para el plantel (con login; puede quedar maquetado hasta conectar Supabase):
- Confirmar disponibilidad para el partido.
- Ver mis cuotas y mi vencimiento de carné.

Dirigencia (ya existen Carnés y Presupuesto 2027):
- **Cuotas**: grilla jugador × mes, morosos y botón "copiar recordatorio para WhatsApp".
- **Finanzas**: ingresos y egresos por categoría, y saldo.
- **Convocatoria**: armar la lista del partido bloqueando a quien tenga el carné vencido o esté sancionado.
- **Generador de placas para Instagram**: resultado, convocatoria y goleador, en PNG 1080×1350.

Reglas que no se rompen:
- Cédulas, carnés de salud, teléfonos y emails nunca van al repo ni a páginas públicas (`data/private/` está en `.gitignore`).
- Mientras Supabase no esté conectado, los datos privados se muestran con ejemplos inventados fuera de `npm run dev` (ver `src/lib/privado.ts`).

## Verificación final

1. `npm run lint && npm run typecheck && npm test`: todo en verde. Agregá tests para cada cálculo nuevo.
2. `npm run build` sin errores.
3. `npm run dev` y recorré cada página en celular y escritorio.
4. Dame un resumen: qué páginas nuevas hay, qué resultados se cargaron, qué datos faltan y qué decisiones necesitan mi respuesta (costos, cuota, lista de dirigentes, fotos).
