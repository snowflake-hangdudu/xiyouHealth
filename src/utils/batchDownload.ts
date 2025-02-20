import { minioUrl } from '@/config/minio'
import JSZip from 'jszip'
interface FileNode {
  /** 文件或者文件夹名称 */
  fileName: string
  /** 是否为文件夹*/
  isFolder: boolean
  /** 文件的key */
  fileKey: null | string
  /** 子文件/子文件夹集合 */
  children?: FileNode[]
}

/** 下载文件, 返回 blob 对象 */
const download = (url) => {
  return fetch(url).then((res) => res.blob())
}
/** 批量文件打包成压缩包 */
export default async function (fileTree: FileNode[] = []) {
  const zip = new JSZip()
  const stack = fileTree.map((fileNode) => {
    return {
      fileNode,
      parentFolder: zip
    }
  })
  let top: { fileNode: FileNode; parentFolder: JSZip } | undefined = undefined
  while ((top = stack.pop())) {
    const { fileNode, parentFolder } = top
    if (!fileNode.isFolder) {
      /** 处理文件 */
      const blob = await download(minioUrl(fileNode.fileKey))
      parentFolder.file(fileNode.fileName, blob)
    } else {
      /** 处理文件夹 */
      const folder = parentFolder.folder(fileNode.fileName)
      if (folder) {
        fileNode.children?.forEach((fileNode) => {
          stack.push({
            fileNode,
            parentFolder: folder
          })
        })
      }
    }
  }
  // 生成 zip 文件
  const zipContent = await zip.generateAsync({ type: 'blob' })
  return zipContent
}
