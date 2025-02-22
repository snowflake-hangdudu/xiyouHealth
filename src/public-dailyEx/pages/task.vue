<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.name"
        clearable
        placeholder="请输入任务任务标题"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>任务任务标题</template>
      </el-input>

      <div style="display: flex; flex: 1; justify-content: flex-end">
        <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">新建运动任务</el-button>
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
        <template #default="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column prop="content" label="任务内容" align="center">
        <template #default="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column prop="content" label="展示该任务人员" align="center">
        <template #default="scope">
          {{ scope.row.peopleInfo }}
        </template>
      </el-table-column>

      <el-table-column prop="participants" label="任务人员信息" align="center">
        <template #default="scope">
          <el-button @click="openDetail(scope.row)" link type="primary">查看详情</el-button>
        </template>
      </el-table-column>

      <el-table-column label="上/下架" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isBan"
            @change="
              () =>
                tb.source.edit(scope.row).then(() => {
                  ElMessage.success('修改成功')
                  actions.queryAll()
                })
            " />
        </template>
      </el-table-column>

      <el-table-column prop="createdAt" label="显示日期" align="center">
        <template #default="scope">
          {{ scope.row.createdAt }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="text" @click="() => actions.edit(scope.row)">编辑</el-button>
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
    <el-dialog v-model="tb.addDialogVisible" title="编辑任务" width="620px" @closed="tb.isNew = false">
      <el-form
        ref="editPwdRef"
        v-if="tb.addDialogVisible"
        :disabled="tb.submitLoading"
        :model="tb.row"
        :rules="tb.source.rules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px">
        <el-form-item label="任务内容" prop="content">
          <el-input v-model="tb.row.content" clearable placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="上/下架" prop="isBan">
          <el-switch v-model="tb.row.isBan" />
        </el-form-item>

        <el-form-item v-model="tb.row.userList" prop="userList" label="展示该任务人员" style="width: 100%">
          <el-select v-model="tb.row.userList" multiple clearable filterable placeholder="请选择用户">
            <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示日期" prop="expireDate" style="width: 100%">
          <el-date-picker
            v-model="tb.row.expireDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择时间"
            format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
      </el-form>

      <template #footer class="dialog-footer">
        <el-button
          type="primary"
          :loading="tb.submitLoading"
          @click="
            validateEditPwdSubmit(() => {
              actions.submit()
            })
          ">
          提交
        </el-button>
      </template>
    </el-dialog>
  </div>
  <Detail ref="detailRef" @close="actions.queryAll()" />
</template>

<script lang="ts" setup>
import Detail from '../../public-dailyEx/pages/detail.vue'
import refTable from '@/public/basic-table'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import CollegeQuery, { CollegeModel, CollegeQueryParmas } from '../api/college'
import http from '@/config/axios'
import { ElMessage } from 'element-plus'
import { FormInstance, FormRules } from 'element-plus'
import { useValidate } from '@/hooks/web/useValidate'

const [editPwdRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())
const { request } = http

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<CollegeModel, CollegeQueryParmas, CollegeQuery>(new CollegeQuery(), {})

// 模拟数据
tb.list = [
  {
    id: 1,
    name: '运动任务1',
    content: '跑步10分钟随机拍照',
    participants: '张三, 李四',
    isBan: false,
    createdAt: '2025-02-19 10:00:00',
    peopleInfo: '张三, 李四'
  },
  {
    id: 2,
    name: '运动任务2',
    content: '跑步20分钟随机拍照',
    participants: '王五, 赵六',
    isBan: true,
    createdAt: '2025-02-18 09:30:00',
    peopleInfo: '王五, 赵六'
  },
  {
    id: 3,
    name: '运动任务3',
    content: '跑步30分钟随机拍照',
    participants: '刘七, 陈八',
    isBan: false,
    createdAt: '2025-02-17 14:15:00',
    peopleInfo: '刘七, 陈八'
  }
]

const userOptions = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' },
  { id: 5, name: '刘七' },
  { id: 6, name: '陈八' }
]

const detailRef = ref<any>(null)

const openDetail = (row: any) => {
  detailRef.value.showModal(row)
}
</script>
