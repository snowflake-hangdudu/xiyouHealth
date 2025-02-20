import request from '@/config/axios'

export const loginApi = (data: UserLoginType): Promise<IResponse<any>> => {
  return request.post({
    url: 'api/admin/account/login',
    data: {
      account: data.account,
      password: data.password
    }
  })
}

export const getUserInfoApi = (): Promise<IResponse<User>> => {
  return request.get({ url: 'api/admin/account/get' })
}

export type User = {
  id: number
  role: string[]
}

export type UserLoginType = {
  account: string
  password: string
}

// export const loginOutApi = (): Promise<IResponse> => {
//   return request.get({ url: '/user/loginOut' })
// }

// export const getRoleApi = (params: RoleParams): Promise<IResponse<RouteConfig[]>> => {
//   return request.get({ url: '/role/list', params })
// }
