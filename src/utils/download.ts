import { ElNotification } from 'element-plus'
import JSZip from 'jszip'

/**
 * 以文件形式下载一个链接
 * 浏览器下载图片/PDF/文稿时，会直接打开而不是触发下载
 * 使用本方法确保打开下载弹窗，而不是直接打开
 */
export async function downloadAsFile(fileUrl?: string, downloadName?: string) {
  if (!fileUrl) return
  // 移除参数
  fileUrl = fileUrl.split('?')[0]
  const fileName = fileUrl.split('/').reverse()[0]
  let words = fileName.split('.').reverse()
  if (words.length == 1) words = []
  const fileExtName = words[0]
  let download = downloadName || '下载'
  async function toDataURL(url: string) {
    return fetch(url)
      .then((response) => {
        return response.blob()
      })
      .then((blob) => {
        return URL.createObjectURL(blob)
      })
  }
  const a = document.createElement('a')
  fileUrl = fileUrl + '?' + Math.random()
  a.href = await toDataURL(fileUrl)
  if (!download.endsWith(`.${fileExtName}`) && fileExtName) download = `${download}.${fileExtName}`
  a.setAttribute('download', download)
  a.click()
  ElNotification({
    title: '下载成功',
    message: `已下载: ${downloadName}`,
    type: 'success'
  })
}

export async function downloadArrayBufferasFile(buff: ArrayBuffer, downloadName?: string) {
  if (!buff.byteLength) return
  const url = window.URL.createObjectURL(new Blob([buff], { type: 'arraybuffer' }))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  const name = downloadName || '下载.txt'
  link.setAttribute('download', name)
  document.body.appendChild(link)
  await link.click()
  document.body.removeChild(link)
  ElNotification({
    title: '下载成功',
    message: `已下载: ${name}`,
    type: 'success'
  })
}

export async function downloadFilesAsZip(files: [string, string][], zipName?: string) {
  console.log(files, zipName)
  const zip = new JSZip()
  async function toDataURL(url: string) {
    return fetch(url).then((response) => {
      return response.blob()
    })
  }

  await Promise.all(
    files.map(async (item) => {
      let [url, name] = item
      let words = url.split('.').reverse()
      if (words.length == 1) words = []
      const fileExtName = words[0]
      if (!name.endsWith(`.${fileExtName}`)) name = `${name}.${fileExtName}`
      zip.file(name, await toDataURL(url), { binary: true })
    })
  )
  const zipFileBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE', // STORE: 默认不压缩， DEFLATE：需要压缩
    compressionOptions: {
      level: 9 // 压缩等级 1~9   1 压缩速度最快， 9 最优压缩方式
    }
  })
  // return;
  const a = document.createElement('a')
  a.href = URL.createObjectURL(zipFileBlob)

  a.setAttribute('download', `${zipName ?? 'zip'}.zip`)
  a.click()
  ElNotification({
    title: '下载成功(ZIP)',
    message: `已下载ZIP: ${zipName}`,
    type: 'success'
  })
}

function downloadObj(obj) {
  const fileName = 'export.txt'
  const str = JSON.stringify(obj)
  const content = str
  const blob = new Blob([content], {
    type: 'application/text'
  })
  const link = document.createElement('a') // 创建a标签
  link.download = fileName // a标签添加属性
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)
  document.body.appendChild(link)
  link.click() // 执行下载
  URL.revokeObjectURL(link.href) // 释放url
  document.body.removeChild(link) // 释放标签
}

function downloadArray(list) {
  const first = list[0]
  if (!first) throw '需要是数组并至少要有一个元素'
  const keys = Object.keys(first)
  const table = [keys.join(',')]
  for (const item of list) {
    const line = keys
      .map((key) => {
        const cell = item[key] ?? ''
        if (~`${cell}`.indexOf(',') || ~`${cell}`.indexOf('"')) return `"${cell}"`
        return cell
      })
      .join(',')
    table.push(line)
  }
  const content = table.join('\n')
  const fileName = 'export.csv'
  const blob = new Blob([content], {
    type: 'application/text'
  })
  const link = document.createElement('a') // 创建a标签
  link.download = fileName // a标签添加属性
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)
  document.body.appendChild(link)
  link.click() // 执行下载
  URL.revokeObjectURL(link.href) // 释放url
  document.body.removeChild(link) // 释放标签
}
