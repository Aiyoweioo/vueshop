<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->  
    <el-card class="cardBox">
        <el-row>
            <el-col :span="2">
                <div>
                    <el-button type="warning" @click="btnFull" >全屏显示</el-button>
                </div>
            </el-col>
        </el-row>
        <!-- echarts图表区域 -->
        <el-row>
            <div class="chartBox">
                <div id="main"></div>
            </div>
        </el-row>
    </el-card>  
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'

export default {
    name: 'Report',
    data(){
        return{
            //需要合并的数据
            options: {
                title: {
                    text: '用户来源',
                    textStyle: {
                        fontSize: 20,
                        color: '#e6a23c'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            fontSize: 16,
                            color: '#e6a23c'
                        }
                    }
                },
                legend: {
                    textStyle: {
                        fontSize: 14,
                        color: '#e6a23c'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false,
                        axisLabel: {
                            textStyle: {
                                fontSize: 14,
                                color: '#e6a23c'
                            }
                        }
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                fontSize: 14,
                                color: '#e6a23c'
                            }
                        }
                    }
                ]
            },
            // 是否全屏显示
            fullscreen: false
        }
    },
    //此时，页面上的元素已经被渲染完毕
    async mounted(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        const {data:res } = await this.$http.get('reports/type/1')
        if(res.meta.status !== 200){
            return this.$message.error('获取图表数据失败！')
        }
        // console.log(res.data)
        // 指定图表的配置项和数据
       const result = _.merge(res.data, this.options)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result)
        window.onresize = myChart.resize;
    },
    methods:{
        handleFullScreen () {
            let element = document.getElementById("main");//放大的元素，如果整个系统放大，直接赋值 document.documentElement
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen()
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen()
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen()
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen()
                } else if (element.msRequestFullscreen) {
                // IE11
                    element.msRequestFullscreen()
                }
 
            }
        this.fullscreen = !this.fullscreen;
        },
        btnFull () {
            if (!this.fullscreen) {
                this.handleFullScreen()
            }
            this.fullscreen = !this.fullscreen
        }
    } 
}
</script>

<style lang="less" scoped>
.chartBox {
    margin-top: 20px;
    width: 800px;
    height: 600px;
}

#main {
    width: 100%;
    height: 100%;
}
</style>