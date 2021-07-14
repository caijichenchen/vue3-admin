<template>
  <div class="vd-container-aside-wrapper" style="overflow: hidden">
    <el-scrollbar :height="height">
      <el-menu :default-active="currentPath" :collapse="!openAside">
        <aside-menu :routes="routes" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import asideMenu from './components/aside-menu.vue'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { RouteItem } from '@/router/router.type'
export default defineComponent({
  components: { asideMenu },
  setup() {
    const $route = useRoute()
    const store = useStore()
    const openAside = computed(() => store.state.app.asideOpen)
    const height = ref(0)
    onMounted(() => {
      const a = document.querySelector('.vd-container__aside')
      height.value = a?.clientHeight as number
    })
    const routes = computed<RouteItem[]>(
      () => store.state.permission.routersMap,
    )
    const currentPath = $route.path
    return { currentPath, openAside, routes, height }
  },
})
</script>

<style lang="scss" scoped></style>
