<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.name"
        clearable
        placeholder="请输入用户名称"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>用户名称</template>
      </el-input>
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.phone"
        clearable
        placeholder="请输入用户手机号"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>用户手机号</template>
      </el-input>
    </div>
    <el-table :data="tb.list" element-loading-text="Loading" fit highlight-current-row border align="center" style="width: 100%; overflow-x: auto">
      <!-- ID列 -->
      <el-table-column prop="userId" label="ID" align="center" width="80" />
      <!-- 用户名称列 -->
      <el-table-column prop="name" label="用户名称" align="center" />
      <!-- 用户账号列 -->
      <el-table-column prop="phone" label="用户手机号" align="center" />

      <el-table-column prop="todayStep" label="当日步数" align="center">
        <template #default="scope">
          <span>{{ scope.row.todayStep }}</span>
        </template>
      </el-table-column>

      <!-- ��计步数 -->
      <el-table-column prop="totalStep" label="累计步数" align="center">
        <template #default="scope">
          <span>{{ scope.row.totalStep }}</span>
        </template>
      </el-table-column>

      <!-- 完成任务天数 -->
      <el-table-column prop="overTaskCount" label="完成任务次数" align="center">
        <template #default="scope">
          <span>{{ scope.row.overTaskCount }} 天</span>
        </template>
      </el-table-column>

      <!-- 完成每周挑战天数 -->
      <el-table-column prop="overChallengeCount" label="完成每周挑战次数" align="center">
        <template #default="scope">
          <span>{{ scope.row.overChallengeCount }} </span>
        </template>
      </el-table-column>

      <!-- 积分变化情况 -->
      <el-table-column prop="pointsChange" label="本周积分变化情况记录" align="center" width="400">
        <template #default="scope">
          <el-popover placement="right" :width="400" trigger="hover">
            <template #reference>
              <el-button type="primary" size="small">查看详情</el-button>
            </template>
            <!-- <el-table :data="scope.row.pointsChange" style="width: 100%">
              <el-table-column property="day" label="日期" width="80" />
              <el-table-column property="type" label="类型" width="180" />
              <el-table-column property="points" label="积分变化" width="100">
                <template #default="{ row }">
                  <span :class="{ 'success-text': row.points > 0, 'danger-text': row.points < 0 }">
                    {{ row.points > 0 ? '+' : '' }}{{ row.points }}
                  </span>
                </template>
              </el-table-column>
            </el-table> -->
          </el-popover>
          <div>
            总积分变化：
            <!-- <span :class="{ 'success-text': getTotalPoints(scope.row.pointsChange) > 0, 'danger-text': getTotalPoints(scope.row.pointsChange) < 0 }">
              {{ getTotalPoints(scope.row.pointsChange) > 0 ? '+' : '' }}{{ getTotalPoints(scope.row.pointsChange) }}
            </span> -->
          </div>
        </template>
      </el-table-column>

      <!-- ��作列 -->
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button type="text" @click="() => openStep(scope.row)">上传每日步数</el-button>
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
  <!-- 编辑对话框 -->
  <Step @close="actions.queryAll()" ref="stepRef"></Step>
</template>

<script lang="ts" setup>
import Step from './steps.vue'
import refTable from '@/public/basic-table'
import { ref, onMounted } from 'vue'
import AchQuery, { AchModel, AchQueryParmas } from '../api/ach'
import http from '@/config/axios'
import { ElMessage } from 'element-plus'
import { FormInstance } from 'element-plus'
import { useValidate } from '@/hooks/web/useValidate'
import { useRouter } from 'vue-router'

const { request } = http
const [editPwdRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())
const { push } = useRouter()

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<AchModel, AchQueryParmas, AchQuery>(new AchQuery(), {})

// 模拟数据



const getTotalPoints = (pointsChange: any[]) => {
  return pointsChange.reduce((total, change) => total + change.points, 0)
}

const stepRef = ref(null)
const openStep = (row) => {
  stepRef.value?.showModal(row)
}

tb.total = tb.list.length
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
