// 只针对某个模块打包

const ENTRY_KEY = 'packages'
const fs = require('fs')
const execa = require('execa') // 开启子进程打包 最终使用的还是rollup

// 读取packages
const files = fs
  .readdirSync(ENTRY_KEY)
  .filter((file) => fs.statSync(`${ENTRY_KEY}/${file}`).isDirectory())

// 对目标进行并行打包
async function build(source) {
  console.log('source', source)
  // 执行rollup命令 -cw表示监控某个配置文件 环境变量  / 子进程打包的信息共享给父进程
  await execa('rollup', ['-cw', '--environment', `TARGET:${source}`], {
    stdio: 'inherit',
  })
}

build('runtime-dom')

// function runParallel(files, callback) {
//   const result = []
//   for (let i = 0; i < files.length; i++) {
//     const res = callback(files[i])
//     result.push(res)
//   }
//   return Promise.all(result)
// }

// runParallel(files, build)
