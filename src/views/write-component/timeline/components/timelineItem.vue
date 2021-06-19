<template>
  <li class="c-timeline-item">
    <span class="c-timeline-item__tail" />
    <div
      v-if="!$slots.dot"
      :class="[
        'c-timeline-item__node',
        `c-timeline-item__node--${size}`,
        `c-timeline-item__node--${type}`,
      ]"
      :style="{ backgroundColor: color }"
    >
      <i v-if="icon" class="el-timeline__icon" :class="icon" />
    </div>
    <div v-if="$slots.dot" class="c-timeline-item__dot">
      <slot name="dot" />
    </div>
    <div class="c-timeline-item__wrapper">
      <div
        v-if="!hideTimestamp && placement === 'top'"
        class="c-timeline-item__timestamp"
      >
        {{ timestamp }}
      </div>
      <div class="c-timeline-item__content">
        <slot />
      </div>
      <div
        v-if="!hideTimestamp && placement === 'bottom'"
        class="c-timeline-item__timestamp"
      >
        {{ timestamp }}
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    timestamp: {
      type: String,
      default: '',
    },
    hideTimestamp: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    type: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'normal',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.c-timeline-item {
  position: relative;
  overflow: hidden;
  padding-bottom: 20px;
  .c-timeline-item {
    &__tail {
      position: absolute;
      left: 4px;
      height: 100%;
      border-left: 2px solid #e4e7ed;
    }
    &__node {
      position: absolute;
      background-color: #e4e7ed;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__node--normal {
      left: -1px;
      width: 12px;
      height: 12px;
    }
    &__wrapper {
      position: relative;
      padding-left: 28px;
      top: -3px;
    }
    &__content {
      color: #303133;
    }
    &__timestamp {
      color: #909399;
      line-height: 1;
      font-size: 13px;
    }
  }
}
</style>
