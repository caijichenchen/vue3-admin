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
  chainWebpack(config) {
    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', (config) =>
        config.devtool('cheap-source-map'),
      )
  },
}
