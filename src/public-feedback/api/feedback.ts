import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http

/** 用户子模型 */
export interface FeedbackUserModel {
  id: number;
  name: string;
  phone: string;
  avatar: string;
  totalPoint: number;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

/** 反馈主模型 */
export interface FeedbackModel {
  id?: number;
  content: string;          // 反馈内容
  userId: number;           // 用户ID
  user?: FeedbackUserModel; // 关联用户信息
  createdAt?: string;
  updatedAt?: string;
  deleted?: number;         // 根据接口文档调整为number类型
}

/** 搜索条件 */
export interface FeedbackQueryParams extends BasicQueryParams {
  name?: string;  // 用户姓名筛选
  phone?: string; // 用户手机号筛选
}

/** 反馈数据源 */
export default class FeedbackQuery extends Queryable<FeedbackModel, FeedbackQueryParams> {
  get objectName(): string {
    return '用户反馈'
  }

  get defaultObject(): Partial<FeedbackModel> {
    return {
      content: '',
      userId: 0
    }
  }

  _valueGetter: () => Partial<FeedbackModel> = () => ({})
  
  get currentEditRow(): Partial<FeedbackModel> {
    return this._valueGetter()
  }

  get rules() {
    return {
      content: [
        { required: true, message: '反馈内容不能为空', trigger: 'blur' },
        { max: 500, message: '内容长度不能超过500字符' }
      ]
    }
  }

  // 分页查询
  async all(params: FeedbackQueryParams) {
    const res = await request({
      url: 'api/admin/feedback/get/page',
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        name: params.name || null,
        phone: params.phone || null
      }
    })
    
    return {
      data: res.data?.rows || [],
      total: res.data?.count || 0
    }
  }

  // 更新反馈（根据实际接口需要）
  async edit(obj: FeedbackModel) {
    return request({
      url: `/api/admin/feedback/update/${obj.id}`,
      method: 'put',
      data: {
        content: obj.content,
        userId: obj.userId
      }
    })
  }

  // 标记删除（根据接口文档可能需要调整）
  async deleteObj(obj: FeedbackModel) {
    return request({
      url: `/api/admin/feedback/delete/${obj.id}`,
      method: 'delete'
    })
  }
}