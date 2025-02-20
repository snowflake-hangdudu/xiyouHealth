import AntIcon from '@/assets/icons'
import { Layout } from '@/router/routerHelper'
import { defineAsyncCP } from '@/utils/asyncRouter'


export const feedbackRoutes = [
  {
    path: '/feedback',
    component: Layout,
    redirect: '/feedback/list',
    name: 'Feedback',
    meta: {
      title: '意见反馈列表',
      icon: AntIcon.coffee,
      alwaysInRoles: true
    },
    children: [
      {
        path: 'list',
        component: defineAsyncCP(() => import('@/public-feedback/pages/feedback-manage/feedback.vue')),
        name: 'Feedback List',
        meta: {
          title: '意见反馈列表',
          icon: AntIcon.antDesign,
          noCache: true,
          alwaysInRoles: true
        }
      }
    ]
  }
]