import Vue from 'vue'

import { Button, 
        Form, 
        FormItem, 
        Input, 
        Message,
        Container,
        Header,
        Aside,
        Main,
        Menu,
        Submenu,
        MenuItem,
        Breadcrumb,
        BreadcrumbItem,
        Card,
        Row,
        Col,
        Table,
        TableColumn,
        Switch,
        Tooltip,
        Pagination,
        Dialog,
        MessageBox,
        Tag,
        Tree,
        Select,
        Option,
        Cascader,
        Alert,
        Tabs,
        TabPane,
        Step,
        Steps,
        CheckboxGroup,
        Checkbox,
        Upload,
        Notification
    } from 'element-ui'
import Timeline from '@/plugins/timeline/index.js'
import TimelineItem from '@/plugins/timeline-item/index.js'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
//Message弹框、MessageBox弹出框、Notification只能全局挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification