<template>
  <el-dialog width="900px" ref="dialog" v-model="open" @close="close">
    <div class="all-container">
      <div class="container">
        <div class="user-info">
          <!-- 备注 -->
          <div class="info-item">
            <span class="label" style="display: flex; align-items: center">组队：</span>
            <span class="value">
              <el-select v-model="userId" style="width: 500px" clearable >
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
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
import { ref, defineExpose, computed, onMounted } from 'vue'
import http from '@/config/axios'
import { UserModel } from '../../api/user'
import { qiniuUrl } from '@/config/qiniu'
import { ElMessage, ElMessageBox} from 'element-plus'

const { request } = http

const open = ref(false)

const id = ref<number | null>(null) // 用户ID
const userId = ref<number | null>() // 用户ID
const userList = ref<UserModel[]>([])
onMounted(() => {
  getList()
})
const showModal = (row: UserModel) => {
  if (row.id) {
    id.value = row.id
    open.value = true
  } else {
    ElMessage.error('获取信息失败')
  }
}

const savemsg = async () => {
  try {
    // 使用 ElMessageBox.confirm 替代 elconfirm
    await ElMessageBox.confirm('是否确定关联用户？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    // 用户确认后执行
    await request({
      url: `api/admin/team`,
      method: 'POST',
      data: {
        user1Id: id.value,
        user2Id: userId.value
      }
    });
    
    ElMessage.success('关联成功');
    open.value = false;
  } catch (error) {
    // 如果用户点击取消或请求失败，都会进入 catch
    if (error !== 'cancel') { // 通过错误类型区分是取消还是请求失败
      ElMessage.error('关联失败');
    }
    open.value = false;
  }
};


const getList = async () => {
  try {
    const res = await request({
      url: `api/common/get/user/list`,
      method: 'GET',
    })
    console.log('res.data', res)
    userList.value = res.data
    console.log('userList', userList.value)
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
