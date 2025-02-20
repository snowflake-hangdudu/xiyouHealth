import AntIcon from '@/assets/icons'
import { Layout } from '@/router/routerHelper'
import { defineAsyncCP } from '@/utils/asyncRouter'

export const weeklyChallengRoutes: AppRouteRecordRaw[] = [
  {
    path: '/weekly-challenge',
    component: Layout,
    redirect: '/weekly-challenge/list',
    name: 'WeeklyChallenge',
    meta: {
      title: '每周挑战',
      icon: AntIcon.coffee,
      alwaysInRoles: true
    },
    children: [
      {
        path: 'list',
        component: () => defineAsyncCP(() => import('@/public-weekChange/pages/weekChallenge.vue')),
        name: 'weeklyChallengeList',
        meta: {
          title: '每周挑战列表',
          icon: AntIcon.antDesign,
          noCache: true,
          alwaysInRoles: true
        }
      }
    ]
  }
]