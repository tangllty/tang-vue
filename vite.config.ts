import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import topLevelAwait from 'vite-plugin-top-level-await'
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
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      }),
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: i => `__tla_${i}`
      }),
      UnoCSS()
    ],
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
