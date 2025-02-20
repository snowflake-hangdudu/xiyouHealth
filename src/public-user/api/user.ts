import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
import { id } from 'element-plus/es/locale';
const { request } = http

/** 模型 */
export interface UserModel {
  collegeId?: number; // 学院id
  createdAt?: string; // 创建时间
  deleted?: boolean; // 是否删除 true 删除 false 不删除
  failReason?: string; // 审核失败原因
  id?: number; // id
  idCard?: string; // 身份证号
  isBan?: boolean; // 是否禁用 true 禁用
  name?: string; // 姓名
  password?: string; // 密码
  phone?: string; // 手机号
  remark?: string; // 备注
  role?: 'college' | 'school' | 'after_school'; // 角色 college 院内用户 school 校内院外用户 after_school 校外用户
  schoolCardUrl?: string; // 校园卡url
  status?: 'un_check' | 'success' | 'fail'; // 审核状态 un_check 待审核 success 审核成功 fail 审核失败
  updatedAt?: string; // 更新时间
}

/** 搜索条件 */
export interface UserQueryParmas extends BasicQueryParams {
  id?: number; // id
  phone?: string; // 手机号
  role?: 'college' | 'school' | 'after_school'; // 角色 college 院内用户 school 校内院外用户 after_school 校外用户
  status?: 'un_check' | 'success' | 'fail'; // 审核状态 un_check 待审核 success 审核成功 fail 审核失败

}

/** 数据源，增删查改等请求 */
export default class UserQuery extends Queryable<UserModel, UserQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '用户'
  }

  // 默认的内容
  get defaultObject():  Partial<UserModel> {
    return {
   
      
    }
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<UserModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<UserModel> {
    return this._valueGetter()
  }

  // 表单规则
  get rules() {
    return {}
  }

  // 查询全部
  async all(params: UserQueryParmas) {
    console.log("查询全部", params);
    let res = await request({
      url: `/api/admin/student/get/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        id: params.id || null,
        phone: params.phone || null,
        role: params.role || null,
        status: params.status || null,
   
      }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  // 上下架
  async changeOnline(obj: UserModel) {
    console.log("修改", obj);
    obj = Object.assign({}, obj);
    let id = obj.id;
    delete obj.id;
    return request({
      url: `api/admin/student/online/${id}`,
      method: "put",
     
    });
  }

  // 上下架
  async changeRemark(obj: UserModel) {
    console.log("修改", obj);
    obj = Object.assign({}, obj);
    let id = obj.id;
    delete obj.id;
    return request({
      url: `api/admin/student/online/${id}`,
      method: "put",
      data:{
        remark:obj.remark || null
      }
     
    });
  }

  // // 通过id删除
  // async deleteObj(obj: UserModel) {
  //   return request({
  //     url: `/api/hospital/User/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
