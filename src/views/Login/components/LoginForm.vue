<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, unref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElLink, ElMessage } from 'element-plus'
import { loginApi, getUserInfoApi } from '@/api/login'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { useValidator } from '@/hooks/web/useValidator'
//留着以后用
import { onInitUserInfo } from '@/global/lifeCycle'
import generateRouters from '@/router/generate'
import type { FormInstance, FormRules } from 'element-plus'

const { required } = useValidator()
const emit = defineEmits(['to-register'])
const formSize = ref('large')
const appStore = useAppStore()
const { currentRoute, addRoute, push } = useRouter()
const { wsCache } = useCache()
const { t } = useI18n()
const ruleFormRef = ref<FormInstance>() // 表单实例
const rules = {
  account: [required()],
  password: [required()]
}
interface formData {
  account: string
  password: string
}
const formData = ref<formData>({
  account: '',
  password: ''
})

const loading = ref(false)
// const iconSize = 30
// const iconColor = '#999'
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

// 登录
const signIn = async () => {
  //模拟权限，有空可以加逻辑

  await ruleFormRef.value?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      try {
        // 登录接口,获取token。模拟获取token，实际项目中应该通过接口获取
        // const loginRes = await loginApi(formData.value)
        const loginRes = {
          code: 200,
          data: 'admin-token'
        }
        console.log('loginRes', loginRes)
        console.log('loginRes.code', loginRes.code)
        console.log('loginRes.data', loginRes.data)
        if (Number(loginRes.code) == 200) {
          appStore.setToken(loginRes.data)
          wsCache.set('admin-token', loginRes.data)
          // 登录成功后获取用户信息,下面直接给信息,实际项目中应该通过接口获取
          // const res = await getUserInfoApi()
          const res = {
            data: {
              id: 6003,
              role: ['super']
            }
          }
          appStore.setUserInfo(res.data)
          await generateRouters()
          // onInitUserInfo()   加载用户信息,暂时用不到,留着
          push({ path: '/' })
        }
      } finally {
        loading.value = false
      }
    }
  })
}
// 去注册页面
const toRegister = () => {
  emit('to-register')
}
onMounted(() => {
  if (import.meta.env.VITE_USER_NODE_ENV == 'development') {
    formData.value = {
      account: '15551359775',
      password: '123456'
    }
  }
  window.addEventListener('keydown', keyDown)
})
const keyDown = (e) => {
  //如果是回车则执行登录方法
  if (e.keyCode == 13) {
    signIn()
  }
}
// 销毁监听键盘事件
onUnmounted(() => {
  window.removeEventListener('keydown', keyDown, false)
})
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
      <h2 class="text-2xl font-bold text-center w-[100%]" style="margin: 0 0 30px 0">{{ t('login.login') }}</h2>
    </div>
    <el-form-item label="账号" prop="account">
      <el-input v-model="formData.account" placeholder="请输入账号" clearable />
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password clearable />
    </el-form-item>
    <div class="w-[100%]" style="margin-top: 50px">
      <ElButton :loading="loading" type="primary" class="w-[100%]" @click="signIn">
        {{ t('login.login') }}
      </ElButton>
    </div>
    <div class="w-[100%] mt-15px">
      <ElButton class="w-[100%]" @click="toRegister">
        {{ t('login.register') }}
      </ElButton>
    </div>
    <!-- <div class="flex justify-between w-[100%]">
        <Icon icon="ant-design:github-filled" :size="iconSize" class="cursor-pointer anticon" :color="iconColor" />
        <Icon icon="ant-design:wechat-filled" :size="iconSize" class="cursor-pointer anticon" :color="iconColor" />
        <Icon icon="ant-design:alipay-circle-filled" :size="iconSize" :color="iconColor" class="cursor-pointer anticon" />
        <Icon icon="ant-design:weibo-circle-filled" :size="iconSize" :color="iconColor" class="cursor-pointer anticon" />
      </div> -->
  </el-form>
</template>

<style lang="less" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.input-container {
  display: flex;
  align-items: center;
}

.select-wrapper {
  position: relative;
  margin-right: 10px;
}

.dropdown {
  width: 150px;
  height: 34px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.text-input {
  flex: 1;
  height: 34px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
