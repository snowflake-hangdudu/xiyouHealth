<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.labName"
        clearable
        placeholder="请输入实验室名称"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>实验室名称</template>
      </el-input>

      <el-select
        class="filter-item"
        v-model="tb.query.bindUserName"
        clearable
        placeholder="实验室管理员"
        @change="actions.queryAll()"
        style="width: 320px">
        <el-option
          v-for="item in bindUserOptions.filter((item) => item.name)"
          :key="item.id"
          :label="item.name || '该账号无姓名'"
          :value="item.name" />
      </el-select>
      <div style="display: flex; flex: 1; justify-content: flex-end">
        <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">新建每周挑战</el-button>
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
      <el-table-column prop="id" label="ID" align="center">
        <template #default="scope: ElTableRow<LabModel>">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column prop="LabName" label="标题" align="center">
        <template #default="scope: ElTableRow<LabModel>">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="挑战内容" align="center">
        <template #default="scope: ElTableRow<LabModel>">
          {{ scope.row.remark }}
        </template>
      </el-table-column>

      <el-table-column prop="mobile" label="显示列表" align="center">
        <template #default="scope: ElTableRow<LabModel>">
          {{ scope.row.bindUserList ? scope.row.bindUserList.join(',') : '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="deviceCount" label="完成挑战人信息（包含上传的图片）" align="center">
        <template #default="scope: ElTableRow<LabModel>">
          <el-button @click="actions.edit(scope.row)" link type="primary">查看详情</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="deviceCount" label="未完成挑战人信息" align="center">
        <template #default="scope: ElTableRow<LabModel>">
          <el-button @click="actions.edit(scope.row)" link type="primary">查看详情</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope: ElTableRow<LabModel>">
          <el-button type="text" @click="actions.edit(scope.row)">编辑</el-button>
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
    <!-- 添加/审核数据的弹窗 -->
    <el-dialog v-model="tb.addDialogVisible" :title="actions.dialogTitle" width="800px" @closed="tb.isNew = false">
      <el-form
        ref="editPwdRef"
        v-if="tb.addDialogVisible"
        :disabled="tb.submitLoading"
        :model="tb.row"
        :rules="tb.source.rules"
        label-position="left"
        label-width="110px"
        style="width: 600px; margin-left: 50px">
        <el-form-item label="标题" prop="name">
          <el-input v-model="tb.row.name" clearable placeholder="请输入房间名称" />
        </el-form-item>
        <div style="margin: 40px 0"></div>

        <el-form-item label="内容" prop="remark">
          <el-input type="textarea" v-model="tb.row.remark" clearable placeholder="请输入房间" :rows="4" />
        </el-form-item>

        <div style="margin: 40px 0"></div>
        <el-form-item label="显示日期" prop="expireDate" style="width: 100%">
          <el-date-picker
            v-model="tb.row.expireDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择时间"
            format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="tb.submitLoading" @click="tb.addDialogVisible = false" size="large">关闭弹窗</el-button>
          <el-button
            type="primary"
            :loading="tb.submitLoading"
            size="large"
            @click="
              validateEditPwdSubmit(() => {
                actions.submit()
              })
            ">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import LabQuery, { LabModel, LabQueryParmas } from '../api/lab'
import http from '@/config/axios'
import ElMessage from 'element-plus'
import { FormInstance, FormRules } from 'element-plus'
const { request } = http
import { useValidate } from '@/hooks/web/useValidate'
import { onMounted } from 'vue'
const [editPwdRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<LabModel, LabQueryParmas, LabQuery>(new LabQuery(), {}, {})

const bindUserOptions = ref<any[]>([])
onMounted(() => {
  getBindUserList()
})

// 模拟数据
tb.list = [
  {
    id: 1,
    name: '计算机学院',
    content: '计算机科学与技术',
    participants: '张三, 李四',
    isBan: false,
    createdAt: '2025-02-19 10:00:00'
  },
  {
    id: 2,
    name: '法学院',
    content: '法律专业',
    participants: '王五, 赵六',
    isBan: true,
    createdAt: '2025-02-18 09:30:00'
  },
  {
    id: 3,
    name: '机械工程学院',
    content: '机械工程与自动化',
    participants: '刘七, 陈八',
    isBan: false,
    createdAt: '2025-02-17 14:15:00'
  }
]

const getBindUserList = async () => {
  const res = await request({
    url: 'api/common/select/admin/list',
    method: 'get'
  })
  bindUserOptions.value = res.data
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: space-evenly;
  margin: 20px 0;
}
</style>
