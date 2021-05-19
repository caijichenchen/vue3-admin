<template>
  <div>
    <Logo />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        mode="vertical"
        :default-active="currentPath"
        :collapse="isCollapse"
        background-color="#001529"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <sidebar-item :routes="croutes" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import SidebarItem from './item.vue'
import Logo from '../Logo/index.vue'
import { useRoute } from 'vue-router'
import routes from '@/router/routes'
import { RouteRecordRaw } from 'vue-router'

export default defineComponent({
  components: { Logo, SidebarItem },
  setup() {
    const $route = useRoute()
    const currentPath = $route.path
    const croutes = reactive<RouteRecordRaw[]>(routes)
    return {
      currentPath,
      croutes,
    }
  },
})
</script>

<style>
.scrollbar-wrapper {
  overflow-x: hidden !important;
}

.sidebar-container .el-scrollbar {
  height: calc(100% - 50px);
}

.el-scrollbar__bar.is-vertical {
  right: 0px;
}

.el-scrollbar,
.el-scrollbar__view,
.scrollbar-wrapper .el-menu {
  height: 100%;
}
.scrollbar-wrapper .el-menu {
  width: 100% !important;
}
</style>
