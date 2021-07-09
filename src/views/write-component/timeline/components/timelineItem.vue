<template>
  <div class="timeline-item">
    <div
      v-if="!$slots.dot"
      :class="[
        'timeline-item__node',
        `timeline-item--${size}`,
        `timeline-item__${type}`,
      ]"
      :style="{ backgroundColor: color }"
    >
      <i v-if="icon" :class="icon" />
    </div>
    <div v-if="$slots.dot" class="timeline-item__dot">
      <slot name="dot" />
    </div>
    <div class="timeline-item__tail" />
    <div
      class="timeline-item__content"
      :style="{
        flexDirection: placement === 'top' ? 'column' : 'column-reverse',
      }"
    >
      <div
        v-if="!hideTimestamp"
        :class="['timeline-item-timestamp', `is-${placement}`]"
      >
        {{ timestamp }}
      </div>
      <div class="timeline-item__body">
        <slot />
      </div>
    </div>
  </div>
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
.timeline-item {
  position: relative;
  padding-bottom: 20px;
  &--normal {
    left: -1px;
    width: 12px;
    height: 12px;
  }
  &__node {
    position: absolute;
    background-color: #e4e7ed;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__tail {
    position: absolute;
    left: 4px;
    height: 100%;
    border-left: 2px solid #e4e7ed;
  }
  &__content {
    display: flex;
    position: relative;
    padding-left: 28px;
    top: -4px;
  }
  &-timestamp {
    color: #909399;
    line-height: 1;
    font-size: 13px;
  }
  .is-bottom {
    margin-top: 8px;
  }
  .is-top {
    padding-top: 4px;
    margin-bottom: 8px;
  }
  .timeline-item__body {
    color: #333333;
  }
}
</style>
