import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { dataDir, curcuminXlsxPath } from './seed.js';

test('dataDir resolves to the project-level data directory and exists', () => {
  assert.equal(path.basename(dataDir), 'data');
  assert.ok(existsSync(dataDir), `expected dataDir to exist: ${dataDir}`);
});

test('curcuminXlsxPath points to curcumin_trafficlight_data.xlsx inside dataDir', () => {
  assert.equal(path.dirname(curcuminXlsxPath), dataDir);
  assert.equal(path.basename(curcuminXlsxPath), 'curcumin_trafficlight_data.xlsx');
  assert.ok(existsSync(curcuminXlsxPath), `expected curcuminXlsxPath to exist: ${curcuminXlsxPath}`);
});

test('paths are absolute regardless of current working directory', () => {
  assert.ok(path.isAbsolute(dataDir));
  assert.ok(path.isAbsolute(curcuminXlsxPath));
});
