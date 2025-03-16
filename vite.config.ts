import { resolve } from 'path'
import { loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import VueJsx from '@vitejs/plugin-vue-jsx'
import EslintPlugin from 'vite-plugin-eslint'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import PurgeIcons from 'vite-plugin-purge-icons'
// import { viteMockServe } from 'vite-plugin-mock'
import { createHtmlPlugin } from 'vite-plugin-html'
import VueMarcos from 'unplugin-vue-macros/vite'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import progress from 'vite-plugin-progress'
import viteCompression from 'vite-plugin-compression'
// https://vitejs.dev/config/
const root = process.cwd()

function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  let env = {} as any
  const isBuild = command === 'build'
  if (!isBuild) {
    env = loadEnv((process.argv[3] === '--mode' ? process.argv[4] : process.argv[3]), root)
  } else {
    env = loadEnv(mode, root)
  }
  const NODE_ENV = env.VITE_USER_NODE_ENV;
  if (!NODE_ENV) throw new Error("需要环境变量 例如:NODE_ENV=development");
  if (!~['development', 'sit', 'production'].indexOf(NODE_ENV))
    throw new Error(`环境变量必须是: development,sit,production 现在是:${NODE_ENV}`);

  console.log('启动环境', NODE_ENV);

  return {
    base: env.VITE_BASE_PATH,
    plugins: [
      Vue(),
      VueJsx(),
      WindiCSS(),
      progress(),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [{
          libraryName: 'element-plus',
          esModule: true,
          resolveStyle: (name) => {
            return `element-plus/es/components/${name.substring(3)}/style/css`
          }
        }]
      }),
      EslintPlugin({
        cache: false,
        include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件
      }),
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        include: [resolve(__dirname, 'src/locales/**')]
      }),
      createSvgIconsPlugin({
        iconDirs: [pathResolve('src/assets/svgs')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: true
      }),
      PurgeIcons(),
      viteCompression({
        threshold: 512000 // 文件压缩
      }),
      VueMarcos(),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
            injectScript: `<script src="./inject.js"></script>`,
          }
        }
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],

    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "./src/styles/variables.module.less";',
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less', '.css'],
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
        },
        {
          find: /\@\//,
          replacement: `${pathResolve('src')}/`
        }
      ]
    },
    build: {
      minify: 'terser',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      // brotliSize: false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true'
        }
      },
    },
    server: {
      port: 4000,  //参考作用
      proxy: {
        '/api': {
          target: {
            //本地
            'development': 'http://192.168.31.97:7098/api/',

            // 'development': 'http://124.222.23.240/api/'

            // 'development': 'https://szubbtest.deepmedical.net.cn/laboratory_reservation/api/',
            //测试环境
            // 'development': 'https://szubbtest.deepmedical.net.cn/szu_convergence_media/api/',
            // 'sit': 'https://test.ybhospital.net/api/',
            // 'production': 'https://www.hsyxz.com/api/',
          }[NODE_ENV], // 腾讯云
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/g, ''),
        },
        //可配置多种代理
        // '/test':{

        // }
 
      },
      hmr: true,
      host: '0.0.0.0'
    },
    
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'vue-types',
        // 暴力抄一下，傻人有傻福
        'element-plus/es/components/affix/style/css',
        'element-plus/es/components/alert/style/css',
        'element-plus/es/components/aside/style/css',
        'element-plus/es/components/autocomplete/style/css',
        'element-plus/es/components/avatar/style/css',
        'element-plus/es/components/backtop/style/css',
        'element-plus/es/components/badge/style/css',
        'element-plus/es/components/base/style/css',
        'element-plus/es/components/breadcrumb/style/css',
        'element-plus/es/components/breadcrumb-item/style/css',
        'element-plus/es/components/button/style/css',
        'element-plus/es/components/button-group/style/css',
        'element-plus/es/components/calendar/style/css',
        'element-plus/es/components/card/style/css',
        'element-plus/es/components/carousel/style/css',
        'element-plus/es/components/carousel-item/style/css',
        'element-plus/es/components/cascader/style/css',
        'element-plus/es/components/cascader-panel/style/css',
        'element-plus/es/components/check-tag/style/css',
        'element-plus/es/components/checkbox/style/css',
        'element-plus/es/components/checkbox-button/style/css',
        'element-plus/es/components/checkbox-group/style/css',
        'element-plus/es/components/col/style/css',
        'element-plus/es/components/collapse/style/css',
        'element-plus/es/components/collapse-item/style/css',
        'element-plus/es/components/collapse-transition/style/css',
        'element-plus/es/components/color-picker/style/css',
        'element-plus/es/components/config-provider/style/css',
        'element-plus/es/components/container/style/css',
        'element-plus/es/components/date-picker/style/css',
        'element-plus/es/components/descriptions/style/css',
        'element-plus/es/components/descriptions-item/style/css',
        'element-plus/es/components/dialog/style/css',
        'element-plus/es/components/divider/style/css',
        'element-plus/es/components/drawer/style/css',
        'element-plus/es/components/dropdown/style/css',
        'element-plus/es/components/dropdown-item/style/css',
        'element-plus/es/components/dropdown-menu/style/css',
        'element-plus/es/components/empty/style/css',
        'element-plus/es/components/footer/style/css',
        'element-plus/es/components/form/style/css',
        'element-plus/es/components/form-item/style/css',
        'element-plus/es/components/header/style/css',
        'element-plus/es/components/icon/style/css',
        'element-plus/es/components/image/style/css',
        'element-plus/es/components/image-viewer/style/css',
        'element-plus/es/components/infinite-scroll/style/css',
        'element-plus/es/components/input/style/css',
        'element-plus/es/components/input-number/style/css',
        'element-plus/es/components/link/style/css',
        'element-plus/es/components/loading/style/css',
        'element-plus/es/components/main/style/css',
        'element-plus/es/components/menu/style/css',
        'element-plus/es/components/menu-item/style/css',
        'element-plus/es/components/menu-item-group/style/css',
        'element-plus/es/components/message/style/css',
        'element-plus/es/components/message-box/style/css',
        'element-plus/es/components/notification/style/css',
        'element-plus/es/components/option/style/css',
        'element-plus/es/components/option-group/style/css',
        'element-plus/es/components/overlay/style/css',
        'element-plus/es/components/page-header/style/css',
        'element-plus/es/components/pagination/style/css',
        'element-plus/es/components/popconfirm/style/css',
        'element-plus/es/components/popover/style/css',
        'element-plus/es/components/popper/style/css',
        'element-plus/es/components/progress/style/css',
        'element-plus/es/components/radio/style/css',
        'element-plus/es/components/radio-button/style/css',
        'element-plus/es/components/radio-group/style/css',
        'element-plus/es/components/rate/style/css',
        'element-plus/es/components/result/style/css',
        'element-plus/es/components/row/style/css',
        'element-plus/es/components/scrollbar/style/css',
        'element-plus/es/components/select/style/css',
        'element-plus/es/components/select-v2/style/css',
        'element-plus/es/components/skeleton/style/css',
        'element-plus/es/components/skeleton-item/style/css',
        'element-plus/es/components/slider/style/css',
        'element-plus/es/components/space/style/css',
        'element-plus/es/components/step/style/css',
        'element-plus/es/components/steps/style/css',
        'element-plus/es/components/sub-menu/style/css',
        'element-plus/es/components/switch/style/css',
        'element-plus/es/components/tab-pane/style/css',
        'element-plus/es/components/table/style/css',
        'element-plus/es/components/table-column/style/css',
        'element-plus/es/components/table-v2/style/css',
        'element-plus/es/components/tabs/style/css',
        'element-plus/es/components/tag/style/css',
        'element-plus/es/components/teleport/style/css',
        'element-plus/es/components/time-picker/style/css',
        'element-plus/es/components/time-select/style/css',
        'element-plus/es/components/timeline/style/css',
        'element-plus/es/components/timeline-item/style/css',
        'element-plus/es/components/tooltip/style/css',
        'element-plus/es/components/transfer/style/css',
        'element-plus/es/components/tree/style/css',
        'element-plus/es/components/tree-select/style/css',
        'element-plus/es/components/tree-v2/style/css',
        'element-plus/es/components/upload/style/css',
        'element-plus/es/components/virtual-list/style/css',
        'element-plus/es/locale/lang/zh-cn',
        'element-plus/es/locale/lang/en',
        '@iconify/iconify',
        '@vueuse/core',
        'axios',
        'qs',
        'echarts',
        'echarts-wordcloud',
        'intro.js',
        'qrcode',
      ]
    }
  }
}
