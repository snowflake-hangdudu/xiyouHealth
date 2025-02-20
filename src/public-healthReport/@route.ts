import AntIcon from '@/assets/icons'
import { Layout } from '@/router/routerHelper'
import { defineAsyncCP } from '@/utils/asyncRouter'

export const healthReportRoutes: AppRouteRecordRaw[] = [
  {
    path: '/health-report',
    component: Layout,
    redirect: '/health-report/list',
    name: 'HealthReport',
    meta: {
      title: '健康报告',
      icon: AntIcon.coffee,
      alwaysInRoles: true
    },
    children: [
      {
        path: 'list',
        component: () => defineAsyncCP(() => import('@/public-healthReport/pages/healthReport.vue')),
        name: 'healthReportList',
        meta: {
          title: '健康报告列表',
          icon: AntIcon.antDesign,
          noCache: true,
          alwaysInRoles: true
        }
      }
    ]
  }
]