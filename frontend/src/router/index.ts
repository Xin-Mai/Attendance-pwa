import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  Router,
  RouteLocationNormalized,
} from 'vue-router';
import CheckList from '../views/CheckList.vue';
import Login from '../views/Login.vue';
import Test from '../views/Test.vue';
import ClassesList from '../views/Classes.vue';
import Store from '/@/store/store';
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

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to: RouteLocationNormalized, _: RouteLocationNormalized) => {
  if (to.name !== 'login') {
    if (!Store.action.isSignIn()) {
      return { name: 'login' };
    }
  } else {
    if (Store.action.isSignIn()) {
      return { name: 'home' };
    }
  }
  return true;
});

export default router;
