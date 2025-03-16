<template>
  <div class="uploader-muti">
    <div
      v-if="showFileList"
      class="my-file-card"
      v-for="(item, index) in myFilesList"
      :key="index"
      :style="{
        height: `${h}px`,
        width: `${w}px`,
        position: 'relative',
        display: 'flex',
        borderRadius: '6px',
        overflow: 'hidden',
        marginRight: '10px',
        marginBottom: '10px',
        boxSizing: 'border-box',
        border: '0.8px dashed #eee'
      }">
      <!-- 图片展示 -->
      <el-image
        v-if="folderType !== 'video'"
        preview-teleported
        shape="square"
        :style="{ height: `${h}px`, width: `${w}px` }"
        fit="cover"
        :src="qiniuUrl(item)"
        :preview-src-list="[qiniuUrl(item) ?? '']" />
      <!-- 视频展示 -->
      <video v-if="folderType === 'video'" controls :style="{ height: `${h}px`, width: `${w}px` }" :src="qiniuUrl(item)"></video>

      <!-- 操作按钮 -->
      <span class="child-top">
        <span class="child-top-left">
          <el-icon class="edit-btn" v-if="index != 0" @click="handlePictureToLeft(index)">
            <Back />
          </el-icon>
          <el-icon class="edit-btn" v-if="index != myFilesList.length - 1" @click="handlePictureToRight(index)">
            <Right />
          </el-icon>
        </span>
        <span class="child-top-right">
          <el-icon class="edit-btn" @click="delOnePicture(index)">
            <Close />
          </el-icon>
        </span>
      </span>

      <!-- 更换文件按钮 -->
      <span class="child-foot">
        <el-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :auto-upload="false"
          @change="
            (file, files) => {
              onSelectFile(file, files, index)
            }
          "
          :multiple="false"
          :show-file-list="false">
          更换{{ folderType === 'video' ? '视频' : '图片' }}
        </el-upload>
      </span>
    </div>

    <!-- 上传按钮 -->
    <div style="position: relative" v-if="myFilesList.length < limit">
      <el-button
        class="child-paste-btn"
        v-if="status == UploadStatus.active && showPasteBtn && folderType !== 'video'"
        size="small"
        type="success"
        @click="onPaste">
        粘贴
      </el-button>
      <el-upload
        v-model:file-list="fileList"
        :style="(disabled ? 'pointer-events: none;' : '') + `height: ${h}px; width: ${w}px`"
        :disabled="status == UploadStatus.disabled"
        :show-file-list="false"
        multiple
        :auto-upload="false"
        @change="onSelectFile"
        drag>
        <div v-if="status == UploadStatus.active">
          <el-icon :color="disabled ? '#eee' : '#9b9b9b'" :size="iconSize ?? 20">
            <Plus />
          </el-icon>
          <div v-if="uploadText">{{ uploadText }}</div>
          <div class="child-btm">
            <div :style="important ? 'color: #F56C6C' : ''">
              <span v-if="important" style="color: #f56c6c; font-size: 12px">*</span>
              <span v-if="!title">最大:{{ Math.floor(maxSize / 1024 / 1024) }}M</span>
              <span v-else>{{ title }}{{ `(<=${Math.floor(maxSize / 1024 / 1024)}M)` }}</span>
            </div>
          </div>
        </div>
        <div class="child-center" v-if="status == UploadStatus.uploading">
          <el-icon class="is-loading" color="#9b9b9b" :size="iconSize ?? 20">
            <Loading />
          </el-icon>
          <div style="margin-left: 4px">上传中...</div>
        </div>
        <div class="child-btm" v-if="status == UploadStatus.disabled">
          <div style="color: #f56c6c">
            {{ disabledHint ?? '不满足上传条件' }}
          </div>
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { ElNotification, UploadFile, UploadFiles, UploadUserFile } from 'element-plus'
import { Plus, Close, Back, Right, Loading } from '@element-plus/icons-vue'
import { qiniuUrl, qiniuTokenUrl, qiniuUploadUrl } from '@/config/qiniu'
import { batchLimit } from '@/utils/async'
import { getClipboardContents } from '@/utils/clipboard'
import { blobToFile } from '@/utils/file'
import request from '@/config/axios'
import axios from 'axios'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    important?: boolean
    appendFilename?: boolean
    disabled?: boolean
    disabledHint?: string
    allowFiles?: string[]
    title?: string
    remark?: string
    folderName?: string
    folderType?: string // 'image' 或 'video'

    imgKey?: string
    h?: number
    w?: number
    maxSize?: number
    limit?: number
    iconSize?: number
    uploadText?: string
    showFileList?: boolean
    showPasteBtn?: boolean
  }>(),
  {
    showFileList: true,
    showPasteBtn: true,
    folderType: 'image' // 默认值为 'image'
  }
)

const folderType = computed(() => props.folderType || 'image')

const fileList = ref<UploadUserFile[]>([])
const uploading = ref(false)
const disabled = ref(false)
const upload_data = ref({ token: '', key: '' })
const upload_key = ref('')

const emit = defineEmits<{
  (e: 'update:modelValue', imageUrl: string): void
  (e: 'onSuccess', imageUrl: string): void
  (e: 'fileSelected', imageUrl: string): void
}>()

enum UploadStatus {
  disabled,
  active,
  uploading
}

/** props */
let maxSize = computed(() => {
  return props.maxSize ?? 5 * 1024 * 1024
})

let h = computed(() => {
  return props.h || 148
})
let w = computed(() => {
  return props.w || h.value || 148
})
let limit = computed(() => {
  return props.limit ?? 1
})

const status = computed(() => {
  if (uploading.value) return UploadStatus.uploading
  if (disabled.value) return UploadStatus.disabled
  return UploadStatus.active
})

const myFilesList = ref<string[]>([])

watch(
  () => props.modelValue,
  (newVal) => {
    myFilesList.value = newVal?.length ? newVal.split(',') : []
    if (myFilesList.value.length >= limit.value) {
      disabled.value = true
    } else {
      disabled.value = false
    }
  },
  { immediate: true }
)

/**
 * replaceIndex 需要替换的文件下标
 */
const onSelectFile = async (file: UploadFile, files: UploadFiles, replaceIndex?: number) => {
  const _fileType = file.name.split('.').pop()?.toLowerCase() // 获取文件扩展名

  // 定义允许的文件类型
  let allowedFileTypes: string[] = []

  if (folderType.value === 'image') {
    allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
  } else if (folderType.value === 'video') {
    allowedFileTypes = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'rmvb', '3gp', 'mpeg', 'mpg', 'm4v', 'f4v', 'm3u8', 'ts', 'dat', 'mts', 'vob']
  }

  // // 校验文件类型
  // if (!_fileType || !allowedFileTypes.includes(_fileType)) {
  //   ElNotification({
  //     title: '文件类型错误',
  //     message: `请上传 ${folderType.value === 'image' ? '图片' : '视频'} 文件。支持的格式：${allowedFileTypes.join(', ')}`,
  //     type: 'warning',
  //     duration: 2000
  //   })
  //   return
  // }

  // 文件大小校验
  if (file.size! > maxSize.value) {
    ElNotification({
      title: '大小超过限制',
      message: `请不要上传大于 ${(maxSize.value / 1024 / 1024).toFixed(2)}M 的文件`,
      type: 'warning',
      duration: 2000
    })
    return
  }

  uploading.value = true

  // 批量上传控制
  batchLimit(4, async () => {
    // const data = await request.request({
    //   url: `${qiniuTokenUrl}`,
    //   method: 'get'
    // })
    // upload_data.value.token = data.data

    const _folderName = props.folderName || folderType.value // 使用 folderType 作为文件夹名称
    const timestamp = new Date().getTime().toString(36)
    const randomStr = Math.random().toString(36).substr(2, 5) // 生成随机字符串
    upload_data.value.key = `laboratory-reservation/${_folderName}/${timestamp}_${randomStr}.${_fileType}`

    const formData = new FormData()
    // formData.append('token', upload_data.value.token)
    // formData.append('key', upload_data.value.key)
    formData.append('file', file.raw as File)

    try {
      const response = await axios.post(`${qiniuUploadUrl}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      upload_key.value = response.data.key
    } catch (error) {
      console.error(error)
      ElNotification({
        title: '上传失败',
        message: '文件上传失败，请重试',
        type: 'error',
        duration: 2000
      })
      uploading.value = false
      return
    }

    let key = upload_key.value
    if (props.appendFilename) {
      key = `${key}?_name=${encodeURIComponent(file.name)}`
    }
    uploading.value = false
    if (replaceIndex != undefined) {
      myFilesList.value.splice(replaceIndex, 1, key)
    } else {
      if (myFilesList.value.length < limit.value) {
        myFilesList.value.push(key)
        emit('fileSelected', `${key}`)
      }
    }
    myFilesList.value.length >= limit.value && (disabled.value = true)
    emit('update:modelValue', `${myFilesList.value.join(',')}`)
    fileList.value = []
  })
}

const handlePictureToLeft = (index: number) => {
  if (index > 0) {
    ;[myFilesList.value[index], myFilesList.value[index - 1]] = [myFilesList.value[index - 1], myFilesList.value[index]]
    emit('update:modelValue', `${myFilesList.value.join(',')}`)
  }
}

const handlePictureToRight = (index: number) => {
  if (index < myFilesList.value.length - 1) {
    ;[myFilesList.value[index], myFilesList.value[index + 1]] = [myFilesList.value[index + 1], myFilesList.value[index]]
    emit('update:modelValue', `${myFilesList.value.join(',')}`)
  }
}

const delOnePicture = (index: number) => {
  myFilesList.value.splice(index, 1)
  emit('update:modelValue', `${myFilesList.value.join(',')}`)
  disabled.value = false
}

async function onPaste() {
  if (folderType.value === 'video') {
    ElNotification({
      title: '提示',
      message: '视频文件无法通过粘贴上传',
      type: 'warning',
      duration: 2000
    })
    return
  }
  const blob = await getClipboardContents()
  if (blob) {
    const file = blobToFile(blob, `${Date.now()}.png`)
    const uploadFile = {
      ...file,
      name: file.name,
      size: file.size,
      type: file.type,
      uid: Date.now(),
      raw: file
    } as UploadFile
    onSelectFile(uploadFile, [uploadFile])
  } else {
    console.warn('剪切板没有找到图片')
    ElNotification({
      title: '提示',
      message: '剪切板没有找到图片',
      type: 'warning',
      duration: 2000
    })
  }
}
</script>

<style lang="less" scoped>
.uploader-muti {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.my-file-card:hover .child-foot,
.my-file-card:hover .child-top {
  opacity: 1;
}

.el-upload--picture-card {
  position: relative;
}

.el-form-item__content {
  line-height: normal !important;
}

:deep(.el-upload) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.child-paste-btn {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}

.child-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 2px 4px;
  font-size: 16px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  background: #0000003e;
  transition: all 0.5s;
  opacity: 0;
}

.edit-btn {
  cursor: pointer;
  transition: all 0.5s;
  &:active {
    opacity: 0.5;
  }
  &:hover {
    color: red;
  }
}

.child-center {
  position: absolute;
  height: 100%;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #9b9b9b;
}

.child-btm {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  line-height: 1.2;
  display: flex;
  justify-content: center;

  span {
    display: flex;
    justify-content: center;
  }
}

.child-foot {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  width: 100%;
  font-size: 12px;
  color: #ffffff;
  background: #0000003e;
  transition: all 0.5s;
  opacity: 0;
}

.child-foot :deep(.el-upload--picture-card) {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0%;
  padding: 6px 2px;
  background: #0000003e;
}
</style>
