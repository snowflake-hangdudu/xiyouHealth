import authRouters from './authRouters'
import { moduleRouters } from './authRouters'
import { useAppStoreOutside } from '@/store/modules/app'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import router from './index'
import constantRouters, { unMatchedRoute } from './constantRouters'
import { RouteRecordRaw } from 'vue-router'
import { cloneDeep } from 'lodash'

export default async function () {
  const user = useAppStoreOutside().getUserInfo
  //用户权限 roles不存在则赋值为空数组
  const roles: string[] = user?.role || []
  console.log('roles', roles)
  //内置函数，环境变量
  const env = import.meta.env
  const isDebug = env.VITE_DEBUG_ROUTERS == 'true'
  let routers = cloneDeep(authRouters) // 克隆路由,深拷贝;不推荐用JSON.parse ...

  routers.filter((item) => {
    //路由是否含有meta.roles(包含空数组)，没有的话默认都有权限
    if (!item.meta || !item.meta.roles || item.meta.roles.length === 0) {
      return true
    }
    if (roles && roles.length > 0) {
      if (roles.includes('admin')) return true // 超级管理员拥有所有权限
      return roles.some((role) => item.meta.roles?.includes(role))
    } else {
      return false
    }
  })
  routers.forEach((router) => {
    if (router.children) {
      router.children = router.children.filter((child) => {
        if (!child.meta || !child.meta.roles || !Array.isArray(child.meta.roles) || child.meta.roles.length === 0) {
          child.meta.roles = [] // 如果不是数组，则赋值为空数组
          return true
        }
        if (child.meta.roles && roles.length > 0) {
          if (roles.includes('admin')) return true // 超级管理员拥有所有权限
          return roles.some((role) => child.meta.roles?.includes(role))
        } else {
          return false
        }
      })
    }
  })

  //是否在可调试环境
  if (isDebug) {
    routers = routers.concat(constantRouters.debugRoutes)
  }
  routers.forEach((item) => {
    const exitedRouterNames = router.getRoutes().map((route) => route.name)
    if (!exitedRouterNames.includes(item.name)) {
      router.addRoute(item as RouteRecordRaw)
    }
  })

  // 添加 404 路由,必须最后添加，当路由匹配不到，则会跳到404页面；如果不添加,路由找不到的情况将会展示空页面或者展示默认页面;
  router.addRoute(unMatchedRoute as RouteRecordRaw)
  // 初始化 侧边栏
  await usePermissionStoreWithOut().initPermission(router, routers)
}
