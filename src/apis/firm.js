import request from '@/utils/request'
/**
 * @description: 企业列表
 * @param {name,page,pageSize}
 * @returns
 */
export function getFirmList(params) {
  return request({
    url: '/park/enterprise',
    params
  })
}
/**
 * @description: 行业列表
 * @param {}
 * @returns
 */
export function getProfessionLits() {
  return request({
    url: '/park/industry'
  })
}
/**
 * @description: 添加企业
 * @param {name,legalPerson,registeredAddress,industryCode,businessLicenseUrl,businessLicenseId,contact,contactNumber}
 * @returns
 */
export function addFirm(data) {
  return request({
    url: '/park/enterprise',
    method: 'post',
    data
  })
}
/**
 * 上传营业执照
 * @returns
 */
export function uploadAPI(data) {
  return request({
    url: '/upload',
    method: 'POST',
    data
  })
}
