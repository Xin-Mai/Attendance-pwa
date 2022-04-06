import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);
  return {
    plugins: [vue()],
    resolve: {
      alias: [
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
      ],
    },
    server: {
      port: parseInt(env.VITE_PORT),
      strictPort: false,
      https: false,
      proxy: {
        [env.VITE_API_URL]: {
          target: env.VITE_API_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
};
