<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->    
    <el-card>
        <el-row>
            <el-col :span="8">
                <el-input placeholder="请输入内容" 
                v-model="queryInfo.query" clearable @clear="getOrderList">
                    <el-button icon="el-icon-search" slot="append" @click="getOrderList"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <!-- 订单表格 -->
        <el-row>
            <el-table :data="orderList" border stripe :row-key="orderList.order_id">
                <el-table-column type="index" header-align="center"></el-table-column>
                <el-table-column label="订单编号" prop="order_number" header-align="center"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" header-align="center"></el-table-column>
                <el-table-column label="是否付款" header-align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
                        <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" header-align="center">
                    <template slot-scope="scope">
                    {{ scope.row.is_send}}
                    </template>
                </el-table-column>
                <el-table-column label="下单时间" header-align="center" width="120">
                    <template slot-scope="scope">
                         {{ scope.row.create_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center" :resizable="false" width="180">
                    <template>
                        <el-button icon="el-icon-edit" type="primary"
                        @click="editBox"></el-button>
                        <el-button icon="el-icon-location" type="success"
                        @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <el-row>
         <!-- 分页功能 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-row>

    </el-card>

    <!--编辑地址的对话框  -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible"
    width="50%" @close="editDialogClosed">
        <el-form :model="addressForm" :rules="addressFormRules"
        ref="addressFromRef" label-width="100px">
            <el-form-item label="省市区/县" prop="address1">
                <el-cascader :options="cityData" v-model="addressForm.address1">                    
                </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
                <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 显示物流对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressDialogVisible"
    width="50%" @close="progressDialogClosed">
        <!--时间线  -->
        <el-timeline>
            <el-timeline-item
            v-for="(item, i) in progressInfo"
            :key="i"
            :timestamp="item.time">
            {{item.context}}
            </el-timeline-item>
        </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '@/components/Order/citydata.js'
export default {
    name: 'Order',
    data(){
        return{
            //查询条件
            queryInfo:{
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            //订单总数目
            total: 0,
            //订单列表
            orderList: [],
            //控制编辑对话框的显示与隐藏
            editDialogVisible: false,
            //编辑对话框的数据对象
            addressForm:{
                address1: [],
                address2: ''
            },
            //编辑对话框的校验规则
            addressFormRules:{
                address1: [{ required: true, message:'请选择省市区县',trigger: 'blur'}],
                address2: [{ required: true, message:'请填写详细地址',trigger: 'blur'}]
            },
            //城市数据
            cityData: cityData,
            //控制物流对话框的显示与隐藏
            progressDialogVisible: false,
            //物流列表数组
            progressInfo: []
        }
       
    },
    created(){
        this.getOrderList()
    },
    methods:{
        async getOrderList(){
            const {data: res} = await this.$http.get('orders', {params: this.queryInfo})
        
            if(res.meta.status !== 200){
                return this.$message.error('请求订单数据列表失败！')
            }
            this.orderList = res.data.goods
            console.log(this.orderList)
            this.total = res.data.total
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        //点击操作的编辑按钮，展示修改地址的对话框
        editBox(){
            this.editDialogVisible = true
        },
        //监听关闭对话框的关闭事件
        editDialogClosed(){
            this.$refs.addressFromRef.resetFields()
            this.editDialogVisible = false
        },
        //点击显示物流对话框
        async showProgressBox(id){
            const {data:res} = await this.$http.get('/kuaidi/1106975712662')
            
            if(res.meta.status !== 200){
                this.$message.error('获取物流信息失败！')
            }
            console.log(res.data)
            this.progressInfo = res.data
            this.progressDialogVisible = true
        },
        //监听物流对话框的关闭事件
        progressDialogClosed(){
            this.progressDialogVisible = false
        }
        
    }
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
.el-timeline{
    text-align: left;
}
</style>