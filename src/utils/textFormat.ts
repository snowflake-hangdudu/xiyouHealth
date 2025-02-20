/**
 * 价格格式处理，取整、取有限小数，最多两位小数
 * @param val
 * @param needTwo 是否必须要小数点后两位 1 => 1.00
 * @returns
 */
export const priceFormat = (val: number | string, needTwo = false) => {
  let num = Number(val)
  if (isNaN(num)) {
    throw new Error(`请传入有效数字或纯数字字符串（in utils-textFormat) val:${val}`)
  }
  if (needTwo) return num.toFixed(2)
  return (Math.round(num * 100) / 100).toString()
}
