<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <div style="display: flex; flex: 1; justify-content: flex-end">
        <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">新建学习内容</el-button>
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
      <!-- ID Column -->
      <el-table-column prop="id" label="ID" align="center">
        <template #default="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <!-- Title Column -->
      <el-table-column prop="title" label="标题" align="center">
        <template #default="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <!-- Content Column -->
      <el-table-column prop="content" label="内容(视频)" align="center">
        <template #default="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column prop="content" label="相关题目(多个，题目，答案)" align="center">
        <template #default="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <!-- Author Column -->
      <el-table-column prop="isOnline" label="上/下架" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.isOnline"></el-switch>
        </template>
      </el-table-column>

      <!-- Content Column -->
      <el-table-column prop="date" label="显示日期" align="center">
        <template #default="scope">
          {{ scope.row.date }}
        </template>
      </el-table-column>

      <!-- Content Column -->
      <el-table-column prop="participantInfo" label="参与答题人信息" align="center">
        <template #default="scope">
          <el-button @click="actions.edit(scope.row)" link type="primary">查看详情</el-button>
        </template>
      </el-table-column>

      <!-- Actions Column -->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button @click="actions.edit(scope.row)" link type="primary">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-container" v-if="tb.total">
      <el-pagination
        v-model:current-page="tb.query.pageNum"
        :page-sizes="[5, 20, 30, 50, 100, 200]"
        v-model:page-size="tb.query.pageSize"
        :total="tb.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="(v) => actions.sizeChange(v)"
        @current-change="(v) => actions.pageChange(v)" />
    </div>
  </div>
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
      <el-form-item label="标题" prop="title">
        <el-input v-model="tb.row.title" clearable placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <Sin v-model="tb.row.content" folderType="video" />
      </el-form-item>

      <el-form-item label="是否下架" prop="isOnline">
        <el-switch v-model="tb.row.isOnline" />
      </el-form-item>

      <el-form-item label="显示日期" prop="date" style="width: 100%">
        <el-date-picker
          v-model="tb.row.date"
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
</template>

<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import MentorQuery, { MentorModel, MentorQueryParmas } from '../api/mentor'
import { qiniuUrl, qiniuTokenUrl, qiniuUploadUrl } from '@/config/qiniu'
import type { FormInstance } from 'element-plus'
import Sin from '@/widget/upload-qiniu/index.vue'
import { useValidate } from '@/hooks/web/useValidate'

import http from '@/config/axios'
import { ElMessage } from 'element-plus'
const { request } = http
const [editPwdRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())

const imgUrl = '/src/assets/imgs/test.jpeg'
/** Create table and related operations */
const [tb, actions] = refTable<MentorModel, MentorQueryParmas, MentorQuery>(new MentorQuery(), {})

// 模拟数据
tb.list = [
  {
    id: 1,
    title: '学习内容1',
    content: '视频地址1',
    isOnline: true,
    date: '2024-01-01 12:00:00',
    participantInfo: '一些参与信息'
  },
  {
    id: 2,
    title: '学习内容2',
    content: '视频地址2',
    isOnline: false,
    date: '2024-02-02 13:00:00',
    participantInfo: '另一些参与信息'
  }
]
</script>
