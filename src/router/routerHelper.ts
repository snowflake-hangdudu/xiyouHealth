import { createRouter, createWebHashHistory } from 'vue-router'
import type { Router, RouteLocationNormalized, RouteRecordNormalized, RouteMeta, RouteRecordRaw } from 'vue-router'
import { isUrl } from '@/utils/is'
import { omit, cloneDeep } from 'lodash-es'
import { useAppStore } from '@/store/modules/app'
import { useCosplayMode } from '@/store/modules/cosplay'
import { loadPermission, PermissionScope } from '@/global/systemPermissionCenter'
import { defineAsyncCP } from '@/utils/asyncRouter'

const modules = import.meta.glob('../views/**/*.{vue,tsx}')

/* Layout */
export const Layout = () => import('@/layout/Layout.vue')

export const getParentLayout = () => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: 'ParentLayout'
      })
    })
}

export const getRawRoute = (route: RouteLocationNormalized): RouteLocationNormalized => {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path
        }))
      : undefined) as RouteRecordNormalized[]
  }
}

// 前端控制路由生成
export const generateRoutesFn1 = (routes: AppRouteRecordRaw[], basePath = '/'): AppRouteRecordRaw[] => {
  const finalRouteList: AppRouteRecordRaw[] = []
  for (const route of routes) {
    const meta = route.meta as RouteMeta
    // skip some route
    if (meta.hidden && meta.canTo === false) continue
    // 设置权限判断
    // let permissions = ['superadmin'];
    const hasPermission = PermissionScope.hasRoute(route)
    console.log('has permission', route.meta.title, route.meta.roles, hasPermission)
    if (route.children) {
      route.children = generateRoutesFn1(route.children ?? [], '')
    }

    if (route.children?.length === 0) continue
    if (!hasPermission) continue
    let onlyOneChild: Nullable<string> = null
    if (route.children && route.children.length === 1 && !meta.alwaysShow) {
      onlyOneChild = (
        isUrl(route.children[0].path) ? route.children[0].path : pathResolve(pathResolve(basePath, route.path), route.children[0].path)
      ) as string
    }
    finalRouteList.push(Object.assign({}, route) as AppRouteRecordRaw)
  }
  if (finalRouteList.length == 0 && basePath !== '')
    finalRouteList.push({
      path: '/dashboard',
      component: Layout,
      redirect: '/dashboard/analysis',
      name: 'Dashboard',
      meta: { title: 'Dashboard' },
      children: [
        {
          path: 'analysis',
          component: () => defineAsyncCP(() => import('@/views/index.vue')),
          name: 'Analysis',
          meta: {
            title: 'Dashboard',
            icon: 'ant-design:dashboard-filled',
            noCache: true,
            affix: false
          }
        }
      ]
    })
  return finalRouteList
}

export const pathResolve = (parentPath: string, path: string) => {
  if (isUrl(path)) return path
  const childPath = path.startsWith('/') || !path ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/')
}

// 路由降级
export const flatMultiLevelRoutes = (routes: AppRouteRecordRaw[]) => {
  const modules: AppRouteRecordRaw[] = cloneDeep(routes)
  for (let index = 0; index < modules.length; index++) {
    const route = modules[index]
    if (!isMultipleRoute(route)) {
      continue
    }
    promoteRouteLevel(route)
  }
  return modules
}

// 层级是否大于2
const isMultipleRoute = (route: AppRouteRecordRaw) => {
  if (!route || !Reflect.has(route, 'children') || !route.children?.length) {
    return false
  }

  const children = route.children

  let flag = false
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    if (child.children?.length) {
      flag = true
      break
    }
  }
  return flag
}

// 生成二级路由
const promoteRouteLevel = (route: AppRouteRecordRaw) => {
  let router: Router | null = createRouter({
    routes: [route as RouteRecordRaw],
    history: createWebHashHistory()
  })

  const routes = router.getRoutes()
  addToChildren(routes, route.children || [], route)
  router = null

  route.children = route.children?.map((item) => omit(item, 'children'))
}

// 添加所有子菜单
const addToChildren = (routes: RouteRecordNormalized[], children: AppRouteRecordRaw[], routeModule: AppRouteRecordRaw) => {
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    const route = routes.find((item) => item.name === child.name)
    if (!route) {
      continue
    }
    routeModule.children = routeModule.children || []
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteRecordRaw)
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule)
    }
  }
}
