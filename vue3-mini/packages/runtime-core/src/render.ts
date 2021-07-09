import { createComponentInstance, setupComponent } from './components'
import { ShapeFlags } from '@vue3-mini/shared'
/**
 * 渲染流程
 * 1. 将组件转化成虚拟dom
 * 2. 将虚拟dom转换成真实dom
 */

import { createAppAPI } from './apicreateApp'
import { effect } from '@vue3-mini/reactivity'

export function createRender(renderOptions) {
  const setupRenderEffect = (instance, container) => {
    //需要创建一个effect 在effect中调用render方法，这样render方法中拿到的数据会收集这个effect，属性更新时effect重新执行
    //每个组件都会有一个effect vue3是组件级更新 数据重新变化重新执行组件的effect
    effect(function componentEffect() {
      if (!instance.isMounted) {
        // 初次渲染
        const proxyToUse = instance.proxy
        // 2.x $vnode _vnode
        // 组件是vnode 真正渲染内容subTree
        const subTree = (instance.subTree = instance.render.call(
          proxyToUse,
          proxyToUse,
        ))
        patch(null, subTree, container)
        instance.isMounted = true
      } else {
        // 更新
      }
    })
  }
  const mountComponent = (initalVNode, container) => {
    /**
     * 组件渲染流程最核心的就是调用setup拿到返回值 获取render方法的返回结果
     * 1. 创建实例
     * 2. 需要的数据解析到实例上
     * 3. 创建一个effect 让render函数执行  render函数本身就是一个effect 依赖变化要重新执行
     */
    // 1. 创建实例
    const instance = (initalVNode.component =
      createComponentInstance(initalVNode))
    // 2. 需要的数据解析到实例上
    setupComponent(instance)
    // 3. 创建一个effect 让render函数执行  render函数本身就是一个effect 依赖变化要重新执行
    setupRenderEffect(instance, container)
  }
  const processComponent = (oldVale, newVal, container) => {
    if (oldVale === null) {
      // 旧的没有 创建
      mountComponent(newVal, container)
    } else {
      // 更新
    }
  }
  const patch = (oldVal, newVal, container) => {
    // 这里做判断组件类别
    const { shapeFlag } = newVal
    if (shapeFlag & ShapeFlags.ELEMENT) {
      // 元素
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      // 组件
      processComponent(oldVal, newVal, container)
    }
  }
  const render = (vnode, container) => {
    console.log(vnode, container)
    patch(null, vnode, container)
  }
  return {
    createApp: createAppAPI(render),
  }
}
