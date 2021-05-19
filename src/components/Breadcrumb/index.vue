<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(route, index) in levelList" :key="route.path">
        <span
          v-if="
            route.redirect === 'noRedirect' || index === levelList.length - 1
          "
          class="no-redirect"
        >
          {{ route.meta.title }}
        </span>
        <router-link v-else :to="handleLink(route)">
          {{ route.meta.title }}
        </router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue'
import { RouteRecordRaw, useRoute } from 'vue-router'
import pathToRegexp from 'path-to-regexp'

export default defineComponent({
  setup() {
    const route = useRoute()
    let levelList: RouteRecordRaw[] = reactive([])

    const getBreadcrumb = () => {
      let matched = route.matched.filter(
        (item: RouteRecordRaw) => item.meta && item.meta.title,
      )

      levelList = matched
    }

    getBreadcrumb()

    const pathCompile = (path: string) => {
      const { params } = route
      const toPath = pathToRegexp.compile(path)
      return toPath(params)
    }

    const handleLink = (route: RouteRecordRaw) => {
      const { redirect, path } = route
      if (redirect) return redirect
      return pathCompile(path)
    }

    watch(() => route, getBreadcrumb)

    return {
      levelList,
      handleLink,
    }
  },
})
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
