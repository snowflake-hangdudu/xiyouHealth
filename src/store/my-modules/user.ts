import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUser = defineStore(
  'user',
  () => {
    /** 用户信息 */
    const userInfo = ref()
    /** 修改用户信息 */
    const setUserInfo = (val) => {
      userInfo.value = val
    }
    /** 退出登录 */
    const logOUt = () => {
      userInfo.value = undefined
    }
    return { userInfo, setUserInfo, logOUt }
  },
  {
    /** 持久化 */
    persist: {
      paths: ['userInfo']
    }
  }
)
