import { fileURLToPath } from 'node:url';
export const workerOptions = {
  absWorkingDir: fileURLToPath(new URL('../', import.meta.url)),
  entryPoints: ['tools/mock-api-worker.source.mjs'],
  outfile: 'public/mock-api-worker.js',
  bundle: true,
  platform: 'browser',
  format: 'esm',
  target: 'es2022',
  legalComments: 'none',
  banner: {
    js: '// Generated from tools/mock-api-worker.source.mjs and the pinned canonical engine. Run npm run mock:build.',
  },
};
