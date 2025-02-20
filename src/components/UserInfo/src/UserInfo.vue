<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useCache } from '@/hooks/web/useCache'
import { resetRouter } from '@/router'
import { useRouter } from 'vue-router'
import { useDesign } from '@/hooks/web/useDesign'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { useCosplayMode } from '@/store/modules/cosplay'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { loadPermission } from '@/global/systemPermissionCenter'
import { ref } from 'vue'
import { qiniuUrl } from '@/config/qiniu'

const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { t } = useI18n()

const { wsCache } = useCache()

const { replace } = useRouter()

const appStore = useAppStore()
const cosplayMode = useCosplayMode()

const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(async () => {
      wsCache.clear()
      localStorage.clear()
      sessionStorage.clear()
      tagsViewStore.delAllViews()
      appStore.setToken('')
      appStore.logout()
      loadPermission([])
      cosplayMode.logout()
      resetRouter() // 重置静态路由表
      replace('/login')
      // window.location.reload() //强制刷新页面
    })
    .catch(() => {})
}

const _window = window
/** 非线上环境 */
const notProd = import.meta.env.VITE_USER_NODE_ENV !== 'production'
</script>
<template>
  <ElDropdown :class="prefixCls" trigger="click">
    <div class="flex items-center" style="padding: 8px 8px">
      <!-- <img class="biubiubiu" :src="'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'" alt=""
                                                        style="height: 28px;width: 28px;object-fit: cover;border-radius: 999px;" /> -->
      <img class="biubiubiu" src="@/assets/imgs/people.webp" alt="" style="height: 28px; width: 28px; object-fit: cover; border-radius: 999px" />
      <span class="<lg:hidden text-14px pl-[10px] pr-[8px] text-[var(--top-header-text-color)]">
        {{ appStore.userInfo?.name ?? '管理员' }}
      </span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <span>页面:</span>
          <ThemeSwitch style="padding-left: 12px" />
        </ElDropdownItem>
        <ElDropdownItem
          v-if="notProd"
          @click="
            () => {
              _window.open('https://eflbmi.axshare.com/#id=sam1le&p=%E9%97%A8%E5%BA%97%E7%AE%A1%E7%90%86&g=1')
            }
          ">
          <div>项目原型</div>
        </ElDropdownItem>
        <ElDropdownItem
          v-if="notProd"
          @click="
            () => {
              _window.open('http://49.232.195.143:8123/doc.html#/home')
            }
          ">
          <div>项目文档</div>
        </ElDropdownItem>
        <ElDropdownItem
          v-if="notProd"
          @click="
            () => {
              _window['setFakeProd']?.()
            }
          ">
          <div>移除水印</div>
        </ElDropdownItem>
        <ElDropdownItem divided @click="loginOut">
          <div>退出登录</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
