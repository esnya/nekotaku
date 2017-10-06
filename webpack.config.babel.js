import path from 'path';
import webpack from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';

const devtool = isProduction ? 'source-map' : 'eval-source-map';

const plugins = isProduction ? [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"',
    },
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false,
    },
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
  }),
] : [];

export default {
  entry: ['babel-polyfill', './src/browser'],
  output: {
    path: path.resolve(__dirname, './public/assets'),
    publicPath: '/assets/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          { loader: 'postcss-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          { loader: 'postcss-loader', options: { sourceMap: true } },
          'stylus-loader',
        ],
      },
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          'eslint-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            loaders: {
              js: [
                'babel-loader',
                'eslint-loader',
              ],
            },
          },
        }],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|md)$/,
        use: 'file-loader',
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  devServer: {
    contentBase: path.resolve(__dirname, './public'),
    historyApiFallback: true,
    noInfo: true,
  },
  performance: {
    hints: false,
  },
  devtool,
  plugins,
};
