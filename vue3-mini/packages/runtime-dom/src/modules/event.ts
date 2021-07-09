export const patchEvent = (el, key, value) => {
  const eventName = key.slice(2).toLowerCase()
  const invokers = el._vei || (el._vei = {})
  let exists = invokers[eventName] // 取出老的
  if (value && exists) {
    // 新的老的都存在  更新事件
    exists.value = value
  } else {
    if (value) {
      // 新的有 添加事件
      const invoker = (invokers[eventName] = createInvoker(value))
      el.addEventListener(eventName, invoker)
    } else {
      // 老的有 移除事件
      el.removeEventListener(eventName, exists)
      exists = undefined
    }
  }
}

function createInvoker(value) {
  const invoker = (e) => {
    invoker.value(e)
  }
  invoker.value = value
  return invoker
}
