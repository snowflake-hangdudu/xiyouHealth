<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { delayDuration } from '@/utils/async'
import http from '@/config/axios'
import { computed, reactive, ref, unref, watch, onMounted } from 'vue'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

const { request } = http
const emit = defineEmits(['to-login'])
const { currentRoute, addRoute, push } = useRouter()
const { t } = useI18n()
const { required } = useValidator()
const ruleFormRef = ref<FormInstance>() // 表单实例
const rules: FormRules = {
  account: [required()], //账号
  phone: [required()], //电话
  name: [required()], //姓名
  password: [required()] //密码
}
//切换到登录页面
const toLogin = () => {
  emit('to-login')
}
const loading = ref(false)
const formSize = ref('large')
const countdown = ref(0)
const sendLoading = ref(false)

const loginRegister = async () => {
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        //通过校验

        await submit()
      } finally {
        loading.value = false
      }
    }
  })
}

const redirect = ref<string>('')
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

watch(
  () => countdown.value,
  (val) => {
    if (val === 0) {
      countdown.value = 0
    }
  }
)

interface formData {
  account: string
  password: string
  check_password: string
  phone: string
  level: string
  name: string
}

const formData = ref<formData>({
  password: '',
  check_password: '',
  phone: '',
  account: '',
  level: 'super',
  name: ''
})

async function submit() {
  if (formData.value.password !== formData.value.check_password) {
    ElMessage({
      message: '重复密码与密码不同',
      type: 'warning'
    })
    return
  }
  //发起注册请求的逻辑，这里只是模拟
  await request({
    url: 'api/admin/account/register',
    method: 'post',
    data: {
      name: formData.value.name,
      account: formData.value.account,
      password: formData.value.password,
      phone: formData.value.phone,
      level: formData.value.level
    }
  })

  ElMessage({
    message: '注册成功',
    type: 'success'
  })
  try {
    toLogin()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-form
    ref="ruleFormRef"
    style="width: 100%"
    :model="formData"
    :rules="rules"
    label-width="auto"
    label-position="top"
    :size="formSize"
    status-icon>
    <div>
      <h2 class="text-2xl font-bold text-center w-[100%]" style="margin: 0 0 30px 0">{{ t('login.register') }}</h2>
    </div>

    <el-form-item label="账号" prop="account">
      <el-input v-model="formData.account" placeholder="请输入账号" />
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="formData.phone" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="check_password">
      <el-input v-model="formData.check_password" type="password" placeholder="请输入密码" show-password />
    </el-form-item>

    <div class="w-[100%]">
      <ElButton type="primary" class="w-[100%]" :loading="loading" @click="loginRegister">
        {{ t('login.register') }}
      </ElButton>
    </div>
    <div class="w-[100%] mt-15px">
      <ElButton class="w-[100%]" @click="toLogin">
        {{ t('login.hasUser') }}
      </ElButton>
    </div>
  </el-form>
</template>

<style lang="less">
.form {
  overflow: auto;
}
</style>
