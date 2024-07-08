import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { svgIconsPlugin } from '@tangllty/vite-plugin-svg'
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

  const optimizeElementPlusComponentsInclude = () => {
    const components = [
      'aside', 'base', 'breadcrumb', 'breadcrumb-item', 'radio-group', 'scrollbar',
      'container', 'divider', 'drawer', 'row', 'color-picker', 'menu-item', 'tabs',
      'dropdown', 'icon', 'link', 'main', 'dropdown-item', 'dropdown-menu', 'menu',
      'input', 'upload', 'pagination', 'tag', 'form-item', 'input-number', 'radio',
      'popover', 'collapse', 'date-picker', 'tree-select', 'collapse-item', 'card',
      'tab-pane', 'checkbox', 'avatar', 'loading', 'table-column', 'timeline-item',
      'timeline', 'carousel', 'text', 'table', 'button', 'carousel-item', 'select',
      'dialog', 'option', 'empty', 'header', 'badge', 'form', 'sub-menu', 'switch',
      'col', 'backtop', 'slider', 'tree', 'tooltip', 'watermark', 'checkbox-group',
      'radio-button', 'cascader', 'image'
    ]
    return components.map(component => `element-plus/es/components/${component}/style/css`)
  }

  return defineConfig({
    plugins: [
      vue(),
      svgIconsPlugin({
        pattern: 'src/assets/icons/**/*.svg',
        prefix: 'icon'
      }),
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: i => `__tla_${i}`
      }),
      UnoCSS(),
      AutoImport({
        imports: ['vue', { 'vue': ['render'] }],
        resolvers: [ElementPlusResolver()],
        dts: './src/types/auto-imports.d.ts'
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: './src/types/components.d.ts',
        // include、exclude、glob not work solution
        dirs: 'src/components/autoconfigure'
      }),
      visualizer({
        open: false
      }),
    ],
    build: {
      emptyOutDir: true,
      chunkSizeWarningLimit: 500,
      terserOptions: {
        compress: {
          arguments: true,
          keep_infinity: true,
          passes: 2
        }
      },
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
    optimizeDeps: {
      include: [
        'vue', 'emoji-mart', 'element-plus/es', '@monaco-editor/loader'
      ].concat(optimizeElementPlusComponentsInclude())
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
