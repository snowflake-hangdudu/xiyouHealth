import { defineAsyncCP } from '@/utils/asyncRouter'
import { Layout } from './routerHelper'
import { debugRoutes } from '@/public-pages/@route'

/**
 * 常量路由
 */
export const initRouters: AppRouteRecordRaw[] = [
  /** 首页 */
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'redirect',
        component: () => defineAsyncCP(() => import('@/views/Redirect/Redirect.vue')),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => defineAsyncCP(() => import('@/views/Login/Login.vue')),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => defineAsyncCP(() => import('@/views/Error/404.vue')),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

/**
 * 未匹配时路由
 */
export const unMatchedRoute: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  redirect: '/404',
  name: '404Page',
  meta: {
    hidden: true,
    breadcrumb: false
  }
}

export default {
  initRouters,
  unMatchedRoute,
  debugRoutes
}
