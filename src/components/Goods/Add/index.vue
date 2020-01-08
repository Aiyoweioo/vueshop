<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>  
    <!-- 卡片视图区域 -->    
    <el-card class="box-card">
        <el-alert title="添加商品信息" type="info" show-icon center>
        </el-alert>
        <!-- 步骤条 -->
        <!-- 减0的目的是因为标签页绑定的是字符串，步骤条绑定的是数字，现在都绑定同一个值，要进行转换 -->
        <el-steps  :active="activeIndex - 0 " finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <!-- 标签页 -->
        <el-form :model="addForm" :rules="AddFormRules" ref="AddFormRef" 
        label-width="100px" label-position="top">       
            <!-- el-tab-pane的父节点一定是el-tabs,因此要将el-form放在 el-tabs前-->
            <el-tabs :tab-position="'left'"  v-model="activeIndex"
            :before-leave="beforeTabLeave" @tab-click="tabClicked">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item prop="goods_name" label="商品名称">
                        <el-input v-model="addForm.goods_name">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="goods_price" label="商品价格">
                        <el-input v-model="addForm.goods_price" type="number">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="goods_number" label="商品重量">
                        <el-input v-model="addForm.goods_number"  type="number">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="goods_weight" label="商品数量">
                        <el-input v-model="addForm.goods_weight"  type="number">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="goods_cat" label="商品分类">
                        <!-- 级联选择器 -->
                        <el-cascader
                        v-model="addForm.goods_cat"
                        :options="cateList"
                        :props="cateProps"
                        @change="handleCateChange"></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <!-- 渲染表单的item项 -->
                    <el-form-item v-for="item in manyTableData" :key="item.attr_id"
                    :label="item.attr_name">
                        <!-- 多选框组 -->
                        <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox :label="item1" v-for="(item1,i) in item.attr_vals" 
                        :key="i"  border></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
                    <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <!-- 上传组件 action图片要上传的API地址-->
                    <el-upload
                    :action="uploadURL" :headers="headerObj"
                    :on-preview="handlePreview" :on-success="handleSuccess"
                    :on-remove="handleRemove"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <!-- 富文本编辑器 -->
                    <!-- bidirectional data binding（双向数据绑定） -->
                    <quill-editor v-model="addForm.goods_introduce">
                    </quill-editor>
                    <!-- 添加商品按钮 -->
                    <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
        <img :src="previewPath" alt="图片" class="previewImg" >
    </el-dialog>
  </div>
</template>

<script>

//导入深拷贝
import _ from 'lodash'

export default {
    name: 'Add',
    data(){
        return{
            //步骤条激活的和标签页激活的参数为同一个值
            activeIndex: '0',
            //添加商品的表单验证对象
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_number: 0,
                goods_weight: 0,
                //商品所属的分类数组
                goods_cat: [],
                //图片的数组
                pics: [],
                //商品详情描述
                goods_introduce: '',
                //静态属性和动态参数
                attrs:[]
            },
            //添加商品的校验规则
            AddFormRules: {
                goods_name: [{ required: true, message:'请输入商品名称',trigger: 'blur'}],
                goods_price: [{ required: true, message:'请输入商品价格',trigger: 'blur'}],
                goods_number: [{ required: true, message:'请输入商品数量',trigger: 'blur'}],
                goods_weight: [{ required: true, message:'请输入商品重量',trigger: 'blur'}],
                //商品所属的分类数组
                goods_cat: [{ required: true, message:'请选择商品分类',trigger: 'blur'}],

            },
            //商品分类列表
            cateList: [],
            //级联选择器的校验对象
            cateProps: {
                expandTrigger: 'hover',
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            //动态参数列表数组
            manyTableData: [],
            //静态属性列表数组
            onlyTableData: [],
             //上传图片URL地址
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
            //图片上传组件的headers请求头对象,因为el-upload没有使用axios
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            //预览图片的地址
            previewPath: '',
            //控制图片预览对话框的显示与隐藏
            previewDialogVisible: false
        }
    },
    created(){
        this.getCateList()
    },
    computed:{
        //三级分类
        cateId(){
            if(this.addForm.goods_cat.length === 3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    },
    methods:{
        //获取商品列表
        async getCateList(){
            const {data: res} = await this.$http.get('categories')
            if(res.meta.status !== 200){
                return this.$message.error('获取商品列表失败！')
            }
            this.cateList = res.data
            
        },
        //级联选择器选中项发生变化，会触发这个函数
        handleCateChange(){
            //console.log(this.addForm.goods_cat)
            if(this.addForm.goods_cat.length !== 3){
                this.addForm.goods_cat = []
            }
        },
        //监听标签页切换
        beforeTabLeave(activeName, oldActiveName){
            // console.log(activeName+ '将要跳转的标签页')
            // console.log(oldActiveName+ '即将离开的标签页')
            if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                this.$message.error('请先选择商品分类！')
                return false
            }
        },
        //标签页点击
        async tabClicked(){
            if(this.activeIndex === '1'){
                const {data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
                {params: {sel: 'many'}})
                if(res.meta.status !== 200){
                    return this.$message.error('获取动态参数列表失败！')
                }
                res.data.forEach(item =>{
                    item.attr_vals = (item.attr_vals.length === 0)? [] 
                    : item.attr_vals.split(' ')
                })
                this.manyTableData = res.data
                //console.log(res.data)
            }
            if(this.activeIndex === '2'){
                const {data : res } = await this.$http.get(`categories/${this.cateId}/attributes`,
                {params: {sel: 'only'}})

                 if(res.meta.status !== 200){
                    return this.$message.error('获取属性列表失败！')
                }
                this.onlyTableData = res.data
                console.log(res.data)
                
            }

            
        },
       
        //上传图片的预览效果
        handlePreview(file){
            //console.log(file)
            this.previewPath = file.response.data.url
            this.previewDialogVisible = true
        },
        //处理上传图片的删除
        handleRemove(file){
            //console.log(file)

            //1.获取将要删除的图片的临时路径
            const filePath = file.response.data.tmp_path
            //2.从pics数组中，找到该图片对应的索引值
            const i = this.addForm.pics.findIndex(x=> x.pic === filePath )
            //3.调用数组的splice方法，从pics数组中删除
            this.addForm.pics.splice(i, 1)
            //console.log(this.addForm)
        },
        //监听图片上传成功的事件
        handleSuccess(response){
            //1.拼接一个图片信息对象
            //console.log(response)
            const picInfo = { pic: response.data.tmp_path}
            //2. 将图片信息对象，push到pics数组中
            //console.log(this.addForm.pics)
            this.addForm.pics.push(picInfo)
            //console.log(this.addForm)
        },
        //添加商品
        add(){
            this.$refs.AddFormRef.validate(async valid => {
                if(!valid){
                    return this.$message.error('添加商品失败，请填写必要的表单项！')
                }
                //执行添加的业务逻辑
                //在这之前进行数据处理，提交的goods_cat要求是字符串，el-cascader绑定的要求是数组
                //因此要进行lodash cloneDeep(obj) 深拷贝
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                //处理动态参数
                this.manyTableData.forEach(item =>{
                    const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
                    this.addForm.attrs.push(newInfo)
                })
                //处理静态属性
                this.onlyTableData.forEach(item =>{
                    const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals}
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs = this.addForm.attrs
                //发起请求添加商品，商品的名称必须是唯一的
                const {data : res} = await this.$http.post('goods', form)
                if(res.meta.status !== 200){
                    this.$message.error('添加商品失败！')
                }
                this.$message.success('添加商品成功！')
                this.$router.push('/goods')
            })
        }
    }
}
</script>

<style lange="less" scoped>
.el-steps{
    margin: 15px 0;
}
.el-step__title{
    font-size: 13px;
}
.el-form{
    text-align: left;
} 
.el-checkbox{
    margin: 0 15px 0 0 !important;
}
.previewImg{
    width: 100%;
}

.btnAdd{
    margin-top: 15px;
}
</style>