/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 校验车牌号
export const validaeCarNumber = (value) => {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使]{1}[A-Z]{1}[A-Z0-9]{5,6}$/.test(value)
}
// 校验中文姓名
export const validaeChineseName = (value) => {
  return /^[\u4e00-\u9fa5]{2,10}$/.test(value)
}
// 校验手机号
export const validaePhone = (value) => {
  return /^1[3456789]\d{9}$/.test(value)
}
// 校验中文或者英文
export const validaeChineseOrEnglish = (value) => {
  return /^([\u4e00-\u9fa5]{2,20}|[a-zA-Z.\s]{2,20})$/
}
// 校验数字
export const validaeNumber = (value) => {
  return /^\d+$/.test(value)
}
