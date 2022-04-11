import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import CheckList from '../views/CheckList.vue';
import Login from '../views/Login.vue';
import Test from '../views/Test.vue';
import ClassesList from '../views/Classes.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: '/classes',
  },
  {
    path: '/check/:course/:className',
    name: 'check',
    component: CheckList,
    props: true,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/classes',
    name: 'classes',
    component: ClassesList,
  },
  {
    path: '/test',
    name: 'test',
    component: Test,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
