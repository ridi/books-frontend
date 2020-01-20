// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const wp = require('@cypress/webpack-preprocessor');

module.exports = (on, config) => {
  // ref: https://docs.cypress.io/api/plugins/browser-launch-api.html#Usage

  const options = {
    webpackOptions: require('../cypress.webpack.config'),
  };
  on('file:preprocessor', wp(options));

  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      args.push('--disable-dev-shm-usage');
      return args;
    }

    return args;
  });
};
