import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { workerOptions } from './worker-build-options.mjs';
test('static worker is self-contained and synchronized with canonical engine source', async () => {
  const result = await build({ ...workerOptions, write: false });
  const actual = (
    await readFile(new URL('../public/mock-api-worker.js', import.meta.url), 'utf8')
  ).replaceAll('\r\n', '\n');
  assert.equal(actual, result.outputFiles[0].text);
  assert.ok(!/^import /m.test(actual), 'Static worker must not request .mjs files from hosting.');
});
