import { defineStore } from 'pinia'
import { store } from '../index'
import { setCssVar, humpToUnderline } from '@/utils'
import { ElMessage } from 'element-plus'
import { ElementPlusSize } from '@/types/elementPlus'
import { useCache } from '@/hooks/web/useCache'
import { LayoutType } from '@/types/layout'
import { ThemeTypes } from '@/types/theme'
import { User } from '@/api/login'

const { wsCache } = useCache()

const basicTheme = {
  // 主题色
  elColorPrimary: '#409EFF',
  // 左侧菜单边框颜色
  leftMenuBorderColor: '#eee',
  // 左侧菜单背景颜色
  leftMenuBgColor: '#fff',
  // 左侧菜单浅色背景颜色
  leftMenuBgLightColor: '#fff',
  // 左侧菜单选中背景颜色
  leftMenuBgActiveColor: 'RGBA(18,99,238,0.1)',
  // 左侧菜单收起选中背景颜色
  leftMenuCollapseBgActiveColor: 'RGBA(18,99,238,0.1)',
  // 左侧菜单字体颜色
  leftMenuTextColor: '#333',
  // 左侧菜单选中字体颜色
  leftMenuTextActiveColor: 'var(--el-color-primary)',
  // logo字体颜色
  logoTitleTextColor: 'inherit',
  // logo边框颜色
  logoBorderColor: '#eee',
  // 头部背景颜色
  topHeaderBgColor: '#fff',
  // 头部字体颜色
  topHeaderTextColor: 'inherit',
  // 头部悬停颜色
  topHeaderHoverColor: '#f6f6f6',
  // 头部边框颜色
  topToolBorderColor: '#eee'
}

interface AppState {
  breadcrumb: boolean
  breadcrumbIcon: boolean
  collapse: boolean
  uniqueOpened: boolean
  hamburger: boolean
  screenfull: boolean
  size: boolean
  locale: boolean
  tagsView: boolean
  tagsViewIcon: boolean
  logo: boolean
  fixedHeader: boolean
  greyMode: boolean
  dynamicRouter: boolean
  pageLoading: boolean
  layout: LayoutType
  title: string
  token: string
  userInfo?: User
  isDark: boolean
  currentSize: ElementPlusSize
  sizeMap: ElementPlusSize[]
  mobile: boolean
  footer: boolean
  theme: ThemeTypes
  fixedMenu: boolean
  disableAutoUnread: boolean
  sysNotice: string
}

export const useAppStore = defineStore('app', {
  state: (): AppState => {
    return {
      userInfo: undefined, // 登录信息
      sizeMap: ['default', 'large', 'small'],
      mobile: false, // 是否是移动端
      title: import.meta.env.VITE_APP_TITLE, // 标题
      token: '',
      pageLoading: false, // 路由跳转loading

      breadcrumb: true, // 面包屑
      breadcrumbIcon: true, // 面包屑图标
      collapse: false, // 折叠菜单
      uniqueOpened: false, // 是否只保持一个子菜单的展开
      hamburger: true, // 折叠图标
      screenfull: true, // 全屏图标
      size: true, // 尺寸图标
      locale: false, // 多语言图标
      tagsView: true, // 标签页
      tagsViewIcon: true, // 是否显示标签图标
      logo: true, // logo
      fixedHeader: true, // 固定toolheader
      footer: false, // 显示页脚
      greyMode: false, // 是否开始灰色模式，用于特殊悼念日
      dynamicRouter: true, // 是否动态路由
      fixedMenu: wsCache.get('fixedMenu') || false, // 是否固定菜单

      layout: wsCache.get('layout') || 'classic', // layout布局
      isDark: wsCache.get('isDark') || false, // 是否是暗黑模式
      currentSize: wsCache.get('default') || 'default', // 组件尺寸
      theme: basicTheme,
      disableAutoUnread: wsCache.get('disableAutoUnread') || false,
      sysNotice: ''
    }
  },
  getters: {
    getBreadcrumb(): boolean {
      return this.breadcrumb
    },
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon
    },
    getCollapse(): boolean {
      return this.collapse
    },
    getUniqueOpened(): boolean {
      return this.uniqueOpened
    },
    getHamburger(): boolean {
      return this.hamburger
    },
    getScreenfull(): boolean {
      return this.screenfull
    },
    getSize(): boolean {
      return this.size
    },
    getLocale(): boolean {
      return this.locale
    },
    getTagsView(): boolean {
      return this.tagsView
    },
    getTagsViewIcon(): boolean {
      return this.tagsViewIcon
    },
    getLogo(): boolean {
      return this.logo
    },
    getFixedHeader(): boolean {
      return this.fixedHeader
    },
    getGreyMode(): boolean {
      return this.greyMode
    },
    getDynamicRouter(): boolean {
      return this.dynamicRouter
    },
    getFixedMenu(): boolean {
      return this.fixedMenu
    },
    getPageLoading(): boolean {
      return this.pageLoading
    },
    getLayout(): LayoutType {
      return this.layout
    },
    getTitle(): string {
      return this.title
    },
    getUserInfo(): User | undefined {
      return this.userInfo
    },
    getToken(): string {
      return this.token
    },
    getIsDark(): boolean {
      return this.isDark
    },
    getCurrentSize(): ElementPlusSize {
      return this.currentSize
    },
    getSizeMap(): ElementPlusSize[] {
      return this.sizeMap
    },
    getMobile(): boolean {
      return this.mobile
    },
    getTheme(): ThemeTypes {
      return this.theme
    },
    getFooter(): boolean {
      return this.footer
    },
    getDisableAutoUnread(): boolean {
      return this.disableAutoUnread
    },
    getSysNotice(): string {
      return this.sysNotice
    }
  },
  actions: {
    setUserInfo(user: User) {
      this.userInfo = user
    },
    logout() {
      this.userInfo = undefined
    },
    setBreadcrumb(breadcrumb: boolean) {
      this.breadcrumb = breadcrumb
    },
    setBreadcrumbIcon(breadcrumbIcon: boolean) {
      this.breadcrumbIcon = breadcrumbIcon
    },
    setCollapse(collapse: boolean) {
      this.collapse = collapse
    },
    setUniqueOpened(uniqueOpened: boolean) {
      this.uniqueOpened = uniqueOpened
    },
    setHamburger(hamburger: boolean) {
      this.hamburger = hamburger
    },
    setScreenfull(screenfull: boolean) {
      this.screenfull = screenfull
    },
    setSize(size: boolean) {
      this.size = size
    },
    setLocale(locale: boolean) {
      this.locale = locale
    },
    setTagsView(tagsView: boolean) {
      this.tagsView = tagsView
    },
    setTagsViewIcon(tagsViewIcon: boolean) {
      this.tagsViewIcon = tagsViewIcon
    },
    setLogo(logo: boolean) {
      this.logo = logo
    },
    setFixedHeader(fixedHeader: boolean) {
      this.fixedHeader = fixedHeader
    },
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode
    },
    setDynamicRouter(dynamicRouter: boolean) {
      wsCache.set('dynamicRouter', dynamicRouter)
      this.dynamicRouter = dynamicRouter
    },
    setFixedMenu(fixedMenu: boolean) {
      wsCache.set('fixedMenu', fixedMenu)
      this.fixedMenu = fixedMenu
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
    setLayout(layout: LayoutType) {
      if (this.mobile && layout !== 'classic') {
        ElMessage.warning('移动端模式下不支持切换其他布局')
        return
      }
      this.layout = layout
      wsCache.set('layout', this.layout)
    },
    setTitle(title: string) {
      this.title = title
    },
    setToken(token: string) {
      this.token = token
    },
    setIsDark(isDark: boolean) {
      this.isDark = isDark

      // backgroundColor="var(--left-menu-bg-color)"
      // textColor="var(--left-menu-text-color)"
      // activeTextColor="var(--left-menu-text-active-color)"
      let theme = basicTheme
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
        theme = Object.assign(theme, {
          // 左侧菜单边框颜色
          leftMenuBorderColor: 'inherit',
          // 左侧菜单背景颜色
          leftMenuBgColor: '#191b24',
          // 左侧菜单浅色背景颜色
          leftMenuBgLightColor: '#282a33',
          // 左侧菜单选中背景颜色
          leftMenuBgActiveColor: 'var(--el-color-primary)',
          // 左侧菜单收起选中背景颜色
          leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
          // 左侧菜单字体颜色
          leftMenuTextColor: '#bfcbd9',
          // 左侧菜单选中字体颜色
          leftMenuTextActiveColor: '#fff'
        })
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
        theme = Object.assign(theme, {
          // 左侧菜单边框颜色
          leftMenuBorderColor: '#eee',
          // 左侧菜单背景颜色
          leftMenuBgColor: '#fff',
          // 左侧菜单浅色背景颜色
          leftMenuBgLightColor: '#fff',
          // 左侧菜单选中背景颜色
          leftMenuBgActiveColor: 'RGBA(18,99,238,0.1)',
          // 左侧菜单收起选中背景颜色
          leftMenuCollapseBgActiveColor: 'RGBA(18,99,238,0.1)',
          // 左侧菜单字体颜色
          leftMenuTextColor: '#333',
          // 左侧菜单选中字体颜色
          leftMenuTextActiveColor: 'var(--el-color-primary)'
        })
      }
      wsCache.set('isDark', this.isDark)
      this.setTheme(theme)
      this.setCssVarTheme()
    },
    setCurrentSize(currentSize: ElementPlusSize) {
      this.currentSize = currentSize
      wsCache.set('currentSize', this.currentSize)
    },
    setMobile(mobile: boolean) {
      this.mobile = mobile
    },
    setTheme(theme: ThemeTypes) {
      this.theme = Object.assign(this.theme, theme)
      wsCache.set('theme', this.theme)
    },
    setCssVarTheme() {
      for (const key in this.theme) {
        setCssVar(`--${humpToUnderline(key)}`, this.theme[key])
      }
      // setCssVar('--el-button-hover-border-color', 'var(--el-color-primary)')
      // setCssVar('--el-button-hover-bg-color', 'var(--el-color-primary)')
    },
    setFooter(footer: boolean) {
      this.footer = footer
    },
    setDisableAutoUnread(disableAutoUnread: boolean) {
      this.disableAutoUnread = disableAutoUnread
      wsCache.set('disableAutoUnread', this.disableAutoUnread)
    },
    setSysNotice(message: string) {
      this.sysNotice = message
    }
  }
})

export const useAppStoreOutside = () => {
  return useAppStore(store)
}
