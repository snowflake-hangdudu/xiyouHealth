import AntIcon from '@/assets/icons'
import { Layout } from '@/router/routerHelper'
import { defineAsyncCP } from '@/utils/asyncRouter'


export const userRoutes: AppRouteRecordRaw[] = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/user',
    name: 'User',
    meta: {
      title: '用户管理',
      icon: AntIcon.coffee,
      alwaysInRoles: true
    },
    children: [
      {
        path: 'user',
        component: () => defineAsyncCP(() => import('@/public-user/pages/user-manage/user.vue')),
        name: 'user',
        meta: {
          title: '用户管理',
          icon: AntIcon.antDesign,
          noCache: true,
          alwaysInRoles: true
        }
      }
    ]
  }
]
