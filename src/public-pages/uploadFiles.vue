<template>
  <el-upload
    class="upload-demo"
    multiple
    v-model:file-list="files"
    :accept="accept"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-upload="beforeUplpad"
    :before-remove="beforeRemove"
    :on-success="success"
    :limit="999"
    :http-request="upload">
    <el-button type="primary" @click="submitFiles" :loading="uploadStatus">点击上传文件</el-button>
    <template #tip>
      <div class="el-upload__tip"></div>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { onMounted, ref, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SparkMD5 from 'spark-md5'
import axios from 'axios'
import type { UploadFile, UploadFiles, UploadProps, UploadUserFile } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  /** 文件类型 */
  accept: String
})
/** 文件 */
const files = ref(props.modelValue)
let totalFiles = ref(0) // 总文件数
let uploadedFiles = ref(0) // 已上传文件数
onMounted(() => {
  if (import.meta.env.VITE_USER_NODE_ENV == 'development') {
    baseUrl2 = developmentUrl
  } else if (import.meta.env.VITE_USER_NODE_ENV == 'production') {
    baseUrl2 = production
  }
})

const emit = defineEmits(['update:modelValue'])
const success = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  uploadedFiles.value = uploadedFiles.value + 1
  if (uploadedFiles.value === totalFiles.value) {
    // files.value = []
    ElMessage.success('全部上传成功')
    uploadStatus.value = false
    emit('update:modelValue', files.value)
  }
}
const beforeUplpad = (file) => {
  totalFiles.value = totalFiles.value + 1
}
let instance = getCurrentInstance()

let fileData: any
const developmentUrl = 'https://szubbtest.deepmedical.net.cn/minio_service/api'
let production = ''
let baseUrl2 = ''
let token = ''
let uploadStatus = ref(false) //控制是否能上传
let fileList = ref<UploadUserFile[]>([])

const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview = (uploadFile) => {}

const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(`最多支持上传9个文件`)
}

const beforeRemove = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`是否移除该文件 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  )
}

const submitFiles = () => {
  // 在这里处理你的文件
}

const upload = async (file, files) => {
  if (!uploadStatus.value) {
    uploadStatus.value = !uploadStatus.value
  }
  //file.file为文件对象
  //读取文件内容并计算MD5哈希值
  let fileMB = file.file.size
  let res = await getToken()
  token = res.data

  if (fileMB <= 5 * 1024 * 1024) {
    //文件小于5M，直接上传
    await uploadSmallFile(file.file)
  } else if (fileMB > 5 * 1024 * 1024) {
    await uploadInit(file.file)
    await uploadBigFile(file.file)
  }
}

//获取文件哈希值
function calculateHashAsync(fileContent) {
  return new Promise((resolve, reject) => {
    try {
      var spark = new SparkMD5.ArrayBuffer()
      setTimeout(() => {
        spark.append(fileContent)
        var hex = spark.end()
        resolve(hex)
      }, 0)
    } catch (error) {
      reject(error)
    }
  })
}

//获取token
async function getToken() {
  const url = `${baseUrl2}/minio/get/token`

  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {}
}

//上传小文件
async function uploadSmallFile(file) {
  const data = new FormData()
  data.append('file', file)
  data.append('key', file.uid)
  data.append('token', token)
  const url = `${baseUrl2}/minio/fileUpload/small`
  try {
    const response = await axios.post(url, data)
    return response.data
  } catch (error) {}
}

//初始化大文件的上传
async function uploadInit(file) {
  const initUrl = `${baseUrl2}/minio/init/fileUpload`
  let chunkSize = 5 * 1024 * 1024 //分片大小为1MB
  let fileNmae = file.name
  let key = file.uid
  let md5 = await calculateHashAsync(file)
  //token上面有，直接用
  let totalChunk = Math.ceil(file.size / chunkSize)
  let totalSize = file.size
  const data = new FormData()
  data.append('fileName', file.name)
  data.append('chunkSize', chunkSize.toString())
  data.append('key', file.uid)
  data.append('md5', md5 as string)
  data.append('token', token)
  data.append('totalChunk', totalChunk.toString())
  data.append('totalSize', file.size)

  try {
    const response = await axios.post(initUrl, data)
    return response.data
  } catch (error) {}
}

//大文件的上传
async function uploadBigFile(file) {
  const url = `${baseUrl2}/minio/fileUpload/big`
  let chunkSize = 5 * 1024 * 1024 //分片大小为1MB
  let fileNmae = file.name
  let key = file.uid
  let md5 = await calculateHashAsync(file)
  //token上面有，直接用
  let totalChunk = Math.ceil(file.size / chunkSize)
  let totalSize = file.size

  try {
    for (let chunkIndex = 0; chunkIndex < totalChunk; chunkIndex++) {
      let data = new FormData()
      const start = chunkIndex * chunkSize
      const end = start + chunkSize >= file.length ? file.length : start + chunkSize
      const chunk = file.slice(start, end)
      data.append('chunkIndex', chunkIndex.toString())
      data.append('chunkSize', chunkSize.toString())
      data.append('file', chunk)
      data.append('key', key)
      data.append('md5', md5 as string)
      data.append('token', token)
      data.append('totalChunk', totalChunk.toString())

      let res = await axios.post(url, data)
      if (chunkIndex === totalChunk - 1) {
        return res.data.data
      }
    }
    return
  } catch (error) {}
}
</script>
