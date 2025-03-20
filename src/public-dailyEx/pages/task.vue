<template>
  <div class="app-container">
    <!-- 筛选条件区域 -->
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.content"
        clearable
        placeholder="请输入任务内容"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>任务内容</template>
      </el-input>

      <el-select
        class="filter-item"
        v-model="tb.query.type"
        placeholder="任务类型"
        clearable
        style="width: 300px"
        @change="actions.queryAll({ resetPage: true })"
      >
      
        <el-option label="室外任务" value="out" />
        <el-option label="室内任务" value="in" />
      </el-select>

      <div   class="filter-item">展示明天室内任务</div>
      <el-switch
        class="filter-item"
      
        v-model="open"
        :active-value="false"
        :inactive-value="true"
        @change="changeType()"
      />

      <div style="display: flex; flex: 1; justify-content: flex-end">
        <el-button class="filter-item" type="primary"  @click="">导出完成运动任务天数</el-button>
        <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">新建运动任务</el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tb.list" element-loading-text="Loading" fit border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" align="center" />
      
      <el-table-column prop="content" label="任务内容" min-width="200" />
      
      <el-table-column prop="type" label="任务类型" width="120" align="center">
        <template #default="{row}">
          <el-tag :type="row.type === 'out' ? 'success' : 'info'">
            {{ row.type === 'out' ? '室外' : '室内' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="isBan" label="上/下架" width="120" align="center">
        <template #default="{row}">
          <el-switch
            v-model="row.isBan"
            :active-value="false"
            :inactive-value="true"
            @change="changeOnline(row)"
          />
        </template>
      </el-table-column>

      <el-table-column prop="participants" label="任务人员信息" align="center">
        <template #default="scope">
          <el-button @click="openDetail(scope.row)" link type="primary">查看详情</el-button>
        </template>
      </el-table-column>


      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{row}">
          <el-button link type="primary" @click="actions.edit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="tb.query.pageNum"
        v-model:page-size="tb.query.pageSize"
        :total="tb.total"
        :page-sizes="[5, 20, 30, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="actions.sizeChange"
        @current-change="actions.pageChange"
      />
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="tb.addDialogVisible" :title="tb.isNew ? '新建任务' : '编辑任务'" width="620px">
      <el-form
        ref="formRef"
        :model="tb.row"
        :rules="tb.source.rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="任务内容" prop="content">
          <el-input
            v-model="tb.row.content"
            placeholder="请输入任务内容"
            type="textarea"
            :rows="3"
            show-word-limit
            maxlength="500"
          />
        </el-form-item>

        <el-form-item label="任务类型" prop="type">
          <el-select v-model="tb.row.type" placeholder="请选择任务类型">
            <el-option label="室外任务" value="out" />
            <el-option label="室内任务" value="in" />
          </el-select>
        </el-form-item>

        <el-form-item label="任务状态" prop="isBan">
          <el-switch
            v-model="tb.row.isBan"
            :active-value="false"
            :inactive-value="true"
       
          />
        </el-form-item>
 
      </el-form>

      <template #footer>
        <el-button @click="tb.addDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="tb.submitLoading"
          @click="validateEditPwdSubmit(actions.submit())"
        >
          确认
        </el-button>
      </template>
    </el-dialog>
    <Detail ref="detailRef" @close="actions.queryAll()" />
  </div>
</template>

<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { ref } from 'vue'
import Detail from './detail.vue'
import { Plus } from '@element-plus/icons-vue'
import TaskQuery, { TaskModel, TaskQueryParams } from '../api/task'
import { ElMessage } from 'element-plus'
import { useValidate } from '@/hooks/web/useValidate'
import { FormInstance } from 'element-plus'
import http from '@/config/axios'


const { request } = http

const [formRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())

// 初始化表格
const [tb, actions] = refTable<TaskModel, TaskQueryParams, TaskQuery>(
  new TaskQuery(),{}

)

const open=ref(false)



const changeOnline = async (row: TaskModel) => {
  try {
    await request({
      url: `api/admin/task/online/${row.id}`,
      method: 'PUT',
  
    })
    ElMessage.success('操作成功')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const changeType = async () => {
  try {
    await request({
      url: `api/admin/task/indoor`,
      method: 'PUT',
      data: {
        open: open.value
      }
    })
    ElMessage.success('操作成功')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const detailRef = ref<any>(null)

const openDetail = (row: any) => {
  detailRef.value.showModal(row)
}
</script>