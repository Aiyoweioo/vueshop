import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '@/assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
//配置请求的根路径
import axios from 'axios'
Vue.config.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
//axios添加拦截器
axios.interceptors.request.use(config =>{
  //console.log(config)
  //为请求头对象，添加Token验证的Authoritarian字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
//注册树形表格组件
Vue.component('tree-table', TreeTable)
//全局注册一个格式化时间过滤器
Vue.filter('dateFormat', function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
