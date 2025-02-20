<template>
  <div class="app-container">
    <div class="filter-container-flex">
      <el-input class="filter-item" style="width: 280px" v-model="searchStr" clearable>
        <template #prepend>搜索图标:</template>
      </el-input>
    </div>
    <div class="icon-table">
      <div v-for="entrie in list" :key="entrie[1]">
        <div class="icon-cell" v-if="~entrie[0].indexOf(searchStr)" @click="copy(entrie[0])">
          <div class="_icon">
            <Icon :icon="entrie[1]" :size="32" />
          </div>
          <div class="title">{{ entrie[0] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Icon } from '@/components/Icon'
import AntIcon from '@/assets/icons'
import { ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import { ref } from 'vue'

const list = Object.entries(AntIcon)
const cp = useClipboard({
  legacy: true
})
async function copy(key: string) {
  cp.copy(`AntIcon.${key}`)
  ElMessage.success({
    message: '已复制: ' + `AntIcon.${key}`
  })
}

const searchStr = ref('')
</script>
<style lang="less">
.icon-table {
  display: flex;
  flex-wrap: wrap;

  .icon-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 8px;
    background-color: var(--el-bg-color);
    border: 1px solid #f5f5f4;
    border-radius: 4px;
    margin: 4px;
    min-width: 120px;
    cursor: pointer;

    ._icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px;
    }

    .title {
      font-size: 10px;
      text-align: center;
    }
  }

  .icon-cell:active {
    opacity: 0.5;
  }
}
</style>
