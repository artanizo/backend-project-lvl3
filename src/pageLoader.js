import axios from 'axios';
import * as fs from 'fs/promises';
import composeResultPath from './composeResultPath.js';

export const downloadPage = (url, output) => {
  const filename = composeResultPath(url, output);
  return axios.get(url)
    .then(({ data }) => fs.writeFile(filename, data, { encoding: 'utf-8' }))
    .then(() => Promise.resolve(filename));
};

const pageLoader = (url, { output }) => downloadPage(url, output);

export default pageLoader;
