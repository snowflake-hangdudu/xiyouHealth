<template>
  <div class="appcontainer">
    <div class="name">
      <div class="title">我无敌</div>
    </div>
    <div class="con" :style="{ maxHeight: isExpanded ? 'none' : '40px', overflow: isExpanded ? 'visible' : 'hidden' }">
      <div class="title">我有很多选择很多选择很多选择1</div>
      <div class="title">我有很多选择很多选择很多选择1</div>
      <div class="title">我有很多选择很多选择很多选择1</div>
      <div class="title">我有很多选择很多选择很多选择1</div>
      <div class="title">我有很多选择很多选择很多选择1</div>
      <div class="title">我有很多选择很多选择很多选择1</div>
      <div class="title">我有很多选择很多选择很多选择1</div>
      <div class="title">我有很多选择很多选择很多选择1</div>
      <div class="title">我有很多选择很多选择很多选择1</div>
      <div class="title">我有很多选择很多选择很多选择1</div>
      v
      <div class="title">我有很多选择很多选择很多选择1</div>
      <div class="title">我有很多选择很多选择很多选择1</div>
      <div class="title">我有很多选择很多选择很多选择1</div>
      <!-- 其他内容 -->
      <div class="title">我有很多选择很多选择很多选择15</div>
    </div>
    <div class="down" @click="toggleExpand">
      <div class="title">
        更多
        <el-icon>
          <arrow-down />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { ref } from 'vue'
const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style lang="less" scoped>
.appcontainer {
  display: flex;

  .name {
    display: flex;
    background-color: pink;
    align-items: flex-start;
  }

  .con {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    flex: 1;
    background-color: yellow;
    align-items: flex-start;
  }

  .down {
    display: flex;
    width: 100px;
    background-color: green;
    cursor: pointer;
    align-items: flex-start;
  }
}
.title {
  margin: 10px 0;
  display: flex;
  align-items: center;
}
</style>
