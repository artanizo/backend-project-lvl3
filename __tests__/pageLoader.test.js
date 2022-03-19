import {
  beforeEach, describe, expect, test,
} from '@jest/globals';
import path from 'path';
import * as fs from 'fs/promises';
import os from 'os';
import nock from 'nock';
import pageLoader from '../src/pageLoader.js';

let tmpDir;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));

  nock('https://test-page.ru')
    .get('/')
    .reply(200, 'test page');
});

describe('pageLoader', () => {
  test('returns a full path for result file', async () => {
    const resultFilePath = await pageLoader('https://test-page.ru', { output: tmpDir });
    expect(resultFilePath).toBe(`${tmpDir}/test-page-ru.html`);
  });

  test('creates file', async () => {
    const resultFilePath = await pageLoader('https://test-page.ru', { output: tmpDir });
    const content = await fs.readFile(resultFilePath, { encoding: 'utf-8' });
    expect(content).toBe('test page');
  });
});
