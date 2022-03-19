import {
  beforeEach, describe, expect, test,
} from '@jest/globals';
import path from 'path';
import * as fs from 'fs/promises';
import os from 'os';
import composeResultPath from '../src/composeResultPath.js';

let tmpDir;
beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

describe('composeResultPath', () => {
  test('works', () => {
    const result = composeResultPath('https://yandex.ru/test-path', tmpDir);
    expect(result).toBe(`${tmpDir}/yandex-ru-test-path.html`);
  });

  test('works with subdomain', () => {
    const result = composeResultPath('https://ru.hexlet.io/console', tmpDir);
    expect(result).toBe(`${tmpDir}/ru-hexlet-io-console.html`);
  });

  test('works with no path', () => {
    const result = composeResultPath('https://ru.hexlet.io', tmpDir);
    expect(result).toBe(`${tmpDir}/ru-hexlet-io.html`);
  });
});
