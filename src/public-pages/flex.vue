<template>
  <div class="app-container">
    <div>flex布局</div>

    <div class="table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="个人信息" label="Date" width="180">
          <template #default>
            <div class="info-container">
              <div class="item">
                <div class="label">介绍</div>
                <div class="content">
                  <p>我是很长的介绍我是很长的介绍我是很长的介绍我是很长的介绍我是很长的介绍</p>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Name" width="180" align="center" />
        <el-table-column prop="address" label="Address" width="180">
          <template #default>
            <div style="height: 500px; background-color: lightblue">高度撑开</div>
          </template>
        </el-table-column>
        <el-table-column prop="img" label="Address">
          <template #default>
            <div class="img-container"><img src="/src/assets/imgs/test.jpeg" style="width: 100%" /></div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
</script>

<style scoped lang="less">
.app-container {
  background-color: antiquewhite;
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  margin: 10px;
}

.info-container {
  width: 180px;
  background-color: lightblue;

  .item {
    display: flex;
    width: 100%;

    .label {
      width: 30%;
      background-color: yellow;
    }

    .content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      flex-wrap: wrap;
      flex: 1;
    }
  }
}

.img-container {
  height: 100%;
  background-color: pink;
}

.el-table_1_column_1 .el-table__cell {
  background-color: aqua;
}
</style>
