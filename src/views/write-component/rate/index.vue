<template>
  <div class="c-rate">
    <span v-for="item in max" :key="item" class="c-rate-item">
      <i class="el-rate__icon">
        <i v-if="allowHalf" class="el-rate__icon" :style="decimalStyle" />
      </i>
    </span>
    <span
      v-if="showScore || showText"
      class="c-rate__text"
      :style="{ color: textColor }"
    >
      {{ text }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'CRate',
  props: {
    max: {
      type: Number,
      default: 5,
    },
    modelValue: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    allowHalf: {
      type: Boolean,
      default: false,
    },
    lowThreshold: {
      type: Number,
      default: 2,
    },
    highThreshold: {
      type: Number,
      default: 4,
    },
    colors: {
      type: [Object, Array],
      default: () => ['#F7BA2A', '#F7BA2A', '#F7BA2A'],
    },
    voidColor: {
      type: String,
      default: '#C6D1DE',
    },
    disabledVoidColor: {
      type: String,
      default: '#EFF2F7',
    },
    iconClasses: {
      type: [Array, Object],
      default: () => ['el-icon-star-on', 'el-icon-star-on', 'el-icon-star-on'],
    },
    voidIconClass: {
      type: String,
      default: 'el-icon-star-off',
    },
    disabledVoidIconClass: {
      type: String,
      default: 'el-icon-star-on',
    },
    showText: {
      type: Boolean,
      default: false,
    },
    showScore: {
      type: Boolean,
      default: false,
    },
    textColor: {
      type: String,
      default: '#1F2D3D',
    },
    texts: {
      type: Array,
      default: () => ['极差', '失望', '一般', '满意', '惊喜'],
    },
    scoreTemplate: {
      type: String,
      default: '{value}',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, ctx) {
    let currentValue = ref(props.modelValue)

    const valueDecimal = computed(
      () => currentValue.value * 100 - Math.floor(currentValue.value),
    )
    const isArray = (data: unknown): boolean => Array.isArray(data)
    const colorMap = computed(() => {
      if (isArray(props.colors)) {
        return {
          [props.lowThreshold]: props.colors[0],
          [props.highThreshold]: props.colors[1],
          [props.max]: props.colors[2],
        }
      } else return props.colors
    })

    const decimalStyle = computed(() => {
      let width,
        color = ''
      width = props.disabled ? `${valueDecimal.value}%` : '50%'
      color = colorMap.value[currentValue.value]
      return {
        width,
        color,
      }
    })

    const text = computed(() => {
      let text = ''
      if (props.showScore) {
        text = props.scoreTemplate.replace(
          /\{\s*value\s*\}/,
          props.disabled ? `${props.modelValue}` : `${currentValue.value}`,
        )
      } else if (props.showText) {
        text = props.texts[currentValue.value] as string
      }
      return text
    })
    return {
      text,
      decimalStyle,
    }
  },
})
</script>

<style lang="scss" scoped></style>
