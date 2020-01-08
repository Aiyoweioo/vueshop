import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login/index.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home/index.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome/index.vue')

const User = () => import(/* webpackChunkName: "User_Rights_Roles" */ '@/components/User/index.vue')
const Rights = () => import(/* webpackChunkName:  "User_Rights_Roles" */ '@/components/Rights/index.vue')
const Roles = () => import(/* webpackChunkName:  "User_Rights_Roles" */ '@/components/Rights/roles.vue')

const Cate = () => import(/* webpackChunkName:  "Cate_Params" */ '@/components/Goods/Cate/index.vue')
const Params = () => import(/* webpackChunkName:  "Cate_Params" */ '@/components/Goods/Params/index.vue')

const List = () => import(/* webpackChunkName:  "List_Add" */ '@/components/Goods/List/index.vue')
const Add = () => import(/* webpackChunkName:  "List_Add" */ '@/components/Goods/Add/index.vue')

const Order = () => import(/* webpackChunkName:  "Order_Report" */ '@/components/Order/index.vue')
const Report = () => import(/* webpackChunkName:  "Order_Report" */ '@/components/Report/index.vue')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path:'/home',
      component: Home,
      children:[
        {
          path:'',
          redirect: '/welcome'
        },
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: User
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path:'/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Cate
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: List
        },
        {
          path: '/goods/add',
          component: Add
        },
        {
          path: '/orders',
          component: Order
        },
        {
          path: '/reports',
          component: Report
        }
        
      ]
    },
    
  ]
} )

//挂载路由导航守卫
router.beforeEach((to, from, next)=>{
  //to将要访问的路径
  //from路径从哪来
  //next是函数，表示放行
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router

