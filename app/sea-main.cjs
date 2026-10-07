const http = require('node:http');
const { spawn } = require('node:child_process');
const { getAsset } = require('node:sea');

const pages = {
  '/': getAsset('index.html', 'utf8'),
  '/index.html': getAsset('index.html', 'utf8'),
  '/cliente.html': getAsset('cliente.html', 'utf8'),
  '/operacion.html': getAsset('operacion.html', 'utf8')
};
const host = '127.0.0.1';
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, `http://${host}`).pathname;
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

  const page = pages[pathname];
  if (page === undefined) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return response.end('Página no encontrada');
  }

  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(request.method === 'HEAD' ? undefined : page);
});

function openBrowser(url) {
  const opener = spawn('rundll32.exe', ['url.dll,FileProtocolHandler', url], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true
  });
  opener.unref();
}

function listen(port) {
  server.once('error', error => {
    if (error.code === 'EADDRINUSE' && port < 3010) return listen(port + 1);
    console.error(`No se pudo iniciar Loopi en el puerto ${port}: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, host, () => {
    const url = `http://${host}:${port}`;
    console.log(`Loopi está abierto en ${url}.`);
    openBrowser(url);
  });
}

listen(3000);
