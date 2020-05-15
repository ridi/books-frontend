/* eslint-disable no-process-env */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const fs = require('fs');
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const nextEnv = require('next-env');
const withTM = require('next-transpile-modules');
const withImages = require('next-images');
const withFonts = require('next-fonts');
const withSvgr = require("next-svgr");
const nextSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map',
});
const SentryCliPlugin = require('@sentry/webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

require('dotenv').config(process.env.STAGE === 'production' ? {
  path: path.resolve(process.cwd(), '.env.production'),
} : {});

const nextConfig = {
  assetPrefix: process.env.ASSET_PREFIX,
  distDir: 'build',
  experimental: {
    redirects() {
      return [
        {
          source: "/general",
          destination: "/",
          permanent: true,
        },
        {
          source: "/general/:path+",
          destination: "/:path+",
          permanent: true,
        },
      ];
    },
    rewrites() {
      return [
        ...fs
          .readdirSync('./src/pages/[genre]')
          .map(filename => filename.replace(/^(?:index|(.*))\.tsx$/, '$1'))
          .map(path => ({
            source: `/${path}`,
            destination: `/general/${path}`,
          })),
        {
          source: '/manifest.webmanifest',
          destination: '/api/manifest.webmanifest',
        },
      ];
    },
  },
  webpack (config, { buildId, isServer, webpack }) {
    if (process.env.NODE_ENV === 'production') {
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

    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      if (
        entries['main.js'] &&
        !entries['main.js'].includes('./src/polyfills.js')
      ) {
        entries['main.js'].unshift('./src/polyfills.js');
      }

      return entries;
    };

    config.plugins.push(
      new InjectManifest({
        swSrc: 'src/service-worker.js',
        exclude: [
          /\.map$/,
          /\/pages\/partials\//,
          /build-manifest\.json/,
          /manifest\.webmanifest/,
        ],
      }),
    );

    config.plugins.push(new webpack.DefinePlugin({
      'process.env.USE_CSR': JSON.stringify(process.env.USE_CSR),
      'process.env.STAGE': JSON.stringify(process.env.STAGE),
      'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
      'process.env.BUILD_ID': JSON.stringify(buildId),
      'process.env.IS_SERVER': JSON.stringify(isServer),
      'process.env.IS_PRODUCTION': JSON.stringify(process.env.NODE_ENV === 'production'),
    }));

    config.node = {
      net: 'empty',
      fs: 'empty',
    };

    return config;
  },
};

module.exports = withPlugins([
  [withBundleAnalyzer, {
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
  }],
  [withTM, {
    transpileModules: ['p-retry', 'entities'],
  }],
  [withImages, {
    inlineImageLimit: 0,
    exclude: path.resolve(__dirname, 'src/svgs'),
  }],
  [withFonts],
  [withSvgr],
  [nextEnv()],
  [nextSourceMaps],
], nextConfig);
