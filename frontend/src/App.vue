<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';

import ReloadPrompt from '/@/components/common/ReloadPrompt.vue';

const pong = ref(null);
const mode = ref(null);

// replaced dyanmicaly
const date = '__DATE__';
// const timeAgo = useTimeAgo(date);
const timeAgo = new Date();
</script>

<template>
  <img src="/favicon.svg" alt="PWA Logo" width="60" height="60" />
  <br />
  <div>Built at: {{ date }} ({{ timeAgo }})</div>
  <br />
  <router-view />
  <br />
  <br />
  <button>Ping web worker</button>
  &#160;&#160;
  <button>Reset message</button>
  <br />
  <br />
  <template v-if="pong">
    Response from web worker:
    <span> Message: {{ pong }} </span>&#160;&#160;<span>
      Using ENV mode: {{ mode }}</span
    >
  </template>
  <ReloadPrompt />
</template>

<!-- <script setup lang="ts">
import ReloadPrompt from '/@/components/common/ReloadPrompt.vue';
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
</style> -->
