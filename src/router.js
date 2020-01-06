import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'',
      redirect: '/login'
    },
    {
      path: '/login',
      component: ()=> import('@/components/Login/index.vue')
    },
    {
      path:'/home',
      component: ()=> import('@/components/Home/index.vue'),
      children:[
        {
          path:'',
          redirect: '/welcome'
        },
        {
          path: '/welcome',
          component: ()=> import('@/components/Welcome/index.vue')
        },
        {
          path: '/users',
          component: ()=> import('@/components/User/index.vue')
        },
        {
          path: '/rights',
          component: ()=>import('@/components/Rights/index.vue')
        },
        {
          path:'/roles',
          component: ()=>import('@/components/Rights/roles.vue')
        },
        {
          path: '/categories',
          component: ()=>import('@/components/Goods/Cate/index.vue')
        },
        {
          path: '/params',
          component: ()=>import('@/components/Goods/Params/index.vue')
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

