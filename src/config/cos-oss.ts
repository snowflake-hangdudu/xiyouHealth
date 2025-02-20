import COS, { UploadBody } from 'cos-js-sdk-v5'
// import request from '@/config/axios'
import axios from 'axios'
import { number } from 'vue-types'

/**
 * 生成随机key值
 * @param keyPre key值前缀
 * @returns 随机的key值
 */
function createUniqueString(keyPre = '') {
  const timestamp = +new Date() + ''
  const r = String((1 + Math.random()) * 65536)
  const randomNum = parseInt(r) + ''
  return keyPre + (+(randomNum + timestamp)).toString(32)
}

const _cosUrl = import.meta.env.VITE_USER_NODE_ENV == 'production' ? 'http://1.12.67.240:9000/' : 'http://1.12.67.240:9000/'

const _cosBucket = import.meta.env.VITE_USER_NODE_ENV == 'production' ? 'test' : 'test-1250000000'

console.log('上传配置:', _cosUrl, _cosBucket)

/** 腾讯云对象存储 配置 */
const cosConfig = {
  /** 域名头 */
  urlHead: _cosUrl,
  /** 空间Id */
  bucket: _cosBucket,
  /** 上传 地区 */
  region: 'ap-guangzhou'
}

/** 腾讯云文件对象存储管理 */
export class CosOss {
  private instance: COS = new COS({
    getAuthorization: async function (options, callback) {
      // 指定端口号
      const port = 8080
      const requestConfig = {
        baseURL: `http://192.168.0.102:8080/api/`, // 设置基础URL，将端口号替换为你要使用的端口号
        timeout: 5000 // 请求超时时间
        // 其他配置项...
      }
      const request = axios.create(requestConfig)

      try {
        const res = await request.get('/minio/get/token')
        const auth = res.data.data
        console.warn('auth res', auth)
        callback({
          TmpSecretId: auth.accessKeyId,
          TmpSecretKey: auth.secretAccessKey,
          SecurityToken: auth.sessionToken,
          StartTime: Math.floor(auth.startTime / 1000), // 时间戳，单位秒，如：1580000000
          ExpiredTime: Math.floor(auth.expiredTime / 1000) // 时间戳，单位秒，如：1580000000
        })
        // 处理响应数据
      } catch (error) {
        // 处理错误
      }
    }
  })

  private bucket = cosConfig.bucket
  private region = cosConfig.region

  static getUrl(key?: string) {
    if (!key) return ''
    return cosConfig.urlHead + key
  }

  /** 腾讯云链接截取key */
  static splitKey(path: string) {
    return path.split(cosConfig.urlHead)?.[1] ?? ''
  }

  upload(
    file: File,
    options?: CosUploadFileParams,
    onProgressChange?: (detail: { loaded: number; total: number; speed: number; percent: number }) => void
  ): Promise<{ key: string; filePath: string }> {
    let type = file.name.split('.').reverse()[0]
    if (~['png', 'jpg', 'jpeg'].indexOf(type.toLocaleLowerCase())) type = 'img'
    const suffix = file.name.split('.').reverse()[0]
    const key = options?.key ?? createUniqueString(`t-${type}-`) + `.${suffix}`
    console.log('Upload Details', file, options, key)
    return new Promise(async (resolve, reject) => {
      const fileObj = await file.arrayBuffer()
      this.instance.uploadFile(
        {
          Bucket: cosFileObject.bucket,
          Region: cosFileObject.region,
          Key: key,
          Body: fileObj, // Body里传入的是文件内容
          onProgress(info) {
            onProgressChange?.(info)
          }
        },
        function (err, data) {
          if (err) reject(err)
          console.log('Upload Response', err, data)
          resolve({ key: key, filePath: `https://${data.Location}` })
        }
      )
    })
  }
}

const cosFileObject = new CosOss()

export function useCosOss(): CosOss {
  return cosFileObject
}

export function cosOssUrl(key?: string, size?: [number, number | undefined]) {
  throw '在本项目只能使用七牛云'
  // if (!key) return key;
  // if (key?.startsWith('http')) return key;
  // if (~key.indexOf(',')) key = key.split(',')[0]
  // if (~key.indexOf('?')) key = key.split('?')[0]
  const path = `${_cosUrl}${key}`
  if (!size) return path
  const width = size?.[0]
  const height = size?.[1] ?? size?.[0]
  return `${path}?imageMogr2/thumbnail/!${width}x${height}r`
}

export function cosOssFileName(key?: string) {
  try {
    let str = key ?? ''
    if (~str.indexOf(',')) str = str.split(',')[0]
    str = str.split('?')[1] ?? ''
    if (!str) return undefined
    const list = str.split('&')
    const name = new Map(list.map((text) => text.split('=') as [string, string])).get('_name')
    if (name) return decodeURIComponent(name)
    return undefined
  } catch (error) {
    return undefined
  }
}

interface CosUploadFileParams {
  /** 上传文件的key值，不传为随机key */
  key?: string
}

interface CosAuthParams {
  expiredTime: number
  sessionToken: string
  startTime: number
  tmpSecretId: string
  tmpSecretKey: string
}
