import request from '@/utils/request'

// 登录函数jsdoc注释，在函数的上一行写/**
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function loginAPI(data) {
  return request({
    url: '/park/login',
    method: 'POST',
    data
  })
}
export function getTenement(data) {
  return request({
    url: '/park/building',
    method: 'get',
    data
  })
}
