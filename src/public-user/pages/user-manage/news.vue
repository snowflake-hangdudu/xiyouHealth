<template>
  <el-dialog width="900px" ref="dialog" v-model="open" @close="close">
    <div class="all-container">
      <el-form
        :model="row"
        label-position="left"
        label-width="100px"
        style="width: 800px; margin-left: 50px">
        <el-form-item label="消息"  >
          <el-input v-model="news" placeholder="请输入消息" style="width: 300px;" />
        </el-form-item>
      </el-form>
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
import { ElMessage } from 'element-plus'
import refTable from '@/public/basic-table'

const { request } = http
const open = ref(false)
const row = ref<any>({})
const news = ref<any>(null)
const id = ref<number | null>(null) // 用户ID



const showModal = (row: any) => {
  open.value = true
  if (row.id) {
    id.value = row.id
  } else {
    ElMessage.error('获取信息失败')
  }
}

const savemsg = async () => {
  if (!news.value) {
    ElMessage.error('请输入消息')
    return
  }
  try {
    await request({
      url: `api/admin/msg/save`,
      method: 'POST',
      data: {
        msg: news.value,
        userId: id.value
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
