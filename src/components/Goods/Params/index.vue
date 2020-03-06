<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->    
    <el-card class="box-card">
        <!-- 头部警告区域 -->
        <el-alert title="注意： 只允许为第三级分类设置相关参数！" 
        type="warning" :closable="false" show-icon>
        </el-alert>
        <el-row class="cat_area">
            <el-col>
                <span>选择商品分类： </span>
                <!--  选择商品分类的级联选择框-->
                <el-cascader :options="cateList" v-model="selectedCateKeys"
                @change="handleCateChanged" :props="cateProps">
                </el-cascader>
            </el-col>
            <!-- 标签页 -->
            <el-col>
                <el-tabs v-model="activeName" @tab-click="handleCateClick">
                    <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!--添加参数按钮  -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled"
                    @click="addDialogVisible= true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" :row-key="manyTableData.attr_id">
                        <!-- 展开行-->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!--循环渲染tag标签  -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i"
                                closable @close="handleClosed(i, scope.row)">{{ item }}</el-tag>
                                <!--输入文本框  -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" header-align="center"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name" header-align="center"></el-table-column>
                        <el-table-column label="操作" header-align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                @click="showEditDialog(scope.row.attr_id)" style="margin-right:40px;">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!--添加属性按钮  -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled"
                    @click="addDialogVisible= true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData"  :row-key="onlyTableData.attr_id">
                        <!-- 展开行-->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!--循环渲染tag标签  -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i"
                                closable @close="handleClosed(i, scope.row)">{{ item }}</el-tag>
                                <!--输入文本框  -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" header-align="center"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name" header-align="center"></el-table-column>
                        <el-table-column label="操作" header-align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                @click="showEditDialog(scope.row.attr_id)" style="margin-right:40px;">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClosed" style="text-align: left">
        <!-- 添加参数表单主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
        label-width="100px">
        <el-form-item :label="labelText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改参数对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed" style="text-align: left">
        <!-- 修改参数表单主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
        label-width="100px">
        <el-form-item :label="labelText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            //商品分类数组
            cateList: [],
            //级联选择框的配置对象
            cateProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'

            },
            //级联选择框的双向绑定的数组
            selectedCateKeys: [],
            //标签页双向绑定的对象，默认是第一个页签的名称
            activeName: 'many',
            //动态参数表格数组
            manyTableData: [],
            //静态属性表格数组
            onlyTableData: [],
            //控制添加对话框的显示与隐藏
            addDialogVisible: false,
            //添加参数的表单数据对象
            addForm: {},
            //添加参数的表单验证规则
            addFormRules: {
                attr_name: [{ required: true, meesage:'请输入参数名称',trigger: 'blur'}]
            },
            //控制编辑对话框的显示与隐藏
            editDialogVisible: false,
            //编辑的表单数据对象
            editForm: {},
            //编辑表单的验证规则
            editFormRules:{
                attr_name: [{ required: true, meesage:'请输入参数名称',trigger: 'blur'}]
            }
        }
    },
    created(){
        this.getCateList()
    },
    computed:{
        //如果级联选择框没有选中，则添加参数和添加属性按钮都会被禁用
        isBtnDisabled(){
            if(this.selectedCateKeys.length !== 3){
                return true
            }
            return false
        },
        //当前选中的三级分类ID
        cateId(){
            if(this.selectedCateKeys.length === 3){
                return this.selectedCateKeys[2]
            }
            return null
        },
        //动态计算是添加动态参数对话框还是添加静态属性
        titleText(){
            if(this.activeName === "many" ){
                return "动态参数"
            }
            return "静态属性"
        },
        //动态计算表单主题区域
        labelText(){
            if(this.activeName === "many" ){
                return "动态参数"
            }
            return "静态属性"
        }
    },
    methods: {
        //获取所有的商品分类数据
        async getCateList(){
            const {data : res }= await this.$http.get('categories/')
            if(res.meta.status != 200){
                return this.$message.error('获取商品分类失败！')
            }
            //console.log(res.data)
            this.cateList = res.data
        },
        //级联选择框选中项发生变化，会触发这个函数
        handleCateChanged(){
           this.getParamsData()
        },
        //点击页签激活当前页签
        handleCateClick(){
            this.getParamsData()
            //console.log(this.activeName)
        },
        //获取参数列表数据
        async getParamsData(){
            //限制级联选择框只能选择三级分类
            if(this.selectedCateKeys.length != 3){
                this.selectedCateKeys = []
                //将表格数据清空
                this.manyTableData =[]
                this.onlyTableData = []
                return 
            }
            //证明选中的是三级分类
            //console.log(this.selectedCateKeys)
            //根据所选分类的ID，和当前所选的面板，获取对应的参数
            const {data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
            {params: {sel: this.activeName}})
            if(res.meta.status != 200){
                return this.$message.error('获取商品分类列表失败！')
            }
            // console.log(res.data)
            res.data.forEach(item =>{
                //由于新添加参数的attr_vals 为空，若不进行三元表达式判断，直接分割会出现['']，解决attr_vals为空字符串的问题 
                item.attr_vals = item.attr_vals? item.attr_vals.split(' ') : []
                //展开行中控制按钮与输入文本框的切换显示，如果只在data设置，这样会造成每个展开行都同时进行添加新标签
                item.inputVisible = false
                //展开行文本框中输入的值，分别绑定到每一行
                item.inputValue = ''

            })
            // console.log(res.data)
            if(this.activeName === "many"){
                this.manyTableData = res.data
            }else{
                this.onlyTableData = res.data
            }

        },
        //监听添加对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        //点击添加对话框确定按钮，添加参数
        addParams(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid) return
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName
                })
                
                if(res.meta.status != 201){
                    return this.$message.error(this.titleText + '失败!')
                }
                this.$message.success(this.titleText + '成功!')
                this.addDialogVisible = false
                this.getParamsData()
            })
        },
        //点击弹出修改对话框
        async showEditDialog(attrId){
            //查询当前参数的信息
            const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`,{
                params:{attr_sel: this.activeName}
            })
            if(res.meta.status !== 200){
                return this.$message.error('获取参数信息失败！')
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        //监听编辑对话框的关闭事件
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        //点击确定按钮，修改参数
        editParams(){
            this.$refs.editFormRef.validate(async valid =>{
                if(!valid) return 
                const {data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                    {attr_name: this.editForm.attr_name, attr_sel: this.activeName})
                
                if(res.meta.status !== 200){
                    return this.$message.error('修改参数失败！')
                }
                this.$message.success('修改参数成功！')
                this.getParamsData()
                this.editDialogVisible = false
            
            })
        },
        //根据id删除对应的参数
        async removeParams(attrId){
            //询问用户是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该参数 是否继续?', '提示', {
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
            
            const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)

            if(res.meta.status !== 200){
            return this.$message.error('删除参数失败！')
            }

            this.$message.success('删除参数成功！')
            this.getParamsData()
        },
        //文本框失去焦点或者按下enter键都会触发
        handleInputConfirm(row){
            //验证输入值是否为空
            if(row.inputValue.trim().length === 0){
                row.inputValue = ''
                row.inputVisible = false
                return 
            }
            //输入内容不为空，需要进行后续处理
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            //发起请求保存到数据库
            this.saveAttrVals(row)
        },
        //点击添加按钮就会切换到输入文本框
        showInput(row){
            row.inputVisible = true
            //$nextTick方法的作用是，当页面上元素被重新渲染之后，才会指定回调函数中的代码。
            //把inputVisible设置为true之后，页面还没有重新渲染，此时是不会出现input文本框的，只有重新渲染之后才会出现
            this.$nextTick(_ => {
                //让文本框自动获得焦点
            this.$refs.saveTagInput.$refs.input.focus()
        })
        },
        //对attr_vals的操作保存到数据库
        async saveAttrVals(row){
            //发起请求保存到数据库
            const {data : res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name: row.attr_name, 
                attr_sel: row.attr_sel, 
                //这里的属性值是数组，提交到客户端的是字符串
                attr_vals: row.attr_vals.join(' ')
            })
            if(res.meta.status != 200){
                this.$message.error('修改参数项失败！')
            }
            this.$message.success('修改参数项成功！')
        },
        //点击删除即可删除对应的标签
        handleClosed(i, row){
            row.attr_vals.splice(i, 1)
            //发起请求保存到数据库
            this.saveAttrVals(row)
        }
    
    }
}
</script>

<style scoped>
.cat_area{
    margin: 15px 0;
    text-align: left;
}
.el-tag{
    margin: 10px;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: center;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
      
</style>