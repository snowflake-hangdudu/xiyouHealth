import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { App } from 'vue'
import { moduleRouters } from './authRouters'
import constantRouters from './constantRouters'
const env = import.meta.env
console.log(env, 'env')

/** 动态路由 */
export const asyncRouters: AppRouteRecordRaw[] = [
  moduleRouters.dashboard,
  ...moduleRouters.userRoutes,
  ...moduleRouters.dailyLearningRoutes,
  ...moduleRouters.dailyExerciseRoutes,
  ...moduleRouters.weeklyChallengRoutes,
  ...moduleRouters.achievementRoutes,
  ...moduleRouters.healthReportRoutes,
  ...moduleRouters.exercisePrescriptionRoutes,
  ...moduleRouters.exchangeMallRoutes,
  ...moduleRouters.feedbackRoutes,
  ...moduleRouters.accountRoutes,
  ...(env.VITE_DEBUG_ROUTERS === 'true' ? constantRouters.debugRoutes : [])
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouters.initRouters as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * 重置路由: 登录前路由
 */
export const resetRouter = (): void => {
  // 白名单路由列表，即初始路由列表，需要保留
  const resetWhiteNameList = constantRouters.initRouters.map((item) => item.name)
  //拿到全部路由，然后过滤掉白名单的路由，去除剩下的路由
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}
/**
 * 挂载路由
 * @param app
 */
export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
