export function showAddress(params?: {
  consigneeDetailAddress?: string
  consigneeArea?: string
  consigneeCity?: string
  consigneeProvince?: string
}) {
  return (params?.consigneeProvince ?? '') + (params?.consigneeCity ?? '') + (params?.consigneeArea ?? '') + (params?.consigneeDetailAddress ?? '')
}
