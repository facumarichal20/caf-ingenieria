# Postales

Copiar las fotos originales dentro de una carpeta por año y partido. Ejemplo:

```text
public/postales/2023/2023-05-13-ipa/01.jpg
public/postales/2024/2024-07-27-final-mundialito-isef/01.jpg
```

El script toma la fecha, el rival y los datos que estén escritos en el nombre de la carpeta. Las fotos se convierten a WebP (máximo 1600 px) y se crea una miniatura de 480 px. Luego se actualiza `data/postales.json`.

```bash
npm run postales:optimizar
```