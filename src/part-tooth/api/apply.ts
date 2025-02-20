import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
import { DrugPurchaseDetail, Patient } from './prescription'
const { request } = http

/** 模型 */
export interface ApplyModel {
  /** 主键id */
  id?: number
  /** 用户id */
  userId?: number
  /** 患者姓名（快照） */
  userName?: string
  /** 患者性别（快照） */
  userSex?: string
  /** 患者年龄（快照） */
  userAge?: string
  /** 身份证号（快照） */
  userIdCard?: string
  /** 患者信息 */
  userFamily?: Patient
  /** 病情自述 */
  disease?: string
  /** 诊断 用户上传 */
  diagnose?: string
  /** 初诊图片 */
  fastRecord?: string
  /** 医生id */
  doctorId?: number
  /** 处方申请药品信息 */
  prescriptionApplyDetailsList?: DrugPurchaseDetail[]
  /** 处方申请状态1-待处理2--同意3--拒绝4--失效 */
  status?: number
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
}

/** 搜索条件 */
export interface ApplyQueryParmas extends BasicQueryParams {
  status?: number
}

/** 数据源，增删查改等请求 */
export default class ApplyQuery extends Queryable<ApplyModel, ApplyQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '处方申请'
  }

  // 默认的内容
  get defaultObject(): ApplyModel {
    return {}
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<ApplyModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<ApplyModel> {
    return this._valueGetter()
  }

  // 表单规则
  get rules() {
    return {
      id: [{ required: true, message: '必填', trigger: 'blur' }],
      userId: [{ required: true, message: '必填', trigger: 'blur' }],
      userName: [{ required: true, message: '必填', trigger: 'blur' }],
      userSex: [{ required: true, message: '必填', trigger: 'blur' }],
      userAge: [{ required: true, message: '必填', trigger: 'blur' }],
      userIdCard: [{ required: true, message: '必填', trigger: 'blur' }],
      userFamily: [{ required: true, message: '必填', trigger: 'blur' }],
      disease: [{ required: true, message: '必填', trigger: 'blur' }],
      diagnose: [{ required: true, message: '必填', trigger: 'blur' }],
      fastRecord: [{ required: true, message: '必填', trigger: 'blur' }],
      doctorId: [{ required: true, message: '必填', trigger: 'blur' }],
      prescriptionApplyDetailsList: [{ required: true, message: '必填', trigger: 'blur' }],
      status: [{ required: true, message: '必填', trigger: 'blur' }],
      createdAt: [{ required: true, message: '必填', trigger: 'blur' }],
      updatedAt: [{ required: true, message: '必填', trigger: 'blur' }]
    }
  }

  // 查询全部
  async all(params: ApplyQueryParmas) {
    const res = await request({
      url: `/api/hospital/prescription/apply/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        status: params.status
      }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  // 上传修改
  async review(obj: ApplyModel, isPass: boolean) {
    console.log('修改', obj)
    obj = Object.assign({}, obj)
    const id = obj.id
    delete obj.id
    return request({
      url: `/api/hospital/prescription/apply/${id}/review`,
      method: 'put',
      data: {
        isPass: isPass
      }
    })
  }

  // // 上传修改
  // async edit(obj: ApplyModel) {
  //   console.log("修改", obj);
  //   obj = Object.assign({}, obj);
  //   let id = obj.id;
  //   delete obj.id;
  //   return request({
  //     url: `/api/hospital/apply/${id}`,
  //     method: "put",
  //     data: obj,
  //   });
  // }

  // // 添加
  // async add(obj: ApplyModel) {
  //   delete obj.id;
  //   return request({
  //     url: "/api/hospital/apply",
  //     method: "post",
  //     data: obj,
  //   });
  // }

  // // 通过id删除
  // async deleteObj(obj: ApplyModel) {
  //   return request({
  //     url: `/api/hospital/apply/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
