import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// eslint-disable-next-line import/no-unresolved
import AutoImport from 'unplugin-auto-import/vite'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import vuetify from '@vuetify/vite-plugin'
import { defineConfig, loadEnv } from 'vite'
import electron from 'vite-plugin-electron/renderer'
import resolve from 'vite-plugin-resolve'
const path = require('path')

const env = loadEnv('', path.resolve(__dirname, '../../'))

enum BUILDMODE {
  DEV = 'development',
  PROD = 'production',
  ELECTRON_DEV = 'development-electron',
  ELECTRON_PROD = 'production-electron',
}
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(mode, command)
  const plugins: any = [
    vue({
      reactivityTransform: true,
    }),
    // vuetify({
    //   styles: 'expose',
    //   autoImport: false,
    // }),
    vueJsx(),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router', 'vue/macros', '@vueuse/head', '@vueuse/core'],
      dts: './src/auto-imports.d.ts',
    }),
  ]
  if (mode == BUILDMODE.ELECTRON_DEV || mode == BUILDMODE.ELECTRON_PROD) {
    plugins.push(
      electron(),
      resolve(
        /**
         * Here you can specify other modules
         * 🚧 You have to make sure that your module is in `dependencies` and not in the` devDependencies`,
         *    which will ensure that the electron-builder can package it correctly
         */
        {
          // If you use electron-store, this will work
          'electron-store': 'const Store = require("electron-store"); export default Store;',
        }
      )
    )
  }
  return {
    mode: mode,
    envDir: path.resolve(__dirname, '../../'),
    root: __dirname,
    plugins: plugins,
    base: '/',
    build: {
      outDir: '../../dist/renderer',
      emptyOutDir: true,
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env': {},
    },
    server: {
      host: env.VITE_DEV_SERVER_HOST,
      port: +env.VITE_DEV_SERVER_PORT,
      proxy: {
        '/api': {
          target: `http://${env.VITE_API_SERVER_HOST}:${env.VITE_API_SERVER_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
    resolve: {
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ]
    },
    */
  }
})
