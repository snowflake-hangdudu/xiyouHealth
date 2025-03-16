<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <div style="display: flex; flex: 1; justify-content: flex-end">
        <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">新建健康教育内容</el-button>
      </div>
    </div>
    <el-table :data="tb.list" element-loading-text="Loading" fit highlight-current-row border align="center" style="width: 100%; overflow-x: auto">
      <!-- ID Column -->
      <el-table-column prop="id" label="ID" align="center">
        <template #default="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <!-- Title Column -->
      <el-table-column prop="title" label="标题" align="center">
        <template #default="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <!-- Content Column -->
      <el-table-column prop="content" label="内容(视频)" align="center">
        <template #default="scope">
          <el-image :src="scope.row.content" fit="cover" />
        </template>
      </el-table-column>

      <el-table-column prop="question" label="题目" align="center">
        <template #default="scope">
          {{ scope.row.question }}
        </template>
      </el-table-column>

      <el-table-column prop="answer" label="答案" align="center">
        <template #default="scope">
          {{ scope.row.answer ? '是' : '否' }}
        </template>
      </el-table-column>

      <el-table-column prop="sort" label="顺序" align="center">
        <template #default="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>

      <el-table-column prop="isBan" label="上/下架" align="center">
        <template #default="scope">
          <el-switch 
            v-model="scope.row.isBan"
           @change="changeOnline(scope.row.id)"
            :active-value="false"
            :inactive-value="true"
          ></el-switch>
        </template>
      </el-table-column>

      
      <el-table-column prop="participantInfo" label="参与人信息" align="center">
        <template #default="scope">
          <el-button @click="openDetail(scope.row)" link type="primary">查看详情</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button @click="actions.edit(scope.row)" link type="primary">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-container" v-if="tb.total">
      <el-pagination
        v-model:current-page="tb.query.pageNum"
        :page-sizes="[5, 20, 30, 50, 100, 200]"
        v-model:page-size="tb.query.pageSize"
        :total="tb.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="(v) => actions.sizeChange(v)"
        @current-change="(v) => actions.pageChange(v)" />
    </div>
  </div>
  <el-dialog v-model="tb.addDialogVisible" title="健康教育内容" width="620px" @closed="tb.isNew = false">
    <el-form
      ref="editPwdRef"
      v-if="tb.addDialogVisible"
      :disabled="tb.submitLoading"
      :model="tb.row"
     
      label-position="left"
      label-width="100px"
      style="width: 400px; margin-left: 50px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="tb.row.title" clearable placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="内容(视频)" prop="content">
        <Sin v-model="tb.row.content" folderType="video" />
      </el-form-item>

      <el-form-item label="题目" prop="question">
        <el-input v-model="tb.row.question" placeholder="请输入题目"></el-input>
      </el-form-item>

      <el-form-item label="答案" prop="answer">
        <el-switch 
          v-model="tb.row.answer"
        />
      </el-form-item>

      <el-form-item label="顺序" prop="sort">
        <el-input-number v-model="tb.row.sort" :min="0" controls-position="right" />
      </el-form-item>

      <el-form-item label="上架状态" prop="isBan">
        <el-switch 
          v-model="tb.row.isBan"
          :active-value="false"
          :inactive-value="true"
      
        />
      </el-form-item>
    </el-form>

    <template #footer class="dialog-footer">
      <el-button
        type="primary"
        :loading="tb.submitLoading"
        @click="
        
            actions.submit()
     
        ">
        提交
      </el-button>
    </template>
  </el-dialog>
   <!-- 详情弹窗 -->
   <Detail ref="detailRef" @close="actions.queryAll()" />
</template>

<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { ref } from 'vue'
import Detail from './detail.vue'
import { Plus } from '@element-plus/icons-vue'
import HealthContentQuery, { 
  HealthContentModel, 
  HealthContentQueryParams 
} from '../api/healthContent' // 确保路径正确
import { qiniuUrl, qiniuTokenUrl, qiniuUploadUrl } from '@/config/qiniu'
import type { FormInstance } from 'element-plus'
import Sin from '@/widget/upload-qiniu/index.vue'
import { useValidate } from '@/hooks/web/useValidate'
import { ElMessage } from 'element-plus'
import http from '@/config/axios'

const { request } = http

const [editPwdRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())

/** Create table and related operations */
const [tb, actions] = refTable<HealthContentModel, HealthContentQueryParams, HealthContentQuery>(
  new HealthContentQuery(), 
  {}
)

// 模拟数据调整字段
tb.list = [
  {
    id: 1,
    title: '健康教育内容1',
    content: '',
    isBan: false,
    question: '你今天锻炼了吗',
    answer: true,
    sort: 1,
    createdAt: '2024-01-01 12:00:00'
  },
  {
    id: 2,
    title: '健康教育内容2',
    content: '',
    isBan: true,
    question: '你今天运动了吗',
    answer: false,
    sort: 2,
    createdAt: '2024-02-02 13:00:00'
  }
]

const changeOnline = async(id) => {
 await request({
   url: `api/admin/health/online/${id}`,
   method: 'PUT',
   data: {
     isBan: tb.row.isBan
   }
 }).then(() => {
   ElMessage.success('操作成功')
 }).catch(() => {
   ElMessage.error('操作失败')
 })

}

const detailRef = ref<any>(null)

const openDetail = (row: any) => {
  detailRef.value.showModal(row)
}
</script>