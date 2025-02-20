<template>
  <div class="app-container">
    <div class="filter-container-flex">
      <!-- <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">添加</el-button> -->
      <div class="filter-label">审核状态：</div>
      <el-select
        class="filter-item"
        v-model="tb.query.status"
        style="width: 180px"
        placeholder="筛选处方审核状态"
        clearable
        @change="actions.queryAll({ resetPage: true })">
        <el-option :key="1" label="待处理" :value="1" />
        <el-option :key="2" label="已同意" :value="2" />
        <el-option :key="3" label="已拒绝" :value="3" />
      </el-select>
    </div>
    <el-table v-loading="tb.listLoading" :data="tb.list" element-loading-text="Loading" border fit highlight-current-row>
      <!-- 内容 -->
      <el-table-column label="ID" align="center" width="100">
        <template #default="scope: ElTableRow<PrescriptionModel>">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="患者信息" align="left">
        <template #default="scope: ElTableRow<PrescriptionModel>">
          {{ scope.row.userName }}，{{ scope.row.userSex }}，{{ scope.row.userAge }}岁
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center">
        <template #default="scope: ElTableRow<PrescriptionModel>">
          {{ scope.row.userIdCard }}
        </template>
      </el-table-column>
      <el-table-column label="处方申请药品信息" align="center">
        <template #default="scope: ElTableRow<PrescriptionModel>">
          <div v-for="item in scope.row.prescriptionDetailsList">
            {{ `${item.drugName} * ${item.buyNum}` }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="处方申请状态" align="center">
        <template #default="scope: ElTableRow<PrescriptionModel>">
          <el-tag v-if="scope.row.status == 1" type="info">待处理</el-tag>
          <el-tag v-if="scope.row.status == 2" type="success">已同意</el-tag>
          <el-tag v-if="scope.row.status == 3" type="danger">已拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="scope: ElTableRow<PrescriptionModel>">
          {{ scope.row.createdAt }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column class-name="status-col" fixed="right" label="操作" align="center" width="120">
        <template #default="scope: ElTableRow<PrescriptionModel>">
          <!-- 暂时自动处理 -->
          <el-button type="primary" size="small" :disabled="true || scope.row.status != 1" @click="">审核</el-button>
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
  </div>
</template>
<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { Plus } from '@element-plus/icons-vue'
import PrescriptionQuery, { PrescriptionModel, PrescriptionQueryParmas } from '../../api/prescription'

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<PrescriptionModel, PrescriptionQueryParmas, PrescriptionQuery>(new PrescriptionQuery(), {
  // 默认的搜索值
})
</script>
