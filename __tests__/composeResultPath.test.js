import {
  beforeEach, describe, expect, test,
} from '@jest/globals';
import path from 'path';
import * as fs from 'fs/promises';
import os from 'os';
import composeResultPath, { getNormalizedName } from '../src/composeResultPath.js';

let tmpDir;
beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

describe('composeResultPath', () => {
  test('works', () => {
    const [htmlpath, filesName] = composeResultPath('https://yandex.ru/test-path', tmpDir);
    expect(htmlpath).toBe(`${tmpDir}/yandex-ru-test-path.html`);
    expect(filesName).toBe(`${tmpDir}/yandex-ru-test-path_files`);
  });

  test('works with no path', () => {
    const [htmlpath, filesName] = composeResultPath('https://ru.hexlet.io', tmpDir);
    expect(htmlpath).toBe(`${tmpDir}/ru-hexlet-io.html`);
    expect(filesName).toBe(`${tmpDir}/ru-hexlet-io_files`);
  });
});

describe('getNormalizedName', () => {
  test('process file link correct', () => {
    const htmlpath = getNormalizedName('https://cdn2.hexlet.io/assets/error-pages/404.png', true);
    expect(htmlpath).toBe('cdn2-hexlet-io-assets-error-pages-404.png');
  });

  test('process file link correct 2', () => {
    const htmlpath = getNormalizedName('https://test-image-page.ru/hello.png', true);
    expect(htmlpath).toBe('test-image-page-ru-hello.png');
  });
});
