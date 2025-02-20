import router from '@/router'
import { reactive, ref, unref, watch } from 'vue'

/**
 * 使用一个params中的值
 * 修改会反应到url上，且不会触发整页reload
 * 例如在页面内存在tab时，可以在url上保存tab状态，刷新就不会回到tab第一栏
 * @param key params上的key
 * @param defaultValue 如果params上没有这个值，会取默认值
 * @returns
 */
export function useParams(key: string, defaultValue?: string) {
  const params = readParams()
  // console.log('read params', params, window.location.href);
  const _obj = ref<string | undefined>(params.get(key) ?? defaultValue)
  watch(_obj, (value, oldValue) => {
    const params = readParams()
    if (value === undefined) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    const currentUrl = location.href.split('?')[0]
    const newParams = [...params.entries()].map((e) => e.join('=')).join('&')
    let sep = '?'
    if (!newParams) sep = ''
    window.history.pushState(value, '', `${currentUrl}${sep}${newParams}`)
  })
  return _obj
}

/**
 * 使用一个params中的值，但是转换为number使用
 * 修改会反应到url上，且不会触发整页reload
 * 例如在页面内存在tab时，可以在url上保存tab状态，刷新就不会回到tab第一栏
 * @param key params上的key
 * @param defaultValue 如果params上没有这个值，会取默认值
 * @returns
 */
export function useParamsAsNumber(key: string, defaultValue?: number) {
  const params = readParams()
  let v = params.get(key) || defaultValue
  if (isNaN(Number(v))) v = undefined
  else v = Number(v)
  const _obj = ref<number | undefined>(v)
  watch(_obj, (value, _) => {
    const params = readParams()
    if (value === undefined) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    const currentUrl = location.href.split('?')[0]
    const newParams = [...params.entries()].map((e) => e.join('=')).join('&')
    let sep = '?'
    if (!newParams) sep = ''
    window.history.pushState(value, '', `${currentUrl}${sep}${newParams}`)
  })
  return _obj
}

function readParams() {
  let str = window.location.href ?? ''
  const strList = str.split('?')
  if (strList.length === 1) return new Map()
  str = strList.slice(1, strList.length).join('?')
  if (!str) return new Map()
  const list = str.split('&')
  const res = new Map(
    list.map((text) => {
      const list = text.split('=') as [string, string]
      if (list[1] === undefined) return [list[0], undefined]
      return [list[0], decodeURIComponent(list.slice(1).join('='))]
    })
  )
  return res
}

export function readParamsObject() {
  const map = readParams()
  return Array.from(map).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {})
}
