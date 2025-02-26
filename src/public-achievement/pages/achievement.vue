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
    <el-table :data="tb.list" element-loading-text="Loading" fit highlight-current-row border align="center" style="width: 100%; overflow-x: auto">
      <!-- ID列 -->
      <el-table-column prop="id" label="ID" align="center" width="80" />
      <!-- 用户名称列 -->
      <el-table-column prop="userName" label="用户名称" align="center" />
      <!-- 用户账号列 -->
      <el-table-column prop="userPhone" label="用户手机号" align="center" />

      <el-table-column prop="taskDays" label="当日步数" align="center">
        <template #default="scope">
          <span>{{ scope.row.steps }}</span>
        </template>
      </el-table-column>

      <!-- ��计步数 -->
      <el-table-column prop="taskDays" label="累计步数" align="center">
        <template #default="scope">
          <span>{{ scope.row.totalSteps }}</span>
        </template>
      </el-table-column>

      <!-- 完成任务天数 -->
      <el-table-column prop="taskDays" label="完成任务次数" align="center">
        <template #default="scope">
          <span>{{ scope.row.taskDays }} 天</span>
        </template>
      </el-table-column>

      <!-- 完成每周挑战天数 -->
      <el-table-column prop="challengeDays" label="完成每周挑战次数" align="center">
        <template #default="scope">
          <span>{{ scope.row.challengeDays }} 天</span>
        </template>
      </el-table-column>

      <!-- 积分变化情况 -->
      <el-table-column prop="pointsChange" label="本周积分变化情况记录" align="center" width="400">
        <template #default="scope">
          <el-popover placement="right" :width="400" trigger="hover">
            <template #reference>
              <el-button type="primary" size="small">查看详情</el-button>
            </template>
            <el-table :data="scope.row.pointsChange" style="width: 100%">
              <el-table-column property="day" label="日期" width="80" />
              <el-table-column property="type" label="类型" width="180" />
              <el-table-column property="points" label="积分变化" width="100">
                <template #default="{ row }">
                  <span :class="{ 'success-text': row.points > 0, 'danger-text': row.points < 0 }">
                    {{ row.points > 0 ? '+' : '' }}{{ row.points }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-popover>
          <div>
            总积分变化：
            <span :class="{ 'success-text': getTotalPoints(scope.row.pointsChange) > 0, 'danger-text': getTotalPoints(scope.row.pointsChange) < 0 }">
              {{ getTotalPoints(scope.row.pointsChange) > 0 ? '+' : '' }}{{ getTotalPoints(scope.row.pointsChange) }}
            </span>
          </div>
        </template>
      </el-table-column>

      <!-- ��作列 -->
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button type="text" @click="() => openStep()">上传每日步数</el-button>
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
    userName: '张三',
    userPhone: '13800138001',
    taskDays: 20,
    challengeDays: 15,
    pointsChange: [
      { day: '周一', type: '默认发放', points: 100 },
      { day: '周二', type: '均完成任务', points: 10 },
      { day: '周三', type: '自己没有完成任务', points: -10 },
      { day: '周四', type: '组队队友未完成任务', points: -10 },
      { day: '周五', type: '完成每周挑战', points: 20 },
      { day: '周六', type: '均完成任务', points: 10 },
      { day: '周日', type: '均完成任务', points: 10 }
    ],
    steps: 3000,
    totalSteps: 4500
  },
  {
    id: 2,
    userName: '李四',
    userPhone: '13900139002',
    taskDays: 15,
    challengeDays: 10,
    pointsChange: [
      { day: '周一', type: '默认发放', points: 100 },
      { day: '周二', type: '均完成任务', points: 10 },
      { day: '周三', type: '均完成任务', points: 10 },
      { day: '周四', type: '自己没有完成任务', points: -10 },
      { day: '周五', type: '组队队友未完成任务', points: -10 },
      { day: '周六', type: '完成每周挑战', points: 20 },
      { day: '周日', type: '均完成任务', points: 10 }
    ],
    steps: 1000,
    totalSteps: 1500
  },
  {
    id: 3,
    userName: '王五',
    userPhone: '13700137003',
    taskDays: 30,
    challengeDays: 20,
    pointsChange: [
      { day: '周一', type: '默认发放', points: 100 },
      { day: '周二', type: '完成每周挑战', points: 20 },
      { day: '周三', type: '均完成任务', points: 10 },
      { day: '周四', type: '均完成任务', points: 10 },
      { day: '周五', type: '均完成任务', points: 10 },
      { day: '周六', type: '自己没有完成任务', points: -10 },
      { day: '周日', type: '组队队友未完成任务', points: -10 }
    ],
    steps: 2000,
    totalSteps: 2500
  },
  {
    id: 4,
    userName: '赵六',
    userPhone: '13600136004',
    taskDays: 25,
    challengeDays: 18,
    pointsChange: [
      { day: '周一', type: '默认发放', points: 100 },
      { day: '周二', type: '自己没有完成任务', points: -10 },
      { day: '周三', type: '组队队友未完成任务', points: -10 },
      { day: '周四', type: '均完成任务', points: 10 },
      { day: '周五', type: '完成每周挑战', points: 20 },
      { day: '周六', type: '均完成任务', points: 10 },
      { day: '周日', type: '均完成任务', points: 10 }
    ],
    steps: 1000,
    totalSteps: 1500
  },
  {
    id: 5,
    userName: '钱七',
    userPhone: '13500135005',
    taskDays: 28,
    challengeDays: 22,
    pointsChange: [
      { day: '周一', type: '默认发放', points: 100 },
      { day: '周二', type: '均完成任务', points: 10 },
      { day: '周三', type: '完成每周挑战', points: 20 },
      { day: '周四', type: '均完成任务', points: 10 },
      { day: '周五', type: '均完成任务', points: 10 },
      { day: '周六', type: '均完成任务', points: 10 },
      { day: '周日', type: '均完成任务', points: 10 }
    ],
    steps: 2000,
    totalSteps: 1500
  }
]

const getTotalPoints = (pointsChange: any[]) => {
  return pointsChange.reduce((total, change) => total + change.points, 0)
}

const stepRef = ref(null)
const openStep = () => {
  stepRef.value?.showModal()
}

tb.total = tb.list.length
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
