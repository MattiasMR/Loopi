# Loopi

Prototipo local con dos espacios independientes — Cliente y Operaciones — dentro de una sola aplicación. Está hecho con HTML, CSS y JavaScript sin dependencias de frameworks; Node.js sirve las pantallas desde `localhost`.

## Iniciar

1. Abre una terminal en esta carpeta.
2. Ejecuta `npm start`.
3. Abre [http://127.0.0.1:3000](http://127.0.0.1:3000).

Requiere Node.js 24 o superior. No hace falta ejecutar `npm install`.

Para usar otro puerto en PowerShell: `$env:PORT=3001; npm start`.

## Crear Loopi.exe

En Windows, ejecuta `npm install` una vez y luego `npm run build:exe`. El ejecutable quedará en `dist/Loopi.exe`. Al abrirlo, inicia el servidor local y abre el navegador; deja abierta su ventana mientras usas Loopi. El `.exe` incluye las pantallas y no requiere Node.js en el equipo donde se prueba.

El ejecutable de prueba no está firmado digitalmente. Windows puede mostrar una advertencia de aplicación desconocida al abrirlo.

## Puntos de reciclaje

La vista del cliente muestra puntos por kilogramo: PET 100, tapas 80, cartón 80, latas 50 y envases plásticos rígidos 50. Son valores configurables de prototipo; el taller acredita puntos tras registrar el peso recibido.

## Sitio web

El contenido de `public/` se publica automáticamente en GitHub Pages en <https://loopi.solvit.cl> con cada push a `main` (ver `.github/workflows/pages.yml`).

## Estructura

- `public/`: el sitio (`index.html` selector, `cliente.html`, `operacion.html`). Es lo que se publica.
- `app/`: servidor local de Node.js y empaquetado de `Loopi.exe`.
- `docs/`: documentos del proyecto (PDF).
- `.github/workflows/`: despliegue a GitHub Pages.
