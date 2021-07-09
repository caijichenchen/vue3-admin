import { ElInput } from 'element-plus'
import { ElFormItem } from 'element-plus'
import { ElForm } from 'element-plus'
import { defineComponent, h, reactive, ref } from 'vue'

export default defineComponent({
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const form = reactive({ name: 's', age: 1 })
    const formRef = ref(null)
    const formConfig = {
      ref: formRef,
      props: {
        rules: {
          name: [{ required: true, message: 'xxx', trigger: 'blur' }],
          age: [{ required: true, message: 'kkk', trigger: 'blur' }],
        },
        model: form,
        labelPosition: 'left',
        labelWidth: 'auto',
      },
      tag: ElForm,
      children: [
        {
          tag: ElFormItem,
          props: {
            label: '姓名',
            prop: 'name',
          },
          children: [
            {
              tag: ElInput,
              props: {
                modelValue: form.name,
                onInput: (e: string) => {
                  form.name = e
                  console.log(e, form)
                },
              },
            },
          ],
        },
      ],
    }
    // return {
    //   form,
    //   formConfig,
    // }
    // return () => {
    //   console.log(22)
    //   return renderVNode(formConfig)
    // }
    return () => {
      console.log(222)
      return h(
        ElInput,
        {
          modelValue: form.name,
          onInput: (e: string) => {
            form.name = e
          },
        },
        [],
      )
    }
  },
  // render() {
  //   return h(
  //     ElInput,
  //     {
  //       modelValue: this.form.name,
  //       onInput: (e: string) => {
  //         this.form.name = e
  //       },
  //     },
  //     [],
  //   )
  // },
})

function renderVNode(createConfig: any) {
  const props = createConfig.props ? createConfig.props : {}
  return h(
    createConfig.tag,
    {
      ref: createConfig.ref,
      ...props,
    },
    createConfig.children
      ? createConfig.children.map((child: any) => renderVNode(child))
      : [],
  )
}
