import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, AxiosError } from 'axios'

import qs from 'qs'

import { config } from './config'

import { useRouter } from 'vue-router'

import { ElMessage, resultProps } from 'element-plus'

import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
// import performanceReport from '@/utils/performanceReport'

const appStore = useAppStore()

const { wsCache } = useCache()
const PATH_URL = config.mainServicePath
console.log('PATH_URL', PATH_URL)

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: PATH_URL, // api 的 base_url
  timeout: config.request_timeout // 请求超时时间
})

const requestMap: Map<any, number> = new Map()

// request拦截器
service.interceptors.request.use(
  (config: any) => {
    // 是否禁用
    // if (appStore.userInfo?.user?.isForbid) {
    //   appStore.logout()
    //   wsCache.clear()
    //   location.reload()
    //   return
    // }
    if (config.method === 'post' && (config.headers as AxiosRequestHeaders)['Content-Type'] === 'application/x-www-form-urlencoded') {
      config.data = qs.stringify(config.data)
    }

    // const cosplayMode = useCosplayMode();
    // if (cosplayMode.getIsCosplayMode) {
    //   if (!config.params) config.params = {}
    //   if (config.params['adminId'] !== undefined) {
    //     throw { message: '在cosplay模式下不能使用params传递key为adminId的数据, 请注意接口规范' }
    //   }
    //   config.params['adminId'] = cosplayMode.getCosplayId;
    // }

    // get参数编码
    if (config.method === 'get' && config.params) {
      let url = config.url as string
      url += '?'
      const keys = Object.keys(config.params)
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
      config.url = url
    }

    if (config.url?.startsWith('/api/')) {
      config.url = config.url?.replace('/api/', '/')
    }

    const token = appStore.getToken || wsCache.get('admin-token')
    console.log('login load token', token)
    if (token) {
      if (!config.headers) config.headers = {}
      config.headers['Authorization'] = 'Bearer ' + token
    }

    console.log(`[${config.method.toLocaleUpperCase()}]请求-${config.url}`, config)
    requestMap.set(config, new Date().getTime())
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response.config.method !== 'get') {
      try {
        if (window['updateNotice']) window['updateNotice']()
      } catch (error) {
        console.error('updateNotice未注册')
      }
    }
    const res = requestMap.get(response.config) ?? 0
    const delta = new Date().getTime() - res
    if (res) {
      console.log(`[${response.config.method?.toLocaleUpperCase()}]返回(${delta}ms)-${response.config.url}`, response)
    } else {
      console.log(`[${response.config.method?.toLocaleUpperCase()}]返回-${response.config.url}`, response)
    }

    if (response.config.responseType === 'blob') {
      // 如果是文件流，直接过
      return response
    } else if (response.data.code === 200) {
      // if (!response.data.data && response.config.method == 'get') {
      //   ElMessage.warning(`GET请求${response.config.url}返回了null`)
      // }
      return response.data
    } else if (response.data.code === 401) {
      appStore.logout()
      wsCache.clear()
      location.reload()
      return response.data
    } else {
      const defaultErrText = `${response.config.method?.toLocaleUpperCase()}请求${response.config.url}发生了未知错误:${JSON.stringify(response.data)}`
      let msg = response.data.msg || defaultErrText
      try {
        const msgEntity = JSON.parse(msg)
        if (msgEntity instanceof Array) {
          msg = msgEntity.join(',')
        }
      } catch (error) {
        console.error('msg ', error)
      }
      if (response.data === '') {
        msg = '服务重启中,请稍后刷新...'
      }
      ElMessage.error(msg)
      throw response.data
    }
  },
  (error: AxiosError) => {
    console.error('err', error)
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export { service }
