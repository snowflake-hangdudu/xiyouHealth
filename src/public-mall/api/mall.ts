import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http
import { ElMessage } from 'element-plus'

/** 商品模型 */
export interface MallModel {
  id?: number;         // 商品ID
  title: string;       // 商品标题
  point: number;       // 所需积分
  img: string;         // 商品图片
  count: number;       // 商品库存
  isBan?: boolean;     // 上下架状态
  createdAt?: string;  // 创建时间
  updatedAt?: string;  // 更新时间
  deleted?: boolean;   // 软删除
}

/** 搜索条件 */
export interface MallQueryParams extends BasicQueryParams {
  title?: string;     // 商品标题筛选
  point?: number;     // 积分筛选
}

/** 商品数据源 */
export default class MallQuery extends Queryable<MallModel, MallQueryParams> {
  get objectName(): string {
    return '商品'
  }

  get defaultObject(): Partial<MallModel> {
    return {
      title: '',
      point: 0,
      img: '',
      count: 0,
      isBan: false
    }
  }

  _valueGetter: () => Partial<MallModel> = () => ({})
  
  get currentEditRow(): Partial<MallModel> {
    return this._valueGetter()
  }

  get rules() {
    return {
      title: [
        { required: true, message: '请输入商品标题', trigger: 'blur' },
        { max: 100, message: '标题长度不能超过100字符' }
      ],
      point: [
        { required: true, message: '请输入所需积分' },
        { type: 'number', min: 0, message: '积分不能为负数' }
      ],
      count: [
        { required: true, message: '请输入库存数量' },
        { type: 'number', min: 0, message: '库存不能为负数' }
      ],
      img: [
        { required: true, message: '请上传商品图片', trigger: 'blur' }
      ]
    }
  }

  // 分页查询
  async all(params: MallQueryParams) {
    try {
      const res = await request({
        url: '/api/admin/prod/get/page',
        method: 'get',
        params: {
          pageNum: params.pageNum,
          pageSize: params.pageSize,
          title: params.title || null,
          point: params.point || null
        }
      })
      
      return {
        data: res.data?.rows || [],
        total: res.data?.count || 0
      }
    } catch (e) {
      ElMessage.error('获取商品列表失败')
      return { data: [], total: 0 }
    }
  }

  // 统一保存方法
  async save(obj: MallModel) {
    try {
      const method = 'post'
      const url = 'api/admin/prod/save'
      
      const { id, ...payload } = obj
      await request({
        url,
        method,
        data: payload
      })
      
      ElMessage.success(obj.id ? '修改成功' : '新增成功')
      return true
    } catch (e) {
      ElMessage.error('操作失败')
      throw e
    }
  }



  // 兼容原有API
  async add(obj: MallModel) {
    return this.save(obj)
  }

  async edit(obj: MallModel) {
    return this.save(obj)
  }
}