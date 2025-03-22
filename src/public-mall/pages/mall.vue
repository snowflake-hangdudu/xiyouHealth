<template>
  <div class="app-container">
    <!-- 筛选条件区域 -->
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <!-- 修改点1：参数名修正 -->
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.title"
        clearable
        placeholder="请输入商品标题"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>商品标题</template>
      </el-input>

      <!-- 修改点2：参数名修正为point -->
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.point"
        clearable
        placeholder="请输入所需积分"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>所需积分</template>
      </el-input>

      <div style="display: flex; flex: 1; justify-content: flex-end">
        <el-button class="filter-item" type="primary"  @click="exportExcel">导出兑换人信息</el-button>
        <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">添加商品</el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tb.list" element-loading-text="Loading" fit border>
      <!-- 修改点3：字段名对齐 -->
      <el-table-column prop="id" label="ID" width="80" align="center" />
      
      <el-table-column prop="title" label="商品名" align="center" />
      
      <el-table-column prop="img" label="图片" align="center" width="120">
        <template #default="{row}">
          <el-image 
            style="width: 50px; height: 50px" 
            :src="qiniuUrl(row.img)" 
            :preview-src-list="[qiniuUrl(row.img)]"
            preview-teleported="true"
          />
        </template>
      </el-table-column>

      <el-table-column prop="point" label="所需积分" align="center" width="120">
        <template #default="{row}">
          <el-tag type="warning">{{ row.point }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="count" label="库存" align="center" width="120" />

      <el-table-column prop="count" label="兑换人信息" align="center" width="120" >
        <template #default="{row}">
          <el-button type="text">查看</el-button>
        </template>
      </el-table-column>

      <!-- 修改点4：状态字段改为isBan -->
      <el-table-column prop="isBan" label="上/下架" align="center" width="120">
        <template #default="{row}">
          <el-switch
            v-model="row.isBan"
            :active-value="false"
            :inactive-value="true"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="180" fixed="right">
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
    <el-dialog v-model="tb.addDialogVisible" :title="tb.isNew ? '新增商品' : '编辑商品'" width="620px">
      <el-form
        ref="formRef"
        :model="tb.row"
        :rules="tb.source.rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="商品标题" prop="title">
          <el-input v-model="tb.row.title" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="商品图片" prop="img">
          <!-- 修改点5：使用统一上传组件 -->
          <Sin v-model="tb.row.img"  />
        </el-form-item>

        <el-form-item label="所需积分" prop="point">
          <el-input-number 
            v-model="tb.row.point" 
            :min="0" 
            :precision="0"
            controls-position="right" 
            label="积分"
          />
        </el-form-item>

        <el-form-item label="商品库存" prop="count">
          <el-input-number 
            v-model="tb.row.count" 
            :min="0" 
            :precision="0"
            controls-position="right"
            label="库存"
          />
        </el-form-item>

        <el-form-item label="上架状态" prop="isBan">
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
          @click="   validateEditPwdSubmit(() => {
                actions.submit()
              })"
        >
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import MallQuery, { MallModel, MallQueryParams } from '../api/mall' // 修改点6：引用修正
import { ElMessage, ElMessageBox } from 'element-plus'
import { useValidate } from '@/hooks/web/useValidate'
import { FormInstance } from 'element-plus'
import Sin from '@/widget/upload-qiniu/index.vue'
import http from '@/config/axios'
import { qiniuUrl } from '@/config/qiniu'
import exportCel from '@/utils/excel'
const { request } = http

const [formRef, validateEditPwdSubmit] = useValidate(ref<FormInstance>())

// 修改点7：初始化商品查询实例
const [tb, actions] = refTable<MallModel, MallQueryParams, MallQuery>(
  new MallQuery(),{}
)



// 修改点8：状态切换处理
const handleStatusChange = async (row: MallModel) => {
  await request({
    url: `api/admin/prod/ban/${row.id}`,
    method: 'post',
  })
  ElMessage.success('操作成功')
  actions.queryAll({ resetPage: true })
}

const exportExcel = async () => {
  // 表头配置 
let headers = [ 
  { label: '姓名', value: 'name', width: 15 }, 
  { label: '手机号', value: 'phone', width: 20 }, 
  { label: '兑换商品名称', value: 'productName', width: 25 }, 
  { label: '所需积分', value: 'points', width: 12 }, 
  { label: '兑换时间', value: 'exchangeTime', width: 18 } 
]; 
// 模拟数据 
let mockData = [ 
  { name: '张三', phone: '13800138000', productName: '保温杯', points: 500, exchangeTime: '2024-01-01' }, 
  { name: '李四', phone: '13900139000', productName: '雨伞', points: 300, exchangeTime: '2024-01-02' }, 
  { name: '王五', phone: '13700137000', productName: '充电宝', points: 800, exchangeTime: '2024-01-03' } 
]; 
exportCel('兑换信息', headers, mockData, '兑换信息');
  // await request({
  //   url: `api/admin/prod/export`,
  //   method: 'get',
  //   responseType: 'blob',
  // })
  // ElMessage.success('导出成功')
}
</script>