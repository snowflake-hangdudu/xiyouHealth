import http from '@/config/axios'
const { request } = http
type Screening = {
  /** 所属学院id */
  collegeId?: number
  /** 名字 */
  name?: string
  /** 账号类型 (college_reporter:学院记者 ,college_leader:学院领导 ,college_teacher:学院老师
   * ,school_reporter:学校记者 ,school_leader:学校领导 ,school_teacher:学校老师, admin:管理员) */
  role?: string
  /** true 有临时用户 false 没有临时用户 */
  isTemp?: boolean
}
/** 获取全部用户
 * isTemp true 临时用户 false 非临时用户
 * @exports {name,id,isTemp}
 */
export async function getAllUser(screening?: Screening) {
  const res = await request({
    url: '/api/pc/user/manager/get/list',
    method: 'get',
    params: screening
  })
  return res.data
}
