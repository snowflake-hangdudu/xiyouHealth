import { Buffer } from 'buffer'
import CryptoJS from 'crypto-js'
import { LocationQuery, LocationQueryValue } from 'vue-router'

export interface EnterpriseShareInfo {
  userId?: number
  enterpriseId?: number
  enterpriseName?: string
  /** 是否是邀请客户 */
  isInviteCustomer?: boolean
}

/** 分享企业邀请链接加密（base64） */
export function shareKeyForInviteCompany(info: EnterpriseShareInfo): string {
  const shareKey = encodeURIComponent(`${info.userId}.${info.enterpriseId}.${info.enterpriseName}.${info.isInviteCustomer}`)
  const sign = CryptoJS.MD5(shareKey + 'nb').toString()
  return `share=${shareKey}&sign=${sign}`
}

/**
 * 分享企业邀请链接解密
 * @param params vue-router的query对象 （route.query）
 * @returns
 */
export function loadInviteShareKey(params: Record<string, string>): EnterpriseShareInfo {
  let shareKey = params.share as string
  const sign = params.sign as string
  if (!~shareKey.indexOf('%')) shareKey = encodeURIComponent(shareKey)
  const checksign = CryptoJS.MD5(shareKey + 'nb').toString()
  if (checksign != sign) {
    console.warn('签名验证不通过', params, checksign)
    return {}
  }

  const infos = decodeURIComponent(shareKey).split('.')
  return {
    userId: Number(infos[0]),
    enterpriseId: Number(infos[1]),
    enterpriseName: infos[2],
    isInviteCustomer: infos[3] === 'true' ? true : false
  }
}

// 生成一个随机的EnterpriseShareInfo对象
function randomEnterpriseShareInfo(): EnterpriseShareInfo {
  return {
    userId: Math.floor(Math.random() * 10000),
    enterpriseId: Math.floor(Math.random() * 10000),
    enterpriseName: Math.random().toString(36).slice(2)
  }
}

// 测试校验效果
function testShareKey(): void {
  // 生成一个随机的EnterpriseShareInfo对象
  const info = randomEnterpriseShareInfo()
  // 调用shareKeyForInviteCompany函数，得到加密后的字符串
  const shareKey = shareKeyForInviteCompany(info)
  // 模拟vue-router的query对象，将shareKey分割成share和sign两个参数
  const params = Object.fromEntries(shareKey.split('&').map((s) => s.split('=')))
  // 调用loadInviteShareKey函数，得到解密后的EnterpriseShareInfo对象
  const decoded = loadInviteShareKey(params)
  // 比较输入和输出是否一致
  console.log('Input:', info)
  console.log('Output:', decoded)
  console.log('Match:', JSON.stringify(info) === JSON.stringify(decoded))
}

// 调用测试函数
// testShareKey();
