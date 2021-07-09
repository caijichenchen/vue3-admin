<template>
  <c-form ref="form" :model="info" :rules="rules">
    <c-form-item prop="name" label="名字">
      <c-input v-model="info.name" />
    </c-form-item>
    <c-form-item prop="age" label="年龄">
      <c-input v-model="info.age" />
    </c-form-item>
  </c-form>
  <button @click="submit">提交</button>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import CForm from './components/c-form.vue'
import CFormItem from './components/c-form-item.vue'
import CInput from './components/c-input.vue'
import { CFormContext } from './components/form.type'
export default defineComponent({
  components: { CForm, CFormItem, CInput },
  setup() {
    const info = reactive({
      name: '',
      age: '',
    })
    const rules = reactive({
      age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
      name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    })
    const form = ref<CFormContext | null>(null)
    const submit = () => {
      form.value?.validate((valid) => {
        console.log(valid)
      })
    }
    return { info, rules, form, submit }
  },
})
</script>

<style lang="scss" scoped></style>
