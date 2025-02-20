<template>
  <div class="app-container">
    <div class="filter-container-flex">
      <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">添加</el-button>
    </div>
    <el-table v-loading="tb.listLoading" :data="tb.list" element-loading-text="Loading" border fit highlight-current-row>
      <!-- 内容 -->

      <!-- 操作 -->
      <el-table-column class-name="status-col" fixed="right" label="操作" align="center" width="220">
        <template #default="scope: ElTableRow<AccountModel>">
          <el-button type="primary" size="small" @click="actions.edit(scope.row)">修改</el-button>
          <el-button type="danger" size="small" plain @click="actions.deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 翻页 -->
    <div class="pagination-container" v-if="tb.total">
      <el-pagination
        v-model:current-page="tb.query.pageNum"
        :page-sizes="[5, 20, 30, 50, 100, 200]"
        v-model:page-size="tb.query.pageSize"
        :total="tb.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="(v: number) => actions.sizeChange(v)"
        @current-change="(v: number) => actions.pageChange(v)" />
    </div>
    <!-- 添加/删除数据的弹窗 -->
    <el-dialog v-model="tb.addDialogVisible" :title="actions.dialogTitle" width="620px" @closed="tb.isNew = false">
      <el-form
        v-if="tb.addDialogVisible"
        :disabled="tb.submitLoading"
        :model="tb.row"
        :rules="tb.source.rules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px" />
      <template #footer class="dialog-footer">
        <el-button type="primary" :loading="tb.submitLoading" @click="actions.submit()">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { Plus } from '@element-plus/icons-vue'
import AccountQuery, { AccountModel, AccountQueryParmas } from '../../api/account'

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<AccountModel, AccountQueryParmas, AccountQuery>(new AccountQuery(), {
  // 默认的搜索值
})
</script>
