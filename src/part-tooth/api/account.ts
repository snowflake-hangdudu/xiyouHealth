import Queryable, { BasicQueryParams } from "@/public/queryable";
import http from '@/config/axios'
const { request } = http;

/** 模型 */
export interface AccountModel {
  
}

/** 搜索条件 */
export interface AccountQueryParmas extends BasicQueryParams {
  
}

/** 数据源，增删查改等请求 */
export default class AccountQuery extends Queryable <AccountModel, AccountQueryParmas > {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '账户'
  };

  // 默认的内容
  get defaultObject(): AccountModel {
    return {
      
    };
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<AccountModel> = () => ({});

  // 已输入的数据的Getter
  get currentEditRow(): Partial<AccountModel> {
    return this._valueGetter();
  }

  // 表单规则
  get rules() {
    return {
      
    }
  };

  // 查询全部
  async all(params: AccountQueryParmas) {
    let res = await request({
      url: `/api/hospital/account/page`,
      method: "get",
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
      },
    });
    if(res.data.count == undefined) return res.data;
    return {
      data: res.data.rows,
      total: res.data.count,
    };
  }

  // // 上传修改
  // async edit(obj: AccountModel) {
  //   console.log("修改", obj);
  //   obj = Object.assign({}, obj);
  //   let id = obj.id;
  //   delete obj.id;
  //   return request({
  //     url: `/api/hospital/account/${id}`,
  //     method: "put",
  //     data: obj,
  //   });
  // }

  // // 添加
  // async add(obj: AccountModel) {
  //   delete obj.id;
  //   return request({
  //     url: "/api/hospital/account",
  //     method: "post",
  //     data: obj,
  //   });
  // }

  // // 通过id删除
  // async deleteObj(obj: AccountModel) {
  //   return request({
  //     url: `/api/hospital/account/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}