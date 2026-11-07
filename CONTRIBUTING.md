# Cómo colaborar

¡Gracias por sumarte! Cualquier aporte suma, sea de diseño, de código o de datos.

## Flujo

1. Hacé un fork del repo o pedí acceso de colaborador.
2. Creá una rama: `diseno/home-hero`, `feat/cuotas`, `datos/temporada-2024`, `fix/tabla-mobile`.
3. Corré `npm run lint && npm run typecheck && npm test` antes de abrir el pull request.
4. Abrí un **pull request** contra `main`. Vercel comenta un link de vista previa: pegá capturas en desktop y en el celular (375 px) si el cambio es visual.
5. Alguien de la dirigencia lo revisa y lo mergea.

## Reglas

- **Datos personales nunca en el repo**: ni cédulas, ni carnés de salud, ni cuotas, ni teléfonos. Si encontrás alguno, avisá.
- Textos en español rioplatense, tuteo o voseo ("cargá", "mirá"), sin anglicismos innecesarios.
- Colores y tipografías: solo los tokens de `src/app/globals.css` (ver [DESIGN.md](DESIGN.md)). Nada de colores sueltos.
- Si un cambio toca el cálculo de estadísticas o del presupuesto, agregá o ajustá su test en `src/lib/*.test.ts`.

## Para empezar

Mirá los issues con la etiqueta `good first issue` o `diseño`. Ideas abiertas:

- Cargar temporadas anteriores (2022–2025) en `data/public/` desde fotos de tablas o planillas viejas.
- Página de jugador con stats por temporada.
- Plantillas de placas para Instagram (1080×1350).
