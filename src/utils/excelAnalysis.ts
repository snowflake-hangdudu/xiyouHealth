/**
 * 针对导入的excel，进行解析(只针对于一级表头)
 */

import { WorkSheet } from 'xlsx'
import { alphabet, rangeFromRef } from '@/utils/excel'

/**
 *
 * @param sheet excelSheet对象
 * @param options 可选配置参数
 *  - headerRowIndex 表头对应的行号（从1开始），默认第一行
 *  - contentRowStartIndex 表格内容开始行号（从1开始），默认headerRowIndex+1
 * @returns
 */
export function handleSheet(
  sheet: WorkSheet,
  options?: {
    headerRowIndex?: number
    contentRowStartIndex?: number
  }
) {
  const inactiveAttribute = ['!cols', '!rows', '!merges', '!protect', '!autofilter', '!ref']
  let [minX, minY, maxX, maxY] = rangeFromRef(sheet['!ref'])
  // rangeFromRef return 出来的maxY，是通过!ref得到的，可能不准
  maxY = Math.max(
    ...Object.keys(sheet)
      .filter((key) => !inactiveAttribute.includes(key))
      .map((key) => Number(key.replace(/[A-Z]/g, '')) || 0)
  )
  const minHeaderChar = minX
  const maxHeaderChar = maxX
  const headerRowIndex = options?.headerRowIndex ?? minY
  const contentRowStartIndex = options?.contentRowStartIndex ?? headerRowIndex + 1
  const contentRowEndIndex = maxY
  let minHeaderIndex = alphabet.findIndex((_char) => _char == minHeaderChar)
  if (minHeaderIndex == -1) {
    console.warn('警告：函数handleSheet的参数minHeaderChar输入错误，请检查')
    minHeaderIndex = 0
  }
  let maxHeaderIndex = alphabet.findIndex((_char) => _char == maxHeaderChar)
  if (maxHeaderIndex == -1) {
    console.warn('警告：函数handleSheet的参数maxHeadChat输入错误，请检查')
    maxHeaderIndex = alphabet.length
  }

  const headerCharList = alphabet.slice(minHeaderIndex, maxHeaderIndex + 1)
  const headerList = headerCharList.map((_char) => {
    const key = `${_char}${headerRowIndex}`
    return sheet[key]?.v
  })

  let contentList: any[] = []
  for (let i = contentRowStartIndex; i <= contentRowEndIndex; i++) {
    const row = headerCharList.map((_char) => {
      const key = `${_char}${i}`
      return sheet[key]?.v
    })
    if (row.filter((item) => item !== undefined).length) {
      contentList.push(row)
    }
  }
  return {
    headerList: headerList,
    contentList: contentList
  }
}
