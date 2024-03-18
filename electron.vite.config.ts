import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { svgIconsPlugin } from '@tangllty/vite-plugin-svg'
import topLevelAwait from 'vite-plugin-top-level-await'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import autoprefixer from 'autoprefixer'

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
    'col', 'image', 'backtop', 'slider', 'tree', 'cascader'
  ]
  return components.map(component => `element-plus/es/components/${component}/style/css`)
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main/index.ts')
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    root: '.',
    plugins: [
      externalizeDepsPlugin(),
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
        dts: './src/types/components.d.ts'
      }),
      visualizer({
        open: false
      }),
    ],
    optimizeDeps: {
      include: [
        'vue', 'emoji-mart', 'element-plus/es'
      ].concat(optimizeElementPlusComponentsInclude())
    },
    resolve: {
      alias: {
        '@': resolve('src'),
      }
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer()
        ]
      }
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html')
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: false,
      proxy: {
        ['/dev-api']: {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(new RegExp('^' + '/dev-api'), '')
        }
      }
    }
  }
})
