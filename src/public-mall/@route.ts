import AntIcon from '@/assets/icons'
import { Layout } from '@/router/routerHelper'
import { defineAsyncCP } from '@/utils/asyncRouter'


export const exchangeMallRoutes: AppRouteRecordRaw[] = [
  {
    path: '/exchange-mall',
    component: Layout,
    redirect: '/exchange-mall/list',
    name: 'ExchangeMall',
    meta: {
      title: '兑换商城列表',
      icon: AntIcon.coffee,
      alwaysInRoles: true
    },
    children: [
      {
        path: 'list',
        component: () => defineAsyncCP(() => import('@/public-mall/pages/mall.vue')),
        name: 'exchangeMallList',
        meta: {
          title: '兑换商城列表',
          icon: AntIcon.antDesign,
          noCache: true,
          alwaysInRoles: true
        }
      }
    ]
  }
]