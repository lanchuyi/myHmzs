import request from '@/utils/request'
/**
 * 获取一体杆列表
 * @param {page,pageSize,poleName,poleNumber,poleStatus} params,
 *  @returns
 */
export function getPolesAPI(params) {
  return request({
    url: '/pole/info/list',
    params
  })
}
/**
 * 获取关联区域下拉列表
 * @param {*}
 * @returns
 */
export function getDropListAPI(param) {
  return request({
    url: '/parking/area/dropList'
  })
}
/**
 * 查看告警记录列表
 * @param {page,pageSize,poleName,poleNumber,handleStatus}
 * @returns
 */
export function getAlarmListAPI(params) {
  return request({
    url: '/pole/warning/list',
    params
  })
}
