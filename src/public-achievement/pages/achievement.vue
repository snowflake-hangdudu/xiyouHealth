<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.userName"
        clearable
        placeholder="请输入用户名称"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>用户名称</template>
      </el-input>
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.userAccount"
        clearable
        placeholder="请输入用户账号"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>用户账号</template>
      </el-input>
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
      <!-- ID列 -->
      <el-table-column prop="id" label="ID" align="center" width="80" />

      <!-- 完成任务天数 -->
      <el-table-column prop="taskDays" label="完成任务天数" align="center">
        <template #default="scope">
          <span>{{ scope.row.taskDays }} 天</span>
        </template>
      </el-table-column>

      <!-- 完成每周挑战天数 -->
      <el-table-column prop="challengeDays" label="完成每周挑战天数" align="center">
        <template #default="scope">
          <span>{{ scope.row.challengeDays }} 天</span>
        </template>
      </el-table-column>

      <!-- 积分变化情况 -->
      <el-table-column prop="pointsChange" label="积分变化情况记录，要有类型，什么类型加积分，什么类型扣积分" align="center">
        <template #default="scope">
          <span :class="{ 'success-text': scope.row.pointsChange > 0, 'danger-text': scope.row.pointsChange < 0 }">
            {{ scope.row.pointsChange > 0 ? '+' : '' }}{{ scope.row.pointsChange }}
          </span>
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
  </div>
</template>

<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { ref, onMounted } from 'vue'
import TopicQuery, { TopicModel, TopicQueryParmas } from '../api/topic'
import http from '@/config/axios'
import { ElMessage } from 'element-plus'
import { FormInstance } from 'element-plus'
import { useValidate } from '@/hooks/web/useValidate'
import { useRouter } from 'vue-router'

const { request } = http
const [editPwdRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())
const { push } = useRouter()

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<TopicModel, TopicQueryParmas, TopicQuery>(new TopicQuery(), {})

// 模拟数据

tb.list = [
  {
    id: 1,
    taskDays: 20,
    challengeDays: 15,
    pointsChange: 100
  },
  {
    id: 2,
    taskDays: 15,
    challengeDays: 10,
    pointsChange: -50
  },
  {
    id: 3,
    taskDays: 30,
    challengeDays: 20,
    pointsChange: 200
  },
  {
    id: 4,
    taskDays: 25,
    challengeDays: 18,
    pointsChange: -30
  },
  {
    id: 5,
    taskDays: 10,
    challengeDays: 8,
    pointsChange: 150
  }
]

tb.total = tb.list.length
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
