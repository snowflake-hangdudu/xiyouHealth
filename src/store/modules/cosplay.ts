import { useCache } from '@/hooks/web/useCache'
import router from '@/router'
import { defineStore } from 'pinia'
import { unref } from 'vue'
import { store } from '../index'
import { usePermissionStore } from './permission'

const { wsCache } = useCache()

export interface CosplayTarget {
  id?: number
  name?: string
}

export interface CosplayState {
  targetInfo: CosplayTarget
  permissions: string[]
  permissionsBackUp: string[]
  targetInfoBackup: CosplayTarget
  lastRoutePath?: string
}

const useCosplayStore = defineStore('CosplayMode', {
  state: (): CosplayState => ({
    permissions: wsCache.get('cosplay_permissions') ?? [],
    targetInfo: wsCache.get('cosplay_target') ?? {},
    permissionsBackUp: [],
    targetInfoBackup: {},
    lastRoutePath: undefined
  }),
  getters: {
    getCosplayId(): number | undefined {
      if (!this.permissions?.length) return undefined
      return this.targetInfo.id
    },
    getCosplayName(): string | undefined {
      if (!this.permissions?.length) return undefined
      return `${this.targetInfo.name}`
    },
    getCosplayInfo(): CosplayTarget {
      if (!this.permissions?.length) return {}
      return this.targetInfo
    },
    getCosplayPermissions(): string[] {
      if (Array.isArray(this.permissions)) return this.permissions
      return []
    },
    getIsCosplayMode(): boolean {
      return !!this.permissions.length
    },
    getLastRoutePath(): string | undefined {
      return this.lastRoutePath
    }
  },
  actions: {
    openCosplayMode(permissions: string[], state?: CosplayTarget) {
      this.targetInfo = state ?? {}
      this.permissions = permissions.filter((e) => !!e)
      wsCache.set('cosplay_target', state)
      wsCache.set('cosplay_permissions', permissions)
      const pm = usePermissionStore()
      pm.regenerateRoutes(true)
    },
    exit() {
      this.targetInfoBackup = Object.assign({}, this.targetInfo)
      this.permissionsBackUp = [...this.permissions]
      this.targetInfo = {}
      this.permissions = []
      wsCache.set('cosplay_target', {})
      wsCache.set('cosplay_permissions', [])
      const pm = usePermissionStore()
      pm.regenerateRoutes()
    },
    restoreForRouter(noBackup?: boolean) {
      this.targetInfo = this.targetInfoBackup
      this.permissions = this.permissionsBackUp
      this.targetInfoBackup = {}
      this.permissionsBackUp = []
      if (noBackup) return
      wsCache.set('cosplay_target', this.targetInfoBackup)
      wsCache.set('cosplay_permissions', this.permissionsBackUp)
      const pm = usePermissionStore()
      pm.regenerateRoutes()
    },
    logout() {
      this.targetInfo = {}
      this.permissions = []
      this.targetInfoBackup = {}
      this.permissionsBackUp = []
      wsCache.set('cosplay_target', {})
      wsCache.set('cosplay_permissions', [])
    },
    hasMatchRoles(roles: string[]) {
      if (!roles.length) return true
      if (roles.length) {
        for (const permission of this.permissions) {
          if (permission.toLowerCase() == 'superadmin') return true
          if (roles.includes(permission)) return true
        }
      }
      return false
    },
    setLastRoutePath(path: string) {
      console.warn('setLastRoutePath', path)
      this.lastRoutePath = path
    }
  }
})

/** 可以模拟成其他角色的权限 */
export const useCosplayMode = () => {
  return useCosplayStore(store)
}
