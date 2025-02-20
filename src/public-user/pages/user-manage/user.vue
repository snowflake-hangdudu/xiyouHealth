<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.id"
        clearable
        placeholder="请输入用户ID"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>用户ID</template>
      </el-input>

      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.phone"
        clearable
        placeholder="请输入手机号"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>手机号</template>
      </el-input>
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
      <el-table-column prop="id" label="用户ID" align="center">
        <template #default="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="用户姓名" align="center">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column prop="phone" label="用户手机号" align="center">
        <template #default="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>

      <el-table-column prop="schoolCardUrl" label="用户头像" align="center">
        <template #default="scope">
          <el-image
            :src="scope.row.schoolCardUrl ? qiniuUrl(scope.row.schoolCardUrl) : ''"
            style="aspect-ratio: 4 / 3; width: auto; border-radius: 5px"
            :preview-src-list="[scope.row.schoolCardUrl ? qiniuUrl(scope.row.schoolCardUrl) : '']"
            preview-teleported="true">
            <template #error>
              <div style="width: 100%; height: 100%; background-color: #f5f7fa; display: flex; align-items: center; justify-content: center">
                <el-icon></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column prop="hasPassword" label="是否设置密码" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.hasPassword" disabled></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="journeyStarted" label="是否开启旅程" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.journeyStarted" disabled></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="hasWeeklyChallenge" label="是否有当前周挑战资格" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.hasWeeklyChallenge" disabled></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="totalPoints" label="累计积分" align="center">
        <template #default="scope">
          {{ scope.row.totalPoints }}
        </template>
      </el-table-column>

      <el-table-column prop="totalPoints" label="累计难数" align="center">
        <template #default="scope">
          {{ scope.row.totalPoints }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button @click="openRemark(scope.row)" link type="primary">编辑</el-button>
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
        @size-change="actions.sizeChange"
        @current-change="actions.pageChange" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import refTable from '@/public/basic-table'
import UserQuery, { UserModel, UserQueryParmas } from '../../api/user'
import { qiniuUrl } from '@/config/qiniu'
import http from '@/config/axios'

const { request } = http

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<UserModel, UserQueryParmas, UserQuery>(new UserQuery(), {})

const remarkRef = ref<any>(null)

const openRemark = (row: UserModel) => {
  remarkRef.value.showModal(row)
}

// Example data for demonstration
tb.list = [
  {
    id: 1,
    name: 'John Doe',
    phone: '1234567890',
    schoolCardUrl: '',
    hasPassword: true,
    journeyStarted: true,
    hasWeeklyChallenge: false,
    totalPoints: 150
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '0987654321',
    schoolCardUrl: '',
    hasPassword: true,
    journeyStarted: false,
    hasWeeklyChallenge: true,
    totalPoints: 280
  },
  {
    id: 3,
    name: 'Alice Johnson',
    phone: '5555555555',
    schoolCardUrl: '',
    hasPassword: false,
    journeyStarted: true,
    hasWeeklyChallenge: true,
    totalPoints: 420
  },
  {
    id: 4,
    name: 'Bob Williams',
    phone: '9876543210',
    schoolCardUrl: '',
    hasPassword: true,
    journeyStarted: true,
    hasWeeklyChallenge: true,
    totalPoints: 350
  }
]

// Set total for pagination
tb.total = tb.list.length
</script>
