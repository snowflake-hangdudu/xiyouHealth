// 引入windi css
import '@/plugins/windi.css'

// 导入全局的svg图标
import '@/plugins/svgIcon'
/** 引入阿里巴巴图标哭 */
import './assets/iconfont/iconfont'
import './assets/iconfont/iconfont.css'
// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理
import { setupStore } from '@/store'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.less'
// 引入富文本全局样式
import '@/styles/richtext.less'
// 引入动画
import '@/plugins/animate.css'



// 路由
import { setupRouter } from './router'

// 权限
import { setupPermission } from './directives'

import { createApp } from 'vue'

import App from './App.vue'

import './router/permission'

import Coin from '@/widget/coin/coin.vue'
import HSYSelect from '@/widget/hsy-select/hsy-select.vue'

import { createWatermark } from './utils/waterMark'

// 创建实例
const setupAll = async () => {
  const app = createApp(App)



  // 清理旧缓存数据
  try {
    indexedDB.deleteDatabase('HSY_DB')
    for (const key in localStorage) {
      if (key.indexOf('__table') == 0 || key.indexOf('Table#D:') == 0 || key.indexOf('_excel_goods_list_link') == 0) {
        localStorage.removeItem(key)
      }
    }
  } catch (error) {
    console.error('旧缓存清理问题'), error
  }

  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupRouter(app)

  setupPermission(app)

  // app.component('Coin', Coin)
  // app.component('HSYSelect', HSYSelect)

  app.mount('#app')

  app.directive('check', {
    mounted(el: any, binding: any, node: any, __: any) {
      // console.warn(el, binding, node)
      if (!binding.value) {
        el.style['pointer-events'] = 'none'
        el.style['opacity'] = '0.1'
      } else {
        el.style['pointer-events'] = undefined
        el.style['opacity'] = '1'
      }
    },
    updated(el: any, binding: any, node: any, __: any) {
      // console.warn(el, binding, node)
      if (!binding.value) {
        el.style['pointer-events'] = 'none'
        el.style['opacity'] = '0.1'
      } else {
        el.style['pointer-events'] = undefined
        el.style['opacity'] = '1'
      }
    }
  })
  if (import.meta.env.VITE_USER_NODE_ENV == 'sit') createWatermark('测试环境')
}

setupAll()
