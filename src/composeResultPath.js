import path from 'path';

const normalize = (str) => str.replace(/[^a-zA-Z0-9]/g, '-');

export const getNormalizedName = (url, isFileLink = false) => {
  const { hostname, pathname } = new URL(url);
  if (isFileLink) {
    const { dir, name, ext } = path.parse(pathname);
    const normalizedFileName = normalize(`${hostname}${dir === '/' ? '' : dir}/${name}`);
    return [normalizedFileName, ext].join('');
  }
  return normalize([hostname, pathname === '/' ? '' : pathname].join(''));
};

const composeHtmlFileName = (processedName, output) => `${output}/${processedName}.html`;
const composeFilesDirName = (processedName, output) => `${output}/${processedName}_files`;

const composeResultPath = (url, output) => {
  const normalizedName = getNormalizedName(url);
  const htmlPath = composeHtmlFileName(normalizedName, output);
  const fullFilesPath = composeFilesDirName(normalizedName, output);
  return [htmlPath, fullFilesPath];
};

export default composeResultPath;
