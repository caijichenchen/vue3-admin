<template>
  <div class="menu-wrapper">
    <template v-for="route in isShow(routes)" :key="route.name">
      <el-submenu :index="route.path">
        <template #title>
          <span>{{ route.meta.title }}</span>
        </template>
        <template v-for="child in route.children" :key="child.name">
          <aside-menu-item
            v-if="child.children && child.children.length > 0"
            class="nest-menu"
            :routes="[child]"
            :base-path="resolveBasePath(route.path)"
          />
          <a
            v-else-if="child.httpHref"
            :key="child.name"
            :href="child.httpHref"
            target="_blank"
          >
            <el-menu-item :index="resolvePath(route.path, child.path)">
              <span>{{ child.meta.title }}</span>
            </el-menu-item>
          </a>
          <router-link
            v-else
            :key="'link' + child.name"
            :to="resolvePath(route.path, child.path)"
          >
            <el-menu-item :index="resolvePath(route.path, child.path)">
              <span>{{ child.meta.title }}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import path from 'path'
import { RouteItem } from '@/router/router.type'

export default defineComponent({
  name: 'AsideMenuItem',
  props: {
    basePath: {
      type: String,
      default: '',
    },
    routes: {
      type: Array,
      default: (): RouteItem[] => [],
    },
  },
  setup(props) {
    const isShow = (routes: RouteItem[]) => {
      return routes.filter((route: RouteItem) => !route.hidden)
    }

    const resolveBasePath = (routePath: string) =>
      path.join(props.basePath, routePath)

    const resolvePath = (routePath: string, childPath: string) =>
      path.join(props.basePath, routePath, childPath)

    return {
      isShow,
      resolvePath,
      resolveBasePath,
    }
  },
})
</script>

<style></style>
