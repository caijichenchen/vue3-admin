import { defineComponent, h } from 'vue'
// 模拟权限页面
export default defineComponent({
  setup() {
    return () => h('div', {}, 'admin权限页面')
  },
})
