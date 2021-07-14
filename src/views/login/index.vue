<template>
  <div class="vd-login-container">
    <div class="login-panel">
      <el-form
        :model="loginForm.model"
        :rules="loginForm.rules"
        label-width="auto"
        class="login-form"
      >
        <el-form-item prop="user" label="用户名">
          <el-input v-model="loginForm.model.user" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="loginForm.model.password" />
        </el-form-item>
        <el-button style="width: 100%" type="primary">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  setup() {
    const loginForm = reactive({
      model: { user: 'admin', password: 'admin' },
      rules: {
        user: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
      },
    })
    return { loginForm }
  },
})
</script>

<style lang="scss">
.login-panel {
  .el-form-item__content {
    width: 270px;
  }

  .el-form-item {
    margin-bottom: 15px;
  }

  .el-input {
    input {
      text-indent: 5px;
      border-color: #dcdcdc;
      border-radius: 3px;
    }

    .el-input__prefix {
      i {
        padding: 0 5px;
        font-size: 16px !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.vd-login-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('~@/assets/image/login/login.jpg');
  background-size: cover;

  .login-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 400px;
    height: 300px;
    margin: auto;
    border-radius: 4px;
    background: rgba($color: #000000, $alpha: 0.3);
    box-shadow: 3px 3px 6px 3px rgba($color: #000000, $alpha: 0.3);
    overflow: hidden;
    box-sizing: border-box;
    ::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      filter: blur(20px);
      z-index: -1;
      margin: -30px;
    }
  }
}
</style>
