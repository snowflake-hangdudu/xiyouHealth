<template>
  <el-tag @click="show">
    <div style="display: flex; align-items: center">
      <Icon :icon="AntIcon.notification" :size="14" style="margin-right: 4px" />

      <p class="content">
        <span :style="{ animationDuration: `${time}s` }">{{ message }}</span>
      </p>
    </div>
  </el-tag>
</template>
<script lang="ts" setup>
import AntIcon from '@/assets/icons'
import { Icon } from '@/components/Icon'
import { useAppStoreOutside } from '@/store/modules/app'
import { ElMessageBox } from 'element-plus'
import { computed } from 'vue'

const appStore = useAppStoreOutside()

const message = computed(() => appStore.getSysNotice)

const time = computed(() => {
  let t = 8
  if (message.value.length > 16) {
    t = message.value.length / 2
  }
  return t
})

function show() {
  ElMessageBox.alert(message.value, '系统公告', {
    confirmButtonText: '确认'
  })
}
</script>

<style lang="less" scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.content {
  width: 200px;
  overflow: scroll;
  cursor: pointer;
  -ms-overflow-style: none; /* IE 10+ */
  scrollbar-width: none; /* Firefox */
  span {
    display: block;
    width: auto;
    white-space: nowrap;
    box-sizing: border-box;
    padding-left: 200px;
    animation: marquee 8s linear infinite;
    padding-right: 0;
    width: max-content;
  }
  &:hover span {
    animation-play-state: paused;
  }
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
