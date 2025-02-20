import { useCache } from '@/hooks/web/useCache'
import { useAppStore, useAppStoreOutside } from '@/store/modules/app'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import http from '@/config/axios'
import { delayDuration } from '@/utils/async'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
const { request } = http

export type RouteName =
  | 'Dashboard'
  | 'Analysis'
  | 'Message'
  | 'MessageCenter'
  | 'Admin'
  | 'CompanyManage'
  | 'SystemAgent'
  | 'AgentDetail'
  | 'SystemNotice'
  | 'HSYAiApps'
  | 'AiPPT'
  | 'Company'
  | 'FriendCompany'
  | 'Statistics'
  | 'CompanyData'
  | 'SalesData'
  | 'StaffData'
  | 'GoodsData'
  | 'CustomerData'
  | 'SellerFiles'
  | 'FinanceFiles'
  | 'Workbench'
  | 'CustomerCheck'
  | 'QuotedPriceCheck'
  | 'PurchaseOrderCheck'
  | 'CentralizedOrderCheck'
  | 'SupplierPayCheck'
  | 'Seller'
  | 'ImportExcel'
  | 'WechatGroupFile'
  | 'HandleAbnormal'
  | 'Batch'
  | 'CentralizedOrderAdd'
  | 'OrderAlloc'
  | 'Alloc'
  | 'ExoprtOuterOrder'
  | 'ImportOuterOrder'
  | 'CentralizedAlloc'
  | 'OrderList'
  | 'Order'
  | 'CentralizedOrder'
  | 'OrderLink'
  | 'OrderAfter'
  | 'AfterSalesDropshippingOrder'
  | 'AfterSalesCentralizedOrder'
  | 'Abnormal'
  | 'AbnormalEdit'
  | 'Supplier'
  | 'SupplierList'
  | 'SupplierDetail'
  | 'SupplierBillEdit'
  | 'SupplierPrice'
  | 'OutsideGoods'
  | 'PrivateWarehouse'
  | 'WarehouseManage'
  | 'StockManage'
  | 'AutoAlloc'
  | 'Finance'
  | 'CustomerRecharge'
  | 'SupplierPayManage'
  | 'CustomerInvoices'
  | 'SupplierInvoices'
  | 'AccountManage'
  | 'Customer'
  | 'CustomerManage'
  | 'CustomerManageDetail'
  | 'CustomerManageDetailBillEdit'
  | 'CustomerQuote'
  | 'PublicCustomer'
  | 'Goods'
  | 'GoodsManage'
  | 'GoodsEdit'
  | 'CombinedGoodsManage'
  | 'PurchaseManage'
  | 'PurchaseManageDetail'
  | 'Wechat'
  | 'WechatCustomer'
  | 'WechatSupplier'
  | 'WorkResult'
  | 'Link'
  | 'HSYXZ'
  | 'LinkWms'
  | 'HSYWMS'
  | 'Sys'
  | 'SystemService'
  | 'SystemUserManage'
  | 'DepartmentManage'
  | 'SystemRoles'
  | 'SysFinanceSetting'
  | 'SystemAtomicRoles'
  | 'EditInfo'
  | 'SysOperateLog'
  | 'SysErrLog'
  | 'SysDataVerify'
  | 'Debug'
  | 'NoticeCount'
  | 'ExcelHeader'
  | 'Address'
  | 'Icons'
  | 'Upload'
  | 'UploadMore'
  | 'Cosplay'
  | 'Printer'

/**
 * 全局的消息提示数
 * 当key与路由的name相同时，会在左侧路由栏目中显示未读数量
 */
const globalNotifyCount = reactive<Partial<Record<RouteName, number>>>({
  NoticeCount: 0
})

const rawNotifyCount = ref<Partial<NotifyDetail>>({})
export interface NotifyDetail {

}

let isLoading = false

const { wsCache } = useCache()
const appStore = useAppStoreOutside()

window['updateNotice'] = updateNoticeCenter

/// 改为随机数延迟
async function randomUpdateNoticeCenter() {
  // updateNoticeCenter()
  // var randomNext = Math.random() * 10 + 15
  // await delayDuration(randomNext * 1000)
  // randomUpdateNoticeCenter()
}

// randomUpdateNoticeCenter()

/** 初始化 */
export async function updateNoticeCenter(force?: boolean) {

}

export default globalNotifyCount
export function useNotifyCenter() {
  return globalNotifyCount
}
export function useRawNotifyCount() {
  return rawNotifyCount
}
