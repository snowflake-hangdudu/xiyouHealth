export interface BatchImportModelRes {
  errorCount?: number
  orderOperateErrorInfoRes?: BatchErrorInfoModel[]
  successCount?: number
}

export interface BatchErrorInfoModel {
  errorReason?: string
  orderId?: number
  excelPosition?: string
}

export interface GlBatchErrorInfo {
  successCount?: number
  errorCount?: number
  batchErrorInfoResList?: GlbatchErrorInfoRes[]
}

export interface GlbatchErrorInfoRes {
  errorReason?: string
  id?: number
  excelPosition?: number
}
