<template>
  <el-dialog width="900px" ref="dialog" v-model="open" @close="close">
    <div class="all-container">
      <div class="container">
        <div class="user-info">
          <!-- 备注 -->
          <div class="info-item">
            <span class="label" style="display: flex; align-items: center">关联任务：</span>
            <span class="value">
              <el-select v-model="userId" style="width: 500px">
                <el-option v-for="item in userList" :key="item.id" :label="item.name + '  (' + item.type + ')'" :value="item.id"></el-option>
              </el-select>
            </span>
          </div>
        </div>
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
import { UserModel } from '../../api/user'
import { qiniuUrl } from '@/config/qiniu'
import { ElMessage } from 'element-plus'

const { request } = http

const open = ref(false)

const id = ref<number | null>(null) // 用户ID
const userId = ref<number | null>(1) // 用户ID

const showModal = (row: UserModel) => {
  if (row.id) {
    id.value = row.id

    open.value = true
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

const userList = ref<UserModel[]>([
  {
    id: 1,
    name: '任务1',
    phone: '1234567890',
    isConnect: true,
    type: '室内'
  },
  {
    id: 2,
    name: '任务2',
    phone: '1234567890',
    isConnect: false,
    type: '室外'
  },
  {
    id: 1,
    name: '任务3',
    phone: '1234567890',
    isConnect: true,
    type: '室内'
  },
  {
    id: 1,
    name: '任务4',
    phone: '1234567890',
    isConnect: true,
    type: '室外'
  }
  //... more user data...
])
const getList = async () => {
  try {
    const res = await request({
      url: `api/admin/message/list`,
      method: 'GET'
    })
    userList.value = res.data
  } catch (error) {
    ElMessage.error('获取信息失败')
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
