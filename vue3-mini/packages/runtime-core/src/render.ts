import { createComponentInstance, setupComponent } from './components'
import { isObject, ShapeFlags } from '@vue3-mini/shared'
/**
 * 渲染流程
 * 1. 将组件转化成虚拟dom
 * 2. 将虚拟dom转换成真实dom
 */

import { createAppAPI } from './apicreateApp'
import { effect } from '@vue3-mini/reactivity'
import { createVNode, normalizeVNode, Text } from './vnode'
import { queueJob } from './scheduler'

export function createRender(renderOptions) {
  const {
    createElement: hostCreateElement,
    remove: hostRemove,
    insert: hostInsert,
    querySelector: hostQuerySelector,
    setElementText: hostSetElementText,
    createText: hostCreateText,
    setText: hostSetText,
    patchProps: hostPatchProps,
    nextSibling: hostNextSibling,
  } = renderOptions
  // -----------组件start---------
  const setupRenderEffect = (instance, container) => {
    //需要创建一个effect 在effect中调用render方法，这样render方法中拿到的数据会收集这个effect，属性更新时effect重新执行
    //每个组件都会有一个effect vue3是组件级更新 数据重新变化重新执行组件的effect
    instance.update = effect(
      function componentEffect() {
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
          console.log('更新')
          const prevTree = instance.subTree
          const proxyToUse = instance.proxy
          const nextTree = instance.render.call(proxyToUse, proxyToUse)
          patch(prevTree, nextTree, container)
        }
      },
      {
        scheduler: queueJob,
      },
    )
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
      console.log('gengxin')
    }
  }
  //-------------组件end---------
  // ----------元素start----------
  const mountChildren = (children, el) => {
    children.forEach((child) => {
      const normalizeChild = normalizeVNode(child)
      patch(null, normalizeChild, el)
    })
  }
  const mountElement = (vnode, container, ancher) => {
    const { type, props, shapeFlag, children } = vnode
    const el = (vnode.el = hostCreateElement(type))
    if (props) {
      for (const key in props) {
        hostPatchProps(el, key, null, props[key])
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 文本
      hostSetElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el)
    }
    hostInsert(el, container, ancher)
  }
  const patchProps = (oldProps, newProps, el) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prev = oldProps[key]
        const next = newProps[key]
        prev !== next && hostPatchProps(el, key, prev, next)
      }
      for (const key in oldProps) {
        if (!newProps[key]) {
          hostPatchProps(el, key, oldProps[key], null)
        }
      }
    }
  }
  const unmountChildren = (children) => {
    children.forEach((child) => {
      unmount(child)
    })
  }
  const patchKeyedChildren = (c1, c2, el) => {
    let i = 0
    let e1 = c1.length - 1
    let e2 = c2.length - 1
    /**
     * key1: [a,b,c,d]
     * key2: [a,b,e,f]
     * 缩小后的diff核心是ef 尾部
     */
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      i++
    }
    /**
     * key1: [a,b,c,d]
     * key2: [e,f,c,d]
     * diff核心ef 首部
     */
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1 - 1]
      const n2 = c2[e2 - 1]
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      e1--
      e2--
    }
    // common sequence + mount
    // 有一方比较完成后 怎么确定挂载？
    // 1.如果i比e1大 说明老的少
    if (i > e1) {
      // 老的少 新的多
      if (i >= e2) {
        // 新增部分
        const nextPos = e2 + 1
        const ancher = nextPos < c2.length ? c2[nextPos].el : null
        while (i <= e2) {
          patch(null, c2[i], el, ancher)
          i++
        }
      } else if (i > e2) {
        // 老的多 新的少
        while (i <= e1) {
          unmount(c1[i])
          i++
        }
      } else {
        //乱序比较  一样的尽可能的复用
        const s1 = i
        const s2 = i
        // vue3是用新的做映射表  2是用老的做映射表
        const keyToNewIndexMap = new Map()
        for (let i = s2; i <= e2; i++) {
          const childVNode = c2[i]
          keyToNewIndexMap.set(childVNode.key, i)
        }
        // 去老的里面找有没有可以复用的
        for (let i = s1; i <= e1; i++) {
          const oldVNode = c1[i]
          const newIndex = keyToNewIndexMap.get(oldVNode.key)
          if (newIndex === undefined) {
            unmount(oldVNode)
          } else {
            patch(oldVNode, c2[newIndex], el)
          }
        }
      }
    }
  }
  const patchChildren = (oldValue, newValue, el) => {
    const c1 = oldValue.children
    const c2 = newValue.children
    const prevShapeFlag = oldValue.shapeFlag
    const nextShapeFlag = newValue.shapeFlag
    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 老的有多个孩子但新的是文本
        unmountChildren(c1)
      }
      if (c1 !== c2) {
        // 两个都是文本
        hostSetElementText(el, c2)
      }
    } else {
      // 新的是数组  上一次是文本或者数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 多子节点比较 核心
          patchKeyedChildren(c1, c2, el)
        } else {
          // 老的数组新的没有 删除老的
          unmountChildren(c1)
        }
      } else {
        // 老的是文本
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, '')
        }
        if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el)
        }
      }
    }
  }
  const patchElement = (oldValue, newValue, container) => {
    // 元素是相同节点
    const el = (newValue.el = oldValue.el)
    const oldProps = oldValue.props
    const newProps = newValue.props
    patchProps(oldProps, newProps, el)
    patchChildren(oldValue, newValue, el)
  }
  const processElement = (oldValue, newValue, container, ancher) => {
    if (oldValue === null) {
      mountElement(newValue, container, ancher)
    } else {
      patchElement(oldValue, newValue, container)
    }
  }
  // ----------元素end----------
  // -------文本start---------
  const processText = (oldVal, newVal, container) => {
    if (oldVal === null) {
      hostInsert((newVal.el = hostCreateText(newVal.children)), container)
    }
  }
  // -------文本end---------
  const unmount = (vnode) => {
    // 如果是组件调用组件生命周期
    hostRemove(vnode.el)
  }
  const isSameVNodeType = (oldVal, newVal) =>
    oldVal.type === newVal.type && newVal.key === oldVal.key
  function patch(oldVal, newVal, container, ancher = null) {
    // 这里做判断组件类别
    const { shapeFlag, type } = newVal
    if (oldVal && !isSameVNodeType(oldVal, newVal)) {
      // 把以前的删掉换成新的
      ancher = hostNextSibling(oldVal.el)
      unmount(oldVal)
      oldVal = null
    }
    switch (type) {
      case Text:
        processText(oldVal, newVal, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 元素
          processElement(oldVal, newVal, container, ancher)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 组件
          console.log(22222)
          processComponent(oldVal, newVal, container)
        }
    }
  }
  const render = (vnode, container) => {
    patch(null, vnode, container)
  }
  return {
    createApp: createAppAPI(render),
  }
}
