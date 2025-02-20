/** 创建各种时间段 */
export default abstract class DateRangeBuilder {
  static timeToTodayBegin(offset?: number) {
    const now = new Date()
    const time = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    time.setTime(time.getTime() + (offset ?? 0))
    return time
  }

  // 今天0点 到 +1天
  static today(): [Date, Date] {
    return [this.timeToTodayBegin(), this.timeToTodayBegin()]
  }
  // 昨天0点 到 今早0点
  static yesterday(): [Date, Date] {
    return [this.timeToTodayBegin(-millsecondPerDay), this.timeToTodayBegin(-millsecondPerDay)]
  }
  static last7(): [Date, Date] {
    return [this.timeToTodayBegin(-millsecondPerDay * 7), this.timeToTodayBegin(-millsecondPerDay)]
  }
  static last14(): [Date, Date] {
    return [this.timeToTodayBegin(-millsecondPerDay * 14), this.timeToTodayBegin(-millsecondPerDay)]
  }
  static last30(): [Date, Date] {
    return [this.timeToTodayBegin(-millsecondPerDay * 30), this.timeToTodayBegin(-millsecondPerDay)]
  }
  static last60(): [Date, Date] {
    return [this.timeToTodayBegin(-millsecondPerDay * 60), this.timeToTodayBegin(-millsecondPerDay)]
  }
  static last90(): [Date, Date] {
    return [this.timeToTodayBegin(-millsecondPerDay * 90), this.timeToTodayBegin(-millsecondPerDay)]
  }
}

const millsecondPerDay = 3600 * 1000 * 24
