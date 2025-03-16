import { defineStore } from 'pinia'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'
import { Router } from 'vue-router'
import router, { asyncRouters } from '@/router'

export interface PermissionState {
  isHasInitRouters: boolean
  leftBarRoutersMap: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    isHasInitRouters: false,
    leftBarRoutersMap: []
  }),
  getters: {
    getLeftBarRouters(): AppRouteRecordRaw[] {
      return this.leftBarRoutersMap
    },
    getRouters() {
      return this.getLeftBarRouters
    }
  },
  actions: {
    initPermission(route: Router, routers: AppRouteRecordRaw[]): Promise<unknown> {
      return new Promise<void>((resolve) => {
        // 获取全部生成的路由
        const routers = route.getRoutes()
   
        this.isHasInitRouters = true
        // 生成动态路由左侧菜单
        this.leftBarRoutersMap = filterRouters(asyncRouters, routers as AppRouteRecordRaw[])

        resolve()
      })
    },
    setHasInitRouters(isHasInitRouters) {
      this.isHasInitRouters = isHasInitRouters
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}

//过滤路由的方法
function filterRouters(partRouters: AppRouteRecordRaw[], routers: AppRouteRecordRaw[]) {
  let filterRouters = cloneDeep(partRouters) // 克隆要筛选的路由,深拷贝;
  const allRouters = cloneDeep(routers) //克隆生成的路由实例，深拷贝
  let itemsToRemove: AppRouteRecordRaw[] = [] // 存储要删除的路由
  filterRouters.map((item) => {
    //查找一级路由，因为一级路由此时已经包括过滤后的二级路由，所以直接赋值即可，无需递归查找二级路由
    const matchRoute = allRouters.find((router) => router.name === item.name)
    if (matchRoute) {
      item.children = matchRoute.children //匹配到就赋值

      // 如果没有子路由，则需要删除该路由
      if (item.children?.length === 0) {
        itemsToRemove.push(item) // 将需要删除的元素添加到数组中
      }
    }
    return item
  })
  // 在循环结束后删除元素
  itemsToRemove.forEach((item) => filterRouters.splice(filterRouters.indexOf(item), 1))
  return filterRouters
}
