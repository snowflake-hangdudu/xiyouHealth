<template>
  <div>
    <!-- <el-tooltip content="学习系统操作，了解常见问题" placement="bottom">
      <a href="" target="_blank" class="document-button">
        <Icon :icon="AntIcon.read" :size="18" style="height: 100%" />
        <span style="font-size: 12px; margin-left: 4px">操作文档</span>
      </a>
    </el-tooltip> -->
  </div>
</template>
<script lang="ts" setup>
import AntIcon from '@/assets/icons'
import { Icon } from '@/components/Icon'
</script>
<style scoped lang="less">
.document-button {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border: 1px solid fade(#9b9b9b, 20);
  border-radius: 4px;
}
.document-button:hover {
  color: var(--sec-orange);
  border: 1px solid var(--sec-orange-10);
}
</style>
