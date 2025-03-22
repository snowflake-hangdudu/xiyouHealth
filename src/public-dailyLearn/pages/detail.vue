<template>
  <el-dialog width="900px" ref="dialog" v-model="open" @close="close">
    <div class="all-container">
      <el-table :data="tb.list" element-loading-text="Loading" fit highlight-current-row border align="center" style="width: 100%; overflow-x: auto">
        <el-table-column prop="id" label="用户ID" align="center">
          <template #default="scope">
            {{ scope.row.userId }}
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

        <el-table-column prop="email" label="题目" align="center">
          <template #default="scope">
            {{ scope.row.question }}
          </template>
        </el-table-column>

        <el-table-column prop="email" label="题目答案" align="center">
          <template #default="scope">
            {{ scope.row.questionAnswer ? '是' : '否' }}
          </template>
        </el-table-column>

        <el-table-column prop="email" label="用户答案" align="center">
          <template #default="scope">
            {{ scope.row.userAnswer ? '是' : '否' }}
          </template>
        </el-table-column>
      </el-table>

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
import InfoQuery, { InfoModel, InfoQueryParams } from '../api/info'
import { ElMessage } from 'element-plus'
import refTable from '@/public/basic-table'

const { request } = http

const open = ref(false)

const id = ref<number | null>(null) // 用户ID

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<InfoModel,InfoQueryParams, InfoQuery>(new InfoQuery(), {})

const showModal = (row: InfoModel) => {
  open.value = true
  if (row.id) {
    id.value = row.id
    tb.query.recordId = row.id
    actions.queryAll({resetPage: true})
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
