<template>
  <div class="account">
    <div class="filter-container-flex">
      <div class="top">
        <div class="search">
          <div class="title">账号</div>
          <el-input
            class="filter-item"
            style="width: 187px"
            v-model="tb.query.account"
            placeholder="请输入账号"
            @input="actions.queryAll({ resetPage: true })" />
        </div>
        <div class="search search-name">
          <div class="title">姓名</div>
          <el-input
            class="filter-item"
            style="width: 187px"
            v-model="tb.query.name"
            placeholder="请输入姓名"
            @input="actions.queryAll({ resetPage: true })" />
        </div>
        <div class="search search-tel">
          <div class="title">手机</div>
          <el-input
            class="filter-item"
            style="width: 187px"
            v-model="tb.query.tel"
            placeholder="请输入手机"
            @input="actions.queryAll({ resetPage: true })" />
        </div>
      </div>
      <div class="bom">
        <div class="audit search">
          <div class="title">审核状态</div>
          <el-select
            class="filter-item"
            clearable
            filterable
            v-model="tb.query.checked"
            placeholder="请选择"
            @change="actions.queryAll({ resetPage: true })">
            <el-option label="未通过" :value="0" />
            <el-option label="通过" :value="1" />
            <el-option label="审核中" :value="2" />
          </el-select>
        </div>
        <div class="is-ban search">
          <div class="title">是否封禁</div>
          <el-select
            class="filter-item"
            clearable
            filterable
            v-model="tb.query.isBan"
            placeholder="请选择"
            @change="actions.queryAll({ resetPage: true })">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </div>
        <div class="search-btn" @click="actions.queryAll({ resetPage: true })">
          搜索
          <Icon :icon="AntIcon.search" :size="16" style="margin-left: 10px" />
        </div>
      </div>
    </div>
    <el-table
      class="table"
      table-layout="auto"
      v-loading="tb.listLoading"
      :data="tb.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <!-- 内容 -->
      <el-table-column label="ID" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          {{ scope.row.id || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          {{ scope.row.account || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          {{ scope.row.name || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="手机/邮箱" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          {{ scope.row.tel || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="所属学院" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          {{ scope.row.collegeId ? getCollege(scope.row.collegeId) : '学校账号' }}
        </template>
      </el-table-column>
      <el-table-column label="审核" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          <el-tag type="success" v-if="scope.row.checked === 1">{{ AuditStatus[scope.row.checked!] || '--' }}</el-tag>
          <el-tag type="danger" v-if="scope.row.checked === 0">{{ AuditStatus[scope.row.checked!] || '--' }}</el-tag>
          <el-tag type="primary" style="color: #093694" v-if="scope.row.checked === 2">{{ AuditStatus[scope.row.checked!] || '--' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否封禁" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          {{ scope.row.isBan ? '是' : '否' || '--' }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column class-name="status-col" fixed="right" label="操作" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          <div class="operation">
            <el-button text size="small" v-if="scope.row.checked === 2" @click="isShow('audit', scope.row)">审核</el-button>
            <el-button text size="small" v-if="scope.row.checked === 1" @click="isShow('edit', scope.row)">编辑</el-button>
            <el-button
              text
              type="danger"
              style="color: #d90b0b"
              v-if="scope.row.checked === 1 && !scope.row.isBan"
              size="small"
              @click="isBan('封禁', scope.row)">
              封禁
            </el-button>
            <el-button text size="small" v-if="scope.row.checked === 1 && scope.row.isBan" @click="isBan('解封', scope.row)">解封</el-button>
            <div v-if="scope.row.checked === 0">--</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 翻页 -->
    <div class="pagination-container" v-if="tb.total">
      <el-pagination
        v-model:current-page="tb.query.pageNum"
        :page-sizes="[5, 20, 30, 50, 100, 200]"
        v-model:page-size="tb.query.pageSize"
        :total="tb.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="(v: number) => actions.sizeChange(v)"
        @current-change="(v: number) => actions.pageChange(v)" />
    </div>
    <!-- 添加/编辑数据的弹窗 -->
    <el-dialog v-loading="loading" v-model="isDialog" center width="863px" @closed="tb.isNew = false">
      <div class="dialog">
        <el-form ref="formRef" :model="formData" hide-required-asterisk :rules="rules" class="demo-ruleForm">
          <div class="basic-msg">
            <div class="title">基本信息</div>
            <div class="content">
              <div class="left">
                <el-form-item label="账号" prop="account">
                  <el-input v-model="formData.account" placeholder="请输入账号" v-if="!dialogTypeBlo" />
                  <div v-else>{{ formData.account || '--' }}</div>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                  <el-input v-model="formData.tel" placeholder="请输入电话" v-if="!dialogTypeBlo" />
                  <div v-else>{{ formData.tel || '--' }}</div>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="formData.email" placeholder="请输入邮箱" v-if="!dialogTypeBlo" />
                  <div v-else>{{ formData.email || '--' }}</div>
                </el-form-item>
              </div>
              <div class="right">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="formData.name" placeholder="请输入姓名" v-if="!dialogTypeBlo" />
                  <div v-else>{{ formData.name || '--' }}</div>
                </el-form-item>
                <el-form-item label="账号类型" prop="type">
                  <el-radio-group v-model="formData.type" v-if="!dialogTypeBlo">
                    <el-radio label="college">学院账号</el-radio>
                    <el-radio label="school">学校账号</el-radio>
                  </el-radio-group>
                  <div v-else>{{ AccountTypeEnum[formData.type!] || '--' }}</div>
                </el-form-item>
                <el-form-item label="学院" prop="collegeId" v-if="formData.type === 'college'">
                  <el-select v-model="formData.collegeId" placeholder="Select" v-if="!dialogTypeBlo">
                    <el-option v-for="item in allCollege" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                  <div v-else>{{ getCollege(formData.collegeId) || '--' }}</div>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="limits">
            <div class="title">分配权限</div>
            <div class="content">
              <el-form-item prop="role">
                <el-checkbox-group v-model="formData.role">
                  <el-checkbox :label="item.label" name="type" v-for="item in allRoleList" :key="item.label">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div>
          <div class="audit" v-if="dialogTypeBlo">
            <div class="title">审核意见</div>
            <div class="content">
              <el-form-item prop="checked">
                <el-radio-group v-model="formData.checked">
                  <el-radio :label="1" size="large">通过审核</el-radio>
                  <el-radio :label="0" size="large">驳回审核</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div class="is-ban" v-if="!dialogTypeBlo">
            <div class="title">是否禁用</div>
            <el-switch v-model="formData.isBan" />
          </div>
          <div class="password" v-if="!dialogTypeBlo">
            <div class="title">重置密码</div>
            <el-input v-model="formData.password" type="password" placeholder="请输入密码" class="input-password" />
          </div>
        </el-form>
      </div>
      <template #footer>
        <el-button plain @click="close">关闭弹窗</el-button>
        <el-button type="primary" @click="submit()">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import AccountQuery, { AccountModel, AccountQueryParmas } from './api/account'
import refTable from '@/public/basic-table'
import { Icon } from '@/components/Icon'
import AntIcon from '@/assets/icons'
import { onMounted, ref, watch } from 'vue'
import { getAllCollege, getCollege } from '@/utils/getCollegeMsg'
import { AuditStatus, AccountTypeEnum } from '@/public/enum'
import { AccountDialogModel } from './model'
import http from '@/config/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
const { request } = http
/** 生命周期 */
onMounted(async () => {
  const res = await getAllCollege()
  allCollege.value = res
})
/** 加载状态 */
let loading = ref(false)
/** 所有学院 */
let allCollege = ref()
/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<AccountModel, AccountQueryParmas, AccountQuery>(new AccountQuery(), {})
/** 是否显示弹窗 */
let isDialog = ref(false)
let dialogTypeBlo = ref()
let formRef = ref()
let dialogType = ref('')
/** 弹窗表单数据 */
let formData = ref<AccountDialogModel>({})
/** 打开弹窗 */
const isShow = async (val, data) => {
  if (val === 'edit') {
    await getUserInfo(data)
  } else if (val === 'audit') {
    await getUserInfo(data)
  }
  dialogType.value = val
  isDialog.value = true
}
/** 监听属性 */
watch(dialogType, (val) => {
  if (val === 'audit') {
    dialogTypeBlo.value = true
  } else {
    dialogTypeBlo.value = false
  }
})
/** 根据用户ID获取用户信息 */
const getUserInfo = async (data) => {
  const res = await request({
    url: `/api/pc/user/manager/get/${data.id}`
  })
  formData.value = res.data
  formData.value.role = JSON.parse(res.data.role)
}
/** 自定义规则 */
const validateChecked = (rule: any, value: any, callback: any) => {
  if (value === undefined) {
    callback(new Error('请选择审核意见'))
  } else if (formData.value.checked === 2) {
    callback(new Error('请选择审核意见'))
  } else {
    callback()
  }
}
/** 表单规则 */
const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  tel: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  type: [{ required: true, message: '请选择账号权限', trigger: 'blur' }],
  collegeId: [{ required: true, message: '请选择学院', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  checked: [{ validator: validateChecked, trigger: 'blur' }],
  role: [{ required: true, message: '请选择账号权限', trigger: 'blur' }]
}
/** 保存按钮 */
const submit = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  /** 编辑 */
  if (dialogType.value === 'edit') {
    try {
      request({
        url: `/api/pc/user/manager/update/${formData.value.id}`,
        method: 'put',
        data: formData.value
      })
      loading.value = false
      ElMessage.success('保存成功')
    } catch (error) {
      loading.value = false
      ElMessage.error('保存失败')
    }
    /** 审核 */
  } else if (dialogType.value === 'audit') {
    try {
      const userId = formData.value.id
      const res = await request({
        url: `/api/pc/user/manager/check/${userId}`,
        method: 'put',
        data: {
          checked: formData.value.checked,
          role: formData.value.role
        }
      })
      loading.value = false
      ElMessage.success('保存成功')
    } catch (error) {
      loading.value = false
      ElMessage.error('保存失败')
    }
  }
  actions.queryAll({ resetPage: true })
  close()
}
/** 关闭弹窗 */
const close = () => {
  isDialog.value = false
  formRef.value.resetFields()
}
/** 解封/封禁按钮 */
const isBan = (val, data) => {
  ElMessageBox.confirm(`确定${val}该账号吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const isBan = val === '封禁' ? true : false
    const userId = data.id
    const res = await request({
      url: `/api/pc/user/manager/ban/${userId}`,
      method: 'put',
      params: {
        isBan
      }
    })
    actions.queryAll()
    ElMessage({
      type: 'success',
      message: '操作成功!'
    })
  })
}
/** 所有权限 */
const allRoleList = ref([
  {
    label: 'college_reporter',
    name: '学院记者'
  },
  {
    label: 'school_reporter',
    name: '学校记者'
  },
  {
    label: 'college_teacher',
    name: '学院老师'
  },
  {
    label: 'school_teacher',
    name: '宣传部老师'
  },
  {
    label: 'college_leader',
    name: '学院领导'
  },
  {
    label: 'school_leader',
    name: '宣传部领导'
  }
])
</script>

<style lang="less" scoped>
.account {
  .filter-container-flex {
    margin-bottom: 28px;
    .search {
      display: flex;
      align-items: center;
      .title {
        margin-right: 20px;
        color: #6a6a6a;
      }
    }
    .top {
      display: flex;

      .search-name {
        margin: 0 22px;
      }
    }
    .bom {
      display: flex;
      margin-top: 15px;
      .audit {
        margin-right: 20px;
      }
      .search-btn {
        cursor: pointer; //悬浮时变手指
        width: 72px;
        height: 30px;
        border-radius: 4px;
        background-color: rgba(148, 9, 64, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 12px;
        margin-left: 20px;
      }
    }
  }
  .table {
    .operation {
      :deep(.el-button) {
        color: #2a71e6;
      }
    }
  }
  .pagination-container {
    margin-top: 28px;
  }
  .dialog {
    padding: 0 60px;
    .basic-msg {
      .content {
        .left {
          margin-right: 22px;
        }
      }
    }
    .limits {
      margin-top: 20px;
    }
    .audit {
      margin-top: 20px;
    }
    .is-ban {
      display: flex;
      align-items: center;
      margin-top: 30px;
      .title {
        margin-right: 20px;
      }
    }
    .title {
      color: #101010;
      font-size: 14px;
    }
    .password {
      display: flex;
      align-items: center;
      margin-top: 30px;
      .input-password {
        width: 200px;
        margin-left: 20px;
      }
    }
    .content {
      padding: 10px 0 0 56px;
      display: flex;
    }
  }
}
</style>
