<template>
  <div class="newsong">
    <el-carousel :interval="3000" 
    type="card" 
    :outoplay="true" 
    height="400px" 
    tigger="click" 
    indicator-position="none"
    style="width: 800px; margin: 0 auto;"
    >
      <el-carousel-item v-for="(item, index) in list[0]" :key="index">
        <img :src="item.picUrl" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'Newsong',
  props: ['list']
}
</script>

<style scoped>
  
  .el-carousel__item img{
    height: 400px;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
</style>