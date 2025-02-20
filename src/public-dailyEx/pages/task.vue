<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.name"
        clearable
        placeholder="请输入学院名称"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>学院</template>
      </el-input>

      <div style="display: flex; flex: 1; justify-content: flex-end">
        <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">新建运动任务</el-button>
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
        <template #default="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="标题" align="center">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column prop="content" label="内容" align="center">
        <template #default="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column prop="participants" label="完成任务人员信息（包含上传的图片）" align="center">
        <template #default="scope">
          <el-button @click="actions.edit(scope.row)" link type="primary">查看详情</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="participants" label="未完成任务人员信息" align="center">
        <template #default="scope">
          <el-button @click="actions.edit(scope.row)" link type="primary">查看详情</el-button>
        </template>
      </el-table-column>

      <el-table-column label="上/下架" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isBan"
            @change="
              () =>
                tb.source.edit(scope.row).then(() => {
                  ElMessage.success('修改成功')
                  actions.queryAll()
                })
            " />
        </template>
      </el-table-column>

      <el-table-column prop="createdAt" label="显示日期" align="center">
        <template #default="scope">
          {{ scope.row.createdAt }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope">
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
        <el-form-item label="标题" prop="name">
          <el-input v-model="tb.row.name" clearable placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="tb.row.content" clearable placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="上/下架" prop="isBan">
          <el-switch v-model="tb.row.isBan" />
        </el-form-item>
        <el-form-item label="显示日期" prop="expireDate" style="width: 100%">
          <el-date-picker
            v-model="tb.row.expireDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择时间"
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
  </div>
</template>

<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import CollegeQuery, { CollegeModel, CollegeQueryParmas } from '../api/college'
import http from '@/config/axios'
import { ElMessage } from 'element-plus'
import { FormInstance, FormRules } from 'element-plus'
import { useValidate } from '@/hooks/web/useValidate'

const [editPwdRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())
const { request } = http

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<CollegeModel, CollegeQueryParmas, CollegeQuery>(new CollegeQuery(), {})

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

// 模拟 `tb.total` 和 `tb.query`
tb.total = tb.list.length
tb.query.pageNum = 1
tb.query.pageSize = 10
</script>
