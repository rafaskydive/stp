const webpack = require('webpack');
const ElectronPackager = require("webpack-electron-packager");

module.exports = {
  entry: './src/main.js',
  output: {
    path: './build',
    publicPath: './build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style!css', exclude: /node_modules/ },
      { test: /\.scss$/, loader: 'style!css!sass', exclude: /node_modules/ },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },
      {
        test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader : 'url-loader'
      }
    ]
  },
  plugins: [
    // new ElectronPackager({
    //   dir: "./",
    //   arch: "x64",
    //   platform: "darwin",
    //   out: "dist",
    //   overwrite: true,
    //   prune: true,
    //   asar: true
    // }),
    new ElectronPackager({
      dir: "./",
      arch: "ia32",
      platform: "win32",
      out: "dist",
      overwrite: true,
      prune: true,
      asar: true
    })

  ],
  devtool: 'source-map',
};
