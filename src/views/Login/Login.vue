<script setup lang="ts">
import { LoginForm, RegisterForm } from './components'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { LocaleDropdown } from '@/components/LocaleDropdown'
import { useI18n } from '@/hooks/web/useI18n'
import { underlineToHump } from '@/utils'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { ref } from 'vue'
import { useParams } from '@/utils/params'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login')

const appStore = useAppStore()

const { t } = useI18n()

const isLogin = useParams('tag', 'login')

const toRegister = () => {
  isLogin.value = 'register'
}

const toLogin = () => {
  isLogin.value = 'login'
}
</script>

<template>
  <div :class="prefixCls" class="h-[100%] relative <xl:bg-v-dark <sm:px-10px <xl:px-10px <md:px-10px">
    <div class="relative h-full flex mx-auto">
      <div :class="`${prefixCls}__left flex-1 bg-opacity-20 relative p-30px <xl:hidden`" style="background-color: #940940">
        <div class="flex items-center relative text-white">
          <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
          <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
        </div>
        <div class="flex justify-center items-center h-[calc(100%-60px)]">
          <TransitionGroup appear tag="div" enter-active-class="animate__animated animate__bounceInLeft">
            <img src="@/assets/svgs/login-box-bg.svg" key="1" alt="" />
            <div class="text-3xl text-white" key="2">{{ '欢迎使用管理系统' }}</div>
            <div class="mt-5 font-normal text-white text-14px" key="3">
              {{ '欢迎使用管理系统' }}
            </div>
          </TransitionGroup>
        </div>
      </div>
      <div class="flex-1 p-30px dark:bg-v-dark relative">
        <div class="flex justify-between items-center text-white @2xl:justify-end @xl:justify-end">
          <div class="flex items-center @2xl:hidden @xl:hidden">
            <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
            <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
          </div>
          <div class="flex justify-end items-center space-x-10px">
            <ThemeSwitch />
            <!-- <LocaleDropdown class="<xl:text-white dark:text-white" /> -->
          </div>
        </div>

        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div
            class="form h-full flex flex-wrap items-center m-auto box-border w-[100%] @2xl:max-w-500px @xl:max-w-500px @md:max-w-500px @lg:max-w-500px">
            <LoginForm v-if="isLogin == 'login'" class="p-20px h-auto m-auto <xl:(rounded-2xl light:bg-white)" @to-register="toRegister" />
            <RegisterForm v-if="isLogin == 'register'" class="p-20px h-auto m-auto <xl:(rounded-2xl light:bg-white)" @to-login="toLogin" />
          </div>
        </Transition>
        <div class="icp <xl:text-white <xl:mb-16px">
          <!-- <span class="icp_lead">备案号：</span>
          <a class="icp_link" href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2023083440号</a> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-login';

.background-img {
  background: url('@/assets/svgs/login-bg.svg');
}

.@{prefix-cls} {
  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      // background-color: fade(#1263ee, 88);
      // background: url('@/assets/svgs/login-bg.svg');
      background-size: cover;
      background-color: var(--dark-bg-color);
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}

.icp {
  position: fixed;
  bottom: 20px;
  right: 40px;
  margin-bottom: 0;
  font-size: 12px;
  .icp_lead {
    opacity: 0.4;
  }
  .icp_link {
    opacity: 0.4;
  }
  .icp_link:hover {
    opacity: 1;
    color: var(--sec-orange);
  }
  .icp_link:active {
    opacity: 0.4;
    color: var(--sec-orange);
  }
}
</style>
