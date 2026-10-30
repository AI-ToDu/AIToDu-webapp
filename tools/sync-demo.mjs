import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, process.argv[2] ?? '../ai-todu-fake-api');
const entries = [
  'public/mock/engine.mjs',
  'public/mock/value-objects.mjs',
  'public/mock/domain/inventory-item.mjs',
  'public/mock/domain/sale-summary.mjs',
  'public/mock/domain/dispatch-manifest.mjs',
  'tools/demo-server.mjs',
  'database/schema.sql',
  'database/model.json',
  'openapi.json',
];
const commit = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim();
const pending = execFileSync('git', ['-C', source, 'status', '--porcelain', '--', ...entries], {
  encoding: 'utf8',
}).trim();
if (pending) throw new Error('Commit canonical engine changes before vendoring.');
const files = {};
for (const relative of entries) {
  const target = relative === 'openapi.json' ? 'public/mock/openapi.json' : relative;
  const text = (await readFile(resolve(source, relative), 'utf8')).replaceAll('\r\n', '\n');
  await mkdir(dirname(resolve(root, target)), { recursive: true });
  await writeFile(resolve(root, target), text);
  files[target] = createHash('sha256').update(text).digest('hex');
}
await writeFile(
  resolve(root, 'mock-provenance.json'),
  JSON.stringify(
    {
      sourceRepository: 'https://github.com/AI-ToDu/ai-todu-fake-api',
      sourceCommit: commit,
      version: '0.2.0',
      normalization: 'UTF-8, LF line endings',
      files,
    },
    null,
    2,
  ) + '\n',
);
console.log('Vendored ' + entries.length + ' canonical files at ' + commit);
