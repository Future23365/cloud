<template>
  <div id="app">
    <Header></Header>
    <div class="app-center">
      <router-view  :musicTime="updateProdata"></router-view>
    </div>
    <Player ref="childPlayer" @updateCome="updatePro"></Player>
  </div>
  
</template>

<script>
import Header from '@/views/Header.vue'
import Player from '@/components/Player';
export default {
  name: 'app',
  data() {
    return {
    audio: {data: [{url: ''}]},
    updateProdata: '',

    }
  },
  components: {
    Header,
    Player
  },
  methods: {
    load() {
      console.log("滚动");
    },
    updatePro(time) {
      // console.log(time)
      this.updateProdata = time;
    }
  },
  mounted() {
    // console.log(this.$refs.childPlayer);
    this.$refs.childPlayer.localSet();
  }

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
   
 }

</style>