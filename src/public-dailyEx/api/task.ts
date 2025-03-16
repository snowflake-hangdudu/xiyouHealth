import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http
import { ElMessage } from 'element-plus'

/** 任务模型 */
export interface TaskModel {
  id?: number;         // ID
  content: string;     // 任务内容
  type: 'out' | 'in';  // 任务类型
  isBan?: boolean;     // 是否上下架
  createdAt?: string;  // 创建时间
  updatedAt?: string;  // 更新时间
  deleted?: boolean;   // 是否删除
}

/** 搜索条件 */
export interface TaskQueryParams extends BasicQueryParams {
  content?: string;  // 任务内容筛选
  type?: string;     // 任务类型筛选
}

/** 数据源 */
export default class TaskQuery extends Queryable<TaskModel, TaskQueryParams> {
  get objectName(): string {
    return '运动任务'
  }

  get defaultObject(): Partial<TaskModel> {
    return {
      content: '',
      type: 'out',
      isBan: false
    }
  }

  _valueGetter: () => Partial<TaskModel> = () => ({})
  
  get currentEditRow(): Partial<TaskModel> {
    return this._valueGetter()
  }

  get rules() {
    return {
      content: [
        { required: true, message: '任务内容不能为空', trigger: 'blur' },
        { max: 500, message: '内容长度不能超过500字符' }
      ],
      type: [
        { 
          required: true,
          validator: (_, value, callback) => {
            if (!['out', 'in'].includes(value)) {
              callback(new Error('请选择有效任务类型'))
            } else {
              callback()
            }
          }
        }
      ]
    }
  }

  // 分页查询
  async all(params: TaskQueryParams) {
    const res = await request({
      url: '/api/admin/task/get/page',
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        content: params.content || null,
        type: params.type || null
      }
    })
    
    return {
      data: res.data?.rows || [],
      total: res.data?.count || 0
    }
  }

  // 统一保存方法（新增/修改）
  async save(obj: TaskModel) {
    let id:any = null
    if(obj.id){
      id = obj.id
    }
    
    try {
      const res = await request({
        url: '/api/admin/task/save',
        method: 'post',
        data: {
          id: id || undefined,
          content: obj.content || null,
          type: obj.type || null,
          isBan: obj.isBan
        }
      })
      ElMessage.success(obj.id ? '修改成功' : '新增成功')
      return res
    } catch (e) {
      ElMessage.error('操作失败')
      throw e
    }
  }

  // 兼容原有API
  async add(obj: TaskModel) {
    return this.save(obj)
  }

  async edit(obj: TaskModel) {
    return this.save(obj)
  }
}