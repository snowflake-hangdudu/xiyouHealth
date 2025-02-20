import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http

/** 模型 */
export interface DataModel {
  /** 校外用户 设备使用时长 单位：小时 */
  afterSchoolUseTime?: number;
  
  /** 院内用户 设备使用时长 单位：小时 */
  collegeUseTime?: number;
  
  /** 设备名称 */
  deviceName?: string;
  
  /** ID */
  id?: number;
  
  /** 房间名称/房间号 */
  labName?: string;
  
  /** 校内用户 设备使用时长 单位：小时 */
  schoolUseTime?: number;
  
  /** 设备使用时长 单位：小时 */
  useTime?: number;

  timeRange?:number
}

/** 搜索条件 */
export interface DataQueryParmas extends BasicQueryParams {
deviceName?: string // 设备名称
endTime?: string // 结束时间
labId?: number // 实验室id
startTime?: string // 开始时间
timeRange?: number // 时间段
}

/** 数据源，增删查改等请求 */
export default class DataQuery extends Queryable<DataModel, DataQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '数据'
  }

  // 默认的内容
  get defaultObject():  Partial<DataModel> {
    return {
   
      
    }
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<DataModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<DataModel> {
    return this._valueGetter()
  }

  // 表单规则
  get rules() {
    return {}
  }

  // 查询全部
  async all(params: DataQueryParmas) {
    console.log("查询全部", params);
    let res = await request({
      url: `api/admin/device/get/uncheck/list`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        deviceName: params.deviceName || null,
        labId: params.labId || null,
        startTime: params.timeRange ? params.timeRange[0] : null,
        endTime: params.timeRange ? params.timeRange[1] : null,
      }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  // // 上传修改
  // async edit(obj: DataModel) {
  //   console.log("修改", obj);
  //   obj = Object.assign({}, obj);
  //   let id = obj.id;
  //   delete obj.id;
  //   return request({
  //     url: `/api/hospital/Data/${id}`,
  //     method: "put",
  //     data: obj,
  //   });
  // }

  // // 添加
  // async add(obj: DataModel) {
  //   delete obj.id;
  //   return request({
  //     url: "/api/hospital/Data",
  //     method: "post",
  //     data: obj,
  //   });
  // }

  // // 通过id删除
  // async deleteObj(obj: DataModel) {
  //   return request({
  //     url: `/api/hospital/Data/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
