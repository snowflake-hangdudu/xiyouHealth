import AntIcon from '@/assets/icons'
import { Layout } from '@/router/routerHelper'
import { defineAsyncCP } from '@/utils/asyncRouter'


export const exercisePrescriptionRoutes: AppRouteRecordRaw[] = [
  {
    path: '/exercise-prescription',
    component: Layout,
    redirect: '/exercise-prescription/list',
    name: 'ExercisePrescription',
    meta: {
      title: '运动处方',
      icon: AntIcon.coffee,
      alwaysInRoles: true
    },
    children: [
      {
        path: 'list',
        component: () => defineAsyncCP(() => import('@/public-exPre/pages/exercisePrescription.vue')),
        name: 'exercisePrescriptionList',
        meta: {
          title: '运动处方列表',
          icon: AntIcon.antDesign,
          noCache: true,
          alwaysInRoles: true
        }
      }
    ]
  }
]