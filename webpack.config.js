const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { getDefinitions } = require('./env/publicRuntimeConfig');

module.exports = (env, argv) => ({
  entry: {
    app: ['@babel/polyfill', './src/app/index.tsx'],
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'dist/inapp'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        include: /(fonts|images)\//,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              prettier: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      '@sentry/node': '@sentry/browser',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        collapseWhitespace: true,
        processConditionalComments: true,
        minifyJS: argv.mode === 'production',
      },
    }),
    new webpack.DefinePlugin(getDefinitions('')),
  ],
  devServer: {
    compress: true,
    disableHostCheck: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    open: false,
    port: 9000,
  },
  devtool: 'inline-source-map',
  optimization: {
    minimizer:
      env === 'production'
        ? [
            new TerserPlugin({
              sourceMap: true,
            }),
          ]
        : [],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
});
