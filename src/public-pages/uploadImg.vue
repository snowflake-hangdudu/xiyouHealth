<template>
  <div class="app-container">
    <h1>多图</h1>
    <Muti :img="img" :imgs="imgs" :files="files" />
    <Sing :img="img" :imgs="imgs" :files="files" />
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import Sing from '@/widget/upload-qiniu/index.vue'
import Muti from '@/widget/upload-qiniu/muti.vue'
import axios from 'axios'
let img = ref('')
let imgs = ref('')
let files = ref([])
</script>

<style scoped lang="less">
.app-container {
  display: flex;

  div {
    width: 50%;
  }
}

.content {
  ::v-deep tr,
  ::v-deep td,
  ::v-deep table {
    border: 1px solid black;
  }
}
</style>
