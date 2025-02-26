<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.account"
        clearable
        placeholder="请输入账号"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>账号</template>
      </el-input>

      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.phone"
        clearable
        placeholder="请输入电话"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>电话</template>
      </el-input>

      <div style="display: flex; flex: 1; justify-content: flex-end">
        <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">添加</el-button>
      </div>
    </div>
    <el-table :data="tb.list" element-loading-text="Loading" fit highlight-current-row border align="center" style="width: 100%; overflow-x: auto">
      <el-table-column prop="id" label="ID" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column prop="id" label="账号" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          {{ scope.row.account }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="姓名" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column prop="id" label="电话" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          {{ scope.row.phone }}
        </template>
      </el-table-column>

      <el-table-column prop="id" label="操作" align="center">
        <template #default="scope: ElTableRow<AccountModel>">
          <el-button type="text" @click="() => actions.edit(scope.row)">编辑</el-button>
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
    account: 'admin',
    phone: '1234567890',
    name: '腾举'
  },
  {
    id: 2,
    account: 'hangdudu',
    phone: '0987654321',
    name: '阿乐'
  },
  {
    id: 3,
    account: 'haha',
    phone: '1122334455',
    name: '佚名'
  }
]

const reviewAccount = ref<any>()
const openReviewAccount = (row) => {
  console.log('点击了没')
  reviewAccount.value.showModal(row)
}
</script>
