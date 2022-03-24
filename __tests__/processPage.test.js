import {
  beforeEach, describe, expect, test,
} from '@jest/globals';
import path, { dirname } from 'path';
import * as fs from 'fs/promises';
import os from 'os';
import nock from 'nock';
import _ from 'lodash';
import { fileURLToPath } from 'url';
import processPage from '../src/processPage.js';
import composeResultPath from '../src/composeResultPath.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let tmpDir;

const pngFixture = path.resolve(__dirname, '__fixtures__', 'test.png');

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));

  nock('https://test-page.ru')
    .get('/')
    .reply(200, '<html><head></head><body>test page</body></html>');

  nock('https://test-image-page.ru')
    .get('/')
    .reply(
      200,
      '<html><head></head><body><img src="/hello.png">test page</body></html>',
    )
    .get('/hello.png')
    .replyWithFile(200, pngFixture);
});

describe('processPage', () => {
  test('creates file', async () => {
    const [htmlpath, filesDirPath] = composeResultPath(
      'https://test-page.ru',
      tmpDir,
    );
    const resultFilePath = await processPage(
      'https://test-page.ru',
      htmlpath,
      filesDirPath,
    );
    const content = await fs.readFile(resultFilePath, { encoding: 'utf-8' });
    expect(content).toBe('<html><head></head><body>test page</body></html>');
    expect(resultFilePath).toBe(`${tmpDir}/test-page-ru.html`);
  });

  test('saves images', async () => {
    const [htmlpath, filesDirPath] = composeResultPath(
      'https://test-image-page.ru',
      tmpDir,
    );
    const resultFilePath = await processPage(
      'https://test-image-page.ru',
      htmlpath,
      filesDirPath,
    );
    const content = await fs.readFile(resultFilePath, { encoding: 'utf-8' });

    const expectedImgPath = `${filesDirPath}/test-image-page-ru-hello.png`;
    expect(content).toBe(
      `<html><head></head><body><img src="${expectedImgPath}">test page</body></html>`,
    );

    const files = await fs.readdir(filesDirPath);
    const imageFiles = files.filter((x) => _.endsWith(x, 'png'));
    expect(imageFiles.length).toBe(1);
  });
});
