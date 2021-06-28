<template>
  <div class="vd-visited-group">
    <div class="vd-visited-content">
      <contextmenu-panel
        v-model="contextmenuInfo.visible"
        :x="contextmenuInfo.x"
        :y="contextmenuInfo.y"
      >
        <contextmenu-list
          :menu-list="contextmenuInfo.list"
          @click="handleContextmenu"
        />
      </contextmenu-panel>

      <el-tabs
        v-model="currentRoute"
        class="vd-visited-tabs"
        type="card"
        @tab-click="handleClick"
        @tab-remove="removeSelectTab"
        @contextmenu="openContextmenu"
      >
        <el-tab-pane
          v-for="item in visitedRoutes"
          :key="item.path"
          :label="item.title"
          :name="item.path"
          :closable="item.path !== '/vd-index'"
        />
      </el-tabs>
    </div>
    <div class="vd-visited-control-btn">
      <el-dropdown split-button size="medium" @command="handleContextmenu">
        <i class="el-icon-circle-close" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="menu in contextmenuInfo.list"
              :key="menu.value"
              :command="menu.value"
              :icon="menu.icon"
            >
              {{ menu.content }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { RouteItem } from '@/router/router.type'
import { computed, defineComponent, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import contextmenuPanel from '../contextmenu-panel/index'
import contextmenuList from '../contextmenu-panel/list'

export default defineComponent({
  components: { contextmenuPanel, contextmenuList },
  setup() {
    const store = useStore()
    const $route = useRoute()
    const router = useRouter()

    const menuList = [
      { icon: 'el-icon-d-arrow-left', content: '关闭左侧', value: 'left' },
      { icon: 'el-icon-d-arrow-right', content: '关闭右侧', value: 'right' },
      { icon: 'el-icon-close', content: '关闭其它', value: 'other' },
      { icon: 'el-icon-circle-close', content: '关闭全部', value: 'all' },
    ]

    const contextmenuInfo = reactive({
      list: menuList,
      x: 0,
      y: 0,
      visible: false,
      current: $route.path,
    })

    // const visitedRoutes = store.getters['visited/visitedList']
    const visitedRoutes = computed(() => store.state.visited.list)
    const currentRoute = computed(() => store.state.visited.current)

    const handleClick = (tab: any) => {
      const clickTab = tab.paneName
      if (currentRoute.value === clickTab) return
      const page = visitedRoutes.value.find(
        (route: RouteItem) => route.path === clickTab,
      )
      page &&
        router.push({ path: page.path, query: page.query, params: page.params })
    }
    const removeSelectTab = (tab: string) => {
      store.dispatch('visited/delSelectRoute', tab)
    }

    const openContextmenu = (event: MouseEvent) => {
      let target = event.target as HTMLElement
      let flag = false

      if (target.className.indexOf('el-tabs__item') > -1) {
        flag = true
      } else if (
        (target.parentNode as HTMLElement).className.indexOf('el-tabs__item') >
        -1
      ) {
        target = target.parentNode as HTMLElement
        flag = true
      }
      if (flag) {
        event.stopPropagation()
        event.preventDefault()
        contextmenuInfo.x = event.clientX
        contextmenuInfo.y = event.clientY
        contextmenuInfo.visible = true
        contextmenuInfo.current =
          target.getAttribute('aria-controls')?.slice(5) || ''
      }
    }

    const handleContextmenu = (type: string) => {
      contextmenuInfo.visible = false
      const path = contextmenuInfo.current
      if (!path || !type) return
      switch (type) {
        case 'left':
          store.dispatch('visited/delLeftRoutes', path)
          break
        case 'right':
          store.dispatch('visited/delRightRoutes', path)
          break
        case 'other':
          store.dispatch('visited/delOtherRoutes', path)
          break
        case 'all':
          store.dispatch('visited/delAllRoutes', path)
          break
        default:
          break
      }
    }

    return {
      // ...toRefs(contextmenuInfo),
      contextmenuInfo,
      visitedRoutes,
      handleClick,
      removeSelectTab,
      currentRoute,
      openContextmenu,
      handleContextmenu,
    }
  },
})
</script>

<style lang="scss" scoped></style>
