import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { ManifestOptions, VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
// import replace from '@rollup/plugin-replace'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.svg'],
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'prompt-sw.ts',
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
}

// const replaceOptions = { __DATE__: new Date().toISOString() }

export default defineConfig({
  // base: process.env.BASE_URL || 'https://github.com/',
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
  },
  plugins: [
    Vue(),
    VitePWA(pwaOptions),
    // replace(replaceOptions),
  ],
})
