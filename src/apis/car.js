import request from '@/utils/request'
/**
 * @description: 月卡管理函数
 * @param {page,pageSize,carNumber,personName,cardStatus}{ mobile,password}
 * @returns
 */
export function getCard(params) {
  return request({
    url: '/parking/card/list',
    params
  })
}
/**
 * @description: 月卡管理函数
 * @param {personName,phoneNumber,carNumber,carBrand,cardStartDate,cardEndDate,paymentAmount,paymentMethod}{ mobile,password}
 * @returns
 */
export function addCard(data) {
  return request({
    url: '/parking/card',
    method: 'post',
    data
  })
}
/**
 * 获取月卡详情
 * @data
 * @returns
 */
export function getCardDetailAPI(id) {
  return request({
    url: `/parking/card/detail/${id}`
  })
}

/**
 * 更新月卡
 * @param {*} data
 * @returns
 */
export function updateCardAPI(data) {
  return request({
    url: '/parking/card/edit',
    method: 'PUT',
    data
  })
}
/**
 * 删除月卡
 * @param {*} data
 * @returns
 */
export function deleteCardAPI(ids) {
  return request({
    url: `/parking/card/${ids}`,
    method: 'DELETE'
  })
}
