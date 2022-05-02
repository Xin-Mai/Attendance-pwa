<script setup lang="ts">
import ReloadPrompt from '/@/components/common/ReloadPrompt.vue';
import { onBeforeMount } from 'vue';

onBeforeMount(() => {
  if ('serviceWorker' in navigator && navigator.serviceWorker) {
    self.onmessage = (e) => {
      console.log(e);
    };
    self.addEventListener('message', (event) => {
      console.log(event);
    });
  }

  if (navigator.serviceWorker && 'serviceWorker' in navigator) {
    navigator.serviceWorker.onmessage = (event) => {
      alert('receive message from service worker');
      if (event.data) {
        console.log(event.data);
      }
    };
    console.log(navigator.serviceWorker.onmessage);
  }
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
