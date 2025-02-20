<!-- <template>
  <div class="app-container">
    <div class="filter-container-flex">
      <!-- <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">添加</el-button> -->
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.userName"
        clearable
        placeholder="搜索用户昵称"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>用户昵称</template>
      </el-input>
      <el-select
        class="filter-item"
        clearable
        filterable
        v-model="tb.query.referrerDoctorId"
        placeholder="请选择引流医生"
        @change="actions.queryAll({ resetPage: true })">
        <el-option v-for="item in doctorTb.list" :key="item.id" :label="`${item.doctorName}`" :value="item.id!" />
      </el-select>
      <el-select
        v-if="!defaultStoreID"
        class="filter-item"
        clearable
        filterable
        v-model="tb.query.storeId"
        placeholder="请选择所属门店"
        @change="actions.queryAll({ resetPage: true })">
        <el-option v-for="item in storeTb.list" :key="item.id" :label="`${item.storeName}`" :value="item.id!" />
      </el-select>
    </div>
    <el-table v-loading="tb.listLoading" :data="tb.list" element-loading-text="Loading" border fit highlight-current-row>
      <!-- 内容 -->
      <el-table-column label="ID" align="center" width="110">
        <template #default="scope: ElTableRow<UserFamilyModel>">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" min-width="110">
        <template #default="scope: ElTableRow<UserFamilyModel>">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center" width="110">
        <template #default="scope: ElTableRow<UserFamilyModel>">
          <img :src="qiniuUrl(scope.row.headImg, [200, 200])" alt="" style="height: 66px; width: 66px; object-fit: cover; display: inline-block" />
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" width="110">
        <template #default="scope: ElTableRow<UserFamilyModel>">
          {{ scope.row.sex }}
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center" min-width="180">
        <template #default="scope: ElTableRow<UserFamilyModel>">
          {{ scope.row.idCard }}
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" min-width="110">
        <template #default="scope: ElTableRow<UserFamilyModel>">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column label="引流医生" align="center" width="110">
        <template #default="scope: ElTableRow<UserFamilyModel>">
          {{ scope.row.doctorName }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="180">
        <template #default="scope: ElTableRow<UserFamilyModel>">
          {{ scope.row.createdAt }}
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
import UserFamilyQuery, { UserFamilyModel, UserFamilyQueryParmas } from '../../api/userFamily'
import { qiniuUrl } from '@/config/qiniu'
import DoctorQuery, { DoctorModel, DoctorQueryParmas } from '@/part-tooth/api/doctor'
import StoreQuery, { StoreModel, StoreQueryParmas } from '@/part-tooth/api/store'
import { useAppStoreOutside } from '@/store/modules/app'
import { computed } from 'vue'

const appStore = useAppStoreOutside()

const defaultStoreID = computed(() => {
  return appStore.getUserInfo?.id
})

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<UserFamilyModel, UserFamilyQueryParmas, UserFamilyQuery>(new UserFamilyQuery(), {
  // 默认的搜索值
  storeId: defaultStoreID.value
})

/** 创建表格，与表格相关操作 */
const [doctorTb, doctorActions] = refTable<DoctorModel, DoctorQueryParmas, DoctorQuery>(new DoctorQuery(), {
  // 默认的搜索值
})

/** 创建表格，与表格相关操作 */
const [storeTb, storeActions] = refTable<StoreModel, StoreQueryParmas, StoreQuery>(
  new StoreQuery(),
  defaultStoreID.value
    ? undefined
    : {
        // 默认的搜索值
      }
)
</script> -->
