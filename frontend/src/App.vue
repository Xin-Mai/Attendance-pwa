<script setup lang="ts">
import ReloadPrompt from '/@/components/common/ReloadPrompt.vue';
import { onBeforeMount } from 'vue';

onBeforeMount(() => {
  navigator.serviceWorker.onmessage = (event) => {
    if (event.data && event.data.type === 'refresh') {
      location.reload();
    }
  };
});
</script>

<template>
  <router-view />
  <ReloadPrompt />
</template>

<style>
html,
body {
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
</style>
