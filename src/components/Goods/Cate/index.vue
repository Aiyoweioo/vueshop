<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row>
            <el-col>
                <!-- 添加分类 -->
                <el-button type="primary"  class="fleft" @click="showAddCateDialog()">添加分类</el-button>
            </el-col>
        </el-row>

        <!-- 用户列表区域 -->
        <tree-table :data="cateList" :columns="columns" :selection-type="false"
        :expand-type="false" show-index index-text="#" border stripe
        :show-row-hover="false" class="treeTable">
            <!-- 是否有效 -->
            <template slot="isok" slot-scope="scope">
                <i v-if="scope.row.cat_deleted === false" 
                class="el-icon-success" style="color: lightgreen"></i>
                <i v-else class="el-icon-false" style="color: red"></i>
            </template>
            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
                <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
                <el-tag v-else type="warning" size="mini">三级</el-tag>
            </template>
            <!-- 操作 -->
            <template slot="opt" slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
            </template>
        </tree-table>
        <!-- 分页区 -->
         <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
   
   <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" 
    width="50%" @close="addCateDialogClosed">
      <!-- 添加分类表单 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef"
        label-width="100px" >
            <el-form-item label="分类名称：" >
                <el-input  v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <!-- 级联选择器 options用来指定数据源 props用来指定配置对象-->
            <el-form-item label="父级分类：" style="text-align: left">
                <el-cascader :options="parentCateList" v-model="selectedKeys"
                :props="cascaderProps" 
                @change="parentCateChanged" clearable></el-cascader>
            </el-form-item>
        </el-form>  
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改分类对话框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" 
    width="50%" @close="editCateDialogClosed">
      <!-- 编辑分类表单 -->
        <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef"
        label-width="100px" >
            <el-form-item label="分类名称：" >
                <el-input  v-model="editCateForm.cat_name"></el-input>
            </el-form-item>
        </el-form>  
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateById()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name: 'Cate',
    data(){
        return{
            //添加分类对话框的显示与隐藏
            addDialogVisible: false,
            //查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            //商品分类的数据列表，默认为空
            cateList: [],
            //总数据条数
            total: 0,
            //为tree-table指定列的定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'                
                },
                {
                    label: '是否有效',
                    //表示当前列定义模板列
                    type: 'template',
                    //表示当前列的模板列名称为isok
                    template: 'isok'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'opt'
                }
            ],
            //添加分类表单数据对象
            addCateForm: {
                //将要进行分类的父级id，默认是父级
                cat_pid: 0 ,
                //将要添加的分类名称
                cat_name: '',
                //将要添加的分类层级,默认要添加的是一级分类
                cat_level: 0
            },
            //添加分类表单验证规则对象
            addCateFormRules: {
                cat_name:[
                    {required: true, message: '请输入分类名称', trigger:'blur'}
                ]
            },
            //父级分类列表
            parentCateList: [],
            //指定级联选择器配置对象
            cascaderProps: {
                value: 'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger: 'hover',
                checkStrictly: true
            },
            //选中的父级分类的id数组
            selectedKeys: [],
            //设置添加角色的对话框label大小
            formLabelWidth: '100px',
            //修改分类对话框的显示与隐藏
            editDialogVisible: false,
            //编辑分类表单对象
            editCateForm: {},
            //编辑分类表单的验证规则对象
            editCateFormRules:{
                cat_name:[
                    {required: true, message: '请输入分类名称', trigger:'blur'}
                ]
            }
            
            

        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        //获取商品分类数据
        async getCateList(){
            const {data : res } = await this.$http.get('categories',
            { params: this.queryInfo})
            if(res.meta.status != 200){
                return this.$message.err('获取商品分类数据失败')
            }
            //console.log(res.data.result)
            this.cateList = res.data.result
            this.total = res.data.total
        },
        //监听pagesize改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        //监听pagenum发生变化
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        //点击打开添加分类对话框
        showAddCateDialog(){
            //先获取父级分类数据列表
            this.getParentCateList()
            this.addDialogVisible = true
        },
        //监听添加分类对话框关闭,重置表单数据
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_name = ''
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        //获取父级分类列表数据
        async getParentCateList(){
            const {data: res} = await this.$http.get('categories', { params:{type: 2} })
            if(res.meta.status != 200){
                return this.$message.error('获取父级分类数据失败')
            }
            this.parentCateList = res.data
            // console.log(this.parentCateList)
        
        },
        //级联选择器的父级分类列表选择项发生变化触发这个函数
        parentCateChanged(){
            //console.log(this.selectedKeys)
            //如果selectedKeys数组中的length大于0，就说明选中的是父级分类
            //反之，就说明没有选中任何父级分类
            if(this.selectedKeys.length > 0){
                //父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1]
                //为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return 
            }else{
                //父级分类的id
                this.addCateForm.cat_pid = 0
                //为当前分类的等级赋值
                this.addCateForm.cat_level = 0

            }
        },
        //点击确定按钮，添加新的分类
        addCate(){
            this.$refs.addCateFormRef.validate(async valid =>{
                if(!valid) return
                const { data: res} = await this.$http.post('categories', this.addCateForm)

                if(res.meta.status != 201){
                    return this.$message.error('添加分类失败!')
                }
                this.$message.success('添加分类成功！')
                this.getCateList()
                this.addDialogVisible = false
            
            })
        },
        //监听修改分类对话框的关闭事件
        editCateDialogClosed(){
            this.$refs.editCateFormRef.resetFields()
        },
        //点击修改分类消息
        async showEditDialog(id){
            //发起请求获取之前存在的数据
            const {data : res} = await this.$http.get('categories/' + id)
            if(res.meta.status != 200){
            return this.$message.error('查询分类信息失败！')
            }
            this.editDialogVisible = true
            // console.log(res.data)
            this.editCateForm = res.data
        },
        //根据id编辑对应的分类信息
        editCateById(){
            this.$refs.editCateFormRef.validate(async valid=>{
            if(!valid) return
            //发起修改用户信息的数据请求
            const {data: res} = await this.$http.put('categories/' + this.editCateForm.cat_id, {
                cat_name: this.editCateForm.cat_name
            })

            //请求失败错误提示
            if(res.meta.status != 200){
                return this.$message.error('更新分类信息失败')
            }
            //请求成功
            //1.关闭对话框 2.更新分类信息列表 3.提示用户更新分类信息成功
            this.editDialogVisible = false
            this.getCateList()
            this.$message.success('更新分类信息成功')
            })
        },
        //根据id删除对应的分类信息
        async removeCateById(id){
            //询问用户是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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
            
            const {data: res} = await this.$http.delete('categories/' + id)

            if(res.meta.status !== 200){
            return this.$message.error('删除分类失败！')
            }

            this.$message.success('删除分类成功！')
            this.getCateList()
            }
            

    }
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
.fleft{
    float: left;
}
.el-tag{
    margin: 7px;
}
.el-cascader{
    width: 100%;
}

.treeTable{
    margin-top: 15px;
    /deep/ .zk-table__header-cell {
        text-align:center;
        color: #909399;
    }
    /deep/ .zk-table__body-cell {
        color: #606266;
    }
}
</style>