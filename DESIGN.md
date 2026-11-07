# Guía visual del CAF

Todo sale del escudo: **bastones negros y rosas**, la mitad **gris hormigón** con el edificio de la Facultad, el **corte en diagonal** y el **"3" con flecha**.

## Colores (tokens en `src/app/globals.css`)

| Token | Hex | Uso |
|---|---|---|
| `--tinta` | `#0e0b0b` | Fondo (modo oscuro por defecto: noche de partido) |
| `--rosa` | `#f4c6c4` | Acento principal sobre negro |
| `--rosa-fuerte` | `#ea8f98` | Hover, énfasis |
| `--hormigon` | `#d9d4d2` | Texto secundario claro, empates |
| `--papel` | `#f7f3f2` | Texto principal / fondo en modo claro |

Resultados: `--win` (verde), `--draw` (hormigón), `--loss` (rojo). Alertas de carné: `--warn` (amarillo).
En modo claro el rosa se oscurece (`#c4566a`) para tener contraste suficiente sobre blanco.

## Tipografía

- **Big Shoulders** (display): títulos en mayúsculas, condensada e industrial, guiño a ingeniería.
- **IBM Plex Sans**: texto.
- **IBM Plex Mono** (`.num`): **todos** los números de estadísticas, con cifras tabulares para que las columnas alineen.

## Motivos

- `.bastones` / `.bastones-finos`: las rayas del escudo. Se usan en el hero, debajo del header y en el panel de resultados. No abusar.
- `.corte-diagonal`: el corte del escudo, para bloques grandes.
- `.regla`: regla de plano técnico entre secciones de datos.

## Principios

1. Fotos reales del plantel antes que ilustraciones.
2. Los números son protagonistas: grandes, monoespaciados, con poco adorno.
3. Pensado para el celular primero: se usa al costado de la cancha.
4. Nada de templates genéricos: si parece de cualquier club, no va.
