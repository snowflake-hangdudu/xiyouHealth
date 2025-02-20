/**
 * 计算字符串的hashCode, 以hex字符串的形式返回,
 * 本算法用于节省商品名称链接的字符长度，提升传输效率
 * 一些例子:
 * 'hello world' => 'eaefe2c4'
 * 'hello js' => '50bfe357'
 * '蓝月亮深层洁净护理洗衣液（茉莉清香）3kg' => 'a75e2931'
 **/
export function hashCode(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return (h + 0x80000000).toString(16)
}
