<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.account"
        clearable
        placeholder="请输入反馈人姓名"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>账号</template>
      </el-input>

      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.phone"
        clearable
        placeholder="请输入反馈人电话"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>电话</template>
      </el-input>

      <div style="display: flex; flex: 1; justify-content: flex-end">
        <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">添加</el-button>
      </div>
    </div>
    <el-table
      v-loading="tb.listLoading"
      :data="tb.list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      border
      align="center"
      style="width: 100%; overflow-x: auto">
      <el-table-column prop="id" label="ID" align="center" width="80">
        <template #default="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column prop="content" label="意见反馈内容" align="center" min-width="200">
        <template #default="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column prop="userInfo" label="反馈人信息" align="center" width="200">
        <template #default="scope">
          {{ scope.row.userInfo }}
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

    <!-- 添加/删除数据的弹窗 -->
    <el-dialog v-model="tb.addDialogVisible" :title="actions.dialogTitle" width="620px" @closed="tb.isNew = false">
      <el-form
        ref="editPwdRef"
        v-if="tb.addDialogVisible"
        :disabled="tb.submitLoading"
        :model="tb.row"
        :rules="tb.source.rules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="tb.row.account" clearable placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="tb.row.name" clearable placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="tb.row.password" clearable placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="tb.row.phone" clearable placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-radio-group v-model="tb.row.level">
            <el-radio label="super">维护管理员</el-radio>
            <el-radio label="common">普通管理员</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="有效日期" prop="expireDate" style="width: 100%">
          <el-date-picker
            v-model="tb.row.expireDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择到期时间"
            format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
      </el-form>

      <template #footer class="dialog-footer">
        <el-button
          type="primary"
          :loading="tb.submitLoading"
          @click="
            validateEditPwdSubmit(() => {
              actions.submit()
            })
          ">
          提交
        </el-button>
      </template>
    </el-dialog>
    <!-- 添加/审核数据的弹窗 -->
  </div>
</template>
<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import AccountQuery, { AccountModel, AccountQueryParmas } from '../../api/account'
import http from '@/config/axios'
import { FormInstance } from 'element-plus'
import { useValidate } from '@/hooks/web/useValidate'

const { request } = http

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<AccountModel, AccountQueryParmas, AccountQuery>(new AccountQuery(), {})

const [editPwdRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())

const getLevel = (level?: string): string => {
  if (level === undefined) {
    return '未知角色'
  }
  switch (level) {
    case 'super':
      return '维护管理员'
    case 'common':
      return '普通管理员'
    default:
      return '未知角色'
  }
}

tb.list = [
  {
    id: 1,
    content: '应用界面不够友好，希望能改进一下',
    userInfo: '张三 (13800138000)'
  },
  {
    id: 2,
    content: '希望能增加更多的健康知识内容',
    userInfo: '李四 (13900139000)'
  },
  {
    id: 3,
    content: '运动记录功能有时候不太准确',
    userInfo: '王五 (13700137000)'
  },
  {
    id: 4,
    content: '希望能增加社交功能，和朋友一起互动',
    userInfo: '赵六 (13600136000)'
  },
  {
    id: 5,
    content: '饮食建议功能非常实用，希望能继续完善',
    userInfo: '钱七 (13500135000)'
  }
]
</script>
