import Store from '/@/store/store';
import Router from '/@/router/index';

export const signOut = () => {
  Store.action.signOut();
  Router.push({ name: 'login' });
};
