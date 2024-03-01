import request from '@/utils/request'
/**
 * 获取区域列表
 * @returns
 */
export function getDriveListAPI(params) {
  return request({
    url: 'parking/area/list',
    params
  })
}
/**
 * 获取关联区域下拉列表
 * @returns
 */
export function getDropListAPI() {
  return request({
    url: '/parking/rule/dropList'

  })
}
/**
 * 提交新区域
 * @returns
 *
 */
export function getAddDriveAPI(data) {
  return request({
    url: '/parking/area',
    method: 'post',
    data

  })
}
/**
 * 编辑区域
 * @returns
 *
 */
export function EditAPI(data) {
  return request({
    url: '/parking/area',
    method: 'put',
    data

  })
}
/**
 * 删除区域
 * @returns
 *
 */
export function delAPI(id) {
  return request({
    url: `/parking/area/${id}`,
    method: 'delete'

  })
}
