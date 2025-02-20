import AntIcon from '@/assets/icons'
import { Layout } from '@/router/routerHelper'
import { defineAsyncCP } from '@/utils/asyncRouter'


export const dailyLearningRoutes: AppRouteRecordRaw[] = [
  {
    path: '/daily-learning',
    component: Layout,
    redirect: '/daily-learning/content',
    name: 'DailyLearning',
    meta: {
      title: '学习内容',
      icon: AntIcon.coffee,
      alwaysInRoles: true
    },
    children: [
      {
        path: 'content',
        component: () => defineAsyncCP(() => import('@/public-dailyLearn/pages/daily-learning.vue')),
        name: 'dailyLearningContent',
        meta: {
          title: '学习内容列表',
          icon: AntIcon.antDesign,
          noCache: true,
          alwaysInRoles: true
        }
      }
    ]
  }
]