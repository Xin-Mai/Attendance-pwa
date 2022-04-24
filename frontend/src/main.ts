import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { registerSW } from 'virtual:pwa-register';

createApp(App).use(router).use(Antd).mount('#app');

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});
