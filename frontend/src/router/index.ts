import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import CheckList from '../views/CheckList.vue';
import Login from '../views/Login.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: CheckList,
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;