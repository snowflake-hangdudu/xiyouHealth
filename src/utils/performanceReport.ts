import { getDatabaseInstance } from './dataBase'
import { hashCode } from './hashCode'

export interface PerformanceReport {
  hashKey: string
  /** 企业ID */
  enterpriseId: number
  /** 用户ID */
  userId: number
  /** 请求路径 */
  requestPath: string
  /** 统计日期 */
  date: string
  /** 最长耗时请求的开始时间 */
  maxDurationStartTime: string
  /** 最长耗时请求的耗时 */
  maxDuration: number
  /** 最长耗时请求的参数 */
  maxDurationParams: string
  /** 最长耗时请求返回数据大小 */
  maxDurationDataSize: number
  /** 最短耗时请求的开始时间 */
  minDurationStartTime: string
  /** 最短耗时请求的耗时 */
  minDuration: number
  /** 最短耗时请求的参数 */
  minDurationParams: string
  /** 最短耗时请求返回数据大小 */
  minDurationDataSize: number
}

/** 单次请求获取到的数据 */
export interface SinglePerformance {
  /** 企业ID */
  enterpriseId: number
  /** 用户ID */
  userId: number
  /** 请求路径 */
  requestPath: string
  /** 统计日期 */
  date: string
  /** 开始时间 */
  durationStartTime: string
  /** 耗时 */
  duration: number
  /** 参数 */
  durationParams: string
  /** 返回数据大小 */
  dataSize: number
}
class PerformanceReportHelper {
  dbInstance: IDBDatabase | undefined

  async initDB() {
    this.dbInstance = await getDatabaseInstance()
  }

  dateTag(date?: Date) {
    if (!date) date = new Date()
    return [`${date.getFullYear()}`.padStart(2, '0'), `${date.getMonth() + 1}`.padStart(2, '0'), `${date.getDate()}`.padStart(2, '0')].join('-')
  }

  timeTag(date?: Date) {
    if (!date) date = new Date()
    return (
      [`${date.getFullYear()}`.padStart(2, '0'), `${date.getMonth() + 1}`.padStart(2, '0'), `${date.getDate()}`.padStart(2, '0')].join('-') +
      ' ' +
      [`${date.getHours()}`.padStart(2, '0'), `${date.getMinutes()}`.padStart(2, '0'), `${date.getSeconds()}`.padStart(2, '0')].join(':')
    )
  }

  /** 单次请求获取到的数据，合并之前的数据并存储统计信息 */
  async putPerformance(data: SinglePerformance) {
    if (!this.dbInstance) await this.initDB()
    if (!this.dbInstance) return
    // 写入
    // 打开一个事务
    const tx = this.dbInstance.transaction('RequestPerformance', 'readwrite')
    // 获取对象仓库
    const store = tx.objectStore('RequestPerformance')
    // 构造查询键
    const rawkey = [data.enterpriseId, data.userId, data.requestPath].join(',')
    const hashKey = `${data.date}:${hashCode(rawkey)}`
    // 尝试获取已有的统计数据
    const existing: any = await new Promise((r) => {
      store.get(hashKey).onsuccess = (event: Event) => {
        // console.warn({ hashKey, event });
        r((event.target as IDBRequest).result)
      }
    })
    // console.warn({ rawkey, existing });
    // 如果存在，则更新统计数据
    if (existing) {
      // 更新最长耗时请求
      if (data.duration > existing.maxDuration) {
        existing.maxDuration = data.duration
        existing.maxDurationStartTime = data.durationStartTime
        existing.maxDurationParams = data.durationParams
        existing.maxDurationDataSize = data.dataSize
      }
      // 更新最短耗时请求
      if (data.duration < existing.minDuration) {
        existing.minDuration = data.duration
        existing.minDurationStartTime = data.durationStartTime
        existing.minDurationParams = data.durationParams
        existing.minDurationDataSize = data.dataSize
      }
      // 写回对象仓库
      return new Promise((r) => {
        store.put(existing).onsuccess = () => {
          r(undefined)
        }
      })
    } else {
      // 如果不存在，则创建一个新的统计数据
      const newStats: PerformanceReport = {
        hashKey: hashKey,
        enterpriseId: data.enterpriseId,
        userId: data.userId,
        requestPath: data.requestPath,
        date: data.date,
        maxDuration: data.duration,
        maxDurationStartTime: data.durationStartTime,
        maxDurationParams: data.durationParams,
        maxDurationDataSize: data.dataSize,
        minDuration: data.duration,
        minDurationStartTime: data.durationStartTime,
        minDurationParams: data.durationParams,
        minDurationDataSize: data.dataSize
      }
      // 写入对象仓库
      return new Promise((r) => {
        store.put(newStats).onsuccess = (e) => {
          // console.warn('add', e, newStats, { rawkey, existing });
          r(undefined)
        }
      })
    }
  }

  /** 获取某一天的请求性能报表 */
  async performanceReport(date?: string): Promise<PerformanceReport[]> {
    if (!this.dbInstance) await this.initDB()
    if (!this.dbInstance) return []
    // 查询
    // 打开一个只读事务
    const tx = this.dbInstance.transaction('RequestPerformance', 'readonly')
    // 获取对象仓库
    const store = tx.objectStore('RequestPerformance')
    if (!date)
      return new Promise((r) => {
        store.getAll().onsuccess = (event: any) => {
          r(event.target!.result)
        }
      })
    // 获取所有符合条件的统计数据
    return new Promise((r) => {
      store.index('date').getAll(date).onsuccess = (event: any) => {
        r(event.target!.result)
      }
    })
  }

  async deleteDataForDay(date: string) {
    if (!this.dbInstance) await this.initDB()
    if (!this.dbInstance) return []
    // 查询
    const list = await this.performanceReport(date)
    // 打开一个只读事务
    const tx = this.dbInstance.transaction('RequestPerformance', 'readwrite')
    // 获取对象仓库
    const store = tx.objectStore('RequestPerformance')
    return Promise.all(
      list.map((e) => {
        return new Promise((r) => {
          store.delete(e.hashKey).onsuccess = (event: any) => {
            r(event.target!.result)
          }
        })
      })
    )
  }
}

const performanceReport = new PerformanceReportHelper()

export default performanceReport
