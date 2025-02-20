import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http


/** 模型 */
export interface CollegeModel {
  createdAt?: string; // 创建时间
  deleted?: boolean;  // 是否删除
  id?: number;        // ID
  isBan?: boolean;    // 是否禁用
  name?: string;      // 学院名称
  updatedAt?: string; // 更新时间
}

/** 搜索条件 */
export interface CollegeQueryParmas extends BasicQueryParams {
 name?: string; // 学院名称
}

/** 数据源，增删查改等请求 */
export default class CollegeQuery extends Queryable<CollegeModel, CollegeQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '学院'
  }

  // 默认的内容
  get defaultObject():  Partial<CollegeModel> {
    return {
   isBan: false,
   

   
      
    }
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<CollegeModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<CollegeModel> {
    return this._valueGetter()
  }

// 表单规则
get rules() {
  return {
    name: [
      { required: true, message: '请输入学院名称', trigger: 'blur' },
      { min: 1, max: 100, message: '学院名称长度在 1 到 100 个字符', trigger: 'blur' },
    ],
  }
}
  // 查询全部
  async all(params: CollegeQueryParmas) {
    console.log("查询全部", params);
    let res = await request({
      url: `/api/admin/college/select/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        name: params.name || null,
      }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  // 上传修改
  async edit(obj: CollegeModel) {

    obj = Object.assign({}, obj);
    let id = obj.id;
    delete obj.id;
    return request({
      url: `api/admin/college/update/${id}`,
      method: "put",
      data: obj,
    });
  }

  // 添加
  async add(obj: CollegeModel) {
    delete obj.id;
    return request({
      url: "api/admin/college/insert",
      method: "post",
      data: obj,
    });
  }

  // // 通过id删除
  // async deleteObj(obj: CollegeModel) {
  //   return request({
  //     url: `/api/hospital/College/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
