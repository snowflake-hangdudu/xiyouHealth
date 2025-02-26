<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <!-- 保持原有的 el-input，不需要更改 -->
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.studentName"
        clearable
        placeholder="请输入预约人姓名"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>预约人姓名</template>
      </el-input>

      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.studentPhone"
        clearable
        placeholder="请输入预约人电话"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>预约人电话</template>
      </el-input>

      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.deviceCode"
        clearable
        placeholder="请输入设备编号"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>设备编号</template>
      </el-input>

      <!-- 将标签和 el-select 包裹在一起 -->
      <div class="filter-item" style="display: flex; align-items: center; width: 320px">
        <div class="filter-label">实验室：</div>
        <el-select v-model="tb.query.labId" clearable placeholder="请选择实验室" @change="actions.queryAll()" style="flex: 1">
          <el-option v-for="item in bindRoomOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>

      <div class="filter-item" style="display: flex; align-items: center; width: 320px">
        <div class="filter-label">管理员：</div>
        <el-select v-model="tb.query.adminId" clearable placeholder="请选择管理员" @change="actions.queryAll()" style="flex: 1">
          <el-option v-for="item in bindAdminOptions.filter((item) => item.name)" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>

      <div class="filter-item" style="display: flex; align-items: center; width: 320px">
        <div class="filter-label">审核状态：</div>
        <el-select v-model="tb.query.status" clearable placeholder="请选择预约状态" @change="actions.queryAll()" style="flex: 1">
          <el-option label="导师待审核" value="teacher_un_check"></el-option>
          <el-option label="管理员待审核" value="admin_uncheck"></el-option>
          <el-option label="审核成功" value="success"></el-option>
          <el-option label="审核失败" value="fail"></el-option>
        </el-select>
      </div>
    </div>

    <el-table :data="tb.list" element-loading-text="Loading" fit highlight-current-row border align="center" style="width: 100%; overflow-x: auto">
      <el-table-column prop="id" label="ID" align="center">
        <template #default="scope: ElTableRow<BookModel>">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column prop="userName" label="预约人" align="center">
        <template #default="scope: ElTableRow<BookModel>">
          <div class="info" style="display: flex; flex-direction: column">
            <div>{{ scope.row.studentName }}</div>
            <div>{{ scope.row.studentPhone }}</div>
            <div>{{ getUserType(scope.row.studentRole) }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="teacherGroupId" label="课题组" align="center">
        <template #default="scope: ElTableRow<BookModel>">
          {{ scope.row.groupName }}
        </template>
      </el-table-column>

      <el-table-column prop="deviceId" label="设备信息" align="center">
        <template #default="scope: ElTableRow<BookModel>">{{ scope.row.device?.name }}{{ '(编号:' + scope.row.deviceCode + ')' }}</template>
      </el-table-column>

      <el-table-column prop="roomId" label="实验室名称" align="center">
        <template #default="scope: ElTableRow<BookModel>">
          {{ scope.row.labName }}
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="预约时间" align="center" width="300">
        <template #default="scope: ElTableRow<BookModel>">
          <div style="display: flex; flex-direction: column">
            <div v-if="isValidJson(scope.row.reservationTimeJson)">
              {{
                JSON.parse(scope.row.reservationTimeJson)
                  .map((time) => formatTimeRange(time))
                  .join(', ')
              }}
            </div>
            <span v-else>时间错误</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="预约状态" align="center">
        <template #default="scope: ElTableRow<BookModel>">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatus(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="adminName" label="设备绑定管理员" align="center">
        <template #default="scope: ElTableRow<BookModel>">
          {{ (scope.row.deviceAdminNameList ?? []).join(',') }}
        </template>
      </el-table-column>

      <el-table-column prop="roomAdminName" label="实验室管理员" align="center">
        <template #default="scope: ElTableRow<BookModel>">
          {{ (scope.row.labAdminNameList ?? []).join(',') }}
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="备注" align="center">
        <template #default="scope: ElTableRow<BookModel>">
          {{ scope.row.remark }}
        </template>
      </el-table-column>

      <el-table-column prop="id" label="操作" align="center">
        <template #default="scope: ElTableRow<BookModel>">
          <!-- Your operation buttons or links here -->
          <el-button size="small" type="text" @click="openRemark(scope.row)">备注</el-button>
          <el-button size="small" type="text" @click="openReview(scope.row)" v-if="scope.row.status == 'admin_uncheck'">审核</el-button>
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

import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import BookQuery, { BookModel, BookQueryParmas } from '../api/book'
import http from '@/config/axios'

import { onMounted } from 'vue'
const { request } = http

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<BookModel, BookQueryParmas, BookQuery>(new BookQuery(), {})

onMounted(() => {
  getBindRoomList()
  getBindAdminList()
})
const bindAdminOptions = ref<any[]>([]) // 管理员
const bindRoomOptions = ref<any[]>([]) // 房间号
const remarkRef = ref<any>(null)
const reviewRef = ref<any>(null)

const openRemark = (row: BookModel) => {
  console.log(remarkRef.value, 'remarkRef')
  remarkRef.value.showModal(row)
}

const openReview = (row: BookModel) => {
  reviewRef.value.showModal(row)
}

const getBindRoomList = async () => {
  const res = await request({
    url: 'api/common/select/lab/list',
    method: 'get'
  })
  bindRoomOptions.value = res.data
}

const getBindAdminList = async () => {
  const res = await request({
    url: 'api/common/select/admin/list',
    method: 'get'
  })
  bindAdminOptions.value = res.data
}

const getUserType = (role: string | undefined) => {
  switch (role) {
    case 'college':
      return '院内用户'
    case 'school':
      return '校内院外用户'
    case 'after_school':
      return '校外用户'
    default:
      return '--'
  }
}

const isValidJson = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

function formatTimeRange(startTimeStr) {
  const startTime = new Date(startTimeStr)
  const endTime = new Date(startTime)

  // Adjust the dates as per your logic
  // If start time is after 15:00, set end time to next day at 13:59
  if (startTime.getHours() >= 15) {
    endTime.setDate(endTime.getDate() + 1) // Next day
  } else {
    // Keep the same day or adjust accordingly
    endTime.setDate(endTime.getDate())
  }
  endTime.setHours(13, 59, 0, 0) // Set end time to 13:59

  const formattedStart = formatDateTime(startTime)
  const formattedEnd = formatDateTime(endTime)

  return `${formattedStart} 至 ${formattedEnd}`
}

function formatDateTime(date) {
  const Y = date.getFullYear()
  const M = String(date.getMonth() + 1).padStart(2, '0')
  const D = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${Y}-${M}-${D} ${h}:${m}`
}

const getStatus = (status: string | undefined) => {
  switch (status) {
    case 'teacher_un_check':
      return '导师待审核'
    case 'admin_uncheck':
      return '管理员待审核'
    case 'success':
      return '审核成功'
    case 'fail':
      return '审核失败'
    default:
      return '--'
  }
}

const getStatusType = (status: string | undefined) => {
  switch (status) {
    case 'teacher_un_check':
      return 'info'
    case 'admin_uncheck':
      return 'warning'
    case 'success':
      return 'success'
    case 'fail':
      return 'danger'
    default:
      return ''
  }
}
</script>
