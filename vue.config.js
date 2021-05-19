'use strict'
const setting = require('./src/config/setting.ts')
// const path = require('path')

// const resolve = (dir) => path.resolve(__dirname, dir)

module.exports = {
  publicPath: './',
  devServer: {
    open: true,
    hot: true,
  },
  configureWebpack: {
    name: setting.name,
  },
}
