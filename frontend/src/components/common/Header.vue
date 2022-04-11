<template>
  <div class="header">
    <left-outlined v-if="backable" class="back-button" @click="back" />
    <h1 class="header-title">{{ title }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LeftOutlined } from '@ant-design/icons-vue';
import { Router, useRouter } from 'vue-router';

export default defineComponent({
  name: 'CommonHeader',
  components: { LeftOutlined },
  props: {
    title: {
      type: String,
      default: '',
    },
    backable: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const router: Router = useRouter();
    const back = () => {
      router.go(-1);
    };
    return {
      back,
    };
  },
});
</script>

<style scoped>
.header {
  z-index: 2;
  width: 100%;
  min-height: 3rem;
  position: sticky;
  top: 0;
  left: 0;
  padding: 0.25rem;
  background-color: white;
  box-shadow: 0px 5px 5px #f0f0f0;
  text-align: center;
}

.header > .back-button {
  float: left;
  font-size: 1.125rem;
  margin: 0.75rem 0.25rem 0.75rem 0.25rem;
}

.header > .header-title {
  font-size: 1.125rem;
  line-height: 1.75rem;
  margin: 0.5rem 0 0.5rem 0;
}
</style>
