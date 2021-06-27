<template>
  <div class="vd-container-aside-wrapper">
    <el-scrollbar wrap-class="vd-aside-menu-wrapper">
      <el-menu :default-active="currentPath">
        <aside-menu :routes="routes" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import asideMenu from './components/aside-menu.vue'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { RouteItem } from '@/router/router.type'
export default defineComponent({
  components: { asideMenu },
  setup() {
    const $route = useRoute()
    const store = useStore()
    const openAside = computed(() => store.state.app.asideOpen)
    const routes = computed<RouteItem[]>(
      () => store.state.permission.routersMap,
    )
    const currentPath = $route.path
    return { currentPath, openAside, routes }
  },
})
</script>

<style lang="scss" scoped></style>
