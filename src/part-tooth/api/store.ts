import Queryable, { BasicQueryParams } from "@/public/queryable";
import http from '@/config/axios'
const { request } = http;

/** 模型 */
export interface StoreModel {
  /** ID */
  id?: number
  /** 用户id */
  userId?: number
  /** 门店名称 */
  storeName?: string
  /** 账户密码 */
  tel?: string
  password?: string
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
}

/** 搜索条件 */
export interface StoreQueryParmas extends BasicQueryParams {

}

/** 数据源，增删查改等请求 */
export default class StoreQuery extends Queryable<StoreModel, StoreQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '门店'
  };

  // 默认的内容
  get defaultObject(): StoreModel {
    return {
      storeName: "",
      createdAt: "",
      updatedAt: "",
    };
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<StoreModel> = () => ({});

  // 已输入的数据的Getter
  get currentEditRow(): Partial<StoreModel> {
    return this._valueGetter();
  }

  // 表单规则
  get rules() {
    return {
      id: [{ required: true, message: "必填", trigger: "blur" }],
      userId: [{ required: true, message: "必填", trigger: "blur" }],
      storeName: [{ required: true, message: "必填", trigger: "blur" }],
      createdAt: [{ required: true, message: "必填", trigger: "blur" }],
      updatedAt: [{ required: true, message: "必填", trigger: "blur" }],
    }
  };

  // 查询全部
  async all(params: StoreQueryParmas) {
    let res = await request({
      url: `/api/hospital/store/page`,
      method: "get",
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
      },
    });
    if (res.data.count == undefined) return res.data;
    return {
      data: res.data.rows,
      total: res.data.count,
    };
  }

  // 上传修改
  async edit(obj: StoreModel) {
    console.log("修改", obj);
    obj = Object.assign({}, obj);
    let id = obj.id;
    delete obj.id;
    return request({
      url: `/api/hospital/store/${id}`,
      method: "put",
      data: obj,
    });
  }

  // 添加
  async add(obj: StoreModel) {
    delete obj.id;
    return request({
      url: "/api/hospital/store",
      method: "post",
      data: obj,
    });
  }

  // 改密码
  async editPassword(obj: StoreModel) {
    console.log("修改", obj);
    obj = Object.assign({}, obj);
    let id = obj.userId;
    delete obj.userId;
    return request({
      url: `/api/hospital/store/${id}`,
      method: "put",
      data: obj,
    });
  }

  // // 通过id删除
  // async deleteObj(obj: StoreModel) {
  //   return request({
  //     url: `/api/hospital/store/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}