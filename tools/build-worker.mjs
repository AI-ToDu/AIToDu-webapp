import { build } from 'esbuild';
import { workerOptions } from './worker-build-options.mjs';
await build(workerOptions);
console.log('Standalone browser worker generated; no .mjs MIME dependency.');
