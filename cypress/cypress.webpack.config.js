module.exports = {
  mode: 'development',
  // make sure the source maps work
  devtool: 'eval-source-map',
  // webpack will transpile TS and JS files
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript'],
            },
          },
        ],
      },
    ],
  },
};
