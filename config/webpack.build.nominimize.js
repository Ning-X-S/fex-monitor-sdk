const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: false
  },
  output: {
    filename: 'jarvis-sdk.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'Jarvis',
    libraryTarget: 'window',
    libraryExport: 'default'
  }
})
