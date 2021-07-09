vue-next 架构分析

1. Monorepo 介绍
   `Monprepo`是管理项目的一种方式，指在一个项目(repo)中管理多个模块/包(package)
   优点: 1、一个仓库可以维护多个模块，不用到处找仓库
   2、方便版本管理和依赖管理，模块之间的引用，调用方便
   缺点：仓库体积变大
2. 依赖
   typescript
   rollup 打包工具
   rollup-plugin-typescript2 rollup 和 ts 的桥梁
   @rollup/plugin-node-resolve 解析 node 的第三方模块
   @rollup/plugin-json 支持引入 json
   execa 开启子进程方便执行命令

vue3-mini
package.json

1. private 私有化
2. workspaces 子模块
3. scripts 打包执行命令

reactivity
package.json

1. name 关联 vue3-mini 下的子项目名称
2. main commonjs 使用
3. module 当使用 webpack/es6 导出时编译寻找的模块 importxxx
4. buildOptions 自定义字段规则
   4.1 name 模块名称
   4.2 formats
   4.2.1
