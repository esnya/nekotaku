
const isCoverage = process.env.NODE_ENV === 'coverage';

module.exports = {
  configureWebpack: {
    entry: './src/browser',
    module: {
      rules: [
        {
          test: /\.js$/,
          loaders: 'babel-loader',
        },
        {
          test: /\.md$/,
          use: 'file-loader',
        },
      ].concat(isCoverage ? [
        {
          test: /\.js$/,
          exclude: /node_modules|tests|dist/,
          use: {
            loader: 'istanbul-instrumenter-loader',
            options: { esModules: true },
          },
        },
      ] : []),
    },
    target: isCoverage ? 'node' : undefined,
  },
};
