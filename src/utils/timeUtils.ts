/**  计算日期差 返回天数
 * @example 计算 date2 和 date1的差
 */
export const getDaysDifference = (date1: Date, date2: Date) => {
  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime())
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))
  return diffInDays
}
