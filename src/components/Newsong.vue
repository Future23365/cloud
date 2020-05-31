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
        <img :src="item.picUrl" alt="图片走丢了" :title="item.name" @click="goMusic(item.id)">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'Newsong',
  props: ['list'],
  methods: {
    goMusic (id) {
      let s = {};
        s.id = id;
        this.$store.commit('updateSong', s);
        this.$router.push('/music');
    }
  }
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