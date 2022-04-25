import { ConfigEnv, defineConfig, loadEnv, UserConfigExport } from 'vite';
import Vue from '@vitejs/plugin-vue';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.svg'],
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
  manifest: {
    name: 'PWA',
    short_name: 'Short name of your app',
    description: 'Description of your app',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
};

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return defineConfig({
    plugins: [Vue(), VitePWA(pwaOptions)],
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
      host: env.VITE_HOST,
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
    preview: {
      host: env.VITE_HOST,
    },
  });
};
