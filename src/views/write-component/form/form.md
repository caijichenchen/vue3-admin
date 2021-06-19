form 表单控件设计思路

form

1. model 数据对象 rules 校验规则
2. validate 校验方法 $refs.form.validate()
   2.1 fileds 数组 存储所有子项 form-item 的 validate 方法
   2.2 执行 validate 时遍历 fields 数组的 validate 方法
3. 向下抛出自身 this 包括 model+rules+addFiled

form-item

1. 在 mounted 中触发 form 父组件的 addFiled 方法 将自身的 validate 存储
2. 只以 blur 方法为例 此时触发校验应该只校验自身
3. validate 方法 用于校验结和 form 的 model+rules 查询是否需要校验
4. 向下抛出自身 this 用于 blur 校验

input

1. 用于改变数据的双向绑定改变
2. 只以 blur 为例， 触发 form-item 的校验
