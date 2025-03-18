import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http
import { ElMessage } from 'element-plus'

/** 周挑战模型 */
export interface ChallengeModel {
  id?: number;         // ID
  content: string;     // 挑战内容
  sort: number;        // 排序序号
  createdAt?: string;  // 创建时间
  updatedAt?: string;  // 更新时间
  deleted?: boolean;   // 软删除标记
  isBan?: boolean;     // 是否上下架
}

/** 搜索条件 */
export interface ChallengeQueryParams extends BasicQueryParams {}

/** 数据源 */
export default class ChallengeQuery extends Queryable<ChallengeModel, ChallengeQueryParams> {
  get objectName(): string {
    return '周挑战'
  }

  get defaultObject(): Partial<ChallengeModel> {
    return {
      content: '',
      sort: 0,
      isBan: false
    }
  }

  _valueGetter: () => Partial<ChallengeModel> = () => ({})
  
  get currentEditRow(): Partial<ChallengeModel> {
    return this._valueGetter()
  }

  get rules() {
    return {
      content: [
        { required: true, message: '请输入挑战内容', trigger: 'blur' },
        { max: 500, message: '内容长度不能超过500字符' }
      ],
      sort: [
        { required: true, message: '请输入排序序号' },
        { type: 'number', min: 0, message: '排序值不能小于0' }
      ]
    }
  }

  // 分页查询
  async all(params: ChallengeQueryParams) {
    try {
      const res = await request({
        url: 'api/admin/challenge/get/page',
        method: 'get',
        params: {
          pageNum: params.pageNum,
          pageSize: params.pageSize
        }
      })
      
      return {
        data: res.data?.rows || [],
        total: res.data?.count || 0
      }
    } catch (e) {
      ElMessage.error('获取挑战列表失败')
      return { data: [], total: 0 }
    }
  }

  // 统一保存方法
  async save(obj: ChallengeModel) {
    try {
      const method = 'post'
      console.log(obj,'obj')
      await request({
       url: 'api/admin/challenge/save',
        method,
        data: {
          content: obj.content,
          sort: obj.sort || undefined,
          id: obj.id || undefined,
          isBan: obj.isBan
        }
      })
      
      ElMessage.success(obj.id ? '修改成功' : '新增成功')
      return true
    } catch (e) {
      ElMessage.error('操作失败')
      throw e
    }
  }

  // 兼容原有API
  async add(obj: ChallengeModel) {
    return this.save(obj)
  }

  async edit(obj: ChallengeModel) {
    return this.save(obj)
  }
}