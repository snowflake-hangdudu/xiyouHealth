export function validatorPrice(value: string) {
  let reg = /^-?\d+(\.\d{1,2})?$/
  return reg.test(value)
}

// 手机号校验
export function validatorTel(value = '') {
  let reg = /^1(3[0-9]|4[57]|5[0-35-9]|6[6]|7[0135678]|8[0-9]|9[89])\d{8}$/
  return reg.test(value)
}