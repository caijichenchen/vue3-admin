<template>
  <div class="menu-wrapper">
    <template v-for="route in isShow(routes)" :key="route.name">
      <el-submenu :key="route.name" :index="route.path">
        <template #title>
          <span>{{ route.meta.title }}</span>
        </template>
        <template v-for="child in route.children" :key="child.name">
          <sidebar-item
            v-if="child.children && child.children.length > 0"
            :key="child.name"
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
import { RouteRecordRaw } from 'vue-router'
import path from 'path'

type RouteRecordRawItem = RouteRecordRaw & {
  hidden?: boolean
}

export default defineComponent({
  name: 'SidebarItem',
  props: {
    basePath: {
      type: String,
      default: '',
    },
    routes: {
      type: Array,
      default: (): RouteRecordRawItem[] => [],
    },
  },
  setup(props) {
    const isShow = (routes: RouteRecordRaw[]) => {
      return routes.filter((route: RouteRecordRawItem) => !route.hidden)
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

<style>
</style>
