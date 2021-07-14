import { h } from 'vue'

const lazyLoad = (component) => {
  return Promise.resolve({
    render() {
      return h(component)
    },
  })
}
