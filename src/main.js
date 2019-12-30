import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '@/assets/css/global.css'
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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
