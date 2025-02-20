import http from '@/config/axios'
const { request } = http

/** 获取全部线索列表
 * @exports {name,id}
 */
export async function getAllClue() {
  const res = await request({
    url: '/api/pc/clue/manager/get/clueName/List',
    method: 'get'
  })
  return res.data
}

/** 获取全部报题列表
 * @exports {name,id}
 */
export async function getAllReport() {
  const res = await request({
    url: '/api/pc/report/manager/get/reportName/List',
    method: 'get'
  })
  return res.data
}
/** 获取全部任务列表
 * @exports {name,id}
 */
export async function getAllTask() {
  const res = await request({
    url: '/api/pc/task/manager/get/taskName/List',
    method: 'get'
  })
  return res.data
}
