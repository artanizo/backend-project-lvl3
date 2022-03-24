import axios from 'axios';
import * as fs from 'fs/promises';
import * as cheerio from 'cheerio';
import _ from 'lodash';
import { getNormalizedName } from './composeResultPath.js';

const downloadFile = (url, type = 'json') => axios
  .get(url, { responseType: type })
  .then(({ data }) => Promise.resolve(data));
const saveFile = (filename, content) => fs.writeFile(filename, content);

const parseHtml = (html) => {
  const $ = cheerio.load(html);
  return Promise.resolve($);
};

const processImages = ($, filesDir, baseUrl) => {
  const imageExts = ['png', 'jpg', 'jpeg'];
  const imgTags = $('img');
  const imgUrls = [];
  imgTags.each((i, item) => {
    const imgUrl = $(item).attr('src');
    if (imageExts.some((ext) => _.endsWith(imgUrl, ext))) {
      const realUrl = _.startsWith(imgUrl, '/') ? `${baseUrl}${imgUrl}` : imgUrl;
      const normalizedName = getNormalizedName(realUrl, true);
      const innerPath = [filesDir, normalizedName].join('/');
      imgUrls.push({
        url: realUrl,
        filename: innerPath,
      });
      $(item).attr('src', innerPath);
    }
  });

  return Promise.all(
    imgUrls.map((img) => downloadFile(img.url, 'stream').then((file) => saveFile(img.filename, file))),
  ).then(() => Promise.resolve($));
};

const processPage = (url, htmlPath, filesDirPath) => fs
  .mkdir(filesDirPath)
  .then(() => downloadFile(url))
  .then((data) => parseHtml(data))
  .then(($) => processImages($, filesDirPath, url))
  .then(($) => saveFile(htmlPath, $.html()))
  .then(() => Promise.resolve(htmlPath));

export default processPage;
