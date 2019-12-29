
<template>
  <div class="login_container">
      <div class="login_box">
            <div class="avatar_box">
                <!-- 头像区 -->
                <img src="@/assets/logo.png" alt="">              
            </div>
            <!-- 表单区 -->
            <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0px" class="login_form">
                <el-form-item prop="username">
                    <!-- 用户名 -->
                    <el-input v-model='loginForm.username' prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <!-- 密码 -->
                    <el-input v-model='loginForm.password' prefix-icon="iconfont icon-3702mima" type='password'></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <!-- 按钮 -->
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
      </div>
  </div>
</template>

<script>
export default {
    name: 'Login',
    data(){
        return{
            //登陆表单的数据绑定对象
            loginForm:{
                username:'admin',
                password: '123456'
            },
            //表单验证
            loginFormRules:{
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur'},
                    { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur'},
                    { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur'}
                ]
            }

            
        }
    },
    methods:{
        //点击重置登录表单
        resetLoginForm(){
           // console.log(this);//打印出$refs.loginFormRef的内容
           this.$refs.loginFormRef.resetFields();
        },
        //表单预验证
        login(){
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) return;
                const { data: res } = await this.$http.post('login', this.loginForm);
                if(res.meta.status != 200) return this.$message.error('登陆失败');
                this.$message.success('登陆成功');
                //登陆成功后将token保存到客户端的sessionStorage
                //项目除了登录之外的其他api接口，必须在登录之后才能访问
                //token只能在当前网站打开期间生效，所以在token保存在sessionStorage中
                //通过编程式导航跳转到后台主页，路由地址是/home
                console.log(res);
                window.sessionStorage.setItem('token', res.data.token);
                this.$router.push('/home');
            })
        }
    }
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height:100%;
}
.login_box{
    width:450px;
    height:300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box{
        height: 130ox;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        box-shadow: 0 0 10px #ddd;
        padding: 10px;
        position: absolute;
        left:50%;
        transform: translate(-50%, -50%);
        background-color: #fff;


        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }

    .btns{
        display: flex;
        justify-content: flex-end;
    }
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>