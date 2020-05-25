<template>
  <div id="app">
    <Header></Header>
    <div>
      <router-view v-on:setau="setaudio"></router-view>
    </div>
    <Player :seturl='audio' ></Player>
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
    setaudio(song, name) {
      this.audio = song;
      this.audio.name = name;
      // console.log(this.audio);
      // console.log(this.audio.data[0].id);
    }
  }
}
</script>

<style scoped>

</style>