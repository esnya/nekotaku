const off = 'off';
const warn = 'warn';
const error = 'error';

// ToDo
const parseErroredRules = {
  'import/named': off,
  'import/no-named-as-default': off,
  'import/no-named-as-default-member': off,
};

module.exports = {
  root: true,
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  plugins: [
    'sort-imports-es6-autofix',
  ],
  rules: {
    ...parseErroredRules,
    'class-methods-use-this': off,
    'import/prefer-default-export': off,
    'lines-between-class-members': off,
    'no-restricted-imports': [warn, { paths: ['lodash', 'models'] }],
    // 'sort-imports-es6-autofix/sort-imports-es6': error,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        semi: 'off',
      },
    },
    {
      files: ['browser/**/*'],
      env: {
        browser: true,
      },
    },
    {
      files: ['server/**/*'],
      env: {
        node: true,
      },
    },
  ],
};
