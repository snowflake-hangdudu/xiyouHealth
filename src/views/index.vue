<template>
  <!-- <div>欢迎使用</div> -->
  <AnalysisPage />
</template>
<script lang="ts" setup>
import AnalysisPage from '@/views/Dashboard/analysisPage.vue'
</script>
<style lang="less" scoped>
.title {
  letter-spacing: 4px;
  font-size: 18px;
  font-weight: bold;
  padding: 6px 0;
  color: var(--el-text-color-primary);
}
.qrcode {
  margin-top: 12px;
  width: 220px;
  height: 220px;
  display: inline-block;
}
</style>
