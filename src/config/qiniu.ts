export const uploadUrl = 'https://upload-z2.qiniup.com/'

/// 静态图片地址
export const qiniuImgBasePath = 'https://bnypublic.deepmedical.net.cn/'

//拿取token地址
export const qiniuTokenUrl = 'api/thirdParty/qiniu/uploadToken'

//上传文件地址
export const qiniuUploadUrl = 'https://upload-z2.qiniup.com/'

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
  if (!size) return rawUrl
  const width = size[0]
  const height = size[1] ?? size[0]
  return `${rawUrl}?imageMogr2/thumbnail/${width}x${height}/interlace/1`
}
