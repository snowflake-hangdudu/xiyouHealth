import AntIcon from '@/assets/icons'
import { Layout } from '@/router/routerHelper'
import { defineAsyncCP } from '@/utils/asyncRouter'



export const achievementRoutes: AppRouteRecordRaw[] = [
  {
    path: '/achievement',
    component: Layout,
    redirect: '/achievement/achievement-manage',
    name: 'Achievement',
    meta: {
      title: '成就信息',
      icon: AntIcon.coffee,
      alwaysInRoles: true,
    },
    children: [
      {
        path: 'achievement-manage',
        component: () => defineAsyncCP(() => import('@/public-achievement/pages/achievement.vue')),
        name: 'achievementManage',
        meta: {
          title: '成就信息',
          icon: AntIcon.antDesign,
          noCache: true,
          alwaysInRoles: true
        }
      },
    ]
  }
]