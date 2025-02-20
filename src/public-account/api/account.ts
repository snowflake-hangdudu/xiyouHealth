import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http

/** 模型 */
export interface AccountModel {
  account?: string; // 账号
  createdAt?: string; // 创建时间
  deleted?: boolean; // 是否删除 true 删除 false 不删除
  expireDate?: string; // 到期时间
  id?: number; // id
  isBan?: boolean; // 是否停用 true 停用 false 使用
  level?: 'super' | 'common'; // super 维护管理员 common 普通管理员
  name?: string; // 名字
  password?: string; // 密码
  phone?: string; // 电话
  updatedAt?: string; // 更新时间
}

/** 搜索条件 */
export interface AccountQueryParmas extends BasicQueryParams {
  phone?: string; // 电话
  account?: string; // 账号
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
    return '账号'
  }

  // 默认的内容
  get defaultObject():  Partial<AccountModel> {
    return {
      level:'common',
      name:''
   

   
      
    }
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<AccountModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<AccountModel> {
    return this._valueGetter()
  }

// 表单规则
get rules() {
  return {
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入电话', trigger: 'blur' }
    ],
    level: [
      { required: true, message: '请选择等级', trigger: 'change' }
    ],
    expireDate: [
      { required: true, message: '请选择有效日期', trigger: 'change' }
    ]
  }
}
  // 查询全部
  async all(params: AccountQueryParmas) {
    console.log("查询全部", params);
    let res = await request({
      url: `api/admin/account/get/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        phone: params.phone || null,
        account: params.account || null
      }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  // 上传修改
  async edit(obj: AccountModel) {

    obj = Object.assign({}, obj);
    let id = obj.id;
    delete obj.id;
    return request({
      url: `api/admin/account/update/${id}`,
      method: "put",
      data: obj,
    });
  }

  // 添加
  async add(obj: AccountModel) {
    delete obj.id;
    return request({
      url: "api/admin/account/register",
      method: "post",
      data: obj,
    });
  }

  // // 通过id删除
  // async deleteObj(obj: AccountModel) {
  //   return request({
  //     url: `/api/hospital/Account/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
