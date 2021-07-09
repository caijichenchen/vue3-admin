import { createVNode } from './vnode'

export function createAppAPI(render) {
  return function createApp(rootComponent, rootProps) {
    const app = {
      _props: rootProps,
      _component: rootComponent,
      _container: null,
      mount: function (container) {
        //1.创建虚拟节点
        const vnode = createVNode(rootComponent, rootProps)
        //2.渲染
        render(vnode, container)
        app._container = container
      },
    }
    return app
  }
}
