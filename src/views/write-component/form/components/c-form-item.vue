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
import { CFormContext, ValidateFieldCallback, RuleItem } from './form.type'
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
  setup(props, { slots }) {
    const errMsg = ref('')
    const formItemMitt = mitt()
    const formContext = inject<CFormContext>('c-form')
    const isSuccess = ref(false)
    const validate = (cb: any) => {
      const prop = props.prop
      const rule = formContext?.rules[prop] as RuleItem[]
      const value = formContext?.model[prop]
      if (prop && rule) {
        const desc = { [prop]: rule }
        const schema = new AsyncValidator(desc)
        schema.validate({ [prop]: value }, { firstFields: true }, (error) => {
          if (error) {
            isSuccess.value = false
            errMsg.value =
              rule.length > 0
                ? rule.map((item) => item.message).join()
                : 'error'
          } else {
            isSuccess.value = true
            errMsg.value = 'success'
          }
        })
      }
      cb(isSuccess.value)
      return isSuccess.value
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
    return () =>
      h(
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
            props.label,
          ),
          slots.default?.(),
          h(
            'span',
            {
              class: {
                success: isSuccess.value,
                error: !isSuccess.value,
              },
            },
            errMsg.value,
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
