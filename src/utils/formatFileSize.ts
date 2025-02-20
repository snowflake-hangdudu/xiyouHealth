export function formatFileSize(bytes: number) {
  if (!bytes) bytes = 0
  // 定义一个数组，存储不同的单位
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  // 定义一个变量，表示单位的索引
  let index = 0
  // 循环除以1024，直到结果小于1024或者达到最大的单位
  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024
    index++
  }
  // 返回保留一位小数的结果和对应的单位
  return bytes.toFixed(1) + units[index]
}
