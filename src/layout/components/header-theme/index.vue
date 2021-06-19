<template>
  <el-tooltip placement="bottom" content="主题">
    <el-button
      class="btn-text"
      type="text"
      icon="el-icon-magic-stick"
      @click="themeVisible = true"
    />
  </el-tooltip>
  <el-dialog v-model="themeVisible" title="主题" width="600px">
    <theme-list />
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import themeList from './components/theme-list/index.vue'
export default defineComponent({
  components: { themeList },
  setup() {
    const themeVisible = ref(false)
    return { themeVisible }
  },
})
</script>

<style lang="scss" scoped></style>
