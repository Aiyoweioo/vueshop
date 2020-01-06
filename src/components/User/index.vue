<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->    
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
     
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
          v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="adddDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <!-- 定义作用域插槽，通过slot-scope接收当前的数据，然后在v-model绑定对应的属性值 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改button -->
            <el-button type="primary" icon="el-icon-edit" size="mini" 
            @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除button -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色button :enterable="false"作用是为了提示不阻挡上面的button，让鼠标不进入tooltip里-->
            <el-tooltip effect="dark" content="分配角色" placement="top" 
            :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"
              @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
    </el-table>
      <!--分页区域  -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="adddDialogVisible" 
    width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
      label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>     
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
      <el-button @click="adddDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUsers()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible"
    width="50%" @close="editDialogClosed">
    <!-- 修改用户表单主体区域 -->
     <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
      label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>     
      </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
    </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible"
      width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户： {{ userInfo.username }}</p>
        <p>当前的角色： {{ userInfo.role_name }}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { log } from 'util'
export default {
    name: 'User',
    data(){
      //验证邮箱的规则
        var checkEmail =(rule, value,callback) =>{
          const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
          if(resEmail.test(value)){
            //合法的邮箱
            return cb
          }
          cd(new Error('请输入合法的邮箱'))
        }
        //验证手机号的规则
        var checkMobile = (rule, value, callback) =>{
          const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
          if(regMobile.test(value)){
            //合法的邮箱
            return cb
          }
          cd(new Error('请输入合法的手机号'))
        }
      return{
        //获取用户列表的参数
        queryInfo:{
          query: '',
          //当前的页数
          pagenum: 1,
          //当前每页显示多少条数据
          pagesize: 2
        },
        userList: [],
        //总数据条数
        total: 0,
        //控制添加用户对话框的显示与隐藏
        adddDialogVisible: false,
        //添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email:'',
          mobile:''
        },
        //添加表单的验证规则
        addFormRules: {
          username: [
            { required: true, message:'请输入用户名',trigger: 'blur'},
            { min: 3, max: 10, message: '用户名长度在3~10个字符', trigger: 'blur'}
          ],
          password: [
            { required: true, message:'请输入用户密码',trigger: 'blur'},
            { min: 6, max: 15, message: '用户名长度在6~15个字符', trigger: 'blur'}
          ],
          email: [
            { required: true, message:'请输入用户邮箱',trigger: 'blur'},
            { vaditor: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            { required: true, message:'请输入用户手机',trigger: 'blur'},
            { vaditor: checkMobile, trigger: 'blur'}
          ]
        },
        //控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        //查询到的用户信息对象
        editForm: {},
        //修改表单的验证规则对象
        editFormRules: {
          email: [
            { required: true, message:'请输入邮箱',trigger: 'blur'},
            { vaditor: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            { required: true, message:'请输入手机',trigger: 'blur'},
            { vaditor: checkMobile, trigger: 'blur'}
          ]
        },
        //控制分配角色对话框的显示与隐藏
        setRoleDialogVisible: false,
        //需要被分配角色的用户信息
        userInfo: {},
        //所有角色的数据列表
        rolesList: [],
        //已选中的角色id值
        selectedRoleId: ''

        
      }
    },
    created(){
      this.getUserList()
    },
    methods:{
      async getUserList(){
        const {data: res} = await this.$http.get('users', {
          params: this.queryInfo 
          })
          if(res.meta.status != 200 ){
            return this.$message.error('获取用户列表失败！')
          } 
          this.userList = res.data.users
          this.total = res.data.total
        console.log(res)
      },
      //监听pagesize改变的事件
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getUserList()
      
      },
      //监听页码值改变的事件
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      //监听switch开关的状态
      async userStateChanged(userInfo){
        //console.log(userInfo)
        const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if(res.meta.msg != 200){
          //传到服务器修改状态失败，因此前端也要将状态恢复为原状态
          userInfo.mg_state != userInfo.mg_state
          return this.$message.error('更新用户状态失败！')
        }
        this.$message.success('更新用户状态成功！')
      },
      //监听添加用户对话框的关闭事件
      addDialogClosed(){
        this.$refs.addFormRef.resetFields()
      },
      //点击按钮添加新用户
      addUsers(){
        this.$refs.addFormRef.validate(async valid =>{
          if(!valid) return
            //可以发起添加用户的网络请求
          const {data: res} =  await this.$http.post('users', this.addForm)
          
          if(res.meta.status != 201){
            this.$message.error('添加用户失败！')
          }
          this.$message.success('添加用户成功！')
          //隐藏添加用户的对话框
          this.adddDialogVisible = false
          //重新获取用户列表数据
          this.getUserList()
        })
      },
      //点击修改用户信息
      async showEditDialog(id){
        //发起请求获取之前存在的数据
        const {data : res} = await this.$http.get('users/' + id)
        if(res.meta.status != 200){
          return this.$message.error('查询用户信息失败！')
        }
        this.editDialogVisible = true
        this.editForm = res.data
      },
      //监听修改用户对话框的关闭事件
      editDialogClosed(){
        this.$refs.editFormRef.resetFields()
      },
      //修改用户信息并提交
      editUserInfo(){
        this.$refs.editFormRef.validate(async valid=>{
          if(!valid) return
          //发起修改用户信息的数据请求
          const {data: res} = await this.$http.put('users/' + this.editForm.id, {
            email: this.editForm.email, 
            mobile: this.editForm.mobile
          })

          //请求失败错误提示
          if(res.meta.status != 200){
            return this.$message.error('更新用户信息失败')
          }
          //请求成功
          //1.关闭对话框 2.更新用户信息列表 3.提示用户更新信息成功
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('更新用户信息成功')
        })
      },
      //根据Id删除对应的用户信息
      async removeUserById(id){
        //询问用户是否删除数据
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        //如果用户确认删除，则返回值为字符串 confirm
        //console.log(confirmResult)
        //如果用户取消删除，则返回值为字符串 cancel
        //console.log(confirmResult)
        if(confirmResult !== 'confirm'){
          return this.$message.info('已取消删除')
        }
        
        const {data: res} = await this.$http.delete('users/' + id)

        if(res.meta.status !== 200){
          return this.$message.error('删除用户失败！')
        }

        this.$message.success('删除用户成功！')
        this.getUserList()
      },
      //展示分配角色的对话框
      async setRole(userInfo){
        this.userInfo = userInfo
        //在展示对话框之前，获取所有的角色列表
        const {data: res} = await this.$http.get('roles')
        if(res.meta.status !==200){
          return this.$message.error('获取角色列表失败！')
        }
        this.rolesList = res.data
        this.setRoleDialogVisible = true
      },
      //点击确定按钮，分配角色
      async saveRoleInfo(){
        if(!this.selectedRoleId){
          return this.$message.error('请选择要分配的角色！')
        }
        const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`,
        {rid: this.selectedRoleId})

        if(res.meta.status !== 200){
          return this.$message.error('更新用户角色失败！')
        }
        this.$message.success('更新用户角色成功！')
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      //监听分配角色对话框的关闭事件
      setRoleDialogClosed(){
        this.selectedRoleId = ''
        this.userInfo = {}
      }
    }
}
</script>

<style scoped>

.el-dialog p{
 text-align: left
}

</style>