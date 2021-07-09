import { isFunction, isObject, ShapeFlags } from '@vue3-mini/shared'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
// 组件的方法

export const createComponentInstance = (vnode) => {
  //webcomponent 组件需要有属性、插槽
  const instance = {
    //组件实例
    vnode,
    type: vnode.type,
    props: {},
    attrs: {},
    ctx: {},
    slots: {},
    setupState: {}, // 如果setup返回是一个对象 将作为setupState的值
    render: null,
    isMounted: false, //是否被挂载
  }
  instance.ctx = { _: instance }
  return instance
}

export const setupComponent = (instance) => {
  const { props, children } = instance.vnode
  instance.props = props // initProps
  instance.children = children //initSlot 插槽的解析
  // 先判断当前组件是不是有状态的组件 函数组件
  const isStateful = instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
  if (isStateful) {
    // 有状态的组件
    // 调用组件的setup方法  拿到返回值填充setupState和render
    setupStatefulComonent(instance)
  }
}

function setupStatefulComonent(instance) {
  // 1.代理 render方法里参数为proxy 但是可以直接访问到instance的各种属性 代理一层
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers as any)
  //2.获取组件类型  调用setup
  const component = instance.type
  const { setup } = component
  if (setup) {
    const setupContext = createSetupContext(instance)
    const setupResult = setup(instance.props, setupContext)
    handleSeupResult(instance, setupResult)
  } else {
    finishComponentSetup(instance)
  }

  // component.render(instance.proxy)
}

function handleSeupResult(instance, setupResult) {
  if (isFunction(setupResult)) {
    instance.render = setupResult
  } else if (isObject(setupResult)) {
    instance.setupState = setupResult
  }
}

function finishComponentSetup(instance) {
  const component = instance.type
  if (!instance.render) {
    // 对模板进行编译 生成render函数
    if (!component.render && component.template) {
      // 编译结果赋值给render
    }
  }
  // 对vue2.x兼容处理 applyOptions 遍历
}

function createSetupContext(instance) {
  return {
    attrs: instance.attrs,
    props: instance.props,
    slots: instance.slots,
    emit: () => {
      //
    },
    expose: () => {
      //
    },
  }
}
