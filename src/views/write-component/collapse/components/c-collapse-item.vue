<template>
  <div class="c-collapse-item">
    <div class="c-collapse-item__title" @click="handleClick">
      <slot name="title">{{ title }}-{{ isActive }}</slot>
      <i
        class="el-collapse-item__arrow el-icon-arrow-right"
        :class="{ 'is-active': isActive }"
      />
    </div>
    <div v-show="isActive" class="c-collapse-item__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue'
import { CollapseCtx } from './collapse.type'
export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    name: {
      type: [String, Number],
      default: '',
    },
  },
  setup(props) {
    const collapse = inject<CollapseCtx>('c-collapse')
    const isActive = computed(() => collapse?.opend.value.includes(props.name))
    const handleClick = () => {
      collapse?.collapseMitt?.emit('item-click', props.name)
    }
    return { handleClick, isActive }
  },
})
</script>

<style lang="scss" scoped>
.c-collapse-item__title {
  display: flex;
  justify-content: space-between;

  .el-collapse-item__arrow.is-active {
    transform: rotate(90deg);
  }
}
.c-collapse-item__content {
  padding: 20px;
  color: pink;
}
</style>
