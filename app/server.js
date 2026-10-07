const http = require('node:http');
const path = require('node:path');
const { readFile } = require('node:fs/promises');

const host = '127.0.0.1';
const port = Number(process.env.PORT || 3000);
const root = path.join(__dirname, '..', 'public');
const routes = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/cliente.html', 'cliente.html'],
  ['/operacion.html', 'operacion.html']
]);

const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${host}:${port}`).pathname;
  if (request.method === 'POST' && pathname === '/__loopi/stop') {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Loopi se cerró.');
    setTimeout(() => server.close(() => process.exit(0)), 150);
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    return response.end('Method not allowed');
  }

  const filename = routes.get(pathname);
  if (!filename) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return response.end('Página no encontrada');
  }

  try {
    const content = await readFile(path.join(root, filename));
    response.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    console.error(`No se pudo leer ${filename}:`, error.message);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('No se pudo cargar Loopi');
  }
});

server.listen(port, host, () => {
  console.log(`Loopi está disponible en http://${host}:${port}`);
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${port} ya está en uso. Prueba con: $env:PORT=3001; npm start`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
