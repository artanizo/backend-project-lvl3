const getFilename = (url) => {
  const { hostname, pathname } = new URL(url);
  const filename = [hostname, pathname === '/' ? '' : pathname].join('').replace(/[^a-zA-Z0-9]/g, '-');
  return [filename, 'html'].join('.');
};

const composeResultPath = (url, output) => {
  const filename = getFilename(url);
  return [output, filename].join('/');
};

export default composeResultPath;
