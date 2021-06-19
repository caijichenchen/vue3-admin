<script lang="ts">
import { defineComponent, h, inject } from 'vue'
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

    const handleInput = (e: InputEvent) => {
      const { value } = e.target as HTMLInputElement
      emit('input', value)
      emit('update:modelValue', value)
    }
    const handleBlur = () => {
      formItemMitt?.formItemMitt?.emit('handleBlurValidate', props.modelValue)
    }
    return {
      handleInput,
      handleBlur,
    }
  },
  render() {
    const { handleInput, handleBlur, modelValue } = this
    return h('input', {
      value: modelValue,
      onInput: handleInput,
      onBlur: handleBlur,
    })
  },
})
</script>

<style lang="scss" scoped></style>
