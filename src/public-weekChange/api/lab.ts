import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http

/** 模型 */

export interface LabModel {
  bindUserList?: string[
   
  ] // 绑定人列表
  createdAt?: string // 创建时间
  deleted?: boolean // 删除
  deviceCount?: number // 设备数
  id?: number // id
  name?: string // 名称
  remark?: string // 备注
  updatedAt?: string // 更新时间
  adminIdList?: string[] // 绑定人id列表

}

/** 搜索条件 */
export interface LabQueryParmas extends BasicQueryParams {
  bindUserName?: string // 绑定的用户名称
  labName?: string // 实验室名称
}

/** 数据源，增删查改等请求 */
export default class LabQuery extends Queryable<LabModel, LabQueryParmas> {
  // 可设置父ID，例如查询用户下的全部文章
  // constructor(id) {
  //     super();
  //     this.id = id;
  // }

  /** 对象名称 */
  get objectName(): string {
    return '实验室'
  }

  // 默认的内容
  get defaultObject():  Partial<LabModel> {
    return {
   
      
    }
  }

  // 读取正在输入的数据，用于表单校验
  _valueGetter: () => Partial<LabModel> = () => ({})

  // 已输入的数据的Getter
  get currentEditRow(): Partial<LabModel> {
    return this._valueGetter()
  }

  // 表单规则
  get rules() {
    return {
      name: [
        { required: true, message: '请输入实验室名称', trigger: 'blur' },
        { min: 1, max: 100, message: '实验室名称长度在 1 到 100 个字符', trigger: 'blur' },
      ],
      remark: [
        { required: true, message: '请输入实验室备注', trigger: 'blur' },
        { min: 1, max: 200, message: '实验室备注长度在 1 到 200 个字符', trigger: 'blur' },
      ],
      adminIdList: [
        { required: true, message: '请选择实验室管理员', trigger: 'blur' },
      ],
    }
  }

// 查询全部
async all(params: LabQueryParmas) {
  console.log("查询全部", params);
  let res = await request({
    url: `/api/admin/lab/select/page`,
    method: 'get',
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      bindUserName: params.bindUserName || null,
      labName: params.labName || null
    }
  });

  res.data.rows = res.data.rows.map(element => {
    // 检查 bindUserDtoList 是否存在并且是一个数组
    if (Array.isArray(element.bindUserDtoList) && element.bindUserDtoList.length > 0) {
      element.adminIdList = element.bindUserDtoList.map(item => item.id);
      element.bindUserList = element.bindUserDtoList.map(item => item.name);
    } else {
      element.adminIdList = [];
      element.bindUserList = [];
    }
    return element;
  });

  if (res.data.count === undefined) return res.data;
  return {
    data: res.data.rows,
    total: res.data.count
  };
}

  // 上传修改
  async edit(obj: LabModel) {
    console.log("修改", obj);
    obj = Object.assign({}, obj);
    let id = obj.id;
    delete obj.id;
    return request({
      url: `api/admin/lab/update/${id}`,
      method: "put",
      data: {
        adminList:obj.adminIdList,
        name: obj.name,
        remark: obj.remark,
      },
    });
  }

  // 添加
  async add(obj: LabModel) {
    delete obj.id;
    return request({
      url: "api/admin/lab/insert",
      method: "post",
      data: {
        adminList:obj.adminIdList,
        name: obj.name,
        remark: obj.remark,
      },
    });
  }

  // // 通过id删除
  // async deleteObj(obj: LabModel) {
  //   return request({
  //     url: `/api/hospital/Lab/${obj.id}`,
  //     method: "delete",
  //   });
  // }
}
