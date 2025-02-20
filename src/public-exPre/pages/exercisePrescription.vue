<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.deviceName"
        clearable
        placeholder="请输入设备名称"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>设备名称</template>
      </el-input>

      <el-select class="filter-item" v-model="tb.query.labId" clearable placeholder="请选择房间号" @change="actions.queryAll()" style="width: 320px">
        <el-option v-for="item in bindRoomOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>

      <div class="filter-item">
        <el-date-picker
          value-format="YYYY-MM-DD HH:mm:ss"
          v-model="tb.query.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="actions.queryAll({ resetPage: true })" />
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
      <!-- ID -->
      <el-table-column prop="id" label="ID" align="center">
        <template #default="scope: ElTableRow<DataModel>">
          {{ scope.row.id != null ? scope.row.id : '--' }}
        </template>
      </el-table-column>

      <!-- 设备名称 -->
      <el-table-column prop="deviceName" label="设备名称" align="center">
        <template #default="scope: ElTableRow<DataModel>">
          {{ scope.row.deviceName || '--' }}
        </template>
      </el-table-column>

      <!-- 房间号 -->
      <el-table-column prop="labName" label="房间号" align="center">
        <template #default="scope: ElTableRow<DataModel>">
          {{ scope.row.labName || '--' }}
        </template>
      </el-table-column>

      <!-- 设备使用时长 -->
      <el-table-column prop="useTime" label="设备使用时长 (小时)" align="center">
        <template #default="scope: ElTableRow<DataModel>">
          {{ scope.row.useTime != null ? scope.row.useTime : '--' }}
        </template>
      </el-table-column>

      <!-- 院内用户使用时长 -->
      <el-table-column prop="collegeUseTime" label="院内用户使用时长 (小时)" align="center">
        <template #default="scope: ElTableRow<DataModel>">
          {{ scope.row.collegeUseTime != null ? scope.row.collegeUseTime : '--' }}
        </template>
      </el-table-column>

      <!-- 校内用户使用时长 -->
      <el-table-column prop="schoolUseTime" label="校内用户使用时长 (小时)" align="center">
        <template #default="scope: ElTableRow<DataModel>">
          {{ scope.row.schoolUseTime != null ? scope.row.schoolUseTime : '--' }}
        </template>
      </el-table-column>

      <!-- 校外用户使用时长 -->
      <el-table-column prop="afterSchoolUseTime" label="校外用户使用时长 (小时)" align="center">
        <template #default="scope: ElTableRow<DataModel>">
          {{ scope.row.afterSchoolUseTime != null ? scope.row.afterSchoolUseTime : '--' }}
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
  </div>
</template>
<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { onMounted, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import DataQuery, { DataModel, DataQueryParmas } from '../api/data'
import http from '@/config/axios'
import { ElMessage } from 'element-plus'
import { time } from 'echarts'
const { request } = http

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<DataModel, DataQueryParmas, DataQuery>(new DataQuery(), {})

onMounted(() => {
  // 获取绑定房间列表
  getBindRoomList()
})
const bindRoomOptions = ref<any[]>([])
const getBindRoomList = async () => {
  const res = await request({
    url: 'api/common/select/lab/list',
    method: 'get'
  })
  bindRoomOptions.value = res.data
}
</script>
