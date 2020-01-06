<template>
  <div>
      <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色区域 -->
        <el-row>
            <el-col>
                <el-button type="primary" class="fleft" @click="addDialogVisible = true">添加角色</el-button>
            </el-col>            
        </el-row>
        <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id"
                :class="['btbottom', i1 === 0? 'bdtop': '','vcenter']">
                    <!-- 渲染一级权限 -->
                    <el-col :span="5">
                        <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 渲染二级三级权限 -->
                    <el-col :span="19">
                        <el-row v-for="(item2, i2) in item1.children" :key="item2.id"
                        :class="[i2 === 0? '': 'bdtop', 'vcenter']">
                            <!-- 渲染二级权限 -->
                            <el-col :span="6">
                                <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染三级权限 -->
                            <el-col :span="13">
                                <el-tag v-for="(item3, i3) in item2.children" :key="item3.id"
                                type="warning" closable @close="removeRightById(scope.row, item3.id)">
                                    {{ item3.authName }}
                                </el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"
                @click="removeRoleDialog(scope.row)">删除</el-button>
                <el-button type="warning" icon="el-icon-setting" size="mini" 
                @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>        
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="setDialogVisible" width="50%"
    @close="setRightDialogClosed">
        <!-- 权限主体内容,为树形控件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox  node-key="id"
        default-expand-all :default-checked-keys="defKeys" ref="treeRef">
        </el-tree>
        <!-- 底部确定取消区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="setDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%"
    @close="addRightDialogClosed">
        <!-- 内容主体区 -->
        <el-form :model="addRole" :rules="addFormRoles" ref="addFormRef"
      label-width="100px">
        <el-form-item label="角色名称" prop="roleName" >
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" >
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>  
      </el-form>
        <!-- 底部确定取消区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoles()">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%"
    @close="editRightDialogClosed">
        <!-- 内容主体区 -->
        <el-form :model="editRole" :rules="editFormRoles" ref="editFormRef"
      label-width="100px">
        <el-form-item label="角色名称" prop="roleName" >
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" >
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>  
      </el-form>
        <!-- 底部确定取消区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRoleInfo()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name: 'Roles',
    data(){ 
      return{
        //角色列表
        rolesList: [],
        //控制权限分配对话框的显示与隐藏
        setDialogVisible: false,
        //所有权限的数据
        rightsList: [],
        //树形控件的属性绑定对象
        treeProps: {
            label: 'authName',
            children: 'children'
        },
        //默认选中的节点ID值数组
        defKeys: [],
        //当前即将分配权限的角色id
        roleId: '',
        //控制添加角色对话框的显示与隐藏
        addDialogVisible: false,
        //添加角色的表单数据
        addRole: {
          roleName: '',
          roleDesc: ''
        },
        //添加表单的验证规则
        addFormRoles: {
          roleName: [
            { required: true, message:'请输入角色名称',trigger: 'blur'}
          ]
        },
        //控制编辑角色对话框的显示与隐藏
        editDialogVisible: false,
        //查询得到的角色信息对象
        editRole: {},
        //编辑角色的验证规则
        editFormRoles: {
            roleName:[
                { required: true, message:'请输入角色名称',trigger: 'blur' }
            ]
        }

      }
    },
    created(){
      //获取所有的权限
      this.getRolesList()
    },
    methods:{
    async getRolesList(){
        const {data: res} = await this.$http.get('roles')
        if(res.meta.status !== 200){
            return this.$message.error('获取角色列表失败！')
        }
        this.rolesList = res.data
        },
    //根据id删除对应的权限
    async removeRightById(role, rightId){
        //弹框是否确认删除
        const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);

        if(confirmResult !== 'confirm'){
            return this.$message.info('取消删除')
        }
        //确认删除，返回权限列表
        const {data: res} = await this.$http.delete(`roles/'${role.id}/rights/${rightId}`)
        if(res.meta.msg !== 200){
            return this.$message.error('删除权限失败！')
        }
        //this.getRolesList() 这会造成权限的完整渲染，不建议此操作
        //将服务器返回的最新权限直接赋值给权限的children属性，防止列表刷新
        role.children = res.data
        this.$message.success('删除权限成功！')
    },
    //点击分配权限按钮,弹出所有权限的对话框
    async showSetRightDialog(role){
        this.roleId = role.id
        
        //获取所有权限数据
        const {data: res} = await this.$http.get('rights/tree')
        if(res.meta.status !=200){
            return this.$message.error('获取权限数据失败')
        }
        //获取到的权限数据保存到data中
        this.rightsList = res.data
        //递归获取三级节点
        this.getLeafKeys(role, this.defKeys)
        this.setDialogVisible = true
    },
    //通过递归的形式获取角色权限下所有三级权限的id,并保存到defKeys数组
    getLeafKeys(node, arr){
        //如果节点没有children属性就是三级节点
        if(!node.children){
            return arr.push(node.id)
        }
        node.children.forEach(item =>
        this.getLeafKeys(item, arr))
    },
    //监听对话框的关闭事件
    setRightDialogClosed(){
        this.defKeys = []
    },
    //勾选权限之后点击确认按钮，向服务器发起请求，为角色分配权限
    async allotRights(){
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys(),
        ]

        const idStr = keys.join(',')
        
        const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
        if(res.meta.status !== 200){
            return this.$message.error('分配角色权限失败！')
        }
        this.$message.success('分配角色权限成功！')
        this.getRolesList()
        this.setDialogVisible = false
    },
    //监听添加用户对话框的关闭事件
    addRightDialogClosed(){
    this.$refs.addFormRef.resetFields()
    },
    //点击按钮添加新用户
    addRoles(){
    this.$refs.addFormRef.validate(async valid =>{
        if(!valid) return
        //可以发起添加用户的网络请求
        const {data: res} =  await this.$http.post('roles', this.addRole)
        
        if(res.meta.status != 201){
        this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        //隐藏添加角色的对话框
        this.addDialogVisible = false
        //重新获取角色列表数据
        this.getRolesList()
    })
    },
    //点击按钮弹出编辑角色对话框
    async showEditDialog(role){
        //弹出编辑角色对话框前获取之前存在的数据
        this.roleId = role.id
        const { data: res } = await this.$http.get('roles/'+ this.roleId)
        if(res.meta.status!= 200){
            return this.$message.error('查询用户角色信息失败！')
        }
        this.editDialogVisible = true
        this.editRole = res.data
    },
    //监听修改角色对话框的关闭事件
    editRightDialogClosed(){
        this.$refs.editFormRef.resetFields()
    },
    //修改用户信息并提交
    editRoleInfo(){
        this.$refs.editFormRef.validate(async valid=>{
          if(!valid) return
          //发起修改用户信息的数据请求
          //console.log(this.editRole)
          const {data: res} = await this.$http.put('roles/' + this.editRole.roleId, {
            roleName: this.editRole.roleName, 
            roleDesc: this.editRole.roleDesc
          })

          //请求失败错误提示
          if(res.meta.status != 200){
            return this.$message.error('更新角色失败')
          }
          //请求成功
          //1.关闭对话框 2.更新角色信息列表 3.提示用户更新信息成功
          this.editDialogVisible = false
          this.getRolesList()
          this.$message.success('更新角色成功')
        })
      },
    //
    async removeRoleDialog(role){
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
        this.roleId = role.id
        const {data : res } = await this.$http.delete('roles/' + this.roleId)

        if(res.meta.status != 200){
            return this.$message.error('删除角色失败！')
        }
        this.$message.success('删除角色成功！')
        this.getRolesList()
    }
    },
    

}
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card{
  box-shadow: 0 0 1px rgba(0, 0, 0, .15) !important;
}
.el-tag{
    margin: 7px;
}
.el-table{
    margin-top: 15px;
    font-size: 12px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.btbottom{
    border-bottom: 1px solid #eee
}
.vcenter{
    align-items: center;
}
.fleft{
    float:left;
}
</style>