import { ElForm, ElFormItem, ElInput } from "element-plus";
import { defineAsyncComponent } from "vue";

const FormTypeMap = new Map([
  ['el-form', defineAsyncComponent(ElForm)],
  ['el-form-item', defineAsyncComponent(ElFormItem)],
  ['el-input', defineAsyncComponent(ElInput)],
])

export default FormTypeMap