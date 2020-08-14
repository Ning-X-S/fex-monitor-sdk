const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { version } = require('../package.json')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: 'jarvis-sdk.' + version + '.min.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'Jarvis',
    libraryTarget: 'window',
    libraryExport: 'default'
  },
  plugins: [
    // clean-webpack-plugin 预设的刪除目录为 output.path 指定的目录
    new CleanWebpackPlugin({
      verbose: true // 输入日志
    })
  ]
})
