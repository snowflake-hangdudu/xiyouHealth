import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
import { DrugPurchaseDetail, Patient } from './prescription'
const { request } = http

/** 模型 */
export interface OrderModel {
  /** 主键id */
  id?: number
  /** 用户id */
  userId?: number
  /** 患者信息 */
  userFamily?: Patient
  /** 订单编号 */
  drugOrderNo?: string
  /** 订单总金额 */
  totalMoney?: number
  /** 总运费 */
  totalFreightMoney?: string
  /** 开具发票(0不开具 1开具) */
  invoice?: string
  /** 邮箱 */
  mail?: string
  /** 收货人 */
  consignee?: string
  /** 收货人电话 */
  consigneeTel?: string
  /** 收货省 */
  consigneeProvince?: string
  /** 收货市 */
  consigneeCity?: string
  /** 收货区 */
  consigneeArea?: string
  /** 收货地址 */
  consigneeDetailAddress?: string
  /** 快递名称 */
  expressName?: string
  /** 快递单号 */
  expressNo?: string
  /** 处方id */
  prescriptionId?: number
  /** 医生id */
  doctorId?: number
  /** 医生信息 */
  doctorName?: string
  /** 药师信息 */
  pharmacistName?: string
  /** 门店信息 */
  storeName?: string
  /** 药品信息列表 */
  drugOrderDetailsList?: DrugPurchaseDetail[]
  /** 药品订单状态 1-待付款2-已取消3-待发货-4-待收货 */
  status?: number
  /** 支付时间 */
  payAt?: string
  /** 发货时间 */
  deliveryAt?: string
  /** 完成时间 */
  finishAt?: string
  /** 取消时间 */
  cancelAt?: string
  /** 过期时间 */
  expireAt?: string
  /** 创建时间 */
  createdAt?: string
  /** 修改时间 */
  updatedAt?: string
  /** 是否删除0否-1是 */
  deleted?: string
}

/** 搜索条件 */
export interface OrderQueryParmas extends BasicQueryParams {
  /** 医生名称	query	false	 */
  doctorName?: string
  /** 订单编号	query	false	 */
  drugOrderNo?: string
  /** 药品订单状态 1-待付款2-已取消3-待发货-4-待收货	query	false	 */
  status?: number
  /** 所属门店 */
  storeId?: number
}

/** 数据源，增删查改等请求 */
export default class OrderQuery extends Queryable<OrderModel, OrderQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '订单'
  }

  // 默认的内容
  get defaultObject(): OrderModel {
    return {}
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<OrderModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<OrderModel> {
    return this._valueGetter()
  }

  // 表单规则
  get rules() {
    return {
      id: [{ required: true, message: '必填', trigger: 'blur' }],
      userId: [{ required: true, message: '必填', trigger: 'blur' }],
      userFamily: [{ required: true, message: '必填', trigger: 'blur' }],
      drugOrderNo: [{ required: true, message: '必填', trigger: 'blur' }],
      totalMoney: [{ required: true, message: '必填', trigger: 'blur' }],
      totalFreightMoney: [{ required: true, message: '必填', trigger: 'blur' }],
      invoice: [{ required: true, message: '必填', trigger: 'blur' }],
      mail: [{ required: true, message: '必填', trigger: 'blur' }],
      consignee: [{ required: true, message: '必填', trigger: 'blur' }],
      consigneeTel: [{ required: true, message: '必填', trigger: 'blur' }],
      consigneeProvince: [{ required: true, message: '必填', trigger: 'blur' }],
      consigneeCity: [{ required: true, message: '必填', trigger: 'blur' }],
      consigneeArea: [{ required: true, message: '必填', trigger: 'blur' }],
      consigneeDetailAddress: [{ required: true, message: '必填', trigger: 'blur' }],
      expressName: [{ required: true, message: '必填', trigger: 'blur' }],
      expressNo: [{ required: true, message: '必填', trigger: 'blur' }],
      prescriptionId: [{ required: true, message: '必填', trigger: 'blur' }],
      doctorId: [{ required: true, message: '必填', trigger: 'blur' }],
      doctorName: [{ required: true, message: '必填', trigger: 'blur' }],
      pharmacistName: [{ required: true, message: '必填', trigger: 'blur' }],
      storeName: [{ required: true, message: '必填', trigger: 'blur' }],
      drugOrderDetailsList: [{ required: true, message: '必填', trigger: 'blur' }],
      status: [{ required: true, message: '必填', trigger: 'blur' }],
      payAt: [{ required: true, message: '必填', trigger: 'blur' }],
      deliveryAt: [{ required: true, message: '必填', trigger: 'blur' }],
      finishAt: [{ required: true, message: '必填', trigger: 'blur' }],
      cancelAt: [{ required: true, message: '必填', trigger: 'blur' }],
      expireAt: [{ required: true, message: '必填', trigger: 'blur' }],
      createdAt: [{ required: true, message: '必填', trigger: 'blur' }],
      updatedAt: [{ required: true, message: '必填', trigger: 'blur' }],
      deleted: [{ required: true, message: '必填', trigger: 'blur' }]
    }
  }

  // 查询全部
  async all(params: OrderQueryParmas) {
    const res = await request({
      url: `/api/hospital/admin/drug/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        doctorName: params.doctorName,
        drugOrderNo: params.drugOrderNo,
        status: params.status,
        storeId: params.storeId
      }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  // 上传修改（添加快递信息）
  async edit(obj: OrderModel) {
    console.log('修改', obj)
    obj = Object.assign({}, obj)
    const id = obj.id
    delete obj.id
    return request({
      url: `/api/hospital/admin/delivery/${id}`,
      method: 'put',
      data: obj
    })
  }

  // // 添加
  // async add(obj: OrderModel) {
  //   delete obj.id;
  //   return request({
  //     url: "/api/hospital/order",
  //     method: "post",
  //     data: obj,
  //   });
  // }

  // // 通过id删除
  // async deleteObj(obj: OrderModel) {
  //   return request({
  //     url: `/api/hospital/order/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
