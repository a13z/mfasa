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
  if (page.path.match(/^\/app\/asamanager/)) {
    page.matchPath = '/app/asamanager/*';

    // Update the page.
    createPage(
      {
        path: '/app/asamanager/',
        matchPath: '/app/asamanager/:assetId',
        component: path.resolve('./src/components/asamanager.js'),
      },
    );
  }
  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/app/)) {
    page.matchPath = '/app/*';

    createPage(page);
  }

  if (page.path.match(/^\/account/)) {
    page.matchPath = '/account/*';

    createPage(page);
  }
};
