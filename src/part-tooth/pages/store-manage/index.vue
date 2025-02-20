<template>
  <div class="app-container">
    <div class="filter-container-flex">
      <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">添加</el-button>
    </div>
    <el-table v-loading="tb.listLoading" :data="tb.list" element-loading-text="Loading" border fit highlight-current-row>
      <!-- 内容 -->
      <el-table-column label="ID" align="center" width="120">
        <template #default="scope: ElTableRow<StoreModel>">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="门店名称" align="center" min-width="220">
        <template #default="scope: ElTableRow<StoreModel>">
          <div style="font-size: 18px; font-weight: bold">{{ scope.row.storeName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="180">
        <template #default="scope: ElTableRow<StoreModel>">
          {{ scope.row.createdAt }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="180">
        <template #default="scope: ElTableRow<StoreModel>">
          {{ scope.row.updatedAt }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column class-name="status-col" fixed="right" label="操作" align="center" width="160">
        <template #default="scope: ElTableRow<StoreModel>">
          <el-button type="primary" size="small" @click="actions.edit(scope.row)">修改</el-button>
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
        v-if="tb.addDialogVisible"
        :disabled="tb.submitLoading"
        :model="tb.row"
        :rules="tb.source.rules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px">
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="tb.row.storeName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="手机号" prop="account" v-if="tb.isNew">
          <el-input :maxlength="11" v-model="tb.row.tel" placeholder="请输入手机号" :disabled="!tb.isNew" style="width: 240px" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="tb.isNew">
          <el-input type="password" v-model="tb.row.password" placeholder="请输入密码" :disabled="!tb.isNew" />
        </el-form-item>
        <el-form-item label="修改密码" v-if="!tb.isNew">
          <el-button type="primary" size="small" @click="pwdDialogShow(tb.row)">修改手机号/密码</el-button>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button type="primary" :loading="tb.submitLoading" @click="actions.submit()">提交</el-button>
      </template>
    </el-dialog>
    <!-- 修改密码dialog -->
    <el-dialog :close-on-click-modal="false" v-model="showPwdDialog" title="修改密码" width="600px" top="260px" @closed="pwdDialogDone">
      <el-form
        ref="editPwdRef"
        v-if="showPwdDialog"
        :disabled="tb.submitLoading"
        :model="editPwdDetails"
        :rules="editPwdRules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px">
        <el-form-item label="手机号" prop="tel">
          <el-input type="tel" v-model="editPwdDetails.tel" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="新密码" prop="pwd">
          <el-input type="password" v-model="editPwdDetails.pwd" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="pwd2">
          <el-input type="password" v-model="editPwdDetails.pwd2" placeholder="请确定新密码" />
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button type="primary" :loading="tb.submitLoading" @click="validateEditPwdSubmit(() => submitPwd())">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { Plus } from '@element-plus/icons-vue'
import StoreQuery, { StoreModel, StoreQueryParmas } from '../../api/store'
import { reactive, ref } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { useValidate } from '@/hooks/web/useValidate'

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<StoreModel, StoreQueryParmas, StoreQuery>(new StoreQuery(), {
  // 默认的搜索值
})

let showPwdDialog = ref(false)
let editPwdDetails = ref({
  tel: '',
  pwd: '',
  pwd2: ''
})

const [editPwdRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())

const editPwdRules = reactive<FormRules>({
  tel: [{ required: true, message: '必填', trigger: 'blur' }],
  pwd: [{ required: true, message: '必填', trigger: 'blur' }],
  pwd2: [{ required: true, message: '必填', trigger: 'blur' }]
})

function pwdDialogShow(row: StoreModel) {
  tb.row = row
  showPwdDialog.value = true
  editPwdDetails.value.tel = row.tel ?? ''
}

function pwdDialogDone() {
  showPwdDialog.value = false
  editPwdDetails.value = {
    tel: '',
    pwd: '',
    pwd2: ''
  }
}

function submitPwd() {
  actions.act(async () => {
    if (editPwdDetails.value.pwd !== editPwdDetails.value.pwd2) {
      throw '新密码与确认密码需相同'
    }
    console.log('row: ', tb.row.id)
    await tb.source.editPassword({
      userId: tb.row.id!,
      tel: editPwdDetails.value.tel,
      password: editPwdDetails.value.pwd
    })
    pwdDialogDone()
  })
}
</script>
