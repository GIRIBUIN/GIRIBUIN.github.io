import { existsSync, lstatSync, realpathSync, readdirSync, rmdirSync, rmSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = realpathSync(fileURLToPath(new URL('../', import.meta.url)));
const generated = new Set(['dist', '.astro', '.verification', '.verification/content-current', 'error.png']);

export function removeGenerated(name) {
  if (!generated.has(name)) throw new Error('Not a generated path: ' + name);
  const target = resolve(root, name);
  if (!existsSync(target)) return;
  const inside = relative(root, realpathSync(target));
  if (!inside || inside.startsWith('..') || isAbsolute(inside) || lstatSync(target).isSymbolicLink()) {
    throw new Error('Refusing to clean outside the project: ' + target);
  }
  rmSync(target, { recursive: true, force: true });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== '--verification')) throw new Error('Usage: node scripts/clean.mjs [--verification]');
  const targets = args[0] === '--verification' ? ['.verification', 'error.png'] : ['dist', '.astro', '.verification', 'error.png'];
  for (const target of targets) removeGenerated(target);
  const unusedAssets = resolve(root, 'assets');
  if (args.length === 0 && existsSync(unusedAssets) && !lstatSync(unusedAssets).isSymbolicLink() && readdirSync(unusedAssets).length === 0) {
    rmdirSync(unusedAssets);
  }
  console.log('Cleaned generated files. Source assets and dependencies were kept.');
}
