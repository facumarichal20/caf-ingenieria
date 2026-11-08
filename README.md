# CAF · Ingeniería Fútbol 11

Web del cuadro de fútbol 11 de la Facultad de Ingeniería (UdelaR) en la **Liga Interfacultades**: estadísticas de cada temporada, preparación de 2027 y herramientas para la dirigencia (carnés de salud, presupuesto, cuotas).

Instagram: [@ingenieriafutbol_11](https://www.instagram.com/ingenieriafutbol_11/)

## Qué hay hoy

| Sección | Ruta | Estado |
|---|---|---|
| Inicio: rumbo a 2027, el año en números, cuentas pendientes, tabla | `/` | ✅ |
| Temporada (partidos, tabla y etapas) | `/temporada/2026` | ✅ |
| Dirigencia: fichajes y carné de salud (semáforo) | `/dirigencia/carnes` | ✅ (datos de ejemplo hasta tener login) |
| Dirigencia: planificador de presupuesto 2027 | `/dirigencia/presupuesto` | ✅ |
| Finanzas, cuotas, beneficios, placas IG, login | — | 🔜 ver [PLAN-CAF.md](PLAN-CAF.md) |

## Levantarlo en tu PC

Requisitos: Node 22+. **No hace falta Docker.**

```bash
npm install
npm run dev        # http://localhost:3000
```

Otros comandos:

```bash
npm test           # tests de stats, carné y presupuesto
npm run lint
npm run typecheck
npm run build
```

## Datos

- `data/public/temporada-AAAA.json`: resultados y tabla, públicos. Se generan desde la planilla oficial de la Liga:
  ```bash
  npm run import:liga -- "data/private/2026 - Interfacultades.xlsm" 2026
  ```
- Temporadas anteriores (sin planilla oficial): se tipean en `data/historico/AAAA.csv`, un partido de Ingeniería por fila (copiá `PLANTILLA.csv`), y posiciones/campeones/notas en `AAAA.meta.json`. Después:
  ```bash
  npm run cargar:temporada -- 2025
  ```
  Cada temporada tiene tres etapas: **Fase regular**, **Mundialito** (eliminatoria + Mundial Oro/Plata) y **Playoffs** (Copa Oro/Plata).
- `data/private/`: **nunca se sube** (está en `.gitignore`). Ahí van la planilla original y los fichados con vencimiento de carné. El importador guarda la cédula solo como hash y los últimos 3 dígitos.
- Si no tenés la carpeta `data/private/`, la sección de dirigencia muestra datos de ejemplo inventados. Así cualquiera puede colaborar sin ver datos personales.

## Postales

Organizá las fotos originales en `public/postales/<año>/<fecha-y-datos-del-partido>/`. Por ejemplo, `public/postales/2024/2024-07-27-final-mundialito-isef/01.jpg`. Ejecutá `npm run postales:optimizar` para generar WebP, miniaturas y `data/postales.json`. La galería muestra «Postales próximamente» mientras no haya fotos.
## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (base, login y permisos; pendiente de conectar) · Vercel (hosting gratis).
El esquema de la base con permisos por rol está en [`supabase/migrations/0001_inicial.sql`](supabase/migrations/0001_inicial.sql).

## Publicarlo (gratis)

1. Subir el repo a GitHub.
2. En [vercel.com](https://vercel.com), entrar con GitHub y elegir **Add New → Project → este repo**. No hay que configurar nada más.
3. Cada push a `main` publica el sitio. Cada pull request genera un link de vista previa para revisar el diseño.

## Colaborar

Ver [CONTRIBUTING.md](CONTRIBUTING.md) y la guía visual en [DESIGN.md](DESIGN.md).
