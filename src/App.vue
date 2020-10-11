<template>
  <div id="app">
    <!-- 头部组件 -->
    <Header></Header>
    <!-- 主体部分 -->
    <div class="app-center">
      <!-- 结果页面缓存 -->
      <!-- <keep-alive include="result"> -->
      <router-view  :musicTime="updateProdata"></router-view>
      <!-- </keep-alive> -->
    </div>
    <!-- 播放器 -->
    <Player ref="childPlayer" @updateCome="updatePro"></Player>
  </div>
  
</template>

<script>
import Header from '@/views/Header.vue';
import Player from '@/components/Player';
export default {
  name: 'app',
  data() {
    return {
      audio: {data: [{url: ''}]}, //存播放地址
      updateProdata: '',  //存播放时间
    }
  },
  components: {
    Header,
    Player
  },
  methods: {
    //子组件事件调用函数，获取当前播放时间
    updatePro(time) {
      this.updateProdata = time;
    }
  },

}
</script>

<style lang="scss">
 * {
    margin: 0;
    padding: 0;
   font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
 }
 li {
    list-style: none;
  }
  .icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
 #app {
   background-color: #f5f5f5;
   min-width: 800px;
    .app-center {
      min-height: 100vh;
    }
    .popContainer{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      z-index: 99999999;
    }
   
 }

</style>