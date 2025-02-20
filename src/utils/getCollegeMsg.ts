import http from '@/config/axios'
const { request } = http

let college = ''
/** 根据ID获取学院名称 */
export function getCollege(collegeId) {
  if (collegeId) {
    request({
      url: `/api/pc/college/get/${collegeId}`,
      method: 'get'
    }).then((res) => {
      college = res.data
    })
    return college
  }
}
/** 获取全部学院
 * @exports {name,id}
 */
export async function getAllCollege() {
  const res = await request({
    url: '/api/pc/college/get/list',
    method: 'get'
  })
  return res.data
}
