export const environment = {
  production: true,
  environmentName: 'DevHost',
  appVersion: require('../../package.json').version + '-devhost',
  apiUrl: 'http://localhost/api',
  imageBaseUrl: 'https://simplydoc-test.s3.ca-central-1.amazonaws.com',
};
