<template>
  <el-table :data="themeList">
    <el-table-column prop="title" label="名称" />
    <el-table-column label="预览" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button v-if="active === row.title" type="success" round>
          已激活
        </el-button>
        <el-button v-else round @click="select">使用</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import theme from '@/config/modules/theme'
export default defineComponent({
  setup() {
    const themeList = reactive(Object.values(theme.map))
    const active = ref(theme.default)
    const select = () => {
      console.log('22')
    }
    return { themeList, active, select }
  },
})
</script>

<style lang="scss" scoped></style>
