<template>
  <div class="navbar">
    <Hamburger
      :is-active="sidebarOpen"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <Breadcrumb class="breadcrumb-container" />
    <!-- <div class="right-menu">vue3</div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Hamburger from '@/components/Hamburger/index.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import useSidebarOpen from '../../Hooks/useSidebarOpen'
export default defineComponent({
  components: { Hamburger, Breadcrumb },
  setup() {
    return {
      ...useSidebarOpen(),
    }
  },
})
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;
      margin-right: 30px;
      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }
    }
  }
}
</style>
