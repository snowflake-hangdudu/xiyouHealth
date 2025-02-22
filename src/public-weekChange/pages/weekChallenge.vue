<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <div style="display: flex; flex: 1; justify-remark: flex-end">
        <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">新建每周挑战</el-button>
      </div>
    </div>
    <el-table
      v-loading="tb.listLoading"
      :data="tb.list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      border
      align="center"
      style="width: 100%; overflow-x: auto">
      <el-table-column prop="id" label="ID" align="center">
        <template #default="scope: ElTableRow<LabModel>">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="每周挑战内容" align="center">
        <template #default="scope: ElTableRow<LabModel>">
          {{ scope.row.remark }}
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="顺序" align="center">
        <template #default="scope: ElTableRow<LabModel>">
          {{ scope.row.step }}
        </template>
      </el-table-column>

      <el-table-column prop="mobile" label="周挑战人员信息" align="center">
        <template #default="scope: ElTableRow<LabModel>">
          <el-button @click="openDetail(scope.row)" link type="primary">查看详情</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope: ElTableRow<LabModel>">
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
        <el-form-item label="挑战内容" prop="remark">
          <el-input type="textarea" v-model="tb.row.remark" clearable placeholder="请输入房间" :rows="4" />
        </el-form-item>

        <el-form-item label="顺序" prop="remark">
          <el-input type="number" v-model="tb.row.step" clearable placeholder="请输入顺序" />
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
import LabQuery, { LabModel, LabQueryParmas } from '../api/lab'
import http from '@/config/axios'
import ElMessage from 'element-plus'
import { FormInstance, FormRules } from 'element-plus'
const { request } = http
import { useValidate } from '@/hooks/web/useValidate'
import { onMounted } from 'vue'
const [editPwdRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<LabModel, LabQueryParmas, LabQuery>(new LabQuery(), {}, {})

const bindUserOptions = ref<any[]>([])
onMounted(() => {
  getBindUserList()
})

// 模拟数据
tb.list = [
  {
    id: 1,
    step: '第1周',
    remark: '跑步10分钟',
    participants: '张三, 李四',
    isBan: false,
    createdAt: '2025-02-19 10:00:00'
  }
]

const getBindUserList = async () => {
  const res = await request({
    url: 'api/common/select/admin/list',
    method: 'get'
  })
  bindUserOptions.value = res.data
}

const detailRef = ref(null)
const openDetail = (row: LabModel) => {
  detailRef.value.showModal(row)
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-remark: space-evenly;
  margin: 20px 0;
}
</style>
