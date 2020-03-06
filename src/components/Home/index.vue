<template>
        <!-- 头部区域 -->
        <el-container class="home-container">
            <el-header>
                <div>
                    <img src="/image/cat.png" alt="">
                    <span>电商管理系统</span>
                </div>
                <el-button type="info" @click="logout">退出</el-button>
            </el-header>
            <!-- 页面主体区域 -->
            <el-container>
                <!-- 侧边栏区域 -->
                <el-aside :width="isCollapse ? '64px' : '200px'">
                    <!-- 按钮实现折叠展开 -->
                    <div class="toggle-button" @click="toggleCollapse">|||</div>
                    <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" 
                    :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" 
                    :router="true" :default-active="activePath">
                        <!-- 一级菜单 index只接收字符串，不接收数值，item.id为数值-->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{ item.authName }}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" 
                        :key="subItem.id" @click="saveNavState('/' + subItem.path)"> 
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>        
                    </el-menu>
                </el-aside>
                <!-- 右侧主体内容 -->
                <el-main>
                    <!-- 路由占位符 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
</template>
<script>
export default{
    name: 'Home',
    data(){
        return{
            menuList: [],
            //一级菜单的图标
            iconObj: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju' ,
                '145': 'iconfont icon-baobiao'
            },
            //是否折叠
            isCollapse: false,
            //被激活的链接地址
            activePath: ''
        }
    },
    created(){
        this.getMenuList(),
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods:{
        logout(){
            //清空token
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        //获取所有的菜单
        async getMenuList(){
            const { data: res } = await this.$http.get('menus')
            if(res.meta.status !=200 ) return this.$message.error(res.meta.msg)
            this.menuList = res.data
            // console.log(res)
        },
        //点击按钮折叠收起菜单
        toggleCollapse(){
            this.isCollapse = !this.isCollapse
        },
        //保存连接的激活状态
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        }
    }
}

</script>
<style lang="less" scoped>
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}
.el-header img{
    width: 60px;
    height: 55px;
}
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right:0;
    }
}
.el-main{
    background-color: #eaedf1;

}
.home-container{
    height:100%;
}
.iconfont{
    margin-right: 10px;
}
.toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color:#fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>