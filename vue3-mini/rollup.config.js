// rollup的配置
import path from 'path'
import json from '@rollup/plugin-json'
import resolvePlugin from '@rollup/plugin-node-resolve'
import ts from 'rollup-plugin-typescript2'

// 根据环境变量中的target属性拿到对应的package.json
// console.log(process.env.TARGET, 'rollup')
const packagesDir = path.resolve(__dirname, 'packages') // 找到packages

const packageItemDir = path.resolve(packagesDir, process.env.TARGET) // 找到对应的某个包

const resolve = (p) => path.resolve(packageItemDir, p) // 永远针对的是某个模块

const pkg = require(resolve('package.json'))

// 取文件名
const name = path.basename(packageItemDir)

// 对打包类型先做一个映射表，根据所提供的formats配置信息格式化打包内容
const outputConfig = {
  // 自定义
  'esm-builder': {
    file: resolve(`dist/${name}.esm-builder.js`),
    format: 'es', // es
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs', // node
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife', // 立即执行
  },
}

const options = pkg.buildOptions // 在子模块package.json中的自定义配置
// console.log('options', options)
function createConfig(format, output) {
  output.name = options.name
  output.sourcemap = true // 生产sourcemap
  // 生成rollup配置
  return {
    input: resolve('src/index.ts'),
    output,
    plugins: [
      json(),
      ts({ tsconfig: path.resolve(__dirname, 'tsconfig.json') }),
      resolvePlugin(),
    ],
  }
}
// rollup最终导出配置
export default options.formats.map((format) =>
  createConfig(format, outputConfig[format]),
)
