import { hasOwnProperty } from '@vue3-mini/shared'

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, props, data } = instance
    if (hasOwnProperty(setupState, key)) {
      return setupState[key]
    } else if (hasOwnProperty(props, key)) {
      return props[key]
    } else if (hasOwnProperty(data, key)) {
      return data[key]
    } else {
      return undefined
    }
  },
  set({ _: instance }, key, value) {
    const { setupState, props, data } = instance
    if (hasOwnProperty(setupState, key)) {
      setupState[key] = value
    } else if (hasOwnProperty(props, key)) {
      props[key] = value
    } else if (hasOwnProperty(data, key)) {
      data[key] = value
    }
  },
}
