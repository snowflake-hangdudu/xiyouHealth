<template>
  <el-dialog width="900px" ref="dialog" v-model="open" @close="close">
    <div class="all-container">
      <div >上传PDF：</div>
      <Sin v-model="url" :limit="9" />
    </div>

    <template #footer>
      <div class="foot" style="display: flex; justify-content: space-evenly; margin: -20px 0 40px 0">
        <el-button @click="open = false" size="large" style="width: 120px">关闭弹窗</el-button>
        <el-button type="primary" @click="save" size="large" style="width: 120px">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose, computed,onMounted } from 'vue'
import http from '@/config/axios'
import { UserModel } from '../../api/user'
import { qiniuUrl } from '@/config/qiniu'
import { ElMessage } from 'element-plus'
import Sin from '@/widget/upload-qiniu/index.vue'

const { request } = http

const open = ref(false)
onMounted(() => {

})  
const id = ref<number | null>(null) // 用户ID
const url= ref<string>('') // 视频地址



const showModal = (row: UserModel) => {
  if (row.id) {
    id.value = row.id
  
    open.value = true
  } else {
    ElMessage.error('获取信息失败')
  }
}

const save= async () => {
  try {
    await request({
      url: `api/admin/user/upload/file`,
      method: 'PUT',
      data: {
        isCover: true,
        url: url.value,
        userId: id.value
      }
    })
    ElMessage.success('运动处方上传成功')
    open.value = false
  } catch (error) {
    ElMessage.error('运动处方上传失败')
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
