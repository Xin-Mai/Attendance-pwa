<template>
  <div class="container">
    <a-card
      title="登录"
      :head-style="headStyle"
      class="login-card responsive front"
    >
      <template #extra>
        <a-button type="link" style="vertical-align: bottom" @click="reverse">
          注册
        </a-button>
      </template>
      <sign-in></sign-in>
    </a-card>
    <a-card
      title="注册"
      :head-style="headStyle"
      class="login-card responsive back"
    >
      <template #extra>
        <a-button type="link" style="vertical-align: bottom" @click="reverse">
          登录
        </a-button>
      </template>
      <sign-up></sign-up>
    </a-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, Ref, ref, onMounted } from 'vue';
import SignUp from '../components/Sign/SignUp.vue';
import SignIn from '../components/Sign/SignIn.vue';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  components: {
    SignUp,
    SignIn,
  },
  setup() {
    const isSignUp: Ref<boolean> = ref(false);
    const front: Ref<HTMLDivElement | null> = ref(null);
    const back: Ref<HTMLDivElement | null> = ref(null);
    // 翻转卡片
    const reverse = () => {
      if (!front.value || !back.value) return;
      isSignUp.value = !isSignUp.value;
      front.value.style.transform = isSignUp.value
        ? 'translate(-50%, -50%) rotateY(180deg)'
        : '';
      back.value.style.transform = isSignUp.value
        ? 'translate(-50%, -50%)'
        : 'translate(-50%, -50%) rotateY(-180deg)';
    };

    onMounted(() => {
      front.value = document.getElementsByClassName(
        'front'
      )[0] as HTMLDivElement;
      back.value = document.getElementsByClassName('back')[0] as HTMLDivElement;
    });
    return {
      isSignUp,
      reverse,
      headStyle: {
        'font-weight': 'bold',
        // 'font-size': 'x-large',
        'text-align': 'left',
      },
    };
  },
});
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
}
.login-card {
  max-width: 500px;
  transform-style: preserve-3d;
  transition: 0.5s all;
  backface-visibility: hidden;
}

.responsive {
  width: 500px;
}

@media only screen and (max-width: 550px) {
  .responsive {
    width: 90%;
  }
}
.front,
.back {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.back {
  transform: rotateY(-180deg);
}
</style>
