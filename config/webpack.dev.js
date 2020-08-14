const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common,
  {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      contentBase: path.resolve(__dirname, '../lib'),
      hot: true,
      host: 'localhost',
      port: '8888',
      inline: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.ejs',
        filename: 'index.html',
        inject: 'head'
      })
    ]
  }
)
