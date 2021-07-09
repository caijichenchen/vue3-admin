<script lang="ts">
import { defineComponent, h, inject, ref } from 'vue'
import { CFormItemContext } from './form.type'
export default defineComponent({
  props: {
    modelValue: {
      type: [Number, String],
      default: '',
    },
  },
  emits: ['input', 'blur', 'update:modelValue'],
  setup(props, { emit }) {
    const formItemMitt = inject<CFormItemContext>('c-form-item')
    const isSuccess = ref(true)
    const handleInput = (e: InputEvent) => {
      const { value } = e.target as HTMLInputElement
      emit('input', value)
      emit('update:modelValue', value)
    }
    // 这里触发form-item的校验  对应的数据在form拿 这里传个回调函数拿到校验结果
    const handleBlur = () => {
      formItemMitt?.formItemMitt?.emit(
        'handleBlurValidate',
        (flag: boolean) => {
          isSuccess.value = flag
        },
      )
    }
    return () =>
      h('input', {
        class: !isSuccess.value && 'error',
        value: props.modelValue,
        onInput: handleInput,
        onBlur: handleBlur,
      })
  },
})
</script>

<style lang="scss" scoped>
.error {
  border: 0.5px solid red;
}
</style>
