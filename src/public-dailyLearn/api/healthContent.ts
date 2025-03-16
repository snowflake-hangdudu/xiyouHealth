import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
import { ElMessage } from 'element-plus';
const { request } = http

/** 健康内容模型 */
export interface HealthContentModel {
  answer?: boolean;       // 答案
  content?: string;      // 内容(视频)
  createdAt?: string;    // 创建时间
  deleted?: boolean;     // 是否删除
  id?: number;           // ID
  isBan?: boolean;       // 是否上下架
  question?: string;     // 题目
  sort?: number;         // 排序
  title?: string;        // 标题
  updatedAt?: string;    // 更新时间
}

/** 搜索条件 */
export interface HealthContentQueryParams extends BasicQueryParams {}

/** 健康内容数据源 */
export default class HealthContentQuery extends Queryable<HealthContentModel, HealthContentQueryParams> {
  /** 对象名称 */
  get objectName(): string {
    return '健康内容'
  }

  /** 默认内容 */
  get defaultObject(): Partial<HealthContentModel> {
    return {
      title: '',
      content: '',
      question: '',
      answer: false,
      sort: 0,
      isBan: false
    }
  }

  /** 值获取器 */
  _valueGetter: () => Partial<HealthContentModel> = () => ({})

  /** 当前编辑行数据 */
  get currentEditRow(): Partial<HealthContentModel> {
    return this._valueGetter()
  }

  /** 表单校验规则 */
  get rules() {
    return {
      title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
      content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
    }
  }

  /** 分页查询 */
  async all(params: HealthContentQueryParams) {
    const res = await request({
      url: `api/admin/health/get/page`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize
      }
    })
    
    if (res.data.count === undefined) return res.data
    return {
      data: res.data.rows,
      total: res.data.count
    }
  }

  async add(row) {
    return request({
      url: `api/admin/health/save`,
      method: 'post',
      data: row
    }).then(() => {
      ElMessage.success("添加成功")
    }).catch(() => {
      ElMessage.error("添加失败")
    })
  }

  async edit(row) {
    return request({
      url: `api/admin/health/save`,
      method: 'post',
      data: row
    }).then(() => {
      ElMessage.success("编辑成功")
    }).catch(() => {
      ElMessage.error("编辑失败")
    })
    
  }

  /** 上下架操作 */
  async toggleStatus(obj: HealthContentModel) {
    if (!obj.id) {
      ElMessage.error("ID不能为空")
      return
    }
    return request({
      url: `/api/admin/health/online/${obj.id}`,
      method: 'put',
    }).then(() => {
      ElMessage.success("操作成功")
    }).catch(() => {
      ElMessage.error("操作失败")
    })
  }
}