<template>
  <div>
    <el-tooltip effect="dark" content="主题" placement="botton">
      <el-button
        type="text"
        icon="el-icon-magic-stick"
        @click="themeVisible = true"
      />
    </el-tooltip>
    <el-dialog v-model="themeVisible" title="主题" width="600px">
      <theme-list />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import themeList from './components/theme-list.vue'
export default defineComponent({
  components: { themeList },
  setup() {
    const themeVisible = ref(false)
    return { themeVisible }
  },
})
</script>

<style lang="scss" scoped></style>
