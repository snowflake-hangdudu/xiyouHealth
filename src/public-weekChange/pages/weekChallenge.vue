<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <div style="display: flex; flex: 1; justify-content: flex-end">
        <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">新建每周挑战</el-button>
      </div>
    </div>
    <el-table :data="tb.list" element-loading-text="Loading" fit highlight-current-row border align="center" style="width: 100%; overflow-x: auto">
      <el-table-column prop="id" label="ID" align="center">
        <template #default="scope: ElTableRow<ChallengeModel>">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column prop="content" label="每周挑战内容" align="center">
        <template #default="scope: ElTableRow<ChallengeModel>">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column prop="sort" label="顺序" align="center">
        <template #default="scope: ElTableRow<ChallengeModel>">
          {{ scope.row.sort }}
        </template>
      </el-table-column>



      <el-table-column  label="周挑战人员信息" align="center">
        <template #default="scope: ElTableRow<ChallengeModel>">
          <el-button @click="openDetail(scope.row)" link type="primary">查看详情</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope: ElTableRow<ChallengeModel>">
          <el-button type="text" @click="actions.edit(scope.row)">编辑</el-button>
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
    <!-- 添加/审核数据的弹窗 -->
    <el-dialog v-model="tb.addDialogVisible" title="每周挑战" width="800px" @closed="tb.isNew = false">
      <el-form
        ref="editPwdRef"
        v-if="tb.addDialogVisible"
        :disabled="tb.submitLoading"
        :model="tb.row"
        :rules="tb.source.rules"
        label-position="left"
        label-width="110px"
        style="width: 600px; margin-left: 50px">
        <el-form-item label="挑战内容" prop="content">
          <el-input type="textarea" v-model="tb.row.content" clearable placeholder="请输入挑战内容" :rows="4" />
        </el-form-item>
        <el-form-item label="顺序" prop="sort">
          <el-input-number v-model="tb.row.sort" clearable placeholder="请输入顺序" />
        </el-form-item>

     
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="tb.submitLoading" @click="tb.addDialogVisible = false" size="large">关闭弹窗</el-button>
          <el-button
            type="primary"
            :loading="tb.submitLoading"
            size="large"
            @click="
              validateEditPwdSubmit(() => {
                actions.submit()
              })
            ">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
  <detail ref="detailRef" @change="actions.queryAll()" />
</template>
<script lang="ts" setup>
import Detail from '../../public-weekChange/pages/detail.vue'
import refTable from '@/public/basic-table'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import ChallengeQuery, { ChallengeModel, ChallengeQueryParmas } from '../api/challenge'
import http from '@/config/axios'
import ElMessage from 'element-plus'
import { FormInstance, FormRules } from 'element-plus'
const { request } = http
import { useValidate } from '@/hooks/web/useValidate'
import { onMounted } from 'vue'
const [editPwdRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<ChallengeModel, ChallengeQueryParmas, ChallengeQuery>(new ChallengeQuery())

const bindUserOptions = ref<any[]>([])
onMounted(() => {
 
})
// 模拟数据
tb.list = [
  {
    id: 1,
    sort: 1,
    content: '跑步10分钟',
    isBan: false,
    createdAt: '2025-02-19 10:00:00'
  }
]





const detailRef = ref(null)
const openDetail = (row: ChallengeModel) => {
  detailRef.value.showModal(row)
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: space-evenly;
  margin: 20px 0;
}
</style>
