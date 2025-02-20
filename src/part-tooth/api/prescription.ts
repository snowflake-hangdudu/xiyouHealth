import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http

// 定义购买明细接口
export interface DrugPurchaseDetail {
  id: number // 明细id
  prescriptionId: number // 处方id
  drugId: number // 药品id
  buyNum: number // 购买数量
  price: number // 单价（快照）
  drugName: string // 药品名称（快照）
  images: string // 药品图片（快照）
  packingSpec: string // 包装规格（快照）
  packingUnit: string // 包装单位（快照）
  companyName: string // 企业名称（快照）
  createdAt: string // 创建时间
}

// 定义用户接口
export interface Patient {
  id: number // 用户主键id
  referrerDoctorId?: number // 引流医生id
  userName: string // 昵称
  password: string // 密码
  role: string // 角色
  headImg: string // 头像
  doctorName: string // 姓名
  tel: string // 电话
  storeName: string // 门店名称
  sex: string // 性别
  birthday: string // 生日
  idCard: string // 身份证号
  publicOpenId: string // 公众号openId
  createdAt: string // 创建时间
  updatedAt: string // 修改时间
}

/** 模型 */
export interface PrescriptionModel {
  /** 主键id */
  id?: number
  /** 用户id */
  userId?: number
  /** 患者姓名 */
  userName?: string
  /** 患者性别 */
  userSex?: string
  /** 患者年龄 */
  userAge?: string
  /** 身份证号 */
  userIdCard?: string
  /** 患者信息 */
  userFamily?: Patient
  /** 病情自述 */
  disease?: string
  /** 诊断 */
  diagnose?: string
  /** 初诊图片 */
  fastRecord?: string
  /** 医生id */
  doctorId?: number
  /** 处方申请药品信息 */
  prescriptionDetailsList?: DrugPurchaseDetail[]
  /** 处方审核状态1-待处理2--同意3--拒绝 */
  status?: number
  /** 处方使用状态1--未使用 2-已使用 3-已失效 */
  useStatus?: number
  /** 创建时间 */
  createdAt?: string
  /** 修改时间 */
  updatedAt?: string
}

/** 搜索条件 */
export interface PrescriptionQueryParmas extends BasicQueryParams {
  status?: number
  useStatus?: number
}

/** 数据源，增删查改等请求 */
export default class PrescriptionQuery extends Queryable<PrescriptionModel, PrescriptionQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '处方'
  }

  // 默认的内容
  get defaultObject(): PrescriptionModel {
    return {
      userName: '',
      userSex: '',
      userAge: '',
      userIdCard: '',
      disease: '',
      diagnose: '',
      fastRecord: '',
      createdAt: '',
      updatedAt: ''
    }
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<PrescriptionModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<PrescriptionModel> {
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
  async all(params: PrescriptionQueryParmas) {
    const res = await request({
      url: `/api/hospital/prescription/admin/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        status: params.status,
        useStatus: params.useStatus
      }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  // // 上传修改
  // async edit(obj: PrescriptionModel) {
  //   console.log("修改", obj);
  //   obj = Object.assign({}, obj);
  //   let id = obj.id;
  //   delete obj.id;
  //   return request({
  //     url: `/api/hospital/prescription/${id}`,
  //     method: "put",
  //     data: obj,
  //   });
  // }

  // // 添加
  // async add(obj: PrescriptionModel) {
  //   delete obj.id;
  //   return request({
  //     url: "/api/hospital/prescription",
  //     method: "post",
  //     data: obj,
  //   });
  // }

  // // 通过id删除
  // async deleteObj(obj: PrescriptionModel) {
  //   return request({
  //     url: `/api/hospital/prescription/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
