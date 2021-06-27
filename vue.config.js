'use strict'
const setting = require('./src/config/setting.ts')
// const path = require('path')

// const resolve = (dir) => path.resolve(__dirname, dir)

module.exports = {
  publicPath: './',
  devServer: {
    open: true, // 自动打开浏览器 也可以在package.json运行命令（如：serve）后加--open
    hot: true, // 热更新
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
