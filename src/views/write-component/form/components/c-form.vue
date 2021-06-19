<script lang="ts">
import { RuleItem } from 'async-validator'
import mitt from 'mitt'
import { defineComponent, h, PropType, provide } from 'vue'
import { CFormItemContext } from './form.type'
interface Callback {
  (isValid: boolean): void
}
export default defineComponent({
  props: {
    model: {
      type: Object,
      default: () => {
        return {}
      },
    },
    rules: {
      type: Object as PropType<RuleItem>,
      default: () => {
        return {}
      },
    },
  },
  setup(props) {
    const formMitt = mitt()
    const fields: CFormItemContext[] = []

    formMitt.on('addField', (field) => field && fields.push(field))

    const validate = (callback: Callback) => {
      const len = fields.length
      if (len === 0) {
        return callback(true)
      }
      const errLen = fields.filter((field) => !field.validate()).length
      errLen ? callback(false) : callback(true)
    }

    provide('c-form', {
      rules: props.rules,
      model: props.model,
      formMitt,
    })

    return { validate }
  },
  render() {
    const { $slots } = this
    return h(
      'form',
      {
        class: 'c-form',
      },
      $slots.default?.(),
    )
  },
})
</script>

<style lang="scss" scoped></style>
