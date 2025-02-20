import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http

/** 模型 */
export interface BookModel {
  adminRemark?: string;
  applyApplicant?: string;
  applyName?: string;
  collectData?: string;
  createdAt?: string;
  deleted?: boolean;
  device?: DeviceObject;
  afterSchoolPrice?: number;
  code?: string;
  collegePrice?: number;
  deviceUrl?: string;
  disciplineArea?: string;
  id?: number;
  info?: string;
  isMaintenance?: boolean;
  isOnline?: boolean;
  isUse?: boolean;
  mainFunction?: string;
  maintenanceDate?: string;
  maintenanceEnd?: string;
  maintenanceNotification?: string;
  maintenanceStart?: string;
  name?: string;
  openTimeEnd?: string;
  openTimeStart?: string;
  operationDocument?: string;
  reservationAuth?: string;
  reservationCheckTime?: string;
  schoolPrice?: number;
  serviceArea?: string;
  technicalParameter?: string;
  updatedAt?: string;
  usageAgreement?: string;
  videoUrl?: string;
  deviceAdminNameList?: string[];
  deviceCode?: string;
  deviceId?: number;
  deviceName?: string;
  experimentAnalyze?: string;
  experimentName?: string;
  experimentPurpose?: string;
  failReason?: string;
  groupName?: string;
  isCertificate?: boolean;
  labAdminNameList?: string[];
  labName?: string;
  linkAddress?: string;
  linkEmail?: string;
  linkName?: string;
  linkPhone?: string;
  paramRequire?: string;
  projectName?: string;
  remark?: string;
  reservationTimeJson?: string;
  sampleType?: string;
  status?: string; // teacher_un_check, admin_uncheck, success, fail
  studentName?: string;
  studentPhone?: string;
  studentRole?: string; // college, school, after_school
  teacherGroupId?: number;
  totalFee?: number;
  userId?: number;
  userType?: string;
}

/** Device对象 */
export interface DeviceObject {
  afterSchoolPrice?: number;
  code?: string;
  collegePrice?: number;
  createdAt?: string;
  deleted?: boolean;
  deviceUrl?: string;
  disciplineArea?: string;
  id?: number;
  info?: string;
  isMaintenance?: boolean;
  isOnline?: boolean;
  isUse?: boolean;
  mainFunction?: string;
  maintenanceDate?: string;
  maintenanceEnd?: string;
  maintenanceNotification?: string;
  maintenanceStart?: string;
  name?: string;
  openTimeEnd?: string;
  openTimeStart?: string;
  operationDocument?: string;
  reservationAuth?: string;
  reservationCheckTime?: string;
  schoolPrice?: number;
  serviceArea?: string;
  technicalParameter?: string;
  updatedAt?: string;
  usageAgreement?: string;
  videoUrl?: string;
  deviceAdminNameList?: string[];
}

/** 搜索条件 */
export interface BookQueryParmas extends BasicQueryParams {
  adminId?: number;
  deviceCode?: string;
  labId?:string
  status?: string; // teacher_un_check, admin_uncheck, teacher_checked, success, fail
  studentName?:string
  studentPhone?:string
}

/** 数据源，增删查改等请求 */
export default class BookQuery extends Queryable<BookModel, BookQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '预约管理'
  }

  // 默认的内容
  get defaultObject():  Partial<BookModel> {
    return {
   
      
    }
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<BookModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<BookModel> {
    return this._valueGetter()
  }

  // 表单规则
  get rules() {
    return {}
  }

  // 查询全部
  async all(params: BookQueryParmas) {
    console.log("查询全部", params);
    let res = await request({
      url: `api/admin/reservation/get/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        adminId:params.adminId || null,
        deviceCode:params.deviceCode || null,
        labId:params.labId|| null,
        status: params.status || null,
        studentName:params.studentName || null,
        studentPhone:params.studentPhone || null

      }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  // // 上传修改
  // async edit(obj: BookModel) {
  //   console.log("修改", obj);
  //   obj = Object.assign({}, obj);
  //   let id = obj.id;
  //   delete obj.id;
  //   return request({
  //     url: `/api/hospital/Book/${id}`,
  //     method: "put",
  //     data: obj,
  //   });
  // }

  // // 添加
  // async add(obj: BookModel) {
  //   delete obj.id;
  //   return request({
  //     url: "/api/hospital/Book",
  //     method: "post",
  //     data: obj,
  //   });
  // }

  // // 通过id删除
  // async deleteObj(obj: BookModel) {
  //   return request({
  //     url: `/api/hospital/Book/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
