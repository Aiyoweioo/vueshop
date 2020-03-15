
<template>
  <div class="login_container">
      <div>
          <div class="login_box">
            <div class="avatar_box">
                <!-- 头像区 -->
                <img src="/image/cat.png" alt="">              
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
                <el-form-item prop="vertifyCode">
                    <!-- 验证码 -->
                    <div class="vertify-code">
                        <el-row :span="24">
                            <el-col :span="12">
                                <el-input v-model="loginForm.vertifyCode" auto-complete="off" placeholder="请输入验证码" size=""
                                @keyup.enter.native="login('loginForm')"></el-input>
                            </el-col>
                            <el-col :span="6" :offset="4">
                                <div class="login-code" @click="refreshCode">
                                <!--验证码组件-->
                                    <s-indentify :identifyCode="identifyCode" contentWidth=130 contentHeight=40></s-indentify>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>
                <el-form-item class="btns">
                    <!-- 按钮 -->
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
      </div>
      </div>
            
  </div>
</template>

<script>
import SIndentify from './indentify'

export default {
    name: 'Login',
    components: {
        's-indentify': SIndentify
    },
    data(){
        // 验证码自定义验证规则
        const validateVerifycode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入验证码'))
            } else if (value !== this.identifyCode) {
                // console.log('validateVerifycode:', value)
                callback(new Error('验证码不正确!'))
            } else {
                callback()
            }
        }
        return{
            //登陆表单的数据绑定对象
            loginForm:{
                username:'',
                password: '',
                vertifyCode: ''
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
                ],
                vertifyCode: [{ required: true, validator: validateVerifycode, trigger: 'blur'}]
            },
            // 提示
            notiftyObj: null,
            identifyCodes: '123456789',
            identifyCode: '' // 生成的验证码
        }
    },
    mounted () {
        // 保证页面只显示一次提示
        if (!window.sessionStorage.getItem('notifyLogin')) {
            this.webShopTip()
        }
        // 验证码初始化
        this.refreshCode()
    },
    methods:{
        //点击重置登录表单
        resetLoginForm(){
           // console.log(this);// 打印出$refs.loginFormRef的内容
           this.$refs.loginFormRef.resetFields();
        },
        //表单预验证
        login(){
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) return;
                const { data: res } = await this.$http.post('login', this.loginForm);
                if(res.meta.status != 200) return this.$message.error('登陆失败');
                this.$message.success('登陆成功');
                if (this.notifyObj) {
                    this.notifyObj.close();
                    }
                this.notifyObj = null
                //登陆成功后将token保存到客户端的sessionStorage
                //项目除了登录之外的其他api接口，必须在登录之后才能访问
                //token只能在当前网站打开期间生效，所以在token保存在sessionStorage中
                //通过编程式导航跳转到后台主页，路由地址是/home
                // console.log(res);
                window.sessionStorage.setItem('token', res.data.token);
                if (window.sessionStorage.getItem('notifyLogin' !== 'null')) {
                    window.sessionStorage.removeItem('notifyLogin')
                }
                this.$router.push('/home');
            })
        },
        // 登录提示
        webShopTip () {
            this.notifyObj = this.$notify.info({
                title: '提示',
                message: '登陆账号:admin 密码:123456',
                duration: 0
            });
            window.sessionStorage.setItem('notifyLogin',this.notifyObj.message)
        },
        randomNum (min, max) {
            return Math.floor(Math.random() * (max - min) + min)
        },
        makeCode (o, l) {
            for (let i = 0; i < l; i++) {
                this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
            }
            // console.log(this.identifyCode)
        },
        refreshCode () {
            this.identifyCode = ''
            this.makeCode(this.identifyCodes, 4)
        }
    }
}
</script>

<style lang="less" scoped>
.login_container{
    background:url(/image/login_bg.jpg)  no-repeat center center;
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
        justify-content: flex-start;
        .el-button {
            margin-right: 20px;
            vertical-align: middle;
            text-align: center;
        }
    }
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.login-code {
    margin-top: -5px;
}
</style>