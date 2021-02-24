// const { default: ASAManager } = require('./src/pages/asamanager');

exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        'global.GENTLY': false,
      }),
    ],
  });
};

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;
  const path = require('path');

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/asamanager/)) {
    page.matchPath = '/asamanager/*';

    // Update the page.
    createPage(
      {
        path: '/asamanager/',
        matchPath: '/asamanager/:assetId',
        component: path.resolve('./src/pages/asamanager.js'),
      },
    );
  }
};
