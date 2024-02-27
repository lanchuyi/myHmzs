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
/**
 * @description: 修改楼宇
 * @param { id,name,floors,area,propertyFeePrice}
 * @returns
 */
export function editUnit(data) {
  return request({
    url: '/park/building',
    method: 'put',
    data
  })
}
/**
 * @description: 删除楼宇
 * @param { id}
 * @returns
 */
export function delUnit(id) {
  return request({
    url: `/park/building/${id}`,
    method: 'delete'
  })
}
