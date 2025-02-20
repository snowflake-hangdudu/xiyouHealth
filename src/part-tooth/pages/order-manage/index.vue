<template>
  <div class="app-container">
    <div class="filter-container-flex">
      <div class="filter-label">药品订单状态：</div>
      <el-select
        class="filter-item"
        v-model="tb.query.status"
        style="width: 180px"
        placeholder="筛选药品订单状态"
        clearable
        @change="actions.queryAll({ resetPage: true })">
        <el-option :key="1" label="待付款" :value="1" />
        <el-option :key="2" label="已取消" :value="2" />
        <el-option :key="3" label="待发货" :value="3" />
        <el-option :key="4" label="待收货" :value="4" />
      </el-select>
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.drugOrderNo"
        clearable
        placeholder="搜索订单编号"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>订单编号</template>
      </el-input>
      <el-input
        class="filter-item"
        style="width: 320px"
        v-model="tb.query.doctorName"
        clearable
        placeholder="搜索医生名称"
        @input="actions.queryAll({ resetPage: true })">
        <template #prepend>医生名称</template>
      </el-input>
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
      <el-table-column label="ID" align="center">
        <template #default="scope: ElTableRow<OrderModel>">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="订单编号" align="center" min-width="120">
        <template #default="scope: ElTableRow<OrderModel>">
          {{ scope.row.drugOrderNo }}
        </template>
      </el-table-column>
      <el-table-column label="门店信息" align="left" min-width="160">
        <template #default="scope: ElTableRow<OrderModel>">
          {{ scope.row.storeName }}
        </template>
      </el-table-column>
      <el-table-column label="医生信息" align="center" min-width="110">
        <template #default="scope: ElTableRow<OrderModel>">
          {{ scope.row.doctorName }}
        </template>
      </el-table-column>
      <el-table-column label="药师信息" align="center" min-width="110">
        <template #default="scope: ElTableRow<OrderModel>">
          {{ scope.row.pharmacistName }}
        </template>
      </el-table-column>
      <el-table-column label="患者信息" align="center" min-width="110">
        <template #default="scope: ElTableRow<OrderModel>">{{ scope.row.userFamily?.userName }} {{ scope.row.userFamily?.sex }}</template>
      </el-table-column>
      <el-table-column label="药品信息列表" align="center" min-width="160">
        <template #default="scope: ElTableRow<OrderModel>">
          <div v-for="item in scope.row.drugOrderDetailsList">
            {{ `${item.drugName} * ${item.buyNum}` }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center">
        <template #default="scope: ElTableRow<OrderModel>">
          {{ price(scope.row.totalMoney) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="总运费" align="center">
        <template #default="scope: ElTableRow<OrderModel>">
          {{ scope.row.totalFreightMoney }}
        </template>
      </el-table-column> -->
      <el-table-column label="收货信息" align="center" min-width="220">
        <template #default="scope: ElTableRow<OrderModel>">
          <div style="font-weight: bold">{{ scope.row.consignee }} {{ scope.row.consigneeTel }}</div>
          <div>
            {{ scope.row.consigneeProvince }} {{ scope.row.consigneeCity }} {{ scope.row.consigneeArea }} {{ scope.row.consigneeDetailAddress }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="快递名称/单号" align="center" min-width="160">
        <template #default="scope: ElTableRow<OrderModel>">
          <div style="font-weight: bold">{{ scope.row.expressName }}</div>
          <div>{{ scope.row.expressNo }}</div>
        </template>
      </el-table-column>

      <el-table-column label="药品订单状态" align="center" min-width="120">
        <template #default="scope: ElTableRow<OrderModel>">
          <el-tag v-if="scope.row.status == 1" type="info">待付款</el-tag>
          <el-tag v-if="scope.row.status == 2" type="danger">已取消</el-tag>
          <el-tag v-if="scope.row.status == 3" type="warning">待发货</el-tag>
          <el-tag v-if="scope.row.status == 4" type="success">待收货</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" min-width="240">
        <template #default="scope: ElTableRow<OrderModel>">
          <div v-if="scope.row.createdAt">创建:{{ scope.row.createdAt }}</div>
          <div v-if="scope.row.payAt">支付:{{ scope.row.payAt }}</div>
          <div v-if="scope.row.deliveryAt">发货:{{ scope.row.deliveryAt }}</div>
          <div v-if="scope.row.finishAt">完成:{{ scope.row.finishAt }}</div>
          <div v-if="scope.row.cancelAt">取消:{{ scope.row.cancelAt }}</div>
          <div v-if="scope.row.expireAt">过期:{{ scope.row.expireAt }}</div>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column class-name="status-col" fixed="right" label="操作" align="center" width="120">
        <template #default="scope: ElTableRow<OrderModel>">
          <el-button type="primary" size="small" @click="actions.edit(scope.row)" :disabled="scope.row.status !== 3">发货</el-button>
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
        <el-form-item label="快递名称" prop="expressName">
          <el-input v-model="tb.row.expressName" placeholder="请输入快递名称" />
        </el-form-item>
        <el-form-item label="快递单号" prop="expressNo">
          <el-input v-model="tb.row.expressNo" placeholder="请输入快递单号" />
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button type="primary" :loading="tb.submitLoading" @click="actions.submit()">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import refTable from '@/public/basic-table'
import { Plus } from '@element-plus/icons-vue'
import OrderQuery, { OrderModel, OrderQueryParmas } from '../../api/order'
import StoreQuery, { StoreModel, StoreQueryParmas } from '@/part-tooth/api/store'
import { useAppStoreOutside } from '@/store/modules/app'
import { computed } from 'vue'

function price(p?: number) {
  return ((p ?? 0) / 100).toFixed(2)
}

const appStore = useAppStoreOutside()

const defaultStoreID = computed(() => {
  return appStore.getUserInfo?.store?.id
})

/** 创建表格，与表格相关操作 */
const [tb, actions] = refTable<OrderModel, OrderQueryParmas, OrderQuery>(new OrderQuery(), {
  // 默认的搜索值
  storeId: defaultStoreID.value
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
</script>
