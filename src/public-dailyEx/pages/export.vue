<template>
  <el-dialog width="900px" ref="dialog" v-model="open" @close="close">
    <span>导出时间：</span>
    <el-date-picker
          value-format="YYYY-MM-DD HH:mm:ss"
          v-model="timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="actions.queryAll({ resetPage: true })" />
    <template #footer>
      <div class="foot" style="display: flex; justify-content: space-evenly; margin: 20px 0 40px 0">
        <el-button @click="open = false" size="large" style="width: 120px">关闭弹窗</el-button>
        <el-button size="large" type="primary" style="width: 120px" @click="exportExcel()">导出excel</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose, computed } from 'vue'
import http from '@/config/axios'
import { qiniuUrl } from '@/config/qiniu'
import InfoQuery, { InfoModel, InfoQueryParams } from '../api/info'
import { ElMessage } from 'element-plus'

import refTable from '@/public/basic-table'
import exportCel from '@/utils/excel'

const { request } = http

const open = ref(false)
const timeRange = ref<string[]>([])
const id = ref<number | null>(null) // 用户ID

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<InfoModel, InfoQueryParams, InfoQuery>(new InfoQuery(), {})

const showModal = (row: InfoModel) => {
  open.value = true

}

const exportExcel = async () => {
  console.log('导出excel',timeRange.value)
  if (!timeRange.value || timeRange.value.length !== 2) {
    ElMessage.error('请选择时间范围')
    return
  }

let res = await request({
    url: `api/admin/task/get/excel/list`,
    method: 'GET',
    params: {
      startTime: timeRange.value[0],
      endTime: timeRange.value[1]
    }
  })

  let mockData = res.data.map(item  => ({
  name: item.name, 
  phone: item.phone, 
  content: item.userTaskRecordList?.filter(record  => 
    record.status  === "over"
  ).map(record => 
    record.createdAt.slice(0,  10) // 截取日期部分 
  ).join(',') || '',
  count: item.userTaskRecordList?.filter(record  => 
    record.status  === "over"
  ).length || 0,

}));
  console.log('mockData', mockData)
  let headers = [ 
    { label: '姓名', value: 'name', width: 15 }, 
    { label: '手机号', value: 'phone', width: 20 }, 
    { label: '完成任务日期', value: 'content', width: 50 }, 
    { label: '完成任务数量', value: 'count', width: 20 },
  ];


 
  // 导出 Excel 
  exportCel('任务完成信息', headers, mockData, '任务完成信息'); 
 
 


}




const close = () => {}

defineExpose({
  showModal
})
</script>

<style scoped lang="less">
.all-container {
  display: flex;
  margin-top: 20px;
  width: 100%;
  padding: 0 20px 20px 20px;
}
.container {
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  height: 300px;
  overflow-y: scroll;
  padding-top: 20px;

  .info-item {
    display: flex;
    margin-bottom: 30px;

    .label {
      width: 100px;
      text-align: right;
      margin-right: 10px;
      align-items: center;
    }
    .value {
      width: 200px;
    }
  }
}

.right-container {
  display: flex;
  flex: 1;
  background-color: #f5f7fa;
  flex-direction: column;
  border-radius: 5px;
}

.separator {
  border: none;
  border-top: 1px dotted #ccc;
  margin: 10px 20px 0 0;
}

:deep(.my-label) {
  background-color: pink;
  padding: 12px;
  width: 400px;
}
</style>
