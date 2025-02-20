/**
 * 延迟一个时间段，单位为ms
 * 不叫delay是因为lodash有个函数叫delay
 */
export function delayDuration(duration: number) {
  return new Promise((r) => {
    setTimeout(() => {
      r(void 0)
    }, duration)
  })
}

/**
 * 创建一个完成器
 * 返回的done: 触发promise
 * 返回的promise: 等待此promise即等待其完成
 * 例如：
 * const [uploadPromise, uploadDone] = useCompleter<string>()
 * upload(()=>{
 *     uploadPromise.done();
 * })
 * await uploadPromise;
 * @returns {promise,done}
 */
export function useCompleter<T>(): Completer<T> {
  let done!: (value: T | PromiseLike<T>) => void
  const promise = new Promise<T>((r) => {
    done = r
  })
  return [promise, done]
}

export type Completer<T> = [Promise<T>, (value: T | PromiseLike<T>) => void]

/**
 * 封装并发限制函数
 *
 * 使用：
 * await Promise.all([
 *   batchLimit(4, () => myCustomMission()),
 *   batchLimit(4, () => myCustomMission()),
 *   batchLimit(4, () => myCustomMission()),
 * ]);
 * 则最多并发存在4个任务
 * 例如上传100张图片，则先4张图并发上传
 * 每当一张图上传完成，就上传下一张图，保证最多同时4个任务同时进行
 *
 * 请注意本函数并发限制后的任务均为先进后出。
 **/
export async function batchLimit<T>(limit: number, asyncCallback: () => Promise<T>): Promise<T> {
  let _resolve!: () => void
  const promise = new Promise((resolve) => {
    _resolve = () => resolve(undefined)
    __resolveHoldList.push(_resolve)
  })
  if (__resolveHoldList.length > limit) await promise
  const result = await asyncCallback()
  __resolveHoldList[__resolveHoldList.length - 1]()
  __resolveHoldList.splice(__resolveHoldList.length - 1, 1)
  return result
}
const __resolveHoldList: (() => void)[] = []
