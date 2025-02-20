<template>
  <div>

    <!-- <el-tag v-if="appStore.userInfo?.dataAuthority == 'oneself'" style="margin: 0 6px;" type="info">个人权限</el-tag>
    <el-tag v-if="appStore.userInfo?.dataAuthority == 'all'" style="margin: 0 6px;" type="success">全部权限</el-tag> -->
  </div>
</template>
<script lang="ts" setup>
import { useAppStoreOutside } from '@/store/modules/app'
import { computed } from 'vue'

const appStore = useAppStoreOutside()

</script>
