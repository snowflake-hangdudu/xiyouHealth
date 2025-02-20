import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http

/** 模型 */
export interface MemberModel {
  id?:  number;               // 成员ID，类型为 integer
  groupId?: number;          // 课题组ID，类型为 integer
  studentId?: number;        // 学生ID，类型为 integer
  status?: string;           // 审核状态，类型为 string，可选值：'un_check'、'success'、'fail'
  adminRemark?: string;      // 管理员备注，类型为 string
  teacherRemark?: string;    // 导师备注，类型为 string
  createdAt?: string;        // 创建时间，类型为 string（可以存储日期时间字符串）
  updatedAt?: string;        // 更新时间，类型为 string（可以存储日期时间字符串）
  studentPhone?: string;            // 手机号，类型为 string
  studentName?: string;      // 学生姓名，类型为 string
}

/** 搜索条件 */
export interface MemberQueryParmas extends BasicQueryParams {
groupId?:number;
name?:string;
phone?:string;
}

/** 数据源，增删查改等请求 */
export default class MemberQuery extends Queryable<MemberModel, MemberQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '成员'
  }

  // 默认的内容
  get defaultObject():  Partial<MemberModel> {
    return {
   
      
    }
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<MemberModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<MemberModel> {
    return this._valueGetter()
  }

  // 表单规则
  get rules() {
    return {}
  }

  // 查询全部
  async all(params: MemberQueryParmas) {
    console.log("查询全部", params);
    let res = await request({
      url: `api/admin/researchGroup/user/get/user/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        groupId:params.groupId || null,
        name:params.name || null,
        phone:params.phone || null,
       }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  // 上传修改
  async edit(obj: MemberModel) {
    console.log("修改", obj);
    obj = Object.assign({}, obj);
    let id = obj.id;
    delete obj.id;
    return request({
      url: `api/admin/researchGroup/update/${id}`,
      method: "put",
      data: obj,
    });
  }

  // // 添加
  // async add(obj: MemberModel) {
  //   delete obj.id;
  //   return request({
  //     url: "/api/hospital/Member",
  //     method: "post",
  //     data: obj,
  //   });
  // }

  // 通过id删除
  async deleteObj(obj: MemberModel) {
    return request({
      url: `api/admin/researchGroup/user/del/${obj.id}`,
      method: "delete",
    });
  }
}
