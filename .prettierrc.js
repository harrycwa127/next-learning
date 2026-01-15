module.exports = {
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  semi: true,
  settings: {
    // Support absolute imports
    // https://www.npmjs.com/package/eslint-import-resolver-alias
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
