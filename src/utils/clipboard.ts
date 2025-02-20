import { useClipboard } from '@vueuse/core'
import { ElNotification } from 'element-plus'

const clipboardVue = useClipboard({
  legacy: true
})
/**
 * 获取剪切版内容（必须要鼠标先在网页中点击之后，才能生效）
 */
export async function getClipboardContents() {
  await askReadPermission()
  const clipboardItems = await navigator.clipboard.read()
  let targetImgBlob: Blob | undefined
  for (const clipboardItem of clipboardItems) {
    for (const type of clipboardItem.types) {
      if (type.startsWith('image/')) {
        targetImgBlob = await clipboardItem.getType(type)
      }
    }
  }
  return targetImgBlob
}

/** 检查读取剪切板权限 */
export async function askReadPermission() {
  checkClipboardMethod()
  try {
    const { state } = await navigator.permissions.query({
      name: 'clipboard-read' as PermissionName
    })
    console.log('state: ', state)
    if (state == 'denied' || state == 'prompt') {
      ElNotification({
        title: '提示',
        message: '请先打开浏览器中剪切板权限',
        type: 'warning',
        duration: 2000
      })
      throw '请先打开浏览器中剪切板权限'
    }
    return state === 'granted'
  } catch (error) {
    throw error
  }
}

export function checkClipboardMethod() {
  const clipboard = navigator.clipboard
  if (clipboardVue.isSupported.value) return true
  if (!clipboard) {
    ElNotification({
      title: '提示',
      message: '该浏览器网站暂不支持此功能',
      type: 'warning',
      duration: 2000
    })
    throw '暂不支持此API navigator.clipboard'
  }
  return true
}

/** 写入剪切板 */
export async function writeClipboard(text: string) {
  checkClipboardMethod()
  clipboardVue.copy(text)
}

/** 复制雪花ID */
export async function copyId(text?: string) {
  const copyText = text ?? ''
  clipboardVue.copy(copyText)
  ElNotification({
    title: '成功',
    message: '复制成功',
    type: 'success',
    duration: 2000
  })
}
