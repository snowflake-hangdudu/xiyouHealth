/** 获取筛选时间范围为时间戳
 * endTimeToDayLastSecond  Boolean 是否需要+1天 */
export function filterRangeOf(range?: [any, any], endTimeToDayLastSecond = true) {
  let end = range?.[1] ? new Date(range[1])?.getTime() : undefined
  if (end && endTimeToDayLastSecond) {
    const _endTime = new Date(end)
    if (_endTime.getHours() === 0 && _endTime.getMinutes() === 0) {
      /** 为了方便后端的整日查询场景，+1天时，将时间往回拨1ms */
      end += 1000 * 60 * 60 * 24 - 1
    }
  }
  const result = {
    startTime: range?.[0] ? new Date(range[0])?.getTime() : undefined,
    endTime: end
  }
  console.log('原时间范围：', range, endTimeToDayLastSecond, '新时间范围：', result, {
    startTime: new Date(result.startTime!).toLocaleString(),
    endTime: new Date(result.endTime!).toLocaleString()
  })
  return result
}

/** 获取年月筛选时间范围为时间戳 */
export function filterMonthRangeOf(range?: [Date | number | string, Date | number | string]) {
  let end = range?.[1] ? new Date(range[1])?.getTime() : undefined
  if (end) {
    const _endTime = new Date(end)
    if (_endTime.getDate() === 1 && _endTime.getHours() === 0 && _endTime.getMinutes() === 0) {
      /** 为了方便后端的整日查询场景，+1个月，将时间往回拨1ms */
      _endTime.setMonth(_endTime.getMonth() + 1)
      end = _endTime.getTime() - 1
    }
  }
  const result = {
    startTime: range?.[0] ? new Date(range[0])?.getTime() : undefined,
    endTime: end
  }
  console.log('原时间范围：', range, '新时间范围：', result, {
    startTime: new Date(result.startTime!).toLocaleString(),
    endTime: new Date(result.endTime!).toLocaleString()
  })
  return result
}
