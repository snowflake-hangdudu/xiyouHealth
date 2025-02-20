import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http

/** 模型 */
export interface AccountModel {
  /** 账户 */
  account?: string
  /** 审核状态 (0:审核未通过, 1:审核通过, 2:审核中) */
  checked?: number
  /** 所属学院id */
  collegeId?: number
  /** 邮箱 */
  email?: string
  /** id */
  id?: number
  /** 是否封禁 (true:封禁, false:未封禁) */
  isBan?: boolean
  /** 姓名 */
  name?: string
  /** 密码 */
  password?: string
  /** 账号类型 (college_reporter:学院记者 ,college_leader:学院领导 ,college_teacher:学院老师
   * ,school_reporter:学校记者 ,school_leader:学校领导 ,school_teacher:学校老师, admin:管理员) */
  role?: string
  /** 电话 */
  tel?: string
  /** 类型(college:学院，school:学校) */
  type?: string
}

/** 搜索条件 */
export interface AccountQueryParmas extends BasicQueryParams {
  /** 账号	*/
  account?: string
  /** 姓名	*/
  name?: string
  /** 手机号	 */
  tel?: string
  /** 审核状态 */
  checked?: number
  /** 是否封禁 */
  isBan?: boolean
}

/** 数据源，增删查改等请求 */
export default class AccountQuery extends Queryable<AccountModel, AccountQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '账号管理'
  }

  // 默认的内容
  get defaultObject(): AccountModel {
    return {}
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<AccountModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<AccountModel> {
    return this._valueGetter()
  }

  // 表单规则
  get rules() {
    return {}
  }

  // 查询全部
  async all(params: AccountQueryParmas) {
    const res = await request({
      url: `/pc/user/manager/get/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        isBan: params.isBan || undefined,
        account: params.account || undefined,
        checked: params.checked === 0 || params.checked === 1 || params.checked === 2 ? params.checked : undefined,
        name: params.name || undefined,
        tel: params.tel || undefined
      }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  // // 上传修改（添加快递信息）
  // async edit(obj: AccountModel) {
  //   console.log('修改', obj)
  //   obj = Object.assign({}, obj)
  //   const id = obj.id
  //   delete obj.id
  //   return request({
  //     url: `/api/pc/user/manager/update/${id}`,
  //     method: 'put',
  //     data: obj
  //   })
  // }

  // // 添加
  // async add(obj: AccountModel) {
  //   delete obj.id;
  //   return request({
  //     url: "/api/hospital/order",
  //     method: "post",
  //     data: obj,
  //   });
  // }

  // // 通过id删除
  // async deleteObj(obj: AccountModel) {
  //   return request({
  //     url: `/api/hospital/order/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
