import Loading from '.'

const createVLoadInstance = (el, binding) => {
  const text = el.getAttribute('vd-loading-text')
  const spinner = el.getAttribute('vd-loading-spinner')
  const background = el.getAttribute('vd-loading-background')
  // const vm = binding.instance //拿到组件实例
  el.instance = Loading({
    text: text || '加载中',
    spinner: spinner || '',
    background: background || '',
    target: el, // 父节点
    visible: true,
  })
}
/**
 * v-loading应该有的功能
 */
const vLoad = {
  mounted(el, binding) {
    if (!!binding.value) {
      createVLoadInstance(el, binding)
    }
  },
}

export default vLoad
