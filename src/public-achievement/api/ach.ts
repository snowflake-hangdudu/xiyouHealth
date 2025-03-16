import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http

/** 模型 */
export interface AchModel {
  id?: number;              // 课题组ID，类型为 string
  name?: string;            // 课题组名字，类型为 string
  teacherId?: number;       // 导师ID，类型为 integer
  createdAt?: string;       // 创建时间，类型为 string（可以存储日期时间字符串）
  updatedAt?: string;       // 更新时间，类型为 string（可以存储日期时间字符串）
  deleted?: boolean;        // 是否删除，类型为 boolean，true 表示已删除，false 表示未删除
  teacherName?: string;     // 导师名字，类型为 string
  
}

/** 搜索条件 */
export interface AchQueryParmas extends BasicQueryParams {
 name?: string; // 课题组名字
 teacherName?: string; // 导师名字
}

/** 数据源，增删查改等请求 */
export default class AchQuery extends Queryable<AchModel, AchQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '课题'
  }

  // 默认的内容
  get defaultObject():  Partial<AchModel> {
    return {
   
      
    }
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<AchModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<AchModel> {
    return this._valueGetter()
  }

  // 表单规则
  get rules() {
    return {
      name: [
        { required: true, message: '请输入课题组名字', trigger: 'blur' },
      ],
      teacherId: [
        { required: true, message: '请选择负责人', trigger: 'blur' }
      ]
    }
  }

  // 查询全部
  async all(params: AchQueryParmas) {
    console.log("查询全部", params);
    let res = await request({
      url: `api/admin/researchGroup/get/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        name:params.name || null,
        teacherName:params.teacherName || null,
       }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  // 上传修改
  async edit(obj: AchModel) {
    console.log("修改", obj);
    obj = Object.assign({}, obj);
    let id = obj.id;
    delete obj.id;
    return request({
      url: `api/admin/researchGroup/update/${id}`,
      method: "put",
      data: {
        name: obj.name || null,
        teacherId: obj.teacherId || null,
      },
    });
  }

  // // 添加
  // async add(obj: AchModel) {
  //   delete obj.id;
  //   return request({
  //     url: "/api/hospital/Ach",
  //     method: "post",
  //     data: obj,
  //   });
  // }

  // // 通过id删除
  // async deleteObj(obj: AchModel) {
  //   return request({
  //     url: `/api/hospital/Ach/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
