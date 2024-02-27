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
/**
 * 获取企业列表
 * @returns
 */
export function getRentBuildListAPI() {
  return request({
    url: '/park/rent/building'
  })
}

/**
 * 给当前企业添加合同
 * @param {*} data
 * @returns
 */
export function createRentAPI(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'POST',
    data
  })
}
/**
 * 获取企业下合同列表
 * @param {*} id
 * @returns
 */
export function getRentListAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`
  })
}
/**
 * 退租
 * @param {合同id} rentId
 * @returns
 */

export function outRentAPI(rentId) {
  return request({
    url: `/park/enterprise/rent/${rentId}`,
    method: 'PUT'
  })
}
/**
 * 查看企业详情
 * @param {企业id} rentId
 * @returns
 */

export function getFirmData(id) {
  return request({
    url: `/park/enterprise/${id}`
  })
}
