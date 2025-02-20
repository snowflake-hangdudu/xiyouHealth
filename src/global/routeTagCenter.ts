import { reactive } from 'vue'
import { RouteName } from './noticeCenter'

export interface TagDetail {
  color: string
  tag: string
}

const waitForDevelop: [string, string] = ['', '#9b9b9b']
const waitForDoc: [string, string] = ['等', 'purple']
const inPorcess: [string, string] = ['写', '#FF1426']
const avaliableForTest: [string, string] = ['测', '#54CA14']

/**
 * 全局的路由标签
 * 当key与路由的name相同时，会在左侧路由栏目中显示标签
 * 当前用于标记开发进度。
 */
const routerTag = reactive<Partial<Record<RouteName, [string, string]>>>({
  /** Dashboard */
  // Dashboard: waitForDevelop,
})

export default routerTag
