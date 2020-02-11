/* eslint-disable no-process-env */
/* eslint-disable @typescript-eslint/no-var-requires */
const { InjectManifest } = require('workbox-webpack-plugin');
const nextSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map',
});
const SentryCliPlugin = require('@sentry/webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const withCSS = require('@zeit/next-css');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const webpack = require('webpack');
const withTM = require('next-transpile-modules');

require('dotenv').config();
const { getDefinitions } = require('./env/publicRuntimeConfig');

const STATIC_CDN_URL = process.env.STATIC_CDN_URL || '';
const ENVIRONMENT = process.env.ENVIRONMENT || 'local';

module.exports = withBundleAnalyzer(
  nextSourceMaps(
    withCSS(
      withTM({
        transpileModules: ['p-retry'], // for IE11
        distDir: '../build',
        assetPrefix: STATIC_CDN_URL || 'https://books.ridicdn.net',
        useFileSystemPublicRoutes: false,
        exportPathMap: () => ({}),
        webpack(config, option) {
          const { isServer, buildId } = option;
          if (!isServer) {
            config.resolve.alias['@sentry/node'] = '@sentry/browser';
          }
          // eslint-disable-next-line prefer-template
          config.output.publicPath = STATIC_CDN_URL + '/_next/';

          const modifyEntries = entries => {
            if (!('main.js' in entries)) {
              return entries;
            }
            if (typeof entries['main.js'] === 'string') {
              entries['main.js'] = [entries['main.js']];
            }
            const entry = entries['main.js'];
            if (!entry.includes('@babel/polyfill/noConflict')) {
              entry.unshift('@babel/polyfill/noConflict');
            }
            if (!entry.includes('intersection-observer')) {
              entry.unshift('intersection-observer');
            }
            return entries;
          };
          if (typeof config.entry === 'function') {
            const prevEntry = config.entry;
            config.entry = () => {
              const entries = prevEntry();
              if (typeof entries.then === 'function') {
                return entries.then(modifyEntries);
                // eslint-disable-next-line no-else-return
              } else {
                return modifyEntries(entries);
              }
            };
          } else {
            modifyEntries(config.entry);
          }

          config.module.rules.push({
            test: /\.(eot|woff|woff2|ttf|png|jpg|gif)$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 100000,
                name: '[name].[ext]',
              },
            },
          });
          config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
          });

          if (!['local', 'profile'].includes(ENVIRONMENT)) {
            config.plugins.push(
              new SentryCliPlugin({
                include: ['./build/', './src/'],
                release: buildId,
                urlPrefix: '~/_next/',
                ignoreFile: '.sentrycliignore',
                entries: [],
                ignore: ['coverage', 'server', 'node_modules', 'webpack.config.js'],
                rewrite: true,
              }),
            );
          }
          config.plugins.push(
            new CopyPlugin([
              {
                from: '../static/manifest.webmanifest',
                to: '',
                transform(content) {
                  return Promise.resolve(
                    Buffer.from(content, 'utf8')
                      .toString()
                      .replace(/<path>/gi, STATIC_CDN_URL),
                  );
                },
              },
            ]),
          );
          config.plugins.push(
            new InjectManifest({
              swSrc: 'static/service-worker.js',
              exclude: [
                /\.map$/,
                /\/pages\/partials\//,
                /build-manifest\.json/,
                /manifest\.webmanifest/,
              ],
            }),
          );
          config.plugins.push(new webpack.DefinePlugin(getDefinitions(buildId)));

          config.node = {
            net: 'empty',
            fs: 'empty',
          };
          return config;
        },
        analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
        analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
        bundleAnalyzerConfig: {
          server: {
            analyzerMode: 'static',
            reportFilename: '../bundles/server.html',
          },
          browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html',
          },
        },
      }),
    ),
  ),
);
