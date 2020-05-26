<template>
  <div id="app">
    <Header></Header>
    <div>
      <router-view  :musicid="audio.data[0].id"></router-view>
    </div>
    <Player ></Player>
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
    formlocal() {
      let music = JSON.parse(localStorage.getItem('music'));
      this.$store.state.songid = music[0].songid;
      this.$store.state.songurl = music[0].songurl;
      this.$store.state.songname = music[0].songname;
      
    }
  },
  mounted() {
    this.formlocal();
  }
}
</script>

<style>
 * {
   font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
 }
</style>