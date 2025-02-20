import { useAppStoreOutside } from '@/store/modules/app'
import { PermissionScope } from './systemPermissionCenter'
import { updateNoticeCenter } from './noticeCenter'
import routerTag from './routeTagCenter'

const appStore = useAppStoreOutside()

/** 登陆/进入系统加载用户信息后 */
export function onInitUserInfo() {
  appStore.getUserInfo

  routerTag.Analysis = undefined
}
export function onRouterLoaded() {}
