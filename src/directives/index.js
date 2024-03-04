// 放置全局指令
import Vue from 'vue'
import store from '@/store'
const adminPre = '*:*:*'
Vue.directive('auth-dir', {
// 指令所在的标签第一次插入到真实dom
  inserted(el, binding) {
    // el指令所在的标签
    // binding指令的绑定值
    // bingding.value指令的的值（v-auth-dir后面传入的回掉函数数据）
    const perms = store.state.user.profile.permissions
    if (perms.includes(adminPre)) {
      // 管里员
    } else if (!perms.includes(binding.value)) {
      el.remove()
    }
  }
})
