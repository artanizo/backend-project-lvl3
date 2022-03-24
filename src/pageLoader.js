import composeResultPath from './composeResultPath.js';
import processPage from './processPage.js';

const pageLoader = (url, { output }) => {
  const [filename, files] = composeResultPath(url, output);
  return processPage(url, filename, files);
};

export default pageLoader;
