import { defineAsyncCP } from '../utils/asyncRouter'
import AntIcon from '../assets/icons'
// import { commonRoutes } from '@/public-pages/@route'
import { userRoutes  } from '@/public-user/@route'
import { dailyLearningRoutes } from '@/public-dailyLearn/@route'
import { weeklyChallengRoutes } from '@/public-weekChange/@route'
import { exchangeMallRoutes } from '@/public-mall/@route'
import {feedbackRoutes} from '@/public-feedback/@route'
import { achievementRoutes } from '@/public-achievement/@route'
import { healthReportRoutes } from '@/public-healthReport/@route'
import { exercisePrescriptionRoutes } from '@/public-exPre/@route'
import { accountRoutes } from '@/public-account/@route'
import { dailyExerciseRoutes } from '@/public-dailyEx/@route'
import { Layout } from './routerHelper'

const dashboard = {
  path: '/dashboard',
  component: Layout,
  redirect: '/dashboard/analysis',
  name: 'Dashboard',
  meta: {
    title: 'Dashboard',
    alwaysInRoles: true
  },
  children: [
    {
      path: 'analysis',
      component: () => defineAsyncCP(() => import('@/views/index.vue')),
      name: 'Analysis',
      meta: {
        title: '首页',
        icon: 'ant-design:dashboard-filled',
        noCache: true,
        affix: false,
        alwaysInRoles: true
      }
    }
  ]
}

/**
 * 权限路由
 */
export default [
    /** 健康报告管理 **/
    ...healthReportRoutes,
  /**用户管理 **/
  ...userRoutes,
  /** 导师管理 **/
  ...dailyLearningRoutes,
  /** 学院管理 **/
  ...dailyExerciseRoutes,
  /** 实验室管理 **/
  ...weeklyChallengRoutes,
  /** 设备管理 **/
  ...exchangeMallRoutes,
  

  /** 课题管理 **/
  ...achievementRoutes,

  /** 数据统计 **/
  ...exercisePrescriptionRoutes,
  /** 账号管理 **/
  ...accountRoutes,
  /** 运动任务 **/
  ...dailyExerciseRoutes,

  /** 反��管理 **/
  ...feedbackRoutes,
  /** 首页 **/
  dashboard
] as AppRouteRecordRaw[]

export const moduleRouters = {
  dashboard,
  userRoutes,
  dailyLearningRoutes,
  dailyExerciseRoutes,
  weeklyChallengRoutes,
  exchangeMallRoutes,
  feedbackRoutes,
  achievementRoutes,
  healthReportRoutes,
  exercisePrescriptionRoutes,
  accountRoutes,
}
