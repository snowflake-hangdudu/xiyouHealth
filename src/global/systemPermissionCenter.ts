import { ServerPermission } from '@/api/login'
import { useAppStore, useAppStoreOutside } from '@/store/modules/app'
import { ref } from 'vue'

export type CommonPermission = 'Add' | 'Edit' | 'Delete' | 'Detail'

/** 用户使用的系统版本 */
export enum SystemFeature {
  /** 不区分版本 */
  all = ''
  // /** 仅供应商 */
  // supplier = 'supplier',
  // /** 自营仓+供应商 */
  // pro = 'warehouse,supplier',
  // /** 导单版 */
  // onlyImport = 'lite',
}

const allowAll = true

/**
 * 权限范围
 * 在范围下，可以定义二级权限
 * 例如User的scope下，Add按钮具有的权限为:"User:Add"
 * 可以在每一页创建一个权限scope，然后在判断中使用v-check:
 * Ts: const permission = new PermissionScope('User');
 * Template: <el-button v-check="permission.has('Add')"">添加</el-button>
 * Template: <el-button v-check="permission.has('Edit')"">修改</el-button>
 */
export class PermissionScope {
  static avalaibleForAdmin(e: AppRouteRecordRaw, roleIds: any) {
    throw new Error('Method not implemented.')
  }
  scope: string

  constructor(scope: string) {
    this.scope = scope
  }

  has(permissionInScope: CommonPermission) {
    return this.hasSpecial(permissionInScope)
  }
  /**
   * 检查是否具有某个权限
   * @param permission 权限名字（中文）
   * @param targetVersion 是否指定某个版本可用
   * @returns
   */
  hasSpecial(permission: string, targetVersion?: SystemFeature) {
    if (allowAll) return true
    return PermissionScope.hasFull(`${this.scope}:${permission}`, targetVersion)
  }

  static hasFull(fullPermission: string, targetVersion?: SystemFeature) {
    if (allowAll) return true
    const user = useAppStoreOutside().userInfo

    // console.warn(fullPermission, companyAuth, targetVersion)
    const routeName = fullPermission.split(':')[0]
    if (!rolePermissionMap.size) {
      // console.warn(1, fullPermission, rolePermissionMap);
      return true
    }
    for (const config of rolePermissionMap.values()) {
      const [routesWithDetailSettings, routeHasLeaf, detailPermissions] = config
      fullPermission = fullPermission.replace('Add', '新增')
      fullPermission = fullPermission.replace('Edit', '修改')
      fullPermission = fullPermission.replace('Delete', '删除')
      fullPermission = fullPermission.replace('Detail', '详情')
      if (routesWithDetailSettings.has(routeName) && !routeHasLeaf.has(routeName)) return true
      if (detailPermissions.has(fullPermission)) return true
    }
    return false
  }

  /// 是否具有本路由权限
  static hasRoute(route: AppRouteRecordRaw, ignoreAdminRole?: boolean) {
    /** 获取路由上的权限 */
    const roles = route.meta.roles
    /** 判断路由是否有权限 */
    if (!route.meta.roles) return true
    /** 获取用户信息 */
    const userInfo = useAppStoreOutside().getUserInfo
    const userRole = userInfo?.role
    const userRoleList = JSON.parse(userRole!)
    for (let index = 0; index < userRoleList.length; index++) {
      const item = userRoleList[index]
      /** 判断路由上的权限是否有用户的权限 */
      return new Set(roles).has(item)
    }

    // if (userRoleList.includes('a/zsdmin')) return true
    // if (userRole == 'admin') return true
    // if (userRole == 'super_admin') return true
    // return new Set(roles).has(userRoleList!)
  }
}

export function usePermissionScope(scope: string) {
  return new PermissionScope(scope)
}

/** 当前权限可访问的路由 */
const routes = new Set()

/** 牛不牛逼 */
const rolePermissionMap: Map<number, [Set<string>, Set<string>, Set<string>]> = new Map()

export function loadPermission(list: ServerPermission[]) {
  rolePermissionMap.clear()
  routes.clear()
  for (const permission of list) {
    const [path, detail] = permission.permission?.split(':') ?? []
    if (!path) continue
    const routeNames = path.split('/')
    for (const routeName of routeNames) {
      routes.add(routeName)
    }
    const lastRouteName = routeNames[routeNames.length - 1]
    for (const roleId of permission.roleIdList ?? []) {
      if (!rolePermissionMap.get(roleId)) {
        rolePermissionMap.set(roleId, [new Set(), new Set(), new Set()])
      }
      rolePermissionMap.get(roleId)?.[0].add(lastRouteName)
      if (detail) {
        for (const permiName of detail.split(',')) {
          rolePermissionMap.get(roleId)?.[1].add(`${lastRouteName}`)
          rolePermissionMap.get(roleId)?.[2].add(`${lastRouteName}:${permiName}`)
        }
      }
    }
  }
  console.log('权限详情', {
    list,
    routes,
    rolePermissionMap
  })
}
