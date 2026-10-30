import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
test('vendored demo files match the committed canonical-source provenance', async () => {
  const manifest = JSON.parse(
    await readFile(new URL('../mock-provenance.json', import.meta.url), 'utf8'),
  );
  assert.match(manifest.sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(Object.keys(manifest.files).length, 9);
  for (const [path, expected] of Object.entries(manifest.files)) {
    const text = (await readFile(new URL('../' + path, import.meta.url), 'utf8')).replaceAll(
      '\r\n',
      '\n',
    );
    assert.equal(createHash('sha256').update(text).digest('hex'), expected, path);
  }
});
