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
import { getsongDetail, getsongNew } from '@/request/getdata';
export default {
  name: 'Newsong',
  data() {
    return {
      list: [] //存放新歌列表
    }
  },
  methods: {
    goMusic (id) {
      let s = {};
      s.id = id;
      this.$store.commit('updateSong', s);
      this.$router.push('/music');
      // 获取歌曲的详情信息并存如播放列表
      // getsongDetail(id).then(res => {
      //   this.song = res.songs[0];
        
      //   // obj.name = res.songs[0].name;
      //   // let arr = [];
      //   // for(let i = 0; i < res.songs[0].ar.length; i++) {
      //   //   let o = {};
      //   //   o[res.songs[0].ar[i].name] = res.songs[0].ar[i].id;
      //   //   arr.push(o);
      //   // }
      //   // obj.ar = arr;
      //   // obj.al = res.songs[0].al.name;
      //   // obj.alId = res.songs[0].al.id;
      //   // obj.time = res.songs[0].dt;
      //   // this.$store.commit('updatePlaylist', obj);
      // })
      
      // 分发action使歌曲添加到播放列表
      let obj = {};
      obj.id = id;
      this.$store.dispatch('sendUpdatePlaylist', obj);
    },
    getData() {
      getsongNew().then(res => {
        this.list.push(res.result);  //获取新歌
      })
    },
  },
  created() {
    this.getData();
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