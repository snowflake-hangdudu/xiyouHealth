import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http

/** 模型 */
export interface AchModel {
  userId?: number;         // ID
  totalStep: number;     // 总步数
  totalPoints: number;  // 总积分
  todayStep: number;   // 今日步数
  phone: string;   // 电话
  overTaskCount: number;   // 完成任务数
  overChallengeCount: number;   // 完成挑战数
  name: string;   // 课题组名字
  lastWeekPoints: number;   // 上周积分

  
}

/** 搜索条件 */
export interface AchQueryParmas extends BasicQueryParams {
 name?: string; 
 phone?: string;
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
    return '成就'
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

    }
  }

  // 查询全部
  async all(params: AchQueryParmas) {
    console.log("查询全部", params);
    let res = await request({
      url: `api/admin/achievement/get/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
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
