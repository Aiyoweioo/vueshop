import Vue from 'vue'
import { Button, Form, FormItem, Input, Message} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//Message弹框组件只能全局挂载
Vue.prototype.$message = Message
