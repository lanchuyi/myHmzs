import request from '@/utils/request'
/**
 * @description: 楼宇详情
 * @param {id}{ mobile,password}
 * @returns
 */
export function getInquire(id) {
  return request({
    url: `/park/building/${id}`
  })
}
/**
 * @description: 楼宇列表
 * @param { pages,pageSize,name}
 * @returns
 */
export function getTenement(params) {
  return request({
    url: '/park/building',
    params
  })
}
/**
 * @description: 新增楼宇
 * @param { name,floors,area,propertyFeePrice}
 * @returns
 */
export function addUnit(data) {
  return request({
    url: '/park/building',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: '/park/building',
    method: 'put',
    data
  })
}
