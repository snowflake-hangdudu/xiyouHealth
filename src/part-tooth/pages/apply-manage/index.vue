<template>
  <div class="app-container">
    <div class="filter-container-flex">
      <div class="filter-label">审核状态：</div>
      <el-select
        class="filter-item"
        v-model="tb.query.status"
        style="width: 180px"
        placeholder="筛选申请审核状态"
        clearable
        @change="actions.queryAll({ resetPage: true })">
        <el-option :key="1" label="待处理" :value="1" />
        <el-option :key="2" label="已同意" :value="2" />
        <el-option :key="3" label="已拒绝" :value="3" />
        <el-option :key="4" label="失效" :value="4" />
      </el-select>
    </div>
    <el-table v-loading="tb.listLoading" :data="tb.list" element-loading-text="Loading" border fit highlight-current-row>
      <!-- 内容 -->
      <el-table-column label="ID" align="center" width="110">
        <template #default="scope: ElTableRow<ApplyModel>">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="患者信息" align="center">
        <template #default="scope: ElTableRow<ApplyModel>">
          <div>{{ scope.row.userName }}，{{ scope.row.userSex }}，{{ scope.row.userAge }}岁</div>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center">
        <template #default="scope: ElTableRow<ApplyModel>">
          {{ scope.row.userIdCard }}
        </template>
      </el-table-column>
      <el-table-column label="申请处方" align="center">
        <template #default="scope: ElTableRow<ApplyModel>">
          <div v-for="item in scope.row.prescriptionApplyDetailsList">
            {{ `${item.drugName} * ${item.buyNum}` }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="处方申请状态" align="center" width="120">
        <template #default="scope: ElTableRow<ApplyModel>">
          <el-tag v-if="scope.row.status == 1" type="info">待处理</el-tag>
          <el-tag v-if="scope.row.status == 2" type="success">已同意</el-tag>
          <el-tag v-if="scope.row.status == 3" type="danger">已拒绝</el-tag>
          <el-tag v-if="scope.row.status == 4" type="danger">失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="scope: ElTableRow<ApplyModel>">
          {{ scope.row.createdAt }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column class-name="status-col" fixed="right" label="操作" align="center" width="180">
        <template #default="scope: ElTableRow<ApplyModel>">
          <el-button
            type="primary"
            size="small"
            :disabled="scope.row.status !== 1"
            @click="
              actions.act(async () => tb.source.review(scope.row, true), {
                title: '同意申请',
                msg: '确定要同意此申请吗？',
                action: '同意',
                success: '已同意申请'
              })
            ">
            同意
          </el-button>
          <el-button
            type="danger"
            size="small"
            :disabled="scope.row.status !== 1"
            @click="
              actions.act(async () => tb.source.review(scope.row, true), {
                type: 'error',
                title: '驳回申请',
                msg: '确定要驳回此申请吗？',
                action: '驳回',
                success: '已驳回申请'
              })
            ">
            驳回
          </el-button>
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
import ApplyQuery, { ApplyModel, ApplyQueryParmas } from '../../api/apply'

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<ApplyModel, ApplyQueryParmas, ApplyQuery>(new ApplyQuery(), {
  // 默认的搜索值
})
</script>
