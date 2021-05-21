<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- <transition-group name="breadcrumb"> -->
    <el-breadcrumb-item v-for="(route, index) in matched" :key="route.path">
      <span
        v-if="route.redirect === 'noRedirect' || index === matched.length - 1"
        class="no-redirect"
      >
        {{ route.meta.title }}
      </span>
      <a v-else @click.prevent="handleLink(route)">
        {{ route.meta.title }}
      </a>
    </el-breadcrumb-item>
    <!-- </transition-group> -->
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { RouteLocationMatched, useRoute } from 'vue-router'
// import pathToRegexp from 'path-to-regexp'
const pathToRegexp = require('path-to-regexp')

interface RouteMatchedMap {
  matched: RouteLocationMatched[]
}

export default defineComponent({
  setup() {
    const route = useRoute()
    let levelList: RouteMatchedMap = reactive({
      matched: [],
    })
    const getBreadcrumb = () => {
      let matched = route.matched.filter(
        (item: RouteLocationMatched) => item.meta && item.meta.title,
      )
      levelList.matched = matched
    }

    getBreadcrumb()

    const pathCompile = (path: string) => {
      const { params } = route
      console.log(pathToRegexp)
      const toPath = pathToRegexp.compile(path)
      return toPath(params)
    }

    const handleLink = (route: RouteLocationMatched) => {
      const { redirect, path } = route
      if (redirect) return redirect
      return pathCompile(path)
    }

    watch(
      () => route.path,
      () => {
        getBreadcrumb()
      },
    )

    return {
      ...toRefs(levelList),
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
