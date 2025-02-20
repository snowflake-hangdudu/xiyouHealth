import Queryable, { BasicQueryParams } from "@/public/queryable";
import http from '@/config/axios'
const { request } = http;

/** 模型 */
export interface UserFamilyModel {
  /** 主键id */
  id?: number
  /** 昵称 */
  userName?: string
  /** 密码 */
  password?: string
  /** 角色 */
  role?: string
  /** 头像 */
  headImg?: string
  /** 性别 */
  sex?: string
  /** 身份证号 */
  idCard?: string
  /** 电话 */
  tel?: string
  /** 公众号openId */
  publicOpenId?: number
  /** 引流医生id */
  referrerDoctorId?: number
  doctorName?: string
  /** 生日 */
  birthday?: string
  /** 创建时间 */
  createdAt?: string
  /** 修改时间 */
  updatedAt?: string
}

/** 搜索条件 */
export interface UserFamilyQueryParmas extends BasicQueryParams {
  /** 引流医生id */
  referrerDoctorId?: number;
  /** 所属门店 */
  storeId?: number;
  /** 昵称 */
  userName?: string;
}

/** 数据源，增删查改等请求 */
export default class UserFamilyQuery extends Queryable<UserFamilyModel, UserFamilyQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '患者'
  };

  // 默认的内容
  get defaultObject(): UserFamilyModel {
    return {};
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<UserFamilyModel> = () => ({});

  // 已输入的数据的Getter
  get currentEditRow(): Partial<UserFamilyModel> {
    return this._valueGetter();
  }

  // 表单规则
  get rules() {
    return {}
  };

  // 查询全部
  async all(params: UserFamilyQueryParmas) {
    let res = await request({
      url: `/api/hospital/userFamily/page`,
      method: "get",
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        referrerDoctorId: params.referrerDoctorId,
        storeId: params.storeId,
        userName: params.userName,
      },
    });
    if (res.data.count == undefined) return res.data;
    return {
      data: res.data.rows,
      total: res.data.count,
    };
  }

  // // 上传修改
  // async edit(obj: UserFamilyModel) {
  //   console.log("修改", obj);
  //   obj = Object.assign({}, obj);
  //   let id = obj.id;
  //   delete obj.id;
  //   return request({
  //     url: `/api/hospital/userFamily/${id}`,
  //     method: "put",
  //     data: obj,
  //   });
  // }

  // // 添加
  // async add(obj: UserFamilyModel) {
  //   delete obj.id;
  //   return request({
  //     url: "/api/hospital/userFamily",
  //     method: "post",
  //     data: obj,
  //   });
  // }

  // // 通过id删除
  // async deleteObj(obj: UserFamilyModel) {
  //   return request({
  //     url: `/api/hospital/userFamily/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}