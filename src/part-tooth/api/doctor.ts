import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http

/** 模型 */
export interface DoctorModel {
  /** 医生主键id */
  id?: number
  /** 姓名 */
  doctorName?: string
  /** 头像 */
  doctorHeadImg?: string
  /** 联系人手机号 */
  doctorTel?: string
  /** 个人简介 */
  introductory?: string
  /** 所属门店 */
  storeId?: number
  /** 门店名称 */
  storeName?: string
  /** 引流用户二维码链接地址 */
  referrerUserImg?: string
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
}

/** 搜索条件 */
export interface DoctorQueryParmas extends BasicQueryParams {}

/** 数据源，增删查改等请求 */
export default class DoctorQuery extends Queryable<DoctorModel, DoctorQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '引流医生'
  }

  // 默认的内容
  get defaultObject(): DoctorModel {
    return {
      doctorName: '',
      doctorHeadImg: '',
      doctorTel: '',
      introductory: '',
      storeName: '',
      referrerUserImg: '',
      createdAt: '',
      updatedAt: ''
    }
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<DoctorModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<DoctorModel> {
    return this._valueGetter()
  }

  // 表单规则
  get rules() {
    return {
      id: [{ required: true, message: '必填', trigger: 'blur' }],
      doctorName: [{ required: true, message: '必填', trigger: 'blur' }],
      doctorHeadImg: [{ required: true, message: '必填', trigger: 'blur' }],
      doctorTel: [{ required: true, message: '必填', trigger: 'blur' }],
      introductory: [{ required: true, message: '必填', trigger: 'blur' }],
      storeId: [{ required: true, message: '必填', trigger: 'blur' }],
      storeName: [{ required: true, message: '必填', trigger: 'blur' }],
      referrerUserImg: [{ required: true, message: '必填', trigger: 'blur' }],
      createdAt: [{ required: true, message: '必填', trigger: 'blur' }],
      updatedAt: [{ required: true, message: '必填', trigger: 'blur' }]
    }
  }

  // 查询全部
  async all(params: DoctorQueryParmas) {
    let res = await request({
      url: `/api/hospital/doctor/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize
      }
    })
    if (res.data.count == undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  // 上传修改
  async edit(obj: DoctorModel) {
    console.log('修改', obj)
    obj = Object.assign({}, obj)
    let id = obj.id
    delete obj.id
    return request({
      url: `/api/hospital/doctor/${id}`,
      method: 'put',
      data: obj
    })
  }

  // 添加
  async add(obj: DoctorModel) {
    delete obj.id
    return request({
      url: '/api/hospital/doctor',
      method: 'post',
      data: obj
    })
  }
  // 添加
  async reloadQR(obj: DoctorModel) {
    return request({
      url: `/api/hospital/doctor/doctorQRCode/${obj.id}`,
      method: 'put'
    })
  }

  // // 通过id删除
  // async deleteObj(obj: DoctorModel) {
  //   return request({
  //     url: `/api/hospital/doctor/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
