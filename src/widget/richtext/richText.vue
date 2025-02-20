<template>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange" />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { qiniuUrl, qiniuTokenUrl, qiniuUploadUrl } from '@/config/qiniu'
import axios from 'axios'

// 接收 props
const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

// 定义 emits
const emit = defineEmits(['update:content'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef(null)

// 内容 HTML
const valueHtml = ref('')

// 监听 props.content 的变化，更新 valueHtml
watch(
  () => props.content,
  (newValue) => {
    valueHtml.value = newValue
  }
)

// 在组件挂载后，初始化 valueHtml
onMounted(() => {
  valueHtml.value = props.content
})

// 工具栏配置
const toolbarConfig = {}

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      async customUpload(file, insertFn) {
        try {
          // 获取上传 token
          const tokenResponse = await axios.get(qiniuTokenUrl)
          const token = tokenResponse.data.data

          // 创建 FormData
          const formData = new FormData()
          formData.append('file', file)
          formData.append('token', token)
          formData.append('key', file.name)

          // 上传图片到七牛云
          const uploadResponse = await axios.post(qiniuUploadUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })

          // 获取图片 URL
          const imageUrl = qiniuUrl(uploadResponse.data.key)

          // 插入图片到编辑器
          insertFn(imageUrl, '图片描述', { width: '100px', height: 'auto' })
        } catch (error) {
          console.error('图片上传失败', error)
        }
      }
    }
  }
}

// 编辑器创建后
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例
}

// 处理内容变化
const handleChange = () => {
  emit('update:content', valueHtml.value) // 通过 emit 向父组件传递内容
}

// 组件销毁时，销毁编辑器
onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy()
  }
})
</script>

<style>
/* 你的样式 */
</style>
