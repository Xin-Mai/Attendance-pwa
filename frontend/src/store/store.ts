// 因为页面简单，仅需存储用户信息相关的内容，因此不使用任何状态管理类库
import { reactive, UnwrapNestedRefs } from 'vue';
interface myState {
  username: string;
}

interface MyStore {
  state: UnwrapNestedRefs<myState>;
  action: {
    [functonName: string]: Function;
  };
}
const store: MyStore = {
  state: reactive({
    username: '',
  }),
  action: {
    initial(): void {
      const localName: string | null = window.localStorage.getItem('username');
      store.state.username = localName ? localName : '';
    },
    isSignIn(): boolean {
      return store.state.username !== '';
    },
    signIn(username: string, remember: boolean = false): void {
      store.state.username = username;
      if (remember) {
        this.setPersistence();
      }
    },
    signOut(): void {
      this.setUsername('');
      this.removePersistence();
    },
    getUsername(): string {
      return store.state.username;
    },
    setUsername(newName: string): void {
      store.state.username = newName;
    },
    setPersistence(): void {
      window.localStorage.setItem('username', store.state.username);
    },
    removePersistence(): void {
      if (window.localStorage.getItem('username')) {
        window.localStorage.clear();
      }
      // 这里还需要清除cookie
      this.clearCookie('token');
    },
    clearCookie(name: string = 'token'): void {
      const cookies: string[] = document.cookie.split(';');
      let val: string = '';
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) != -1) {
          val = cookie.substring(name.length, cookie.length);
          break;
        }
      }
      // const exp = new Date();
      // exp.setTime(exp.getTime() - 1);
      document.cookie = `${name}=${val};max-age=0`;
    },
  },
};

store.action.initial();

export default store;
