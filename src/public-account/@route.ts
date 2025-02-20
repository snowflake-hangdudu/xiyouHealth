import AntIcon from '@/assets/icons'
import { Layout } from '@/router/routerHelper'
import { defineAsyncCP } from '@/utils/asyncRouter'


export const accountRoutes: AppRouteRecordRaw[] = [
  {
    path: '/account',
    component: Layout,
    redirect: '/account/account',
    name: 'Account',
    meta: {
      title: '账号管理',
      icon: AntIcon.coffee,
      alwaysInRoles: true
    },
    children: [
      {
        path: 'account',
        component: () => defineAsyncCP(() => import('@/public-account/pages/account-manage/account.vue')),
        name: 'account',
        meta: {
          title: '账号管理',
          icon: AntIcon.antDesign,
          noCache: true,
          alwaysInRoles: true
        }
      }
    ]
  }
]
