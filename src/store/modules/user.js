import { loginAPI } from '@/apis/user'
import { setToken, getToken, removeToken } from '@/utils/auth'

export default {
  namespaced: true,
  state() {
    return {
      token: getToken() || '' // 获取token，如果为空，则返回空字符串，否则返回token字符串
    }
  },
  mutations: {
    setToken(state, str) {
      state.token = str
      setToken(str) // 设置token到cookie中去
    },
    delTonken(state) {
      state.token = ''
      removeToken()
    }
  },
  actions: {
    async loginAtions(store, dataobj) {
      const res = await loginAPI(dataobj)
      store.commit('setToken', res.data.token)
      console.log(res)
    }
  }
}
