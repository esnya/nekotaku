const off = 'off';
const warn = 'warn';
// const error = 'error';

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  rules: {
    'class-methods-use-this': off,
    'import/prefer-default-export': off,
    'lines-between-class-members': off,
    'no-restricted-imports': [warn, { paths: ['lodash'] }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  overrides: [
    {
      files: ['**/*.ts'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
};
