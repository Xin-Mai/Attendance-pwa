<template>
  <a-form
    ref="formInstance"
    :model="formState"
    name="normal_login"
    class="login-form"
    @finish="onFinish"
    @finish-failed="onFinishFailed"
  >
    <a-form-item
      label="用户名"
      name="username"
      :label-col="labelCol"
      label-align="left"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="formState.username">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      label="密码"
      name="password"
      :label-col="labelCol"
      label-align="left"
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
        <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
      </a-form-item>
      <a class="login-form-forgot" href="">忘记密码</a>
    </div>

    <a-form-item>
      <a-button
        :disabled="disabled"
        type="primary"
        html-type="submit"
        class="login-form-button"
        @click="onSubmit"
      >
        登录
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref } from 'vue';
import { Router, useRouter } from 'vue-router';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { Form } from 'ant-design-vue';
import { LoginApi } from '/@/api/accout';
interface FormState {
  username: string;
  password: string;
  remember: boolean;
}
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'SignIn',
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const router: Router = useRouter();

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
          router.push('/');
        })
        .catch((err: any) => {
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
      },
      labelCol: {
        span: 4,
      },
    };
  },
});
</script>
<style scoped>
.login-card {
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
