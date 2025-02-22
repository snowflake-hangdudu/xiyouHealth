import AntIcon from '@/assets/icons'
import { Layout } from '@/router/routerHelper'
import { defineAsyncCP } from '@/utils/asyncRouter'


export const dailyExerciseRoutes: AppRouteRecordRaw[] = [
  {
    path: '/daily-exercise',
    component: Layout,
    redirect: '/daily-exercise/tasks',
    name: 'DailyExercise',
    meta: {
      title: '运动任务列表',
      icon: AntIcon.coffee,
      alwaysInRoles: true
    },
    children: [
      {
        path: 'tasks',
        component: () => defineAsyncCP(() => import('@/public-dailyEx/pages/task.vue')),
        name: 'dailyExerciseTasks',
        meta: {
          title: '运动任务列表',
          icon: AntIcon.antDesign,
          noCache: true,
          alwaysInRoles: true
        }
      }
    ]
  }
]