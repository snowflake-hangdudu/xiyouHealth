/** 账号管理审核/编辑数据 */
export type AccountDialogModel = {
  /** 账户 */
  account?: string
  /** 所属学院id */
  collegeId?: number
  /** 邮箱 */
  email?: string
  /** true:封禁 ,false:未封禁 */
  isBan?: boolean
  /** 姓名 */
  name?: string
  /** 密码	 */
  password?: string
  /** 账号类型 (college_reporter:学院记者 ,college_leader:学院领导 ,college_teacher:学院老师 ,
   * school_reporter:学校记者 ,school_leader:学校领导 ,school_teacher:学校老师) */
  role?: string[]
  /** 电话 */
  tel?: string
  /** 类型(college:学院，school:学校) */
  type?: string
  /** 审核状态( 0:审核未通过, 1:审核通过, 2:审核中) */
  checked?: number
  /** id */
  id?: number
}
