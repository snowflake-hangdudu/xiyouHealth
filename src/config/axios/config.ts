type Services = { main: string }

const baseUrl: {
  base: Services
  dev: Services
  pro: Services
  test: Services
} = {
  // 开发环境接口前缀
  base: {
    main: '/'
  },

  // 打包开发环境接口前缀
  dev: {
    main: '/'
  },

  // 打包生产环境接口前缀
  pro: {
    main: '/'
  },

  // 打包测试环境接口前缀
  test: {
    main: '/'
  }
}

const service = baseUrl[import.meta.env.VITE_API_BASEPATH]
console.log('service: ', service)

const config: {
  mainServicePath: string
  default_headers: AxiosHeaders
  request_timeout: number
} = {
  /**
   * 主服务请求基础路径
   */
  mainServicePath: service.main,

  /**
   * 接口请求超时时间
   */
  request_timeout: 240000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  default_headers: 'application/json'
}

export { config }
