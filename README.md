# Cinedex Frontend

Cinedex es el frontend construido con React y Vite que consume la [API](https://github.com/PikiSpitale/CinedexAPI) principal. Este repositorio ya incluye las dependencias necesarias para arrancar, pero necesitas seguir los pasos descritos abajo para ejecutar el proyecto correctamente.

## Requisitos previos

- Node.js 18+ y npm 10+ (verifica con `node --version` / `npm --version`).
- El [backend](https://github.com/PikiSpitale/CinedexAPI) debe estar en ejecución y accesible desde la URL que usarás en `VITE_API_URL`.

## Pasos para levantar la aplicación

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Añade el entorno en `.env` con VITE_API_URL por defecto apuntada a `https://localhost:7019/api`, así que cámbialo si tu [backend](https://github.com/PikiSpitale/CinedexAPI) escucha en otra URL.

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev -- --host 0.0.0.0 --port 5173
   ```

   Esto habilita conexiones desde `localhost` y redes locales. Si no necesitas cambiar el host o puerto, puedes ejecutar simplemente `npm run dev`.

4. Abre `http://localhost:5173` (o el puerto que hayas configurado) en tu navegador para ver la aplicacion.

## Notas adicionales

- Si necesitas apuntar a una API en desarrollo remoto, asegúrate de actualizar `VITE_API_URL` y reiniciar el servidor de desarrollo para que cargue los nuevos valores.
- El proyecto ya incluye `tailwindcss`, `axios`, `zustand`, `react-hook-form`, `zod` y otras dependencias clave; las actualizaciones de versión se controlan desde `package.json`.
