import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
import { ElMessage } from 'element-plus';
const { request } = http

/** 模型 */
/** 模型 */
export interface MentorModel {
  account?: string; // 账号
  collegeId?: number; // 学院id
  collegeName?: string; // 学院name
  createdAt?: string; // 创建时间
  deleted?: boolean; // 是否删除 true 删除 false 不删除
  failReason?: string; // 审核失败原因
  id?: number; // id
  isBan?: boolean; // 是否禁用 true 禁用
  level?: string; // 职称
  name?: string; // 姓名
  password?: string; // 密码
  phone?: string; // 电话号
  schoolCardUrl?: string; // 校园卡url
  status?: 'un_check' | 'success' | 'fail'; // 审核状态 un_check 待审核 success 审核成功 fail 审核失败
  updatedAt?: string; // 更新时间
  remark?: string; // 备注
}

/** 搜索条件 */
export interface MentorQueryParmas extends BasicQueryParams {

}

/** 数据源，增删查改等请求 */
export default class MentorQuery extends Queryable<MentorModel, MentorQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '导师'
  }

  // 默认的内容
  get defaultObject():  Partial<MentorModel> {
    return {
   
      
    }
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<MentorModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<MentorModel> {
    return this._valueGetter()
  }

  // 表单规则
  get rules() {
    return {}
  }

  // 查询全部
  async all(params: MentorQueryParmas) {
    console.log("查询全部", params);
    let res = await request({
      url: `api/admin/teacher/get/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
    
      }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  //上下架
  async upAndDown(obj:MentorModel) {
    if(!obj.id){
      return ElMessage.error("id不能为空")
    }
    return request({
      url: `api/admin/teacher/online/${obj.id}`,
      method: 'put',
    }).then(()=>{
      ElMessage.success("操作成功")
    }).catch(()=>{
      ElMessage.error("操作失败")
    })
  }


  // // 上传修改
  // async edit(obj: MentorModel) {
  //   console.log("修改", obj);
  //   obj = Object.assign({}, obj);
  //   let id = obj.id;
  //   delete obj.id;
  //   return request({
  //     url: `/api/hospital/Mentor/${id}`,
  //     method: "put",
  //     data: obj,
  //   });
  // }

  // // 添加
  // async add(obj: MentorModel) {
  //   delete obj.id;
  //   return request({
  //     url: "/api/hospital/Mentor",
  //     method: "post",
  //     data: obj,
  //   });
  // }

  // // 通过id删除
  // async deleteObj(obj: MentorModel) {
  //   return request({
  //     url: `/api/hospital/Mentor/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
