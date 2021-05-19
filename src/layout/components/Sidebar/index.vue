<template>
  <Logo />
  <el-scrollbar>
    <el-menu
      mode="vertical"
      :default-active="currentPath"
      :collapse="isCollapse"
      background-color="#001529"
      text-color="#bfcbd9"
      active-text-color="#409eff"
    >
      <sidebar-item />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SidebarItem from './item.vue'
import Logo from '../Logo/index.vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: { Logo, SidebarItem },
  setup() {
    const $route = useRoute()
    const currentPath = $route.path
    return {
      currentPath,
    }
  },
})
</script>

<style>
</style>
