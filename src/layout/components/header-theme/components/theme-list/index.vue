<template>
  <el-table :data="list">
    <el-table-column prop="title" label="名称" />
    <el-table-column label="预览" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button
          :type="isActive(row.name) ? 'success' : ''"
          round
          @click="select(row.name)"
        >
          {{ isActive(row.name) ? '已激活' : '使用' }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    active: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const select = (name: string) => {
      if (isActive(name)) return
      emit('click', name)
    }
    const isActive = (name: string): boolean => props.active === name
    return { select, isActive }
  },
})
</script>

<style lang="scss" scoped></style>
