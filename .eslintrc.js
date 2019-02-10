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
  ],
  rules: {
    'class-methods-use-this': off,
    'no-restricted-imports': [warn, { paths: ['lodash'] }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
