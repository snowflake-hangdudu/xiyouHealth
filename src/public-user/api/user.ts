import Queryable, { BasicQueryParams } from '@/public/queryable'
import http from '@/config/axios'
const { request } = http

/** 用户对象模型 */
export interface UserModel {
avatar?: string; // 头像
createdAt?: string; // 创建时间
deleted?: boolean; // 是否删除
id?: number;
isChallenge?: boolean; // 周挑战资格
isJourney?: boolean; // 旅程状态
isShowVideo?: boolean; // 视频展示
isTeam?: boolean; // 组队状态
isUnlockTask?: boolean; // 任务解锁
name?: string; // 姓名
password?: string;
phone?: string; // 手机号
totalCheckPoint?: number; // 累计难数
totalPoint?: number; // 累计积分
updatedAt?: string; // 更新时间
}

/** 查询参数 */
export interface UserQueryParams extends BasicQueryParams {
name?: string; // 姓名查询
phone?: string; // 手机号查询
}

/** 用户数据源类 */
export default class UserQuery extends Queryable<UserModel, UserQueryParams> {
// 基础配置
get objectName(): string {
return '用户'
}

get defaultObject(): Partial<UserModel> {
return {
isChallenge: false,
isJourney: false,
isShowVideo: true,
isTeam: false,
isUnlockTask: false
}
}

_valueGetter: () => Partial<UserModel> = () => ({})

get currentEditRow(): Partial<UserModel> {
return this._valueGetter()
}

// 校验规则
get rules() {
return {
name: [{ required: true, message: '请输入姓名' }],
phone: [
{ required: true, message: '请输入手机号' },
{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
]
}
}

/** 分页查询 */
async all(params: UserQueryParams) {
try {
const res = await request({
url: 'api/admin/user/get/page',
method: 'get',
params: {
pageNum: params.pageNum || 1,
pageSize: params.pageSize || 10,
name: params.name || null,
phone: params.phone || null
}
})

if (res.data?.code !== 0) {
throw new Error(res.data?.msg || '请求失败')
}

return {
data: res.data.data?.rows || [],
total: res.data.data?.count || 0
}
} catch (error) {
console.error('[UserQuery] 分页查询失败:', error)
throw new Error()
}
}

}