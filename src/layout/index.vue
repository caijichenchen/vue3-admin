<template>
  <!-- <div class="app-wrapper">
    <Sidebar class="sidebar-container" />
    <div
      class="app-container hasTagsView"
      :class="{ hideContainer: !sidebarOpen }"
    >
      <div class="fixed-header">
        <Navbar />
        <theme />
      </div>
      <AppMain />
    </div>
  </div> -->
  <div class="vd-layout__group" :style="groupBgStyle">
    <!-- <div class="vd-layout-mask" /> -->
    <div class="vd-layout__content">
      <div class="vd-layout__header">
        <header-logo />
        <header-toggle-btn />
        <div class="header-right">
          <header-search />
          <header-screenfull />
          <header-theme />
          <header-user />
        </div>
      </div>
      <div class="vd-layout__container">
        <div class="vd-container__aside">
          <aside-menus />
        </div>
        <div class="vd-container__main">
          <div class="vd-container__main-header">
            <visited-tabs />
          </div>
          <div class="vd-container__main-body">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import useSidebarOpen from './Hooks/useSidebarOpen'
// import Navbar from './components/Navbar/index.vue'
// import AppMain from './components/AppMain/index.vue'
// import Sidebar from './components/Sidebar/index.vue'
import headerLogo from './components/header-logo/index.vue'
import headerToggleBtn from './components/header-toogle-btn/index.ts'
import headerSearch from './components/header-search/index.vue'
import headerScreenfull from './components/header-screenfull/index.vue'
import headerTheme from './components/header-theme/index.vue'
import headerUser from './components/header-user/index.vue'
import visitedTabs from './components/visited-tabs/index.vue'
import asideMenus from './components/aside-menus/index.vue'

// import setThemeHook from './Hooks/useSetTheme'
import { useStore } from 'vuex'
export default defineComponent({
  components: {
    headerLogo,
    headerToggleBtn,
    headerSearch,
    headerScreenfull,
    headerTheme,
    headerUser,
    visitedTabs,
    asideMenus,
  },
  // components: { AppMain, Sidebar, Navbar },
  setup() {
    // const { active } = setThemeHook()
    const store = useStore()
    const groupBgStyle = computed(() => {
      const active = store.getters['theme/activeThemeInfo']
      return active?.backgroundImage
        ? {
            backgroundImage:
              'url(' + require(`../assets/${active.backgroundImage}`) + ')',
          }
        : {}
    })
    // store.dispatch('permission/getRoleRoutes')
    // const routes = computed(() => store.state.permission.routersMap)
    // console.log(2, routes)

    const { sidebarOpen } = useSidebarOpen()
    return {
      groupBgStyle,
      sidebarOpen,
    }
  },
})
</script>

<style lang="scss">
@import '~@/styles/var/index.scss';
@import '~@/styles/rule/index.scss';
@import '~@/styles/layout/index.scss';
// .app-wrapper {
//   @include clearfix;
//   position: relative;
//   width: 100%;
//   height: 100%;

//   .sidebar-container {
//     transition: width 0.28s;
//     width: 210px;
//     height: 100%;
//     position: fixed;
//     top: 0;
//     bottom: 0;
//     left: 0;
//     z-index: 1001;
//   }

//   .app-container {
//     height: 100%;
//     transition: margin-left 0.28s;
//     margin-left: 210px;

//     .fixed-header {
//       display: flex;
//       position: fixed;
//       top: 0;
//       right: 0;
//       z-index: 999;
//       width: calc(100% - 210px);
//       transition: width 0.28s;
//     }
//   }

//   .hideSidebar {
//     width: 36px;
//     overflow: inherit;
//   }

//   .hideContainer {
//     margin-left: 36px;

//     .fixed-header {
//       width: calc(100%-36px);
//     }
//   }
//   .hasTagsView .fixed-header + .app-main {
//     padding-top: 50px;
//   }
//   .hasTagsView .app-main {
//     min-height: calc(100vh - 127px);
//   }
// }
</style>
