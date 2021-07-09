import { createRender } from '@vue3-mini/runtime-core'
import { assign } from '@vue3-mini/shared'
import { nodeOpts } from './nodeOps'
import { patchProps } from './patchProps'
/**
 * runtime-dom 核心
 * 1. 提供domAPI
 * 2. 操作节点、属性
 */

const renderOptions = assign({ patchProps }, nodeOpts)

/**
 * 用户调用runtime-dom --> runtime-core
 * runtime-dom就是为了解决平台差异（浏览器的）和一些基本的dom操作 挂载渲染结果
 * runtime-core主要是用来渲染的
 */
export function createApp(rootComponent, rootProps = null) {
  const app = createRender(renderOptions).createApp(rootComponent, rootProps)
  const { mount } = app
  app.mount = function (container) {
    // 清空容器
    container = nodeOpts.querySelector(container)
    container.innerHTML = ''
    mount(container)
  }
  return app
}
