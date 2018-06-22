const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const utils = require('./utils')
const shareConfig = require('./webpack.share.dev.config')
const appConfig = merge(webpackBaseConfig, {
  entry: {
    app: './src/main.js'
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
      name: 'vendors',
      filename: 'vendors.js'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.tpl',
      inject: true
    })
  ],
  externals: {
    'AMap': 'AMap'
  }
})
module.exports = [shareConfig, appConfig];
