
<template>
  <div>
      <h2 class="welTitle">Welcome!</h2> 
    <el-row :gutter="20">
      <el-col :span="3" :offset="1"><div class="cir cirOdd" style="background-color:#65E0FF;"></div></el-col>
      <el-col :span="3"><div class="cir cirEven" style="background-color:#66E0E1;"></div></el-col>
      <el-col :span="3"><div class="cir cirOdd" style="background-color:#65E0C3;"></div></el-col>
      <el-col :span="3"><div class="cir cirEven" style="background-color:#66E0A3;"></div></el-col>
      <el-col :span="3"><div class="cir cirOdd" style="background-color:#65E085;"></div></el-col>
      <el-col :span="3"><div class="cir cirEven" style="background-color:#66E067;"></div></el-col>
    </el-row>

  </div>
</template>

<script>
export default {
    name: 'Welcome'
}
</script>

<style lang="less" scoped>
.cir {
  height:100px;
  width:100px;
  border-radius:100px;
}
.cirOdd{
  animation: cirOdd 3s linear infinite alternate;
}
.cirEven{
  animation: cirEven 3s linear infinite alternate;
}

@keyframes cirOdd{
  from{margin-top:100px}
  to{margin-top:150px}
}
@keyframes cirEven{
  from{margin-top:150px}
  to{margin-top:100px}
}
.welTitle {
  font-size: 90px;
  font-weight: 700;
  color: #00CDFF;
  margin-right: 100px;
}
</style>