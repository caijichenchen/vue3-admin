<template>
  <el-dropdown size="mini">
    <span class="btn-text">您好，崽种</span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="logout" icon="el-icon-switch-button">
          <!-- 退出登录 -->
          {{ $t('header_menu.logout') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped></style>
