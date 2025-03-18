export const uploadUrl = 'https://upload-z2.qiniup.com/'

/// 静态图片地址
export const qiniuImgBasePath = 'https://xiyou-1341378444.cos.ap-guangzhou.myqcloud.com/'

//拿取token地址
export const qiniuTokenUrl = 'api/thirdParty/qiniu/uploadToken'

//上传文件地址
export const qiniuUploadUrl = 'http://124.222.23.240/xi_you/api/thirdParty/cos/upload'

/**
 * 生成qiniu链接
 * qiniuUrl('img-banner1')
 * 可压缩：
 * qiniuUrl('img-banner1',[200,200]) // 限制为200*200(取较长边等比例缩小)
 * @param key
 * @param size
 * @returns
 */
export function qiniuUrl(key: string | undefined | null, size?: [number, number | undefined]) {
  if (!key) return ''
  if (key.startsWith('http')) return key
  const rawUrl = `${qiniuImgBasePath}${key}`
  console.log('rawUrl', rawUrl)
  if (!size) return rawUrl
  return `${rawUrl}`
}
