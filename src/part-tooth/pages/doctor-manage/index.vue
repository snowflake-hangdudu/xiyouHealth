<!-- <template>
  <div class="app-container">
    <div class="filter-container-flex">
      <el-button class="filter-item" type="primary" :icon="Plus" @click="actions.add()">添加</el-button>
    </div>
    <el-table v-loading="tb.listLoading" :data="tb.list" element-loading-text="Loading" border fit highlight-current-row>
      <!-- 内容 -->
      <el-table-column label="ID" align="center" width="110">
        <template #default="scope: ElTableRow<DoctorModel>">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center" width="100">
        <template #default="scope: ElTableRow<DoctorModel>">
          <img
            :src="qiniuUrl(scope.row.doctorHeadImg, [200, 200])"
            alt=""
            style="height: 66px; width: 66px; object-fit: cover; display: inline-block" />
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="140">
        <template #default="scope: ElTableRow<DoctorModel>">
          {{ scope.row.doctorName }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" width="140">
        <template #default="scope: ElTableRow<DoctorModel>">
          {{ scope.row.doctorTel }}
        </template>
      </el-table-column>
      <el-table-column label="个人简介" align="center">
        <template #default="scope: ElTableRow<DoctorModel>">
          {{ scope.row.introductory }}
        </template>
      </el-table-column>
      <el-table-column label="所属门店" align="center">
        <template #default="scope: ElTableRow<DoctorModel>">{{ scope.row.storeName }}</template>
      </el-table-column>
      <el-table-column label="引流码" align="center" width="120">
        <template #default="scope: ElTableRow<DoctorModel>">
          <img
            :src="qiniuUrl(scope.row.referrerUserImg, [200, 200])"
            alt=""
            style="height: 66px; width: 66px; object-fit: cover; display: inline-block" />
        </template>
      </el-table-column>
      <el-table-column label="引流码操作" align="center">
        <template #default="scope: ElTableRow<DoctorModel>">
          <el-button type="success" size="small" v-if="scope.row.referrerUserImg" @click="download(scope.row)">下载</el-button>
          <el-button
            type="warning"
            size="small"
            v-else
            @click="
              actions.act(() => tb.source.reloadQR(scope.row), {
                success: '引流码生成成功'
              })
            ">
            生成
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="scope: ElTableRow<DoctorModel>">
          {{ scope.row.createdAt }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center">
        <template #default="scope: ElTableRow<DoctorModel>">
          {{ scope.row.updatedAt }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column class-name="status-col" fixed="right" label="操作" align="center" width="120">
        <template #default="scope: ElTableRow<DoctorModel>">
          <el-button type="primary" size="small" @click="actions.edit(scope.row)">修改</el-button>
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
    <el-dialog v-model="tb.addDialogVisible" :title="actions.dialogTitle" width="620px" @closed="tb.isNew = false">
      <el-form
        v-if="tb.addDialogVisible"
        :disabled="tb.submitLoading"
        :model="tb.row"
        :rules="tb.source.rules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px">
        <el-form-item label="所属门店" prop="storeId" v-if="!defaultStoreID">
          <el-select clearable filterable v-model="tb.row.storeId" placeholder="请选择所属门店">
            <el-option v-for="item in storeTb.list" :key="item.id" :label="`${item.storeName}`" :value="item.id!" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="doctorName">
          <el-input v-model="tb.row.doctorName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="头像" prop="doctorHeadImg">
          <div>
            <Upload v-model:imageUrl="tb.row.doctorHeadImg" :h="100" :w="100" :title="`头像`" />
          </div>
        </el-form-item>
        <el-form-item label="手机号" prop="doctorTel">
          <el-input v-model="tb.row.doctorTel" placeholder="请输入联系人手机号" />
        </el-form-item>
        <el-form-item label="个人简介" prop="introductory">
          <el-input v-model="tb.row.introductory" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" placeholder="请输入个人简介" />
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button type="primary" :loading="tb.submitLoading" @click="submit()">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { Plus } from '@element-plus/icons-vue'
import DoctorQuery, { DoctorModel, DoctorQueryParmas } from '../../api/doctor'
import { qiniuUrl } from '@/config/qiniu'
import Upload from '@/widget/upload-qiniu/index.vue'
import StoreQuery, { StoreModel, StoreQueryParmas } from '@/part-tooth/api/store'
import { useAppStoreOutside } from '@/store/modules/app'
import { computed } from 'vue'
import { downloadAsFile } from '@/utils/download'

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<DoctorModel, DoctorQueryParmas, DoctorQuery>(new DoctorQuery(), {
  // 默认的搜索值
})

const appStore = useAppStoreOutside()

// const defaultStoreID = computed(() => {
//   return appStore.getUserInfo?.id
// })

/** 创建表格，与表格相关操作 */
const [storeTb, storeActions] = refTable<StoreModel, StoreQueryParmas, StoreQuery>(new StoreQuery(), {
  // 默认的搜索值
})

// function submit() {
//   if (defaultStoreID.value) tb.row.storeId = defaultStoreID.value
//   actions.submit()
// }

function download(row: DoctorModel) {
  downloadAsFile(qiniuUrl(row.referrerUserImg), `${row.doctorName}医生的引流二维码.png`)
}
</script> -->
