import type { UserConfigExport, ConfigEnv } from 'vite'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { configCompressPlugin } from './build/plugin/compress'
import { viteMockServe } from 'vite-plugin-mock'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

// https://vitejs.dev/config/
export default ({ mode, command }: ConfigEnv): UserConfigExport => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const {
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
    VITE_DROP_CONSOLE,
    VITE_USE_IMAGEMIN
  } = env
  return {
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: command === 'serve'
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      }),
      configCompressPlugin(
        VITE_BUILD_COMPRESS as 'gzip' | 'brotli' | 'none',
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE === 'true'
      ),
      // VITE_USE_IMAGEMIN === 'true' && configImageminPlugin()
    ],
    resolve: {
      alias: {
        src: resolve(__dirname, 'src'),
        comps: resolve(__dirname, 'src/components'),
        api: resolve(__dirname, 'src/api'),
        hooks: resolve(__dirname, 'src/hooks'),
        types: resolve(__dirname, 'types')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "src/styles/var/_var.scss";'
        }
      }
    },
    server: {
      https: true,
      host: '0.0.0.0',
      strictPort: false
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境时移除console
          drop_console: VITE_DROP_CONSOLE === 'true',
          drop_debugger: VITE_DROP_CONSOLE === 'true'
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            axios: ['axios'],
            vue: ['vue'],
            pinia: ['pinia'],
            'vue-router': ['vue-router'],
            walletconnect: ['@walletconnect/web3-provider'],
            web3modal: ['web3modal'],
            web3: ['web3/dist/web3.min.js'],
            element: ['element-plus'],
          }
        },
        plugins: [
          nodePolyfills()
        ]
      },
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      }
    }
  }
}
