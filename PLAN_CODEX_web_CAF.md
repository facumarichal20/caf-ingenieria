# Plan para Codex: rediseño de la web oficial del CAF (Fútbol Ingeniería, Liga Interfacultades)

> Pegale este archivo a Codex como instrucción. Trabajá sobre el repo actual de la web; no cambies de framework salvo que sea imprescindible.

## 0. Objetivo

Convertir la web en la **página oficial del club**: que se vea seria, con identidad propia y que **atraiga a estudiantes de la Facultad de Ingeniería (@fingudelar)** para sumarse al equipo y seguir al club en Instagram.

Cada sección tiene que responder una de estas preguntas: ¿quiénes somos?, ¿qué ganamos?, ¿cómo nos va?, ¿cómo me sumo?

---

## 1. Limpieza de contenido (hacer primero)

### 1.1 Borrar todas las notas de fuente y aclaraciones internas
Buscá en todo el repo (HTML, JSX, MD, JSON, datos) y **eliminá el texto visible** que contenga cosas como:

- `fuente: 2026 - Interfacultades.xlsm`
- `fuente: Placas de @ligainterfacultadesoficial (Instagram) y notas de Bienestar Universitario`
- `fuente: Placas de @ligainterfacultadesoficial (Instagram) y nota de Bienestar Universitario del 15/05/2023`
- `datos incompletos`
- Cualquier otra nota del tipo "fuente:", "según…", "no se encontró información", "dato aproximado" o "a confirmar".

Comando sugerido para encontrarlas:
```bash
grep -rniE "fuente:|datos incompletos|bienestar universitario|\.xlsm|no hay info|a confirmar" --exclude-dir=node_modules --exclude-dir=.git .
```
Si un dato queda vacío al sacar la nota, se oculta la fila o la tarjeta. No hay que dejar "—" ni "N/D".

### 1.2 Secciones que se eliminan
- **"Cara a cara"**: borrarla completa (componente, datos, link del menú y estilos que queden sin usar).
- **Temporada 2019**: no hay información, así que se saca entera de la página, del menú, de los filtros y de los datos. Si en algún lado aparece escrito "2029", es un error de tipeo de 2019 y también se borra.
- Revisar **2025 → Notas**: borrar el bloque si después de la limpieza queda vacío.

### 1.3 Copa Mundialito
- Mostrarla **solo desde 2024**. Borrar las filas y tarjetas de años anteriores.
- Datos de 2024, sacados de las carpetas de fotos:
  - 06/07/2024: CAF 0–0 Sociales
  - 13/07/2024: CAF 2–2 Contadores
  - **Final, 27/07/2024: CAF 0–1 ISEF → Subcampeones de la Copa Mundialito 2024**

### 1.4 Historia: agregar
- Frase de apertura de la sección (y también en el hero o el footer):
  **"🏛️ Representando a [@fingudelar](https://www.instagram.com/fingudelar/) en la [@ligainterfacultadesoficial](https://www.instagram.com/ligainterfacultadesoficial/) desde 2010."**
- Hito en la línea de tiempo: **2013, Copa de Plata 🥈** (destacarlo visualmente como título).
- Línea de tiempo sugerida: 2010 (debut en la Liga) → 2013 (Copa de Plata) → 2023 → 2024 (subcampeón Mundialito, semifinal del Apertura o Clausura) → 2025 → 2026.

### 1.5 Resultados que se pueden cargar (sacados de los nombres de las carpetas del Drive)
**2024, eliminatorias:**
- Cuartos de final: CAF 2–1 EMA (ida), CAF 1–0 EMA (vuelta) → **pasamos 3–1 en el global**
- Semifinal: CAF 0–1 ISEF (ida), CAF 1–1 ISEF (vuelta) → eliminados 1–2 en el global

**2024, fase regular:** 2–1 Sociales · 0–2 ISEF · 2–1 Derecho · 1–1 FIC · 3–2 Ciencias · 3–3 Nutrición · 2–3 EMA · 1–2 Admin-Odon · 2–1 Psique · 1–2 Contadores · 2–2 Economistas

**2023:** F1 1–1 ISEF · F2 5–1 UDE · F3 0–0 Admin · **F4 2–0 IPA (13/05)** · **F5 1–2 EMA (20/05)** · F7 1–2 FMED · F8 0–1 Ciencias · F9 2–2 Contadores · F11 2–1 Nutrición · 2–0 Derecho (05/08) · F14 2–1 Sociales · F15 1–2 Fagro · F17 2–0 Clínicas

**2025:** 16/08/2025, CAF 3–1 FIC (completar con el resto).

---

## 2. Postales del equipo (fotos)

**Origen:** carpeta de Drive "CAF", organizada en subcarpetas por año (2020, 2022, 2023, 2024, 2025, 2026). Adentro hay una carpeta por partido con el formato `AAAA.MM.DD - Fecha N CAF X - Y Rival`.

> Codex no puede entrar al Drive. Descargá las carpetas y ponelas en el repo con esta estructura:

```
/public/postales/2023/2023-05-13-ipa/01.jpg
/public/postales/2024/2024-07-27-final-mundialito-isef/01.jpg
...
```

**Tareas para Codex:**
1. Script `scripts/optimizar-postales.(js|py)` que convierta las fotos a **WebP**, a 1600 px de ancho máximo, y genere también miniaturas de 480 px.
2. Generar `data/postales.json` a partir del nombre de cada carpeta: `{ fecha, rival, golesCAF, golesRival, competencia, fotos[] }`. El resultado se parsea del nombre de la carpeta.
3. **Galería "Postales"**, con filtro por año. Cada partido es una tarjeta con foto de portada, el rival y el resultado grande. Al hacer clic se abre un lightbox con todas las fotos.
4. En la ficha de cada partido, mostrar la postal de ese partido.
5. Usar `loading="lazy"` en las imágenes, con un `alt` descriptivo ("Plantel del CAF vs ISEF, final Mundialito 2024").
6. Ignorar las carpetas duplicadas: en 2024 hay accesos directos repetidos.

---

## 3. Logos

- **Escudo del CAF**: `caf.png` (está en la raíz de la carpeta de Drive). Usarlo en el header, el favicon, el hero y el footer. Si se puede, vectorizarlo a SVG.
- **Logo de la Facultad de Ingeniería (FING, Udelar)**: en el footer y en la sección "Quiénes somos", con un link a @fingudelar. Usar solo el logo oficial que provea la facultad (hay un archivo "inge" en la carpeta 2024 que podría ser ese).
- **Logos de los rivales de la Liga Interfacultades** (ISEF, EMA, Contadores, Derecho, Sociales, Ciencias, Nutrición, FMED, FIC, Fagro, UDE, IPA, Admin-Odon, Psique, Economistas, Clínicas):
  - **De dónde sacarlos:** de las placas de partido y las fotos de perfil de [@ligainterfacultadesoficial](https://www.instagram.com/ligainterfacultadesoficial/), del Instagram del CAF o de las páginas de Facebook de la Liga o de cada equipo. Se bajan a mano (recorte o captura en buena resolución, idealmente PNG con fondo transparente) porque Codex no puede entrar a Instagram ni a Facebook.
  - Guardar cada uno como `/public/escudos/<slug>.png` (por ejemplo `isef.png`, `ema.png`, `admin-odon.png`).
  - **Tarea para Codex:** normalizar los escudos con un script que los lleve a 256×256, los centre sobre un lienzo cuadrado transparente y los convierta a WebP. Armar el mapa en `data/equipos.json` (`slug`, `nombre`, `escudo`).
  - Mostrarlos al lado de cada resultado, en la tabla y en el fixture.
  - Si falta algún escudo, mostrar un círculo con las iniciales del equipo y nunca una imagen rota.
- Logo de la Liga Interfacultades en el footer, con link a su Instagram.

---

## 4. Rediseño visual (que no parezca plantilla ni hecho por IA)

### Dirección: "club de barrio con orgullo de facultad"
Identidad deportiva, con presencia y foco en lo real: fotos del plantel, resultados y escudos. La referencia es el estilo de las placas y los programas de partido de fútbol, no una landing de una startup.

**Hacer:**
- **Colores**: sacarlos del escudo del CAF (2 colores principales más un neutro cálido). Prohibido usar degradados violeta y azul, glassmorphism o neón.
- **Tipografía**: una display condensada y fuerte para los títulos y los marcadores (por ejemplo *Anton*, *Bebas Neue* u *Oswald*) y una sans legible para el texto (por ejemplo *Barlow* o *Archivo*). Nada de Inter por defecto.
- **Marcadores como protagonistas**: los resultados en números grandes y tabulares (`font-variant-numeric: tabular-nums`), estilo tablero de cancha.
- **Fotos reales a sangre**: el hero tiene que ser una foto del plantel (por ejemplo la de la final del Mundialito 2024 o una de 2026) con un overlay de color del club. No usar imágenes de stock.
- **Textura y detalles de cancha**: líneas de cal, números de camiseta y bordes rectos. Pocos radios grandes.
- Grilla con algo de **asimetría**: fotos que se salen de la columna y titulares que cortan sobre las imágenes.
- Animaciones sobrias: aparición al hacer scroll y un contador de goles o partidos. Respetar `prefers-reduced-motion`.

**Evitar:** el hero centrado con dos botones genéricos, las tres tarjetas con íconos, los emojis decorativos en todas las secciones y los textos vacíos como "pasión y compromiso".

### Estructura propuesta de la home
1. **Hero**: foto del plantel, escudo, "CAF, Fútbol de Ingeniería", la frase "Representando a @fingudelar… desde 2010" y el botón **"Quiero jugar"** (lleva a "Sumate").
2. **Próximo partido o último resultado**: el marcador grande con los escudos de los dos equipos.
3. **Palmarés**: Copa de Plata 2013 y Subcampeón de la Copa Mundialito 2024, presentados como trofeos o medallas.
4. **Temporadas**: pestañas 2023 / 2024 / 2025 / 2026 con resultados, posiciones y eliminatorias.
5. **Postales**: galería destacada (las 6 mejores fotos) y un link a la galería completa.
6. **Historia**: línea de tiempo desde 2010.
7. **Sumate al CAF** (sección de captación, ver el punto 5).
8. **Footer**: escudos de CAF, FING y la Liga, links a Instagram y contacto.

---

## 5. Captación de nuevos integrantes (la sección más importante)

- Título directo, por ejemplo: **"¿Estudiás en Ingeniería y jugás al fútbol? Te estamos buscando."**
- **La web está pensada para la temporada 2027.** La captación apunta a sumar jugadores para 2027, con un titular tipo "Temporada 2027: armamos el plantel".
- Tres datos concretos: **días y horario de entrenamiento**, **cancha o lugar** y **qué se necesita** (ser estudiante de FING, ganas de comprometerse).
  - Los días, el horario y el lugar **se cargan en 2027**. Mientras tanto, Codex los deja como datos editables en `data/club.json` (`entrenamientos: { dias, horario, lugar }`). Si están vacíos, la tarjeta muestra "Se anuncian al inicio de la temporada 2027, seguinos en Instagram" con link a la cuenta. Nunca se muestran datos inventados.
- Botón principal: **"Escribinos por Instagram"** (DM a la cuenta del club) o un formulario simple (nombre, generación o carrera, posición, contacto).
- Una foto del grupo fuera de la cancha, para mostrar el ambiente.
- Testimonios **reales** de dos o tres jugadores (nombre, carrera, hace cuánto juega). Si no hay testimonios reales, no inventarlos: dejar la sección oculta.
- Botón fijo en mobile: "Sumate" o "Seguinos".

---

## 6. Técnico y SEO
- Mobile first: la mayoría de los estudiantes entra desde el teléfono vía Instagram.
- Meta tags y **Open Graph** con foto del plantel y escudo, para que el link se vea bien al compartirlo en Instagram o WhatsApp.
- `<title>`: "CAF | Fútbol de Facultad de Ingeniería, Liga Interfacultades".
- Lighthouse ≥ 90 en Performance y Accessibility. Contraste AA.
- Los datos (resultados, equipos, postales) van en JSON separados para poder actualizarlos sin tocar los componentes.

---

## 7. Orden de trabajo para Codex
1. Limpieza del punto 1 (notas de fuente, Cara a cara, año vacío, Mundialito anterior a 2024). **Hacer un commit.**
2. Historia y datos nuevos (2013, 2010, resultados). **Hacer un commit.**
3. Sistema visual: colores, tipografía y componentes de marcador y escudo. **Hacer un commit.**
4. Nueva home y sección "Sumate". **Hacer un commit.**
5. Postales: script, JSON y galería. **Hacer un commit.**
6. Escudos de los rivales y fallback de iniciales. **Hacer un commit.**
7. Revisión final: volver a correr el `grep` del punto 1.1 (tiene que dar 0 resultados), probar en mobile y correr Lighthouse.

## 8. Pendiente de completar a mano
- [ ] Días, horario y lugar de entrenamiento (en 2027, en `data/club.json`)
- [ ] Usuario de Instagram del club y medio de contacto
- [x] Año a borrar: 2019
- [x] 2023: Fecha 4 vs IPA y Fecha 5 vs EMA
- [ ] Resultados completos de 2025 y 2026
- [ ] Bajar los escudos de los rivales desde Instagram o Facebook a `/public/escudos/`
- [ ] Testimonios reales de jugadores
