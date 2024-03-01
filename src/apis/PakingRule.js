import requst from '@/utils/request'
/**
 * 新增计费规则
 * @param {*} data
 */
export function addRuleAPI(data) {
  return requst({
    url: '/parking/rule',
    method: 'post',
    data
  })
}
