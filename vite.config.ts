import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import topLevelAwait from 'vite-plugin-top-level-await'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import UnoCSS from 'unocss/vite'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  const env: Record<string, string> = loadEnv(mode, process.cwd())

  return defineConfig({
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [
          path.resolve(process.cwd(), 'src/assets/icons'),
          path.resolve(process.cwd(), 'node_modules/vscode-icons-ts/build/icons')
        ],
        symbolId: 'icon-[dir]-[name]'
      }),
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: i => `__tla_${i}`
      }),
      UnoCSS(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: './src/types/auto-imports.d.ts'
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: './src/types/components.d.ts'
      }),
      visualizer({
        open: false
      }),
    ],
    build: {
      emptyOutDir: true,
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('node_modules')) {
              const separator = id.includes('.pnpm') ? '.pnpm/' : 'node_modules/'
              const name = id.split(separator)[1].split('/')[0]
              return `dependencies/${name}`
            }
            if (id.includes('src/assets/icons')) {
              const name = id.split('src/assets/icons/')[1].split('/')[0].split('.svg')[0]
              return `icons/${name}`
            }
          },
          chunkFileNames: 'chunks/[name]-[hash].js',
          entryFileNames: 'entries/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
        }
      },
    },
    resolve: {
      alias: {
        '@': path.resolve('src'),
      }
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer()
        ]
      }
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      open: false,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_URL,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
        }
      }
    }
  })
}
