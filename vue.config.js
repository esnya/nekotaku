const path = require('path');

const isCoverage = process.env.NODE_ENV === 'coverage';
const isTest = isCoverage || process.env.NODE_ENV === 'test';

const baseRules = [
  {
    test: /\.js$/,
    loaders: 'babel-loader',
  },
  {
    test: /\.md$/,
    use: 'file-loader',
  },
];

const coverageRules = [
  {
    test: /\.js$/,
    exclude: /node_modules|tests|dist|config\.js|\.eslintrc\.js/,
    use: {
      loader: 'istanbul-instrumenter-loader',
      options: { esModules: true },
    },
  },
];

module.exports = {
  configureWebpack: {
    entry: './src/browser',
    module: {
      rules: isCoverage ? coverageRules.concat(baseRules) : baseRules,
    },
    resolve: {
      alias: isTest ? {
        canvas: path.resolve(__dirname, 'tests/mocks/empty.js'),
        'socket.io': path.resolve(__dirname, 'tests/mocks/empty.js'),
        'socket.io-client': path.resolve(__dirname, 'tests/mocks/empty.js'),
        'bcdice-js$': path.resolve(__dirname, 'tests/mocks/bcdice-js.js'),
      } : undefined,
    },
    target: isTest ? 'node' : undefined,
  },
};
