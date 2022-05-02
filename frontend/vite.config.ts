import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import { ManifestOptions, VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// import replace from '@rollup/plugin-replace'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['/public/favicon.svg', 'offline-image.png', 'offline.html'],
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
  workbox: {
    sourcemap: true,
  },
  manifest: {
    name: 'PWA Router',
    short_name: 'PWA Router',
    theme_color: '#ffffff',
    icons: [
      {
        src: 'pwa-192x192.png', // <== don't add slash, for testing
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png', // <== don't remove slash, for testing
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png', // <== don't add slash, for testing
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === 'true',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  },
};

// const replaceOptions = { __DATE__: new Date().toISOString() }
export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);
  return {
    build: {
      sourcemap: process.env.SOURCE_MAP === 'true',
    },
    plugins: [Vue(), VitePWA(pwaOptions)],
    optimizeDeps: {
      include: ['echarts'],
    },
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
  };
};
