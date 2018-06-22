const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const utils = require('./utils')
module.exports = merge(webpackBaseConfig, {
  entry: {
    share: './src/share-main.js'
  },
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    port: config.dev.port, //设置端口号
    proxy: config.dev.proxyTable
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.js',
      minchunks: 'infinity'
    }),
    new HtmlWebpackPlugin({
      filename: 'share.html',
      template: 'share.tpl',
      inject: true
    })
  ],
  externals: {
    'AMap': 'AMap'
  }
});
