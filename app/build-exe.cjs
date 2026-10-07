const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const outputDir = path.join(root, 'dist');
const exe = path.join(outputDir, 'Loopi.exe');
const blob = path.join(buildDir, 'loopi-sea.blob');
const fuse = 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2';

if (process.platform !== 'win32') {
  console.error('Este empaquetado genera Loopi.exe y debe ejecutarse en Windows.');
  process.exit(1);
}

if (Number(process.versions.node.split('.')[0]) !== 24) {
  console.error(`Usa Node.js 24 para este empaquetado. Versión actual: ${process.versions.node}`);
  process.exit(1);
}

fs.mkdirSync(buildDir, { recursive: true });
fs.mkdirSync(outputDir, { recursive: true });

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} terminó con código ${result.status}`);
}

try {
  console.log('Preparando la aplicación Node.js y sus pantallas...');
  run(process.execPath, ['--experimental-sea-config', 'app/sea-config.json']);
  fs.copyFileSync(process.execPath, exe);

  console.log('Integrando las pantallas dentro de Loopi.exe...');
  run(process.execPath, [
    path.join(root, 'node_modules', 'postject', 'dist', 'cli.js'),
    exe,
    'NODE_SEA_BLOB',
    blob,
    '--sentinel-fuse',
    fuse
  ]);

  const sizeMb = (fs.statSync(exe).size / 1024 / 1024).toFixed(1);
  console.log(`Listo: ${exe} (${sizeMb} MB)`);
  console.log('Loopi.exe abre el navegador y contiene las pantallas; no necesita instalar Node.js.');
} catch (error) {
  console.error(`No se pudo crear Loopi.exe: ${error.message}`);
  process.exitCode = 1;
}
