<script lang="ts">
import {
  defineComponent,
  h,
  inject,
  onMounted,
  provide,
  reactive,
  ref,
} from 'vue'
import mitt from 'mitt'
import { CFormContext, ValidateFieldCallback } from './form.type'
import AsyncValidator from 'async-validator'
export default defineComponent({
  props: {
    prop: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const errMsg = ref('')
    const formItemMitt = mitt()
    const formContext = inject<CFormContext>('c-form')

    const validate = () => {
      let flag = true
      const prop = props.prop
      const rule = formContext?.rules[prop]
      const value = formContext?.model[prop]
      if (prop && rule) {
        const desc = { [prop]: rule }
        const schema = new AsyncValidator(desc)
        schema.validate({ [prop]: value }, { firstFields: true }, (error) => {
          if (error) {
            flag = false
            // rule.messsage --> string/()=>string/undefined
            errMsg.value = 'error'
          } else {
            errMsg.value = 'success'
          }
        })
      }

      return flag
    }

    const formItemContext = reactive({
      prop: props.prop,
      formItemMitt,
      validate,
      errMsg,
    })

    onMounted(() => {
      props.prop && formContext?.formMitt?.emit('addField', formItemContext)
    })
    provide('c-form-item', formItemContext)

    formItemMitt.on('handleBlurValidate', validate)
    return { errMsg }
  },
  render() {
    const { $slots, label, errMsg } = this
    return h(
      'div',
      {
        class: 'c-form-item',
      },
      [
        h(
          'span',
          {
            class: 'c-form-label',
          },
          label,
        ),
        $slots.default?.(),
        h(
          'span',
          {
            class: {
              success: errMsg === 'success',
              error: errMsg === 'error',
            },
          },
          errMsg,
        ),
      ],
    )
  },
})
</script>

<style lang="scss" scoped>
.c-form-label {
  margin-right: 12px;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style>
