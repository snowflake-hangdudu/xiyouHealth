<template>
  <el-dialog width="900px" ref="dialog" v-model="open" @close="close">
    <div class="all-container">
      <el-table :data="LabList" element-loading-text="Loading" fit highlight-current-row border align="center" style="width: 100%; overflow-x: auto">
        <el-table-column prop="id" label="用户ID" align="center">
          <template #default="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>

        <el-table-column prop="name" label="用户姓名" align="center">
          <template #default="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column prop="phone" label="用户手机号" align="center">
          <template #default="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>

        <el-table-column prop="email" label="任务内容" align="center">
          <template #default="scope">
            {{ scope.row.qus }}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="任务状态" align="center">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" effect="light">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="上传的任务图片" align="center">
          <template #default="scope">
            <el-image :src="scope.row.email" fit="cover" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <template #footer>
      <div class="foot" style="display: flex; justify-content: space-evenly; margin: -20px 0 40px 0">
        <el-button @click="open = false" size="large" style="width: 120px">关闭弹窗</el-button>
        <el-button type="primary" @click="savemsg" size="large" style="width: 120px">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose, computed } from 'vue'

import http from '@/config/axios'
import { qiniuUrl } from '@/config/qiniu'
import LabQuery, { LabModel, LabQueryParmas } from '../../public-weekChange/api/challenge'
import { ElMessage } from 'element-plus'
import refTable from '@/public/basic-table'

const { request } = http

const open = ref(false)

const id = ref<number | null>(null) // 用户ID

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<LabModel, LabQueryParmas, LabQuery>(new LabQuery(), {})

const showModal = (row: LabModel) => {
  open.value = true
  if (row.id) {
    id.value = row.id
  } else {
    ElMessage.error('获取信息失败')
  }
}

const savemsg = async () => {
  if (!msg.value) {
    ElMessage.error('请输入消息')
    return
  }
  try {
    await request({
      url: `api/admin/message/insert`,
      method: 'POST',
      data: {
        msg: msg.value || null,
        receiveId: id.value,
        receiveType: 'student'
      }
    })
    ElMessage.success('消息发送成功')
    open.value = false
  } catch (error) {
    ElMessage.error('消息发送失败')
  }
}

const LabList = ref<LabModel[]>([
  {
    id: 1,
    name: '腾举',
    phone: '1234567890',
    isConnect: true,
    email: '跑步10分钟',
    qus: '跑步10分钟随机拍照',
    status: 'inProgress'
  },
  {
    id: 2,
    name: '小明',
    phone: '1234567890',
    isConnect: false,
    email: '跑步10分钟',
    qus: '跑步10分钟随机拍照',
    status: 'completed'
  }
])
const getList = async () => {
  try {
    const res = await request({
      url: `api/admin/message/list`,
      method: 'GET'
    })
    LabList.value = res.data
  } catch (error) {
    ElMessage.error('获取信息失败')
  }
}

const getStatusType = (status: string): string => {
  switch (status) {
    case 'inProgress':
      return 'warning'
    case 'completed':
      return 'success'

    default:
      return ''
  }
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'inProgress':
      return '进行中'
    case 'completed':
      return '完成任务'

    default:
      return '未知状态'
  }
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
