<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.title"
        clearable
        placeholder="请输入商品标题"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>商品标题</template>
      </el-input>

      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.points"
        clearable
        placeholder="请输入所需积分"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>所需积分</template>
      </el-input>

      <div style="display: flex; flex: 1; justify-content: flex-end">
        <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">添加商品</el-button>
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
      <el-table-column prop="id" label="ID" align="center" width="80" />

      <el-table-column prop="title" label="商品名" align="center">
        <template #default="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column prop="imageUrl" label="图片" align="center">
        <template #default="scope">
          <el-image style="width: 50px; height: 50px" :src="scope.row.imageUrl" :preview-src-list="[scope.row.imageUrl]"></el-image>
        </template>
      </el-table-column>

      <el-table-column prop="points" label="所需积分" align="center">
        <template #default="scope">
          {{ scope.row.points }}
        </template>
      </el-table-column>

      <el-table-column prop="count" label="剩余数量" align="center">
        <template #default="scope">
          {{ scope.row.count }}
        </template>
      </el-table-column>

      <el-table-column prop="isOnline" label="上/下架" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.isOnline" @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <el-button type="primary" link @click="actions.edit(scope.row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 添加/编辑商品弹窗 -->
    <el-dialog v-model="tb.addDialogVisible" :title="tb.isNew ? '添加商品' : '编辑商品'" width="620px">
      <el-form
        ref="editPwdRef"
        v-if="tb.addDialogVisible"
        :disabled="tb.submitLoading"
        :model="tb.row"
        :rules="tb.source.rules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px">
        <el-form-item label="商品名" prop="title">
          <el-input v-model="tb.row.title" clearable placeholder="请输入商品标题" />
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <el-upload class="avatar-uploader" action="/upload" :show-file-list="false" :on-success="handleUploadSuccess">
            <img v-if="tb.row.imageUrl" :src="tb.row.imageUrl" class="avatar" />
            <el-icon v-else><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="所需积分" prop="points">
          <el-input-number v-model="tb.row.points" :min="0" placeholder="" style="width: 100%" />
        </el-form-item>
        <el-form-item label="剩余数量" prop="count">
          <el-input-number v-model="tb.row.count" :min="0" placeholder="" style="width: 100%" />
        </el-form-item>
        <el-form-item label="上/下架" prop="isOnline">
          <el-switch v-model="tb.row.isOnline" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="tb.addDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="tb.submitLoading" @click="validateEditPwdSubmit(actions.submit)">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import AccountQuery, { AccountModel, AccountQueryParmas } from '../api/account'
import http from '@/config/axios'
import { FormInstance } from 'element-plus'
import { useValidate } from '@/hooks/web/useValidate'
import { ElMessage, ElMessageBox } from 'element-plus'

const { request } = http
const [editPwdRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<AccountModel, AccountQueryParmas, AccountQuery>(new AccountQuery(), {})

// 模拟数据
onMounted(() => {
  tb.list = [
    {
      id: 1,
      title: '商品1',
      imageUrl: 'https://example.com/image1.jpg',
      points: 100,
      isOnline: true,
      count: 1
    },
    {
      id: 2,
      title: '商品2',
      imageUrl: 'https://example.com/image2.jpg',
      points: 200,
      isOnline: false,
      count: 100
    },
    {
      id: 3,
      title: '商品3',
      imageUrl: 'https://example.com/image3.jpg',
      points: 300,
      isOnline: true,
      count: 1000
    }
  ]
  tb.total = tb.list.length
})

// 处理商品状态变更
const handleStatusChange = async (row: any) => {
  try {
    await request({
      url: `/api/mall/products/${row.id}/status`,
      method: 'PUT',
      data: { isOnline: row.isOnline }
    })
    ElMessage.success(`${row.isOnline ? '上架' : '下架'}成功`)
  } catch (error) {
    row.isOnline = !row.isOnline
    ElMessage.error('操作失败')
  }
}

// 处理商品删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该商品？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await request({
        url: `/api/mall/products/${row.id}`,
        method: 'DELETE'
      })
      ElMessage.success('删除成功')
      actions.queryAll()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 处理图片上传成功
const handleUploadSuccess = (response: any) => {
  tb.row.imageUrl = response.url
}
</script>

<style scoped>
.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.filter-container-flex {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
</style>
