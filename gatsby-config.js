module.exports = {
  // plugins: [
  //     new webpack.DefinePlugin({ "global.GENTLY": false })
  // ]
  plugins: [
    {
      resolve: 'gatsby-plugin-prettier-eslint',
      options: {
        watch: true, // format/lint on save
        prettier: {
          patterns: [
            // the pattern "**/*.{js,jsx,ts,tsx}" is not used because we will rely on `eslint --fix`
            '**/*.{css,scss,less}',
            '**/*.{json,json5}',
            '**/*.{graphql}',
            '**/*.{md,mdx}',
            '**/*.{html}',
            '**/*.{yaml,yml}',
          ],
        },
        eslint: {
          patterns: '**/*.{js,jsx,ts,tsx}',
          emitWarning: true, // if true, will emit lint warnings
          customOptions: {
            fix: true,
            cache: true,
          },
        },
      },
    },
  ],
  flags: {
    DEV_SSR: false,
  },
};
