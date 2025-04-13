import Queryable, { BasicQueryParams } from '@/public/queryable'; 
import http from '@/config/axios'; 
import { ElMessage } from 'element-plus'; 
const { request } = http; 
 
/** 健康信息模型 */ 
export default interface InfoModel { 
 userId?: number; // 用户id
 name?: string; // 名字
 phone?: string; // 手机号
 question?: string; // 题目
  questionAnswer?: boolean; // 题目答案
  userAnswer?: boolean; // 用户答案
} 
 
/** 搜索条件 */ 
export interface InfoQueryParams extends BasicQueryParams { 
  recordId?: number; // 新增记录id参数 
  userId?: number; // 用户id
} 
 
/** 健康参与记录响应模型 */ 
export interface HealthRecordRes { 
  name: string; // 名字 
  phone: string; // 手机号 
  question: string; // 题目 
  questionAnswer: boolean; // 题目答案 
  userAnswer: boolean; // 用户答案 
  userId: number; // 用户id 
} 
 
/** 分页响应模型 */ 
interface PagingRes<T> { 
  count: number; 
  rows: T[]; 
} 
 
/** 通用响应模型 */ 
interface Response<T> { 
  code: number; 
  data: T; 
  msg: string; 
} 
 
/** 健康信息数据源 */ 
export default class InfoQuery extends Queryable<InfoModel, InfoQueryParams> { 
  /** 对象名称 */ 
  get objectName(): string { 
    return '健康信息'; 
  } 
 
  /** 默认内容 */ 
  get defaultObject(): Partial<InfoModel> { 
    return { 
  
    }; 
  } 
 
  /** 值获取器 */ 
  _valueGetter: () => Partial<InfoModel> = () => ({}); 
 
  /** 当前编辑行数据 */ 
  get currentEditRow(): Partial<InfoModel> { 
    return this._valueGetter(); 
  } 
 
  /** 表单校验规则 */ 
  get rules() { 
    return { 
    
    }; 
  } 
 
  /** 分页查询健康参与信息 */ 
  async all(params: InfoQueryParams) { 
    const res = await request({ 
      url: `api/admin/achievement/get/last/point/${params.userId}`, 
      method: 'get', 
      params: { 
        pageNum: params.pageNum,  
        pageSize: params.pageSize,  
      } 
    }); 
    console.log(res.data,'res.data');
    return { 
      data: res.data.rows,  
      total: res.data.count  
    }; 
  } 
 
  
} 