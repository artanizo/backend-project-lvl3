import path from 'path';

const normalize = (str) => str.replace(/[^a-zA-Z0-9]/g, '-');

export const parseUrl = ({ url, baseUrl }) => new URL(url, baseUrl);
export const getNormalizedName = ({ parsedUrl, isFileLink = false }) => {
  const { hostname, pathname } = parsedUrl;
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
  const parsedUrl = parseUrl({ url, baseUrl: url });
  const normalizedName = getNormalizedName({ parsedUrl });
  const htmlPath = composeHtmlFileName(normalizedName, output);
  const fullFilesPath = composeFilesDirName(normalizedName, output);
  return [htmlPath, fullFilesPath];
};

export default composeResultPath;
