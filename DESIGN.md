# Guía visual del CAF

Todo sale del escudo: **bastones negros y rosas**, la mitad **gris hormigón** con el edificio de la Facultad, el **corte en diagonal** y el **"3" con flecha**.

## Colores (tokens en `src/app/globals.css`)

| Token | Hex | Uso |
|---|---|---|
| `--tinta` | `#100808` | Negro muestreado del escudo; fondo oscuro |
| `--rosa` | `#f8c0c4` | Rosa claro muestreado del escudo; acento principal |
| `--rosa-fuerte` | `#c09094` | Rosa medio muestreado del escudo |
| `--hormigon` / `--plata` | `#c7c7c7` | Gris del escudo; empates y logros de plata |
| `--papel` | `#f7f3f2` | Texto principal / fondo en modo claro |

Resultados: `--win` (verde), `--draw` (hormigón), `--loss` (rojo). Alertas de carné: `--warn` (amarillo).
En modo claro el rosa se oscurece (`#9f344d`) para tener contraste suficiente sobre blanco. Los resultados destacados usan medallas plateadas, tomadas del gris del escudo.

## Tipografía

- **Big Shoulders** (display): títulos en mayúsculas, condensada e industrial, guiño a ingeniería y a las placas de partido.
- **IBM Plex Sans**: texto.
- **IBM Plex Mono** (`.num`, `.marcador`): estadísticas y marcadores, con cifras tabulares para que las columnas alineen.

## Motivos

- `.bastones` / `.bastones-finos`: las rayas del escudo. Se usan en el hero, debajo del header y en el panel de resultados. No abusar.
- `.corte-diagonal`: el corte del escudo, para bloques grandes.
- `.regla`: regla de plano técnico entre secciones de datos.

## Principios

1. Fotos reales del plantel antes que ilustraciones.
2. Los números son protagonistas: grandes, monoespaciados, con poco adorno.
3. Pensado para el celular primero: se usa al costado de la cancha.
4. Nada de templates genéricos: si parece de cualquier club, no va.
5. Sin degradados violeta ni superficies translúcidas con blur. Los rivales sin escudo usan iniciales en una insignia, nunca imágenes inventadas.
