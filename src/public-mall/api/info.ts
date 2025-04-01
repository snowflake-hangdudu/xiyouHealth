import Queryable, { BasicQueryParams } from '@/public/queryable'; 
import http from '@/config/axios'; 
import { ElMessage } from 'element-plus'; 
const { request } = http; 
 
/** 健康信息模型 */ 
export interface InfoModel { 
  name: string; // 名字 
  phone: string; // 手机号 
  point:number; // 积分
  userId: number; // 用户id
  createdAt: string; // 创建时间
} 
 
/** 搜索条件 */ 
export interface InfoQueryParams extends BasicQueryParams { 
  prodId?: number; // 新增记录id参数 
} 
 

 

 
/** 健康信息数据源 */ 
export default class InfoQuery extends Queryable<InfoModel, InfoQueryParams> { 
  /** 对象名称 */ 
  get objectName(): string { 
    return '兑换信息'; 
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
      url: `api/admin/prod/get/user/page`, 
      method: 'get', 
      params: { 
        pageNum: params.pageNum,  
        pageSize: params.pageSize,  
        prodId: params.prodId ||0
      } 
    }); 
    console.log(res.data,'res.data');
 
 
    return { 
      data: res.data.rows,  
      total: res.data.count  
    }; 
  } 
 
  
} 