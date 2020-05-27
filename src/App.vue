<template>
  <div id="app">
    <Header></Header>
    <div>
      <router-view  :musicid="audio.data[0].id"></router-view>
    </div>
    <Player ref="childPlayer"></Player>
  </div>
  
</template>

<script>
import Header from './components/Header.vue'
import Player from './components/Player';
export default {
  name: 'app',
  data() {
    return {
    audio: {data: [{url: ''}]},
    }
  },
  components: {
    Header,
    Player
  },
  methods: {

  },
  mounted() {
    console.log(this.$refs.childPlayer);
    this.$refs.childPlayer.localSet();
  }
}
</script>

<style>
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
   background-color: #f6f5ec;
 }

</style>