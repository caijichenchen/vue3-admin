import { useStore } from 'vuex'
import { computed, defineComponent, h, ref } from 'vue'
import { useRoute } from 'vue-router'
import { RouteItem } from '@/router/router.type'
import asideMenus from './components/aside-menu.vue'
// import { renderSubMenu } from './components/as-menu'

// defineComponent对于export default{}写法有更好的ts语法支持
export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRoute()
    const currentPath = ref(router.path)
    const routes = computed<RouteItem[]>(
      () => store.state.permission.routersMap,
    )
    const collapse = computed(() => store.state.app.asideOpen)

    const emptyAside = h('div', { class: 'vd-container-aside-empty' }, [
      h('i', { class: 'el-icon-s-grid' }),
      h('span', {}, '暂无侧边栏菜单'),
    ])

    const asideMenu = h(asideMenus, {
      routes: routes,
    })

    return () =>
      h(
        'div',
        {
          class: 'vd-container-aside-wrapper',
        },
        [routes.value.length > 0 ? 1 : collapse.value ? emptyAside : []],
      )
  },
})
