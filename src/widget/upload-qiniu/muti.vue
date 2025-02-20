<template>
  <div class="uploader-muti">
    <div
      v-if="showFileList"
      class="my-file-card"
      v-for="(item, index) in myFilesList"
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
      <el-image
        preview-teleported
        shape="square"
        :style="{ height: `${h}px`, width: `${w}px` }"
        fit="cover"
        :src="qiniuUrl(item)"
        :preview-src-list="[qiniuUrl(item) ?? '']" />
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
          更换图片
        </el-upload>
      </span>
    </div>
    <div style="position: relative">
      <el-button class="child-paste-btn" v-if="status == UploadStatus.active && showPasteBtn" size="small" type="success" @click="onPaste">
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
        <!-- 可上传 -->
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
        <!-- 上传中 -->
        <div class="child-center" v-if="status == UploadStatus.uploading">
          <el-icon class="is-loading" color="#9b9b9b" :size="iconSize ?? 20">
            <Loading />
          </el-icon>
          <div style="margin-left: 4px">上传中...</div>
        </div>
        <!-- 不能上传 -->
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
import { computed, ref } from 'vue'
import { ElNotification, UploadFile, UploadFiles, UploadUserFile } from 'element-plus'
import { Plus, Close, Back, Right, Loading } from '@element-plus/icons-vue'
import { useCosOss } from '@/config/cos-oss'
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
    showPasteBtn: true
  }
)

const fileList = ref<UploadUserFile[]>([])
// const oss = useCosOss()
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
  return props.limit ?? 4
})

const status = computed(() => {
  if (uploading.value) return UploadStatus.uploading
  if (disabled.value) return UploadStatus.disabled
  return UploadStatus.active
})

const myFilesList = computed(() => {
  let result = props.modelValue?.length ? props.modelValue?.split(',') ?? [] : []
  if (result.length >= limit.value) {
    disabled.value = true
  }
  return result
})

/**
 * replaceIndex 需要替换的图片下标
 */
const onSelectFile = async (file: UploadFile, files: UploadFiles, replaceIndex?: number) => {
  const _fileType = file.name.split('.').reverse()[0].toLowerCase()
  if (file.size! > maxSize.value) {
    ElNotification({
      title: '大小超过限制',
      message: `请不要上传大于${(maxSize.value / 1024 / 1024).toFixed(2)}M的文件`,
      type: 'warning',
      duration: 2000
    })
    return
  }
  let _folderName = props.folderName
  if (props.allowFiles) {
    let isTarget = false
    for (const type of props.allowFiles) {
      if (~_fileType.indexOf(type)) {
        isTarget = true
        break
      }
    }
    if (!isTarget) {
      ElNotification({
        title: '请上传指定格式的文件',
        message: '仅支持:' + props.allowFiles.join(','),
        type: 'warning',
        duration: 2000
      })
      return
    }
  } else {
    if (!~_fileType.indexOf('jpg') && !~_fileType.indexOf('jpeg') && !~_fileType.indexOf('png') && !~_fileType.indexOf('gif')) {
      ElNotification({
        title: '请上传图片',
        message: '仅支持上传图片',
        type: 'warning',
        duration: 2000
      })
      return
    }
  }
  uploading.value = true
  batchLimit(4, async () => {
    const data = await request.request({
      url: `${qiniuTokenUrl}`,
      method: 'get'
    })
    upload_data.value.token = data.data
    if (props.imgKey) {
      upload_data.value.key = `${props.imgKey}`
    } else {
      upload_data.value.key = `${_folderName || 'image'}-${new Date().getTime().toString(36)}`
    }
    console.log(file, '我是file')
    const formData = file.raw

    try {
      const response = await axios({
        method: 'post',
        url: `${qiniuUploadUrl}`,
        data: {
          ...upload_data.value,
          file: formData
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      upload_key.value = response.data.key
      console.log(response.data, '我是response')
    } catch (error) {
      console.error(error)
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
  index > 0 && ([myFilesList.value[index], myFilesList.value[index - 1]] = [myFilesList.value[index - 1], myFilesList.value[index]])
  emit('update:modelValue', `${myFilesList.value.join(',')}`)
}

const handlePictureToRight = (index: number) => {
  ;[myFilesList.value[index], myFilesList.value[index + 1]] = [myFilesList.value[index + 1], myFilesList.value[index]]
  emit('update:modelValue', `${myFilesList.value.join(',')}`)
}

const delOnePicture = (index: number) => {
  myFilesList.value.splice(index, 1)
  emit('update:modelValue', `${myFilesList.value.join(',')}`)
  disabled.value = false
}

async function onPaste() {
  const blob = await getClipboardContents()
  if (blob) {
    const file = blobToFile(blob, `${Date.now()}.png`)
    const uploadFile = {
      ...file,
      raw: file
    }
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
