# Contenido del sitio

- Fixture: data/fixture-2027.json. Lista de {rival, fecha (ISO con -03:00), cancha, direccion, gf, gc}. Goles null mientras no haya resultado.
- Plantel: data/plantel/plantel.csv. Columnas nombre,apodo,posición,dorsal y foto opcional (ruta dentro de public).
- Goles: data/plantel/goles-AAAA.csv. Un registro verificado por publicación; no repetir una publicación. Los registros actuales son parciales.
- Noticias: data/noticias/slug.md. Encabezado entre --- con titulo, fecha (AAAA-MM-DD), foto (ruta pública opcional), seguido del texto en párrafos.
- Galería: fotos en public/photos/AAAA/partido/. No subir fotos sin autorización del club.
- Sponsors: data/club/sponsors.json con nombre,logo,url.
- Dirigencia: data/club/dirigencia.json con nombre,cargo. Solo información autorizada para publicar.
- Redes: data/redes.json con url de publicación de Instagram y titulo.

Los módulos de gestión nuevos usan exclusivamente ejemplos inventados. No persisten datos reales. El espacio Mi equipo queda maquetado hasta conectar autenticación y RLS en Supabase.
No cargar cédulas, datos de salud, teléfonos ni emails en archivos públicos.
