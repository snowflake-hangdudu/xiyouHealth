import router from './index'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { useNProgress } from '@/hooks/web/useNProgress'
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreOutside } from '@/store/modules/app'
import { getUserInfoApi } from '@/api/login'
import { onInitUserInfo, onRouterLoaded } from '@/global/lifeCycle'
import whiteList from './whiteList'
import { useTitle } from '@/hooks/web/useTitle'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import generateRoutes from './generate'

const { start, done } = useNProgress()
const { loadStart, loadDone } = usePageLoading()
const { wsCache } = useCache()

const appStore = useAppStoreOutside()

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()

  if (!appStore.getUserInfo && wsCache.get('admin-token')) {
    // const res = (await getUserInfoApi()).data
    // 模拟登录数据
    const res = {
      id: 1,
      role: ['super']
    }
    console.warn('Load Userinfo:', res)
    appStore.setUserInfo(Object.assign({}, res))
    onInitUserInfo()
  }
  if (wsCache.get('admin-token')) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (usePermissionStoreWithOut().isHasInitRouters) {
        next()
      } else {
        await generateRoutes()
        onRouterLoaded()
        const redirectPath = from.query.redirect || to.path
        const redirect = decodeURIComponent(redirectPath as string)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
        next(nextData)
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({
        path: '/login',
        query: {
          ...to.query,
          redirect: to.path
        }
      })
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
  console.log('afterEach: router', router)
})
