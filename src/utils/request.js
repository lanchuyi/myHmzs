import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/tj',
  timeout: 15000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    store.state.user.token && (config.headers.Authorization = `Bearer ${store.state.user.token}`)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.config.method !== 'get') {
      Message.success(response.data.msg)
    }

    return response.data
  },
  error => {
    if (error?.response?.data?.msg) {
      Message.error(error.response.data.msg)
    }
    if (error.code === 'ECONNABORTED') {
      Message.error('文件过大，上传失败')
    }

    return Promise.reject(error)
  }
)

export default service
