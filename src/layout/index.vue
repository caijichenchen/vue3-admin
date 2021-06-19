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
  <div class="vd-layout__group">
    <!-- <div class="vd-layout-mask" /> -->
    <div class="vd-layout__content">
      <div class="vd-layout__header">
        <logo />
        <!-- <div class="toggle-btn">1</div> -->
        <!-- <div class="header-menu">2</div> -->
        <div class="header-right">
          <header-search />
          <header-screenfull />
          <header-theme />
        </div>
      </div>
      <div class="vd-layout__body">2</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useSidebarOpen from './Hooks/useSidebarOpen'
// import Navbar from './components/Navbar/index.vue'
// import AppMain from './components/AppMain/index.vue'
// import Sidebar from './components/Sidebar/index.vue'
// import theme from './components/theme/index.vue'
import Logo from './components/Logo/index.vue'
import headerSearch from './components/header-search/index.vue'
import headerScreenfull from './components/header-screenfull/index.vue'
import headerTheme from './components/header-theme/index.vue'
export default defineComponent({
  components: { Logo, headerSearch, headerScreenfull, headerTheme },
  // components: { AppMain, Sidebar, Navbar, theme },
  setup() {
    const { sidebarOpen } = useSidebarOpen()
    return {
      sidebarOpen,
    }
  },
})
</script>

<style lang="scss" scoped>
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
