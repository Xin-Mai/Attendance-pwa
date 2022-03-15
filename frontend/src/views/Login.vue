<template>
  <a-card
    title="登录" 
    :headStyle="headStyle"
    style="margin: 0 auto"
    class="login-card"
  >
    <template #extra><a href="" style="vertical-align: bottom">register now</a></template>
    <a-form
      ref="formInstance"
      :model="formState"
      name="normal_login"
      class="login-form"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <div class="login-form-wrap">
        <a-form-item name="remember" no-style>
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item>
        <a class="login-form-forgot" href="">Forgot password</a>
      </div>

      <a-form-item>
        <a-button 
          :disabled="disabled" 
          type="primary" 
          html-type="submit"
          class="login-form-button"
          @click.prevent="onSubmit"
        >
          Log in
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script lang='ts'>
import { defineComponent, reactive, computed, ref } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { Form } from 'ant-design-vue';
import { LoginApi } from '../api/accout';
interface FormState {
  username: string;
  password: string;
  remember: boolean;
}
export default defineComponent({
  name: 'Login',
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const formInstance = ref<typeof Form | null>(null);
    const formState = reactive<FormState>({
      username: '',
      password: '',
      remember: true,
    });
    const onFinish = (values: any) => {
      console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };

    const onSubmit = () => {
      console.log('submit', formInstance.value);
      if (!formInstance.value) return;
      // 验证表单
      formInstance.value
      .validate()
      .then(() => {
        LoginApi(formState);
      }).catch((err: any) => {
        console.log(err);
      });
    };
    const disabled = computed(() => {
      return !(formState.username && formState.password);
    });
    return {
      formInstance,
      formState,
      onFinish,
      onFinishFailed,
      onSubmit,
      disabled,
      headStyle: {
        'font-weight': 'bold',
        // 'font-size': 'x-large',
        'text-align': 'left',
      }
    };
  },
});
</script>
<style scoped>.login-card {
  max-width: 500px;
  display: relative;
  top: 50%;
  transform: translateY(-50%);
}

.login-form {
  margin: auto;
}
.login-form-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.login-form-forgot {
  margin-bottom: 24px;
}
.login-form-button {
  width: 100%;
}
</style>
