<template>
  <div class="app-container">
    <div class="filter-container-flex" style="flex-wrap: wrap">
      <el-input class="filter-item" style="width: 320px" v-model="tb.query.name" clearable placeholder="请输入用户姓名"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>用户姓名</template>
      </el-input>

      <el-input class="filter-item" style="width: 320px" v-model="tb.query.phone" clearable placeholder="请输入手机号"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>手机号</template>
      </el-input>

      
    </div>
    <el-table :data="tb.list" element-loading-text="Loading" fit highlight-current-row border align="center"
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

      <el-table-column prop="avatar" label="用户头像" align="center">
        <!-- 修改为 avatar，与 UserModel 对应 -->
        <template #default="scope">
          <el-image :src="scope.row.avatar ? qiniuUrl(scope.row.avatar) : ''"
            style="aspect-ratio: 4 / 3; width: auto; border-radius: 5px"
            :preview-src-list="[scope.row.avatar ? qiniuUrl(scope.row.avatar) : '']" preview-teleported="true">
            <template #error>
              <div
                style="width: 100%; height: 100%; background-color: #f5f7fa; display: flex; align-items: center; justify-content: center">
                <el-icon></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column prop="password" label="是否设置密码" align="center">
        <!-- 修改为 password 判断是否设置密码 -->
        <template #default="scope">
          <el-switch v-model="scope.row.password" disabled></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="isTeam" label="是否已组队" align="center">
        <!-- 修改为 isTeam，与 UserModel 对应 -->
        <template #default="scope">
          <el-switch v-model="scope.row.isTeam" disabled></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="isJourney" label="是否开启旅程" align="center">
        <!-- 修改为 isJourney，与 UserModel 对应 -->
        <template #default="scope">
          <el-switch v-model="scope.row.isJourney" disabled></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="isUnlockTask" label="是否解锁当日任务内容" align="center">
        <!-- 修改为 isUnlockTask，与 UserModel 对应 -->
        <template #default="scope">
          <el-switch v-model="scope.row.isUnlockTask" disabled></el-switch>
        </template>
      </el-table-column>

   

      <el-table-column prop="isShowVideo" label="是否展示运动任务" align="center">
        <!-- 修改为 isShowVideo，与 UserModel 对应 -->
        <template #default="scope">
          <el-switch v-model="scope.row.isShowVideo" disabled></el-switch>
        </template>
      </el-table-column>


      <el-table-column prop="totalPoint" label="累计积分" align="center">
        <!-- 修改为 totalPoint，与 UserModel 对应 -->
        <template #default="scope">
          {{ scope.row.totalPoint }}
        </template>
      </el-table-column>

      <el-table-column prop="totalCheckPoint" label="累计难数" align="center">
        <!-- 修改为 totalCheckPoint，与 UserModel 对应 -->
        <template #default="scope">
          {{ scope.row.totalCheckPoint }}
        </template>
      </el-table-column>

      <el-table-column prop="isShowVideo" label="是否展示健康教育视频" align="center">
        <!-- 修改为 isShowVideo，与 UserModel 对应 -->
        <template #default="scope">
          <el-switch v-model="scope.row.isShowVideo" @change="isShow(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button @click="openGroup(scope.row)" link type="primary">组队</el-button>
          <el-button @click="openGroup(scope.row)" link type="primary">绑定任务</el-button>
          <el-button @click="openGroup(scope.row)" link type="primary">发送消息</el-button>
         

         
        </template>
      </el-table-column>
    </el-table>

    <!-- 翻页 -->
    <div class="pagination-container" v-if="tb.total">
      <el-pagination v-model:current-page="tb.query.pageNum" :page-sizes="[5, 20, 30, 50, 100, 200]"
        v-model:page-size="tb.query.pageSize" :total="tb.total" background
        layout="total, sizes, prev, pager, next, jumper" @size-change="actions.sizeChange"
        @current-change="actions.pageChange" />
    </div>
  </div>
  <!-- 备注弹窗 -->
  <Group ref="groupRef" @close="actions.queryAll()" />
  <!-- 任务关联弹窗 -->
  <Task ref="taskRef" @close="actions.queryAll()" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import Group from './group.vue'
import Task from './task.vue'

import refTable from '@/public/basic-table'
import UserQuery, { UserModel, UserQueryParams } from '../../api/user' // 修改为 UserQueryParams
import { qiniuUrl } from '@/config/qiniu'
import http from '@/config/axios'

const { request } = http

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<UserModel, UserQueryParams, UserQuery>(new UserQuery(), {})

// 五条模拟数据
const mockData = [
  {
    id: 2,
    name: 'Jane Smith',
    phone: '2345678901',
    avatar: '',
    password: 'abcdef',
    isTeam: true,
    isJourney: false,
    isUnlockTask: true,
    isShowVideo: false,
    isChallenge: true,
    totalPoint: 200,
    totalCheckPoint: 90
  },
  {
    id: 3,
    name: 'Bob Johnson',
    phone: '3456789012',
    avatar: '',
    password: null,
    isTeam: false,
    isJourney: false,
    isUnlockTask: false,
    isShowVideo: true,
    isChallenge: false,
    totalPoint: 120,
    totalCheckPoint: 70
  },
  {
    id: 4,
    name: 'Alice Brown',
    phone: '4567890123',
    avatar: '',
    password: '123abc',
    isTeam: true,
    isJourney: true,
    isUnlockTask: true,
    isShowVideo: false,
    isChallenge: true,
    totalPoint: 250,
    totalCheckPoint: 100
  },
  {
    id: 5,
    name: 'Charlie Green',
    phone: '5678901234',
    avatar: '',
    password: null,
    isTeam: false,
    isJourney: false,
    isUnlockTask: false,
    isShowVideo: true,
    isChallenge: false,
    totalPoint: 90,
    totalCheckPoint: 60
  },
  {
    id: 6,
    name: 'Eve Black',
    phone: '6789012345',
    avatar: '',
    password: 'abc123',
    isTeam: true,
    isJourney: true,
    isUnlockTask: true,
    isShowVideo: false,
    isChallenge: true,
    totalPoint: 300,
    totalCheckPoint: 110
  }
]

// 将模拟数据添加到 tb.list  中
tb.list = tb.list.concat(mockData)

const groupRef = ref<any>(null)
const taskRef = ref<any>(null)

const isShow =async (row) => {
  await request({
    url: `api/admin/user/video/${row.id}`,
    method: 'post',
  }).then((res) => {
    ElMessage.success('操作成功')
    actions.queryAll()
  }).catch((err) => {
    ElMessage.error('操作失败')
  })
}

const openGroup = (row: UserModel) => {
  groupRef.value.showModal(row)
}

const openTask = (row: UserModel) => {
  taskRef.value.showModal(row)
}
</script>
