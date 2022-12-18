import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'



// https://vitejs.dev/config/
export default ({ mode }:ConfigEnv) => {
  const env = loadEnv(mode, process.cwd())

  return defineConfig ({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve('src'),
      }
    },
    server: {
      port: Number(env.VITE_APP_PORT),
      open: false,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace('^' + env.VITE_APP_BASE_API, '')
        }
      }
    }
  })
}
